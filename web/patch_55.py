# v5.5: the 1000 lb club card, achievements (with a celebration at the end of a workout), and sets/reps that can be changed
# mid-workout with the coach re-planning on the spot.
def sub(src, old, new):
    assert old in src, 'anchor missing: ' + old[:110]
    assert src.count(old) == 1, 'anchor not unique: ' + old[:110]
    return src.replace(old, new, 1)

p2 = open('part2.js', encoding='utf-8').read()
p2 = sub(p2, "const APP_VERSION = '5.4',", "const APP_VERSION = '5.5',")
p2 = sub(p2, "    custom: [], recovery: [], water: {}, cycle: {on: false, seq: [], start: todayKey()}, deleted: {w: {}, r: {}}, sync: {rev: 0},",
             "    custom: [], recovery: [], water: {}, ach: {earned: {}}, cycle: {on: false, seq: [], start: todayKey()}, deleted: {w: {}, r: {}}, sync: {rev: 0},")
p2 = sub(p2, "    s.deleted = Object.assign({w: {}, r: {}}, s.deleted || {}); s.sync = Object.assign({rev: 0}, s.sync || {});",
             "    s.deleted = Object.assign({w: {}, r: {}}, s.deleted || {}); s.sync = Object.assign({rev: 0}, s.sync || {});\n    s.ach = Object.assign({earned: {}}, s.ach || {}); if (!s.ach.earned || typeof s.ach.earned !== 'object') s.ach.earned = {};")
p2 = p2.rstrip('\n') + '\n' + open('engine_55.js', encoding='utf-8').read()
open('part2.js', 'w', encoding='utf-8').write(p2)

p3 = open('part3.js', encoding='utf-8').read()
# the new cards and sheets
p3 = sub(p3, "function renderYou(){\n", open('ui_55.js', encoding='utf-8').read().lstrip('\n') + "\nfunction renderYou(){\n")
p3 = sub(p3, "  return header(streak ? streak + '-week streak' : 'Progress') + '<div class=\"stack\">' + (scoreOn() ? scoreCard() : (liftOn() ? standardsCard(true) : '')) + picksCard() +",
             "  return header(streak ? streak + '-week streak' : 'Progress') + '<div class=\"stack\">' + (scoreOn() ? scoreCard() : (liftOn() ? standardsCard(true) : '')) + (liftOn() ? clubCard() : '') + achievementsCard() + picksCard() +")
p3 = sub(p3, "  } else if (sheet.type === 'exmenu') {",
             "  } else if (sheet.type === 'achv') {\n    inner = achievementsSheet();\n  } else if (sheet.type === 'target') {\n    inner = targetSheet(); if (!inner) { sheet = null; modalEl.innerHTML = ''; return; }\n  } else if (sheet.type === 'exmenu') {")
# the summary sheet celebrates new badges
p3 = sub(p3, "      (w.prs.length ? '<div style=\"margin-top:12px\">' + prLines(w) + '</div>' : '') +\n      '<div style=\"margin-top:12px\">' + coachSummaryHTML(w.coach) + '</div>' +",
             "      (w.prs.length ? '<div style=\"margin-top:12px\">' + prLines(w) + '</div>' : '') + newBadgesHTML(w.ach) +\n      '<div style=\"margin-top:12px\">' + coachSummaryHTML(w.coach) + '</div>' +")
p3 = sub(p3, "  state.workouts.push(w); state.active = null; state.timer = null; keepAwake(false);\n  state.ui.view = 'today'; sheet = {type: 'summary', id: w.id};",
             "  state.workouts.push(w); state.active = null; state.timer = null; keepAwake(false);\n  try { w.ach = achievements().fresh; } catch (e) { w.ach = []; }\n  state.ui.view = 'today'; sheet = {type: 'summary', id: w.id};")
# the target row opens the sets-and-reps sheet
p3 = sub(p3, "  return '<div class=\"tl\"><span class=\"k\">Target</span><span class=\"v\">' + t.sets + ' sets ' + (t.fail ? 'to failure' : 'of ' + (t.hi === 99 ? t.reps + ' or more on the last' : (t.hi && t.hi !== t.reps ? t.reps + ' to ' + t.hi : t.reps))) + '</span>' +",
             "  return '<div class=\"tl\"><span class=\"k\">Target</span><span class=\"v\">' + t.sets + ' sets ' + (t.fail ? 'to failure' : 'of ' + (t.hi === 99 ? t.reps + ' or more on the last' : (t.hi && t.hi !== t.reps ? t.reps + ' to ' + t.hi : t.reps))) + ' <button class=\"btn link small\" data-act=\"target-open\" data-i=\"' + i + '\">Change ›</button></span>' +")
# handlers
p3 = sub(p3, "    case 'ex-menu': sheet = {type: 'exmenu', i: i}; renderModal(); break;",
             "    case 'ex-menu': sheet = {type: 'exmenu', i: i}; renderModal(); break;\n    case 'target-open': { const a = state.active, en = a && a.entries[i]; if (!en) break; const r = a.routine ? routine(a.routine) : null, it = r ? r.items.find(x => x.ex === en.ex) : null; sheet = {type: 'target', i: i, toRoutine: false, orig: it ? Object.assign({}, it) : null}; renderModal(); break; }\n    case 'achv-open': sheet = {type: 'achv'}; renderModal(); break;")
