/* ---------- elements ---------- */
const app = $('#app'), screenEl = $('#screen'), tabsEl = $('#tabs'), bannerEl = $('#banner'), restEl = $('#restbar'), modalEl = $('#modal');
let sheet = null;

/* ---------- small html helpers ---------- */
const card = inner => '<div class="card">' + inner + '</div>';
function header(title, right){ return '<div class="topbar"><div><h1 class="title">' + esc(title) + '</h1></div>' + (right ? '<div class="small muted" style="padding-bottom:4px">' + right + '</div>' : '') + '</div>'; }
function tile(v, k, sub){ return '<div class="tile"><div class="k">' + k + '</div><div class="v">' + v + '</div>' + (sub ? '<div class="sub">' + sub + '</div>' : '') + '</div>'; }
function setsLabel(sets, time){
  if (!sets.length) return '';
  const ws = new Set(sets.map(s => s.w || 0)), unit = time ? ' s' : '', subs = sets.some(s => s.sub);
  if (ws.size === 1 && !subs) { const w = sets[0].w; return (w ? dispW(w) + ' ' + wUnit() + ' × ' : (time ? '' : 'BW × ')) + sets.map(s => s.r).join(', ') + unit; }
  return sets.map(s => (s.w ? dispW(s.w) : 'BW') + '×' + s.r + unit + (s.sub ? ' + ' + subLabel(s.sub, time) : '')).join(', ');
}
function cardioSetLabel(s){ const parts = []; if (s.ivl) { parts.push(mmss(s.sec)); parts.push(ivlLabel(s.ivl) + (s.ivl.done < s.ivl.rounds ? ', ' + s.ivl.done + ' done' : '')); if (s.mi) parts.push(dispD(s.mi) + ' ' + dUnit()); if (s.load) parts.push(dispW(s.load) + ' ' + wUnit() + ' pack'); return parts.join(' · '); } parts.push(mmss(s.sec)); if (s.speed) parts.push(s.speed + (isKg() ? ' km/h' : ' mph')); if (s.incline) parts.push(s.incline + '%'); if (s.mi) parts.push(dispD(s.mi) + ' ' + dUnit()); const p = paceLabel(s.sec, s.mi); if (p && !s.speed) parts.push(p); if (s.load) parts.push(dispW(s.load) + ' ' + wUnit() + ' pack'); return parts.join(' · '); }
function durOf(w){ return Math.max(0, (w.end - w.start - (w.pausedTotal || 0)) / 1000); }
function workoutMeta(w){ const parts = [durLabel(durOf(w))]; const v = volumeOf(w); if (v) parts.push(fmtVol(v) + ' ' + wUnit()); const c = cardioOf(w); if (c.mi) parts.push(dispD(c.mi) + ' ' + dUnit()); return parts.join(' · '); }
function sumTiles(w){
  const out = [[hms(durOf(w)), 'Duration']];
  const n = setsOf(w); if (n) out.push([n, 'Sets'], [fmtVol(volumeOf(w)), wUnit() + ' lifted']);
  const c = cardioOf(w); if (c.sec) { if (c.mi) out.push([dispD(c.mi), dUnit()], [mmss(paceOf(c.sec, c.mi)), 'per ' + dUnit()]); else out.push([mmss(c.sec), 'cardio']); }
  return out.map(t => '<div><div class="v">' + t[0] + '</div><div class="k">' + t[1] + '</div></div>').join('');
}
function prLines(w){ return '<div class="stack" style="gap:6px;margin-bottom:12px">' + (w.prs || []).map(p => '<div class="prline"><span><b>PR</b> ' + esc(ex(p.ex).name) + '</span><span class="num">' + dispW(p.w) + ' × ' + p.r + ' · est. 1RM ' + dispW(Math.round(p.e1rm)) + '</span></div>').join('') + '</div>'; }
function loggedSummary(a){ const sets = a.entries.reduce((n, en) => n + en.sets.length, 0); const done = a.entries.filter(entryDone).length; return sets + ' set' + (sets === 1 ? '' : 's') + ' logged · ' + done + ' of ' + a.entries.length + ' exercises done'; }
function entryDone(en){ return counted(en.sets).length >= (en.target.sets || 1); }
/* Supersets: an item or entry with pair set is done back to back with the one after it. Pairs only, never chains, and never on the last item. */
function fixPairs(list){ for (let k = 0; k < list.length; k++) { if (!list[k].pair) continue; if (k === list.length - 1 || (k > 0 && list[k - 1].pair)) delete list[k].pair; } return list; }
const pairedWithPrev = (list, k) => k > 0 && !!list[k - 1].pair;
function nextPlanned(dow){ for (let i = 1; i <= 14; i++) { const k = keyOf(addDays(new Date(), i)), rs = planFor(k); if (rs.length) return {name: rs.map(x => x.name).join(' + '), day: i === 1 ? 'tomorrow' : (i < 7 ? DAYS_LONG[dateOf(k).getDay()] : fmtShort(k))}; } return null; }
function toast(msg){ const old = $('.toast'); if (old) old.remove(); const t = document.createElement('div'); t.className = 'toast'; t.textContent = msg; document.body.appendChild(t); setTimeout(() => t.remove(), 1800); }

/* ---------- render ---------- */
function render(){
  const view = state.ui.view;
  if (gateOn()) { bannerEl.innerHTML = ''; screenEl.className = 'screen onboard'; tabsEl.hidden = true; screenEl.innerHTML = renderGate(); renderRest(); save(); return; }
  bannerEl.innerHTML = state.sample ? '<div class="banner"><span>Sample workouts loaded so you can look around.</span><button data-act="fresh-ask">Start fresh</button></div>' : '';
  if (!state.settings.setupDone && !ob) ob = {i: 0};
  if (ob) { bannerEl.innerHTML = ''; screenEl.className = 'screen onboard'; tabsEl.hidden = true; screenEl.innerHTML = renderOnboard(); renderRest(); save(); return; }
  screenEl.className = 'screen' + (view === 'workout' ? ' workout' : '');
  tabsEl.hidden = view === 'workout';
  $$('button', tabsEl).forEach(b => b.classList.toggle('on', b.dataset.tab === view));
  screenEl.innerHTML = view === 'workout' ? renderWorkout() : view === 'history' ? renderHistory() : view === 'progress' ? renderProgress() : view === 'plan' ? renderPlan() : view === 'you' ? renderYou() : renderToday();
  if (view === 'today') syncWeeks();
  renderRest();
  save();
}

/* ---------- first run: profile in a few taps, then build the first routine, pick the training days, and a short how-it-works ---------- */
let ob = null;
function obSteps(){ const t = state.settings.track; return (t.lift ? ['track', 'sex', 'body', 'level'] : ['track', 'sex', 'body']).concat(['recovery', 'routine', 'week', 'how']).concat(window.SITE_BUILD && !isStandalone() ? ['install'] : []); }
function startOnboarding(){ ob = {i: 0}; state.ui.view = 'today'; render(); window.scrollTo(0, 0); }
function obMode(){ const t = state.settings.track; return t.lift && t.cardio ? 'both' : t.lift ? 'lift' : 'cardio'; }
function obRoutine(){ let r = ob && ob.rid ? routine(ob.rid) : null; if (!r) { r = {id: uid(), name: '', items: []}; state.routines.push(r); ob.rid = r.id; } return r; }
function renderOnboard(){
  const steps = obSteps(), key = steps[Math.min(ob.i, steps.length - 1)], n = steps.length, p = state.profile;
  const tile = (act, val, title, sub, on) => '<button class="obtile' + (on ? ' on' : '') + '" data-act="' + act + '" data-v="' + val + '"><span class="t">' + title + '</span>' + (sub ? '<span class="s">' + sub + '</span>' : '') + '</button>';
  const top = '<div class="obtop">' + (ob.i > 0 ? '<button class="btn sm ghost" data-act="ob-back">‹ Back</button>' : '<span></span>') + '<div class="obprog">' + steps.map((s, k) => '<i class="' + (k < ob.i ? 'done' : k === ob.i ? 'cur' : '') + '"></i>').join('') + '</div><button class="btn link small" data-act="ob-skip">Skip</button></div>';
  const stepLine = '<div class="eyebrow">Step ' + (ob.i + 1) + ' of ' + n + '</div>';
  let body = '';
  if (key === 'track') {
    body = '<div class="obq"><div class="obbrand" aria-label="Bearing">' + BRAND.wordmark + '</div>' + stepLine + '<h1 class="obh">What do you track?</h1><p class="muted">You can change this any time under You.</p></div><div class="obtiles">' +
      tile('ob-track', 'both', 'Lifting and cardio', 'The full app, one coach for both') + tile('ob-track', 'lift', 'Lifting only', 'Cardio stays out of the way') + tile('ob-track', 'cardio', 'Cardio only', 'Runs, walks, machines, classes') + '</div>' +
      '<div class="obfoot"><button class="btn link small" data-act="ob-sample">Just looking? Load sample workouts</button></div>';
  } else if (key === 'sex') {
    body = '<div class="obq">' + stepLine + '<h1 class="obh">Sex</h1><p class="muted">Used for strength standards, the athlete score and macros. ' + (syncReady() ? 'Saved to your account, nowhere else.' : 'Nothing leaves this phone.') + '</p></div><div class="obtiles">' +
      tile('ob-sex', 'm', 'Male', '', p.sex === 'm') + tile('ob-sex', 'f', 'Female', '', p.sex === 'f') + tile('ob-sex', '', 'Prefer not to say', 'Standards and macros stay off until you set it') + '</div>';
  } else if (key === 'body') {
    const ages = Array.from({length: 75}, (_, i) => i + 16).map(a => '<option value="' + a + '"' + (a === p.age ? ' selected' : '') + '>' + a + '</option>').join('');
    body = '<div class="obq">' + stepLine + '<h1 class="obh">Body weight and age</h1><p class="muted">Body weight sets your starting weights and the standards. Age adjusts them.</p></div>' +
      '<div class="chips" style="margin-bottom:12px"><button class="chip' + (isKg() ? '' : ' on') + '" data-act="ob-units" data-v="lb">lb · miles</button><button class="chip' + (isKg() ? ' on' : '') + '" data-act="ob-units" data-v="kg">kg · km</button></div>' +
      '<div class="stepper-wrap"><div class="lab"><span>Body weight</span><span>' + wUnit() + '</span></div><div class="stepper"><button type="button" data-act="bw-step" data-d="-1" aria-label="Decrease body weight">−</button><input inputmode="decimal" data-bw="1" value="' + (p.bw ? dispW(p.bw) : '') + '" placeholder="' + (isKg() ? '80' : '180') + '" aria-label="Body weight"><button type="button" data-act="bw-step" data-d="1" aria-label="Increase body weight">+</button></div></div>' +
      '<div class="row" style="margin-top:14px"><span class="grow" style="font-weight:600">Age</span><select class="sm" data-prof="age" style="width:160px"><option value=""' + (p.age ? '' : ' selected') + '>Not set</option>' + ages + '</select></div>' +
      '<div class="obfoot"><button class="btn primary" data-act="ob-next">Continue</button></div>';
  } else if (key === 'level') {
    body = '<div class="obq">' + stepLine + '<h1 class="obh">Lifting experience</h1><p class="muted">Sets how heavy your first session starts. The coach takes over from there.</p></div><div class="obtiles">' +
      tile('ob-level', 'new', 'New to lifting', 'Light starts, learn the movements', p.level === 'new') + tile('ob-level', 'returning', 'Returning after a break', 'Moderate starts, ramps back fast', p.level === 'returning') + tile('ob-level', 'consistent', 'Consistent for a year or more', 'Starts near your level', p.level === 'consistent') + '</div>';
  } else if (key === 'recovery') {
    const rec = state.settings.rec, wOn = waterOn(), any = REC_KINDS.some(k => rec[k[0]]) || wOn;
    body = '<div class="obq">' + stepLine + '<h1 class="obh">Also track</h1><p class="muted">Pick anything you want a quick log for on Today.</p></div><div class="obtiles">' +
      REC_KINDS.map(k => tile('ob-rec', k[0], k[1] + (rec[k[0]] ? ' ✓' : ''), k[0] === 'sauna' ? 'Minutes and temperature' : k[0] === 'cold' ? 'Plunges and ice baths' : 'Jacuzzi and hot soaks', rec[k[0]])).join('') +
      tile('ob-water', 'water', 'Water' + (wOn ? ' ✓' : ''), 'A daily goal from your body weight', wOn) + '</div>' +
      '<div class="obfoot"><button class="btn primary" data-act="ob-next">' + (any ? 'Continue' : 'None of these') + '</button></div>';
  } else if (key === 'routine') {
    const r = obRoutine(), names = r.items.map(it => esc(ex(it.ex).name));
    body = '<div class="obq">' + stepLine + '<h1 class="obh">Build your first routine</h1><p class="muted">Name it, add the exercises you do, and set sets and reps. More routines come later under Plan.</p></div>' +
      '<input class="input" data-rname="' + r.id + '" value="' + esc(r.name) + '" placeholder="Name it, like Push day or Tuesday run" aria-label="Routine name" style="margin-bottom:10px">' +
      '<button class="obtile" data-act="ob-edit-routine"><span class="t">' + (r.items.length ? r.items.length + ' exercise' + (r.items.length === 1 ? '' : 's') : 'Add exercises') + '</span><span class="s clamp">' + (names.length ? names.join(', ') : 'Search the library or type a new one') + '</span></button>' +
      '<div class="obfoot">' + (r.items.length ? '<button class="btn primary" data-act="ob-next">Continue</button>' : '<button class="btn primary" data-act="ob-edit-routine">Add exercises</button><button class="btn link small" data-act="ob-later" style="margin-top:12px">Set this up later</button>') + '</div>';
  } else if (key === 'week') {
    const r = obRoutine(), on = d => (state.plan[d] || []).indexOf(r.id) >= 0, count = [0, 1, 2, 3, 4, 5, 6].filter(on).length;
    body = '<div class="obq">' + stepLine + '<h1 class="obh">Which days?</h1><p class="muted">Tap the days you train. Each one gets ' + (r.name ? esc(r.name) : 'your routine') + ' for now; mix routines under Plan whenever you like.</p></div>' +
      '<div class="obdays">' + [1, 2, 3, 4, 5, 6, 0].map(d => '<button class="obday' + (on(d) ? ' on' : '') + '" data-act="ob-day" data-v="' + d + '" aria-pressed="' + (on(d) ? 'true' : 'false') + '"><span>' + DAYS[d] + '</span>' + (on(d) ? '<i>✓</i>' : '') + '</button>').join('') + '</div>' +
      '<div class="small muted" style="margin-top:12px;text-align:center">' + (count ? count + ' day' + (count === 1 ? '' : 's') + ' a week' : 'Pick at least one day, or continue with a blank week') + '</div>' +
      '<div class="obfoot"><button class="btn primary" data-act="ob-next">Continue</button></div>';
  } else {
    const t = state.settings.track;
    body = '<div class="obq">' + stepLine + '<h1 class="obh">Find your bearing</h1></div><div class="obtiles obhow">' +
      '<div class="obtile"><span class="t">Today tells you what to do</span><span class="s">Your planned routine, with a target for every set' + (t.cardio ? ' and cardio session' : '') + '.</span></div>' +
      '<div class="obtile"><span class="t">Log in one tap</span><span class="s">Hit Log when a set is done. The rest timer starts itself' + (t.lift ? ', warm-ups are filled in for you' : '') + '.</span></div>' +
      '<div class="obtile"><span class="t">The coach adjusts</span><span class="s">Next time it sets the weight' + (t.cardio ? ', pace and incline' : '') + ' from what you actually did, and tells you why.</span></div>' +
      '</div><div class="obfoot"><button class="btn primary" data-act="' + (steps.indexOf('install') >= 0 ? 'ob-next' : 'ob-start') + '">' + (steps.indexOf('install') >= 0 ? 'Continue' : 'Start') + '</button></div>';
  }
  if (key === 'install') {
    const ua = navigator.userAgent, ios = /iphone|ipad|ipod/i.test(ua), android = /android/i.test(ua);
    const share = '<svg viewBox="0 0 24 24" width="18" height="18" style="vertical-align:-3px;margin:0 2px" aria-hidden="true"><path d="M12 3v12M8 7l4-4 4 4M5 12v7a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    const rows = ios ? [['Tap Share', 'The ' + share + ' button at the bottom of Safari'], ['Add to Home Screen', 'Scroll the list and tap it, then tap Add'], ['Open it from your home screen', 'Full screen, works without signal, keeps your history']]
      : android ? [['Open the browser menu', 'The ⋮ at the top right of Chrome'], [installPrompt ? 'Tap Install below' : 'Add to Home screen', installPrompt ? 'Or use the menu item Install app' : 'Also called Install app on some phones'], ['Open it from your home screen', 'Full screen, works without signal, keeps your history']]
      : [['Open the browser menu', 'Look for Add to Home Screen or Install'], ['Add it', 'Confirm the name Bearing'], ['Open it from your home screen', 'Full screen, works without signal']];
    body = '<div class="obq">' + stepLine + '<h1 class="obh">Put it on your phone</h1><p class="muted">Bearing runs as an app once it is on your home screen. ' + (syncReady() ? 'Your log is in your account either way.' : 'Your log stays on this phone either way.') + '</p></div><div class="obtiles obhow">' +
      rows.map((r, k) => '<div class="obtile"><span class="t">' + (k + 1) + '. ' + r[0] + '</span><span class="s">' + r[1] + '</span></div>').join('') + '</div>' +
      '<div class="obfoot">' + (installPrompt ? '<button class="btn primary" data-act="ob-install">Install Bearing</button><button class="btn link small" data-act="ob-start" style="margin-top:12px">Skip for now</button>' : '<button class="btn primary" data-act="ob-start">Got it, start</button>') + '</div>';
  }
  return '<div class="ob">' + top + body + '</div>';
}
function obFinish(){
  if (ob && ob.rid) { const r = routine(ob.rid); if (r) { if (!r.items.length) { state.routines = state.routines.filter(x => x.id !== r.id); for (const d in state.plan) state.plan[d] = (state.plan[d] || []).filter(x => x !== r.id); } else if (!r.name.trim()) r.name = 'My routine'; } }
  state.settings.setupDone = true; state.since = todayKey(); ob = null;
  state.ui.view = 'today';
  saveNow(); render(); window.scrollTo(0, 0);
}

