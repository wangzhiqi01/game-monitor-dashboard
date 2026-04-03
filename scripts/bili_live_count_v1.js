const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const DEFAULT_URL = 'https://live.bilibili.com/p/eden/area-tags?areaId=910&parentAreaId=3';

function parseArgs(argv) {
  const out = { url: DEFAULT_URL, headful: false, storageState: undefined, saveState: undefined, outFile: undefined, timeout: 60000 };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--url') out.url = argv[++i];
    else if (a === '--headful') out.headful = true;
    else if (a === '--storage-state') out.storageState = argv[++i];
    else if (a === '--save-state') out.saveState = argv[++i];
    else if (a === '--out') out.outFile = argv[++i];
    else if (a === '--timeout') out.timeout = Number(argv[++i] || out.timeout);
  }
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
  return /请在下图依次点击|关闭验证|刷新验证|geetest/i.test(bodyText);
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
      const cardText = card ? (card.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 200) : text;
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

(async () => {
  const args = parseArgs(process.argv.slice(2));
  const browser = await chromium.launch({ headless: !args.headful });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 2200 },
    storageState: args.storageState,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();

  let result;
  try {
    await page.goto(args.url, { waitUntil: 'domcontentloaded', timeout: args.timeout });
    await page.waitForTimeout(4000);
    await autoScroll(page, 8, 1000);

    const blocked = await detectCaptcha(page);
    const title = await page.title();
    const bodyText = await page.locator('body').innerText().catch(() => '');

    if (blocked) {
      result = {
        ok: false,
        status: 'BLOCKED_BY_CAPTCHA',
        title,
        url: page.url(),
        hint: 'B站触发了极验验证码。可改用 --headful 人工过验证，或提供已登录/已过验证的 storage state。',
        sampleText: bodyText.slice(0, 500)
      };
    } else {
      const rooms = await extractRooms(page);
      result = {
        ok: true,
        status: 'OK',
        title,
        url: page.url(),
        count: rooms.length,
        rooms: rooms.slice(0, 100)
      };
    }

    if (args.saveState) {
      const savePath = path.resolve(args.saveState);
      await context.storageState({ path: savePath });
      result.savedStorageState = savePath;
    }
  } catch (error) {
    result = {
      ok: false,
      status: 'ERROR',
      url: args.url,
      error: String(error && error.stack || error)
    };
  } finally {
    await context.close();
    await browser.close();
  }

  const text = JSON.stringify(result, null, 2);
  if (args.outFile) fs.writeFileSync(args.outFile, text, 'utf8');
  console.log(text);
})();
