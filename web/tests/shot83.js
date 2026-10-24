// Native bridge with a fake Capacitor: rest alerts follow the timer, haptics on log, splash/status bar calls, Android back button; account deletion against the mock.
const { chromium, devices } = require('playwright');
const MOCK = 'http://localhost:8787';
(async () => {
  const browser = await chromium.launch(); const ctx = await browser.newContext({ ...devices['iPhone 13'], colorScheme: 'dark' });
  const page = await ctx.newPage(); const errs = []; page.on('pageerror', e => errs.push(e.message));
  await page.addInitScript(([u]) => {
    window.BEARING_SYNC_URL = u; window.BEARING_SYNC_KEY = 'test-anon-key'; window.NATIVE_BUILD = true;
    const calls = window.__calls = [];
    const rec = (n, m) => (args) => { calls.push([n, m, args]); return Promise.resolve(n === 'LocalNotifications' && /Permissions/.test(m) ? {display: 'granted'} : {}); };
    const plugin = (n, ms) => Object.fromEntries(ms.map(m => [m, rec(n, m)]));
    window.Capacitor = { isNativePlatform: () => true, getPlatform: () => 'ios', Plugins: {
      LocalNotifications: plugin('LocalNotifications', ['cancel', 'schedule', 'checkPermissions', 'requestPermissions']),
      Haptics: plugin('Haptics', ['impact', 'notification', 'vibrate']),
      StatusBar: plugin('StatusBar', ['setStyle', 'setBackgroundColor']), SplashScreen: plugin('SplashScreen', ['hide']),
      App: {addListener: (ev, fn) => { window.__back = fn; calls.push(['App', 'addListener', ev]); return Promise.resolve({remove(){}}); }, minimizeApp: rec('App', 'minimizeApp')} } };
  }, [MOCK]);
  await page.goto('file:///home/claude/setlist/test.html?sample=1'); await page.waitForTimeout(600);
  // accounts are required: sign up through the gate, then load the sample data as if it were the account's own log
  await page.fill('#acct-email', 'native@example.com'); await page.fill('#acct-pw', 'longenough1'); await page.click('[data-act="sign-up"]'); await page.waitForTimeout(1200); await page.click('[data-act="ob-skip"]'); await page.waitForTimeout(400);
  await page.evaluate(() => { const s = __t.fresh(true); s.sample = false; s.settings.setupDone = true; __t.state = s; __t.save(); __t.render(); }); await page.waitForTimeout(300);
  const calls = () => page.evaluate(() => window.__calls.map(c => c[0] + '.' + c[1] + (c[2] && c[2].notifications ? '#' + c[2].notifications.map(n => n.id + (n.schedule ? '@' + new Date(n.schedule.at).toISOString().slice(11, 19) : '')).join() : c[2] && c[2].style ? ':' + c[2].style : '')));
  console.log('boot calls:', (await calls()).join(' | '));
  await page.evaluate(() => { window.__calls.length = 0; __t.startWorkout('push'); }); await page.waitForTimeout(200);
  await page.click('[data-act="log"]'); await page.waitForTimeout(400);
  console.log('after log:', (await calls()).join(' | '), '| timer end:', await page.evaluate(() => new Date(__t.state.timer.end).toISOString().slice(11, 19)));
  await page.evaluate(() => { window.__calls.length = 0; }); await page.click('[data-act="rest-add"]'); await page.waitForTimeout(300);
  console.log('after +30s:', (await calls()).join(' | '), '| end:', await page.evaluate(() => new Date(__t.state.timer.end).toISOString().slice(11, 19)));
  await page.evaluate(() => { window.__calls.length = 0; }); await page.click('[data-act="pause"]'); await page.waitForTimeout(300);
  console.log('after pause:', (await calls()).join(' | '));
  await page.evaluate(() => { window.__calls.length = 0; }); await page.click('[data-act="pause"]'); await page.waitForTimeout(300);
  console.log('after resume:', (await calls()).join(' | '));
  await page.evaluate(() => { window.__calls.length = 0; }); await page.click('[data-act="rest-skip"]'); await page.waitForTimeout(300);
  console.log('after skip:', (await calls()).join(' | '));
  // back button: closes a sheet, then leaves the workout, then goes to today, then minimizes
  await page.click('[data-act="ex-menu"][data-i="0"]'); await page.waitForTimeout(200);
  console.log('back with sheet:', await page.evaluate(() => { window.__back(); return {sheet: !!__t.sheet, view: __t.state.ui.view}; }));
  console.log('back in workout:', await page.evaluate(() => { window.__back(); return __t.state.ui.view; }));
  await page.evaluate(() => { __t.state.ui.view = 'progress'; __t.render(); });
  console.log('back from progress:', await page.evaluate(() => { window.__back(); return __t.state.ui.view; }), '| then:', await page.evaluate(() => { window.__calls.length = 0; window.__back(); return window.__calls.map(c => c[0] + '.' + c[1]).join(); }));
  // install card and onboarding install step stay hidden in the native build
  console.log('install card hidden:', await page.evaluate(() => document.querySelector('#screen').textContent.indexOf('Put it on your home screen') < 0), '| steps:', await page.evaluate(() => __t.obSteps().join(',')));
  // account deletion
  await page.click('[data-tab="you"]'); await page.waitForTimeout(3200);
  let sv = await (await fetch(MOCK + '/__state', {headers: {apikey: 'test-anon-key'}})).json(); console.log('signed in as native@example.com, server users:', sv.users.join(','), 'rows:', sv.rows.length);
  await page.click('[data-act="acct-delete-ask"]'); await page.waitForTimeout(200); console.log('confirm sheet:', await page.$eval('.sheet .h2', el => el.textContent));
  await page.click('.sheet [data-act="acct-delete"]'); await page.waitForTimeout(800);
  sv = await (await fetch(MOCK + '/__state', {headers: {apikey: 'test-anon-key'}})).json();
  console.log('after delete: users:', sv.users.join(',') || 'none', '| rows:', sv.rows.length, '| signed out:', await page.evaluate(() => !localStorage.getItem('setlist.auth')), '| phone cleared:', await page.evaluate(() => __t.state.workouts.length === 0 && !!document.querySelector('#acct-email')));
  console.log(errs.length ? errs.join('\n') : 'no errors'); await browser.close();
})();
