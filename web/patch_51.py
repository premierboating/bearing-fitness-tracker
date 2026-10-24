# v5.1: an account is required. With accounts switched on, the app opens on a sign-in screen until there is a session;
# signing out or deleting the account clears the phone; sample data never reaches an account; a reset link fills in the user.
def sub(src, old, new):
    assert old in src, 'anchor missing: ' + old[:110]
    assert src.count(old) == 1, 'anchor not unique: ' + old[:110]
    return src.replace(old, new, 1)

p2 = open('part2.js', encoding='utf-8').read()
p2 = sub(p2, "const APP_VERSION = '5.0',", "const APP_VERSION = '5.1',")
open('part2.js', 'w', encoding='utf-8').write(p2)

p3 = open('part3.js', encoding='utf-8').read()

# the gate comes before everything else on screen
p3 = sub(p3, "function render(){\n  const view = state.ui.view;\n  bannerEl.innerHTML = state.sample ?",
             "function render(){\n  const view = state.ui.view;\n  if (gateOn()) { bannerEl.innerHTML = ''; screenEl.className = 'screen onboard'; tabsEl.hidden = true; screenEl.innerHTML = renderGate(); renderRest(); save(); return; }\n  bannerEl.innerHTML = state.sample ?")

# onboarding no longer offers sign-in: by the time it shows, the person is signed in
p3 = sub(p3, """'<div class="obfoot">' + (syncReady() ? '<button class="btn secondary" style="margin-bottom:10px" data-act="acct-open">Already have an account? Sign in</button>' : '') + '<button class="btn link small" data-act="ob-sample">""",
             """'<div class="obfoot"><button class="btn link small" data-act="ob-sample">""")
p3 = sub(p3, "Used for strength standards, the athlete score and macros. Nothing leaves this phone.</p>",
             "Used for strength standards, the athlete score and macros. ' + (syncReady() ? 'Saved to your account, nowhere else.' : 'Nothing leaves this phone.') + '</p>")
p3 = sub(p3, "Bearing runs as an app once it is on your home screen. Your log stays on this phone either way.</p>",
             "Bearing runs as an app once it is on your home screen. ' + (syncReady() ? 'Your log is in your account either way.' : 'Your log stays on this phone either way.') + '</p>")

# sign-out asks first; deletion clears the phone too
p3 = sub(p3, "  } else if (sheet.type === 'acct-delete') {\n    inner = '<div class=\"h2\">Delete your account?</div><p style=\"margin:8px 0 14px\">This removes your account and the copy of your log stored in it. The log on this phone stays until you clear it. There is no undo.</p>",
             "  } else if (sheet.type === 'signout') {\n    inner = '<div class=\"h2\">Sign out?</div><p style=\"margin:8px 0 14px\">Your log stays in your account and is removed from this phone. Sign in again any time to get it back.</p><div class=\"row\"><button class=\"btn grow\" data-act=\"close\">Stay signed in</button><button class=\"btn grow ghost\" data-act=\"sign-out-go\">Sign out</button></div><div class=\"small\" id=\"syncline\" style=\"margin-top:8px\">' + syncLine() + '</div>';\n  } else if (sheet.type === 'acct-delete') {\n    inner = '<div class=\"h2\">Delete your account?</div><p style=\"margin:8px 0 14px\">This removes your account, the copy of your log stored in it, and the copy on this phone. There is no undo. To keep the log, copy a backup first under You.</p>")
p3 = sub(p3, "    case 'sign-out': signOut(); break;",
             "    case 'sign-out': sheet = {type: 'signout'}; renderModal(); break;\n    case 'sign-out-go': signOut(); break;")
p3 = sub(p3, "setAuth(null); state.sync = {rev: 0}; syncUi.last = 0; syncUi.error = ''; saveLocal(); closeSheet(); render(); toast('Account deleted. Your log is still on this phone.');",
             "setAuth(null); clearPhone(); closeSheet(); render(); toast('Account deleted.');")

# a reset link gives a session without the user id; fetch it before syncing
p3 = sub(p3, "setPassword(pw).then(() => { syncUi.error = ''; closeSheet(); toast('Password saved'); syncPull({force: true}); })",
             "setPassword(pw).then(() => authFetch('/auth/v1/user')).then(r => r.ok ? r.json() : null).then(u => { if (u && u.id) { auth.uid = u.id; auth.email = u.email || auth.email; setAuth(auth); } syncUi.error = ''; closeSheet(); toast('Password saved'); render(); syncPull({force: true}); })")

