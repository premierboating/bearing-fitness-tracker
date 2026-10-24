// v5.3 Live Activity bridge (fake native plugin): start, log a set, pause and resume, +30s, rest over, finish; no repeats; pause keeps the rest honest.
const { chromium, devices } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ ...devices['iPhone 13'], colorScheme: 'dark' });
  const page = await ctx.newPage();
  const errs = []; page.on('pageerror', e => errs.push(e.message));
  await page.addInitScript(() => {
    window.__live = [];
    window.Capacitor = { isNativePlatform: () => true, getPlatform: () => 'ios', Plugins: {
      Bearing: { liveActivity: async m => { window.__live.push(m); return {active: m.action !== 'end'}; }, keepAwake: async () => ({}), play: async () => ({}) },
      LocalNotifications: { cancel: async () => {}, checkPermissions: async () => ({display: 'granted'}), schedule: async () => {} },
      Haptics: { vibrate: async () => {}, impact: async () => {} }
    } };
  });
  await page.goto('file:///home/claude/setlist/test.html?sample=1'); await page.waitForTimeout(500);
  const last = () => page.evaluate(() => { const l = window.__live[window.__live.length - 1]; return l ? Object.assign({}, l, {restStart: l.restStart ? 'set' : 0, restEnd: l.restEnd ? 'set' : 0, started: l.started ? 'set' : 0}) : null; });
  const count = () => page.evaluate(() => window.__live.length);
  console.log('at launch (no workout):', JSON.stringify(await last()), '| calls:', await count());
  await page.evaluate(() => { __t.startWorkout('push'); }); await page.waitForTimeout(300);
  console.log('workout started:', JSON.stringify(await last()));
  await page.click('[data-act="log"]'); await page.waitForTimeout(400);
  const afterLog = await last(); console.log('after a set:', JSON.stringify(afterLog));
  const n1 = await count(); await page.evaluate(() => { __t.render(); __t.render(); }); await page.waitForTimeout(200);
  console.log('re-render adds calls:', (await count()) - n1);
  const before = await page.evaluate(() => (__t.state.timer.end - Date.now()) / 1000);
  await page.click('[data-act="pause"]'); await page.waitForTimeout(200);
  console.log('paused:', JSON.stringify(await last()));
  await page.waitForTimeout(2000); await page.click('[data-act="pause"]'); await page.waitForTimeout(200);
  const after = await page.evaluate(() => (__t.state.timer.end - Date.now()) / 1000);
  console.log('resumed:', JSON.stringify(await last()), '| rest left before pause', before.toFixed(1), 'after 2s pause', after.toFixed(1));
  const endBefore = await page.evaluate(() => window.__live[window.__live.length - 1].restEnd);
  await page.click('[data-act="rest-add"]'); await page.waitForTimeout(200);
  const endAfter = await page.evaluate(() => window.__live[window.__live.length - 1].restEnd);
  console.log('+30s moves restEnd by', (endAfter - endBefore) / 1000, 's');
  await page.evaluate(() => { __t.state.timer.end = Date.now() - 10; }); await page.waitForTimeout(900);
  console.log('rest over:', JSON.stringify(await last()));
  await page.click('[data-act="rest-skip"]'); await page.waitForTimeout(200);
  console.log('dismissed:', JSON.stringify(await last()));
  // log the remaining sets of this exercise: the line turns to the next exercise
  const total = await page.evaluate(() => __t.state.active.entries[__t.state.active.idx].target.sets || 1);
  for (let k = 1; k < total; k++) { await page.click('[data-act="log"]'); await page.waitForTimeout(250); await page.click('[data-act="rest-skip"]').catch(() => {}); await page.waitForTimeout(150); }
  console.log('exercise done:', JSON.stringify(await last()));
  await page.evaluate(() => { __t.sheet = {type: 'finish'}; }); await page.click('[data-act="finish"]').catch(() => {}); await page.waitForTimeout(300);
  await page.evaluate(() => { if (__t.state.active) __t.finish(); }); await page.waitForTimeout(300);
  console.log('finished:', JSON.stringify(await last()), '| workout active:', await page.evaluate(() => !!__t.state.active));
  console.log(errs.length ? 'ERRORS: ' + errs.join('\n') : 'no errors'); await browser.close();
})();