/* Today */
function renderToday(){
  const tk = todayKey(), dow = new Date().getDay();
  const rs = planFor(tk), r = rs[0] || null;
  const done = workoutsOn(tk), remaining = rs.filter(x => !done.some(w => w.routine === x.id));
  const ws = weekStart(tk), keys = weekKeys(ws);
  const doneWeek = state.workouts.filter(w => w.date >= ws && w.date <= keys[6]).length;
  let title, main;
  if (state.active) {
    const a = state.active; title = a.name;
    main = card('<div class="eyebrow">In progress · started ' + fmtTime(a.start) + '</div>' +
      '<div class="between" style="margin:6px 0 10px"><div class="h2">' + esc(a.name) + '</div><div class="big num" id="elapsed">' + hms(elapsedSec(a)) + '</div></div>' +
      '<div class="muted small" style="margin-bottom:12px">' + loggedSummary(a) + '</div>' +
      '<button class="btn primary" data-act="resume">Resume workout</button>');
  } else if (done.length) {
    title = done.length > 1 ? done.length + ' sessions today' : 'Done for today';
    main = card(done.slice().sort((x, y) => x.start - y.start).map((w, k) => (k ? '<div class="divider" style="margin:12px 0"></div>' : '') + '<div class="between"><div class="eyebrow">' + esc(w.name) + ' · ' + fmtTime(w.start) + '</div><button class="btn link small" data-act="hist-open" data-id="' + w.id + '">Details</button></div>' +
      '<div class="sumgrid" style="margin:10px 0 ' + (w.prs && w.prs.length ? '10px' : '0') + '">' + sumTiles(w) + '</div>' + (w.prs && w.prs.length ? prLines(w) : '')).join('') +
      (remaining.length ? '<div class="divider" style="margin:14px 0 12px"></div><div class="eyebrow" style="margin-bottom:8px">Still planned today</div>' + remaining.map(x => '<div class="between" style="margin-bottom:8px"><b>' + esc(x.name) + '</b><button class="btn sm" data-act="start" data-rid="' + x.id + '">Start</button></div>').join('') : '') +
      '<button class="btn secondary" style="margin-top:' + (remaining.length ? '6px' : '14px') + '" data-act="pick-routine">Start another workout</button>' + easyLine(remaining.length ? remaining[0].id : ''));
  } else if (r) {
    title = rs.length === 1 ? r.name + ' day' : rs.map(x => x.name).join(' + ');
    main = card('<div class="card-head"><div><div class="eyebrow">Today\'s plan' + (rs.length > 1 ? ' · ' + rs.length + ' routines' : '') + '</div><div class="h2">' + esc(r.name) + '</div></div><button class="btn sm ghost" data-act="pick-routine">Swap</button></div>' +
      '<div class="stack" style="gap:8px;margin-bottom:14px">' + r.items.map(itemLine).join('') + '</div>' +
      '<button class="btn primary" data-act="start" data-rid="' + r.id + '">Start ' + (rs.length > 1 ? esc(r.name.toLowerCase()) : 'workout') + '</button>' + easyLine(r.id) +
      rs.slice(1).map(x => '<div class="divider" style="margin:14px 0 12px"></div><div class="h2" style="margin-bottom:8px">' + esc(x.name) + '</div><div class="stack" style="gap:8px;margin-bottom:12px">' + x.items.map(itemLine).join('') + '</div><button class="btn secondary" data-act="start" data-rid="' + x.id + '">Start ' + esc(x.name.toLowerCase()) + '</button>').join(''));
  } else {
    title = 'Rest day'; const next = nextPlanned(dow);
    main = card('<div class="eyebrow">Hold your bearing</div>' +
      '<p style="margin:6px 0 14px">' + (next ? 'Next up: <b>' + esc(next.name) + '</b> ' + next.day + '.' : 'Nothing planned yet. Build your week under Plan.') + '</p>' +
      '<button class="btn secondary" data-act="pick-routine">Train anyway</button>' + easyLine(''));
  }
  if (selDay && selDay !== tk) main = dayCard(selDay);
  return '<div class="masthead"><span class="brand" role="img" aria-label="Bearing">' + BRAND.wordmark + '</span></div>' +
    '<div class="topbar"><div><div class="eyebrow">' + fmtLong(tk) + '</div><h1 class="title">' + esc(title) + '</h1></div></div>' +
    '<div class="stack">' + weeksStrip(ws) + main + recoveryCard(tk) + waterCard(tk) + installCard() + backupCard() + bwNudge() + metricsTiles() + recentCard() + '</div>';
}
/* A finished workout becomes a routine: each exercise keeps its set count and the rep range you actually hit. */
/* Did the workout drift from its routine: exercises added, removed, swapped or reordered? Skipped exercises still count as kept. */
function workoutOrder(w){ const list = w.order || w.entries.map(en => Object.assign({ex: en.ex}, en.target ? {target: en.target} : {}, en.pair ? {pair: true} : {}, en.swapped ? {swapped: en.swapped} : {})); const replaced = {}; list.forEach(o => { if (o.swapped) replaced[o.swapped] = o.ex; }); return list.filter(o => !replaced[o.ex]); }
function routineChanged(w, r){ if (!r) return false; return JSON.stringify(workoutOrder(w).map(o => o.ex)) !== JSON.stringify(r.items.map(it => it.ex)); }
/* Rewrite the routine to match the workout: today's exercises in today's order. Exercises already in the routine keep their sets and reps; a swap inherits the old exercise's; new ones take their targets from today. */
function updateRoutineFromWorkout(w, r){
  const items = [];
  for (const o of workoutOrder(w)) {
    const e = ex(o.ex), old = r.items.find(it => it.ex === o.ex) || (o.swapped ? r.items.find(it => it.ex === o.swapped) : null);
    if (old) { items.push(Object.assign({}, old, {ex: o.ex, pair: !!o.pair})); continue; }
    const en = w.entries.find(x => x.ex === o.ex), t = o.target || {}, sets = en ? en.sets : [];
    if (e.type === 'cardio') { items.push({ex: o.ex, sets: 1, min: t.min || Math.max(5, Math.round(sets.reduce((n, s) => n + (s.sec || 0), 0) / 60 / 5) * 5) || 20, pair: !!o.pair}); continue; }
    const ws = counted(sets).length ? counted(sets) : working(sets), reps = ws.map(s => s.r || 0).filter(Boolean), lo = reps.length ? Math.min.apply(null, reps) : (e.time ? 30 : 8), hi = reps.length ? Math.max.apply(null, reps) : lo;
    const it = e.time ? {ex: o.ex, sets: t.sets || ws.length || 3, reps: t.reps || Math.round(lo / 5) * 5 || 30} : {ex: o.ex, sets: t.sets || ws.length || 3, reps: t.reps || lo, hi: t.hi || Math.max(lo, hi)};
    if (t.fail) it.fail = true; if (o.pair) it.pair = true; items.push(it);
  }
  r.items = items; fixPairs(r.items);
}
function routineFromWorkout(w){
  const items = [];
  for (const en of w.entries) {
    const e = ex(en.ex); if (!en.sets.length) continue;
    if (e.type === 'cardio') { const sec = en.sets.reduce((n, s) => n + (s.sec || 0), 0); items.push({ex: en.ex, sets: 1, min: Math.max(5, Math.round(sec / 60 / 5) * 5) || 20}); continue; }
    const ws = counted(en.sets).length ? counted(en.sets) : working(en.sets); if (!ws.length) continue;
    const reps = ws.map(s => s.r || 0).filter(Boolean), lo = reps.length ? Math.min.apply(null, reps) : (e.time ? 30 : 8), hi = reps.length ? Math.max.apply(null, reps) : lo;
    items.push(e.time ? {ex: en.ex, sets: ws.length, reps: Math.round(lo / 5) * 5 || 30} : (ws.every(s => s.amrap) ? {ex: en.ex, sets: ws.length, reps: lo, hi: Math.max(lo, hi), fail: true} : {ex: en.ex, sets: ws.length, reps: lo, hi: Math.max(lo, hi)}));
  }
  w.entries.forEach((en, k) => { if (en.pair && items[k] && items[k + 1]) items[k].pair = true; });
  const base = w.name && w.name !== 'Workout' ? w.name : 'New routine', names = state.routines.map(r => r.name);
  let name = base, n = 2; while (names.indexOf(name) >= 0) name = base + ' ' + n++;
  const r = {id: uid(), name: name, items: items}; state.routines.push(r); return r;
}
/* Recovery: a one-line card on Today. Tap a kind, set the minutes, log it; today's sessions sit under it with an × each. */
/* Feeling off: a light day or a light week, offered under the day's plan. */
function easyLine(rid){
  if (lightWeekOn()) return '<div class="tiny muted" style="margin-top:10px">Light week through ' + fmtShort(state.settings.lightUntil) + ': every workout runs at 85% and nothing counts against the plan. <button class="btn link small" data-act="easy-off">Back to normal</button></div>';
  return '<div style="margin-top:8px"><button class="btn link small" data-act="easy-open" data-rid="' + esc(rid || '') + '">Feeling off? Take it easy ›</button></div>';
}
function waterCard(tk){
  if (!waterOn()) return '';
  const g = waterGoal(tk), tot = waterTotal(tk), pct = clamp(100 * tot / g.total, 0, 100), u = waterUnit(), logs = waterLogs(tk);
  const days = Array.from({length: 7}, (_, k) => keyOf(addDays(new Date(), k - 6)));
  const bars = days.map(d => { const t = waterTotal(d), goal = waterGoal(d).total, h = t ? clamp(Math.round(100 * t / goal), 8, 100) : 0; return '<span class="wday' + (d === tk ? ' today' : '') + (t >= goal ? ' hit' : '') + '"><i style="--h:' + h + '%"></i><small>' + 'SMTWTFS'[dateOf(d).getDay()] + '</small></span>'; }).join('');
  return '<div class="card flat" style="padding:12px 14px"><div class="between"><div class="eyebrow">Water</div><div class="tiny muted">goal ' + dispVol(g.total) + ' ' + u + (logs.length ? ' · <button class="btn link small" data-act="water-undo">Undo</button>' : '') + '</div></div>' +
    '<div class="row" style="align-items:baseline;gap:6px;margin-top:4px"><span class="big num" style="font-size:32px">' + dispVol(tot) + '</span><span class="muted">/ ' + dispVol(g.total) + ' ' + u + (tot >= g.total ? ' · goal hit' : '') + '</span></div>' +
    '<div class="lvlbar" style="margin-top:8px"><i style="width:' + pct + '%"></i></div>' +
    '<div class="tiny muted" style="margin-top:6px">' + esc(waterWhy(tk)) + (g.auto && !state.profile.bw ? ' <button class="btn link small" data-tab="you">Open You</button>' : '') + '</div>' +
    '<div class="row wrap" style="gap:6px;margin-top:10px">' + WATER_QUICK().map(v => '<button class="btn sm" data-act="water-add" data-v="' + v + '">+' + v + ' ' + u + '</button>').join('') + '<button class="btn sm ghost" data-act="water-open">Other</button></div>' +
    '<div class="wdays">' + bars + '</div></div>';
}
function waterLine(date){ const t = waterTotal(date); return t ? '<div class="tiny muted" style="margin-top:6px">Water ' + dispVol(t) + ' ' + waterUnit() + ' of ' + dispVol(waterGoal(date).total) + '</div>' : ''; }
function recoveryCard(tk){
  if (!recoveryOn()) return '';
  const today = recoveryOn_(tk);
  return '<div class="card flat" style="padding:12px 14px"><div class="between"><div class="eyebrow">Recovery</div><div class="row" style="gap:6px">' + recKinds().map(k => '<button class="btn sm" data-act="rec-open" data-k="' + k[0] + '">' + k[1] + '</button>').join('') + '</div></div>' +
    (today.length ? '<div class="row wrap" style="gap:6px;margin-top:8px">' + today.map(r => '<span class="chip on" style="gap:8px">' + recKind(r.kind)[1] + ' · ' + r.min + ' min' + (r.temp ? ' · ' + dispT(r.temp) + '°' : '') + '<button class="x" data-act="rec-del" data-id="' + r.id + '" aria-label="Remove" style="margin:-4px -8px -4px 0">×</button></span>').join('') + '</div>' : '') + '</div>';
}
function recoveryLines(date){ const list = recoveryOn_(date); return list.length ? '<div class="tiny muted" style="margin-top:8px">' + list.map(r => recKind(r.kind)[1] + ' ' + r.min + ' min' + (r.temp ? ' at ' + dispT(r.temp) + '°' : '')).join(' · ') + '</div>' : ''; }
/* Installable: an Add to Home Screen card (site build only), and a backup reminder once there is history worth keeping. */
let installPrompt = null;
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); installPrompt = e; if (state && state.ui.view === 'today' && !ob) render(); });
const isStandalone = () => !!((window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || navigator.standalone);
function installCard(){
  if (!window.SITE_BUILD || isStandalone() || state.settings.a2hs === 'off') return '';
  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const text = ios ? 'Tap Share in Safari, then "Add to Home Screen." It opens full screen, works without signal, and keeps your history safe.' : (installPrompt ? 'Install it for a full-screen app that works without signal.' : 'Open your browser menu and choose "Add to Home Screen" for a full-screen app that works without signal.');
  const ic = document.querySelector('link[rel="apple-touch-icon"]');
  return '<div class="card flat" style="padding:12px 14px"><div class="between"><div class="row" style="gap:12px">' + (ic ? '<img class="appicon" src="' + ic.href + '" alt="">' : '') + '<div><div class="eyebrow">Put it on your home screen</div><div class="small">' + text + '</div></div></div><div class="row" style="gap:6px;flex:none">' + (installPrompt ? '<button class="btn sm" data-act="install">Install</button>' : '') + '<button class="btn sm ghost" data-act="a2hs-off" aria-label="Dismiss">×</button></div></div></div>';
}
function backupCard(){
  const s = state.settings; if (state.workouts.length < 3 || state.sample) return '';
  if (syncReady() && signedIn()) return '';
  if (syncReady()) { const snooze = s.acctSnooze || 0; if (Date.now() - snooze < 14 * 86400000) return ''; return '<div class="card flat" style="padding:12px 14px"><div class="between"><div><div class="eyebrow">Keep it safe</div><div class="small">Sign in once and your log comes back on any phone, no backups to paste.</div></div><div class="row" style="gap:6px;flex:none"><button class="btn sm" data-tab="you">Sign in</button><button class="btn sm ghost" data-act="acct-later" aria-label="Later">×</button></div></div></div>'; }
  const now = Date.now(), last = s.lastBackup || 0, snooze = s.backupSnooze || 0;
  if (now - last < 14 * 86400000 || now - snooze < 14 * 86400000) return '';
  return '<div class="card flat" style="padding:12px 14px"><div class="between"><div><div class="eyebrow">Backup</div><div class="small">' + (last ? 'It has been a couple of weeks since your last backup.' : 'Your history lives only on this phone. Copy a backup now and then.') + '</div></div><div class="row" style="gap:6px;flex:none"><button class="btn sm" data-act="backup">Copy</button><button class="btn sm ghost" data-act="backup-later" aria-label="Later">×</button></div></div></div>';
}
/* The week strip: this week and the weeks before it, back to 30 days ago. Swipe back to look, tap a day to open it. */
const DAYS_BACK = 30;
const weeksBack = () => { const tk = todayKey(); return Math.ceil((DAYS_BACK - Math.round((dateOf(tk) - dateOf(weekStart(tk))) / 86400000)) / 7); };
let weekBack = 0, selDay = null;
function weekPageLabel(b){
  const cur = weekStart(todayKey()), ws = keyOf(addDays(dateOf(cur), -7 * b)), end = keyOf(addDays(dateOf(ws), 6));
  const n = state.workouts.filter(w => w.date >= ws && w.date <= end).length, planned = end >= (state.since || end) ? weeklyTarget() : 0;
  const name = b === 0 ? 'This week' : b === 1 ? 'Last week' : 'Week of ' + fmtShort(ws);
  return name + (planned ? ' · ' + n + ' of ' + planned : (n ? ' · ' + n + ' logged' : ''));
}
function weekNav(){
  const wb = weeksBack();
  return '<button class="btn sm ghost" data-act="week-move" data-d="1" aria-label="Earlier week"' + (weekBack < wb ? '' : ' disabled') + '>‹</button><div class="small muted grow" id="weeklabel" style="text-align:center">' + weekPageLabel(weekBack) + '</div>' +
    (weekBack || selDay ? '<button class="btn sm" data-act="day-today">Today</button>' : '<span class="btn sm" style="visibility:hidden" aria-hidden="true">Today</span>');
}
function weeksStrip(cur){
  const wb = weeksBack(), pages = []; weekBack = clamp(weekBack, 0, wb);
  for (let b = wb; b >= 0; b--) { const ws = keyOf(addDays(dateOf(cur), -7 * b)); pages.push('<div class="week">' + weekKeys(ws).map(dayCell).join('') + '</div>'); }
  return '<div class="weeknav" id="weeknav">' + weekNav() + '</div><div class="weeks" id="weeks">' + pages.join('') + '</div>';
}
const weekPageWidth = el => (el.firstElementChild ? el.firstElementChild.offsetWidth : el.clientWidth) || 1;
function syncWeeks(){
  const el = $('#weeks'); if (!el) return;
  el.scrollLeft = Math.round(weekPageWidth(el) * (weeksBack() - weekBack));
}
function refreshWeekNav(){ const nav = $('#weeknav'); if (nav) nav.innerHTML = weekNav(); }
function onWeeksScroll(el){
  const wb = weeksBack(), b = clamp(wb - Math.round(el.scrollLeft / weekPageWidth(el)), 0, wb);
  if (b === weekBack) return; weekBack = b; refreshWeekNav();
}
function moveWeek(d){
  weekBack = clamp(weekBack + d, 0, weeksBack());
  const el = $('#weeks'); if (el) el.scrollTo({left: weekPageWidth(el) * (weeksBack() - weekBack), behavior: 'smooth'});
  refreshWeekNav();
}
function dayCard(k){
  const tk = todayKey(), list = workoutsOn(k).slice().sort((a, b) => a.start - b.start), dow = dateOf(k).getDay(), rs = planFor(k), r = rs[0] || null;
  const head = '<div class="card-head"><div><div class="eyebrow">' + (k < tk ? 'Looking back' : 'Coming up') + '</div><div class="h2">' + esc(fmtLong(k)) + '</div></div><button class="btn sm ghost" data-act="day-today">Back to today</button></div>';
  let body;
  if (list.length) {
    body = list.map((w, i) => (i ? '<div class="divider" style="margin:12px 0"></div>' : '') + '<div class="between"><div><b>' + esc(w.name) + '</b> <span class="muted small">· ' + fmtTime(w.start) + '</span></div><div class="muted small num">' + workoutMeta(w) + '</div></div>' +
      '<div class="stack" style="gap:4px;margin:8px 0 10px">' + w.entries.filter(en => en.sets.length).map(en => { const e = ex(en.ex), pr = (w.prs || []).some(p => p.ex === en.ex); return '<div class="between small"><span class="ellip">' + esc(e.name) + (pr ? ' <span class="pill pr">PR</span>' : '') + '</span><span class="muted num" style="white-space:nowrap">' + entryLine(en) + '</span></div>'; }).join('') + '</div>' +
      '<div class="row" style="gap:14px"><button class="btn link small" data-act="hist-open" data-id="' + w.id + '">Details</button><button class="btn link small" data-act="share" data-id="' + w.id + '">Share</button><button class="btn link small" data-act="reopen" data-id="' + w.id + '">Reopen</button></div>').join('');
  } else if (k < tk) {
    body = '<p class="small muted" style="margin:0">' + (r && k >= (state.since || tk) ? esc(rs.map(x => x.name).join(' and ')) + (rs.length > 1 ? ' were' : ' was') + ' planned and not logged.' : 'Rest day. Nothing logged.') + '</p>';
  } else if (r) {
    body = rs.map((x, i) => (i ? '<div class="divider" style="margin:14px 0 12px"></div>' : '') + '<div class="eyebrow" style="margin-bottom:8px">Planned · ' + esc(x.name) + '</div><div class="stack" style="gap:8px;margin-bottom:14px">' + x.items.map(itemLine).join('') + '</div>' + (state.active ? '' : '<button class="btn secondary" data-act="start" data-rid="' + x.id + '">Start it now instead</button>')).join('');
  } else {
    const next = nextPlanned(dow);
    body = '<p class="small muted" style="margin:0">Rest day. ' + (next ? 'Next up: <b>' + esc(next.name) + '</b> ' + (next.day === 'tomorrow' ? 'the day after' : next.day) + '.' : 'Nothing planned after this.') + '</p>';
  }
  return '<div class="card">' + head + body + (recoveryOn() ? recoveryLines(k) : '') + (waterOn() ? waterLine(k) : '') + '</div>';
}
function bwNudge(){
  const s = state.settings; if (!s.bwReminderDays) return '';
  const list = state.bodyweights.slice().sort((a, b) => a.date < b.date ? -1 : 1), last = list[list.length - 1];
  if (last && last.date > keyOf(addDays(new Date(), -s.bwReminderDays))) return '';
  return '<div class="card flat" style="padding:12px 14px"><div class="between"><div><div class="eyebrow">Body weight</div><div class="small">' + (last ? 'Last logged ' + relDay(last.date).toLowerCase() + '. Time for a new one.' : 'Log your first weigh-in.') + '</div></div><button class="btn sm" data-tab="you">Log it</button></div></div>';
}
function metricsTiles(){
  const m = state.settings.metrics, d7 = keyOf(addDays(new Date(), -6)), d30 = keyOf(addDays(new Date(), -30));
  const days = from => new Set(state.workouts.filter(w => w.date >= from).map(w => w.date)).size;
  const lifted = from => state.workouts.filter(w => w.date >= from).reduce((n, w) => n + volumeOf(w), 0);
  const miles = (from, ids) => state.workouts.filter(w => w.date >= from).reduce((n, w) => n + w.entries.filter(en => ids.indexOf(en.ex) >= 0).reduce((a, en) => a + en.sets.reduce((b, s) => b + (s.mi || 0), 0), 0), 0);
  const tiles = [];
  if (m.score && scoreOn()) { const sc = athleteScore(); tiles.push('<button class="tile tap" data-tab="progress" aria-label="Athlete score, open Progress"><span class="k">Athlete score</span><span class="v">' + (sc.total === null ? 'n/a' : sc.total + '<small>of 100</small>') + '</span><span class="sub">' + (sc.total === null ? (state.workouts.length ? 'add body weight and sex' : 'after your first workout') : scoreDeltaText() + ' · ' + sc.band.toLowerCase()) + '</span></button>'); }
  else if (m.score && liftOn()) { const st = strengthStanding(); tiles.push('<button class="tile tap" data-tab="progress" aria-label="Strength level, open Progress"><span class="k">Strength level</span><span class="v word">' + (st.label ? esc(st.label) : 'n/a') + '</span><span class="sub">' + (st.label ? (st.next ? esc(nextStandardLine(st, true)) : st.at + ' of ' + st.ranked.length + ' lifts at ' + st.label.toLowerCase() + ' or above') : (st.rows.length ? 'add body weight and sex' : 'after your first lift')) + '</span></button>'); }
  if (m.days7) { const wk = days(weekStart(todayKey())), tg = weeklyTarget(); tiles.push(tile(tg ? wk + '<small>of ' + tg + '</small>' : wk, 'This week', tg ? (wk >= tg ? 'goal hit · ' : '') + 'workout days, goal ' + tg : 'workout days since Monday')); }
  if (m.days30) tiles.push(tile(days(d30), 'Workout days', 'last 30 days'));
  if (m.days60) tiles.push(tile(days(keyOf(addDays(new Date(), -60))), 'Workout days', 'last 60 days'));
  if (m.days90) tiles.push(tile(days(keyOf(addDays(new Date(), -90))), 'Workout days', 'last 90 days'));
  if (m.lifted7 && liftOn()) tiles.push(tile(fmtVol(lifted(d7)), 'Lifted', wUnit() + ', last 7 days'));
  if (m.lifted30 && liftOn()) tiles.push(tile(fmtVol(lifted(d30)), 'Lifted', wUnit() + ', last 30 days'));
  if (m.cardio7 && cardioOn()) { const min = Math.round(state.workouts.filter(w => w.date >= d7).reduce((n, w) => n + cardioOf(w).sec, 0) / 60); tiles.push(tile(min, 'Cardio', 'minutes, last 7 days')); }
  if (m.bwChange) { const list = state.bodyweights.slice().sort((a, b) => a.date < b.date ? -1 : 1), last = list[list.length - 1], first = list.find(x => x.date >= d30); const delta = last && first && first !== last ? last.lb - first.lb : null; tiles.push(tile(delta === null ? 'n/a' : (delta > 0 ? '+' : '') + dispW(Math.round(delta * 10) / 10), 'Body weight', delta === null ? 'log twice to see the change' : wUnit() + ' over 30 days')); }
  if (m.run && cardioOn()) tiles.push(tile(dispD(miles(d30, ['run', 'treadmill', 'sprints'])), 'Run', dUnit() + ', last 30 days'));
  if (m.walk && cardioOn()) tiles.push(tile(dispD(miles(d30, ['walk', 'inclinewalk', 'hike'])), 'Walked', dUnit() + ', last 30 days'));
  if (m.cycle && cardioOn()) tiles.push(tile(dispD(miles(d30, ['bike', 'assaultbike'])), 'Cycled', dUnit() + ', last 30 days'));
  if (m.swim && cardioOn()) tiles.push(tile(dispD(miles(d30, ['swim'])), 'Swam', dUnit() + ', last 30 days'));
  for (const k of recKinds()) { if (m[k[0] + '7']) { const list = recoverySince(d7, k[0]); tiles.push(tile(list.length, k[1], list.length ? list.reduce((n, r) => n + r.min, 0) + ' min, last 7 days' : 'sessions, last 7 days')); } }
  return tiles.length ? '<div class="tiles">' + tiles.join('') + '</div>' : '';
}
function itemLine(it){
  const e = ex(it.ex), last = lastPerformance(it.ex);
  const target = e.type === 'cardio' ? (it.min ? it.min + ' min' : '') : (it.sets + ' × ' + rangeLabel(it) + (e.time ? ' s' : ''));
  const lastTxt = last ? (e.type === 'cardio' ? cardioSetLabel(last.sets[0]) : setsLabel(last.sets, e.time)) : 'first time';
  return '<div class="between"><div class="grow"><div class="ellip" style="font-weight:600">' + esc(e.name) + '</div><div class="tiny muted ellip">Last: ' + lastTxt + '</div></div><div class="num muted" style="font-family:var(--display);font-size:19px;font-weight:600;white-space:nowrap">' + target + '</div></div>';
}
function dayCell(k){
  const dow = dateOf(k).getDay(), tk = todayKey();
  const did = workoutsOn(k).length > 0, planned = planFor(k).length > 0, before = k < (state.since || tk);
  const dot = did ? 'done' : (!planned || before ? 'rest' : (k < tk ? 'missed' : 'plan'));
  return '<button class="day' + (k === tk ? ' today' : '') + (selDay === k ? ' sel' : '') + '" data-act="day" data-k="' + k + '" aria-label="' + fmtLong(k) + '"><span>' + DAYS[dow] + '</span><span class="dnum num">' + dateOf(k).getDate() + '</span><i class="dot ' + dot + '"></i></button>';
}
function recentCard(){
  const ws = sortedWorkouts().filter(w => w.date !== todayKey()); if (!ws.length) return '';
  const w = ws[0];
  return '<div class="card flat" style="padding:12px 14px"><div class="eyebrow">Last workout</div><div class="between" style="margin-top:4px"><div><b>' + esc(w.name) + '</b> <span class="muted">· ' + relDay(w.date) + '</span></div><div class="muted small num" style="text-align:right">' + workoutMeta(w) + '</div></div></div>';
}

/* Workout */
function renderWorkout(){
  const a = state.active; if (!a) { state.ui.view = 'today'; return renderToday(); }
  const dots = a.entries.map((en, i) => '<i class="' + (i === a.idx ? 'cur' : (entryDone(en) ? 'done' : '')) + '"></i>').join('');
  fixPairs(a.entries);
  const one = (en, i) => (i === a.idx ? expandedEntry(en, i) : collapsedEntry(en, i));
  let body = '';
  for (let i = 0; i < a.entries.length; i++) {
    const en = a.entries[i];
    if (en.pair && a.entries[i + 1]) { const b = a.entries[i + 1], open = a.idx === i || a.idx === i + 1; body += '<div class="superset' + (open ? ' open' : '') + '"><div class="sshead"><span class="eyebrow">Superset</span><span class="tiny muted">' + esc(ex(en.ex).name) + ' + ' + esc(ex(b.ex).name) + ' · no rest between, rest after the pair</span></div>' + one(en, i) + one(b, i + 1) + '</div>'; i++; continue; }
    body += one(en, i);
  }
  const t = state.timer, left = t ? (t.end - Date.now()) / 1000 : null;
  const restLine = a.pausedAt ? 'Paused' : (t ? (left > 0 ? 'Rest ' + mmss(left) : 'Rest done') : '');
  return '<div class="whead"><button class="btn sm ghost" data-act="leave">‹ Today</button><div style="text-align:center"><div class="eyebrow">' + esc(a.name) + '</div><div class="elapsed num" id="elapsed">' + hms(elapsedSec(a)) + '</div><div class="tiny num" id="hrest" style="color:var(--accent);min-height:15px">' + restLine + '</div></div><div class="row" style="gap:6px"><button class="btn sm ghost" data-act="pause" aria-label="' + (a.pausedAt ? 'Resume' : 'Pause') + '">' + (a.pausedAt ? 'Resume' : 'Pause') + '</button><button class="btn sm good" data-act="finish">Finish</button></div></div>' +
    lightRow(a) +
    (a.entries.length ? '<div class="between" style="margin-bottom:10px"><div class="dots">' + dots + '</div><div class="tiny muted">' + (a.idx + 1) + ' of ' + a.entries.length + '</div></div>' : '') +
    '<div class="stack">' + (body || '<div class="card empty">Add an exercise to get going.</div>') + '<button class="btn secondary ghost" data-act="add-ex">+ Add exercise</button></div>';
}
function lightRow(a){
  return '<div class="lightrow' + (a.light ? ' on' : '') + '">' + (a.light ? '<span><b>Light day</b> · 85%, nothing counts against the plan</span><button class="btn link small" data-act="light-toggle">Back to normal</button>' : '<span class="muted">Feeling off?</span><button class="btn link small" data-act="light-toggle">Make it a light day</button>') + '</div>';
}
/* Flipping light mid-workout re-runs the coach for every exercise not started yet; started ones keep their numbers. */
function setLight(on){
  const a = state.active; if (!a || !!a.light === !!on) return; a.light = !!on;
  a.entries.forEach((en, i) => {
    const e = ex(en.ex); if (counted(en.sets).length || en.adj) return;
    if (e.type === 'cardio') { const base = recommendCardio(en.ex, en.target); if (on) { const min = Math.max(5, Math.round((base && base.code !== 'FIRST' ? base.min : en.draft.min) * 0.75)); en.rec = Object.assign({}, base || {}, {code: 'LIGHT', min: min, base: base}); en.draft.min = min; } else { en.rec = base; en.draft.min = base && base.code !== 'FIRST' ? base.min : (en.target.min || en.draft.min); } if (en.draft.speed) en.draft.mi = toMi(Math.round(en.draft.speed * en.draft.min / 60 * 100) / 100); return; }
    if (e.time) return;
    const base = recommend(en.ex, en.target); en.rec = on ? lightRec(base, e) : base;
    if (en.rec && en.rec.w !== null) { en.draft.w = en.rec.w; en.draft.r = en.rec.goals[0]; refreshWarmups(i); if (en.draft.sub) subRefresh(en.draft.sub, en.draft, e); }
  });
  save(); render(); toast(on ? 'Light day: 85% of the plan, nothing counts against it' : 'Back to the plan');
}
function adjItems(en, e, i){
  if (e.type !== 'lift' || e.time || !en.rec || en.rec.w === null || state.active.light) return '';
  const base = en.rec.base || en.rec, last = lastPerformance(en.ex), lastW = last ? workingWeight(last.sets) : 0, u = wUnit();
  if (en.adj) return '<button class="item" data-act="adj" data-i="' + i + '" data-k=""><span>Follow the coach again</span><span class="g">' + dispW(base.w) + ' ' + u + '</span></button>';
  let h = '';
  if (lastW && base.w > lastW + 0.01) h += '<button class="item" data-act="adj" data-i="' + i + '" data-k="hold"><span>Hold at last weight</span><span class="g">' + dispW(lastW) + ' ' + u + ' · plan stays put</span></button>';
  if (base.w > 0) h += '<button class="item" data-act="adj" data-i="' + i + '" data-k="light"><span>Take 10% off today</span><span class="g">' + dispW(roundInc(base.w * 0.9, e)) + ' ' + u + ' · plan stays put</span></button>';
  return h;
}
function collapsedEntry(en, i){
  const e = ex(en.ex), t = en.target, done = entryDone(en), started = counted(en.sets).length > 0;
  const meta = e.type === 'cardio' ? (en.sets.length ? cardioSetLabel(en.sets[0]) : (t.min ? t.min + ' min planned' : 'Cardio')) : (started ? setsLabel(working(en.sets), e.time) : (t.sets + ' × ' + rangeLabel(t) + (e.time ? ' s' : '')));
  return '<button class="exrow' + (done ? ' done' : '') + '" data-act="focus" data-i="' + i + '" data-sort="workout" data-si="' + i + '"><div class="grow"><div class="name ellip">' + esc(e.name) + (en.skipped && !done ? ' <span class="tiny muted">skipped for now</span>' : '') + '</div><div class="meta ellip">' + meta + '</div></div><div class="prog">' + counted(en.sets).length + '/' + (t.sets || 1) + '</div>' + GRIP + '</button>';
}
const GRIP = '<span class="grip" data-grip aria-label="Drag to reorder" title="Drag to reorder"><svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true"><circle cx="7" cy="4.5" r="1.7"/><circle cx="13" cy="4.5" r="1.7"/><circle cx="7" cy="10" r="1.7"/><circle cx="13" cy="10" r="1.7"/><circle cx="7" cy="15.5" r="1.7"/><circle cx="13" cy="15.5" r="1.7"/></svg></span>';

function cardioTargetLines(en, e){
  const r = en.rec, d = en.draft; if (!r || en.sets.length || en.run || (d.ivl && d.ivl.on)) return '';
  const u = isKg() ? 'km/h' : 'mph', parts = [r.min + ' min'];
  if (r.code !== 'FIRST') { if (r.speed) parts.push(r.speed + ' ' + u); if (r.incline) parts.push(r.incline + '%'); if (r.mi && !r.speed) parts.push(dispD(r.mi) + ' ' + dUnit()); }
  const today = r.code === 'FIRST' ? 'Find your pace' : parts.join(' · ');
  return '<div class="tl"><span class="k">Today</span><span class="v"><span class="today' + (r.code === 'FIRST' || r.code === 'ADAPT' ? '' : '') + '">' + esc(today) + '</span></span><span class="k">Why</span><span class="v why">' + esc(cardioWhy(r, e)) + '</span></div>';
}
function cardioModes(en, i, e){
  const d = en.draft, fixed = e.eq === 'treadmill', elig = tmEligible(e); if (!fixed && !elig) return '';
  const tm = fixed || !!d.tm, ivl = tm && d.ivl && d.ivl.on;
  const chip = (label, m, on) => '<button class="chip' + (on ? ' on' : '') + '" data-act="cardio-mode" data-i="' + i + '" data-m="' + m + '">' + label + '</button>';
  return '<div class="chips" style="margin-bottom:10px">' + (fixed ? chip('Steady', 'steady', !ivl) : chip('Outdoors', 'out', !tm) + chip('Treadmill', 'tm', tm && !ivl)) + chip('Intervals', 'ivl', ivl) + '</div>';
}
function packStepper(i, e, d){ return LOAD_IDS[e.id] ? '<div class="steppers cardio" style="margin-top:8px">' + stepper(i, 'load', 'Pack weight', wUnit(), d.load || 0, 'decimal') + '<div></div></div>' : ''; }
function treadmillBody(en, i, e, d){
  const v = d.ivl || (d.ivl = ivlDefaults(e)), u = isKg() ? 'km/h' : 'mph', modes = '';
  if (!v.on) return modes + '<div class="steppers cardio">' + stepper(i, 'min', 'Minutes', '', d.min, 'decimal') + stepper(i, 'speed', 'Speed', u, d.speed || 0, 'decimal') + '</div><div class="steppers cardio" style="margin-top:8px">' + stepper(i, 'incline', 'Incline', '%', d.incline || 0, 'decimal') + stepper(i, 'mi', 'Distance', dUnit(), d.mi, 'decimal') + '</div>' +
    packStepper(i, e, d) + '<div class="plates" id="pace-' + i + '">' + paceLine(d) + '</div>' + '<button class="btn primary" data-act="log" data-i="' + i + '">Log ' + esc(e.name.toLowerCase()) + '</button>';
  if (en.run) return intervalRunner(en, i, v, u);
  const opt = (list, cur, fmt) => list.map(x => '<option value="' + x + '"' + (Math.abs(x - cur) < 1e-9 ? ' selected' : '') + '>' + fmt(x) + '</option>').join('');
  const speeds = []; for (let x = 10; x <= (isKg() ? 200 : 120); x++) speeds.push(x / 10);
  const inclines = []; for (let x = 0; x <= 30; x++) inclines.push(x / 2);
  const rounds = Array.from({length: 20}, (_, k) => k + 1), ph = ivlPhases(v);
  const stage = (p, k) => '<div class="ivlphase"><div class="between" style="margin-bottom:6px"><span class="eyebrow">' + stageName(ph, k) + '</span>' + (ph.length > 2 ? '<button class="btn link small" data-act="ivl-del" data-i="' + i + '" data-k="' + k + '">Remove</button>' : '') + '</div><div class="optgrid">' +
    '<label>Minutes<select class="sm" data-ivl="ph.' + k + '.min" data-i="' + i + '">' + opt(IVL_MINUTES, p.min, x => fmtMin(x).replace(' min', '')) + '</select></label>' +
    '<label>Speed ' + u + '<select class="sm" data-ivl="ph.' + k + '.speed" data-i="' + i + '">' + opt(speeds, p.speed, x => x.toFixed(1)) + '</select></label>' +
    '<label>Incline %<select class="sm" data-ivl="ph.' + k + '.incline" data-i="' + i + '">' + opt(inclines, p.incline, x => (x % 1 ? x.toFixed(1) : String(x))) + '</select></label></div></div>';
  const total = ivlTotalSec(v);
  return modes + ph.map(stage).join('') +
    (ph.length < 8 ? '<button class="btn link small" data-act="ivl-add" data-i="' + i + '" style="margin:2px 0 6px">+ Add a stage</button>' : '') +
    '<div class="row" style="margin:6px 0 6px;gap:10px"><label class="grow" style="font-weight:600">Rounds</label><select class="sm" data-ivl="rounds" data-i="' + i + '" style="width:120px">' + opt(rounds, v.rounds, x => String(x)) + '</select></div>' +
    packStepper(i, e, d) + '<div class="plates" id="ivl-sum-' + i + '">' + ivlSummary(v) + '</div>' + (v.hint ? '<div class="small muted" style="margin:0 0 10px">' + esc(v.hint) + '</div>' : '') +
    '<button class="btn primary" data-act="ivl-start" data-i="' + i + '">Start intervals · ' + mmss(total) + '</button><button class="btn link small" style="margin-top:8px" data-act="log" data-i="' + i + '">Log it without the timer</button>';
}
function stageName(ph, k){ return ph.length === 2 ? (k === 0 ? 'Hard' : 'Easy') : 'Stage ' + (k + 1); }
function ivlSummary(v){ const total = ivlTotalSec(v), ph = ivlPhases(v); return '<span>' + v.rounds + ' round' + (v.rounds === 1 ? '' : 's') + ' of ' + ph.length + ' stage' + (ph.length === 1 ? '' : 's') + ' · <b>' + mmss(total) + '</b> · about <b>' + dispD(ivlDistanceMi(v, total)) + ' ' + dUnit() + '</b></span>'; }
function intervalRunner(en, i, v, u){
  const run = en.run, sec = runElapsed(run), at = ivlAt(v, sec), total = ivlTotalSec(v), ph = ivlPhases(v);
  if (!at || at.done) return '<div class="ivlrun done"><div class="eyebrow">Intervals complete</div><div class="ivlbig num">' + mmss(total) + '</div><div class="small muted">' + ivlLabel(v) + '</div></div><button class="btn primary" data-act="ivl-log" data-i="' + i + '">Log intervals</button>';
  const p = at.stage, nx = at.next, cls = ph.length === 2 ? (at.k === 0 ? 'hard' : 'easy') : 'stage';
  return '<div class="ivlrun ' + cls + '"><div class="between"><div class="eyebrow" id="ivl-round">Round ' + at.round + ' of ' + v.rounds + '</div><div class="eyebrow" style="color:var(--text)" id="ivl-phase">' + stageName(ph, at.k) + '</div></div>' +
    '<div class="ivlbig num" id="ivl-left">' + mmss(at.left) + '</div><div class="ivlnow" id="ivl-now">' + p.speed + ' ' + u + ' · ' + p.incline + '%</div>' +
    '<div class="lvlbar" style="margin:10px 0 8px"><i id="ivl-fill" style="width:' + Math.round(100 * sec / total) + '%"></i></div>' +
    '<div class="small muted" id="ivl-next">Next: ' + stageName(ph, (at.k + 1) % ph.length).toLowerCase() + ', ' + nx.speed + ' ' + u + ' at ' + nx.incline + '% for ' + fmtMin(nx.min) + ' · ' + mmss(total - sec) + ' left</div></div>' +
    '<div class="row" style="gap:8px"><button class="btn grow" data-act="ivl-stop" data-i="' + i + '">Stop and log</button><button class="btn grow ghost" data-act="ivl-cancel" data-i="' + i + '">Cancel</button></div>';
}
function runElapsed(run){ return Math.max(0, (Date.now() - run.start) / 1000); }
function tickIntervals(a){
  const en = a.entries[a.idx]; if (!en || !en.run || !en.draft || !en.draft.ivl) return;
  const run = en.run, v = en.draft.ivl;
  if (a.pausedAt) { run.start += 500; return; }
  const sec = runElapsed(run), at = ivlAt(v, sec); if (!at) return;
  if (at.done) { if (!run.done) { run.done = true; beep(); buzz(); setTimeout(beep, 350); render(); } return; }
  if (run.phase !== at.idx) { if (run.phase !== undefined && run.phase >= 0) { beep(); buzz(); } run.phase = at.idx; render(); save(); return; }
  const left = $('#ivl-left'); if (left) left.textContent = mmss(at.left);
  const f = $('#ivl-fill'); if (f) f.style.width = Math.round(100 * sec / ivlTotalSec(v)) + '%';
  const nx = $('#ivl-next'); if (nx) { const t = nx.textContent.replace(/ · .*$/, ''); nx.textContent = t + ' · ' + mmss(ivlTotalSec(v) - sec) + ' left'; }
  const hr = $('#hrest'); if (hr) hr.textContent = stageName(ivlPhases(v), at.k) + ' ' + mmss(at.left);
}
function logIntervals(i, sec){
  const a = state.active, en = a.entries[i], v = en.draft.ivl; const total = ivlTotalSec(v); sec = Math.round(clamp(sec, 0, total)); if (!sec) { toast('Nothing to log yet'); return; }
  const cyc = ivlCycleMin(v) * 60, done = Math.min(v.rounds, Math.floor(sec / cyc + 1e-9)), avg = ivlAvg(v);
  const cs = {sec: sec, mi: ivlDistanceMi(v, sec), t: Date.now(), speed: avg.speed, incline: avg.incline, ivl: Object.assign(ivlCopy(v), {done: done})};
  if (ex(en.ex).eq !== 'treadmill') cs.tm = true;
  if (LOAD_IDS[en.ex] && en.draft.load) cs.load = Math.round(en.draft.load * 10) / 10;
  en.sets.push(cs); delete en.run; en.draft.min = Math.round(sec / 60);
  const hr = $('#hrest'); if (hr) hr.textContent = '';
  render();
}
function stepperBox(i, f, val, mode){ return '<div class="stepper"><button type="button" data-act="step" data-i="' + i + '" data-f="' + f + '" data-d="-1" aria-label="Fewer reps">−</button><input inputmode="' + mode + '" data-bind="' + f + '" data-i="' + i + '" value="' + val + '" aria-label="Reps"><button type="button" data-act="step" data-i="' + i + '" data-f="' + f + '" data-d="1" aria-label="More reps">+</button></div>'; }
function stepper(i, f, label, right, val, mode){
  const disp = f === 'w' ? dispW(val) : f === 'mi' ? dispD(val) : String(val);
  return '<div class="stepper-wrap"><div class="lab"><span>' + label + '</span><span>' + esc(right) + '</span></div><div class="stepper">' +
    '<button type="button" data-act="step" data-i="' + i + '" data-f="' + f + '" data-d="-1" aria-label="Decrease ' + label + '">−</button>' +
    '<input inputmode="' + mode + '" data-bind="' + f + '" data-i="' + i + '" value="' + disp + '" aria-label="' + label + '">' +
    '<button type="button" data-act="step" data-i="' + i + '" data-f="' + f + '" data-d="1" aria-label="Increase ' + label + '">+</button></div></div>';
}
function expandedEntry(en, i){
  const a = state.active, e = ex(en.ex), t = en.target, last = lastPerformance(en.ex), d = en.draft;
  const isLast = i === a.entries.length - 1;
  const doneHere = counted(en.sets).length >= (t.sets || 1), nextIdx = a.entries.findIndex((x, k) => k > i && !entryDone(x)), backIdx = a.entries.findIndex((x, k) => k < i && !entryDone(x));
  const nextBtn = doneHere ? (nextIdx >= 0 ? '<button class="btn secondary" data-act="goto" data-to="' + nextIdx + '">Next: ' + esc(ex(a.entries[nextIdx].ex).name) + ' ›</button>' : backIdx >= 0 ? '<button class="btn secondary" data-act="goto" data-to="' + backIdx + '">Back to ' + esc(ex(a.entries[backIdx].ex).name) + '</button>' : '<button class="btn secondary good" data-act="finish">Finish workout</button>') : (nextIdx >= 0 ? '<button class="btn link small" style="margin-top:10px" data-act="skip" data-i="' + i + '" data-to="' + nextIdx + '">Skip ahead for now ›</button>' : '');
  const remove = '<button class="x" data-act="remove-entry" data-i="' + i + '" aria-label="Remove exercise">×</button>';
  if (e.type === 'cardio') {
    return '<div class="card focus" data-sort="workout" data-si="' + i + '"><div class="card-head"><div><div class="eyebrow">Cardio' + (t.min ? ' · ' + t.min + ' min planned' : '') + '</div><h2 class="h2">' + esc(e.name) + '</h2></div><div class="row" style="gap:0">' + GRIP + remove + '</div></div>' +
      '<div class="last">' + (last ? 'Last time (' + fmtShort(last.date) + '): <b>' + cardioSetLabel(last.sets[last.sets.length - 1]) + '</b>' : 'First time logging this.') + '</div>' +
      cardioTargetLines(en, e) +
      (en.sets.length ? '<div class="sets">' + en.sets.map((s, si) => '<div class="set"><span class="n">Log ' + (si + 1) + '</span><span class="v" style="font-size:17px">' + cardioSetLabel(s) + '</span><button data-act="del-set" data-i="' + i + '" data-s="' + si + '" aria-label="Remove">×</button></div>').join('') + '</div>' : '') +
      (en.run ? '' : cardioModes(en, i, e)) +
      (onTreadmill(en) ? treadmillBody(en, i, e, d) : '<div class="steppers cardio">' + stepper(i, 'min', 'Minutes', t.min ? 'planned ' + t.min : '', d.min, 'decimal') + stepper(i, 'mi', 'Distance', dUnit(), d.mi, 'decimal') + '</div>' + packStepper(i, e, d) +
      '<div class="plates" id="pace-' + i + '">' + paceLine(d) + '</div>' +
      '<button class="btn primary" data-act="log" data-i="' + i + '">Log ' + esc(e.name.toLowerCase()) + '</button>') + nextBtn + '</div>';
  }
  const tempo = state.exTempo[e.id], note = state.exNotes[e.id];
  const W = en.draft.w;
  if (en.wuRows === undefined && en.wu !== false && !en.sets.some(x => !x.wu)) en.wuRows = warmupScheme(e, W);
  const wus = en.wu !== false && en.wuRows ? en.wuRows : [];
  const loggedWu = en.sets.filter(x => x.wu), work = counted(en.sets), wuOpen = wus.length && loggedWu.length < wus.length;
  const wuHTML = wuOpen ? '<div class="wu"><div class="between"><span class="eyebrow">Warm-up</span><span class="row" style="gap:8px"><label class="tiny muted row" style="gap:6px">Rest<select class="sm" data-wurest="' + e.id + '" aria-label="Rest between warm-up sets" style="height:32px;width:88px;padding:0 26px 0 10px;font-size:13px">' + wuRestOptionsHTML(wuRestFor(e.id)) + '</select></label><button class="btn link small" data-act="wu-off" data-i="' + i + '">Hide</button></span></div>' +
    wus.map((x, k) => k < loggedWu.length ? '' : '<div class="wurow"><span class="n">' + (k + 1) + '</span><input inputmode="decimal" data-wu="w" data-i="' + i + '" data-k="' + k + '" value="' + dispW(x.w) + '" aria-label="Warm-up weight"><span class="times">×</span><input inputmode="numeric" data-wu="r" data-i="' + i + '" data-k="' + k + '" value="' + x.r + '" aria-label="Warm-up reps"><button class="btn sm" data-act="log-wu" data-i="' + i + '" data-k="' + k + '">Log</button></div>').join('') +
    '<div class="row" style="gap:14px;margin-top:4px"><button class="btn link small" data-act="wu-add" data-i="' + i + '">+ One more</button>' + (wus.length - loggedWu.length > 1 ? '<button class="btn link small" data-act="wu-remove" data-i="' + i + '">− One fewer</button>' : '') + '</div></div>'
    : '<button class="btn link small" data-act="wu-add" data-i="' + i + '" style="margin-bottom:8px">' + (loggedWu.length ? '+ Another warm-up set' : '+ Warm-up sets') + '</button>';
  const menu = '<button class="x" data-act="ex-menu" data-i="' + i + '" aria-label="Exercise options">⋯</button>';
  return '<div class="card focus" data-sort="workout" data-si="' + i + '"><div class="card-head"><div><div class="eyebrow">' + esc(e.group) + ' · ' + t.sets + ' × ' + rangeLabel(t) + (e.time ? ' s' : '') + (e.bw ? ' · bodyweight' : '') + (tempo ? ' · tempo ' + tempo : '') + '</div><h2 class="h2">' + esc(e.name) + '</h2><button class="btn link small" data-act="tips-open" data-ex="' + e.id + '" style="margin-top:2px">How to do it ›</button></div><div class="row" style="gap:0">' + GRIP + menu + '</div></div>' +
    (note ? '<div class="note"><span>' + esc(note) + '</span><button class="x" data-act="note-del" data-i="' + i + '" aria-label="Delete note">×</button></div>' : '') +
    targetLines(en, e, last, i) +
    '<div class="restrow"><span>Rest after each set</span><select class="sm" data-exrest="' + e.id + '" aria-label="Rest between sets">' + restOptionsHTML(e.id) + '</select></div>' +
    wuHTML +
    (en.sets.length ? '<div class="sets">' + en.sets.map((s, si) => s.wu ? '<div class="set wuset"><span class="n">Warm</span><span class="v">' + dispW(s.w) + '<span class="u">' + wUnit() + '</span><span class="times">×</span>' + s.r + '</span><button data-act="del-set" data-i="' + i + '" data-s="' + si + '" aria-label="Remove set">×</button></div>' : '<div class="set' + (s.pr ? ' pr' : '') + '"><span class="n">' + (s.tech ? 'Extra' : 'Set ' + (counted(en.sets.slice(0, si)).length + 1)) + '</span><span class="v">' + (s.w ? dispW(s.w) + '<span class="u">' + wUnit() + '</span>' : 'BW') + '<span class="times">×</span>' + s.r + (s.amrap ? '+' : '') + (e.time ? '<span class="u">s</span>' : '') + (s.tech ? '<span class="goal">' + techName(s.tech).toLowerCase() + '</span>' : (s.tr && !e.time ? '<span class="goal">' + (goalMet(s) ? 'goal ' + s.tr + ' ✓' : 'goal ' + s.tr) + '</span>' : '')) + (s.pr ? ' <span class="pill pr">PR</span>' : '') + (s.sub ? '<span class="subv">+ ' + esc(subLabel(s.sub, e.time)) + '</span>' : '') + '</span><button data-act="del-set" data-i="' + i + '" data-s="' + si + '" aria-label="Remove set">×</button></div>').join('') + '</div>' : '') +
    '<div class="steppers">' + stepper(i, 'w', e.bw ? 'Added weight' : 'Weight', wUnit(), d.w, 'decimal') + stepper(i, 'r', e.time ? 'Seconds' : 'Reps', e.time ? '' : (t.fail ? 'to failure' : en.rec ? 'goal ' + (en.rec.goals[work.length] || en.rec.goals[en.rec.goals.length - 1]) + (t.hi === 99 && work.length === t.sets - 1 ? '+' : '') : 'target ' + t.reps), d.r, 'numeric') + '</div>' +
    ((e.bar || !e.bw || d.w) ? '<div class="tools">' +
      (e.bar ? '<button class="toolbtn" id="plates-' + i + '" data-act="plates-open" data-i="' + i + '" aria-label="Open plate loading"><span class="k">Plates</span><span class="v">' + plateBtnLine(d.w) + '</span><span class="chev">›</span></button>' : '') +
      (!e.bw || d.w ? '<button class="toolbtn" id="conv-' + i + '" data-act="conv-open" data-i="' + i + '" aria-label="Convert units"><span class="k">Convert</span><span class="v">' + altUnitLine(d.w) + '</span><span class="chev">›</span></button>' : '') + '</div>' : '') +
    (d.sub && d.sub.tech === 'restpause' ? restPausePanel(en, i, e, d, work.length + 1) : d.sub ? '<div class="subset"><div class="between" style="margin-bottom:6px"><span class="eyebrow">' + esc(techName(d.sub.tech)) + ' · part of set ' + (work.length + 1) + '</span><button class="btn link small" data-act="sub-toggle" data-i="' + i + '" data-tech="' + d.sub.tech + '">Remove</button></div>' +
      subStages(d.sub).map((s, k) => '<div class="steppers"' + (k ? ' style="margin-top:8px"' : '') + '>' + stepper(i, 'sw' + (k ? '.' + k : ''), d.sub.tech === 'drop' ? (k ? 'Drop ' + (k + 1) + ' to' : 'Drop to') : 'Weight', wUnit(), s.w, 'decimal') + stepper(i, 'sr' + (k ? '.' + k : ''), d.sub.tech === 'drop' ? 'Reps' : 'Extra reps', '', s.r, 'numeric') + '</div>').join('') +
      (d.sub.tech === 'drop' ? '<div class="row" style="gap:14px;margin-top:8px">' + (subStages(d.sub).length < 5 ? '<button class="btn link small" data-act="sub-add" data-i="' + i + '">+ Another drop</button>' : '') + (subStages(d.sub).length > 1 ? '<button class="btn link small" data-act="sub-less" data-i="' + i + '">− One fewer</button>' : '') + '</div>' : '') +
      '<div class="tiny muted" style="margin-top:6px">' + (d.sub.tech === 'drop' ? (subStages(d.sub).length > 1 ? 'Main set, then each drop with no rest between. All of it logs as one set.' : 'Do the main set, drop the weight, go again with no rest. Both log as one set.') : 'Logged with the main set as one set.') + '</div></div>' : '') +
    '<div class="row" style="margin:8px 0 10px;gap:8px;flex-wrap:wrap">' + (e.time ? '' : '<button class="chip' + (d.amrap ? ' on' : '') + '" data-act="amrap" data-i="' + i + '">' + (d.amrap ? 'To failure ✓' : 'To failure') + '</button>' + '<button class="chip' + (d.sub && d.sub.tech === 'drop' ? ' on' : '') + '" data-act="sub-toggle" data-i="' + i + '" data-tech="drop">' + (d.sub && d.sub.tech === 'drop' ? 'Drop set ✓' : 'Drop set') + '</button>' + '<button class="chip' + (d.sub && d.sub.tech === 'restpause' ? ' on' : '') + '" data-act="sub-toggle" data-i="' + i + '" data-tech="restpause">' + (d.sub && d.sub.tech === 'restpause' ? 'Rest-pause ✓' : 'Rest-pause') + '</button>' + (d.sub && d.sub.tech !== 'drop' && d.sub.tech !== 'restpause' ? '<button class="chip on" data-act="sub-toggle" data-i="' + i + '" data-tech="' + d.sub.tech + '">' + esc(techName(d.sub.tech)) + ' ✓</button>' : '')) + '</div>' +
    '<button class="btn primary" data-act="log" data-i="' + i + '">Log set ' + (work.length + 1) + (d.sub ? ' + ' + esc(techName(d.sub.tech).toLowerCase()) : '') + '</button>' + nextBtn + '</div>';
}
/* Rest-pause: the main set, then short pauses at the same weight. Reps per pause are editable, and the pause timer runs on the rest bar. */
function restPausePanel(en, i, e, d, setNo){
  const st = subStages(d.sub), secs = state.settings.rpSecs || 20, t = state.timer, running = t && t.kind === 'rp' && t.end > Date.now();
  return '<div class="subset"><div class="between" style="margin-bottom:6px"><span class="eyebrow">Rest-pause · part of set ' + setNo + '</span><button class="btn link small" data-act="sub-toggle" data-i="' + i + '" data-tech="restpause">Remove</button></div>' +
    '<div class="tiny muted" style="margin-bottom:8px">Main set to a rep or two from failure, rack it, breathe for ' + secs + ' seconds, go again at the same weight. All of it logs as one set.</div>' +
    '<div class="rprow"><div class="row" style="gap:6px"><select class="sm" data-set="rpSecs" style="width:92px" aria-label="Pause length">' + [10, 15, 20, 25, 30].map(v => '<option value="' + v + '"' + (v === secs ? ' selected' : '') + '>' + v + ' s</option>').join('') + '</select><button class="btn sm grow' + (running ? ' good' : '') + '" data-act="rp-timer" data-i="' + i + '">' + (running ? 'Pausing… tap to restart' : 'Start ' + secs + ' s pause') + '</button></div></div>' +
    st.map((s, k) => '<div class="steppers" style="margin-top:8px;grid-template-columns:1fr"><div class="stepper-wrap"><div class="lab"><span>Pause ' + (k + 1) + ' reps</span><span>' + (s.w ? dispW(s.w) + ' ' + wUnit() : 'bodyweight') + '</span></div>' + stepperBox(i, 'sr' + (k ? '.' + k : ''), s.r, 'numeric') + '</div></div>').join('') +
    '<div class="row" style="gap:14px;margin-top:8px">' + (st.length < 5 ? '<button class="btn link small" data-act="sub-add" data-i="' + i + '">+ Another pause</button>' : '') + (st.length > 1 ? '<button class="btn link small" data-act="sub-less" data-i="' + i + '">− One fewer</button>' : '') + '</div></div>';
}
function targetLines(en, e, last, i){
  const t = en.target, r = en.rec;
  if (e.time) return '<div class="last">' + (last ? 'Last time (' + fmtShort(last.date) + '): <b>' + setsLabel(last.sets, true) + '</b>' : 'First time logging this.') + '</div>';
  const lastTxt = (last ? '<b>' + setsLabel(last.sets) + '</b> <span class="faint">(' + fmtShort(last.date) + ')</span>' : 'Nothing yet') + (last ? ' <button class="btn link small" data-act="exhist-open" data-ex="' + e.id + '" style="margin-left:6px">History ›</button>' : '');
  let today = '', why = '';
  if (r) {
    const wTxt = r.w === null ? 'Find your weight' : (r.w === 0 && e.bw ? 'Bodyweight' : dispW(r.w) + ' ' + wUnit());
    const goals = r.goals.map((g, k) => g + (t.hi === 99 && k === r.goals.length - 1 ? '+' : ''));
    today = '<span class="today' + (r.conf === 'low' ? ' low' : '') + '">' + wTxt + '<small>' + (t.fail ? 'every set to failure' : 'goal ' + goals.join(' / ')) + (r.conf === 'low' ? ' · suggested' : '') + '</small></span>';
    why = whyLine(r, e);
  }
  return '<div class="tl"><span class="k">Target</span><span class="v">' + t.sets + ' sets ' + (t.fail ? 'to failure' : 'of ' + (t.hi === 99 ? t.reps + ' or more on the last' : (t.hi && t.hi !== t.reps ? t.reps + ' to ' + t.hi : t.reps))) + '</span>' +
    '<span class="k">Last</span><span class="v">' + lastTxt + '</span>' +
    (today ? '<span class="k">Today</span><span class="v">' + today + '</span>' : '') +
    (why ? '<span class="k">Why</span><span class="v why">' + esc(why) + (r && r.w !== null && !e.time && !state.active.light ? ' <button class="btn link small" data-act="ex-menu" data-i="' + i + '">' + (en.adj ? 'Change ›' : 'Not today? ›') + '</button>' : '') + '</span>' : '') + '</div>';
}
function paceLine(d){ if (d.speed && d.min) return 'About <b>' + dispD(toMi(d.speed * d.min / 60)) + ' ' + dUnit() + '</b> at that speed' + (d.incline ? ' on a ' + d.incline + '% grade' : ''); return d.mi && d.min ? 'Pace: <b>' + paceLabel(d.min * 60, d.mi) + '</b>' : '<span class="faint">Leave distance at 0 if it does not apply</span>'; }
function setDraftWeight(i, lb){ const en = state.active && state.active.entries[i]; if (!en) return; en.draft.w = Math.max(0, Math.round(lb * 100) / 100); refreshWarmups(i); if (en.draft.sub) subRefresh(en.draft.sub, en.draft, ex(en.ex)); save(); }
function subValue(d, f){ const st = subStages(d.sub), k = +(f.split('.')[1] || 0), s = st[k]; if (!s) return '0'; return f.indexOf('sw') === 0 ? dispW(s.w) : String(s.r); }
function altUnitLine(lb){ const kg = isKg(); const v = kg ? lb : lb / LB_PER_KG; return '≈ ' + (Math.round(v * 10) / 10) + ' ' + (kg ? 'lb' : 'kg'); }
function plateBtnLine(lb){ const p = platesFor(lb); if (!p) return 'below the bar'; if (!p.plates.length) return 'empty bar'; return p.plates.join(' · ') + ' a side' + (p.rem > 0.01 ? ' +' + p.rem : ''); }
function patchLine(i){
  const en = state.active && state.active.entries[i]; if (!en) return;
  const p = $('#plates-' + i + ' .v'); if (p) p.innerHTML = plateBtnLine(en.draft.w);
  const cv = $('#conv-' + i + ' .v'); if (cv) cv.innerHTML = altUnitLine(en.draft.w);
  const c = $('#pace-' + i); if (c) c.innerHTML = paceLine(en.draft);
}

/* Rest bar */
function renderRest(){
  const t = state.timer, a = state.active; syncRestAlert();
  if (!t || (t.fired && Date.now() > (t.firedAt || t.end) + 4000)) { if (t && t.fired) state.timer = null; restEl.hidden = true; restEl.innerHTML = ''; screenEl.classList.remove('resting'); return; }
  const left = (t.end - Date.now()) / 1000, over = left <= 0;
  restEl.hidden = false; restEl.classList.toggle('over', over); screenEl.classList.add('resting');
  syncViewport(); if (!window.visualViewport) restEl.style.bottom = tabsEl.hidden ? '0' : tabsEl.offsetHeight + 'px';
  const pct = clamp(100 * (1 - Math.max(0, left) / t.total), 0, 100);
  const away = a && state.ui.view !== 'workout';
  restEl.classList.toggle('away', !!away);
  restEl.innerHTML = '<div class="between"><div class="row" style="gap:10px"><div class="t" id="rest-t">' + (over ? 'Go' : mmss(left)) + '</div><div class="eyebrow ellip" style="max-width:150px">' + (t.kind === 'rp' ? (over ? 'Go again' : 'Rest-pause') : over ? 'Rest done' : (a && a.pausedAt ? 'Paused' : 'Rest')) + (away ? ' · ' + esc(a.name) : '') + '</div></div>' +
    '<div class="row">' + (away ? '<button class="btn sm ghost" data-act="rest-skip" aria-label="' + (over ? 'Dismiss' : 'Skip rest') + '">' + (over ? 'Dismiss' : 'Skip') + '</button><button class="btn sm" data-act="resume">Resume</button>' : '<button class="btn sm" data-act="rest-add">+30s</button><button class="btn sm ghost" data-act="rest-skip">' + (over ? 'Dismiss' : 'Skip') + '</button>') + '</div></div>' +
    '<div class="track"><div class="fill" id="rest-fill" style="width:' + pct + '%"></div></div>';
}

/* History */
function weekLabel(ws){ const cur = weekStart(todayKey()); if (ws === cur) return 'This week'; if (ws === keyOf(addDays(dateOf(cur), -7))) return 'Last week'; return 'Week of ' + fmtShort(ws); }
function renderHistory(){
  const ws = sortedWorkouts();
  if (!ws.length) return header('History') + '<div class="card empty">No workouts yet. Your first session sets your bearing.</div>';
  let html = '', lastWeek = null;
  for (const w of ws) {
    const wk = weekStart(w.date);
    if (wk !== lastWeek) { html += '<div class="datehead">' + weekLabel(wk) + '</div>'; lastWeek = wk; }
    const open = state.ui.openHist === w.id, prs = w.prs || [];
    html += '<div class="hist"><button data-act="hist" data-id="' + w.id + '"><div class="grow"><div class="row"><b>' + esc(w.name) + '</b>' + (w.light ? '<span class="pill rest">Light</span>' : '') + (prs.length ? '<span class="pill pr">' + prs.length + ' PR' + (prs.length > 1 ? 's' : '') + '</span>' : '') + '</div><div class="small muted">' + fmtWeekday(w.date) + ' · ' + workoutMeta(w) + '</div></div><span class="muted">' + (open ? '▾' : '▸') + '</span></button>' +
      (open ? '<div class="body">' + w.entries.map(en => { const e = ex(en.ex); const s = e.type === 'cardio' ? en.sets.map(cardioSetLabel).join('; ') : setsLabel(en.sets, e.time); const pr = prs.find(p => p.ex === en.ex); return '<div class="ex"><span>' + esc(e.name) + (pr ? ' <span class="pill pr">PR</span>' : '') + '</span><span class="s">' + s + '</span></div>'; }).join('') +
        '<div class="between" style="margin-top:4px"><span class="tiny faint">' + fmtTime(w.start) + ' to ' + fmtTime(w.end) + '</span><span class="row" style="gap:14px"><button class="btn link small" data-act="share" data-id="' + w.id + '">Share</button><button class="btn link small" data-act="summary" data-id="' + w.id + '">Summary</button><button class="btn link small" data-act="reopen" data-id="' + w.id + '">Reopen</button><button class="btn link danger small" data-act="del-workout" data-id="' + w.id + '">' + (state.ui.confirmDel === w.id ? 'Tap again to delete' : 'Delete') + '</button></span></div></div>' : '') + '</div>';
  }
  return header('History', ws.length + ' workout' + (ws.length === 1 ? '' : 's')) + '<div class="stack" style="gap:8px">' + html + '</div>';
}

/* Progress */
function niceTicks(min, max, count){
  const rough = (max - min) / count; const p = Math.pow(10, Math.floor(Math.log10(rough)));
  const step = p * ([1, 2, 2.5, 5, 10].find(c => p * c >= rough) || 10);
  const out = []; for (let v = Math.ceil(min / step) * step; v <= max + 1e-9; v += step) out.push(Math.round(v * 1000) / 1000);
  return out;
}
function lineChart(pts, fmt, label){
  const W = 340, H = 170, L = 46, R = 16, T = 18, B = 26, n = pts.length;
  const ys = pts.map(p => p.y); let min = Math.min.apply(null, ys), max = Math.max.apply(null, ys);
  if (max === min) { max += 1; min = Math.max(0, min - 1); }
  const padY = (max - min) * 0.18; min -= padY; max += padY; if (min < 0 && Math.min.apply(null, ys) >= 0) min = 0;
  const ticks = niceTicks(min, max, 4);
  const x = i => L + (W - L - R) * (i / (n - 1)), y = v => T + (H - T - B) * (1 - (v - min) / (max - min));
  const path = pts.map((p, i) => (i ? 'L' : 'M') + x(i).toFixed(1) + ' ' + y(p.y).toFixed(1)).join(' ');
  const area = path + ' L' + x(n - 1).toFixed(1) + ' ' + (H - B) + ' L' + x(0).toFixed(1) + ' ' + (H - B) + ' Z';
  const grid = ticks.map(t => '<line class="grid" x1="' + L + '" x2="' + (W - R) + '" y1="' + y(t).toFixed(1) + '" y2="' + y(t).toFixed(1) + '"/><text x="' + (L - 6) + '" y="' + (y(t) + 4).toFixed(1) + '" text-anchor="end">' + fmt(t) + '</text>').join('');
  const xl = [0, n - 1]; if (n >= 5) xl.splice(1, 0, Math.floor((n - 1) / 2));
  const xlabels = xl.map(i => '<text x="' + x(i).toFixed(1) + '" y="' + (H - 8) + '" text-anchor="' + (i === 0 ? 'start' : i === n - 1 ? 'end' : 'middle') + '">' + fmtShort(pts[i].x) + '</text>').join('');
  const dots = pts.slice(0, -1).map((p, i) => '<circle class="pt" cx="' + x(i).toFixed(1) + '" cy="' + y(p.y).toFixed(1) + '" r="2.5"/>').join('');
  const lx = x(n - 1), ly = y(pts[n - 1].y), above = ly > T + 20;
  const endlab = '<text class="endlab" x="' + (lx - 9).toFixed(1) + '" y="' + (above ? ly - 10 : ly + 22).toFixed(1) + '" text-anchor="end">' + fmt(pts[n - 1].y) + '</text>';
  return '<svg class="chart" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + esc(label) + '">' + grid + '<path class="area" d="' + area + '"/><path class="line" d="' + path + '"/>' + dots + '<circle class="end" cx="' + lx.toFixed(1) + '" cy="' + ly.toFixed(1) + '" r="4.5"/>' + endlab + xlabels + '</svg>';
}
function weeksChart(){
  const W = 340, H = 118, L = 6, R = 6, T = 20, B = 22, cur = weekStart(todayKey());
  const weeks = []; for (let i = 11; i >= 0; i--) { const k = keyOf(addDays(dateOf(cur), -7 * i)), end = keyOf(addDays(dateOf(k), 6)); weeks.push({k: k, n: state.workouts.filter(w => w.date >= k && w.date <= end).length}); }
  const planned = Math.max(1, weeklyTarget()), maxN = Math.max(planned, Math.max.apply(null, weeks.map(w => w.n))) + 0.5;
  const bw = (W - L - R) / 12, inner = H - T - B;
  const bars = weeks.map((w, i) => { const h = inner * (w.n / maxN), x = L + i * bw + 4, yb = H - B - h; return '<rect class="bar' + (i === 11 ? ' now' : (w.n >= planned ? ' on' : '')) + '" x="' + x.toFixed(1) + '" y="' + (w.n ? yb.toFixed(1) : (H - B - 2)) + '" width="' + (bw - 8).toFixed(1) + '" height="' + (w.n ? h.toFixed(1) : 2) + '" rx="3"/>' + (w.n ? '<text class="barlab" x="' + (x + (bw - 8) / 2).toFixed(1) + '" y="' + (yb - 4).toFixed(1) + '" text-anchor="middle">' + w.n + '</text>' : ''); }).join('');
  const gy = (H - B - inner * (planned / maxN)).toFixed(1);
  const labels = [0, 4, 8, 11].map(i => '<text x="' + (i === 0 ? L : i === 11 ? W - R : (L + i * bw + bw / 2).toFixed(1)) + '" y="' + (H - 6) + '" text-anchor="' + (i === 0 ? 'start' : i === 11 ? 'end' : 'middle') + '">' + (i === 11 ? 'This week' : fmtShort(weeks[i].k)) + '</text>').join('');
  return '<svg class="chart" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Sessions per week, last 12 weeks"><line class="grid" x1="' + L + '" x2="' + (W - R) + '" y1="' + gy + '" y2="' + gy + '" stroke-dasharray="3 3"/>' + bars + labels + '</svg><div class="tiny muted" style="margin-top:2px">Dashed line: ' + planned + ' planned per week</div>';
}
function exerciseChart(id){
  const e = ex(id), pts = [];
  const bwOnly = e.bw && !state.workouts.some(w => w.entries.some(en => en.ex === id && en.sets.some(s => s.w > 0)));
  const mode = e.type === 'cardio' ? 'pace' : ((bwOnly || e.time) ? 'reps' : 'e1rm');
  for (const w of state.workouts.slice().sort((a, b) => a.start - b.start)) {
    const en = w.entries.find(x => x.ex === id && x.sets.length); if (!en) continue;
    if (mode === 'pace') { const s = en.sets[0], p = paceOf(s.sec, s.mi); if (p) pts.push({x: w.date, y: p}); }
    else if (mode === 'reps') pts.push({x: w.date, y: Math.max.apply(null, en.sets.map(s => s.r || 0))});
    else { const top = topSet(en.sets); if (top) pts.push({x: w.date, y: isKg() ? top.v / LB_PER_KG : top.v}); }
  }
  if (pts.length < 2) return '<div class="empty">Two sessions needed before a line can be drawn.</div>';
  const fmt = mode === 'pace' ? (v => mmss(v)) : (v => String(Math.round(v)));
  const caption = mode === 'pace' ? 'Pace in min per ' + dUnit() + ' · lower is faster' : mode === 'reps' ? (e.time ? 'Longest hold in seconds' : 'Best reps in a single set') : 'Estimated one-rep max in ' + wUnit() + ' (Epley), from the best set each session';
  let stat = '';
  if (mode === 'e1rm') {
    let best = null; for (const w of state.workouts) for (const en of w.entries) if (en.ex === id) { const t = topSet(en.sets); if (t && (!best || t.v > best.v)) best = Object.assign({date: w.date}, t); }
    const first = pts[0], lastP = pts[pts.length - 1], delta = Math.round(lastP.y - first.y);
    stat = 'Best set: <b>' + dispW(best.w) + ' × ' + best.r + '</b> on ' + fmtShort(best.date) + ' · ' + (delta >= 0 ? '+' : '') + delta + ' ' + wUnit() + ' since ' + fmtShort(first.x);
  } else if (mode === 'pace') {
    let best = null; for (const p of pts) if (!best || p.y < best.y) best = p;
    stat = 'Fastest: <b>' + mmss(best.y) + ' /' + dUnit() + '</b> on ' + fmtShort(best.x);
  } else {
    stat = 'Best: <b>' + Math.max.apply(null, pts.map(p => p.y)) + (e.time ? ' seconds</b>' : ' reps</b>');
  }
  return '<div style="margin:10px 0 4px">' + lineChart(pts, fmt, e.name + ' over time') + '</div><div class="tiny muted">' + caption + '</div><div class="small" style="margin-top:8px">' + stat + '</div>';
}
/* Athlete score */
function ringSVG(total){
  const r = 52, C = 2 * Math.PI * r, on = C * clamp(total, 0, 100) / 100;
  return '<svg viewBox="0 0 120 120" aria-hidden="true"><circle class="track" cx="60" cy="60" r="' + r + '"/>' + (on > 0 ? '<circle class="fill" cx="60" cy="60" r="' + r + '" stroke-dasharray="' + on.toFixed(1) + ' ' + C.toFixed(1) + '"/>' : '') + '</svg>';
}
function scoreDeltaText(){ const d = scoreDelta(); if (d === null) return 'first month'; return (d > 0 ? '+' : d < 0 ? '−' : '±') + Math.abs(d) + ' in 4 weeks'; }
function scoreRow(name, pts, max, line){
  const w = pts === null ? 0 : Math.round(pts / max * 100);
  return '<div class="lvl"><div class="top"><span class="nm">' + name + '</span><span class="ratio">' + (pts === null ? 'n/a' : Math.round(pts)) + '<small>of ' + max + '</small></span></div><div class="lvlbar"><i style="width:' + w + '%"></i></div><div class="sub"><span>' + line + '</span></div></div>';
}
function patternGrid(s){
  return '<div class="patgrid">' + s.patterns.map(p => { const t = p.top; return '<div><div class="k">' + p.label + '</div><div class="v">' + (t ? t.lv.ratio.toFixed(2) + '×' : 'n/a') + '</div><div class="s">' + (t ? LEVEL_SHORT[t.lv.idx] : 'no lift') + '</div></div>'; }).join('') + '</div>';
}
function scoreCard(){
  const sc = athleteScore(), s = sc.strength, c = sc.cardio, k = sc.consistency;
  const head = '<div class="card-head"><div><div class="h3">Athlete score</div><div class="tiny muted">Strength, cardio and consistency on one 0 to 100 scale</div></div>' + (sc.band ? '<span class="pill level' + (sc.total >= 70 ? ' high' : '') + '">' + sc.band + '</span>' : '') + '</div>';
  if (!state.workouts.length) return '<div class="card">' + head + '<div class="empty">Finish a workout and your score appears here.</div></div>';
  const levers = scoreLevers(sc), top = levers[0];
  const hero = sc.total === null
    ? '<div class="scorehero"><div class="ring">' + ringSVG(0) + '<div class="ringtxt"><div class="h2">Set up</div></div></div><div class="grow"><p class="small" style="margin:0 0 10px">Add your body weight and sex under You so strength can be measured against the standards. Cardio and consistency are already counted below.</p><button class="btn sm" data-tab="you">Open You</button></div></div>'
    : '<div class="scorehero"><div class="ring">' + ringSVG(sc.total) + '<div class="ringtxt"><div class="big num">' + sc.total + '</div><div class="tiny muted">of 100</div></div></div><div class="grow"><div class="eyebrow">Change</div><div class="num" style="font-family:var(--display);font-size:24px;font-weight:700;line-height:1.1">' + scoreDeltaText() + '</div>' + (top ? '<div class="eyebrow" style="margin-top:10px">Next best step</div><div class="small" style="margin-top:2px">' + top.text + '</div>' : '<div class="small muted" style="margin-top:10px">Every part is maxed. Keep it there.</div>') + '</div></div>';
  const sLine = !liftOn() ? 'Lifting is off · up to 40 points if you turn it on' : s.ok ? (s.patterns.some(p => p.top) ? s.patterns.filter(p => p.top).length + ' of 5 movement patterns lifted in 12 weeks' : 'No lift on the standards ladder in the last 12 weeks') : 'Needs body weight and sex under You';
  const cLine = !cardioOn() ? 'Cardio is off · up to 30 points if you turn it on' : c.sessions ? Math.round(c.weeklyMin) + ' min a week over ' + c.sessions + ' session' + (c.sessions === 1 ? '' : 's') + ' · load ' + Math.round(c.weekly).toLocaleString('en-US') + ' of 1,000' + (c.peak ? ' · peak ' + c.peak.mets.toFixed(1) + ' METs on ' + esc(ex(c.peak.ex).name) : '') : 'No cardio in the last 4 weeks';
  const kLine = k.days + ' of ' + k.planned + (goalDays() ? ' goal' : ' planned') + ' days in the last ' + (k.n >= 28 ? '4 weeks' : k.n + ' days') + (k.usingDefault ? ' (no plan set, so 3 a week)' : '');
  const pts = scoreHistory();
  const chart = pts.length >= 2 ? '<div style="margin:12px 0 2px">' + lineChart(pts, v => String(Math.round(v)), 'Athlete score over time') + '</div><div class="tiny muted">Weekly, last 12 weeks</div>' : '';
  const how = '<details class="how"><summary>How it is scored</summary><p><b>Strength, 40.</b> Your best lift in the last 12 weeks in each of five movement patterns (squat, hinge, push, overhead, pull), placed on the strength-standards ladder from beginner to elite, adjusted for body weight, sex and age. 8 points per pattern; a pattern you have not lifted scores 0, so balanced training beats specializing.</p><p><b>Cardio, 30.</b> 20 points for weekly cardio load over the last 4 weeks: minutes × intensity in METs, estimated from speed and incline for walks and runs and from typical values for other activities. Full marks at 1,000 MET-minutes a week, the top of the WHO guideline range. 10 points for the hardest session you sustained for 10 minutes or more in the last 8 weeks (4 METs scores 0, 14 scores 10), adjusted for sex and age.</p><p><b>Consistency, 30.</b> Workout days against planned days over the last 4 weeks. With no plan set, 3 a week is assumed.</p><p>Bands: starting out under 30, building 30 to 49, established 50 to 69, advanced 70 to 84, elite 85 and up. Body composition is on purpose not part of the score.</p></details>';
  return '<div class="card">' + head + hero + '<div class="scorerows">' + scoreRow('Strength', s.ok ? s.pts : null, 40, sLine) + (liftOn() && s.ok && s.patterns.some(p => p.top) ? patternGrid(s) : '') + scoreRow('Cardio', c.pts, 30, cLine) + scoreRow('Consistency', k.pts, 30, kLine) + '</div>' + chart + how + '</div>';
}
function renderProgress(){
  const tk = todayKey(), ws = weekStart(tk), keys = weekKeys(ws);
  const weekW = state.workouts.filter(w => w.date >= ws && w.date <= keys[6]);
  const vol = weekW.reduce((n, w) => n + volumeOf(w), 0);
  const cutoff = keyOf(addDays(new Date(), -30));
  const prs30 = state.workouts.filter(w => w.date >= cutoff).reduce((n, w) => n + (w.prs || []).length, 0);
  const streak = streakWeeks();
  let tgt = 0, kept = 0; for (const w of state.workouts) { if (w.date < cutoff) continue; for (const en of w.entries) for (const s of en.sets) if (s.tw !== undefined) { tgt++; if (s.w >= s.tw - 0.01) kept++; } }
  const keptPct = tgt ? Math.round(kept / tgt * 100) : null;
  const freq = {}; for (const w of state.workouts) for (const en of w.entries) if (en.sets.length) freq[en.ex] = (freq[en.ex] || 0) + 1;
  const exIds = Object.keys(freq).filter(id => freq[id] >= 2).sort((a, b) => ((ex(a).type === 'cardio') - (ex(b).type === 'cardio')) || (freq[b] - freq[a]));
  let sel = state.ui.progEx; if (!sel || exIds.indexOf(sel) < 0) sel = exIds[0] || null;
  return header(streak ? streak + '-week streak' : 'Progress') + '<div class="stack">' + (scoreOn() ? scoreCard() : (liftOn() ? standardsCard(true) : '')) + picksCard() +
    '<div class="tiles">' + tile(weekW.length, 'This week', 'of ' + weeklyTarget() + (goalDays() ? ' goal' : ' planned')) + tile(streak, 'Week streak', streak ? 'weeks in a row with a workout' : 'log a workout to start one') +
      (liftOn() ? tile(fmtVol(vol), 'Lifted this week', wUnit() + ' total') + tile(prs30, 'PRs', 'last 30 days') + tile(keptPct === null ? 'n/a' : keptPct + '%', 'Targets kept', keptPct === null ? 'no targets logged yet' : 'sets done at the suggested weight, 30 days')
        : tile(Math.round(weekW.reduce((n, w) => n + cardioOf(w).sec, 0) / 60), 'Cardio this week', 'minutes') + tile(dispD(weekW.reduce((n, w) => n + cardioOf(w).mi, 0)), 'Distance this week', dUnit()) + tile(Math.round(cardioScore(todayKey()).weekly).toLocaleString('en-US'), 'Cardio load', 'MET-min a week, 4-week average')) +
      tile(state.workouts.filter(w => w.date >= cutoff).length, 'Sessions', 'last 30 days') + '</div>' +
    '<div class="card"><div class="card-head"><div class="h3">Sessions per week</div><div class="tiny muted">last 12 weeks</div></div>' + weeksChart() + '</div>' +
    (exIds.length ? '<div class="card"><div class="eyebrow" style="margin-bottom:8px">By exercise</div><div class="chips">' + exIds.map(id => '<button class="chip' + (id === sel ? ' on' : '') + '" data-act="prog-ex" data-ex="' + id + '">' + esc(ex(id).name) + '</button>').join('') + '</div>' + exerciseChart(sel) + '</div>'
      : '<div class="card empty">Log the same exercise in two sessions and its chart appears here.</div>') + (liftOn() ? (scoreOn() ? standardsCard(false) : '') + calcCard() + plateCard() : '') + '</div>';
}
function levelMix(st){ const c = {}; for (const r of st.ranked) c[r.lv.idx] = (c[r.lv.idx] || 0) + 1; return Object.keys(c).sort((a, b) => b - a).map(i => c[i] + ' ' + (+i ? LEVELS[i - 1].toLowerCase() : 'getting started')).join(' · ') + ' · ' + st.ranked.length + ' lift' + (st.ranked.length === 1 ? '' : 's') + ' on the ladder'; }
/* Standards rows: most-done lifts first by default; the sheet can re-sort and filter by muscle group. */
const STD_SORTS = [['done', 'Most done'], ['level', 'Highest level'], ['next', 'Closest to next level'], ['name', 'A to Z']];
function liftFreq(){ const f = {}; for (const w of state.workouts) for (const en of w.entries) if (working(en.sets).length) f[en.ex] = (f[en.ex] || 0) + 1; return f; }
function standardRows(sort, group){
  const st = strengthStanding(), freq = liftFreq();
  let rows = st.ok ? st.ranked.slice() : st.rows.map(r => Object.assign({lv: null}, r));
  rows.forEach(r => { r.n = freq[r.id] || 0; r.e = ex(r.id); });
  const have = {}; rows.forEach(r => { have[r.id] = 1; });
  const majors = MAJOR_LIFTS.filter(id => !have[id] && ex(id) && visibleEx(ex(id))).map(id => ({id: id, e1: 0, lv: null, n: 0, e: ex(id), unlogged: true}));
  rows = rows.concat(majors);
  if (group) rows = rows.filter(r => r.e.group === group);
  const s = sort || 'done';
  rows.sort((a, b) => {
    if (!!a.unlogged !== !!b.unlogged) return a.unlogged ? 1 : -1;
    if (s === 'name') return a.e.name.localeCompare(b.e.name);
    if (s === 'level' && a.lv && b.lv) return (b.lv.idx + b.lv.prog) - (a.lv.idx + a.lv.prog);
    if (s === 'next' && a.lv && b.lv) return (a.lv.next ? (a.lv.next.lb - a.e1) / a.e1 : 9) - (b.lv.next ? (b.lv.next.lb - b.e1) / b.e1 : 9);
    return (b.n - a.n) || (MAJOR_LIFTS.indexOf(a.id) + 99) % 100 - (MAJOR_LIFTS.indexOf(b.id) + 99) % 100 || a.e.name.localeCompare(b.e.name);
  });
  return {st: st, rows: rows};
}
function standardRow(r){
  const e = r.e, u = wUnit(), bw = state.profile.bw, plus = e.bw ? '+' : '';
  const tag = e.bw ? ' <span class="tiny muted">added weight</span>' : (e.eq === 'dumbbell' || e.eq === 'kettlebell') ? ' <span class="tiny muted">per hand</span>' : '';
  if (r.unlogged || !r.lv) {
    const th = bw ? stdThresholds(r.id) : null;
    const marks = th ? th.slice(0, 3).map((t, k) => LEVELS[k] + ' ' + plus + dispW(roundInc(t * bw, e))).join(' · ') : 'Add your body weight to see the targets';
    return '<div class="lvl unlogged"><div class="top"><span class="nm">' + esc(e.name) + tag + '</span><span class="ratio muted"><small>not logged yet</small></span></div><div class="lvlbar"><i style="width:0"></i></div><div class="sub"><span>' + marks + (th ? ' ' + u : '') + '</span><span></span></div></div>';
  }
  const l = r.lv;
  return '<div class="lvl"><div class="top"><span class="nm">' + esc(e.name) + tag + '</span><span class="ratio">' + l.ratio.toFixed(2) + '×<small>body weight</small></span></div><div class="lvlbar"><i style="width:' + Math.round(l.prog * 100) + '%"></i></div><div class="sub"><span><span class="pill level' + (l.idx >= 4 ? ' high' : '') + '">' + l.label + '</span> · est. 1RM ' + plus + dispW(Math.round(r.e1)) + ' ' + u + (r.n ? ' · ' + r.n + ' session' + (r.n === 1 ? '' : 's') : '') + '</span><span>' + (l.next ? l.next.label + ' at ' + plus + dispW(Math.round(l.next.lb)) + ' ' + u : 'Top of the ladder') + '</span></div></div>';
}
/* lead: the card opens Progress (athlete score off), so it carries an overall level and the next standard. */
function standardsCard(lead){
  const {st, rows} = standardRows('done', null), logged = rows.filter(r => !r.unlogged), todo = rows.filter(r => r.unlogged);
  const head = '<div class="card-head"><div><div class="h3">Strength standards</div><div class="tiny muted">Your lifts, most-done first, then the major lifts still to log</div></div>' + (lead && st.label ? '<span class="pill level' + (st.level >= 4 ? ' high' : '') + '">' + st.label + '</span>' : '') + '</div>';
  let body;
  if (logged.length && !st.ok) body = '<div class="empty">Add your body weight and sex under You to see where each lift stands.<div style="margin-top:10px"><button class="btn sm" data-tab="you">Open You</button></div></div>';
  else {
    const hero = lead && st.label ? '<div class="stdhero"><div class="eyebrow">Overall</div><div class="big">' + st.label.toUpperCase() + '</div><div class="small muted">' + levelMix(st) + '</div>' + (st.ranked.length ? '<div class="eyebrow" style="margin-top:10px">Next standard</div><div class="small" style="margin-top:2px">' + esc(nextStandardLine(st, false)) + '</div>' : '') + '</div>' : '';
    body = hero + '<div class="stdbox">' + logged.map(standardRow).join('') + (todo.length ? '<div class="datehead" style="margin:' + (logged.length ? '10px' : '0') + ' 0 2px">' + (logged.length ? 'Major lifts still to log' : 'Major lifts, with your targets') + '</div>' + todo.map(standardRow).join('') : '') + '</div>' +
      (rows.length > 3 ? '<button class="btn secondary ghost" style="margin-top:10px" data-act="std-open">All ' + rows.length + ' lifts · sort and filter</button>' : '');
  }
  return '<div class="card">' + head + body + '<div class="tiny faint" style="margin-top:10px">Levels: beginner, novice, intermediate, advanced, elite, as a multiple of body weight, adjusted for sex and age. Lifts with a ladder appear here once you log them.' + (lead ? ' Overall is the average of your lifts, and the next standard is the lift closest to its next level.' : '') + ' A guide, not a verdict.</div></div>';
}
function standardsSheet(){
  const ui = state.ui, sort = ui.stdSort || 'done', group = ui.stdGroup || '';
  const all = standardRows(sort, null).rows, groups = Array.from(new Set(all.map(r => r.e.group))).sort();
  const rows = group ? all.filter(r => r.e.group === group) : all;
  return '<div class="between"><div class="h2">Strength standards</div><button class="btn sm ghost" data-act="close">Close</button></div>' +
    '<div class="row" style="margin:12px 0 8px"><span class="grow" style="font-weight:600">Sort by</span><select class="sm" id="std-sort" style="width:200px">' + STD_SORTS.map(s => '<option value="' + s[0] + '"' + (s[0] === sort ? ' selected' : '') + '>' + s[1] + '</option>').join('') + '</select></div>' +
    '<div class="chips" style="margin-bottom:6px"><button class="chip' + (group ? '' : ' on') + '" data-act="std-group" data-g="">All</button>' + groups.map(g => '<button class="chip' + (g === group ? ' on' : '') + '" data-act="std-group" data-g="' + esc(g) + '">' + esc(g) + '</button>').join('') + '</div>' +
    '<div class="stack" style="gap:0">' + (rows.length ? rows.map(standardRow).join('') : '<div class="empty">No lifts in this group yet.</div>') + '</div>';
}
function calcCard(){
  const c = state.ui.calc || (state.ui.calc = {w: isKg() ? 60 * LB_PER_KG : 135, r: 5});
  const one = e1rmBlend(c.w, c.r), ep = e1rm(c.w, c.r), br = brzycki(c.w, c.r);
  const reps = [[1, 1], [2, .95], [3, .925], [5, .875], [8, .8], [10, .75], [12, .7], [15, .65]];
  return '<div class="card"><div class="card-head"><div><div class="h3">One-rep max</div><div class="tiny muted">Enter any set to estimate your max</div></div></div>' +
    '<div class="steppers"><div class="stepper-wrap"><div class="lab"><span>Weight</span><span>' + wUnit() + '</span></div><div class="stepper"><button type="button" data-act="calc-step" data-f="w" data-d="-1" aria-label="Decrease weight">−</button><input inputmode="decimal" data-calc="w" value="' + dispW(c.w) + '" aria-label="Weight"><button type="button" data-act="calc-step" data-f="w" data-d="1" aria-label="Increase weight">+</button></div></div>' +
    '<div class="stepper-wrap"><div class="lab"><span>Reps</span><span></span></div><div class="stepper"><button type="button" data-act="calc-step" data-f="r" data-d="-1" aria-label="Decrease reps">−</button><input inputmode="numeric" data-calc="r" value="' + c.r + '" aria-label="Reps"><button type="button" data-act="calc-step" data-f="r" data-d="1" aria-label="Increase reps">+</button></div></div></div>' +
    '<div class="between" style="margin-top:12px"><div><div class="eyebrow">Estimated one-rep max</div><div class="big num" id="calc-out">' + dispW(Math.round(one)) + ' <span style="font-size:18px;color:var(--muted)">' + wUnit() + '</span></div></div><div class="tiny muted" style="text-align:right" id="calc-sub">Epley ' + dispW(Math.round(ep)) + '<br>Brzycki ' + dispW(Math.round(br)) + (c.r > 12 ? '<br>over 12 reps: rough' : '') + '</div></div>' +
    '<div class="rmgrid" id="calc-grid">' + reps.map(x => '<div><div class="k">' + x[0] + 'RM</div><div class="v">' + dispW(Math.round(one * x[1])) + '</div></div>').join('') + '</div></div>';
}
/* Plate calculator, both directions: type a total and the plates are worked out, or tap plates onto each side and the total follows.
   The loaded plates are kept as tapped, so 45 + 25 + 10 stays 45 + 25 + 10 rather than turning into 45 + 35. */
function plateState(){ const kg = isKg(); const u = state.ui.plates3 || (state.ui.plates3 = {}); if (!u[kg ? 'kg' : 'lb']) u[kg ? 'kg' : 'lb'] = {bar: kg ? 20 : 45, off: [], load: [], target: null}; return u[kg ? 'kg' : 'lb']; }
function plateSizes(ps){ return Object.keys(PLATE_STYLE[isKg() ? 'kg' : 'lb']).map(Number).sort((a, b) => b - a).filter(s => ps.off.indexOf(s) < 0); }
const plateTotal = ps => Math.round((ps.bar + 2 * ps.load.reduce((n, s) => n + s, 0)) * 100) / 100;
function plateSetTarget(ps, v){ ps.target = Math.max(0, Math.round(v * 4) / 4); const res = platesWith(ps.target, ps.bar, plateSizes(ps)); ps.load = res ? res.plates : []; }
function plateCard(){
  const forSet = sheet && sheet.type === 'plates' && state.active && state.active.entries[sheet.i] ? state.active.entries[sheet.i] : null;
  const kg = isKg(), u = wUnit(), ps = plateState(), sizes = Object.keys(PLATE_STYLE[kg ? 'kg' : 'lb']).map(Number).sort((a, b) => b - a), avail = plateSizes(ps), st = PLATE_STYLE[kg ? 'kg' : 'lb'];
  const load = ps.load.slice().sort((a, b) => b - a), total = plateTotal(ps), short = ps.target !== null && ps.target > total + 1e-9 ? Math.round((ps.target - total) * 100) / 100 : 0;
  let out;
  if (ps.target !== null && ps.target < ps.bar) out = '<div class="small muted">Below the bar itself (' + ps.bar + ' ' + u + ').</div>';
  else if (!load.length) out = '<div class="small muted">Empty bar, ' + ps.bar + ' ' + u + '. Tap a plate above to load each side.' + (short ? ' Nothing small enough for the last ' + short + ' ' + u + '.' : '') + '</div>';
  else out = '<div class="plates" style="margin-bottom:6px"><span class="discs">' + load.map(w => { const s = st[w]; return '<i class="disc" style="background:var(' + s[0] + ');height:' + (s[1] + 8) + 'px;width:' + (s[2] + 2) + 'px"' + (s[0] === '--p-black' ? ' data-rim' : '') + '></i>'; }).join('') + '</span></div>' +
    '<div class="row wrap" style="gap:6px">' + load.map(w => '<button class="chip on" data-act="pl-remove" data-s="' + w + '" aria-label="Remove a ' + w + ' plate">' + w + ' <span class="faint">×</span></button>').join('') + '</div>' +
    '<div class="small" style="margin-top:8px">Per side, heaviest inside. Bar plus plates: <b>' + total + ' ' + u + '</b>.' + (short ? ' That is ' + short + ' ' + u + ' short of ' + ps.target + '; nothing on the rack fills the gap.' : '') + '</div>';
  const edit = !!ps.edit;
  const plateBtns = edit
    ? sizes.map(s => '<button class="chip' + (ps.off.indexOf(s) < 0 ? ' on' : '') + '" data-act="pl-size" data-s="' + s + '" aria-pressed="' + (ps.off.indexOf(s) < 0 ? 'true' : 'false') + '">' + s + (ps.off.indexOf(s) < 0 ? ' ✓' : '') + '</button>').join('')
    : avail.map(s => '<button class="chip" data-act="pl-add" data-s="' + s + '" aria-label="Add a ' + s + ' plate to each side">+ ' + s + '</button>').join('');
  return '<div class="card"><div class="card-head"><div><div class="h3">Plate loading</div><div class="tiny muted">Type a weight to see the plates, or tap plates to build the bar</div></div></div>' +
    '<div class="steppers"><div class="stepper-wrap"><div class="lab"><span>Total weight</span><span>' + u + '</span></div><div class="stepper"><button type="button" data-act="pl-step" data-d="-1" aria-label="Less weight">−</button><input inputmode="decimal" data-pl="w" value="' + (ps.target !== null ? ps.target : total) + '" aria-label="Total weight"><button type="button" data-act="pl-step" data-d="1" aria-label="More weight">+</button></div></div>' +
    '<div class="stepper-wrap"><div class="lab"><span>Bar</span><span>' + u + '</span></div><select class="sm" data-pl="bar" style="height:68px;font-size:22px;font-weight:700;font-family:var(--display)">' + BARS[kg ? 'kg' : 'lb'].map(b => '<option value="' + b + '"' + (b === ps.bar ? ' selected' : '') + '>' + b + '</option>').join('') + '</select></div></div>' +
    '<div class="between" style="margin:12px 0 6px"><span class="eyebrow">' + (edit ? 'Plates you have' : 'Add to each side') + '</span><button class="btn link small" data-act="pl-edit">' + (edit ? 'Done' : 'Edit your rack') + '</button></div><div class="toggles" id="plate-btns">' + plateBtns + '</div>' +
    '<div class="divider" style="margin:12px 0"></div><div id="plate-out">' + out + '</div>' +
    (load.length ? '<button class="btn link small" style="margin-top:10px" data-act="pl-clear">Clear the bar</button>' : '') +
    (forSet ? '<button class="btn primary" style="margin-top:14px" data-act="pl-use" data-i="' + sheet.i + '">Use ' + total + ' ' + u + ' for set ' + (counted(forSet.sets).length + 1) + '</button>' : '') + '</div>';
}
function patchPlatesOut(){ const el = $('#plate-out'); if (!el) return; const tmp = document.createElement('div'); tmp.innerHTML = plateCard(); const o = tmp.querySelector('#plate-out'); if (o) el.innerHTML = o.innerHTML; }
function patchPlates(){ const el = $('#plate-out'); if (!el) return; const card = el.closest('.card'); const tmp = document.createElement('div'); tmp.innerHTML = plateCard(); const fresh = tmp.firstElementChild; if (card && fresh) { const w = $('input[data-pl="w"]'); card.replaceWith(fresh); if (w && document.activeElement === w) { const nw = $('input[data-pl="w"]'); if (nw) { nw.focus(); } } } }
function patchCalc(){ const card = $('#calc-out'); if (!card) return; const c = state.ui.calc, one = e1rmBlend(c.w, c.r); card.innerHTML = dispW(Math.round(one)) + ' <span style="font-size:18px;color:var(--muted)">' + wUnit() + '</span>'; const sub = $('#calc-sub'); if (sub) sub.innerHTML = 'Epley ' + dispW(Math.round(e1rm(c.w, c.r))) + '<br>Brzycki ' + dispW(Math.round(brzycki(c.w, c.r))) + (c.r > 12 ? '<br>over 12 reps: rough' : ''); const g = $('#calc-grid'); if (g) g.innerHTML = [[1, 1], [2, .95], [3, .925], [5, .875], [8, .8], [10, .75], [12, .7], [15, .65]].map(x => '<div><div class="k">' + x[0] + 'RM</div><div class="v">' + dispW(Math.round(one * x[1])) + '</div></div>').join(''); }

/* Plan */
function renderPlan(){
  const opts = rid => '<option value="">Rest</option>' + state.routines.map(r => '<option value="' + r.id + '"' + (r.id === rid ? ' selected' : '') + '>' + esc(r.name) + '</option>').join('');
  const alert = state.settings.sound && state.settings.vibrate ? 'both' : state.settings.sound ? 'sound' : state.settings.vibrate ? 'vibrate' : 'none';
  const sel = (v, cur) => v === cur ? ' selected' : '';
  const c = state.cycle, order = !!c.on;
  const modeChips = '<div class="toggles" style="margin-bottom:12px"><button class="chip' + (order ? '' : ' on') + '" data-act="cycle-mode" data-v="week" aria-pressed="' + (order ? 'false' : 'true') + '">By weekday</button><button class="chip' + (order ? ' on' : '') + '" data-act="cycle-mode" data-v="order" aria-pressed="' + (order ? 'true' : 'false') + '">Repeating order</button></div>';
  const stepName = s => s.map(id => routine(id)).filter(Boolean).map(r => esc(r.name)).join(' + ') || 'Rest';
  const todayIdx = c.seq.length ? cycleIndex(todayKey()) : 0;
  const orderBody = '<div class="tiny muted" style="margin-bottom:10px">Runs top to bottom one day at a time, rest days included, then starts over. Weekdays do not matter.</div><div class="stack" style="gap:6px">' +
    c.seq.map((s, k) => '<div class="row" style="gap:6px"><span class="eyebrow" style="width:50px">Day ' + (k + 1) + '</span><span class="grow' + (s.length ? '' : ' muted') + '" style="font-weight:600">' + stepName(s) + (k === todayIdx ? ' <span class="pill cardio">today</span>' : '') + '</span>' +
      '<button class="x" data-act="cycle-move" data-k="' + k + '" data-d="-1" aria-label="Move up"' + (k ? '' : ' disabled style="opacity:.3"') + '>↑</button><button class="x" data-act="cycle-move" data-k="' + k + '" data-d="1" aria-label="Move down"' + (k < c.seq.length - 1 ? '' : ' disabled style="opacity:.3"') + '>↓</button><button class="x" data-act="cycle-del" data-k="' + k + '" aria-label="Remove day ' + (k + 1) + '">×</button></div>').join('') +
    '<div class="row" style="margin-top:4px"><select class="sm" data-cycle-add="1" aria-label="Add a day"><option value="">Add a day…</option><option value="rest">Rest day</option>' + state.routines.map(r => '<option value="' + r.id + '">' + esc(r.name) + '</option>').join('') + '</select></div>' +
    (c.seq.length ? '<div class="row" style="margin-top:8px"><span class="grow" style="font-weight:600">Today is</span><select class="sm" data-cycle-today="1" style="width:176px" aria-label="Which day today is">' + c.seq.map((s, k) => '<option value="' + k + '"' + (k === todayIdx ? ' selected' : '') + '>Day ' + (k + 1) + ' · ' + stepName(s) + '</option>').join('') + '</select></div>' : '<div class="tiny muted" style="margin-top:6px">Add your routines and rest days in the order you want them.</div>') + '</div>';
  return header('Plan') + '<div class="stack">' +
    '<div class="card"><div class="card-head"><div><div class="h3">' + (order ? 'Repeating order' : 'Weekly plan') + '</div><div class="tiny muted">' + (order && c.seq.length ? c.seq.filter(s => s.some(id => routine(id))).length + ' training in every ' + c.seq.length + ' days, about ' + plannedPerWeek() + ' a week' : plannedPerWeek() + ' training day' + (plannedPerWeek() === 1 ? '' : 's') + ' on the plan') + '</div></div></div>' + modeChips +
      '<div class="row" style="margin-bottom:12px"><span class="grow" style="font-weight:600">Goal</span><select class="sm" data-set="goalDays" style="width:176px" aria-label="Workout days a week goal"><option value="0"' + (goalDays() ? '' : ' selected') + '>Follow the plan</option>' + [1, 2, 3, 4, 5, 6, 7].map(n => '<option value="' + n + '"' + (goalDays() === n ? ' selected' : '') + '>' + n + ' day' + (n === 1 ? '' : 's') + ' a week</option>').join('') + '</select></div><div class="stack" style="gap:8px">' +
      (order ? orderBody : [1, 2, 3, 4, 5, 6, 0].map(d => { const rs = dayPlan(d), rest = state.routines.filter(r => rs.indexOf(r) < 0); return '<div class="row" style="align-items:flex-start"><span style="width:92px;font-weight:600;padding-top:8px">' + DAYS_LONG[d] + '</span><div class="grow row wrap" style="gap:6px">' + rs.map(r => '<span class="chip on" style="gap:8px">' + esc(r.name) + '<button class="x" data-act="plan-remove" data-d="' + d + '" data-rid="' + r.id + '" aria-label="Remove ' + esc(r.name) + '" style="margin:-4px -8px -4px 0">×</button></span>').join('') + (rest.length ? '<select class="sm" data-plan-add="' + d + '" aria-label="Add a routine on ' + DAYS_LONG[d] + '" style="width:' + (rs.length ? 96 : 160) + 'px"><option value="">' + (rs.length ? '+ Add' : 'Rest') + '</option>' + rest.map(r => '<option value="' + r.id + '">' + esc(r.name) + '</option>').join('') + '</select>' : (rs.length ? '' : '<span class="small muted" style="padding-top:8px">Rest</span>')) + '</div></div>'; }).join('')) + '</div><div class="tiny muted" style="margin-top:10px">A day can hold more than one routine, for example lifting in the morning and a run at night.</div></div>' +
    '<div class="card"><div class="card-head"><div class="h3">Routines</div><button class="btn sm" data-act="new-routine">+ New</button></div><div class="stack" style="gap:8px">' +
      state.routines.map(r => '<button class="exrow" data-act="edit-routine" data-rid="' + r.id + '"><div class="grow"><div class="name">' + esc(r.name) + '</div><div class="meta ellip">' + (r.items.map(it => esc(ex(it.ex).name)).join(', ') || 'No exercises yet') + '</div></div><span class="muted">›</span></button>').join('') +
      (state.routines.length ? '<div class="row" style="margin-top:4px"><select class="sm" id="tpl" aria-label="Copy a routine"><option value="">Copy one of yours as a template…</option>' + state.routines.map(r => '<option value="' + r.id + '">' + esc(r.name) + '</option>').join('') + '</select><button class="btn sm" data-act="add-template">Copy</button></div>' : '<div class="tiny muted" style="margin-top:6px">Build a routine once and you can copy it as the starting point for the next one.</div>') + '</div></div>' +
    '</div>';
}

/* You */
function heightRow(p){
  const sel = (v, cur) => v === cur ? ' selected' : '';
  if (isKg()) { const cm = p.height ? Math.round(p.height * 2.54) : null; return '<div class="row"><span class="grow" style="font-weight:600">Height</span><select class="sm" data-prof="heightcm" style="width:160px"><option value=""' + (cm ? '' : ' selected') + '>Not set</option>' + Array.from({length: 76}, (_, i) => i + 140).map(v => '<option value="' + v + '"' + sel(v, cm) + '>' + v + ' cm</option>').join('') + '</select></div>'; }
  const ft = p.height ? Math.floor(p.height / 12) : null, inch = p.height ? p.height % 12 : null;
  return '<div class="row"><span class="grow" style="font-weight:600">Height</span><div class="row" style="width:192px;gap:6px"><select class="sm" data-prof="heightft" aria-label="Feet"><option value=""' + (ft ? '' : ' selected') + '>ft</option>' + [4, 5, 6, 7].map(v => '<option value="' + v + '"' + sel(v, ft) + '>' + v + ' ft</option>').join('') + '</select><select class="sm" data-prof="heightin" aria-label="Inches"><option value=""' + (inch === null ? ' selected' : '') + '>in</option>' + Array.from({length: 12}, (_, i) => i).map(v => '<option value="' + v + '"' + sel(v, inch) + '>' + v + ' in</option>').join('') + '</select></div></div>';
}
function bodyweightCard(){
  const s = state.settings, list = state.bodyweights.slice().sort((a, b) => a.date < b.date ? -1 : 1), last = list[list.length - 1];
  const cutoff = keyOf(addDays(new Date(), -30)); const first30 = list.find(x => x.date >= cutoff);
  const delta = last && first30 && first30 !== last ? last.lb - first30.lb : null;
  const pts = list.slice(-26).map(x => ({x: x.date, y: isKg() ? x.lb / LB_PER_KG : x.lb}));
  const chart = pts.length >= 2 ? lineChart(pts, v => String(Math.round(v * 10) / 10), 'Body weight over time') : '<div class="empty" style="padding:12px">Log your weight a few times and the trend shows here.</div>';
  const due = s.bwReminderDays && (!last || last.date <= keyOf(addDays(new Date(), -s.bwReminderDays)));
  return '<div class="card"><div class="card-head"><div><div class="h3">Body weight</div><div class="tiny muted">' + (last ? 'Last logged ' + relDay(last.date) + (delta !== null ? ' · ' + (delta > 0 ? '+' : '') + dispW(Math.round(delta * 10) / 10) + ' ' + wUnit() + ' over 30 days' : '') : 'Nothing logged yet') + '</div></div>' + (due ? '<span class="pill sample">Due</span>' : '') + '</div>' +
    '<div class="row" style="gap:8px;margin-bottom:10px"><button class="btn grow" data-act="bw-log">Log ' + (state.profile.bw ? dispW(state.profile.bw) + ' ' + wUnit() : 'today') + '</button>' + (s.showBf ? '<div class="stepper-wrap" style="width:120px"><div class="stepper" style="height:44px"><button type="button" data-act="bf-step" data-d="-1" aria-label="Decrease body fat">−</button><input inputmode="decimal" data-bf="1" value="' + (last && last.bf ? last.bf : '') + '" placeholder="fat %" aria-label="Body fat percent" style="font-size:18px"><button type="button" data-act="bf-step" data-d="1" aria-label="Increase body fat">+</button></div></div>' : '') + '</div>' +
    '<div class="tiny muted" style="margin-bottom:8px">Set the number with the body weight stepper above, then log it.</div>' + chart +
    '<div class="row" style="margin-top:12px"><span class="grow" style="font-weight:600">Remind me</span><select class="sm" data-set="bwReminderDays" style="width:160px">' + [[0, 'Off'], [7, 'Every 7 days'], [14, 'Every 14 days'], [30, 'Every 30 days']].map(o => '<option value="' + o[0] + '"' + (s.bwReminderDays === o[0] ? ' selected' : '') + '>' + o[1] + '</option>').join('') + '</select></div>' +
    '<div class="row" style="margin-top:8px"><span class="grow" style="font-weight:600">Body fat %</span><select class="sm" data-set="showBf" style="width:160px"><option value="0"' + (!s.showBf ? ' selected' : '') + '>Hidden</option><option value="1"' + (s.showBf ? ' selected' : '') + '>Shown</option></select></div>' +
    (list.length ? '<div class="eyebrow" style="margin-top:14px">Recent weigh-ins</div><div class="stack" style="gap:0;margin-top:4px">' + list.slice(-5).reverse().map(x => '<div class="between small" style="padding:7px 0;border-top:1px solid var(--border)"><span>' + esc(fmtLong(x.date)) + (x.t ? ' <span class="muted">· ' + fmtTime(x.t) + '</span>' : '') + '</span><span class="num"><b>' + dispW(x.lb) + ' ' + wUnit() + '</b>' + (x.bf ? ' <span class="muted">· ' + x.bf + '%</span>' : '') + '</span></div>').join('') + '</div><div class="tiny faint" style="margin-top:8px">' + list.length + ' entries · <button class="btn link small" data-act="bw-undo">remove the latest</button></div>' : '') + '</div>';
}
const METRICS = [['score', 'Athlete score'], ['days7', 'Workout days, this week'], ['days30', 'Workout days, 30 days'], ['days60', 'Workout days, 60 days'], ['days90', 'Workout days, 90 days'], ['lifted7', 'Lifted, 7 days', 'lift'], ['lifted30', 'Lifted, 30 days', 'lift'], ['bwChange', 'Body weight change'], ['cardio7', 'Cardio minutes, 7 days', 'cardio'], ['run', 'Miles run, 30 days', 'cardio'], ['walk', 'Miles walked, 30 days', 'cardio'], ['cycle', 'Miles cycled, 30 days', 'cardio'], ['swim', 'Swim distance, 30 days', 'cardio'], ['sauna7', 'Sauna, 7 days', 'rec:sauna'], ['cold7', 'Cold tub, 7 days', 'rec:cold'], ['hot7', 'Hot tub, 7 days', 'rec:hot']];
const metricsAvailable = () => METRICS.filter(x => (x[0] === 'score' ? (scoreOn() || liftOn()) : true) && (!x[2] || (x[2] === 'lift' ? liftOn() : x[2] === 'cardio' ? cardioOn() : !!(state.settings.rec && state.settings.rec[x[2].slice(4)]))));
const metricLabel = x => x[0] === 'score' && !scoreOn() ? 'Strength level' : x[1];
function metricsCard(){
  const m = state.settings.metrics;
  return '<div class="card"><div class="h3" style="margin-bottom:4px">Home metrics</div><p class="small muted" style="margin:0 0 10px">Pick what shows on Today. Tap to turn each one on or off.</p><div class="toggles">' + metricsAvailable().map(x => '<button class="chip' + (m[x[0]] ? ' on' : '') + '" data-act="metric" data-k="' + x[0] + '">' + metricLabel(x) + '</button>').join('') + '</div></div>';
}
function customCard(){
  const list = state.custom.filter(e => !e.archived);
  return '<div class="card"><div class="card-head"><div><div class="h3">Your exercises</div><div class="tiny muted">' + (list.length ? list.length + ' custom' : 'None yet. Type a new name in the exercise picker to create one.') + '</div></div></div>' +
    (list.length ? '<div class="list">' + list.map(e => '<div class="item" style="display:flex;justify-content:space-between;align-items:center;gap:10px;padding:10px 12px;border:1px solid var(--border);border-radius:var(--radius-sm);background:var(--surface-2)"><div class="grow"><div style="font-weight:600">' + esc(e.name) + '</div><div class="tiny muted">' + esc(e.group) + ' · ' + (e.type === 'cardio' ? 'cardio' : 'lift') + '</div></div><button class="btn sm" data-act="custom-edit" data-ex="' + e.id + '">Edit</button><button class="btn sm danger" data-act="custom-del" data-ex="' + e.id + '">' + (state.ui.confirmDel === e.id ? 'Sure?' : 'Delete') + '</button></div>').join('') + '</div>' : '') + '</div>';
}
function macroCard(p){
  const sel = (v, cur) => v === cur ? ' selected' : '';
  const m = macros();
  const controls = '<div class="stack" style="gap:10px">' +
    '<div class="row"><span class="grow" style="font-weight:600">Goal</span><select class="sm" data-prof="goal" style="width:160px">' + GOALS.map(g => '<option value="' + g[0] + '"' + sel(g[0], p.goal) + '>' + g[1] + '</option>').join('') + '</select></div>' +
    '<div class="row"><span class="grow" style="font-weight:600">Activity</span><select class="sm" data-prof="activity" style="width:160px">' + ACTIVITY.map(a => '<option value="' + a[0] + '"' + sel(a[0], p.activity) + '>' + a[1] + '</option>').join('') + '</select></div></div>';
  const pct = (g, per, cal) => Math.round(g * per / cal * 100);
  const body = m
    ? '<div class="between" style="margin-top:14px"><div><div class="eyebrow">' + esc(m.goal[1]) + ' · calories a day</div><div class="big num">' + m.cal.toLocaleString('en-US') + '</div></div><div class="tiny muted" style="text-align:right">Resting ' + m.bmr.toLocaleString('en-US') + '<br>Maintenance ' + m.tdee.toLocaleString('en-US') + '</div></div>' +
      '<div class="macros"><div><div class="v">' + m.protein + '<small>g</small></div><div class="k">Protein</div><div class="p">' + pct(m.protein, 4, m.cal) + '% · ' + (isKg() ? (m.goal[3] * 2.2).toFixed(1) + ' g/kg' : m.goal[3] + ' g/lb') + '</div></div><div><div class="v">' + m.carbs + '<small>g</small></div><div class="k">Carbs</div><div class="p">' + pct(m.carbs, 4, m.cal) + '% · the rest</div></div><div><div class="v">' + m.fat + '<small>g</small></div><div class="k">Fat</div><div class="p">' + pct(m.fat, 9, m.cal) + '% of calories</div></div></div>' +
      '<div class="tiny muted" style="margin-top:10px">' + esc(m.goal[5]) + '</div>' +
      '<div class="eyebrow" style="margin:14px 0 6px">By goal · grams a day</div><div class="tw"><table class="goaltable"><tr><th></th><th>Cal</th><th>Protein</th><th>Carbs</th><th>Fat</th></tr>' + GOALS.map(g => { const x = macrosFor(g[0]); const cell = (v, per) => '<td class="num">' + v + '<span class="faint">' + pct(v, per, x.cal) + '%</span></td>'; return '<tr' + (g[0] === m.goal[0] ? ' class="on"' : '') + '><td>' + esc(g[1]) + '</td><td class="num">' + x.cal.toLocaleString('en-US') + '</td>' + cell(x.protein, 4) + cell(x.carbs, 4) + cell(x.fat, 9) + '</tr>'; }).join('') + '</table></div>' +
      '<div class="tiny faint" style="margin-top:8px">Estimates for healthy adults, not medical advice. Give a goal two weeks, then adjust by the scale and the mirror.</div>'
    : '<div class="empty" style="padding-top:14px">Fill in sex, age, height and body weight above and your numbers appear here.</div>';
  return '<div class="card"><div class="card-head"><div><div class="h3">Macros by goal</div><div class="tiny muted">Daily calories, protein, carbs and fat for the goal you pick</div></div></div>' + controls + body + '</div>';
}
/* Feedback: posts to Netlify Forms when the site is hosted there (Ben gets an email), otherwise opens a prefilled email. */
let fbSent = null;
function feedbackCard(){
  const fb = state.ui.fb || (state.ui.fb = {type: 'feature', msg: '', name: '', email: ''});
  if (fbSent) return '<div class="card"><div class="h3" style="margin-bottom:4px">Feedback</div><p class="small" style="margin:0 0 10px">' + (fbSent === 'mail' ? 'Your mail app should be open with the feedback filled in. Tap send there and it reaches Ben.' : 'Sent. It goes straight to Ben. Thank you.') + '</p><button class="btn sm" data-act="fb-again">Send another</button></div>';
  return '<div class="card"><div class="h3" style="margin-bottom:4px">Feedback</div><p class="small muted" style="margin:0 0 10px">What is missing, what is annoying, what would make you use this every week? It goes to Ben by email.</p><div class="stack" style="gap:10px">' +
    '<div class="row"><span class="grow" style="font-weight:600">This is</span><select class="sm" id="fb-type" style="width:190px">' + FB_TYPES.map(t => '<option value="' + t[0] + '"' + (fb.type === t[0] ? ' selected' : '') + '>' + t[1] + '</option>').join('') + '</select></div>' +
    '<textarea class="input" id="fb-msg" placeholder="For example: I want supersets, or the rest timer should keep counting when I switch apps" aria-label="Your feedback">' + esc(fb.msg) + '</textarea>' +
    '<input class="input" id="fb-name" placeholder="Your name" value="' + esc(fb.name || '') + '" aria-label="Your name" autocomplete="name">' +
    '<input class="input" id="fb-email" type="email" placeholder="Your email, if you want a reply" value="' + esc(fb.email || '') + '" aria-label="Your email" autocomplete="email" inputmode="email">' +
    '<button class="btn primary" data-act="fb-send">Send feedback</button></div></div>';
}
function sendFeedback(){
  const fb = state.ui.fb || {}, msg = (fb.msg || '').trim();
  if (!msg) { toast('Write a line or two first'); const ta = $('#fb-msg'); if (ta) ta.focus(); return; }
  const label = (FB_TYPES.find(t => t[0] === fb.type) || FB_TYPES[0])[1], name = (fb.name || '').trim(), email = (fb.email || '').trim(), device = navigator.userAgent.slice(0, 160);
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { toast('That email does not look right'); const el = $('#fb-email'); if (el) el.focus(); return; }
  const done = mode => { fbSent = mode; state.ui.fb = {type: 'feature', msg: '', name: name, email: email}; render(); };
  const mail = () => { location.href = 'mailto:' + FEEDBACK_TO + '?subject=' + encodeURIComponent('Bearing feedback: ' + label) + '&body=' + encodeURIComponent(msg + '\n\n' + (name ? 'Name: ' + name + '\n' : '') + (email ? 'Email: ' + email + '\n' : '') + 'Version ' + APP_VERSION + ' · ' + device); done('mail'); };
  if (window.NETLIFY_FORMS && window.fetch) {
    const btn = $('[data-act="fb-send"]'); if (btn) { btn.disabled = true; btn.textContent = 'Sending'; }
    const fields = {'form-name': 'feedback', type: label, message: msg, name: name, email: email, version: APP_VERSION, device: device, page: location.hostname};
    if (window.NATIVE_BUILD) { fields.page = 'app ' + (window.Capacitor && window.Capacitor.getPlatform ? window.Capacitor.getPlatform() : 'native'); fetch(SITE_URL + '/', {method: 'POST', mode: 'no-cors', headers: {'Content-Type': 'application/x-www-form-urlencoded'}, body: new URLSearchParams(fields).toString()}).then(() => done('sent'), mail); }
    else fetch('/', {method: 'POST', headers: {'Content-Type': 'application/x-www-form-urlencoded'}, body: new URLSearchParams(fields).toString()}).then(r => { if (r.ok) done('sent'); else mail(); }, mail);
  } else mail();
}
function trackCard(){
  const t = state.settings.track;
  const chip = (k, label, on) => '<button class="chip' + (on ? ' on' : '') + '" data-act="track" data-k="' + k + '" aria-pressed="' + (on ? 'true' : 'false') + '">' + label + (on ? ' ✓' : '') + '</button>';
  const line = t.lift && t.cardio ? 'Both are on: the coach sets lifting targets and cardio targets.' : t.lift ? 'Cardio is off: no cardio exercises, templates, tiles or advice. Turn it back on any time; nothing logged is lost.' : 'Lifting is off: no lifts, standards or lifting advice. The coach runs your cardio. Turn it back on any time; nothing logged is lost.';
  const on = scoreOn();
  return '<div class="card"><div class="h3" style="margin-bottom:4px">What you track</div><p class="small muted" style="margin:0 0 10px">Turn off the part of the app you do not use. Lifting or cardio stays on.</p><div class="toggles">' + chip('lift', 'Lifting', t.lift) + chip('cardio', 'Cardio', t.cardio) + '</div><div class="tiny muted" style="margin-top:10px">' + line + '</div>' +
    '<div class="divider" style="margin:12px 0"></div><div style="font-weight:600;margin-bottom:6px">Recovery</div><div class="toggles">' + REC_KINDS.map(k => '<button class="chip' + (state.settings.rec[k[0]] ? ' on' : '') + '" data-act="rec-kind" data-k="' + k[0] + '" aria-pressed="' + (state.settings.rec[k[0]] ? 'true' : 'false') + '">' + k[1] + (state.settings.rec[k[0]] ? ' ✓' : '') + '</button>').join('') + '</div><div class="tiny muted" style="margin-top:10px">' + (recoveryOn() ? 'Sessions log from Today in minutes, with a temperature if you want, and stay out of the score.' : 'Turn one on to log sessions from Today.') + '</div>' +
    waterSettings() +
    '<div class="divider" style="margin:12px 0"></div><div class="between"><div class="grow"><div style="font-weight:600">Athlete score</div><div class="tiny muted">' + (on ? 'The 0 to 100 score leads Progress and Today.' : (t.lift ? 'Off. Strength standards lead Progress and Today instead.' : 'Off. Progress leads with your cardio numbers.')) + '</div></div><button class="chip' + (on ? ' on' : '') + '" data-act="score-toggle" aria-pressed="' + (on ? 'true' : 'false') + '">' + (on ? 'On ✓' : 'Off') + '</button></div></div>';
}
function waterSettings(){
  const s = state.settings.water || {}, on = waterOn(), u = waterUnit(), base = s.goal || waterAutoGoal(), bonus = s.bonus !== false;
  return '<div class="divider" style="margin:12px 0"></div><div class="between"><div class="grow"><div style="font-weight:600">Water</div><div class="tiny muted">' + (on ? 'Quick log on Today. Goal ' + dispVol(base) + ' ' + u + (s.goal ? ', set by hand' + (state.profile.bw ? ' (half your body weight would be ' + dispVol(waterAutoGoal()) + ')' : '') : (state.profile.bw ? ': half your body weight in ounces' : ', a default until you add your body weight above')) + (bonus ? '. Training and sauna days add more: ' + dispVol(12) + ' ' + u + ' per half hour trained, ' + dispVol(16) + ' per 15 minutes of sauna, ' + dispVol(8) + ' per 15 of hot tub.' : '.') : 'Off. Turn it on for a daily goal and a quick log on Today.') + '</div></div><button class="chip' + (on ? ' on' : '') + '" data-act="water-toggle" aria-pressed="' + (on ? 'true' : 'false') + '">' + (on ? 'On ✓' : 'Off') + '</button></div>' +
    (on ? '<div class="row" style="margin-top:10px;gap:8px"><span class="small grow">Daily goal, ' + u + '</span><div class="stepper" style="width:150px;height:40px"><button type="button" data-act="water-goal" data-d="-1" aria-label="Lower goal">−</button><input inputmode="numeric" data-wgoal="1" value="' + dispVol(base) + '" aria-label="Daily water goal"><button type="button" data-act="water-goal" data-d="1" aria-label="Raise goal">+</button></div></div>' +
      (s.goal ? '<div style="margin-top:6px"><button class="btn link small" data-act="water-auto">Use my body weight instead (' + dispVol(waterAutoGoal()) + ' ' + u + ')</button></div>' : '') +
      '<div class="row" style="margin-top:8px;gap:8px"><span class="small grow">Add more on training and sauna days</span><button class="chip' + (bonus ? ' on' : '') + '" data-act="water-bonus" aria-pressed="' + (bonus ? 'true' : 'false') + '">' + (bonus ? 'On ✓' : 'Off') + '</button></div>' : '');
}
function renderYou(){
  const p = state.profile, alert = state.settings.sound && state.settings.vibrate ? 'both' : state.settings.sound ? 'sound' : state.settings.vibrate ? 'vibrate' : 'none';
  const sel = (v, cur) => v === cur ? ' selected' : '';
  const ages = Array.from({length: 75}, (_, i) => i + 16).map(a => '<option value="' + a + '"' + sel(a, p.age) + '>' + a + '</option>').join('');
  return header('You') + '<div class="stack">' +
    '<div class="card"><div class="h3" style="margin-bottom:4px">About you</div><p class="small muted" style="margin:0 0 12px">Used for strength standards, starting weights and macros. Stays on this device.</p><div class="stack" style="gap:10px">' +
      '<div class="row"><span class="grow" style="font-weight:600">Sex</span><select class="sm" data-prof="sex" style="width:160px"><option value=""' + sel(null, p.sex) + '>Not set</option><option value="m"' + sel('m', p.sex) + '>Male</option><option value="f"' + sel('f', p.sex) + '>Female</option></select></div>' +
      '<div class="row"><span class="grow" style="font-weight:600">Age</span><select class="sm" data-prof="age" style="width:160px"><option value=""' + (p.age ? '' : ' selected') + '>Not set</option>' + ages + '</select></div>' +
      (liftOn() ? '<div class="row"><span class="grow" style="font-weight:600">Experience</span><select class="sm" data-prof="level" style="width:160px"><option value=""' + sel(null, p.level) + '>Not set</option><option value="new"' + sel('new', p.level) + '>New to lifting</option><option value="returning"' + sel('returning', p.level) + '>Returning after a break</option><option value="consistent"' + sel('consistent', p.level) + '>Consistent, a year or more</option></select></div>' : '') +
      heightRow(p) +
      '<div class="stepper-wrap" style="margin-top:4px"><div class="lab"><span>Body weight</span><span>' + wUnit() + '</span></div><div class="stepper"><button type="button" data-act="bw-step" data-d="-1" aria-label="Decrease body weight">−</button><input inputmode="decimal" data-bw="1" value="' + (p.bw ? dispW(p.bw) : '') + '" placeholder="' + (isKg() ? '80' : '180') + '" aria-label="Body weight"><button type="button" data-act="bw-step" data-d="1" aria-label="Increase body weight">+</button></div></div>' +
    '</div></div>' +
    trackCard() +
    bodyweightCard() +
    macroCard(p) +
    metricsCard() +
    customCard() +
    feedbackCard() +
    '<div class="card"><div class="h3" style="margin-bottom:10px">Settings</div><div class="stack" style="gap:10px">' +
      '<div class="row"><span class="grow" style="font-weight:600">Units</span><select class="sm" data-set="unit" style="width:160px"><option value="lb"' + sel('lb', state.settings.unit) + '>lb · miles</option><option value="kg"' + sel('kg', state.settings.unit) + '>kg · km</option></select></div>' +
      (recoveryOn() ? '<div class="row"><span class="grow" style="font-weight:600">Temperature</span><select class="sm" data-set="tempUnit" style="width:160px"><option value="f"' + sel(false, isC()) + '>°F</option><option value="c"' + sel(true, isC()) + '>°C</option></select></div>' : '') +
      '<div class="row"><span class="grow" style="font-weight:600">Default rest between sets</span><select class="sm" data-set="rest" style="width:160px">' + [45, 60, 90, 120, 150, 180, 240].map(s => '<option value="' + s + '"' + sel(s, state.settings.rest) + '>' + mmss(s) + '</option>').join('') + '</select></div>' +
      '<div class="row"><span class="grow" style="font-weight:600">Rest between warm-up sets</span><select class="sm" data-set="wuRest" style="width:160px">' + wuRestOptionsHTML(state.settings.wuRest) + '</select></div>' +
      '<div class="row"><span class="grow" style="font-weight:600">When rest ends</span><select class="sm" data-set="alert" style="width:200px"><option value="both"' + sel('both', alert) + '>Sound and vibration</option><option value="sound"' + sel('sound', alert) + '>Sound only</option><option value="vibrate"' + sel('vibrate', alert) + '>Vibration only</option><option value="none"' + sel('none', alert) + '>Nothing</option></select></div>' +
      (state.settings.sound ? '<div class="row"><span class="grow" style="font-weight:600">Alert sound</span><select class="sm" data-set="tone" style="width:160px">' + TONES.map(t => '<option value="' + t.id + '"' + sel(t.id, state.settings.tone) + '>' + t.name + '</option>').join('') + '</select></div>' : '') +
      (alert !== 'none' ? '<div class="row" style="align-items:flex-start;gap:12px"><p class="tiny muted grow" style="margin:0">' + alertHelp() + '</p><button class="btn sm" data-act="alert-test" style="flex:none">Test</button></div>' : '') +
    '</div></div>' +
    accountCard() +
    '<div class="card"><div class="h3" style="margin-bottom:6px">Your data</div><p class="small muted" style="margin:0 0 10px">' + (signedIn() ? 'Your log lives on this phone and in your account. Backups are a second copy you can keep anywhere.' : 'Everything is saved on this device only. Copy a backup now and then, or when moving to a new phone.') + '</p>' +
      '<div class="row"><button class="btn grow" data-act="backup">Copy backup</button><button class="btn grow" data-act="restore">Restore</button></div>' +
      '<div class="row" style="margin-top:14px;gap:16px"><button class="btn link small" data-act="setup-again">Run setup again</button><button class="btn link danger small" data-act="clear-ask">Clear all data</button></div></div>' +
    '<div class="youfoot"><span class="brand sym quiet" aria-hidden="true">' + BRAND.symbol + '</span><span class="brand wm quiet" role="img" aria-label="Bearing">' + BRAND.wordmark + '</span><div class="tiny faint">Training with direction · v' + APP_VERSION + '</div></div>' +
    '</div>';
}

/* Sheets */
/* Coach summary of a finished session: what went well and what to aim at next, from the same rules the coach uses. */
function coachSummary(a){
  const good = [], focus = [], u = wUnit();
  if (a.light) {
    const names = a.entries.filter(en => en.sets.length).map(en => ex(en.ex).name);
    return {good: names.length ? ['Light day done: ' + names.join(', ') + '.', 'Showing up on a low day is what keeps the habit.'] : ['Light day logged.'],
      focus: [lightWeekOn() ? 'Light week runs through ' + fmtShort(state.settings.lightUntil) + '. Nothing from it moves the plan.' : 'Nothing from today moves the plan. Next session picks up where the coach left off.']};
  }
  for (const en of a.entries) {
    const e = ex(en.ex), t = en.target || {};
    if (e.type === 'cardio') {
      const sec = en.sets.reduce((n, s) => n + (s.sec || 0), 0); if (!sec) { focus.push('Skipped ' + e.name + '.'); continue; }
      const mi = en.sets.reduce((n, s) => n + (s.mi || 0), 0), planned = (t.min || 0) * 60;
      const last = historyFor(en.ex, 1)[0], lastSec = last ? last.sets.reduce((n, s) => n + (s.sec || 0), 0) : 0, lastMi = last ? last.sets.reduce((n, s) => n + (s.mi || 0), 0) : 0;
      if (planned && sec < planned * 0.85) focus.push(e.name + ' came in at ' + Math.round(sec / 60) + ' of ' + t.min + ' planned minutes.');
      else if (last && mi && lastMi && paceOf(sec, mi) < paceOf(lastSec, lastMi) * 0.98) good.push(e.name + ': ' + paceLabel(sec, mi) + ', faster than last time.');
      else if (last && sec > lastSec * 1.1) good.push(e.name + ': ' + Math.round(sec / 60) + ' minutes, longer than last time.');
      else good.push(e.name + ' done' + (planned ? ' as planned' : '') + '.');
      continue;
    }
    const sets = counted(en.sets);
    if (!sets.length) { focus.push('Skipped ' + e.name + '.'); continue; }
    if (en.adj) { good.push(e.name + ': ' + (en.adj === 'hold' ? 'held at ' + dispW(workingWeight(sets)) + ' ' + u : 'took 10% off') + ' at your call. The plan stays put.'); continue; }
    const lo = t.fail ? 0 : (t.reps || 0), hi = t.fail ? 0 : (t.hi === 99 ? lo : (t.hi || lo)), n = t.sets || sets.length;
    const prs = sets.filter(s => s.pr);
    if (prs.length) { const top = topSet(sets); good.push('New best on ' + e.name + ': ' + (top.w ? dispW(top.w) + ' ' + u + ' × ' : '') + top.r + (e.time ? ' s' : '') + '.'); }
    const last = historyFor(en.ex, 1)[0], W = workingWeight(sets), lastW = last ? workingWeight(last.sets) : 0;
    if (!e.time && !e.bw && lastW && W > lastW + 0.01) good.push(e.name + ' moved up to ' + dispW(W) + ' ' + u + '.');
    if (sets.length < n) focus.push('Only ' + sets.length + ' of ' + n + ' sets on ' + e.name + '.');
    const short = sets.filter(s => lo && s.r < lo && !goalMet(s));
    if (short.length) focus.push(e.name + ' fell short on ' + (short.length === 1 ? 'one set' : short.length + ' sets') + ' (' + sets.map(s => s.r).join(', ') + ' against ' + lo + '), so the weight holds next time.');
    else if (hi && sets.length >= Math.max(2, n - 1) && sets.every(s => s.r >= hi) && !prs.length) good.push('Every set at the top on ' + e.name + ', so it goes up next time.');
  }
  const planned = a.entries.length, done = a.entries.filter(en => en.sets.length).length;
  if (planned >= 3 && done === planned) good.unshift('The whole session, every exercise logged.');
  if (!good.length && done) good.push('Showed up and put the work in. That is the part that compounds.');
  if (!focus.length) focus.push('Nothing to fix. Same again next time, a notch heavier where the coach says so.');
  return {good: good.slice(0, 4), focus: focus.slice(0, 4)};
}
function coachSummaryHTML(c){
  if (!c) return '';
  return '<div class="coachsum"><div class="eyebrow" style="margin-bottom:6px">Coach summary</div>' +
    '<div class="small" style="font-weight:600;color:var(--accent);margin-bottom:2px">Went well</div>' + c.good.map(x => '<div class="small" style="padding:2px 0">' + esc(x) + '</div>').join('') +
    '<div class="small" style="font-weight:600;color:var(--accent);margin:8px 0 2px">Next bearing</div>' + c.focus.map(x => '<div class="small" style="padding:2px 0">' + esc(x) + '</div>').join('') + '</div>';
}
/* Coach's picks: what the last two weeks are missing, with a specific exercise for each gap and the reason in one line. */
const GROUP_DEFAULTS = {Chest: ['bench', 'dbbench', 'incdb'], Back: ['row', 'pulldown', 'cablerow'], Shoulders: ['ohp', 'dbohp', 'latraise'], Arms: ['curl', 'pushdown', 'dbcurl'], Legs: ['squat', 'legpress', 'rdl'], Core: ['plank', 'cablecrunch', 'hangingleg']};
const PATTERN_DEFAULTS = {squat: 'squat', hinge: 'rdl', push: 'bench', overhead: 'ohp', pull: 'row'};
function coachPicks(){
  const out = [], tk = todayKey(), d14 = keyOf(addDays(new Date(), -13)), d42 = keyOf(addDays(new Date(), -41));
  const recent = state.workouts.filter(w => w.date >= d14), older = state.workouts.filter(w => w.date >= d42);
  if (!state.workouts.length) return out;
  const freqAll = liftFreq();
  const doneIn = (ws, id) => ws.some(w => w.entries.some(en => en.ex === id && working(en.sets).length));
  const pickFor = ids => { const known = ids.filter(id => ex(id) && visibleEx(ex(id))); if (!known.length) return null; const done = known.filter(id => freqAll[id]).sort((a, b) => freqAll[b] - freqAll[a]); return done[0] || known[0]; };
  if (liftOn() && recent.length >= 2) {
    const setsBy = {}; let total = 0;
    for (const w of recent) for (const en of w.entries) { const e = ex(en.ex); if (e.type !== 'lift') continue; const n = counted(en.sets).length; setsBy[e.group] = (setsBy[e.group] || 0) + n; total += n; }
    for (const g of ['Legs', 'Back', 'Chest', 'Shoulders', 'Arms', 'Core']) {
      if (setsBy[g]) continue;
      const mine = Object.keys(freqAll).filter(id => ex(id) && ex(id).group === g && ex(id).type === 'lift'), id = pickFor(mine.concat(GROUP_DEFAULTS[g] || []));
      if (id) out.push({kind: 'gap', ex: id, title: 'No ' + g.toLowerCase() + ' work in 2 weeks', why: g === 'Core' ? 'A couple of sets keeps the trunk honest under heavy bars.' : 'Every group needs a stimulus at least once a week to hold on to what it has.'});
    }
    for (const pt of PATTERNS) { if (recent.some(w => w.entries.some(en => pt[2].indexOf(en.ex) >= 0 && working(en.sets).length))) continue; const id = pickFor(pt[2].filter(x => freqAll[x]).concat([PATTERN_DEFAULTS[pt[0]]])); if (id && !out.some(o => o.ex === id)) out.push({kind: 'pattern', ex: id, title: 'No ' + pt[1].toLowerCase() + ' pattern in 2 weeks', why: 'The athlete score counts five patterns; a missing one scores zero.'}); }
    const push = (setsBy.Chest || 0) + (setsBy.Shoulders || 0), pull = setsBy.Back || 0;
    if (push >= 6 && push > 2 * pull) { const id = pickFor(Object.keys(freqAll).filter(x => ex(x) && ex(x).group === 'Back').concat(GROUP_DEFAULTS.Back)); if (id && !out.some(o => o.ex === id)) out.push({kind: 'balance', ex: id, title: push + ' pushing sets to ' + pull + ' pulling', why: 'Shoulders stay healthier near one to one. Add a row or a pulldown.'}); }
    if (total >= 12 && (setsBy.Legs || 0) < total * 0.2) { const id = pickFor(Object.keys(freqAll).filter(x => ex(x) && ex(x).group === 'Legs').concat(GROUP_DEFAULTS.Legs)); if (id && !out.some(o => o.ex === id)) out.push({kind: 'balance', ex: id, title: 'Legs got ' + Math.round(100 * (setsBy.Legs || 0) / total) + '% of your sets', why: 'Aim for a quarter or more; the biggest muscles move the score fastest.'}); }
    // stalls: a lift done three or more times in six weeks with no gain in the best set
    const seen = {};
    for (const w of older.slice().sort((a, b) => a.start - b.start)) for (const en of w.entries) { const e = ex(en.ex); if (e.type !== 'lift' || e.time || e.bw) continue; const top = topSet(working(en.sets)); if (!top) continue; (seen[en.ex] = seen[en.ex] || []).push(top.v); }
    let stalls = 0;
    for (const id in seen) { const v = seen[id]; if (v.length < 3 || stalls >= 2) continue; const last3 = v.slice(-3); if (last3[2] <= last3[0] + 0.5 && last3[1] <= last3[0] + 0.5) { const e = ex(id), alts = CATALOG.filter(x => x.type === 'lift' && x.id !== id && visibleEx(x)).map(x => ({x: x, s: similarity(x, e)})).sort((a, b) => b.s - a.s); const alt = alts[0] ? alts[0].x.id : null; stalls++; out.push({kind: 'stall', ex: alt || id, title: e.name + ' has not moved in 3 sessions', why: 'Give it a fresh angle for a few weeks' + (alt ? ', for example ' + ex(alt).name : '') + ', or take 10% off and rebuild.'}); } }
  }
  if (cardioOn()) { const lastC = sortedWorkouts().find(w => w.entries.some(en => ex(en.ex).type === 'cardio' && en.sets.length)); const gap = lastC ? daysBetween(lastC.date, tk) : 99; if (gap >= 10 && recent.length) { const id = pickFor(Object.keys(freqAll).filter(x => ex(x) && ex(x).type === 'cardio').concat(['walk', 'run', 'inclinewalk'])); if (id) out.push({kind: 'cardio', ex: id, title: lastC ? gap + ' days since any cardio' : 'No cardio logged yet', why: 'Twenty easy minutes keeps the cardio part of the score from draining.'}); } }
  return out.slice(0, 5);
}
function picksCard(){
  const picks = coachPicks(); if (!picks.length) return '';
  return '<div class="card"><div class="card-head"><div><div class="h3">Coach\'s picks</div><div class="tiny muted">What the last two weeks are missing, and what to add</div></div></div><div class="stack" style="gap:0">' +
    picks.map(p => '<div class="between" style="padding:10px 0;border-top:1px solid var(--border);gap:12px"><div class="grow"><div style="font-weight:600">' + esc(p.title) + '</div><div class="small muted">' + esc(p.why) + '</div></div><div style="text-align:right;flex:none"><div class="small" style="font-weight:600">' + esc(ex(p.ex).name) + '</div>' + (state.active ? '<button class="btn sm" data-act="pick-add" data-ex="' + p.ex + '" style="margin-top:4px">Add to today</button>' : '') + '</div></div>').join('') + '</div></div>';
}
/* How alike two exercises are, for the swap list: same movement pattern first, then muscle group, equipment, shared keywords, and how often it is done. */
const nounOf = e => { const w = e.name.toLowerCase().replace(/\([^)]*\)/g, '').trim().split(/\s+/).filter(x => x !== 'machine'); return w[w.length - 1] || ''; };
function similarity(a, b){
  if (a.id === b.id) return -1;
  let s = 0;
  const pa = PATTERNS.find(p => p[2].indexOf(a.id) >= 0), pb = PATTERNS.find(p => p[2].indexOf(b.id) >= 0);
  if (pa && pb && pa === pb) s += 5;
  if (a.group === b.group) s += 4; if (a.type === b.type) s += 2; if ((a.eq || '') === (b.eq || '')) s += 1; if (!!a.bar === !!b.bar) s += 0.5; if (!!a.time === !!b.time) s += 0.5;
  const ka = String(a.k || '').split(' ').filter(Boolean), kb = String(b.k || '').split(' ').filter(Boolean);
  s += Math.min(2, ka.filter(w => kb.indexOf(w) >= 0).length);
  const na = a.name.toLowerCase().split(/\s+/), nb = b.name.toLowerCase().split(/\s+/);
  s += Math.min(2, na.filter(w => w.length > 3 && nb.indexOf(w) >= 0).length);
  /* The last word of the name is the movement (squat, press, raise, curl): the same movement ranks above a lift that only shares a word. */
  if (a.type === 'lift' && b.type === 'lift') s += nounOf(a) === nounOf(b) ? 2 : -1;
  return s;
}
function exListHTML(){
  const q = (sheet.q || '').trim().toLowerCase(), g = sheet.g || '';
  const all = CATALOG.concat(state.custom.filter(e => !e.archived)).filter(visibleEx);
  const swapping = sheet.for === 'swap' && state.active && state.active.entries[sheet.i], cur = swapping ? ex(state.active.entries[sheet.i].ex) : null, freq = cur ? liftFreq() : null;
  /* Search order: exact name, name starts with the query, every word in the name, first word in the name, then keyword-only matches; ties go to the lifts you log most. */
  const nq = q ? normQ(q) : '', qw = nq.split(' ').filter(Boolean), freqQ = q && !cur ? liftFreq() : null;
  const rank = e => { const n = e.name.toLowerCase(); if (n === nq) return 0; const words = n.split(/[^a-z0-9]+/).filter(Boolean); if (qw.every(w => words.some(x => x.indexOf(w) === 0))) return qw.every(w => words.indexOf(w) >= 0) ? 1 : 1.5; if (qw.every(w => n.indexOf(w) >= 0)) return 2; if (n.indexOf(qw[0]) >= 0) return 3; return 4; };
  const common = e => (MAJOR_LIFTS.indexOf(e.id) >= 0 ? 0 : 1) + (STD[e.id] || MET_DEFAULT[e.id] ? 0 : 1);
  const list = all.filter(e => (!g || e.group === g || (g === 'Custom' && e.id.indexOf('c_') === 0)) && exMatches(e, q) && (!cur || e.id !== cur.id))
    .sort((a, b) => { if (cur) { const d = similarity(b, cur) - similarity(a, cur); if (d) return d; const f = (freq[b.id] || 0) - (freq[a.id] || 0); if (f) return f; return a.name.localeCompare(b.name); } if (q) { const d = rank(a) - rank(b); if (d) return d; const f = (freqQ[b.id] || 0) - (freqQ[a.id] || 0); if (f) return f; const c = common(a) - common(b); if (c) return c; const l = a.name.length - b.name.length; if (l) return l; } const ga = GROUPS.indexOf(a.group), gb = GROUPS.indexOf(b.group); return ((ga < 0 ? 99 : ga) - (gb < 0 ? 99 : gb)) || a.name.localeCompare(b.name); });
  const exact = all.some(e => e.name.toLowerCase() === q);
  if (sheet && !sheet.newGroup) sheet.newGroup = liftOn() ? 'Chest' : 'Cardio';
  let html = '', lastG = null;
  let shown = 0;
  if (!q && !g && !cur && (sheet.for === 'active' || sheet.for === 'routine')) { const picks = coachPicks().filter(p => list.some(e => e.id === p.ex)); if (picks.length) html += '<div class="datehead" style="margin-top:4px">Coach\'s picks</div>' + picks.map(p => '<button class="item" data-act="pick-ex" data-ex="' + p.ex + '"><span>' + esc(ex(p.ex).name) + '<br><span class="small muted">' + esc(p.title) + '</span></span><span class="g">add</span></button>').join(''); }
  for (const e of list) {
    if (cur) { const near = similarity(e, cur) >= 6; if (shown === 0 && near) html += '<div class="datehead" style="margin-top:10px">Most like ' + esc(cur.name) + '</div>'; else if (!near && lastG !== 'rest') { html += '<div class="datehead" style="margin-top:10px">' + (shown ? 'Everything else' : 'All exercises') + '</div>'; lastG = 'rest'; } shown++; }
    else if (!q && !g && e.group !== lastG) { html += '<div class="datehead" style="margin-top:10px">' + esc(e.group) + '</div>'; lastG = e.group; }
    html += '<button class="item" data-act="pick-ex" data-ex="' + e.id + '"><span>' + esc(e.name) + (e.time ? ' <span class="tiny muted">timed</span>' : '') + '</span><span class="g">' + esc(eqLabel(e.eq) || e.group) + '</span></button>';
  }
  /* Nothing matches every word: offer the exercises that match most of them before the create card. */
  if (q && !list.length && qw.length > 1) {
    const hay = e => (e.name + ' ' + (e.group || '') + ' ' + (e.eq || '') + ' ' + eqLabel(e.eq) + ' ' + (e.k || '')).toLowerCase();
    const close = all.filter(e => (!g || e.group === g) && (!cur || e.id !== cur.id)).map(e => ({e: e, n: qw.filter(w => hay(e).indexOf(w) >= 0).length, nm: qw.filter(w => e.name.toLowerCase().indexOf(w) >= 0).length})).filter(x => x.n >= Math.ceil(qw.length / 2)).sort((a, b) => (b.n - a.n) || (b.nm - a.nm) || a.e.name.length - b.e.name.length).slice(0, 8);
    if (close.length) html += '<div class="datehead" style="margin-top:4px">Close matches</div>' + close.map(x => '<button class="item" data-act="pick-ex" data-ex="' + x.e.id + '"><span>' + esc(x.e.name) + '</span><span class="g">' + esc(eqLabel(x.e.eq) || x.e.group) + '</span></button>').join('');
  }
  return html +
    (q && !exact ? '<div class="card newex"><div class="small muted">Not in the list?</div><div class="row"><select class="sm grow" id="newgroup" aria-label="Muscle group">' + GROUPS.filter(x => x === 'Cardio' ? cardioOn() : liftOn()).map(g => '<option value="' + g + '"' + (sheet.newGroup === g ? ' selected' : '') + '>' + g + '</option>').join('') + '</select><select class="sm grow" id="neweq" aria-label="Equipment">' + ((sheet.newGroup || (liftOn() ? 'Chest' : 'Cardio')) === 'Cardio' ? CARDIO_EQ : LIFT_EQ).map(x => '<option value="' + x[0] + '"' + (sheet.newEq === x[0] ? ' selected' : '') + '>' + x[1] + '</option>').join('') + '</select></div><button class="btn sm" style="width:100%" data-act="create-ex">Create “' + esc(sheet.q.trim()) + '”</button></div>' : '') +
    (!list.length && !q ? '<div class="empty">Nothing here yet.</div>' : '');
}
function exChipsHTML(){
  const g = sheet.g || '';
  const groups = [''].concat(GROUPS.filter(x => x === 'Cardio' ? cardioOn() : liftOn())).concat(state.custom.some(visibleEx) ? ['Custom'] : []);
  return '<div class="chips" style="margin:0 0 10px">' + groups.map(x => '<button class="chip' + (x === g ? ' on' : '') + '" data-act="ex-group" data-g="' + x + '">' + (x || 'All') + '</button>').join('') + '</div>';
}
function routineRow(r, it, idx){
  const e = ex(it.ex), x = '<button class="x" data-act="del-item" data-rid="' + r.id + '" data-idx="' + idx + '" aria-label="Remove">×</button>';
  const head = GRIP + '<div><div class="nm">' + esc(e.name) + '</div><div class="sub">' + esc(e.group) + '</div></div>' + x, sortable = ' data-sort="routine:' + r.id + '" data-si="' + idx + '"';
  if (e.type === 'cardio') {
    const fixed = e.eq === 'treadmill', elig = tmEligible(e), tm = fixed || (elig && !!it.tm), u = isKg() ? 'km/h' : 'mph', rid = r.id;
    const sel = (list, cur, fmt, key) => '<select class="sm" data-ritem="' + key + '" data-rid="' + rid + '" data-idx="' + idx + '">' + list.map(x => '<option value="' + x + '"' + (Math.abs(x - cur) < 1e-9 ? ' selected' : '') + '>' + fmt(x) + '</option>').join('') + '</select>';
    const speeds = []; for (let x = 10; x <= (isKg() ? 200 : 120); x++) speeds.push(x / 10);
    const inclines = []; for (let x = 0; x <= 30; x++) inclines.push(x / 2);
    const mins = [5,10,15,20,25,30,35,40,45,50,60,75,90,120], ivl = tm && it.ivl && ivlPhases(it.ivl).length ? it.ivl : null;
    let opts = '<label>Minutes' + (ivl ? '<span class="sm" style="display:flex;align-items:center;min-height:38px;padding-left:9px;font-size:14px;color:var(--muted)">' + Math.round(ivlTotalSec(ivl) / 60) + ' min</span>' : sel(mins, it.min, m => m + ' min', 'min')) + '</label>';
    if (elig) opts += '<label>Where' + sel([0, 1], it.tm ? 1 : 0, x => x ? 'Treadmill' : 'Outdoors', 'tm') + '</label>';
    if (LOAD_IDS[e.id]) { const packs = []; for (let x = 0; x <= (isKg() ? 40 : 80); x += (isKg() ? 2.5 : 5)) packs.push(x); opts += '<label>Pack ' + wUnit() + sel(packs, Number(dispW(it.load !== undefined ? it.load : (isKg() ? 10 * LB_PER_KG : 20))), x => String(x), 'load') + '</label>'; }
    if (tm) {
      opts += '<label>Intervals' + sel([0, 1], ivl ? 1 : 0, x => x ? 'On' : 'Off', 'ivlon') + '</label>';
      if (!ivl) opts += '<label>Speed ' + u + sel(speeds, it.speed || tmDefaultSpeed(e), x => x.toFixed(1), 'speed') + '</label><label>Incline %' + sel(inclines, it.incline || 0, x => (x % 1 ? x.toFixed(1) : String(x)), 'incline') + '</label>';
    }
    let stages = '';
    if (ivl) {
      const ph = ivlPhases(ivl);
      stages = '<div class="rstages">' + ph.map((p, k) => '<div class="ivlphase"><div class="between" style="margin-bottom:6px"><span class="eyebrow">' + stageName(ph, k) + '</span>' + (ph.length > 2 ? '<button class="btn link small" data-act="ritem-ivl-del" data-rid="' + rid + '" data-idx="' + idx + '" data-k="' + k + '">Remove</button>' : '') + '</div><div class="optgrid">' +
        '<label>Minutes' + sel(IVL_MINUTES, p.min, x => fmtMin(x).replace(' min', ''), 'ph.' + k + '.min') + '</label><label>Speed ' + u + sel(speeds, p.speed, x => x.toFixed(1), 'ph.' + k + '.speed') + '</label><label>Incline %' + sel(inclines, p.incline, x => (x % 1 ? x.toFixed(1) : String(x)), 'ph.' + k + '.incline') + '</label></div></div>').join('') +
        '<div class="row" style="gap:10px;margin-top:2px">' + (ph.length < 8 ? '<button class="btn link small" data-act="ritem-ivl-add" data-rid="' + rid + '" data-idx="' + idx + '">+ Add a stage</button>' : '') + '<label class="grow row" style="justify-content:flex-end;gap:8px;font-size:13px;font-weight:600">Rounds' + sel(Array.from({length: 20}, (_, k) => k + 1), ivl.rounds, x => String(x), 'rounds').replace('class="sm"', 'class="sm" style="width:88px"') + '</label></div>' +
        '<div class="tiny muted" style="margin-top:6px">' + ivl.rounds + ' round' + (ivl.rounds === 1 ? '' : 's') + ' of ' + ph.length + ' stage' + (ph.length === 1 ? '' : 's') + ' · ' + mmss(ivlTotalSec(ivl)) + ' · about ' + dispD(ivlDistanceMi(ivl, ivlTotalSec(ivl))) + ' ' + dUnit() + '</div></div>';
    }
    return '<div class="rrow cardio' + (tm ? ' tm' : '') + '"' + sortable + '>' + head + '<div class="opts">' + opts + '</div>' + stages + '</div>';
  }
  const nums = (n, cur) => Array.from({length: n}, (_, i) => '<option value="' + (i + 1) + '"' + (i + 1 === cur ? ' selected' : '') + '>' + (i + 1) + '</option>').join('');
  const secs = [10, 15, 20, 30, 40, 45, 60, 75, 90, 120, 150, 180].map(v => '<option value="' + v + '"' + (v === it.reps ? ' selected' : '') + '>' + v + ' s</option>').join('');
  return '<div class="rrow"' + sortable + '>' + head + '<div class="opts"><label>Sets<select class="sm" data-ritem="sets" data-rid="' + r.id + '" data-idx="' + idx + '">' + nums(8, it.sets) + '</select></label><label>' + (e.time ? 'Seconds' : 'Reps') + '<select class="sm" data-ritem="reps" data-rid="' + r.id + '" data-idx="' + idx + '">' + (e.time ? secs : nums(30, it.fail ? 0 : it.reps) + '<option value="fail"' + (it.fail ? ' selected' : '') + '>Until failure</option>') + '</select></label>' + (e.time || it.fail ? '' : '<label>Up to<select class="sm" data-ritem="hi" data-rid="' + r.id + '" data-idx="' + idx + '">' + nums(30, it.hi || it.reps) + '<option value="99"' + (it.hi === 99 ? ' selected' : '') + '>AMRAP</option></select></label>') + '<label>Rest<select class="sm" data-exrest="' + e.id + '">' + restOptionsHTML(e.id) + '</select></label></div></div>';
}
function renderModal(){
  if (!sheet) { modalEl.innerHTML = ''; return; }
  let inner = '';
  if (sheet.type === 'summary') {
    const w = state.workouts.find(x => x.id === sheet.id); if (!w) { sheet = null; modalEl.innerHTML = ''; return; }
    inner = '<div class="eyebrow brandrow"><span class="brand">' + BRAND.symbol + '</span>Workout complete</div><div class="h2" style="margin:4px 0 12px">' + esc(w.name) + '</div><div class="sumgrid">' + sumTiles(w) + '</div>' +
      (w.prs.length ? '<div style="margin-top:12px">' + prLines(w) + '</div>' : '') +
      '<div style="margin-top:12px">' + coachSummaryHTML(w.coach) + '</div>' +
      '<button class="btn primary" style="margin-top:14px" data-act="summary-done">Done</button>' + updateRoutineBlock(w) + '<div class="row" style="margin-top:10px;gap:14px;justify-content:center;flex-wrap:wrap"><button class="btn link small" data-act="share" data-id="' + w.id + '">Share</button><button class="btn link small" data-act="summary" data-id="' + w.id + '">Full summary</button><button class="btn link small" data-act="reopen" data-id="' + w.id + '">Reopen</button><button class="btn link small" data-act="save-routine" data-id="' + w.id + '">' + (w.routine ? 'Save as a new routine' : 'Save as routine') + '</button></div>';
  } else if (sheet.type === 'exmenu') {
    const a = state.active, i = sheet.i, en = a && a.entries[i]; if (!en) { sheet = null; modalEl.innerHTML = ''; return; }
    const e = ex(en.ex), sel = (v, cur) => v === cur ? ' selected' : '';
    inner = '<div class="between"><div class="h2">' + esc(e.name) + '</div><button class="btn sm ghost" data-act="close">Close</button></div><div class="menu" style="margin-top:12px">' +
      '<div class="row"><span class="grow" style="font-weight:600">Tempo</span><select class="sm" data-tempo="' + e.id + '" style="width:150px">' + TEMPOS.map(t => '<option value="' + t + '"' + sel(t, state.exTempo[e.id] || '') + '>' + (t || 'None') + '</option>').join('') + '</select></div>' +
      (e.time ? '' : '<div class="row"><span class="grow" style="font-weight:600">Add to the next set</span><select class="sm" data-techsel="' + i + '" style="width:150px">' + TECHS.map(t => '<option value="' + t[0] + '"' + sel(t[0], en.draft.sub ? en.draft.sub.tech : '') + '>' + t[1] + '</option>').join('') + '</select></div>') +
      adjItems(en, e, i) +
      '<button class="item" data-act="note-edit" data-i="' + i + '"><span>' + (state.exNotes[e.id] ? 'Edit note' : 'Add a note') + '</span><span class="g">shows next time</span></button>' +
      (e.bar ? '<button class="item" data-act="plates-open" data-i="' + i + '"><span>Plate loading</span><span class="g">' + dispW(en.draft.w) + ' ' + wUnit() + '</span></button>' : '') +
      '<button class="item" data-act="tips-open" data-ex="' + e.id + '"><span>How to do it</span><span class="g">form and pro tip</span></button>' +
      '<button class="item" data-act="exhist-open" data-ex="' + e.id + '"><span>History and standard</span><span class="g">last 3 months</span></button>' +
      (en.pair ? '<button class="item" data-act="pair" data-i="' + i + '"><span>Split the superset</span><span class="g">with ' + esc(ex(a.entries[i + 1].ex).name) + '</span></button>' : (i < a.entries.length - 1 && !pairedWithPrev(a.entries, i) && !a.entries[i + 1].pair ? '<button class="item" data-act="pair" data-i="' + i + '"><span>Superset with next</span><span class="g">' + esc(ex(a.entries[i + 1].ex).name) + '</span></button>' : '')) +
      (e.type === 'lift' && !e.time ? '<button class="item" data-act="conv-open" data-i="' + i + '"><span>Convert lb and kg</span><span class="g">' + dispW(en.draft.w) + ' ' + wUnit() + ' ≈ ' + (Math.round((isKg() ? en.draft.w : en.draft.w / LB_PER_KG) * 10) / 10) + ' ' + (isKg() ? 'lb' : 'kg') + '</span></button>' : '') +
      '<button class="item" data-act="swap-ex" data-i="' + i + '"><span>Swap exercise</span><span class="g">' + (en.sets.some(x => !x.wu) ? 'rest of the sets' : 'same sets and reps') + '</span></button>' +
      (i > 0 ? '<button class="item" data-act="move" data-i="' + i + '" data-d="-1"><span>Move up</span></button>' : '') +
      (i < a.entries.length - 1 ? '<button class="item" data-act="move" data-i="' + i + '" data-d="1"><span>Move down</span></button>' : '') +
      '<button class="item" data-act="remove-entry" data-i="' + i + '"><span>Remove from today</span></button></div>';
  } else if (sheet.type === 'custom') {
    const e = state.custom.find(x => x.id === sheet.ex); if (!e) { sheet = null; modalEl.innerHTML = ''; return; }
    inner = '<div class="between"><div class="h2">Edit exercise</div><button class="btn sm ghost" data-act="close">Cancel</button></div><div class="stack" style="margin-top:12px"><input class="input" id="cx-name" value="' + esc(e.name) + '" aria-label="Name"><div class="row"><span class="grow" style="font-weight:600">Group</span><select class="sm" id="cx-group" style="width:160px">' + GROUPS.map(g => '<option value="' + g + '"' + (e.group === g ? ' selected' : '') + '>' + g + '</option>').join('') + '</select></div><div class="row"><span class="grow" style="font-weight:600">Equipment</span><select class="sm" id="cx-eq" style="width:160px">' + (e.type === 'cardio' ? CARDIO_EQ : LIFT_EQ).map(x => '<option value="' + x[0] + '"' + (e.eq === x[0] ? ' selected' : '') + '>' + x[1] + '</option>').join('') + '</select></div><div class="row"><span class="grow" style="font-weight:600">Bodyweight exercise</span><select class="sm" id="cx-bw" style="width:160px"><option value="0"' + (e.bw ? '' : ' selected') + '>No</option><option value="1"' + (e.bw ? ' selected' : '') + '>Yes</option></select></div><div class="row"><span class="grow" style="font-weight:600">Measured in</span><select class="sm" id="cx-time" style="width:160px"><option value="0"' + (e.time ? '' : ' selected') + '>Reps</option><option value="1"' + (e.time ? ' selected' : '') + '>Seconds</option></select></div><button class="btn primary" data-act="custom-save" data-ex="' + e.id + '">Save</button></div>';
  } else if (sheet.type === 'note') {
    const e = ex(sheet.ex);
    inner = '<div class="between"><div class="h2">Note for ' + esc(e.name) + '</div><button class="btn sm ghost" data-act="close">Cancel</button></div><p class="small muted" style="margin:8px 0 10px">Shows on this exercise every time until you delete it. Good for setup, grip, a seat position, or a reminder.</p><textarea class="input" id="note-text" placeholder="Seat at 4, feet on the platform">' + esc(state.exNotes[sheet.ex] || '') + '</textarea><button class="btn primary" style="margin-top:12px" data-act="note-save" data-ex="' + sheet.ex + '">Save note</button>';
  } else if (sheet.type === 'wsummary') {
    const w = state.workouts.find(x => x.id === sheet.id); if (!w) { sheet = null; modalEl.innerHTML = ''; return; }
    inner = '<div class="between"><div class="h2">Summary</div><button class="btn sm ghost" data-act="close">Close</button></div>' + summaryHTML(w) + (w.coach ? '<div style="margin-top:12px">' + coachSummaryHTML(w.coach) + '</div>' : '') + '<button class="btn primary" style="margin-top:14px" data-act="share" data-id="' + w.id + '">Share</button><button class="btn secondary" style="margin-top:8px" data-act="save-routine" data-id="' + w.id + '">Save as routine</button>';
  } else if (sheet.type === 'share') {
    const w = state.workouts.find(x => x.id === sheet.id); if (!w) { sheet = null; modalEl.innerHTML = ''; return; }
    inner = '<div class="between"><div class="h2">Share</div><button class="btn sm ghost" data-act="close">Close</button></div>' +
      '<p class="small muted" style="margin:8px 0 10px">A card for a post, and a text for a message.</p>' +
      '<img id="share-img" class="sharecard" alt="Workout card for ' + esc(w.name) + '">' +
      '<button class="btn primary" style="margin-top:10px" data-act="share-image">Share image</button>' +
      '<div class="tiny faint" style="margin-top:6px">If your phone does not offer sharing here, press and hold the image to save it.</div>' +
      '<div class="eyebrow" style="margin-top:16px">Text for a message</div><textarea class="input" id="share-text" style="margin-top:6px;min-height:170px" aria-label="Share text">' + esc(shareText(w)) + '</textarea>' +
      '<div class="row" style="margin-top:10px;gap:8px"><button class="btn grow" data-act="share-text">Share text</button><button class="btn grow" data-act="copy-text">Copy</button></div>';
  } else if (sheet.type === 'tips') {
    const e = ex(sheet.ex), tp = tipsFor(e), custom = !TIPS[e.id];
    inner = '<div class="between"><div class="h2">' + esc(e.name) + '</div><button class="btn sm ghost" data-act="close">Close</button></div><div class="tiny muted" style="margin:4px 0 12px">How to do it' + (custom ? ' · general cues for a ' + esc((e.group || '').toLowerCase()) + ' ' + esc(eqLabel(e.eq) || '') + ' move' : '') + '</div>' +
      '<div class="tipblock"><div class="eyebrow">Set up</div><p>' + esc(tp[0]) + '</p></div><div class="tipblock"><div class="eyebrow">The movement</div><p>' + esc(tp[1]) + '</p></div><div class="tipblock pro"><div class="eyebrow">Pro tip · mind to muscle</div><p>' + esc(tp[2]) + '</p></div>' +
      (e.type === 'lift' ? '<div class="tiny faint" style="margin-top:12px">If a cue makes a rep feel worse, drop it. Cues are suggestions; pain is not.</div>' : '');
  } else if (sheet.type === 'exhist') {
    const e = ex(sheet.ex), cutoff = keyOf(addDays(new Date(), -90));
    const sessions = sortedWorkouts().filter(w => w.date >= cutoff).map(w => ({w: w, en: w.entries.find(x => x.ex === e.id && x.sets.length)})).filter(x => x.en);
    const rows = sessions.map(x => { const en = x.en, top = e.type === 'lift' && !e.time ? topSet(working(en.sets)) : null; return '<div class="between small" style="padding:8px 0;border-top:1px solid var(--border)"><span><b>' + esc(fmtShort(x.w.date)) + '</b> <span class="muted">· ' + esc(x.w.name) + '</span></span><span class="num muted" style="text-align:right">' + entryLine(en) + (top ? '<br><span class="tiny">est. 1RM ' + dispW(Math.round(top.v)) + ' ' + wUnit() + '</span>' : '') + '</span></div>'; }).join('');
    let std = '';
    if (STD[e.id]) { const {rows: srows} = standardRows('done', null); const r = srows.find(x => x.id === e.id); std = '<div class="eyebrow" style="margin:16px 0 4px">Strength standard</div>' + (r ? standardRow(r) : '<div class="small muted">Not on the ladder yet.</div>'); }
    inner = '<div class="between"><div class="h2">' + esc(e.name) + '</div><button class="btn sm ghost" data-act="close">Close</button></div>' +
      '<div class="tiny muted" style="margin:4px 0 10px">Last 3 months · ' + sessions.length + ' session' + (sessions.length === 1 ? '' : 's') + '</div>' +
      (sessions.length >= 2 ? '<div style="margin-bottom:10px">' + exerciseChart(e.id) + '</div>' : '') +
      (rows ? '<div class="stack" style="gap:0">' + rows + '</div>' : '<div class="empty">Nothing logged for this in the last 3 months.</div>') + std;
  } else if (sheet.type === 'convert') {
    const lb = sheet.lb || 0, kg = Math.round(lb / LB_PER_KG * 100) / 100;
    inner = '<div class="between"><div class="h2">Convert</div><button class="btn sm ghost" data-act="close">Close</button></div><p class="small muted" style="margin:8px 0 12px">Type in either box. Nothing here changes the weight in your workout.</p>' +
      '<div class="steppers"><div class="stepper-wrap"><div class="lab"><span>Pounds</span><span>lb</span></div><div class="stepper"><button type="button" data-act="conv-step" data-u="lb" data-d="-1" aria-label="Less">−</button><input inputmode="decimal" data-conv="lb" value="' + (Math.round(lb * 10) / 10) + '" aria-label="Pounds"><button type="button" data-act="conv-step" data-u="lb" data-d="1" aria-label="More">+</button></div></div>' +
      '<div class="stepper-wrap"><div class="lab"><span>Kilograms</span><span>kg</span></div><div class="stepper"><button type="button" data-act="conv-step" data-u="kg" data-d="-1" aria-label="Less">−</button><input inputmode="decimal" data-conv="kg" value="' + (Math.round(kg * 10) / 10) + '" aria-label="Kilograms"><button type="button" data-act="conv-step" data-u="kg" data-d="1" aria-label="More">+</button></div></div></div>' +
      '<div class="tiny muted" style="margin-top:12px">1 kg is 2.2046 lb. Common plates: 45 lb ≈ 20.4 kg, 25 lb ≈ 11.3 kg, 20 kg ≈ 44.1 lb, 10 kg ≈ 22 lb.</div>' +
      (state.active && state.active.entries[sheet.i] ? '<button class="btn primary" style="margin-top:14px" data-act="conv-use" data-i="' + sheet.i + '">Use <span id="conv-use-v">' + dispW(lb) + '</span> ' + wUnit() + ' for set ' + (counted(state.active.entries[sheet.i].sets).length + 1) + '</button>' : '');
  } else if (sheet.type === 'plates') {
    inner = '<div class="between"><div class="h2">Plate loading</div><button class="btn sm ghost" data-act="close">Close</button></div><div class="platesheet" style="margin-top:8px">' + plateCard() + '</div>';
  } else if (sheet.type === 'standards') {
    inner = standardsSheet();
  } else if (sheet.type === 'recovery') {
    const k = recKind(sheet.kind);
    inner = '<div class="between"><div class="h2">' + k[1] + '</div><button class="btn sm ghost" data-act="close">Close</button></div>' +
      '<div class="steppers" style="margin-top:14px"><div class="stepper-wrap"><div class="lab"><span>Minutes</span><span>today</span></div><div class="stepper"><button type="button" data-act="rec-step" data-d="-1" aria-label="Fewer minutes">−</button><input inputmode="numeric" data-rec="min" value="' + sheet.min + '" aria-label="Minutes"><button type="button" data-act="rec-step" data-d="1" aria-label="More minutes">+</button></div></div>' +
      '<div class="stepper-wrap"><div class="lab"><span>Temp</span><span>' + tUnit() + ', optional</span></div><div class="stepper"><button type="button" data-act="rec-tstep" data-d="-1" aria-label="Lower temperature">−</button><input inputmode="numeric" data-rec="temp" value="' + (sheet.temp ? dispT(sheet.temp) : '') + '" placeholder="' + dispT(REC_TEMP[sheet.kind] || 150) + '" aria-label="Temperature"><button type="button" data-act="rec-tstep" data-d="1" aria-label="Higher temperature">+</button></div></div></div>' +
      '<button class="btn primary" style="margin-top:14px" data-act="rec-log">Log ' + k[1].toLowerCase() + '</button>';
  } else if (sheet.type === 'account') {
    inner = '<div class="between"><div class="h2">Sign in</div><button class="btn sm ghost" data-act="close">Close</button></div><p class="small muted" style="margin:8px 0 12px">Your log comes back from your account, and this phone keeps saving to it.</p>' + accountForm(true);
  } else if (sheet.type === 'signout') {
    inner = '<div class="h2">Sign out?</div><p style="margin:8px 0 14px">Your log stays in your account and is removed from this phone. Sign in again any time to get it back.</p><div class="row"><button class="btn grow" data-act="close">Stay signed in</button><button class="btn grow ghost" data-act="sign-out-go">Sign out</button></div><div class="small" id="syncline" style="margin-top:8px">' + syncLine() + '</div>';
  } else if (sheet.type === 'acct-delete') {
    inner = '<div class="h2">Delete your account?</div><p style="margin:8px 0 14px">This removes your account, the copy of your log stored in it, and the copy on this phone. There is no undo. To keep the log, copy a backup first under You.</p><div class="row"><button class="btn grow" data-act="close">Keep it</button><button class="btn grow danger" data-act="acct-delete">Delete account</button></div><div class="small" id="syncline" style="margin-top:8px">' + syncLine() + '</div>';
  } else if (sheet.type === 'newpw') {
    inner = '<div class="between"><div class="h2">New password</div><button class="btn sm ghost" data-act="close">Close</button></div><p class="small muted" style="margin:8px 0 12px">Set a new password for ' + esc(auth && auth.email ? auth.email : 'your account') + '.</p><input class="input" id="acct-pw" type="password" autocomplete="new-password" placeholder="New password, 8 or more characters" style="margin-bottom:10px"><button class="btn primary" data-act="newpw-save">Save password</button><div class="small" id="syncline" style="margin-top:8px">' + syncLine() + '</div>';
  } else if (sheet.type === 'easy') {
    const on = lightWeekOn();
    inner = '<div class="between"><div class="h2">Take it easy</div><button class="btn sm ghost" data-act="close">Close</button></div>' +
      '<p class="small muted" style="margin:8px 0 12px">Sore, sick, short on sleep or nursing a tweak? A light day runs every lift at 85% of the coach\'s number at the bottom of the rep range, cardio at three quarters of the time, and nothing from it counts against your plan. The coach picks up where it left off.</p><div class="list">' +
      '<button class="item" data-act="easy-day" data-rid="' + esc(sheet.rid || '') + '"><span><b>Light day</b><br><span class="small muted">This workout only</span></span><span class="g">Start</span></button>' +
      (on ? '<button class="item" data-act="easy-off"><span><b>Back to normal</b><br><span class="small muted">Light week is set through ' + fmtShort(state.settings.lightUntil) + '</span></span><span class="g">Off</span></button>'
          : '<button class="item" data-act="easy-week"><span><b>Light week</b><br><span class="small muted">Every workout through ' + fmtShort(keyOf(addDays(new Date(), 6))) + '</span></span><span class="g">Set</span></button>') + '</div>';
  } else if (sheet.type === 'water') {
    inner = '<div class="between"><div class="h2">Log water</div><button class="btn sm ghost" data-act="close">Close</button></div>' +
      '<div class="steppers" style="margin-top:14px"><div class="stepper-wrap"><div class="lab"><span>Amount</span><span>' + waterUnit() + '</span></div><div class="stepper"><button type="button" data-act="water-step" data-d="-1" aria-label="Less">−</button><input inputmode="numeric" data-water="v" value="' + sheet.v + '" aria-label="Amount"><button type="button" data-act="water-step" data-d="1" aria-label="More">+</button></div></div></div>' +
      '<button class="btn primary" style="margin-top:14px" data-act="water-log">Add</button>';
  } else if (sheet.type === 'pick-routine') {
    inner = '<div class="between"><div class="h2">Pick a routine' + (sheet.light ? ' · light day' : '') + '</div><button class="btn sm ghost" data-act="close">Close</button></div><div class="list" style="margin-top:12px">' +
      state.routines.map(r => '<button class="item" data-act="start-routine" data-rid="' + r.id + '"><span><b>' + esc(r.name) + '</b><br><span class="small muted">' + (r.items.map(it => esc(ex(it.ex).name)).join(', ') || 'Empty') + '</span></span><span class="g">Start</span></button>').join('') +
      '<button class="item" data-act="start-routine" data-rid=""><span><b>Blank workout</b><br><span class="small muted">Add exercises as you go</span></span><span class="g">Start</span></button></div>';
  } else if (sheet.type === 'pick-ex') {
    inner = '<div class="between"><div class="h2">' + (sheet.for === 'swap' ? 'Swap ' + esc(ex(state.active.entries[sheet.i].ex).name) + ' for' : 'Add exercise') + '</div><button class="btn sm ghost" data-act="' + (sheet.for === 'routine' ? 'back-routine' : 'close') + '">' + (sheet.for === 'routine' ? 'Back' : 'Close') + '</button></div>' +
      '<input class="input" id="exsearch" placeholder="Search ' + CATALOG.concat(state.custom).filter(visibleEx).length + ' exercises, or type a new one" value="' + esc(sheet.q || '') + '" style="margin:10px 0" autocomplete="off">' + exChipsHTML() + '<div class="list" id="exlist">' + exListHTML() + '</div>';
  } else if (sheet.type === 'routine') {
    const r = routine(sheet.rid); if (!r) { sheet = null; modalEl.innerHTML = ''; return; }
    inner = '<div class="row"><input class="input grow" data-rname="' + r.id + '" value="' + esc(r.name) + '" aria-label="Routine name" style="font-family:var(--display);font-size:22px;font-weight:700;text-transform:uppercase"><button class="btn sm good" data-act="close">Done</button></div>' +
      '<div style="height:12px"></div>' +
      '<div class="stack" style="gap:0">' + (function(){ fixPairs(r.items); let h = ''; for (let idx = 0; idx < r.items.length; idx++) { const it = r.items[idx]; if (it.pair && r.items[idx + 1]) { h += '<div class="superset"><div class="sshead"><span class="eyebrow">Superset</span><button class="btn link small" data-act="ritem-pair" data-rid="' + r.id + '" data-idx="' + idx + '">Split</button></div>' + routineRow(r, it, idx) + routineRow(r, r.items[idx + 1], idx + 1) + '</div>'; idx++; continue; } h += routineRow(r, it, idx) + (idx < r.items.length - 1 && !r.items[idx + 1].pair ? '<div class="pairlink"><button class="btn link small" data-act="ritem-pair" data-rid="' + r.id + '" data-idx="' + idx + '">⇅ Superset with ' + esc(ex(r.items[idx + 1].ex).name) + '</button></div>' : ''); } return h; })() +
      (r.items.length ? '' : '<div class="empty">No exercises yet.</div>') +
      '<button class="btn secondary ghost" style="margin-top:10px" data-act="add-ex-routine" data-rid="' + r.id + '">+ Add exercise</button>' +
      '<div class="tiny faint" style="margin-top:8px">Rest is remembered per exercise, so squats can rest longer than curls wherever they appear.</div>' +
      '<div style="text-align:center;margin-top:6px"><button class="btn link danger" data-act="del-routine" data-rid="' + r.id + '">' + (sheet.confirm === r.id ? 'Tap again to delete this routine' : 'Delete routine') + '</button></div></div>';
  } else if (sheet.type === 'backup') {
    inner = sheet.mode === 'export'
      ? '<div class="between"><div class="h2">Backup</div><button class="btn sm ghost" data-act="close">Close</button></div><p class="small muted" style="margin:8px 0 10px">Copy this text somewhere safe (a note, an email to yourself). Paste it into Restore on any device to bring your workouts over.</p><textarea class="input" id="backup-text" readonly>' + esc(backupText()) + '</textarea><button class="btn primary" style="margin-top:12px" data-act="copy-backup">Copy backup</button>'
      : '<div class="between"><div class="h2">Restore</div><button class="btn sm ghost" data-act="close">Close</button></div><p class="small muted" style="margin:8px 0 10px">Paste a backup below. It replaces everything on this device.</p><textarea class="input" id="restore-text" placeholder="Paste backup text here"></textarea><button class="btn primary" style="margin-top:12px" data-act="do-restore">Restore</button>';
  } else if (sheet.type === 'fresh') {
    inner = '<div class="h2">Start fresh?</div><p style="margin:8px 0 14px">This removes the sample workouts and routines and sets every day to rest, so you can build your own week under Plan. Units and settings stay.</p><div class="row"><button class="btn grow" data-act="close">Keep looking</button><button class="btn grow primary" style="width:auto" data-act="fresh-yes">Start fresh</button></div>';
  } else if (sheet.type === 'clear') {
    inner = '<div class="h2">Clear all data?</div><p style="margin:8px 0 14px">Every workout, routine and setting on this device will be removed. There is no undo, so copy a backup first if you might want it back.</p><div class="row"><button class="btn grow" data-act="close">Cancel</button><button class="btn grow danger" data-act="clear-yes">Clear everything</button></div>';
  } else if (sheet.type === 'discard') {
    inner = '<div class="h2">Nothing logged yet</div><p style="margin:8px 0 14px">Discard this workout, or go back and log a set?</p><div class="row"><button class="btn grow" data-act="close">Keep going</button><button class="btn grow danger" data-act="discard">Discard</button></div>';
  }
  modalEl.innerHTML = '<div class="modal' + (sheet.type === 'pick-ex' ? ' pick' : '') + '"><div class="sheet" role="dialog" aria-modal="true"><div class="handle"></div>' + inner + '</div></div>';
  const s = $('#exsearch'); if (s && sheet.focusSearch) { s.focus(); sheet.focusSearch = false; }
  if (sheet.type === 'pick-ex') { const on = $('[data-act="ex-group"].on'); if (on) on.scrollIntoView({inline: 'center', block: 'nearest'}); chipsMore(); }
  if (sheet.type === 'share') buildShareImage(state.workouts.find(x => x.id === sheet.id));
}
function closeSheet(){ sheet = null; renderModal(); }
/* iPhones shift the page when the keyboard opens and can leave fixed bars floating mid-screen, even after it closes.
   So the rest bar and the status-bar fill are placed against the visible area (the visual viewport) instead of the page,
   the picker sheet takes the visible height, and the page gets a one-pixel nudge when the keyboard goes away. */
