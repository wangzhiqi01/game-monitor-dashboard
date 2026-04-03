const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const DEFAULT_USER_DATA_DIR = path.resolve('.openclaw', 'playwright-bili-profile');
const DEFAULT_OUTPUT_DIR = path.resolve('.openclaw', 'outputs');
const CONFIG_PATH = path.resolve('config', 'bili-games.json');

function loadGames() {
  return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
}

function parseArgs(argv) {
  const out = {
    game: 'torchlight-infinite',
    url: undefined,
    headful: false,
    persistent: true,
    userDataDir: DEFAULT_USER_DATA_DIR,
    manualCaptcha: false,
    manualWaitMs: 180000,
    timeout: 60000,
    scrollRounds: 8,
    saveJson: true,
    output: undefined,
    listGames: false,
  };

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--game') out.game = argv[++i];
    else if (a === '--url') out.url = argv[++i];
    else if (a === '--headful') out.headful = true;
    else if (a === '--persistent') out.persistent = true;
    else if (a === '--no-persistent') out.persistent = false;
    else if (a === '--user-data-dir') out.userDataDir = argv[++i];
    else if (a === '--manual-captcha') out.manualCaptcha = true;
    else if (a === '--manual-wait-ms') out.manualWaitMs = Number(argv[++i] || out.manualWaitMs);
    else if (a === '--timeout') out.timeout = Number(argv[++i] || out.timeout);
    else if (a === '--scroll-rounds') out.scrollRounds = Number(argv[++i] || out.scrollRounds);
    else if (a === '--output') out.output = argv[++i];
    else if (a === '--no-save-json') out.saveJson = false;
    else if (a === '--list-games') out.listGames = true;
  }

  if (out.manualCaptcha) out.headful = true;
  return out;
}

async function autoScroll(page, rounds = 8, waitMs = 1200) {
  for (let i = 0; i < rounds; i++) {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(waitMs);
  }
}

async function detectCaptcha(page) {
  const bodyText = await page.locator('body').innerText().catch(() => '');
  return /请在下图依次点击|关闭验证|刷新验证|geetest|验证/i.test(bodyText);
}

async function extractRooms(page) {
  return await page.evaluate(() => {
    const anchors = Array.from(document.querySelectorAll('a[href]'));
    const rooms = [];
    for (const a of anchors) {
      const href = a.href || '';
      const m = href.match(/^https:\/\/live\.bilibili\.com\/(\d+)(?:[/?#]|$)/);
      if (!m) continue;
      const roomId = m[1];
      const text = (a.innerText || a.textContent || '').replace(/\s+/g, ' ').trim();
      const card = a.closest('li, article, .card, [class*="card"], [class*="room"], [class*="live"]');
      const cardText = card ? (card.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 300) : text;
      rooms.push({ roomId, href, text, cardText });
    }
    const dedup = new Map();
    for (const r of rooms) {
      if (!dedup.has(r.roomId)) dedup.set(r.roomId, r);
      else {
        const prev = dedup.get(r.roomId);
        if ((r.cardText || '').length > (prev.cardText || '').length) dedup.set(r.roomId, r);
      }
    }
    return Array.from(dedup.values());
  });
}

function summarizeRooms(rooms) {
  return rooms.slice(0, 20).map((r, i) => ({ index: i + 1, roomId: r.roomId, text: r.text }));
}

(async () => {
  const args = parseArgs(process.argv.slice(2));
  const games = loadGames();

  if (args.listGames) {
    console.log(JSON.stringify({ games }, null, 2));
    return;
  }

  const game = games[args.game];
  if (!args.url && !game) {
    console.error(`Unknown game alias: ${args.game}`);
    process.exit(2);
  }

  const targetName = game?.name || args.game || 'custom';
  const targetUrl = args.url || game.url;

  fs.mkdirSync(path.resolve('.openclaw'), { recursive: true });
  fs.mkdirSync(DEFAULT_OUTPUT_DIR, { recursive: true });

  let browser;
  let context;
  let page;
  let result;

  try {
    if (args.persistent) {
      context = await chromium.launchPersistentContext(path.resolve(args.userDataDir), {
        headless: !args.headful,
        viewport: { width: 1440, height: 2200 },
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'
      });
      page = context.pages()[0] || await context.newPage();
    } else {
      browser = await chromium.launch({ headless: !args.headful });
      context = await browser.newContext({
        viewport: { width: 1440, height: 2200 },
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'
      });
      page = await context.newPage();
    }

    await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: args.timeout });
    await page.waitForTimeout(5000);

    let blocked = await detectCaptcha(page);
    if (blocked && args.manualCaptcha) {
      console.error(`CAPTCHA detected for ${targetName}. Please solve it within ${Math.round(args.manualWaitMs / 1000)} seconds...`);
      await page.bringToFront().catch(() => {});
      const deadline = Date.now() + args.manualWaitMs;
      while (Date.now() < deadline) {
        await page.waitForTimeout(2000);
        blocked = await detectCaptcha(page);
        if (!blocked) {
          console.error('CAPTCHA cleared. Continuing scrape...');
          break;
        }
      }
    }

    const title = await page.title().catch(() => '');
    const sampleText = await page.locator('body').innerText().then(t => t.slice(0, 500)).catch(() => '');

    if (blocked) {
      result = {
        ok: false,
        status: 'BLOCKED_BY_CAPTCHA',
        game: args.game,
        gameName: targetName,
        title,
        url: page.url(),
        sampleText,
        hint: '可改用 --headful --manual-captcha 人工过验证；若已保存 profile，后续可直接复用。',
      };
    } else {
      await autoScroll(page, args.scrollRounds, 1200);
      const rooms = await extractRooms(page);
      result = {
        ok: true,
        status: 'OK',
        game: args.game,
        gameName: targetName,
        title,
        url: page.url(),
        count: rooms.length,
        topRooms: summarizeRooms(rooms),
        rooms,
        generatedAt: new Date().toISOString(),
      };
    }

    if (args.persistent) result.userDataDir = path.resolve(args.userDataDir);
  } catch (error) {
    result = {
      ok: false,
      status: 'ERROR',
      game: args.game,
      gameName: targetName,
      url: targetUrl,
      error: String((error && error.stack) || error)
    };
  } finally {
    if (page && !page.isClosed()) await page.close().catch(() => {});
    if (context) await context.close().catch(() => {});
    if (browser) await browser.close().catch(() => {});
  }

  const outputPath = path.resolve(args.output || path.join('.openclaw', 'outputs', `bili-${args.game}.json`));
  if (args.saveJson) fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), 'utf8');

  const stdout = {
    ok: result.ok,
    status: result.status,
    game: result.game,
    gameName: result.gameName,
    count: result.count,
    output: args.saveJson ? outputPath : undefined,
    userDataDir: result.userDataDir,
    hint: result.hint,
    topRooms: result.topRooms,
    error: result.error,
  };
  console.log(JSON.stringify(stdout, null, 2));
})();
