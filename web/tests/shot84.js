// v5.1 required accounts: the gate, sign-up into onboarding, sign-in that loads an existing log, sign-out that clears the phone,
// offline sign-out refused, sample data kept out of accounts, account deletion, Enter to submit, and no gate without sync config.
const { chromium, devices } = require('playwright');
const MOCK = 'http://localhost:8787';
(async () => {
  const browser = await chromium.launch();
  const errs = [];
  const mk = async (sync) => { const ctx = await browser.newContext({ ...devices['iPhone 13'], colorScheme: 'dark' }); const page = await ctx.newPage(); page.on('pageerror', e => errs.push(e.message)); if (sync !== false) await page.addInitScript(([u]) => { window.BEARING_SYNC_URL = u; window.BEARING_SYNC_KEY = 'test-anon-key'; }, [MOCK]); return page; };
  const server = async () => (await (await fetch(MOCK + '/__state', {headers: {apikey: 'test-anon-key'}})).json());
  const gate = p => p.evaluate(() => ({gate: !!document.querySelector('#acct-email') && document.body.textContent.indexOf('Your log, on every phone') >= 0, tabsHidden: document.querySelector('#tabs').hidden, ob: !!document.querySelector('.obh') && !document.querySelector('#acct-email')}));
  // ---- A: sample state on disk, but the gate comes first
  const A = await mk(); await A.goto('file:///home/claude/setlist/test.html?sample=1'); await A.waitForTimeout(400);
  console.log('A gate:', JSON.stringify(await gate(A)), '| mentions local log:', await A.evaluate(() => document.body.textContent.indexOf('comes along') >= 0));
  await A.fill('#acct-email', 'ben@example.com'); await A.fill('#acct-pw', 'longenough1'); await A.click('[data-act="sign-up"]'); await A.waitForTimeout(1500);
  const a1 = await A.evaluate(() => ({sample: __t.state.sample, workouts: __t.state.workouts.length, onboarding: !!document.querySelector('.obh'), hasAcctBtn: !!document.querySelector('[data-act="acct-open"]'), signedIn: !!localStorage.getItem('setlist.auth')}));
  console.log('A after sign-up (sample discarded, onboarding):', JSON.stringify(a1));
  await A.waitForTimeout(3500); let sv = await server(); console.log('server after sign-up:', JSON.stringify(sv.rows));
  // give A real data, as if logged over time
  await A.evaluate(() => { const s = __t.fresh(true); s.sample = false; s.settings.setupDone = true; __t.state = s; __t.save(); __t.render(); }); await A.waitForTimeout(3500);
  sv = await server(); console.log('A pushed:', JSON.stringify(sv.rows.map(r => r.workouts)));
  // ---- B: fresh phone, sign in, log arrives, no onboarding
  const B = await mk(); await B.goto('file:///home/claude/setlist/test.html'); await B.waitForTimeout(400);
  console.log('B gate:', JSON.stringify(await gate(B)));
  await B.fill('#acct-email', 'ben@example.com'); await B.fill('#acct-pw', 'wrongpass1'); await B.press('#acct-pw', 'Enter'); await B.waitForTimeout(600);
  console.log('B wrong pw via Enter:', await B.$eval('#syncline', el => el.textContent));
  await B.fill('#acct-pw', 'longenough1'); await B.press('#acct-pw', 'Enter'); await B.waitForTimeout(1500);
  console.log('B after sign-in:', JSON.stringify(await B.evaluate(() => ({workouts: __t.state.workouts.length, setup: __t.state.settings.setupDone, view: __t.state.ui.view, onboarding: !!document.querySelector('.obh'), tabs: !document.querySelector('#tabs').hidden}))));
  // ---- B signs out: asks first, then the phone is blank and gated
  await B.click('[data-tab="you"]'); await B.waitForTimeout(200); await B.click('[data-act="sign-out"]'); await B.waitForTimeout(200);
  console.log('sign-out sheet:', await B.$eval('.sheet .h2', el => el.textContent).catch(() => 'none'));
  await B.click('[data-act="sign-out-go"]'); await B.waitForTimeout(800);
  console.log('B after sign-out:', JSON.stringify(await gate(B)), '| local workouts:', await B.evaluate(() => JSON.parse(localStorage.getItem('setlist.v1') || localStorage.getItem(Object.keys(localStorage).find(k => k.startsWith('setlist') && k !== 'setlist.auth')) || '{"workouts":[]}').workouts.length), '| auth:', await B.evaluate(() => localStorage.getItem('setlist.auth')));
  await B.fill('#acct-email', 'ben@example.com'); await B.fill('#acct-pw', 'longenough1'); await B.click('[data-act="sign-in"]'); await B.waitForTimeout(1500);
  console.log('B signed back in:', await B.evaluate(() => __t.state.workouts.length), 'workouts');
  // ---- offline sign-out is refused, online it works
  await B.context().setOffline(true); await B.evaluate(() => { __t.state.exNotes['bench'] = 'offline note'; __t.save(); }); await B.waitForTimeout(300);
  await B.click('[data-tab="you"]'); await B.waitForTimeout(200); await B.click('[data-act="sign-out"]'); await B.waitForTimeout(200); await B.click('[data-act="sign-out-go"]'); await B.waitForTimeout(600);
  console.log('offline sign-out refused:', await B.$eval('#syncline', el => el.textContent), '| still signed in:', await B.evaluate(() => !!localStorage.getItem('setlist.auth')));
  await B.context().setOffline(false); await B.waitForTimeout(300); await B.click('[data-act="sign-out-go"]'); await B.waitForTimeout(1200);
  sv = await server(); console.log('online sign-out ok:', JSON.stringify(await gate(B)), '| note reached server:', JSON.stringify(sv.rows.map(r => r.workouts)));
  // ---- C: new account, sample mode never syncs, start fresh does
  const C = await mk(); await C.goto('file:///home/claude/setlist/test.html'); await C.waitForTimeout(400);
  await C.fill('#acct-email', 'cara@example.com'); await C.fill('#acct-pw', 'longenough1'); await C.click('[data-act="sign-up"]'); await C.waitForTimeout(1500);
  await C.click('[data-act="ob-sample"]'); await C.waitForTimeout(3800);
  sv = await server(); const cRow = sv.rows.find(r => r.workouts > 0 && r.uid !== sv.rows[0].uid);
  console.log('C sample loaded:', await C.evaluate(() => __t.state.sample && __t.state.workouts.length > 0), '| sample pushed to server:', !!cRow, '| rows:', JSON.stringify(sv.rows.map(r => r.workouts)));
  await C.click('[data-act="fresh-ask"]'); await C.waitForTimeout(200); await C.click('[data-act="fresh-yes"]'); await C.waitForTimeout(3800);
  sv = await server(); console.log('C after start fresh, rows:', JSON.stringify(sv.rows.map(r => r.workouts)), '| users:', sv.users.length);
  // ---- C deletes the account: gate, blank phone, user gone
  await C.click('[data-act="ob-skip"]'); await C.waitForTimeout(400);
  await C.click('[data-tab="you"]'); await C.waitForTimeout(200); await C.click('[data-act="acct-delete-ask"]'); await C.waitForTimeout(200); await C.click('[data-act="acct-delete"]'); await C.waitForTimeout(800);
  sv = await server(); console.log('C deleted:', JSON.stringify(await gate(C)), '| users left:', sv.users.join(','), '| rows:', sv.rows.length);
  // ---- no sync config: no gate (the preview build)
  const D = await mk(false); await D.goto('file:///home/claude/setlist/test.html?sample=1'); await D.waitForTimeout(400);
  console.log('no-config build gated:', JSON.stringify(await gate(D)));
  await B.screenshot({ path: 'sc-gate.png' });
  console.log(errs.length ? 'ERRORS: ' + errs.join('\n') : 'no errors'); await browser.close();
})();