const topfillEl = $('.topfill'); let kbOpen = false;
function syncViewport(){
  const vv = window.visualViewport; if (!vv) return;
  const shift = Math.max(0, Math.round(vv.offsetTop)), below = Math.max(0, Math.round(window.innerHeight - vv.height - vv.offsetTop));
  const r = document.documentElement.style; r.setProperty('--vvh', Math.round(vv.height) + 'px'); r.setProperty('--vvt', shift + 'px');
  if (topfillEl) topfillEl.style.top = shift + 'px';
  restEl.style.bottom = (below + (tabsEl.hidden ? 0 : tabsEl.offsetHeight)) + 'px';
  const open = below > 80;
  if (open !== kbOpen) { kbOpen = open; if (!open) nudge(); }
}
/* A one-pixel scroll and back makes the browser re-place its fixed bars; invisible to the eye. */
function nudge(){ const y = window.scrollY; window.scrollTo(0, y > 0 ? y - 1 : y + 1); requestAnimationFrame(() => window.scrollTo(0, y)); }
if (window.visualViewport) { window.visualViewport.addEventListener('resize', syncViewport); window.visualViewport.addEventListener('scroll', syncViewport); syncViewport(); }
window.addEventListener('scroll', syncViewport, {passive: true});
document.addEventListener('focusout', () => { [60, 300, 700].forEach(ms => setTimeout(syncViewport, ms)); setTimeout(() => { if (!document.activeElement || document.activeElement === document.body) nudge(); }, 350); });
/* Category row: fade the right edge while there are more chips off screen. */
function chipsMore(){ const c = $('.modal.pick .chips'); if (c) c.classList.toggle('more', c.scrollLeft + c.clientWidth < c.scrollWidth - 4); }
modalEl.addEventListener('scroll', e => { if (e.target.classList && e.target.classList.contains('chips')) chipsMore(); }, true);
function updateRoutineBlock(w){
  const r = w.routine ? routine(w.routine) : null; if (!r || !routineChanged(w, r)) return '';
  return '<button class="btn secondary" style="margin-top:10px" data-act="update-routine" data-id="' + w.id + '">Update ' + esc(r.name) + ' for next time</button><div class="tiny muted" style="margin-top:6px;text-align:center">Today\'s exercises and order become the routine. Sets and reps you did not change stay as they were.</div>';
}
function summaryHTML(w){
  const rows = w.entries.map(en => { const e = ex(en.ex); const s = e.type === 'cardio' ? en.sets.map(cardioSetLabel).join('; ') : en.sets.map((x, k) => (x.wu ? 'warm-up ' : '') + (x.w ? dispW(x.w) + ' × ' : (e.time ? '' : 'BW × ')) + x.r + (e.time ? ' s' : '') + (x.amrap ? '+' : '') + (x.sub ? ' + ' + subLabel(x.sub, e.time) : '') + (x.tech ? ' (' + techName(x.tech).toLowerCase() + ')' : '')).join(', '); const pr = (w.prs || []).find(p => p.ex === en.ex); return '<tr><td>' + esc(e.name) + (pr ? ' <b>PR</b>' : '') + (state.exNotes[en.ex] ? '<div class="tiny muted">' + esc(state.exNotes[en.ex]) + '</div>' : '') + '</td><td class="num">' + s + '</td></tr>'; }).join('');
  const c = cardioOf(w), v = volumeOf(w);
  return '<div><div class="eyebrow">' + fmtLong(w.date) + ' · ' + fmtTime(w.start) + '</div><div class="h2" style="margin:4px 0 10px">' + esc(w.name) + (w.light ? ' <span class="pill rest" style="vertical-align:middle">Light day</span>' : '') + '</div>' +
    '<div class="tiny muted" style="margin-bottom:10px">' + durLabel(durOf(w)) + (setsOf(w) ? ' · ' + setsOf(w) + ' working sets · ' + fmtVol(v) + ' ' + wUnit() + ' lifted' : '') + (c.sec ? ' · ' + mmss(c.sec) + ' cardio' + (c.mi ? ', ' + dispD(c.mi) + ' ' + dUnit() : '') : '') + '</div>' +
    '<table class="sumtable">' + rows + '</table>' + ((w.prs || []).length ? '<div class="small" style="margin-top:10px">' + w.prs.map(p => 'PR: ' + esc(ex(p.ex).name) + ' ' + dispW(p.w) + ' × ' + p.r + ' (est. 1RM ' + dispW(Math.round(p.e1rm)) + ')').join('<br>') + '</div>' : '') + '</div>';
}
/* ---------- sharing: a text for messages, a card image for posts ---------- */
const TECH_SHORT = {drop: 'drop', half: 'half', restpause: 'rest-pause', cluster: 'cluster', myo: 'myo', partials: 'partials', other: 'extra'};
function setsCompact(e, sets){
  const ws = working(sets); if (!ws.length) return '';
  if (e.time) return ws.map(s => s.r + ' s').join(', ');
  const groups = [];
  for (const s of ws) { const w = s.w || 0, lab = s.r + (s.amrap ? '+' : '') + (s.sub ? ' (' + (TECH_SHORT[s.sub.tech] || 'extra') + ' ' + subStages(s.sub).map(x => (x.w ? dispW(x.w) : 'BW') + '×' + x.r).join('→') + ')' : '') + (s.tech ? ' ' + (TECH_SHORT[s.tech] || 'extra') : ''); const g = groups[groups.length - 1]; if (g && g.w === w) g.r.push(lab); else groups.push({w: w, r: [lab]}); }
  return groups.map(g => (g.w ? dispW(g.w) : 'BW') + '×' + g.r.join(', ')).join(' · ');
}
function entryLine(en){ const e = ex(en.ex); return e.type === 'cardio' ? en.sets.map(cardioSetLabel).join('; ') : setsCompact(e, en.sets); }
function statsOf(w){
  const c = cardioOf(w), v = volumeOf(w), n = setsOf(w);
  if (!n && c.sec) { const out = [{v: mmss(c.sec), k: 'time'}]; if (c.mi) { out.push({v: dispD(c.mi), k: dUnit()}); const p = paceOf(c.sec, c.mi); if (p) out.push({v: mmss(p), k: 'per ' + dUnit()}); } else out.push({v: durLabel(durOf(w)), k: 'total'}); return out; }
  return [{v: durLabel(durOf(w)), k: 'time'}, {v: String(n), k: n === 1 ? 'set' : 'sets'}, {v: fmtVol(v), k: wUnit() + ' lifted'}];
}
function shareText(w){
  const lines = [w.name + ' · ' + fmtWeekday(w.date)];
  const c = cardioOf(w); lines.push(statsOf(w).map(s => s.k === 'time' ? s.v : s.v + ' ' + s.k).join(' · ') + (setsOf(w) && c.sec ? ' · ' + mmss(c.sec) + ' cardio' + (c.mi ? ', ' + dispD(c.mi) + ' ' + dUnit() : '') : ''));
  const used = w.entries.filter(en => en.sets.length), solo = used.length === 1 && ex(used[0].ex).type === 'cardio';
  if (solo) lines[1] = ex(used[0].ex).name + ': ' + entryLine(used[0]);
  else for (const en of used) { const line = entryLine(en); if (line) lines.push(ex(en.ex).name + ': ' + line); }
  for (const p of (w.prs || [])) lines.push('PR: ' + ex(p.ex).name + ' ' + dispW(p.w) + '×' + p.r + ' (est. 1RM ' + dispW(Math.round(p.e1rm)) + ' ' + wUnit() + ')');
  const sc = athleteScore(); if (scoreOn()) { if (sc.total !== null && state.settings.metrics.score) lines.push('Athlete score ' + sc.total + ' of 100 · ' + sc.band); } else if (liftOn() && state.settings.metrics.score) { const st = strengthStanding(); if (st.label) lines.push('Strength standard: ' + st.label); }
  return lines.join('\n');
}
/* The card: 1080 × 1350, the 4:5 portrait most feeds use. Drawn from the same numbers as the text. */
function shareCanvas(w){
  const cv = document.createElement('canvas'); cv.width = 1080; cv.height = 1350; const g = cv.getContext('2d');
  const disp = '"Barlow Condensed","Roboto Condensed","Arial Narrow",sans-serif', body = 'Barlow,"Helvetica Neue",Arial,sans-serif';
  const C = {bg: '#11130F', card: '#22261F', card2: '#1A1D18', line: '#343930', text: '#F4F3EE', muted: '#B7B9B0', faint: '#8E9287', accent: '#8FA271', tint: '#2F3826', track: '#2A2F26'};
  const rr = (x, y, wd, h, r) => { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + wd, y, x + wd, y + h, r); g.arcTo(x + wd, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + wd, y, r); g.closePath(); };
  const fit = (t, maxW) => { if (g.measureText(t).width <= maxW) return t; let s = t; while (s.length > 1 && g.measureText(s + '…').width > maxW) s = s.slice(0, -1); return s + '…'; };
  const P = 72, W = 1080 - 2 * P;
  g.fillStyle = C.bg; g.fillRect(0, 0, 1080, 1350);
  g.fillStyle = C.card; rr(36, 36, 1008, 1278, 36); g.fill(); g.strokeStyle = C.line; g.lineWidth = 2; g.stroke();
  // header
  g.textBaseline = 'alphabetic';
  if (brandImg && brandImg.complete && brandImg.naturalWidth) { const bh = 40, bw = bh * brandImg.naturalWidth / brandImg.naturalHeight; g.drawImage(brandImg, P, 96, bw, bh); }
  else { g.fillStyle = C.text; g.font = '800 40px ' + body; g.letterSpacing = '4px'; g.fillText('BEARING', P, 132); g.letterSpacing = '0px'; }
  g.fillStyle = C.muted; g.font = '600 26px ' + body; g.letterSpacing = '3px'; g.textAlign = 'right';
  g.fillText((fmtLong(w.date) + ' · ' + fmtTime(w.start)).toUpperCase(), P + W, 130); g.textAlign = 'left'; g.letterSpacing = '0px';
  let size = 128; g.font = '700 ' + size + 'px ' + disp; const name = w.name.toUpperCase();
  while (g.measureText(name).width > W && size > 64) { size -= 8; g.font = '700 ' + size + 'px ' + disp; }
  g.fillStyle = C.text; g.fillText(fit(name, W), P, 150 + size * 0.86);
  // stats
  const stats = statsOf(w), sy = 150 + size + 44, colW = W / 3;
  stats.forEach((s, i) => { const x = P + i * colW; g.fillStyle = C.text; g.font = '700 78px ' + disp; g.fillText(fit(s.v, colW - 16), x, sy + 72); g.fillStyle = C.faint; g.font = '600 24px ' + body; g.letterSpacing = '2px'; g.fillText(s.k.toUpperCase(), x, sy + 112); g.letterSpacing = '0px'; });
  let y = sy + 150; g.strokeStyle = C.line; g.lineWidth = 2; g.beginPath(); g.moveTo(P, y); g.lineTo(P + W, y); g.stroke();
  // rows
  const entries = w.entries.filter(en => en.sets.length), max = 8, rows = entries.length > max ? entries.slice(0, max - 1) : entries, rowH = 74;
  const block = rowH * (rows.length + (entries.length > rows.length ? 1 : 0)), room = (1350 - 36 - 150) - 24 - (y + 18);
  y += 18 + (block < room ? Math.min(120, (room - block) / 2) : 0);
  for (const en of rows) {
    const e = ex(en.ex), pr = (w.prs || []).some(p => p.ex === en.ex);
    g.font = '400 34px ' + body; g.fillStyle = C.muted; const val = entryLine(en); const valW = Math.min(g.measureText(val).width, W * 0.55); const shown = fit(val, W * 0.55);
    g.textAlign = 'right'; g.fillText(shown, P + W, y + 46); g.textAlign = 'left';
    let nameW = W - valW - 28; g.font = '600 36px ' + body; g.fillStyle = C.text;
    if (pr) { nameW -= 74; }
    const nm = fit(e.name, nameW); g.fillText(nm, P, y + 47);
    if (pr) { const tx = P + g.measureText(nm).width + 16; g.fillStyle = C.tint; rr(tx, y + 16, 58, 36, 8); g.fill(); g.fillStyle = C.accent; g.font = '700 22px ' + body; g.letterSpacing = '1px'; g.fillText('PR', tx + 15, y + 42); g.letterSpacing = '0px'; }
    y += rowH; g.strokeStyle = C.line; g.lineWidth = 1; g.beginPath(); g.moveTo(P, y); g.lineTo(P + W, y); g.stroke();
  }
  if (entries.length > rows.length) { g.font = '400 30px ' + body; g.fillStyle = C.faint; g.fillText('+ ' + (entries.length - rows.length) + ' more', P, y + 44); y += rowH; }
  // footer: athlete score, or the records line
  const sc = athleteScore(), fy = 1350 - 36 - 168;
  g.fillStyle = C.faint; g.font = '600 20px ' + body; g.letterSpacing = '3px'; g.textAlign = 'right'; g.fillText('TRAINING WITH DIRECTION', P + W, 1350 - 36 - 26); g.textAlign = 'left'; g.letterSpacing = '0px';
  const st = !scoreOn() && liftOn() && state.settings.metrics.score ? strengthStanding() : null;
  if (scoreOn() && sc.total !== null && state.settings.metrics.score) {
    const cx = P + 60, cy = fy + 62, r = 50; g.lineWidth = 12; g.strokeStyle = C.track; g.beginPath(); g.arc(cx, cy, r, 0, Math.PI * 2); g.stroke();
    if (sc.total > 0) { g.strokeStyle = C.accent; g.lineCap = 'round'; g.beginPath(); g.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * sc.total / 100); g.stroke(); g.lineCap = 'butt'; }
    g.fillStyle = C.text; g.font = '700 48px ' + disp; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(String(sc.total), cx, cy + 2); g.textAlign = 'left'; g.textBaseline = 'alphabetic';
    g.fillStyle = C.faint; g.font = '600 24px ' + body; g.letterSpacing = '2px'; g.fillText('ATHLETE SCORE', P + 140, cy - 10); g.letterSpacing = '0px';
    g.fillStyle = C.text; g.font = '700 44px ' + disp; g.fillText((sc.total + ' OF 100 · ' + sc.band).toUpperCase(), P + 140, cy + 38);
  } else if ((w.prs || []).length) {
    g.fillStyle = C.faint; g.font = '600 24px ' + body; g.letterSpacing = '2px'; g.fillText('NEW RECORDS', P, fy + 30); g.letterSpacing = '0px';
    g.fillStyle = C.text; g.font = '700 40px ' + disp; g.fillText(fit(w.prs.map(p => ex(p.ex).name + ' ' + dispW(p.w) + '×' + p.r).join(' · ').toUpperCase(), W), P, fy + 84);
  } else if (st && st.label) {
    g.fillStyle = C.faint; g.font = '600 24px ' + body; g.letterSpacing = '2px'; g.fillText('STRENGTH STANDARD', P, fy + 30); g.letterSpacing = '0px';
    g.fillStyle = C.text; g.font = '700 44px ' + disp; g.fillText(fit((st.label + (st.next ? ' · ' + nextStandardLine(st, true) : '')).toUpperCase(), W), P, fy + 84);
  }
  return cv;
}
let shareFile = null, brandImg = null;
function brandReady(){ if (!brandImg) { brandImg = new Image(); brandImg.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(BRAND.wordmark.replace(/currentColor/g, '#F4F3EE')); } return brandImg.complete ? Promise.resolve() : new Promise(res => { brandImg.onload = res; brandImg.onerror = res; }); }
function buildShareImage(w){
  shareFile = null; const img = $('#share-img'); if (!img) return;
  const draw = () => { const cv = shareCanvas(w); img.src = cv.toDataURL('image/png'); if (cv.toBlob) cv.toBlob(b => { if (b) shareFile = new File([b], 'workout-' + w.date + '.png', {type: 'image/png'}); }, 'image/png'); };
  const fonts = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
  Promise.all([fonts.catch(() => {}), brandReady()]).then(draw, draw);
}
const canShareFiles = () => !!(navigator.canShare && shareFile && navigator.canShare({files: [shareFile]}));
function shareTextNow(text){
  if (navigator.share) navigator.share({text: text}).catch(() => {});
  else copyText(text);
}
function copyText(text){
  const done = () => toast('Copied. Paste it into a message.');
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, () => toast('Select the text and copy it'));
  else { const ta = $('#share-text'); if (ta) { ta.select(); try { document.execCommand('copy'); done(); } catch (e) { toast('Select the text and copy it'); } } }
}
function shareImageNow(){
  if (canShareFiles()) navigator.share({files: [shareFile]}).catch(() => {});
  else toast('Press and hold the image to save it, then post it.');
}
function reopenWorkout(id){
  if (state.active) { toast('Finish the current workout first'); return; }
  const idx = state.workouts.findIndex(w => w.id === id); if (idx < 0) return;
  const w = state.workouts.splice(idx, 1)[0]; const r = w.routine ? routine(w.routine) : null;
  const a = {id: w.id, date: w.date, start: w.start, routine: w.routine, name: w.name, entries: [], idx: 0, pausedTotal: w.pausedTotal || 0, pausedAt: null, origEnd: w.end, light: !!w.light};
  for (const en of w.entries) { const it = r ? r.items.find(x => x.ex === en.ex) : null; const m = makeEntry(en.ex, it || {}, !!w.light); if (en.adj) m.adj = en.adj; m.sets = en.sets.slice(); const lastSet = working(m.sets).slice(-1)[0]; if (lastSet) { if (lastSet.w !== undefined) m.draft.w = lastSet.w; if (lastSet.r !== undefined && !ex(en.ex).time) m.draft.r = lastSet.r; if (lastSet.sec !== undefined) { m.draft.min = Math.round(lastSet.sec / 60); m.draft.mi = lastSet.mi || 0; } } a.entries.push(m); }
  assignPRs(state.workouts); state.active = a; state.timer = null; state.ui.view = 'workout'; closeSheet(); render(); window.scrollTo(0, 0); toast('Reopened. Finish saves it again.');
}
function togglePause(){
  const a = state.active; if (!a) return;
  if (a.pausedAt) { const gap = Date.now() - a.pausedAt; a.pausedTotal = (a.pausedTotal || 0) + gap; a.pausedAt = null; if (state.timer) state.timer.end += gap; }
  else { a.pausedAt = Date.now(); }
  render();
}