p3 = sub(p3, "    case 'water-add': { const v = +t.dataset.v; waterAdd(todayKey(), volToOz(v)); render(); const g = waterGoal(todayKey()), tot = waterTotal(todayKey()); toast(tot >= g.total ? 'Goal hit: ' + dispVol(tot) + ' ' + waterUnit() : dispVol(tot) + ' of ' + dispVol(g.total) + ' ' + waterUnit()); break; }",
             "    case 'water-add': { const v = +t.dataset.v; waterAdd(todayKey(), volToOz(v)); render(); const g = waterGoal(todayKey()), tot = waterTotal(todayKey()); toast(tot >= g.total ? 'Goal hit: ' + dispVol(tot) + ' ' + waterUnit() : dispVol(tot) + ' of ' + dispVol(g.total) + ' ' + waterUnit()); if (tot >= g.total) { try { const f = achievements().fresh; if (f.length) { const nm = achvList().find(x => x.id === f[0]).name; setTimeout(() => toast('Achievement: ' + nm), 1900); } } catch (e) {} } break; }")
p3 = sub(p3, "  if (el.dataset.set) {\n",
             """  if (el.dataset.tgt) {
    const i = +el.dataset.i, en = state.active && state.active.entries[i]; if (!en) return;
    const t = en.target, k = el.dataset.tgt;
    if (k === 'sets') t.sets = clamp(+el.value || 1, 1, 8);
    else if (k === 'reps') { if (el.value === 'fail') { t.fail = true; t.hi = t.reps; } else { delete t.fail; t.reps = clamp(+el.value || 1, 1, 300); if (t.hi !== 99 && (!t.hi || t.hi < t.reps)) t.hi = t.reps; } }
    else if (k === 'hi') t.hi = +el.value;
    retarget(i, !!(sheet && sheet.toRoutine)); renderModal(); render(); return;
  }
  if (el.id === 'tgt-routine') {
    if (!sheet || sheet.type !== 'target') return; sheet.toRoutine = el.checked;
    if (el.checked) retarget(sheet.i, true);
    else if (sheet.orig && state.active && state.active.routine) { const r = routine(state.active.routine), it = r && r.items.find(x => x.ex === state.active.entries[sheet.i].ex); if (it) { for (const key of ['sets', 'reps', 'hi', 'fail']) { if (sheet.orig[key] === undefined) delete it[key]; else it[key] = sheet.orig[key]; } save(); } }
    return;
  }
  if (el.dataset.set) {
""")
# earned dates come from the log itself where it can tell; merge them by the earliest date
p3 = sub(p3, "  if (local.since && (!out.since || local.since < out.since)) out.since = local.since;\n  return out;",
             "  if (local.since && (!out.since || local.since < out.since)) out.since = local.since;\n  out.ach = Object.assign({earned: {}}, out.ach || {}); const le = (local.ach || {}).earned || {}; for (const id in le) if (!out.ach.earned[id] || le[id] < out.ach.earned[id]) out.ach.earned[id] = le[id]; if (!out.ach.init && local.ach && local.ach.init) out.ach.init = local.ach.init;\n  return out;")
# first look happens at boot, so the first workout after the update can celebrate what is actually new
p3 = sub(p3, "recoveryFromUrl();\ndocument.addEventListener('keydown',", "recoveryFromUrl();\ntry { if (!gateOn()) achievements(); } catch (e) {}\ndocument.addEventListener('keydown',")
open('part3.js', 'w', encoding='utf-8').write(p3)

p1 = open('part1.html', encoding='utf-8').read()
p1 = sub(p1, "\n  /* Chart */\n", """
  /* 1000 lb club */
  .clubbar{display:flex; height:12px; border-radius:6px; background:var(--surface-3); overflow:hidden; margin-top:10px}
  .clubbar .seg{display:block; height:100%} .clubbar .seg + .seg{border-left:2px solid var(--surface)}
  .seg.squat,.dot.squat{background:var(--accent)} .seg.bench,.dot.bench{background:#C79A4A} .seg.deadlift,.dot.deadlift{background:#7FA8B8}
  .clubrow{display:flex; align-items:center; gap:10px; font-size:15px} .clubrow .dot{width:10px; height:10px; border-radius:50%; flex:none}
  /* achievements */
  .badges{display:grid; grid-template-columns:repeat(3,1fr); gap:10px 6px; margin-top:4px}
  .badge{display:flex; align-items:center; gap:10px; padding:8px 10px; border-radius:var(--radius-sm); background:var(--surface-2); border:1px solid var(--border)}
  .badge.on{border-color:rgba(143,162,113,.45)} .badge .nm{font-weight:700; font-size:15px}
  .badge.mini{flex-direction:column; align-items:center; gap:0; padding:8px 4px; background:transparent; border:none}
  .badge-ic{flex:none} .badge-ic .bg{fill:var(--accent-soft)} .badge-ic path,.badge-ic rect,.badge-ic circle:not(.bg){fill:none; stroke:var(--accent); stroke-width:1.8; stroke-linecap:round; stroke-linejoin:round}
  .badge-ic.locked .bg{fill:var(--surface-3)} .badge-ic.locked path,.badge-ic.locked rect,.badge-ic.locked circle:not(.bg){stroke:var(--faint)}
  .pbar{height:5px; border-radius:3px; background:var(--surface-3); overflow:hidden; margin:6px 0 3px} .pbar i{display:block; height:100%; background:var(--accent)}
  .newbadge{margin-top:12px; padding:12px 14px; border-radius:var(--radius-sm); background:var(--good-soft); border:1px solid rgba(143,162,113,.45)}

  /* Chart */
""")
open('part1.html', 'w', encoding='utf-8').write(p1)
print('patched 5.5')
