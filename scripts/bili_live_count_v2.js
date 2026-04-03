const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const DEFAULT_URL = 'https://live.bilibili.com/p/eden/area-tags?areaId=910&parentAreaId=3';
const DEFAULT_USER_DATA_DIR = path.resolve('.openclaw', 'playwright-bili-profile');

function parseArgs(argv) {
  const out = {
    url: DEFAULT_URL,
    headful: false,
    storageState: undefined,
    saveState: undefined,
    outFile: undefined,
    timeout: 60000,
    userDataDir: undefined,
    persistent: false,
    manualCaptcha: false,
    manualWaitMs: 120000,
    scrollRounds: 8,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--url') out.url = argv[++i];
    else if (a === '--headful') out.headful = true;
    else if (a === '--storage-state') out.storageState = argv[++i];
    else if (a === '--save-state') out.saveState = argv[++i];
    else if (a === '--out') out.outFile = argv[++i];
    else if (a === '--timeout') out.timeout = Number(argv[++i] || out.timeout);
    else if (a === '--user-data-dir') out.userDataDir = argv[++i];
    else if (a === '--persistent') out.persistent = true;
    else if (a === '--manual-captcha') out.manualCaptcha = true;
    else if (a === '--manual-wait-ms') out.manualWaitMs = Number(argv[++i] || out.manualWaitMs);
    else if (a === '--scroll-rounds') out.scrollRounds = Number(argv[++i] || out.scrollRounds);
  }
  if (out.manualCaptcha) out.headful = true;
  if (out.persistent && !out.userDataDir) out.userDataDir = DEFAULT_USER_DATA_DIR;
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

async function buildResult(page, status, extra = {}) {
  const title = await page.title().catch(() => '');
  const bodyText = await page.locator('body').innerText().catch(() => '');
  return {
    ok: status === 'OK',
    status,
    title,
    url: page.url(),
    sampleText: bodyText.slice(0, 500),
    ...extra,
  };
}

(async () => {
  const args = parseArgs(process.argv.slice(2));
  fs.mkdirSync(path.resolve('.openclaw'), { recursive: true });

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
        storageState: args.storageState,
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'
      });
      page = await context.newPage();
    }

    await page.goto(args.url, { waitUntil: 'domcontentloaded', timeout: args.timeout });
    await page.waitForTimeout(5000);

    let blocked = await detectCaptcha(page);
    if (blocked && args.manualCaptcha) {
      console.error(`CAPTCHA detected. Please solve it in the opened browser within ${Math.round(args.manualWaitMs / 1000)} seconds...`);
      await page.bringToFront().catch(() => {});
      await page.waitForTimeout(args.manualWaitMs);
      blocked = await detectCaptcha(page);
    }

    if (blocked) {
      result = await buildResult(page, 'BLOCKED_BY_CAPTCHA', {
        hint: 'B站触发了极验验证码。可结合 --headful --manual-captcha 人工过验证，再配合 --persistent 或 --save-state 复用状态。'
      });
    } else {
      await autoScroll(page, args.scrollRounds, 1200);
      const rooms = await extractRooms(page);
      result = await buildResult(page, 'OK', {
        count: rooms.length,
        rooms: rooms.slice(0, 150)
      });
    }

    if (args.saveState && !args.persistent) {
      const savePath = path.resolve(args.saveState);
      await context.storageState({ path: savePath });
      result.savedStorageState = savePath;
    }
    if (args.persistent) {
      result.userDataDir = path.resolve(args.userDataDir);
    }
  } catch (error) {
    result = {
      ok: false,
      status: 'ERROR',
      url: args.url,
      error: String((error && error.stack) || error)
    };
  } finally {
    if (context) await context.close().catch(() => {});
    if (browser) await browser.close().catch(() => {});
  }

  const text = JSON.stringify(result, null, 2);
  if (args.outFile) fs.writeFileSync(args.outFile, text, 'utf8');
  console.log(text);
})();