/* ---------- actions ---------- */
function makeEntry(exId, it, light){
  const e = ex(exId), last = lastPerformance(exId); it = it || {}; if (light === undefined) light = !!(state.active && state.active.light);
  if (e.type === 'cardio') { const ls = last ? last.sets[last.sets.length - 1] : null; const d = {min: ls ? Math.round(ls.sec / 60) : (it.min || 30), mi: ls ? ls.mi : 0, speed: ls && ls.speed ? ls.speed : (e.eq === 'treadmill' ? tmDefaultSpeed(e) : 0), incline: ls && ls.incline ? ls.incline : 0};
    if (LOAD_IDS[exId]) d.load = it.load !== undefined ? it.load : (ls && ls.load ? ls.load : (isKg() ? 10 * LB_PER_KG : 20));
    if (tmEligible(e)) { d.tm = state.exTm[exId] !== undefined ? !!state.exTm[exId] : !!(ls && ls.tm); if (d.tm && !d.speed) d.speed = tmDefaultSpeed(e); }
    if ((e.eq === 'treadmill' || d.tm) && d.speed && !d.mi) d.mi = toMi(Math.round(d.speed * d.min / 60 * 100) / 100);
    let rec = recommendCardio(exId, it);
    if (rec && rec.code !== 'FIRST') { d.min = rec.min; if (rec.speed) d.speed = rec.speed; d.incline = rec.incline || 0; d.mi = rec.mi || 0; if ((e.eq === 'treadmill' || d.tm) && d.speed && !d.mi) d.mi = toMi(Math.round(d.speed * d.min / 60 * 100) / 100); }
    if (light && rec) { rec = Object.assign({}, rec, {code: 'LIGHT', min: Math.max(5, Math.round(d.min * 0.75)), base: rec}); d.min = rec.min; if (d.speed) d.mi = toMi(Math.round(d.speed * d.min / 60 * 100) / 100); }
    if (e.eq === 'treadmill' || tmEligible(e)) { d.ivl = ivlDefaults(e); if (ls && ls.ivl) { const v = ls.ivl, full = v.done >= v.rounds; d.ivl = Object.assign({on: true}, ivlCopy(v), {rounds: clamp(full ? v.rounds + 1 : v.rounds, 1, 20), hint: full ? 'You finished all ' + v.rounds + ' rounds last time, so one more today.' : 'Last time you got through ' + v.done + ' of ' + v.rounds + ' rounds, so the same again.'}); } }
    /* A routine that plans the treadmill (speed, incline, intervals) sets today's draft; the coach's nudges wait for a routine that leaves it open. */
    const planned = it.ivl || it.speed || it.incline !== undefined || it.tm !== undefined || it.load !== undefined;
    if (planned && (e.eq === 'treadmill' || tmEligible(e))) {
      if (tmEligible(e) && it.tm !== undefined) d.tm = !!it.tm;
      if (e.eq === 'treadmill' || d.tm) {
        if (it.ivl && ivlPhases(it.ivl).length) { d.ivl = Object.assign({on: true}, ivlCopy(it.ivl), {hint: 'Planned in your routine: ' + ivlLabel(it.ivl) + '.'}); d.min = Math.round(ivlTotalSec(d.ivl) / 60); }
        else { if (d.ivl) d.ivl.on = false; if (it.speed) d.speed = it.speed; if (it.incline !== undefined) d.incline = it.incline; d.min = it.min || d.min; d.mi = d.speed ? toMi(Math.round(d.speed * d.min / 60 * 100) / 100) : d.mi; }
        return {ex: exId, target: {sets: 1, min: d.min}, sets: [], draft: d, rec: {code: 'PLAN', min: d.min, speed: d.speed, incline: d.incline, mi: d.mi}};
      }
    }
    return {ex: exId, target: {sets: 1, min: it.min || 0}, sets: [], draft: d, rec: rec}; }

  const target = {sets: it.sets || 3, reps: it.reps || (e.time ? 30 : 10), hi: it.hi || it.reps || (e.time ? 30 : 10)}; if (it.fail && !e.time) target.fail = true;
  let rec = recommend(exId, target); if (light) rec = lightRec(rec, e);
  const seed = e.bar ? (isKg() ? 20 * LB_PER_KG : 45) : (e.bw ? 0 : (isKg() ? 10 * LB_PER_KG : 20));
  const w = rec ? (rec.w === null ? (last ? last.sets[0].w : seed) : rec.w) : (last ? last.sets[0].w : seed);
  const r = target.fail ? (last ? last.sets[0].r : 10) : (rec ? rec.goals[0] : (last ? last.sets[0].r : target.reps));
  return {ex: exId, target: target, rec: rec, sets: [], draft: {w: w, r: r, amrap: !!target.fail}};
}
function startWorkout(rid, light){
  selDay = null; weekBack = 0;
  const r = rid ? routine(rid) : null;
  const a = {id: uid(), date: todayKey(), start: Date.now(), routine: rid || null, name: r ? r.name : 'Workout', entries: [], idx: 0, pausedTotal: 0, pausedAt: null, light: !!light || lightWeekOn()};
  if (r) for (const it of r.items) { const en = makeEntry(it.ex, it, a.light); if (it.pair) en.pair = true; a.entries.push(en); }
  fixPairs(a.entries);
  state.active = a; state.timer = null; state.ui.view = 'workout';
  keepAwake(true); unlockAudio(); render(); window.scrollTo(0, 0);
  if (a.light) toast('Light day: 85% of the plan, nothing counts against it');
  if (!a.entries.length) { sheet = {type: 'pick-ex', for: 'active', q: '', focusSearch: true}; renderModal(); }
}
function stepDraft(i, f, dir){
  const en = state.active && state.active.entries[i]; if (!en) return; const d = en.draft;
  if (f === 'w') d.w = toLb(Math.max(0, Number(dispW(d.w)) + dir * wStep()));
  else if (f === 'mi') d.mi = toMi(Math.max(0, Math.round((Number(dispD(d.mi)) + dir * 0.25) * 100) / 100));
  else if (f === 'min') d.min = clamp(Math.round(d.min + dir), 0, 999);
  else if (f === 'speed') d.speed = Math.max(0, Math.round(((d.speed || 0) + dir * 0.1) * 10) / 10);
  else if (f === 'incline') d.incline = clamp(Math.round(((d.incline || 0) + dir * 0.5) * 10) / 10, 0, 40);
  else if (f === 'load') d.load = toLb(Math.max(0, Number(dispW(d.load || 0)) + dir * wStep()));
  else if (f.indexOf('sw') === 0 || f.indexOf('sr') === 0) { const st = subStages(d.sub), k = +(f.split('.')[1] || 0), s = st[k]; if (s) { if (f.indexOf('sw') === 0) { s.w = toLb(Math.max(0, Number(dispW(s.w)) + dir * wStep())); s.manualW = true; } else { s.r = clamp(Math.round(s.r + dir), 1, 600); s.manualR = true; } subRefresh(d.sub, d, ex(en.ex)); } }
  else d.r = clamp(Math.round(d.r + dir * (ex(en.ex).time ? 5 : repStep(ex(en.ex)))), 0, 600);
  const input = $('input[data-bind="' + f + '"][data-i="' + i + '"]');
  if (input) input.value = f === 'w' ? dispW(d.w) : f === 'mi' ? dispD(d.mi) : f === 'load' ? dispW(d.load || 0) : f.indexOf('sw') === 0 || f.indexOf('sr') === 0 ? subValue(d, f) : String(d[f]);
  if (d.sub && (f === 'w' || f === 'r')) subRefresh(d.sub, d, ex(en.ex));
  if (d.sub && (f === 'w' || f === 'r' || f.indexOf('sw') === 0 || f.indexOf('sr') === 0)) subStages(d.sub).forEach((s, k) => { const suf = k ? '.' + k : ''; const wi = $('input[data-bind="sw' + suf + '"][data-i="' + i + '"]'), ri = $('input[data-bind="sr' + suf + '"][data-i="' + i + '"]'); if (wi) wi.value = dispW(s.w); if (ri) ri.value = String(s.r); });
  if (f === 'speed' || f === 'min') { if (d.speed) d.mi = toMi(Math.round(d.speed * (d.min || 0) / 60 * 100) / 100); }
  if (f === 'w' || f === 'r') { refreshWarmups(i); if (d.sub) subRefresh(d.sub, d, ex(en.ex)); }
  patchLine(i); save();
}
/* Warm-up rows on any lift: a ramp sized to the working weight; add or remove a set and the ramp re-spaces until one is logged. */
function addWarmup(en){
  const e = ex(en.ex), W = en.draft.w, bar = e.bar ? (isKg() ? 20 * LB_PER_KG : 45) : 0;
  const wasHidden = en.wu === false; en.wu = true;
  if (!en.wuRows) en.wuRows = warmupScheme(e, W);
  const logged = en.sets.filter(x => x.wu).length, rows = en.wuRows;
  if (wasHidden && rows.length > logged) { if (!logged && !rows.some(r => r.manual)) en.wuRows = warmupRamp(e, W, rows.length, en.draft.r); return; }
  if (!logged && !rows.some(r => r.manual)) { en.wuRows = warmupRamp(e, W, rows.length + 1, en.draft.r); return; }
  const last = rows[rows.length - 1];
  if (e.time) rows.push({w: 0, r: Math.max(5, Math.round((en.draft.r || 20) / 2))});
  else if (e.bw && !W) rows.push({w: 0, r: Math.max(1, Math.round((en.draft.r || 8) / 2))});
  else if (!last) rows.push({w: Math.max(bar, roundInc(W * 0.6, e)), r: 8});
  else rows.push({w: Math.min(Math.max(bar, roundInc((last.w + W) / 2, e)), Math.max(bar, W - incFor(e))), r: Math.max(1, Math.min(last.r, 5) - 2)});
}
function removeWarmup(en){
  const e = ex(en.ex), logged = en.sets.filter(x => x.wu).length, rows = en.wuRows || [];
  if (rows.length <= logged) return;
  if (!logged && !rows.some(r => r.manual)) en.wuRows = warmupRamp(e, en.draft.w, rows.length - 1, en.draft.r); else rows.pop();
  if (!en.wuRows.length) en.wu = false;
}
/* The working weight moved: re-space the rows nobody has logged or typed over. */
function refreshWarmups(i){
  const en = state.active && state.active.entries[i]; if (!en || en.wu === false || !en.wuRows) return;
  const e = ex(en.ex); if (en.sets.some(x => x.wu)) return;
  const fresh = warmupRamp(e, en.draft.w, en.wuRows.length, en.draft.r); if (!fresh.length) return;
  en.wuRows = en.wuRows.map((r, k) => r.manual ? r : fresh[k]);
  en.wuRows.forEach((r, k) => { const wi = $('input[data-wu="w"][data-i="' + i + '"][data-k="' + k + '"]'), ri = $('input[data-wu="r"][data-i="' + i + '"][data-k="' + k + '"]'); if (wi && !r.manual) wi.value = dispW(r.w); if (ri && !r.manual) ri.value = String(r.r); });
}
function startRest(exId, secs, kind){ const s = secs !== undefined ? secs : (restFor(exId) || state.settings.rest); if (!s) return; state.timer = {end: Date.now() + s * 1000, total: s, fired: false, kind: kind || ''}; }
function logSet(i){
  const a = state.active, en = a.entries[i], e = ex(en.ex), d = en.draft;
  unlockAudio();
  if (e.type === 'cardio') {
    if (d.ivl && d.ivl.on) { logIntervals(i, ivlTotalSec(d.ivl)); return; }
    const sec = Math.round((Number(d.min) || 0) * 60); if (!sec) { toast('Enter the minutes first'); return; }
    const cs = {sec: sec, mi: Math.round((d.mi || 0) * 100) / 100, t: Date.now()};
    if (onTreadmill(en)) { if (d.speed) { cs.speed = d.speed; if (!cs.mi) cs.mi = toMi(Math.round(d.speed * sec / 3600 * 100) / 100); } if (d.incline) cs.incline = d.incline; if (e.eq !== 'treadmill') cs.tm = true; }
    if (LOAD_IDS[e.id] && d.load) cs.load = Math.round(d.load * 10) / 10;
    en.sets.push(cs);
  } else {
    const w = Math.round(d.w * 100) / 100, r = Math.round(d.r); if (!r) { toast('Enter the reps first'); return; }
    const set = {w: w, r: r, t: Date.now()}, k = counted(en.sets).length;
    if (d.amrap) { set.amrap = true; d.amrap = !!(en.target && en.target.fail); }
    if (d.sub) { const st = subStages(d.sub).filter(x => Math.round(x.r) > 0).map(x => ({w: Math.round(x.w * 100) / 100, r: Math.round(x.r)})); if (st.length) set.sub = Object.assign({tech: d.sub.tech}, st[0], {more: st.slice(1)}); d.sub = null; }
    if (en.rec) { if (en.rec.w !== null) set.tw = en.rec.w; const g = en.rec.goals[k]; if (g) set.tr = g; }
    const hist = bestE1rm(en.ex), v = e1rm(w, r);
    const sessionBest = Math.max.apply(null, [0].concat(working(en.sets).map(s => e1rm(s.w, s.r))));
    if (!e.time && hist > 0 && v > hist + 0.01 && v > sessionBest + 0.01) set.pr = true;
    en.sets.push(set); haptic(set.pr ? 'success' : 'tap');
    if (en.rec) { const g = en.rec.goals[counted(en.sets).length]; if (g) d.r = g; }
    const partner = en.pair && a.entries[i + 1] ? i + 1 : (pairedWithPrev(a.entries, i) ? i - 1 : -1);
    if (partner >= 0 && en.pair && !entryDone(a.entries[partner])) { a.idx = partner; toast('Now ' + ex(a.entries[partner].ex).name + ', no rest'); }
    else { startRest(en.ex); if (partner >= 0 && !en.pair && !entryDone(a.entries[partner])) a.idx = partner; }
  }
  render();
}
function removeEntry(i){ const a = state.active, name = ex(a.entries[i].ex).name; a.entries.splice(i, 1); a.idx = clamp(a.idx, 0, Math.max(0, a.entries.length - 1)); if (sheet) { sheet = null; renderModal(); } save(); render(); toast(name + ' removed from today'); }
function pickExercise(exId){
  if (sheet.for === 'routine') {
    const r = routine(sheet.rid); const e = ex(exId);
    r.items.push(e.type === 'cardio' ? {ex: exId, sets: 1, min: 20} : (e.time ? {ex: exId, sets: 3, reps: 30} : {ex: exId, sets: 3, reps: 8, hi: 10}));
    sheet = {type: 'routine', rid: r.id}; renderModal(); save();
  } else if (sheet.for === 'swap') {
    swapExercise(sheet.i, exId);
  } else {
    state.active.entries.push(makeEntry(exId)); state.active.idx = state.active.entries.length - 1;
    closeSheet(); render();
  }
}
/* Swap keeps the set count and rep range. Sets already logged stay with the old exercise; the new one carries what is left. */
function swapExercise(i, exId){
  const a = state.active, en = a && a.entries[i]; if (!en || en.ex === exId) { closeSheet(); return; }
  const old = ex(en.ex), nu = ex(exId), t = en.target;
  const done = en.sets.filter(x => !x.wu).length;
  const it = nu.type === 'cardio' ? {min: t.min || en.draft.min || 20} : {sets: Math.max(1, (t.sets || 3) - done), reps: t.reps, hi: t.hi};
  if (nu.type !== 'cardio' && old.type === 'cardio') { it.sets = 3; it.reps = 8; it.hi = 10; }
  const fresh = makeEntry(exId, it);
  if (done) { fresh.swapped = old.id; en.target = Object.assign({}, t, {sets: done}); a.entries.splice(i + 1, 0, fresh); a.idx = i + 1; }
  else { if (en.pair) fresh.pair = true; a.entries[i] = fresh; a.idx = i; }
  closeSheet(); render(); save();
  toast(nu.name + (done ? ' takes over for the remaining sets' : ' swapped in, same sets and reps'));
}
function createExercise(){
  const name = (sheet.q || '').trim(); if (!name) return;
  const group = ($('#newgroup') && $('#newgroup').value) || 'Chest', type = group === 'Cardio' ? 'cardio' : 'lift';
  const eqSel = $('#neweq'), eq = eqSel && eqSel.value ? eqSel.value : (type === 'cardio' ? 'other' : 'other');
  const e = {id: 'c_' + uid(), name: name, type: type, group: group, eq: eq};
  if (type === 'lift') { if (eq === 'barbell' || eq === 'trap bar') e.bar = true; if (eq === 'bodyweight') e.bw = true; }
  state.custom.push(e); pickExercise(e.id);
}
function finish(){
  const a = state.active; if (!a) return;
  if (!a.entries.some(en => en.sets.length)) { sheet = {type: 'discard'}; renderModal(); return; }
  if (a.pausedAt) { a.pausedTotal = (a.pausedTotal || 0) + (Date.now() - a.pausedAt); a.pausedAt = null; }
  const end = a.origEnd && a.date !== todayKey() ? a.origEnd : Date.now();
  const coach = coachSummary(a);
  const w = {id: a.id, date: a.date, start: a.start, end: end, routine: a.routine, name: a.name, prs: [], pausedTotal: a.pausedTotal || 0, coach: coach, light: !!a.light, order: a.entries.map(en => Object.assign({ex: en.ex}, en.target ? {target: en.target} : {}, en.pair ? {pair: true} : {}, en.swapped ? {swapped: en.swapped} : {})),
    entries: a.entries.filter(en => en.sets.length).map(en => Object.assign({ex: en.ex, sets: en.sets.map(s => { const c = Object.assign({}, s); delete c.pr; delete c.prevW; return c; })}, en.pair ? {pair: true} : {}, en.adj ? {adj: en.adj} : {}, en.target ? {target: en.target} : {}, en.swapped ? {swapped: en.swapped} : {}))};
  for (const en of w.entries) { if (ex(en.ex).type !== 'lift' || ex(en.ex).time) continue; const top = topSet(working(en.sets)); if (!top) continue; const b = bestE1rm(en.ex); if (b > 0 && top.v > b + 0.01) w.prs.push({ex: en.ex, w: top.w, r: top.r, e1rm: top.v}); }
  state.workouts.push(w); state.active = null; state.timer = null; keepAwake(false);
  state.ui.view = 'today'; sheet = {type: 'summary', id: w.id}; render(); renderModal(); window.scrollTo(0, 0);
}
function backupText(){ const s = Object.assign({}, state, {active: null, timer: null}); delete s.ui; delete s.sync; return JSON.stringify(s); }
function copyBackup(){
  const ta = $('#backup-text'); const text = ta ? ta.value : backupText();
  const done = () => { state.settings.lastBackup = Date.now(); save(); toast('Copied. Paste it somewhere safe.'); };
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, () => { ta.select(); toast('Select all and copy'); });
  else { ta.select(); try { document.execCommand('copy'); done(); } catch (e) { toast('Select all and copy'); } }
}
function doRestore(){
  const ta = $('#restore-text'); let s = null;
  try { s = JSON.parse(ta.value); } catch (e) {}
  if (!s || s.v !== 1 || !Array.isArray(s.workouts) || !s.settings) { toast('That does not look like a backup from this app'); return; }
  s.ui = {view: 'today', tab: 'today', openHist: null, progEx: null}; s.active = null; s.timer = null; s.custom = s.custom || []; s.since = s.since || earliestDate(s.workouts);
  state = normalizeState(s) || s; state.sync = {rev: 0}; assignPRs(state.workouts); saveNow(); closeSheet(); render(); toast('Restored ' + state.workouts.length + ' workouts');
}

