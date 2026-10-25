// v5.4: turning lifting off asks first and hides lifts with a notice in the exercise list; turning it back on restores the lifted tiles.
const { chromium, devices } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ ...devices['iPhone 13'], colorScheme: 'dark' });
  const page = await ctx.newPage();
  const errs = []; page.on('pageerror', e => errs.push(e.message));
  await page.goto('file:///home/claude/setlist/test.html?sample=1'); await page.waitForTimeout(400);
  await page.evaluate(() => { __t.state.settings.metrics.lifted30 = true; __t.state.ui.view = 'you'; __t.render(); });
  const picker = async () => { await page.evaluate(() => { __t.sheet = {type: 'pick-ex', for: 'active', q: ''}; __t.renderModal(); }); await page.waitForTimeout(150); return page.evaluate(() => ({ items: document.querySelectorAll('#exlist .item').length, note: (document.querySelector('[data-act="track-on"]') || {}).textContent || '', placeholder: document.querySelector('#exsearch').placeholder })); };
  const before = await picker(); console.log('both on:', JSON.stringify(before));
  await page.evaluate(() => { __t.closeSheet(); });
  // tapping Lifting asks first
  await page.click('[data-act="track"][data-k="lift"]'); await page.waitForTimeout(200);
  console.log('asks first:', await page.$eval('.sheet .h2', el => el.textContent).catch(() => 'no sheet'), '| still on:', await page.evaluate(() => __t.state.settings.track.lift));
  await page.click('[data-act="close"]'); await page.waitForTimeout(150);
  console.log('kept on after Keep it on:', await page.evaluate(() => __t.state.settings.track.lift));
  await page.click('[data-act="track"][data-k="lift"]'); await page.waitForTimeout(200); await page.click('[data-act="track-off-go"]'); await page.waitForTimeout(200);
  console.log('after Turn off:', JSON.stringify(await page.evaluate(() => ({ lift: __t.state.settings.track.lift, lifted7: __t.state.settings.metrics.lifted7, lifted30: __t.state.settings.metrics.lifted30 }))));
  const off = await picker(); console.log('lifting off picker:', JSON.stringify(off));
  // the notice's button turns it back on from inside the picker
  await page.click('[data-act="track-on"]'); await page.waitForTimeout(250);
  console.log('after Turn lifting on:', JSON.stringify(await page.evaluate(() => ({ lift: __t.state.settings.track.lift, lifted7: __t.state.settings.metrics.lifted7, lifted30: __t.state.settings.metrics.lifted30, pickerStillOpen: !!document.querySelector('#exlist'), items: document.querySelectorAll('#exlist .item').length, note: !!document.querySelector('[data-act="track-on"]') }))));
  await page.evaluate(() => { __t.closeSheet(); });
  // the last half cannot be turned off
  await page.click('[data-act="track"][data-k="cardio"]'); await page.waitForTimeout(200); await page.click('[data-act="track-off-go"]'); await page.waitForTimeout(200);
  await page.click('[data-act="track"][data-k="lift"]'); await page.waitForTimeout(200);
  console.log('last one off ->', await page.$eval('.toast', t => t.textContent).catch(() => 'no toast'), '| sheet:', !!(await page.$('.sheet .h2')));
  await page.evaluate(() => { __t.state.ui.view = 'you'; __t.render(); }); await page.waitForTimeout(100);
  await page.click('[data-act="track"][data-k="cardio"]'); await page.waitForTimeout(150);
  console.log('cardio back on, tile:', await page.evaluate(() => __t.state.settings.track.cardio + ' ' + __t.state.settings.metrics.cardio7));
  console.log(errs.length ? 'ERRORS: ' + errs.join('\n') : 'no errors'); await browser.close();
})();
