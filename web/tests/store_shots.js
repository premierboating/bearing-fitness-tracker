// App Store screenshots from the sample data: Today, a workout with the rest timer running, Progress, Plan, History.
// Sizes: iPhone 6.9" (1320x2868), iPhone 6.5" (1284x2778), iPad 13" (2064x2752).
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const OUT = process.env.SHOT_OUT || '/mnt/user-data/outputs/store-screenshots';
const SIZES = [
  { name: 'iphone-6.9', w: 440, h: 956, scale: 3 },
  { name: 'iphone-6.5', w: 428, h: 926, scale: 3 },
  { name: 'iphone-6.3', w: 402, h: 874, scale: 3 },
  { name: 'iphone-6.1', w: 393, h: 852, scale: 3 },
  { name: 'ipad-13', w: 1032, h: 1376, scale: 2 },
];
(async () => {
  const browser = await chromium.launch();
  for (const s of SIZES) {
    const dir = path.join(OUT, s.name); fs.mkdirSync(dir, { recursive: true });
    const ctx = await browser.newContext({ viewport: { width: s.w, height: s.h }, deviceScaleFactor: s.scale, isMobile: s.w < 700, hasTouch: true, colorScheme: 'dark' });
    const page = await ctx.newPage();
    const errs = []; page.on('pageerror', e => errs.push(e.message));
    await page.goto('file:///home/claude/setlist/test.html?sample=1'); await page.waitForTimeout(500);
    await page.addStyleTag({ content: '#banner{display:none !important} .banner{display:none !important}' });
    const shot = async (n, name) => { await page.waitForTimeout(250); await page.screenshot({ path: path.join(dir, n + '-' + name + '.png') }); };
    await page.evaluate(() => { __t.state.ui.view = 'today'; __t.render(); window.scrollTo(0, 0); });
    await shot(1, 'today');
    await page.evaluate(() => { __t.startWorkout('push'); }); await page.waitForTimeout(300);
    await page.click('[data-act="log"]').catch(() => {}); await page.waitForTimeout(400);
    await page.evaluate(() => window.scrollTo(0, 0));
    await shot(2, 'workout');
    await page.evaluate(() => { __t.state.timer = null; __t.state.active = null; __t.state.ui.view = 'progress'; __t.render(); window.scrollTo(0, 0); });
    await shot(3, 'progress');
    await page.evaluate(() => { __t.state.ui.view = 'plan'; __t.render(); window.scrollTo(0, 0); });
    await shot(4, 'plan');
    await page.evaluate(() => { __t.state.ui.view = 'history'; __t.render(); window.scrollTo(0, 0); });
    await shot(5, 'history');
    const dims = await page.evaluate(() => [innerWidth, innerHeight, devicePixelRatio]);
    console.log(s.name, 'viewport', dims.join('x'), errs.length ? 'ERRORS: ' + errs.join(' | ') : 'ok');
    await ctx.close();
  }
  await browser.close();
})();