/* ---------- native app bridge ----------
   Inside the App Store build, Capacitor exposes the phone's own features. Everything here is a no-op on the web. */
const NATIVE = !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());
const Plug = name => (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins[name]) || null;
function haptic(kind){ const H = Plug('Haptics'); if (!H) return; try { if (kind === 'alert') H.vibrate({duration: 400}); else if (kind === 'success') H.notification({type: 'SUCCESS'}); else H.impact({style: 'MEDIUM'}); } catch (e) {} }
let restAlertKey = '', restAlertAsked = false;
/* One scheduled notification mirrors the rest timer: set when a rest starts, moved when time is added, dropped when it is skipped or paused. */
function syncRestAlert(){
  const LN = Plug('LocalNotifications'); if (!LN) return;
  const t = state.timer, a = state.active, want = t && !t.fired && !(a && a.pausedAt) ? t.end : 0, snd = alertFile();
  const key = want ? want + '|' + snd : ''; if (key === restAlertKey) return; restAlertKey = key;
  (async () => {
    try {
      await LN.cancel({notifications: [{id: 7}]});
      if (!want) return;
      if (!restAlertAsked) { restAlertAsked = true; const p = await LN.checkPermissions(); if (p.display !== 'granted') { const r = await LN.requestPermissions(); if (r.display !== 'granted') return; } }
      await LN.schedule({notifications: [{id: 7, title: t.kind === 'rp' ? 'Go again' : 'Rest done', body: a ? a.name + ': next set.' : 'Next set.', schedule: {at: new Date(want), allowWhileIdle: true}, sound: snd || undefined}]});
    } catch (e) {}
  })();
}
function nativeBoot(){
  if (!NATIVE) return;
  try { const SB = Plug('StatusBar'); if (SB) { SB.setStyle({style: 'DARK'}).catch(() => {}); if (SB.setBackgroundColor) SB.setBackgroundColor({color: '#11130F'}).catch(() => {}); } } catch (e) {}
  try { const SS = Plug('SplashScreen'); if (SS) setTimeout(() => SS.hide().catch(() => {}), 150); } catch (e) {}
  try { const A = Plug('App'); if (A && A.addListener) A.addListener('backButton', () => { if (sheet) { closeSheet(); return; } if (state.ui.view === 'workout') { state.ui.view = 'today'; render(); return; } if (state.ui.view !== 'today') { state.ui.view = 'today'; render(); return; } if (A.minimizeApp) A.minimizeApp(); }); } catch (e) {}
}

