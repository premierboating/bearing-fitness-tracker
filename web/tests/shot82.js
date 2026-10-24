// v4.9 accounts: sign up on phone A, reinstall as phone B and sign in from onboarding, log on A then pull on B, delete on B and pull on A, token refresh, sign out keeps data.
const { chromium, devices } = require('playwright');
const MOCK = 'http://localhost:8787';
(async () => {
  const browser = await chromium.launch();
  const mk = async () => { const ctx = await browser.newContext({ ...devices['iPhone 13'], colorScheme: 'dark' }); const page = await ctx.newPage(); page.on('pageerror', e => errs.push(e.message)); await page.addInitScript(([u]) => { window.BEARING_SYNC_URL = u; window.BEARING_SYNC_KEY = 'test-anon-key'; }, [MOCK]); return page; };
  const errs = []; const server = async () => (await (await fetch(MOCK + '/__state', {headers: {apikey: 'test-anon-key'}})).json());
  // ---- phone A with sample data signs up
  const A = await mk(); await A.goto('file:///home/claude/setlist/test.html?sample=1'); await A.waitForTimeout(400);
  await A.click('[data-tab="you"]'); await A.waitForTimeout(200);
  console.log('account card:', await A.$eval('#acct-email', el => !!el), '| nudge on today:', await A.evaluate(() => document.body.textContent.indexOf('Keep it safe') >= 0));
  await A.fill('#acct-email', 'ben@example.com'); await A.fill('#acct-pw', 'short'); await A.click('[data-act="sign-up"]'); await A.waitForTimeout(200);
  console.log('short pw:', await A.$eval('#syncline', el => el.textContent));
  await A.fill('#acct-pw', 'longenough1'); await A.click('[data-act="sign-up"]'); await A.waitForTimeout(1200);
  const a1 = await A.evaluate(() => ({signed: !!JSON.parse(localStorage.getItem('setlist.auth') || 'null'), workouts: __t.state.workouts.length, rev: __t.state.sync.rev}));
  await A.waitForTimeout(3200);
  let sv = await server(); console.log('after signup:', JSON.stringify(a1), '| server:', JSON.stringify(sv.rows));
  console.log('you card signed in:', (await A.$eval('#screen', el => el.textContent)).indexOf('Signed in as ben@example.com') >= 0, '| sync line:', await A.$eval('#syncline', el => el.textContent));
  // ---- phone B: fresh install, signs in from onboarding
  const B = await mk(); await B.goto('file:///home/claude/setlist/test.html'); await B.waitForTimeout(400);
  console.log('B onboarding has sign in:', await B.$$eval('[data-act="acct-open"]', els => els.length === 1));
  await B.click('[data-act="acct-open"]'); await B.waitForTimeout(250);
  await B.fill('#acct-email', 'ben@example.com'); await B.fill('#acct-pw', 'wrongpass1'); await B.click('[data-act="sign-in"]'); await B.waitForTimeout(600);
  console.log('wrong pw:', await B.$eval('#syncline', el => el.textContent));
  await B.fill('#acct-pw', 'longenough1'); await B.click('[data-act="sign-in"]'); await B.waitForTimeout(1500);
  const b1 = await B.evaluate(() => ({workouts: __t.state.workouts.length, routines: __t.state.routines.length, setup: __t.state.settings.setupDone, view: __t.state.ui.view, onboarding: !!document.querySelector('.obh'), sample: __t.state.sample}));
  console.log('B after sign in:', JSON.stringify(b1), '| title:', await B.$eval('.title', el => el.textContent).catch(() => '-'));
  // ---- A logs a weigh-in and a workout; B pulls
  await A.click('[data-tab="today"]'); await A.waitForTimeout(200);
  await A.evaluate(() => { __t.state.bodyweights.push({date: __t.todayKey(), lb: 181, t: Date.now()}); __t.startWorkout('push'); }); await A.waitForTimeout(200);
  await A.click('[data-act="log"]'); await A.waitForTimeout(200); await A.evaluate(() => { __t.state.timer = null; __t.render(); });
  await A.click('[data-act="finish"]'); await A.waitForTimeout(300); await A.click('.sheet [data-act="summary-done"]').catch(() => {}); await A.waitForTimeout(3500);
  sv = await server(); console.log('A pushed:', JSON.stringify(sv.rows.map(r => r.workouts)));
  await B.click('[data-tab="you"]'); await B.waitForTimeout(200); await B.click('[data-act="sync-now"]'); await B.waitForTimeout(1500);
  console.log('B pulled:', await B.evaluate(() => ({workouts: __t.state.workouts.length, bw: __t.state.bodyweights.slice(-1)[0].lb})), '| toast/sync line:', await B.$eval('#syncline', el => el.textContent));
  // ---- B deletes the newest workout; A pulls and it stays gone
  const delId = await B.evaluate(() => { const w = __t.state.workouts.slice().sort((a, b) => b.start - a.start)[0]; __t.state.workouts = __t.state.workouts.filter(x => x.id !== w.id); __t.state.deleted.w[w.id] = Date.now(); __t.save(); return w.id; });
  await B.waitForTimeout(3500); sv = await server(); console.log('B pushed delete:', JSON.stringify(sv.rows.map(r => [r.workouts, Object.keys(r.deleted.w).length])));
  await A.click('[data-tab="you"]'); await A.waitForTimeout(200); await A.click('[data-act="sync-now"]'); await A.waitForTimeout(1500);
  console.log('A after pull:', await A.evaluate(id => ({workouts: __t.state.workouts.length, stillHas: __t.state.workouts.some(w => w.id === id)}), delId));
  // ---- token refresh: tokens expire after 2 s on the mock; a later push must still succeed
  await A.waitForTimeout(2500);
  await A.evaluate(() => { __t.state.exNotes['bench'] = 'refresh test'; __t.save(); }); await A.waitForTimeout(3500);
  sv = await server(); console.log('refresh path, last calls:', sv.log.slice(-4).join(' | '), '| server rev moved:', sv.rows[0].rev > a1.rev);
  // ---- sign out keeps local data, nudge returns
  await A.click('[data-act="sign-out"]'); await A.waitForTimeout(300);
  console.log('after sign out:', await A.evaluate(() => ({workouts: __t.state.workouts.length, auth: localStorage.getItem('setlist.auth')})), '| form back:', await A.$$eval('#acct-email', els => els.length === 1));
  await A.screenshot({ path: 'sc-account.png' });
  // ---- recovery link flow
  const C = await mk(); await C.goto('file:///home/claude/setlist/test.html?sample=1#access_token=' + encodeURIComponent('bogus') + '&refresh_token=x&type=recovery'); await C.waitForTimeout(500);
  console.log('recovery sheet:', await C.$eval('.sheet .h2', el => el.textContent).catch(() => 'none'), '| hash cleared:', await C.evaluate(() => location.hash === ''));
  console.log(errs.length ? errs.join('\n') : 'no errors'); await browser.close();
})();
