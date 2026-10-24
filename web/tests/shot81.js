// Smoke: onboarding end to end, then a workout with a rest-pause panel screenshot, water, standards, picker, history.
const { chromium, devices } = require('playwright');
(async () => { var page;
  const browser = await chromium.launch(); const ctx = await browser.newContext({ ...devices['iPhone 13'], colorScheme: 'dark' });
  page = await ctx.newPage(); const errs = []; page.on('pageerror', e => errs.push(e.message));
  await page.goto('file:///home/claude/setlist/test.html'); await page.waitForTimeout(500);
  const steps = []; for (let i = 0; i < 12; i++) { const h = await page.$eval('.obh', el => el.textContent).catch(() => null); if (!h) break; steps.push(h);
    if (h === 'Lifting experience') await page.click('[data-act="ob-level"][data-v="consistent"]').catch(() => {});
    if (/weight/i.test(h)) { const inp = await page.$('input[data-bw]'); if (inp) { await inp.fill('200'); await page.waitForTimeout(350); } }
    if (/sex|you/i.test(h)) await page.click('[data-act="ob-sex"][data-v="m"]').catch(() => {});
    const btn = await page.$('[data-act="ob-next"]'); if (!btn) { console.log('no next on', h, 'acts:', await page.$$eval('[data-act]', els => Array.from(new Set(els.map(e => e.dataset.act))).join(','))); break; } await btn.click(); await page.waitForTimeout(300); }
  console.log('onboarding steps:', steps.join(' > '), '| done:', await page.evaluate(() => !!__t.state.settings.setupDone), '| view:', await page.evaluate(() => __t.state.ui.view));
  // sample state for the rest
  const ctx2 = await browser.newContext({ ...devices['iPhone 13'], colorScheme: 'dark' }); const page2 = await ctx2.newPage(); page2.on('pageerror', e => errs.push(e.message));
  await page2.goto('file:///home/claude/setlist/test.html?sample=1'); await page2.waitForTimeout(400); page = page2;
  await page.evaluate(() => __t.startWorkout('push')); await page.waitForTimeout(300);
  await page.click('[data-act="sub-toggle"][data-tech="restpause"]'); await page.waitForTimeout(200);
  await page.evaluate(() => document.querySelector('.subset').scrollIntoView({block: 'center'})); await page.screenshot({ path: 'sc-restpause.png' });
  await page.click('[data-act="add-ex"]'); await page.waitForTimeout(250); await page.fill('#exsearch', 'hack'); await page.waitForTimeout(150);
  console.log('picker:', await page.$$eval('#exlist .item', els => els.length), 'results for hack');
  await page.click('#exlist .item'); await page.waitForTimeout(250);
  console.log('entries:', await page.evaluate(() => __t.state.active.entries.length));
  await page.evaluate(() => { __t.state.active = null; __t.state.ui.view = 'today'; __t.render(); });
  await page.click('[data-tab="progress"]'); await page.waitForTimeout(250); console.log('progress h3s:', await page.$$eval('.h3', els => els.slice(0, 5).map(e => e.textContent).join(' | ')));
  await page.click('[data-tab="history"]'); await page.waitForTimeout(250); console.log('history rows:', await page.$$eval('.hist', els => els.length));
  await page.click('[data-tab="you"]'); await page.waitForTimeout(250); console.log('you cards:', await page.$$eval('.h3', els => els.slice(0, 6).map(e => e.textContent).join(' | ')));
  console.log(errs.length ? errs.join('\n') : 'no errors'); await browser.close();
})();