/* ---------- device niceties ---------- */
let wl = null;
async function keepAwake(on){
  const B = Plug('Bearing'); if (B && B.keepAwake) { B.keepAwake({on: !!on}).catch(() => {}); return; }
  try {
    if (on && !wl && navigator.wakeLock) { wl = await navigator.wakeLock.request('screen'); wl.addEventListener('release', () => { wl = null; }); }
    else if (!on && wl) { await wl.release(); wl = null; }
  } catch (e) { wl = null; }
}
/* ---------- the rest alert ----------
   Each tone is a small synth patch scheduled on a Web Audio context. The website plays the patch live; tools/render_tones.js renders
   the same patches to the .wav files that the App Store app plays natively (over the ring switch, through headphones, ducking music)
   and that the lock-screen notification uses, so every route sounds the same. */
const TONES = [{id: 'chime', name: 'Chime', file: 'chime.wav'}, {id: 'bell', name: 'Bell', file: 'bell.wav'}, {id: 'beep', name: 'Beep', file: 'beep.wav'}, {id: 'buzzer', name: 'Buzzer', file: 'buzzer.wav'}];
const TONE_LEVEL = {chime: 1.35, bell: 1.1, beep: 1.4, buzzer: 1.5};
const toneOf = () => TONES.find(t => t.id === state.settings.tone) || TONES[0];
/* The file the notification plays: the chosen tone, a silent file when only vibration is wanted (the vibration rides on it), nothing otherwise. */
const alertFile = () => state.settings.sound ? toneOf().file : (state.settings.vibrate ? 'silent.wav' : '');
function toneGraph(ctx, dest, id, t0){
  const master = ctx.createGain(); master.gain.value = TONE_LEVEL[id] || 0.8; master.connect(dest);
  let end = t0;
  /* a voice is a stack of partials [ratio, level, wave, length share]; 'ring' fades like a struck bar, 'hold' stays flat then stops */
  const voice = (freq, at, dur, peak, partials, shape) => {
    partials.forEach(p => {
      const o = ctx.createOscillator(), g = ctx.createGain(), len = dur * (p[3] || 1);
      o.type = p[2] || 'sine'; o.frequency.value = freq * p[0];
      g.gain.setValueAtTime(0.0001, at); g.gain.linearRampToValueAtTime(peak * p[1], at + 0.008);
      if (shape === 'hold') { g.gain.setValueAtTime(peak * p[1], at + len - 0.03); g.gain.linearRampToValueAtTime(0.0001, at + len); }
      else { g.gain.exponentialRampToValueAtTime(peak * p[1] * 0.03, at + len); g.gain.linearRampToValueAtTime(0.0001, at + len + 0.06); }
      o.connect(g); g.connect(master); o.start(at); o.stop(at + len + 0.08);
    });
    end = Math.max(end, at + dur + 0.08);
  };
  if (id === 'bell') { [0, 0.6].forEach(off => voice(740, t0 + off, 1.6, 0.42, [[1, 1], [2, 0.5, 'sine', 0.7], [2.76, 0.28, 'sine', 0.5], [5.4, 0.12, 'sine', 0.3]])); }
  else if (id === 'beep') { [0, 0.22, 0.44].forEach(off => voice(880, t0 + off, 0.15, 0.5, [[1, 1, 'triangle'], [2, 0.25]], 'hold')); }
  else if (id === 'buzzer') { [0, 0.5].forEach(off => voice(220, t0 + off, 0.36, 0.35, [[1, 1, 'sawtooth'], [0.5, 0.6, 'square']], 'hold')); }
  else { voice(1047, t0, 0.8, 0.45, [[1, 1], [2, 0.35, 'sine', 0.6], [3, 0.1, 'sine', 0.4]]); voice(1568, t0 + 0.22, 1.0, 0.45, [[1, 1], [2, 0.3, 'sine', 0.6], [3, 0.08, 'sine', 0.4]]); }
  return end;
}
let actx = null;
/* Web Audio needs a tap before it may speak; the App Store app plays natively and never opens a context. */
function unlockAudio(){ if (Plug('Bearing')) return; try { const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return; if (!actx) actx = new AC(); if (actx.state !== 'running') actx.resume(); } catch (e) {} }
/* Play the chosen tone. Resolves with what the native player reports (route, volume), or null on the web. */
function beep(){
  if (!state.settings.sound) return Promise.resolve(null);
  const B = Plug('Bearing'); if (B && B.play) return B.play({name: toneOf().file}).catch(() => null);
  if (!actx) return Promise.resolve(null);
  const go = () => { try { toneGraph(actx, actx.destination, toneOf().id, actx.currentTime + 0.02); } catch (e) {} return null; };
  if (actx.state !== 'running') { try { return actx.resume().then(go, () => null); } catch (e) { return Promise.resolve(null); } }
  return Promise.resolve(go());
}
function buzz(){ if (!state.settings.vibrate) return; if (NATIVE) { haptic('alert'); setTimeout(() => haptic('alert'), 600); return; } if (navigator.vibrate) { try { navigator.vibrate([260, 140, 260]); } catch (e) {} } }
function alertHelp(){
  if (Plug('Bearing')) return 'Plays at media volume even with the ring switch on silent, through headphones when they are connected, and turns your music down for a moment. With the phone locked, the alert arrives as a notification and follows the ring switch.';
  if (NATIVE) return 'Plays at media volume, through headphones when they are connected. With the screen off, the alert arrives as a notification.';
  return 'Plays at media volume while Bearing is open' + (/iPhone|iPad/.test(navigator.userAgent) ? '. Safari mutes it when the ring switch is on silent; the App Store app does not have that limit.' : '.');
}
function testAlert(){
  unlockAudio(); buzz();
  if (!state.settings.sound) { toast('Vibration only'); return; }
  beep().then(r => {
    if (r && r.volume === 0) toast('Media volume is all the way down');
    else if (r && /Headphones|Bluetooth|AirPlay|USB|HDMI|CarAudio/i.test(r.route || '')) toast('Played through ' + (r.routeName || 'headphones'));
    else toast('Played');
  });
}

