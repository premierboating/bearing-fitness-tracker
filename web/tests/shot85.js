// v5.2 rest alert: settings (sound / vibration / both / nothing, tone picker, Test), the notification sound mirrors the setting,
// the native player is used when present, all four tones render, and old states get a tone.
const { chromium, devices } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ ...devices['iPhone 13'], colorScheme: 'dark' });
  const page = await ctx.newPage();
  const errs = []; page.on('pageerror', e => errs.push(e.message));
  await page.goto('file:///home/claude/setlist/test.html?sample=1'); await page.waitForTimeout(400);
  await page.evaluate(() => { __t.state.ui.view = 'you'; __t.render(); });
  const opts = sel => page.$$eval(sel + ' option', os => os.map(o => o.value + ':' + o.textContent));
  console.log('alert options:', (await opts('[data-set="alert"]')).join(' | '));
  console.log('tone options:', (await opts('[data-set="tone"]')).join(' | '), '| test button:', !!(await page.$('[data-act="alert-test"]')), '| help:', await page.$eval('[data-act="alert-test"]', b => b.previousElementSibling.textContent.slice(0, 60)));
  // vibration only hides the tone picker; nothing hides the Test button
  await page.selectOption('[data-set="alert"]', 'vibrate'); await page.waitForTimeout(200);
  console.log('vibrate only -> tone picker:', !!(await page.$('[data-set="tone"]')), '| test:', !!(await page.$('[data-act="alert-test"]')), '| file:', await page.evaluate(() => __t.alertFile()));
  await page.selectOption('[data-set="alert"]', 'none'); await page.waitForTimeout(200);
  console.log('nothing -> test:', !!(await page.$('[data-act="alert-test"]')), '| file:', JSON.stringify(await page.evaluate(() => __t.alertFile())));
  await page.selectOption('[data-set="alert"]', 'both'); await page.waitForTimeout(200);
  await page.selectOption('[data-set="tone"]', 'bell'); await page.waitForTimeout(200);
  console.log('bell picked:', await page.evaluate(() => __t.state.settings.tone + ' ' + __t.alertFile()));
  // Test on the web plays through Web Audio and says so
  await page.click('[data-act="alert-test"]'); await page.waitForTimeout(300);
  console.log('web test toast:', await page.$eval('.toast', t => t.textContent).catch(() => 'none'));
  // all four tones render offline, each under three seconds
  const lens = await page.evaluate(async () => { const out = {}; for (const t of __t.TONES) { const c = new OfflineAudioContext(1, 44100 * 3, 44100); const end = __t.toneGraph(c, c.destination, t.id, 0); const b = await c.startRendering(); let peak = 0; const d = b.getChannelData(0); for (let i = 0; i < d.length; i++) peak = Math.max(peak, Math.abs(d[i])); out[t.id] = end.toFixed(2) + 's/' + peak.toFixed(2); } return out; });
  console.log('tones:', JSON.stringify(lens));
  // a fake native bridge: the notification carries the tone, the native player gets the file, keepAwake goes native
  await page.evaluate(() => {
    window.__sched = null; window.__played = null; window.__awake = null; window.__cancelled = 0;
    window.Capacitor = { isNativePlatform: () => true, Plugins: {
      LocalNotifications: { cancel: async () => { window.__cancelled++; }, checkPermissions: async () => ({display: 'granted'}), schedule: async n => { window.__sched = n; } },
      Bearing: { play: async o => { window.__played = o; return {route: 'BluetoothA2DP', routeName: 'AirPods', volume: 0.6, duration: 1.4}; }, keepAwake: async o => { window.__awake = o.on; } },
      Haptics: { vibrate: async () => {} }
    } };
  });
  await page.evaluate(() => { __t.startWorkout('push'); }); await page.waitForTimeout(300);
  await page.click('[data-act="log"]'); await page.waitForTimeout(600);
  let s = await page.evaluate(() => ({ sound: __sched && __sched.notifications[0].sound, title: __sched && __sched.notifications[0].title, timer: !!__t.state.timer, awake: __awake }));
  console.log('native: notification after a set:', JSON.stringify(s));
  await page.evaluate(() => { __t.state.ui.view = 'you'; __t.render(); }); await page.waitForTimeout(100);
  await page.selectOption('[data-set="alert"]', 'vibrate'); await page.waitForTimeout(300);
  s = await page.evaluate(() => __sched && __sched.notifications[0].sound);
  console.log('native: vibration only ->', s);
  await page.selectOption('[data-set="alert"]', 'none'); await page.waitForTimeout(300);
  s = await page.evaluate(() => JSON.stringify(__sched && __sched.notifications[0].sound));
  console.log('native: nothing ->', s);
  await page.selectOption('[data-set="alert"]', 'both'); await page.waitForTimeout(300);
  await page.selectOption('[data-set="tone"]', 'beep'); await page.waitForTimeout(300);
  console.log('native: tone change plays it:', await page.evaluate(() => JSON.stringify(__played)), '| notification:', await page.evaluate(() => __sched.notifications[0].sound));
  await page.click('[data-act="alert-test"]'); await page.waitForTimeout(300);
  console.log('native test toast:', await page.$eval('.toast', t => t.textContent).catch(() => 'none'));
  // the timer firing plays the native sound
  await page.evaluate(() => { __t.state.timer.end = Date.now() - 10; window.__played = null; }); await page.waitForTimeout(900);
  console.log('rest end plays native:', await page.evaluate(() => JSON.stringify(__played)), '| fired:', await page.evaluate(() => __t.state.timer && __t.state.timer.fired));
  // an older state without a tone gets the default
  await page.evaluate(() => { delete __t.state.settings.tone; __t.saveNow(); });
  await page.reload(); await page.waitForTimeout(400);
  console.log('migration tone:', await page.evaluate(() => __t.state.settings.tone), '| version:', await page.evaluate(() => document.body.textContent.match(/v5\.\d/) && document.body.textContent.match(/v5\.\d/)[0]));
  await page.evaluate(() => { __t.state.ui.view = 'you'; __t.render(); window.scrollTo(0, document.body.scrollHeight * 0.55); });
  await page.waitForTimeout(200); await page.screenshot({ path: 'sc-alert.png' });
  console.log(errs.length ? 'ERRORS: ' + errs.join('\n') : 'no errors'); await browser.close();
})();