# sign out: push what is pending, then clear the phone
p3 = sub(p3, "function signOut(){ if (auth && auth.access) authFetch('/auth/v1/logout', {method: 'POST'}).catch(() => {}); setAuth(null); state.sync = {rev: 0}; syncUi.last = 0; syncUi.error = ''; saveLocal(); render(); toast('Signed out. Your log stays on this phone.'); }",
             r"""async function signOut(){
  if (!syncReady()) { setAuth(null); render(); return; }
  syncUi.busy = true; syncUi.error = ''; patchSyncLine();
  const ok = await syncPush();
  if (!ok) { syncUi.busy = false; syncUi.error = navigator.onLine === false ? 'You are offline. Connect to sync your latest changes, then sign out.' : 'Could not sync your latest changes. Try again in a moment.'; patchSyncLine(); return; }
  if (auth && auth.access) authFetch('/auth/v1/logout', {method: 'POST'}).catch(() => {});
  setAuth(null); clearPhone(); closeSheet(); render(); toast('Signed out');
}
/* Back to a blank phone: the account keeps the log. */
function clearPhone(){ state = fresh(false); state.ui.view = 'today'; ob = null; syncUi.last = 0; syncUi.error = ''; syncUi.busy = false; lastPushedSig = ''; saveLocal(); }
/* With accounts switched on, the app opens on the sign-in screen until there is a session. */
let gateHold = false;
const gateOn = () => syncReady() && (!signedIn() || gateHold);
function renderGate(){
  const brand = '<div class="obbrand" aria-label="Bearing">' + BRAND.wordmark + '</div>';
  if (gateHold) return '<div class="obq">' + brand + '<h1 class="obh">Loading your log…</h1><p class="muted">One moment.</p></div><div class="small" id="syncline">' + syncLine() + '</div>';
  const has = !state.sample && (state.workouts.length || state.routines.length || state.settings.setupDone);
  return '<div class="obq">' + brand + '<h1 class="obh">Your log, on every phone</h1><p class="muted">Bearing keeps your workouts in a free account, so a new phone or a reinstall gets everything back.' + (has ? ' The log already on this phone comes along.' : '') + '</p></div><div class="card">' + accountForm(true) + '</div><div class="obfoot"><p class="tiny muted" style="margin:0">Your email and your log are all that is stored. The account can be deleted at any time under You.</p></div>';
}""")

# sample data never goes up, and never merges into an account
p3 = sub(p3, "  const str = JSON.stringify(syncDoc()), sig = sigOf(str); if (sig === lastPushedSig) return true;",
             "  if (state.sample) return true;\n  const str = JSON.stringify(syncDoc()), sig = sigOf(str); if (sig === lastPushedSig) return true;")
p3 = sub(p3, "if (!row || !row.doc) { if (state.workouts.length || state.routines.length || state.settings.setupDone) schedulePush(); ok = true; }",
             "if (!row || !row.doc) { if (!state.sample && (state.workouts.length || state.routines.length || state.settings.setupDone)) schedulePush(); ok = true; }")
p3 = sub(p3, "const merged = mergeStates(state, remote), keepUi = state.ui,",
             "const merged = mergeStates(state.sample ? fresh(false) : state, remote), keepUi = state.ui,")

# after signing in, hold the gate until the log is down
p3 = sub(p3, """    if (kind === 'up') await signUp(a.email, a.pw); else await signIn(a.email, a.pw);
    syncUi.busy = false; sheet = null; renderModal(); render(); toast(kind === 'up' ? 'Account created' : 'Signed in');
    await syncPull({force: true, toast: true}); render();
  } catch (e) { syncUi.busy = false; syncUi.error = e.message || 'Something went wrong'; patchSyncLine();""",
             """    if (kind === 'up') await signUp(a.email, a.pw); else await signIn(a.email, a.pw);
    if (state.sample) { const keepUi = state.ui; state = fresh(false); state.ui = keepUi; state.ui.view = 'today'; saveLocal(); }
    gateHold = true; syncUi.busy = false; sheet = null; renderModal(); render();
    await syncPull({force: true});
    gateHold = false; ob = null; state.ui.view = 'today'; render(); toast(kind === 'up' ? 'Account created' : 'Signed in');
  } catch (e) { gateHold = false; syncUi.busy = false; syncUi.error = /fetch|load failed|network/i.test(e.message || '') ? 'Could not reach the server. Check your connection and try again.' : (e.message || 'Something went wrong'); patchSyncLine();""")

# Enter in the password field signs in
p3 = sub(p3, "recoveryFromUrl();\nrender(); renderModal(); nativeBoot();",
             "recoveryFromUrl();\ndocument.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target && e.target.id === 'acct-pw' && !syncUi.busy) { e.preventDefault(); doAuth('in'); } });\nrender(); renderModal(); nativeBoot();")
open('part3.js', 'w', encoding='utf-8').write(p3)
print('patched 5.1')