/* ---------- events ---------- */
app.addEventListener('click', e => {
  if (justDragged || drag || e.target.closest('[data-grip]')) { e.preventDefault(); return; }
  if (e.target.classList.contains('modal')) { closeSheet(); render(); return; }
  const t = e.target.closest('[data-act],[data-tab]'); if (!t) return;
  if (t.dataset.tab) { state.ui.view = t.dataset.tab; state.ui.confirmDel = null; render(); window.scrollTo(0, 0); return; }
  const act = t.dataset.act, i = +t.dataset.i;
  switch (act) {
    case 'start': startWorkout(t.dataset.rid); break;
    case 'resume': state.ui.view = 'workout'; keepAwake(true); render(); window.scrollTo(0, 0); break;
    case 'leave': state.ui.view = 'today'; render(); window.scrollTo(0, 0); break;
    case 'pick-routine': sheet = {type: 'pick-routine'}; renderModal(); break;
    case 'start-routine': { const light = !!(sheet && sheet.light); closeSheet(); startWorkout(t.dataset.rid, light); break; }
    case 'acct-open': sheet = {type: 'account'}; renderModal(); setTimeout(() => { const el = $('#acct-email'); if (el) el.focus(); }, 50); break;
    case 'acct-later': state.settings.acctSnooze = Date.now(); save(); render(); break;
    case 'sign-in': doAuth('in'); break;
    case 'sign-up': doAuth('up'); break;
    case 'forgot-pw': doAuth('forgot'); break;
    case 'sign-out': sheet = {type: 'signout'}; renderModal(); break;
    case 'sign-out-go': signOut(); break;
    case 'alert-test': testAlert(); break;
    case 'acct-delete-ask': sheet = {type: 'acct-delete'}; renderModal(); break;
    case 'acct-delete': { syncUi.busy = true; patchSyncLine(); authFetch('/rest/v1/rpc/delete_user', {method: 'POST', body: '{}'}).then(res => { syncUi.busy = false; if (!res.ok) throw new Error('Could not delete the account just now'); setAuth(null); clearPhone(); closeSheet(); render(); toast('Account deleted.'); }).catch(e => { syncUi.busy = false; syncUi.error = e.message; patchSyncLine(); }); break; }
    case 'sync-now': { syncPull({force: true, toast: true}).then(ok => { if (ok) syncPush(); }); break; }
    case 'newpw-save': { const p = $('#acct-pw'), pw = p ? p.value : ''; if (pw.length < 8) { syncUi.error = 'The password needs 8 or more characters.'; patchSyncLine(); break; } setPassword(pw).then(() => authFetch('/auth/v1/user')).then(r => r.ok ? r.json() : null).then(u => { if (u && u.id) { auth.uid = u.id; auth.email = u.email || auth.email; setAuth(auth); } syncUi.error = ''; closeSheet(); toast('Password saved'); render(); syncPull({force: true}); }).catch(e => { syncUi.error = e.message; patchSyncLine(); }); break; }
    case 'easy-open': sheet = {type: 'easy', rid: t.dataset.rid || ''}; renderModal(); break;
    case 'easy-day': { const rid = t.dataset.rid; closeSheet(); if (rid && routine(rid)) startWorkout(rid, true); else { sheet = {type: 'pick-routine', light: true}; renderModal(); } break; }
    case 'easy-week': state.settings.lightUntil = keyOf(addDays(new Date(), 6)); closeSheet(); save(); render(); toast('Light week on through ' + fmtShort(state.settings.lightUntil)); break;
    case 'easy-off': state.settings.lightUntil = null; if (sheet) closeSheet(); save(); render(); toast('Back to the normal plan'); break;
    case 'light-toggle': setLight(!(state.active && state.active.light)); break;
    case 'adj': { const a = state.active, i = +t.dataset.i, en = a && a.entries[i]; if (!en) break; const e = ex(en.ex), k = t.dataset.k, base = recommend(en.ex, en.target); if (!k) { delete en.adj; en.rec = base; } else { en.adj = k; en.rec = adjustRec(base, e, k, lastPerformance(en.ex)); } if (en.rec && en.rec.w !== null && !counted(en.sets).length) { en.draft.w = en.rec.w; en.draft.r = en.rec.goals[0]; refreshWarmups(i); if (en.draft.sub) subRefresh(en.draft.sub, en.draft, e); } closeSheet(); save(); render(); toast(k ? 'Your call. The plan stays where it is.' : 'Back to the coach\'s numbers'); break; }
    case 'water-add': { const v = +t.dataset.v; waterAdd(todayKey(), volToOz(v)); render(); const g = waterGoal(todayKey()), tot = waterTotal(todayKey()); toast(tot >= g.total ? 'Goal hit: ' + dispVol(tot) + ' ' + waterUnit() : dispVol(tot) + ' of ' + dispVol(g.total) + ' ' + waterUnit()); break; }
    case 'water-undo': { const l = state.water && state.water[todayKey()]; if (l && l.length) { l.pop(); save(); render(); } break; }
    case 'water-open': sheet = {type: 'water', v: isKg() ? 500 : 16}; renderModal(); break;
    case 'water-step': { if (!sheet || sheet.type !== 'water') break; const inp = $('input[data-water="v"]'); const step = isKg() ? 50 : 4, cur = inp ? (parseInt(inp.value, 10) || 0) : sheet.v; sheet.v = clamp(cur + step * (+t.dataset.d), step, isKg() ? 3000 : 100); if (inp) inp.value = sheet.v; break; }
    case 'water-log': { if (!sheet || sheet.type !== 'water') break; const inp = $('input[data-water="v"]'); const v = clamp(parseInt(inp ? inp.value : sheet.v, 10) || 0, 1, isKg() ? 5000 : 200); if (!v) break; waterAdd(todayKey(), volToOz(v)); closeSheet(); render(); toast('+' + v + ' ' + waterUnit()); break; }
    case 'water-toggle': state.settings.water.on = !state.settings.water.on; save(); render(); break;
    case 'water-bonus': state.settings.water.bonus = state.settings.water.bonus === false; save(); render(); break;
    case 'water-auto': state.settings.water.goal = 0; save(); render(); break;
    case 'water-goal': { const s = state.settings.water, cur = s.goal || waterAutoGoal(), step = volToOz(isKg() ? 250 : 8); s.goal = clamp(Math.round((cur + step * (+t.dataset.d)) * 100) / 100, 16, 400); save(); render(); break; }
    case 'focus': state.active.idx = i; render(); break;
    case 'goto': state.active.idx = +t.dataset.to; render(); window.scrollTo(0, 0); break;
    case 'skip': state.active.entries[i].skipped = true; state.active.idx = +t.dataset.to; render(); window.scrollTo(0, 0); break;
    case 'pause': togglePause(); break;
    case 'ex-menu': sheet = {type: 'exmenu', i: i}; renderModal(); break;
    case 'move': { const a = state.active, j = i + (+t.dataset.d); if (j < 0 || j >= a.entries.length) break; const tmp = a.entries[i]; a.entries[i] = a.entries[j]; a.entries[j] = tmp; a.idx = j; closeSheet(); render(); break; }
    case 'note-edit': sheet = {type: 'note', ex: state.active.entries[i].ex}; renderModal(); setTimeout(() => { const ta = $('#note-text'); if (ta) ta.focus(); }, 50); break;
    case 'note-save': { const ta = $('#note-text'); const v = ta ? ta.value.trim() : ''; if (v) state.exNotes[t.dataset.ex] = v; else delete state.exNotes[t.dataset.ex]; closeSheet(); render(); break; }
    case 'note-del': delete state.exNotes[state.active.entries[i].ex]; render(); break;
    case 'wu-off': state.active.entries[i].wu = false; render(); break;
    case 'wu-add': addWarmup(state.active.entries[i]); render(); break;
    case 'wu-remove': removeWarmup(state.active.entries[i]); render(); break;
    case 'log-wu': { const en = state.active.entries[i], k = +t.dataset.k, row = en.wuRows[k]; const wi = $('input[data-wu="w"][data-i="' + i + '"][data-k="' + k + '"]'), ri = $('input[data-wu="r"][data-i="' + i + '"][data-k="' + k + '"]'); const w = wi ? toLb(parseFloat(wi.value) || 0) : row.w, r = ri ? (parseInt(ri.value, 10) || row.r) : row.r; en.sets.push({w: Math.round(w * 100) / 100, r: r, wu: true, t: Date.now()}); unlockAudio(); const lastWu = en.sets.filter(x => x.wu).length >= en.wuRows.length; startRest(en.ex, lastWu ? undefined : wuRestFor(en.ex)); render(); break; }
    case 'amrap': { const d = state.active.entries[i].draft; d.amrap = !d.amrap; render(); break; }
    case 'sub-add': { const en = state.active.entries[i]; subAdd(en.draft.sub, en.draft, ex(en.ex)); render(); break; }
    case 'sub-less': { const en = state.active.entries[i], sub = en.draft.sub; if (sub && sub.more && sub.more.length) sub.more.pop(); render(); break; }
    case 'rp-timer': { const en = state.active.entries[i]; startRest(en.ex, state.settings.rpSecs || 20, 'rp'); renderRest(); render(); save(); break; }
    case 'sub-toggle': { const en = state.active.entries[i], d = en.draft, tech = t.dataset.tech; d.sub = d.sub && d.sub.tech === tech ? null : subFor(tech, d, ex(en.ex)); render(); break; }
    case 'reopen': reopenWorkout(t.dataset.id); break;
    case 'metric': state.settings.metrics[t.dataset.k] = !state.settings.metrics[t.dataset.k]; render(); break;
    case 'score-toggle': state.settings.score = !scoreOn(); save(); render(); toast(scoreOn() ? 'Athlete score is on' : (liftOn() ? 'Score off. Strength standards lead now.' : 'Score off')); break;
    case 'bw-log': { const p = state.profile; if (!p.bw) { toast('Set your body weight first'); break; } const bfEl = $('input[data-bf]'); const bf = bfEl && parseFloat(bfEl.value) ? Math.round(parseFloat(bfEl.value) * 10) / 10 : undefined; const tk = todayKey(); const ex0 = state.bodyweights.find(x => x.date === tk); const entry = {date: tk, lb: Math.round(p.bw * 10) / 10, t: Date.now()}; if (bf) entry.bf = bf; if (ex0) Object.assign(ex0, entry); else state.bodyweights.push(entry); toast('Logged ' + dispW(p.bw) + ' ' + wUnit()); render(); break; }
    case 'bw-undo': { const list = state.bodyweights.slice().sort((a, b) => a.date < b.date ? -1 : 1); const last = list[list.length - 1]; if (last) state.bodyweights = state.bodyweights.filter(x => x !== last); render(); break; }
    case 'bf-step': { const el = $('input[data-bf]'); if (el) { const v = (parseFloat(el.value) || 15) + (+t.dataset.d) * 0.5; el.value = String(Math.round(clamp(v, 3, 60) * 10) / 10); } break; }
    case 'custom-edit': sheet = {type: 'custom', ex: t.dataset.ex}; renderModal(); break;
    case 'custom-save': { const e = state.custom.find(x => x.id === t.dataset.ex); if (e) { const n = $('#cx-name').value.trim(); if (n) e.name = n; e.group = $('#cx-group').value; e.type = e.group === 'Cardio' ? 'cardio' : 'lift'; const eqEl = $('#cx-eq'); if (eqEl) e.eq = eqEl.value; e.bar = (e.type === 'lift' && (e.eq === 'barbell' || e.eq === 'trap bar')) || undefined; e.bw = $('#cx-bw').value === '1' || e.eq === 'bodyweight' || undefined; e.time = $('#cx-time').value === '1' || undefined; } closeSheet(); render(); break; }
    case 'custom-del': { const id = t.dataset.ex; if (state.ui.confirmDel !== id) { state.ui.confirmDel = id; render(); break; } const used = state.workouts.some(w => w.entries.some(en => en.ex === id)); const e = state.custom.find(x => x.id === id); if (used && e) { e.archived = true; toast('Hidden from the picker; history kept'); } else state.custom = state.custom.filter(x => x.id !== id); state.ui.confirmDel = null; render(); break; }
    case 'summary': sheet = {type: 'wsummary', id: t.dataset.id}; renderModal(); break;
    case 'share': sheet = {type: 'share', id: t.dataset.id}; renderModal(); break;
    case 'share-text': { const ta = $('#share-text'); shareTextNow(ta ? ta.value : ''); break; }
    case 'copy-text': { const ta = $('#share-text'); copyText(ta ? ta.value : ''); break; }
    case 'share-image': shareImageNow(); break;
    case 'fb-send': sendFeedback(); break;
    case 'ob-track': { const v = t.dataset.v; state.settings.track = {lift: v !== 'cardio', cardio: v !== 'lift'}; ob.i++; render(); window.scrollTo(0, 0); break; }
    case 'ob-sex': state.profile.sex = t.dataset.v || null; ob.i++; render(); window.scrollTo(0, 0); break;
    case 'ob-units': state.settings.unit = t.dataset.v; render(); break;
    case 'ob-level': state.profile.level = t.dataset.v; ob.i++; render(); window.scrollTo(0, 0); break;
    case 'ob-next': ob.i++; render(); window.scrollTo(0, 0); break;
    case 'ob-back': ob.i = Math.max(0, ob.i - 1); render(); window.scrollTo(0, 0); break;
    case 'ob-skip': obFinish(); break;
    case 'ob-start': obFinish(); break;
    case 'pick-add': { if (!state.active) break; state.active.entries.push(makeEntry(t.dataset.ex)); state.active.idx = state.active.entries.length - 1; state.ui.view = 'workout'; save(); render(); window.scrollTo(0, 0); toast(ex(t.dataset.ex).name + ' added to today'); break; }
    case 'pair': { const a = state.active, en = a && a.entries[i]; if (!en) break; if (en.pair) delete en.pair; else if (a.entries[i + 1]) en.pair = true; fixPairs(a.entries); closeSheet(); render(); save(); break; }
    case 'ritem-pair': { const r = routine(t.dataset.rid), it = r && r.items[+t.dataset.idx]; if (!it) break; if (it.pair) delete it.pair; else if (r.items[+t.dataset.idx + 1]) it.pair = true; fixPairs(r.items); renderModal(); save(); break; }
    case 'tips-open': sheet = {type: 'tips', ex: t.dataset.ex}; renderModal(); break;
    case 'exhist-open': sheet = {type: 'exhist', ex: t.dataset.ex}; renderModal(); break;
    case 'conv-open': { const en = state.active && state.active.entries[i]; sheet = {type: 'convert', i: i, lb: en && en.draft ? en.draft.w : 0}; renderModal(); break; }
    case 'pl-use': { const en = state.active && state.active.entries[i]; if (!en) break; const ps = plateState(); setDraftWeight(i, toLb(plateTotal(ps))); closeSheet(); render(); toast('Next set: ' + dispW(en.draft.w) + ' ' + wUnit()); break; }
    case 'conv-use': { const en = state.active && state.active.entries[i]; if (!en || !sheet) break; setDraftWeight(i, sheet.lb || 0); closeSheet(); render(); toast('Next set: ' + dispW(en.draft.w) + ' ' + wUnit()); break; }
    case 'conv-step': { if (!sheet || sheet.type !== 'convert') break; const u = t.dataset.u, lbIn = $('input[data-conv="lb"]'), kgIn = $('input[data-conv="kg"]'); let lb = parseFloat(lbIn.value) || 0; if (u === 'lb') lb = Math.max(0, lb + (+t.dataset.d) * 5); else lb = Math.max(0, ((parseFloat(kgIn.value) || 0) + (+t.dataset.d) * 2.5) * LB_PER_KG); sheet.lb = lb; lbIn.value = Math.round(lb * 10) / 10; kgIn.value = Math.round(lb / LB_PER_KG * 10) / 10; const uv = $('#conv-use-v'); if (uv) uv.textContent = dispW(lb); break; }
    case 'plates-open': { const en = state.active && state.active.entries[i]; const ps = plateState(); if (en && en.draft && en.draft.w) { const e = ex(en.ex); plateSetTarget(ps, Number(dispW(en.draft.w))); if (e.bar && ps.bar > Number(dispW(en.draft.w))) plateSetTarget(ps, Number(dispW(en.draft.w))); } ps.edit = false; sheet = {type: 'plates', i: i}; renderModal(); break; }
    case 'pl-step': { const ps = plateState(), inp = $('input[data-pl="w"]'); const cur = inp ? (parseFloat(inp.value) || plateTotal(ps)) : plateTotal(ps); plateSetTarget(ps, cur + (+t.dataset.d) * (isKg() ? 2.5 : 5)); patchPlates(); save(); break; }
    case 'pl-add': { const ps = plateState(); ps.load.push(+t.dataset.s); ps.target = null; patchPlates(); save(); break; }
    case 'pl-remove': { const ps = plateState(), i = ps.load.indexOf(+t.dataset.s); if (i >= 0) ps.load.splice(i, 1); ps.target = null; patchPlates(); save(); break; }
    case 'pl-clear': { const ps = plateState(); ps.load = []; ps.target = null; patchPlates(); save(); break; }
    case 'pl-edit': { const ps = plateState(); ps.edit = !ps.edit; patchPlates(); break; }
    case 'pl-size': { const ps = plateState(), s = +t.dataset.s; if (ps.off.indexOf(s) >= 0) ps.off = ps.off.filter(x => x !== s); else { ps.off.push(s); ps.load = ps.load.filter(x => x !== s); } if (ps.target !== null) plateSetTarget(ps, ps.target); patchPlates(); save(); break; }
    case 'cycle-mode': { state.cycle.on = t.dataset.v === 'order'; if (state.cycle.on && !state.cycle.start) state.cycle.start = todayKey(); save(); render(); break; }
    case 'cycle-move': { const k = +t.dataset.k, d = +t.dataset.d, s = state.cycle.seq; if (k + d < 0 || k + d >= s.length) break; const x = s[k]; s[k] = s[k + d]; s[k + d] = x; save(); render(); break; }
    case 'cycle-del': { state.cycle.seq.splice(+t.dataset.k, 1); save(); render(); break; }
    case 'plan-remove': { const d = t.dataset.d; state.plan[d] = (state.plan[d] || []).filter(x => x !== t.dataset.rid); render(); break; }
    case 'std-open': sheet = {type: 'standards'}; renderModal(); break;
    case 'std-group': state.ui.stdGroup = t.dataset.g || ''; renderModal(); save(); break;
    case 'update-routine': { const w = state.workouts.find(x => x.id === t.dataset.id), r = w && w.routine ? routine(w.routine) : null; if (!r) break; updateRoutineFromWorkout(w, r); save(); renderModal(); render(); toast(r.name + ' updated for next time'); break; }
    case 'save-routine': { const w = state.workouts.find(x => x.id === t.dataset.id); if (!w) break; const r = routineFromWorkout(w); if (!r.items.length) { state.routines.pop(); toast('Nothing logged to save'); break; } sheet = {type: 'routine', rid: r.id}; renderModal(); save(); toast('Saved under Plan. Rename it if you like.'); break; }
    case 'rec-open': sheet = {type: 'recovery', kind: t.dataset.k, min: lastRecoveryMin(t.dataset.k), temp: lastRecoveryTemp(t.dataset.k)}; renderModal(); break;
    case 'rec-tstep': { if (!sheet || sheet.type !== 'recovery') break; const inp = $('input[data-rec="temp"]'); const step = sheet.kind === 'sauna' ? (isC() ? 2 : 5) : 1, base = REC_TEMP[sheet.kind] || 150; const cur = inp && inp.value !== '' ? toF(parseFloat(inp.value)) : (sheet.temp || base - (+t.dataset.d) * (isC() ? step * 9 / 5 : step)); const next = Math.round(cur + (+t.dataset.d) * (isC() ? step * 9 / 5 : step)); sheet.temp = clamp(next, 30, 250); if (inp) inp.value = dispT(sheet.temp); break; }
    case 'rec-step': { if (!sheet || sheet.type !== 'recovery') break; const inp = $('input[data-rec="min"]'); const cur = inp ? (parseInt(inp.value, 10) || sheet.min) : sheet.min; sheet.min = clamp(cur + (+t.dataset.d), 1, 180); if (inp) inp.value = sheet.min; break; }
    case 'rec-log': { if (!sheet || sheet.type !== 'recovery') break; const inp = $('input[data-rec="min"]'), ti = $('input[data-rec="temp"]'); const min = clamp(parseInt(inp ? inp.value : sheet.min, 10) || sheet.min, 1, 180); const tv = ti && ti.value !== '' ? parseFloat(ti.value) : NaN; const temp = isNaN(tv) ? null : clamp(Math.round(toF(tv)), 30, 250); const kind = sheet.kind; const rec = {id: uid(), date: todayKey(), kind: kind, min: min, t: Date.now()}; if (temp) rec.temp = temp; state.recovery.push(rec); closeSheet(); render(); save(); toast(recKind(kind)[1] + ' logged'); break; }
    case 'rec-del': state.recovery = state.recovery.filter(r => r.id !== t.dataset.id); render(); save(); break;
    case 'ob-rec': { const k = t.dataset.v; state.settings.rec[k] = !state.settings.rec[k]; render(); break; }
    case 'ob-water': state.settings.water.on = !state.settings.water.on; render(); break;
    case 'ob-install': { const p = installPrompt; if (!p) { obFinish(); break; } installPrompt = null; p.prompt(); Promise.resolve(p.userChoice).then(() => obFinish(), () => obFinish()); break; }
    case 'ob-later': ob.i = obSteps().indexOf('how'); render(); window.scrollTo(0, 0); break;
    case 'ob-edit-routine': { const r = obRoutine(); sheet = {type: 'routine', rid: r.id, ob: true}; if (!r.items.length) sheet = {type: 'pick-ex', for: 'routine', rid: r.id, q: '', focusSearch: true}; renderModal(); break; }
    case 'ob-day': { const r = obRoutine(), d = t.dataset.v, list = state.plan[d] || (state.plan[d] = []); state.plan[d] = list.indexOf(r.id) >= 0 ? list.filter(x => x !== r.id) : list.concat([r.id]); render(); break; }
    case 'ob-sample': { const keep = {settings: Object.assign({}, state.settings, {setupDone: true}), custom: state.custom}; state = Object.assign(fresh(true), keep); ob = null; saveNow(); render(); window.scrollTo(0, 0); break; }
    case 'setup-again': state.settings.setupDone = false; startOnboarding(); break;
    case 'install': if (installPrompt) { const pr = installPrompt; installPrompt = null; pr.prompt(); pr.userChoice.then(() => render(), () => render()); } break;
    case 'a2hs-off': state.settings.a2hs = 'off'; render(); break;
    case 'backup-later': state.settings.backupSnooze = Date.now(); render(); break;
    case 'rec-kind': { const k = t.dataset.k; state.settings.rec[k] = !state.settings.rec[k]; if (!state.settings.rec[k]) state.settings.metrics[k + '7'] = false; render(); break; }
    case 'track': { const k = t.dataset.k, tr = state.settings.track; if (tr[k] && !tr[k === 'lift' ? 'cardio' : 'lift']) { toast('Keep at least one on'); break; } tr[k] = !tr[k]; const m = state.settings.metrics; if (!tr.lift) { m.lifted7 = false; m.lifted30 = false; } if (!tr.cardio) { m.run = false; m.walk = false; m.cycle = false; m.swim = false; } render(); break; }
    case 'cardio-mode': { const en = state.active.entries[i], e = ex(en.ex), d = en.draft, m = t.dataset.m; if (!d.ivl) d.ivl = ivlDefaults(e);
      if (m === 'out') { d.tm = false; d.ivl.on = false; }
      else if (m === 'tm' || m === 'steady') { if (tmEligible(e)) d.tm = true; d.ivl.on = false; }
      else { if (tmEligible(e)) d.tm = true; d.ivl.on = true; }
      if (tmEligible(e)) { state.exTm[e.id] = !!d.tm; if (d.tm) { if (!d.speed) d.speed = tmDefaultSpeed(e); d.mi = toMi(Math.round(d.speed * (d.min || 0) / 60 * 100) / 100); } }
      render(); break; }
    case 'ritem-ivl-add': { const r = routine(t.dataset.rid), it = r && r.items[+t.dataset.idx]; if (!it || !it.ivl) break; const ph = ivlPhases(it.ivl); if (ph.length >= 8) break; const last = ph[ph.length - 1]; ph.push({min: last.min, speed: last.speed, incline: Math.min(15, Math.round((last.incline + 2) * 2) / 2)}); renderModal(); save(); break; }
    case 'ritem-ivl-del': { const r = routine(t.dataset.rid), it = r && r.items[+t.dataset.idx]; if (!it || !it.ivl) break; const ph = ivlPhases(it.ivl); if (ph.length <= 2) break; ph.splice(+t.dataset.k, 1); renderModal(); save(); break; }
    case 'ivl-add': { const en = state.active.entries[i], v = en.draft.ivl, ph = ivlPhases(v); if (ph.length >= 8) break; const last = ph[ph.length - 1]; ph.push({min: last.min, speed: last.speed, incline: Math.min(15, Math.round((last.incline + 2) * 2) / 2)}); delete v.hint; render(); break; }
    case 'ivl-del': { const en = state.active.entries[i], v = en.draft.ivl, ph = ivlPhases(v); if (ph.length <= 2) break; ph.splice(+t.dataset.k, 1); delete v.hint; render(); break; }
    case 'ivl-start': { const en = state.active.entries[i]; unlockAudio(); en.run = {start: Date.now(), phase: -1}; keepAwake(true); render(); break; }
    case 'ivl-stop': { const en = state.active.entries[i]; if (en.run) logIntervals(i, runElapsed(en.run)); break; }
    case 'ivl-log': { const en = state.active.entries[i]; logIntervals(i, en.run ? runElapsed(en.run) : ivlTotalSec(en.draft.ivl)); break; }
    case 'ivl-cancel': { const en = state.active.entries[i]; delete en.run; const hr = $('#hrest'); if (hr) hr.textContent = ''; render(); break; }
    case 'day': { const k = t.dataset.k; selDay = k === todayKey() ? null : k; weekBack = clamp(Math.round((dateOf(weekStart(todayKey())) - dateOf(weekStart(k))) / (7 * 86400000)), 0, weeksBack()); render(); break; }
    case 'day-today': selDay = null; weekBack = 0; render(); break;
    case 'week-move': moveWeek(+t.dataset.d); break;
    case 'fb-again': fbSent = null; render(); break;
    case 'hist-open': state.ui.view = 'history'; state.ui.openHist = t.dataset.id; render(); window.scrollTo(0, 0); break;
    case 'step': if (t._held && !e.isTrusted) {} else if (t._held) { break; } stepDraft(i, t.dataset.f, +t.dataset.d); break;
    case 'log': logSet(i); break;
    case 'del-set': state.active.entries[i].sets.splice(+t.dataset.s, 1); render(); break;
    case 'remove-entry': removeEntry(i); break;
    case 'add-ex': sheet = {type: 'pick-ex', for: 'active', q: '', focusSearch: true}; renderModal(); break;
    case 'swap-ex': sheet = {type: 'pick-ex', for: 'swap', i: i, q: '', focusSearch: true}; renderModal(); break;
    case 'add-ex-routine': sheet = {type: 'pick-ex', for: 'routine', rid: t.dataset.rid, q: '', focusSearch: true}; renderModal(); break;
    case 'back-routine': sheet = {type: 'routine', rid: sheet.rid}; renderModal(); break;
    case 'ex-group': if (sheet) { sheet.g = t.dataset.g; $$('[data-act="ex-group"]').forEach(c => c.classList.toggle('on', c.dataset.g === sheet.g)); const list = $('#exlist'); if (list) { list.innerHTML = exListHTML(); list.scrollTop = 0; } t.scrollIntoView({inline: 'center', block: 'nearest', behavior: 'smooth'}); } break;
    case 'pick-ex': pickExercise(t.dataset.ex); break;
    case 'create-ex': createExercise(); break;
    case 'finish': finish(); break;
    case 'discard': state.active = null; state.timer = null; keepAwake(false); closeSheet(); state.ui.view = 'today'; render(); break;
    case 'rest-add': if (state.timer) { state.timer.end = Math.max(state.timer.end, Date.now()) + 30000; state.timer.total += 30; state.timer.fired = false; renderRest(); save(); } break;
    case 'rest-skip': state.timer = null; renderRest(); save(); break;
    case 'hist': state.ui.openHist = state.ui.openHist === t.dataset.id ? null : t.dataset.id; state.ui.confirmDel = null; render(); break;
    case 'del-workout':
      if (state.ui.confirmDel === t.dataset.id) { state.workouts = state.workouts.filter(w => w.id !== t.dataset.id); state.deleted.w[t.dataset.id] = Date.now(); assignPRs(state.workouts); state.ui.confirmDel = null; state.ui.openHist = null; toast('Workout deleted'); }
      else state.ui.confirmDel = t.dataset.id;
      render(); break;
    case 'prog-ex': state.ui.progEx = t.dataset.ex; render(); break;
    case 'new-routine': { const r = {id: uid(), name: 'New routine', items: []}; state.routines.push(r); sheet = {type: 'routine', rid: r.id}; renderModal(); save(); break; }
    case 'edit-routine': sheet = {type: 'routine', rid: t.dataset.rid}; renderModal(); break;
    case 'add-template': {
      const selEl = $('#tpl'), src = routine(selEl && selEl.value); if (!src) { toast('Pick one of your routines first'); break; }
      const base = src.name.replace(/ copy( \d+)?$/, '') + ' copy', names = state.routines.map(x => x.name); let name = base, n = 2; while (names.indexOf(name) >= 0) name = base + ' ' + n++;
      const r = {id: uid(), name: name, items: src.items.map(it => JSON.parse(JSON.stringify(it)))}; state.routines.push(r); sheet = {type: 'routine', rid: r.id}; render(); renderModal(); save(); toast('Copied. Rename it and change what you like.'); break; }
    case 'del-item': { const r = routine(t.dataset.rid); if (r) { r.items.splice(+t.dataset.idx, 1); renderModal(); save(); } break; }
    case 'del-routine': {
      const rid = t.dataset.rid; if (sheet.confirm !== rid) { sheet.confirm = rid; renderModal(); break; }
      state.routines = state.routines.filter(r => r.id !== rid); state.deleted.r[rid] = Date.now(); for (const d in state.plan) state.plan[d] = (state.plan[d] || []).filter(x => x !== rid);
      closeSheet(); render(); break; }
    case 'close': closeSheet(); render(); break;
    case 'backup': sheet = {type: 'backup', mode: 'export'}; renderModal(); break;
    case 'restore': sheet = {type: 'backup', mode: 'import'}; renderModal(); break;
    case 'copy-backup': copyBackup(); break;
    case 'do-restore': doRestore(); break;
    case 'bw-step': if (t._held && e.isTrusted) break; { const p = state.profile; const cur = p.bw || (isKg() ? 80 * LB_PER_KG : 180); p.bw = toLb(Math.max(0, Number(dispW(cur)) + (+t.dataset.d) * (isKg() ? 0.5 : 1))); const inp = $('input[data-bw]'); if (inp) inp.value = dispW(p.bw); save(); break; }
    case 'calc-step': if (t._held && e.isTrusted) break; { const c = state.ui.calc; if (!c) break; if (t.dataset.f === 'w') c.w = toLb(Math.max(0, Number(dispW(c.w)) + (+t.dataset.d) * wStep())); else c.r = clamp(Math.round(c.r + (+t.dataset.d)), 1, 30); const inp = $('input[data-calc="' + t.dataset.f + '"]'); if (inp) inp.value = t.dataset.f === 'w' ? dispW(c.w) : String(c.r); patchCalc(); save(); break; }
    case 'clear-ask': sheet = {type: 'clear'}; renderModal(); break;
    case 'clear-yes': state = fresh(false); saveNow(); closeSheet(); startOnboarding(); toast('Cleared'); break;
    case 'fresh-ask': sheet = {type: 'fresh'}; renderModal(); break;
    case 'fresh-yes': { const keep = {settings: Object.assign({}, state.settings, {setupDone: false}), custom: state.custom, profile: state.profile}; state = Object.assign(fresh(false), keep); saveNow(); closeSheet(); startOnboarding(); break; }
    case 'summary-done': closeSheet(); break;
  }
});
let weeksT = null;
app.addEventListener('scroll', e => { if (e.target && e.target.id === 'weeks') { clearTimeout(weeksT); weeksT = setTimeout(() => onWeeksScroll(e.target), 90); } }, true);
app.addEventListener('change', e => {
  if (e.target.dataset && e.target.dataset.wgoal) { const v = volToOz(parseFloat(e.target.value) || 0); state.settings.water.goal = v ? clamp(v, 16, 400) : 0; save(); render(); return; }
  const el = e.target;
  if (el.dataset.pl === 'bar') { const ps = plateState(); ps.bar = +el.value; if (ps.target !== null) plateSetTarget(ps, ps.target); patchPlates(); save(); return; }
  if (el.id === 'std-sort') { state.ui.stdSort = el.value; renderModal(); save(); return; }
  if (el.id === 'fb-type') { if (!state.ui.fb) state.ui.fb = {type: 'feature', msg: '', name: '', email: ''}; state.ui.fb.type = el.value; save(); return; }
  if (el.dataset.cycleAdd !== undefined) { if (el.value) { state.cycle.seq.push(el.value === 'rest' ? [] : [el.value]); if (!state.cycle.start) state.cycle.start = todayKey(); save(); render(); } return; }
  if (el.dataset.cycleToday !== undefined) { const k = +el.value; state.cycle.start = keyOf(addDays(new Date(), -k)); save(); render(); toast('Today is day ' + (k + 1)); return; }
  if (el.dataset.planAdd !== undefined) { const d = el.dataset.planAdd; if (el.value) { const list = state.plan[d] || (state.plan[d] = []); if (list.indexOf(el.value) < 0) list.push(el.value); } render(); return; }
  if (el.dataset.set) {
    const k = el.dataset.set;
    if (k === 'unit') state.settings.unit = el.value;
    else if (k === 'rest') state.settings.rest = +el.value;
    else if (k === 'alert') { state.settings.sound = el.value === 'both' || el.value === 'sound'; state.settings.vibrate = el.value === 'both' || el.value === 'vibrate'; syncRestAlert(); }
    else if (k === 'tone') { state.settings.tone = TONES.some(t => t.id === el.value) ? el.value : 'chime'; unlockAudio(); beep(); syncRestAlert(); }
    else if (k === 'bwReminderDays') state.settings.bwReminderDays = +el.value;
    else if (k === 'wuRest') state.settings.wuRest = +el.value;
    else if (k === 'tempUnit') state.settings.tempUnit = el.value;
    else if (k === 'goalDays') state.settings.goalDays = +el.value;
    else if (k === 'rpSecs') state.settings.rpSecs = +el.value;
    else if (k === 'showBf') state.settings.showBf = el.value === '1';
    render(); return;
  }
  if (el.dataset.ritem) { const r = routine(el.dataset.rid); const it = r && r.items[+el.dataset.idx]; if (it) {
    const k = el.dataset.ritem, e = ex(it.ex);
    if (k === 'reps') { if (el.value === 'fail') { it.fail = true; renderModal(); save(); return; } delete it.fail; }
    if (k === 'tm') { it.tm = el.value === '1'; if (!it.tm) delete it.ivl; renderModal(); save(); return; }
    if (k === 'ivlon') { if (el.value === '1') { const v = ivlDefaults(e); it.ivl = {ph: v.ph, rounds: v.rounds}; } else delete it.ivl; renderModal(); save(); return; }
    if (k === 'speed' || k === 'incline') { it[k] = +el.value; renderModal(); save(); return; }
    if (k === 'load') { it.load = toLb(+el.value); renderModal(); save(); return; }
    if (k === 'rounds') { if (it.ivl) it.ivl.rounds = +el.value; renderModal(); save(); return; }
    if (k.indexOf('ph.') === 0) { const path = k.split('.'), ph = it.ivl && ivlPhases(it.ivl)[+path[1]]; if (ph) ph[path[2]] = +el.value; renderModal(); save(); return; }
    it[el.dataset.ritem] = +el.value; if (it.hi !== undefined && it.hi !== 99 && it.hi < it.reps) it.hi = it.reps; if (el.dataset.ritem === 'reps' && (it.hi === undefined || (it.hi !== 99 && it.hi < it.reps))) it.hi = it.reps; renderModal(); save(); } return; }
  if (el.dataset.ivl) { const en = state.active && state.active.entries[+el.dataset.i]; if (!en || !en.draft.ivl) return; const v = en.draft.ivl, path = el.dataset.ivl.split('.'); if (path[0] === 'ph') { const ph = ivlPhases(v)[+path[1]]; if (ph) ph[path[2]] = +el.value; } else v[path[0]] = +el.value; delete v.hint; const sum = $('#ivl-sum-' + el.dataset.i); if (sum) sum.innerHTML = ivlSummary(v); const btn = $('[data-act="ivl-start"][data-i="' + el.dataset.i + '"]'); if (btn) btn.textContent = 'Start intervals · ' + mmss(ivlTotalSec(v)); save(); return; }
  if (el.dataset.exrest) { state.exRest[el.dataset.exrest] = +el.value; save(); return; }
  if (el.dataset.wurest) { state.exWuRest[el.dataset.wurest] = +el.value; save(); return; }
  if (el.id === 'newgroup' && sheet) { sheet.newGroup = el.value; sheet.newEq = null; const eqSel = $('#neweq'); if (eqSel) eqSel.innerHTML = (el.value === 'Cardio' ? CARDIO_EQ : LIFT_EQ).map(x => '<option value="' + x[0] + '">' + x[1] + '</option>').join(''); return; }
  if (el.id === 'neweq' && sheet) { sheet.newEq = el.value; return; }
  if (el.dataset.tempo !== undefined) { if (el.value) state.exTempo[el.dataset.tempo] = el.value; else delete state.exTempo[el.dataset.tempo]; save(); return; }
  if (el.dataset.techsel !== undefined) { const en = state.active && state.active.entries[+el.dataset.techsel]; if (!en) return; const d = en.draft; d.sub = subFor(el.value, d, ex(en.ex)); save(); return; }
  if (el.dataset.prof) {
    const k = el.dataset.prof, p = state.profile;
    if (k === 'age') p.age = el.value ? +el.value : null;
    else if (k === 'heightcm') p.height = el.value ? Math.round(+el.value / 2.54) : null;
    else if (k === 'heightft' || k === 'heightin') { const ft = k === 'heightft' ? el.value : $('select[data-prof="heightft"]').value, inch = k === 'heightin' ? el.value : $('select[data-prof="heightin"]').value; p.height = ft ? (+ft) * 12 + (+inch || 0) : null; }
    else p[k] = el.value || null;
    render(); return;
  }
  if (el.dataset.bw) { if (!ob) setTimeout(render, 300); return; }  /* deferred so a tap that blurred the field still lands; nothing on the setup screen depends on it */
  if (el.dataset.calc) { const c = state.ui.calc; if (c) el.value = el.dataset.calc === 'w' ? dispW(c.w) : String(c.r); return; }
  if (el.dataset.bind) { const en = state.active && state.active.entries[+el.dataset.i]; if (!en) return; const f = el.dataset.bind; el.value = f === 'w' ? dispW(en.draft.w) : f === 'load' ? dispW(en.draft.load || 0) : f === 'mi' ? dispD(en.draft.mi) : f.indexOf('sw') === 0 || f.indexOf('sr') === 0 ? subValue(en.draft, f) : String(en.draft[f] || 0); }
});
app.addEventListener('input', e => {
  const el = e.target;
  if (el.dataset.bind) {
    const en = state.active && state.active.entries[+el.dataset.i]; if (!en) return;
    const v = parseFloat(el.value); if (isNaN(v)) return; const f = el.dataset.bind;
    if (f === 'w') en.draft.w = Math.max(0, toLb(v)); else if (f === 'load') en.draft.load = Math.max(0, toLb(v)); else if (f === 'mi') en.draft.mi = Math.max(0, toMi(v)); else if (f.indexOf('sw') === 0 || f.indexOf('sr') === 0) { const st = subStages(en.draft.sub), s = st[+(f.split('.')[1] || 0)]; if (s) { if (f.indexOf('sw') === 0) { s.w = Math.max(0, toLb(v)); s.manualW = true; } else { s.r = Math.max(0, Math.round(v)); s.manualR = true; } subRefresh(en.draft.sub, en.draft, ex(en.ex)); subStages(en.draft.sub).forEach((x, k) => { if (x === s) return; const suf = k ? '.' + k : ''; const wi = $('input[data-bind="sw' + suf + '"][data-i="' + el.dataset.i + '"]'), ri = $('input[data-bind="sr' + suf + '"][data-i="' + el.dataset.i + '"]'); if (wi) wi.value = dispW(x.w); if (ri) ri.value = String(x.r); }); } } else en.draft[f] = Math.max(0, v);
    if ((f === 'speed' || f === 'min') && en.draft.speed) en.draft.mi = toMi(Math.round(en.draft.speed * (en.draft.min || 0) / 60 * 100) / 100);
    if (f === 'w' || f === 'r') { refreshWarmups(+el.dataset.i); if (en.draft.sub) { subRefresh(en.draft.sub, en.draft, ex(en.ex)); subStages(en.draft.sub).forEach((x, k) => { const suf = k ? '.' + k : ''; const wi = $('input[data-bind="sw' + suf + '"][data-i="' + el.dataset.i + '"]'), ri = $('input[data-bind="sr' + suf + '"][data-i="' + el.dataset.i + '"]'); if (wi) wi.value = dispW(x.w); if (ri) ri.value = String(x.r); }); } }
    patchLine(+el.dataset.i); save(); return;
  }
  if (el.dataset.conv) { if (!sheet || sheet.type !== 'convert') return; const v = parseFloat(el.value); if (isNaN(v)) return; const lb = el.dataset.conv === 'lb' ? v : v * LB_PER_KG; sheet.lb = lb; const other = $('input[data-conv="' + (el.dataset.conv === 'lb' ? 'kg' : 'lb') + '"]'); if (other) other.value = Math.round((el.dataset.conv === 'lb' ? v / LB_PER_KG : v * LB_PER_KG) * 10) / 10; const uv = $('#conv-use-v'); if (uv) uv.textContent = dispW(lb); return; }
  if (el.dataset.pl === 'w') { const v = parseFloat(el.value); if (!isNaN(v)) { plateSetTarget(plateState(), v); patchPlatesOut(); save(); } return; }
  if (el.dataset.wu) { const en = state.active && state.active.entries[+el.dataset.i], row = en && en.wuRows && en.wuRows[+el.dataset.k]; if (row) { const v = parseFloat(el.value); if (!isNaN(v)) { if (el.dataset.wu === 'w') row.w = Math.max(0, toLb(v)); else row.r = Math.max(1, Math.round(v)); row.manual = true; save(); } } return; }
  if (el.dataset.rname !== undefined) { const r = routine(el.dataset.rname); if (r) { r.name = el.value; save(); } return; }
  if (el.dataset.bw) { const v = parseFloat(el.value); state.profile.bw = isNaN(v) || v <= 0 ? null : toLb(v); save(); return; }
  if (el.dataset.calc) { const c = state.ui.calc; const v = parseFloat(el.value); if (!c || isNaN(v)) return; if (el.dataset.calc === 'w') c.w = Math.max(0, toLb(v)); else c.r = clamp(Math.round(v), 1, 30); patchCalc(); save(); return; }
  if (el.id === 'exsearch' && sheet) { sheet.q = el.value; const list = $('#exlist'); if (list) { list.innerHTML = exListHTML(); list.scrollTop = 0; } }
  if (el.id === 'fb-msg' || el.id === 'fb-name' || el.id === 'fb-email') { if (!state.ui.fb) state.ui.fb = {type: 'feature', msg: '', name: '', email: ''}; state.ui.fb[el.id.slice(3)] = el.value; save(); }
});
app.addEventListener('focusin', e => { const el = e.target; if (el.tagName === 'INPUT' && (el.dataset.bind || el.dataset.wu || el.dataset.bw || el.dataset.calc)) { setTimeout(() => { try { el.select(); } catch (x) {} }, 0); } });
app.addEventListener('keydown', e => {
  if (e.key === 'Enter' && e.target.dataset && e.target.dataset.bind) { e.preventDefault(); e.target.blur(); }
  if (e.key === 'Escape' && sheet) { closeSheet(); render(); }
});
/* ---------- drag to reorder: routine editor rows and the workout list ---------- */
let drag = null, justDragged = false;
app.addEventListener('pointerdown', e => {
  const grip = e.target.closest('[data-grip]'); if (!grip || e.button > 0) return;
  const item = grip.closest('[data-sort]'); if (!item) return;
  e.preventDefault();
  const scroller = item.closest('.sheet') || document.scrollingElement || document.documentElement;
  drag = {el: item, list: item.dataset.sort, from: +item.dataset.si, y0: e.clientY, y: e.clientY, s0: scroller.scrollTop, scroller: scroller, moved: false, raf: null};
  item.classList.add('dragging'); document.body.classList.add('dragging-body');
  try { grip.setPointerCapture(e.pointerId); } catch (x) {}
  const tick = () => { if (!drag) return; const H = window.innerHeight; if (drag.y < 90) drag.scroller.scrollTop -= 8; else if (drag.y > H - 90) drag.scroller.scrollTop += 8; applyDrag(); drag.raf = requestAnimationFrame(tick); };
  drag.raf = requestAnimationFrame(tick);
});
function dragItems(d){ return $$('[data-sort="' + d.list + '"]'); }
function applyDrag(){
  const d = drag; if (!d) return;
  d.el.style.transform = 'translateY(' + ((d.y - d.y0) + (d.scroller.scrollTop - d.s0)) + 'px)';
  const items = dragItems(d), i = items.indexOf(d.el), r = d.el.getBoundingClientRect(), mid = r.top + r.height / 2;
  const prev = items[i - 1], next = items[i + 1];
  if (prev) { const pr = prev.getBoundingClientRect(); if (mid < pr.top + pr.height / 2) { moveDom(d, prev, true); return; } }
  if (next) { const nr = next.getBoundingClientRect(); if (mid > nr.top + nr.height / 2) moveDom(d, next, false); }
}
function moveDom(d, other, before){
  const b = d.el.getBoundingClientRect().top;
  other.parentNode.insertBefore(d.el, before ? other : other.nextSibling);
  d.y0 += d.el.getBoundingClientRect().top - b; d.moved = true;
  d.el.style.transform = 'translateY(' + ((d.y - d.y0) + (d.scroller.scrollTop - d.s0)) + 'px)';
}
window.addEventListener('pointermove', e => { if (!drag) return; drag.y = e.clientY; if (Math.abs(e.clientY - drag.y0) > 3) drag.moved = true; applyDrag(); }, {passive: true});
function endDrag(){
  const d = drag; if (!d) return; drag = null; cancelAnimationFrame(d.raf);
  d.el.classList.remove('dragging'); d.el.style.transform = ''; document.body.classList.remove('dragging-body');
  if (d.moved) { justDragged = true; setTimeout(() => { justDragged = false; }, 400); }
  const to = dragItems(d).indexOf(d.el);
  if (to >= 0 && to !== d.from) commitReorder(d.list, d.from, to); else if (d.moved) { if (sheet && d.list.indexOf('routine:') === 0) renderModal(); else render(); }
}
['pointerup', 'pointercancel'].forEach(ev => window.addEventListener(ev, endDrag, true));
function commitReorder(list, from, to){
  if (list === 'workout') { const a = state.active; if (!a) return; const cur = a.entries[a.idx]; a.entries.splice(to, 0, a.entries.splice(from, 1)[0]); fixPairs(a.entries); a.idx = Math.max(0, a.entries.indexOf(cur)); render(); return; }
  if (list.indexOf('routine:') === 0) { const r = routine(list.slice(8)); if (!r) return; r.items.splice(to, 0, r.items.splice(from, 1)[0]); fixPairs(r.items); save(); renderModal(); }
}
/* Swipe between the main screens. A swipe that starts on something that scrolls sideways (the week strip, chip rows, the standards box) is left alone. */
const TAB_ORDER = ['today', 'history', 'progress', 'plan', 'you'];
let swipe = null;
app.addEventListener('touchstart', e => {
  if (e.touches.length !== 1 || sheet || ob || state.ui.view === 'workout') { swipe = null; return; }
  const t = e.touches[0], el = e.target;
  if (el.closest('.weeks, .chips, .toggles, .stdbox, .obdays, input, select, textarea, [data-sort], .stepper')) { swipe = null; return; }
  swipe = {x: t.clientX, y: t.clientY, t: Date.now()};
}, {passive: true});
app.addEventListener('touchend', e => {
  if (!swipe) return; const s = swipe; swipe = null;
  const t = e.changedTouches[0]; if (!t) return;
  const dx = t.clientX - s.x, dy = t.clientY - s.y;
  if (Date.now() - s.t > 700 || Math.abs(dx) < 70 || Math.abs(dy) > 60 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
  const k = TAB_ORDER.indexOf(state.ui.view); if (k < 0) return;
  const next = TAB_ORDER[k + (dx < 0 ? 1 : -1)]; if (!next) return;
  state.ui.view = next; state.ui.confirmDel = null; render(); window.scrollTo(0, 0);
}, {passive: true});
let holdT = null, holdI = null, heldBtn = null;
app.addEventListener('pointerdown', e => {
  const b = e.target.closest('[data-act="step"],[data-act="bw-step"],[data-act="calc-step"]'); if (!b) return;
  clearTimeout(holdT); clearInterval(holdI);
  const fire = () => { if (b.dataset.act === 'step') stepDraft(+b.dataset.i, b.dataset.f, +b.dataset.d); else b.dispatchEvent(new MouseEvent('click', {bubbles: true})); };
  holdT = setTimeout(() => { heldBtn = b; b._held = true; fire(); holdI = setInterval(fire, 110); }, 420);
});
function stopHold(){ clearTimeout(holdT); clearInterval(holdI); if (heldBtn) { const hb = heldBtn; heldBtn = null; setTimeout(() => { hb._held = false; }, 400); } }
['pointerup', 'pointercancel'].forEach(ev => window.addEventListener(ev, stopHold, true));
app.addEventListener('pointerleave', stopHold, true);
app.addEventListener('contextmenu', e => { if (e.target.closest('.stepper')) e.preventDefault(); });

/* ---------- clock ---------- */
setInterval(() => {
  const a = state.active;
  if (a) { const el = $('#elapsed'); if (el) el.textContent = hms(elapsedSec(a)); if (state.ui.view === 'workout') tickIntervals(a); }
  if (state.timer) {
    const t = state.timer;
    if (a && a.pausedAt) { t.end += 500; const hr = $('#hrest'); if (hr) hr.textContent = 'Paused'; return; }
    const left = (t.end - Date.now()) / 1000, over = left <= 0;
    if (over && !t.fired) { t.fired = true; t.firedAt = Date.now(); beep(); buzz(); renderRest(); save(); }
    else if (over && Date.now() > (t.firedAt || t.end) + 4000) { renderRest(); const hr = $('#hrest'); if (hr) hr.textContent = ''; }
    else { const te = $('#rest-t'); if (te) te.textContent = over ? 'Go' : mmss(left); const f = $('#rest-fill'); if (f) f.style.width = clamp(100 * (1 - Math.max(0, left) / t.total), 0, 100) + '%'; const hr = $('#hrest'); if (hr) hr.textContent = over ? 'Rest done' : 'Rest ' + mmss(left); }
  }
}, 500);

/* ---------- account and sync ----------
   One row per account holds the whole log as JSON. This phone stays the source of truth: a few seconds after any change the log is pushed,
   and opening the app pulls whatever another phone pushed. Workouts, weigh-ins and recovery are merged by id, so nothing logged is lost;
   deletes travel as tombstones; for everything else the newest copy wins. */
const SYNC = {url: SYNC_URL, key: SYNC_KEY}, AUTH_KEY = 'setlist.auth';
let auth = null; try { auth = JSON.parse(localStorage.getItem(AUTH_KEY) || 'null'); } catch (e) {}
const syncReady = () => !!(SYNC.url && SYNC.key), signedIn = () => !!(auth && auth.refresh);
const syncUi = {busy: false, error: '', last: 0, msg: ''}; let acctDraft = {email: ''};
function setAuth(a){ auth = a; try { if (a) localStorage.setItem(AUTH_KEY, JSON.stringify(a)); else localStorage.removeItem(AUTH_KEY); } catch (e) {} }
function sessionFrom(j){ if (!j || !j.access_token) return null; return {access: j.access_token, refresh: j.refresh_token, email: j.user && j.user.email, uid: j.user && j.user.id, exp: Date.now() + (j.expires_in || 3600) * 1000}; }
async function authFetch(path, opts, retried){
  opts = opts || {}; const headers = Object.assign({apikey: SYNC.key, 'Content-Type': 'application/json'}, opts.headers || {});
  if (auth && auth.access) headers.Authorization = 'Bearer ' + auth.access;
  const res = await fetch(SYNC.url + path, Object.assign({}, opts, {headers: headers}));
  if (res.status === 401 && auth && auth.refresh && !retried) { if (await refreshAuth()) return authFetch(path, opts, true); }
  return res;
}
async function refreshAuth(){
  try {
    const res = await fetch(SYNC.url + '/auth/v1/token?grant_type=refresh_token', {method: 'POST', headers: {apikey: SYNC.key, 'Content-Type': 'application/json'}, body: JSON.stringify({refresh_token: auth.refresh})});
    if (!res.ok) { if (res.status === 400 || res.status === 401 || res.status === 403) { setAuth(null); patchSyncLine(); } return false; }
    const j = await res.json(), s = sessionFrom(j); if (!s) return false; s.email = s.email || auth.email; s.uid = s.uid || auth.uid; setAuth(s); return true;
  } catch (e) { return false; }
}
async function authCall(path, body){
  const res = await fetch(SYNC.url + path, {method: 'POST', headers: {apikey: SYNC.key, 'Content-Type': 'application/json'}, body: JSON.stringify(body)});
  let j = null; try { j = await res.json(); } catch (e) {}
  if (!res.ok) { const m = j && (j.msg || j.error_description || j.message || j.error); throw new Error(m ? String(m) : 'Could not reach the account service (' + res.status + ')'); }
  return j;
}
async function signUp(email, pw){ const j = await authCall('/auth/v1/signup', {email: email, password: pw}); const s = sessionFrom(j); if (!s) throw new Error('Account created. Check your email to confirm it, then sign in.'); setAuth(s); }
async function signIn(email, pw){ const j = await authCall('/auth/v1/token?grant_type=password', {email: email, password: pw}); const s = sessionFrom(j); if (!s) throw new Error('Sign in failed'); setAuth(s); }
async function forgotPassword(email){ await authCall('/auth/v1/recover', {email: email}); }
async function setPassword(pw){ const res = await authFetch('/auth/v1/user', {method: 'PUT', body: JSON.stringify({password: pw})}); if (!res.ok) throw new Error('Could not set the new password. Ask for a fresh reset link.'); }
async function signOut(){
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
}

/* The document that travels: everything but screen state, the live workout, the rest timer and the sync bookkeeping. */
function syncDoc(){ const s = Object.assign({}, state, {active: null, timer: null}); delete s.ui; delete s.sync; return s; }
function sigOf(str){ let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return str.length + ':' + (h >>> 0); }
function saveLocal(){ try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }
let pushT = null, pushing = false, pushAgain = false, lastPushedSig = '';
function schedulePush(){ if (!signedIn() || !syncReady()) return; clearTimeout(pushT); pushT = setTimeout(syncPush, 2500); }
async function syncPush(){
  if (!signedIn() || !syncReady() || navigator.onLine === false) return false; if (pushing) { pushAgain = true; return false; }
  if (state.sample) return true;
  const str = JSON.stringify(syncDoc()), sig = sigOf(str); if (sig === lastPushedSig) return true;
  pushing = true; syncUi.busy = true; syncUi.error = ''; patchSyncLine();
  let ok = false;
  try {
    const rev = Date.now();
    const res = await authFetch('/rest/v1/bearing_state', {method: 'POST', headers: {Prefer: 'resolution=merge-duplicates,return=minimal'}, body: '[{"user_id":' + JSON.stringify(auth.uid) + ',"rev":' + rev + ',"updated_at":' + JSON.stringify(new Date(rev).toISOString()) + ',"doc":' + str + '}]'});
    if (!res.ok) throw new Error('push ' + res.status);
    state.sync = {rev: rev}; lastPushedSig = sig; syncUi.last = rev; saveLocal(); ok = true;
  } catch (e) { syncUi.error = signedIn() ? 'Could not sync just now. It will try again.' : 'Signed out. Sign in again to keep syncing.'; }
  pushing = false; syncUi.busy = false; patchSyncLine();
  if (pushAgain) { pushAgain = false; schedulePush(); }
  return ok;
}
async function syncPull(opts){
  opts = opts || {}; if (!signedIn() || !syncReady() || navigator.onLine === false) return false;
  syncUi.busy = true; syncUi.error = ''; patchSyncLine();
  let ok = false;
  try {
    const res = await authFetch('/rest/v1/bearing_state?select=doc,rev&user_id=eq.' + encodeURIComponent(auth.uid), {headers: {Accept: 'application/json'}});
    if (!res.ok) throw new Error('pull ' + res.status);
    const rows = await res.json(), row = Array.isArray(rows) ? rows[0] : null;
    if (!row || !row.doc) { if (!state.sample && (state.workouts.length || state.routines.length || state.settings.setupDone)) schedulePush(); ok = true; }
    else {
      const remoteRev = row.rev || 0;
      if (remoteRev > ((state.sync && state.sync.rev) || 0) || opts.force) {
        const remote = normalizeState(typeof row.doc === 'string' ? JSON.parse(row.doc) : row.doc);
        if (!remote) throw new Error('bad doc');
        const remoteSig = sigOf(JSON.stringify(Object.assign({}, remote, {ui: undefined, sync: undefined, active: null, timer: null})));
        const merged = mergeStates(state.sample ? fresh(false) : state, remote), keepUi = state.ui, keepActive = state.active, keepTimer = state.timer;
        state = merged; state.ui = keepUi; state.active = keepActive; state.timer = keepTimer; state.sync = {rev: remoteRev}; state.sample = false;
        if (state.settings.setupDone) ob = null;
        assignPRs(state.workouts); saveLocal(); syncUi.last = Date.now(); lastPushedSig = remoteSig; render(); renderModal();
        if (opts.toast) toast('Synced: ' + state.workouts.length + ' workout' + (state.workouts.length === 1 ? '' : 's'));
        if (sigOf(JSON.stringify(syncDoc())) !== remoteSig) schedulePush();
      } else syncUi.last = Date.now();
      ok = true;
    }
  } catch (e) { syncUi.error = 'Could not reach your account just now.'; }
  syncUi.busy = false; patchSyncLine();
  return ok;
}
/* Server copy wins, except that anything logged only on this phone is kept and anything deleted anywhere stays deleted. */
function mergeStates(local, remote){
  const out = remote, dead = Object.assign({}, (local.deleted || {}).w, (remote.deleted || {}).w), deadR = Object.assign({}, (local.deleted || {}).r, (remote.deleted || {}).r);
  out.deleted = {w: dead, r: deadR};
  const union = (dst, src, keyOf) => { const have = {}; dst.forEach(x => { have[keyOf(x)] = 1; }); (src || []).forEach(x => { if (!have[keyOf(x)]) { dst.push(x); have[keyOf(x)] = 1; } }); };
  out.workouts = (out.workouts || []).filter(w => !dead[w.id]); union(out.workouts, (local.workouts || []).filter(w => !dead[w.id]), w => w.id); out.workouts.sort((a, b) => a.start - b.start);
  out.routines = (out.routines || []).filter(r => !deadR[r.id]); union(out.routines, (local.routines || []).filter(r => !deadR[r.id]), r => r.id);
  out.custom = out.custom || []; union(out.custom, local.custom, e => e.id);
  out.recovery = out.recovery || []; union(out.recovery, local.recovery, r => r.id);
  out.bodyweights = out.bodyweights || []; union(out.bodyweights, local.bodyweights, x => x.date + ':' + (x.t || 0)); out.bodyweights.sort((a, b) => a.date < b.date ? -1 : 1);
  out.water = out.water || {}; for (const d in (local.water || {})) { out.water[d] = out.water[d] || []; union(out.water[d], local.water[d], x => String(x.t)); }
  if (local.since && (!out.since || local.since < out.since)) out.since = local.since;
  return out;
}
function syncLine(){
  if (!signedIn()) return syncUi.error ? '<span style="color:var(--bad)">' + esc(syncUi.error) + '</span>' : '';
  if (syncUi.busy) return 'Syncing…'; if (syncUi.error) return '<span style="color:var(--bad)">' + esc(syncUi.error) + '</span>';
  const at = syncUi.last || (state.sync && state.sync.rev) || 0; return at ? 'Last synced ' + relTime(at) + '.' : 'Not synced yet.';
}
function relTime(t){ const s = Math.round((Date.now() - t) / 1000); return s < 10 ? 'just now' : s < 60 ? s + ' s ago' : s < 3600 ? Math.round(s / 60) + ' min ago' : s < 86400 ? Math.round(s / 3600) + ' h ago' : Math.round(s / 86400) + ' d ago'; }
function patchSyncLine(){ const el = $('#syncline'); if (el) el.innerHTML = syncLine(); const b = $('[data-act="sync-now"]'); if (b) b.textContent = syncUi.busy ? 'Syncing…' : 'Sync now'; }
function accountForm(compact){
  return '<input class="input" id="acct-email" type="email" inputmode="email" autocomplete="email" autocapitalize="none" placeholder="Email" value="' + esc(acctDraft.email) + '" style="margin-bottom:8px"><input class="input" id="acct-pw" type="password" autocomplete="current-password" placeholder="Password, 8 or more characters" style="margin-bottom:10px">' +
    '<div class="row" style="gap:8px"><button class="btn grow" data-act="sign-in">Sign in</button><button class="btn grow" data-act="sign-up">Create account</button></div>' +
    '<div class="between" style="margin-top:8px"><button class="btn link small" data-act="forgot-pw">Forgot password?</button>' + (compact ? '' : '<span></span>') + '</div><div class="small" id="syncline" style="margin-top:8px">' + syncLine() + '</div>';
}
function accountCard(){
  if (!syncReady()) return '';
  if (signedIn()) return '<div class="card"><div class="h3" style="margin-bottom:6px">Account</div><p class="small muted" style="margin:0 0 10px">Signed in as <b>' + esc(auth.email || '') + '</b>. Every change is saved to your account a few seconds later, so a new phone, a reinstall or a cleared browser gets everything back.</p><div class="small" id="syncline">' + syncLine() + '</div><div class="row" style="margin-top:10px;gap:8px"><button class="btn grow" data-act="sync-now">' + (syncUi.busy ? 'Syncing…' : 'Sync now') + '</button><button class="btn grow ghost" data-act="sign-out">Sign out</button></div><div style="margin-top:10px"><button class="btn link small danger" data-act="acct-delete-ask">Delete my account</button></div></div>';
  return '<div class="card"><div class="h3" style="margin-bottom:6px">Account</div><p class="small muted" style="margin:0 0 10px">Sign in once and your log is saved to your account, so a new phone, a reinstall or a cleared browser gets everything back. Your email and your log are all that is stored.</p>' + accountForm(false) + '</div>';
}
function readAcct(){ const e = $('#acct-email'), p = $('#acct-pw'); acctDraft.email = e ? e.value.trim() : acctDraft.email; return {email: acctDraft.email, pw: p ? p.value : ''}; }
async function doAuth(kind){
  const a = readAcct(); syncUi.error = '';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(a.email)) { syncUi.error = 'Enter your email address.'; patchSyncLine(); return; }
  if (kind !== 'forgot' && a.pw.length < 8) { syncUi.error = 'The password needs 8 or more characters.'; patchSyncLine(); return; }
  syncUi.busy = true; const btn = $('[data-act="' + (kind === 'up' ? 'sign-up' : kind === 'forgot' ? 'forgot-pw' : 'sign-in') + '"]'); if (btn) btn.textContent = kind === 'forgot' ? 'Sending…' : kind === 'up' ? 'Creating…' : 'Signing in…';
  try {
    if (kind === 'forgot') { await forgotPassword(a.email); syncUi.busy = false; toast('Check your email for a reset link'); patchSyncLine(); if (btn) btn.textContent = 'Forgot password?'; return; }
    if (kind === 'up') await signUp(a.email, a.pw); else await signIn(a.email, a.pw);
    if (state.sample) { const keepUi = state.ui; state = fresh(false); state.ui = keepUi; state.ui.view = 'today'; saveLocal(); }
    gateHold = true; syncUi.busy = false; sheet = null; renderModal(); render();
    await syncPull({force: true});
    gateHold = false; ob = null; state.ui.view = 'today'; render(); toast(kind === 'up' ? 'Account created' : 'Signed in');
  } catch (e) { gateHold = false; syncUi.busy = false; syncUi.error = /fetch|load failed|network/i.test(e.message || '') ? 'Could not reach the server. Check your connection and try again.' : (e.message || 'Something went wrong'); patchSyncLine(); if (btn) btn.textContent = kind === 'forgot' ? 'Forgot password?' : kind === 'up' ? 'Create account' : 'Sign in'; }
}
/* A password-reset link lands here with a session in the URL: keep it and ask for the new password. */
function recoveryFromUrl(){
  if (!/type=recovery/.test(location.hash)) return;
  try { const q = new URLSearchParams(location.hash.slice(1)); const s = {access: q.get('access_token'), refresh: q.get('refresh_token'), exp: Date.now() + 3600000, email: auth ? auth.email : '', uid: auth ? auth.uid : ''}; if (s.access) { setAuth(s); sheet = {type: 'newpw'}; } } catch (e) {}
  try { history.replaceState(null, '', location.pathname + location.search); } catch (e) {}
}

/* ---------- boot ---------- */
state = load();
if (!state) { state = fresh(/[?&]sample=1/.test(location.search)); saveNow(); }
if (state.timer && state.timer.end < Date.now() - 15 * 60 * 1000) state.timer = null;
recoveryFromUrl();
document.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target && e.target.id === 'acct-pw' && !syncUi.busy) { e.preventDefault(); doAuth('in'); } });
render(); renderModal(); nativeBoot();
if (signedIn() && syncReady()) syncPull({});
if (state.active && state.ui.view === 'workout') keepAwake(true);
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') saveNow(); else { if (signedIn() && syncReady()) syncPull({}); if (state.active && state.ui.view === 'workout') keepAwake(true); if (state.timer) renderRest(); if (actx && actx.state !== 'running') { try { actx.resume(); } catch (e) {} } } });
window.addEventListener('pagehide', saveNow);
window.addEventListener('online', () => { if (signedIn() && syncReady()) syncPull({}).then(() => syncPush()); });
try {
  const link = document.createElement('link'); link.rel = 'manifest';
  if (window.SITE_BUILD) link.href = 'manifest.webmanifest';
  else { const ic = document.querySelector('link[rel="apple-touch-icon"]'); const man = {name: 'Bearing', short_name: 'Bearing', start_url: location.pathname, display: 'standalone', background_color: '#11130F', theme_color: '#11130F', icons: ic ? [{src: ic.href, sizes: '180x180', type: 'image/png'}] : []}; link.href = URL.createObjectURL(new Blob([JSON.stringify(man)], {type: 'application/manifest+json'})); }
  document.head.appendChild(link);
  if (window.SITE_BUILD && 'serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) navigator.serviceWorker.register('sw.js').catch(() => {});
} catch (e) {}
})();
</script>
