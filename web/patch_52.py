# v5.2: the rest alert gets a real sound. Four tones to pick from, sound / vibration / both / nothing, a Test button,
# and in the App Store app the sound plays over the ring switch, through headphones, ducking music, via the Bearing plugin.
# The lock-screen notification plays the same tone (or a silent file for vibration only).
def sub(src, old, new):
    assert old in src, 'anchor missing: ' + old[:110]
    assert src.count(old) == 1, 'anchor not unique: ' + old[:110]
    return src.replace(old, new, 1)

p2 = open('part2.js', encoding='utf-8').read()
p2 = sub(p2, "const APP_VERSION = '5.1',", "const APP_VERSION = '5.2',")
p2 = sub(p2, "settings: {unit: 'lb', rest: 90, sound: true, vibrate: true, metrics:", "settings: {unit: 'lb', rest: 90, sound: true, vibrate: true, tone: 'chime', metrics:")
p2 = sub(p2, "    if (!s.settings.rpSecs) s.settings.rpSecs = 20; s.cycle =", "    if (!s.settings.rpSecs) s.settings.rpSecs = 20; if (!s.settings.tone) s.settings.tone = 'chime'; s.cycle =")
open('part2.js', 'w', encoding='utf-8').write(p2)

p3 = open('part3.js', encoding='utf-8').read()

# settings: the alert row, a tone picker, a line that says what to expect, and a Test button
p3 = sub(p3, """      '<div class="row"><span class="grow" style="font-weight:600">When rest ends</span><select class="sm" data-set="alert" style="width:160px"><option value="both"' + sel('both', alert) + '>Buzz and beep</option><option value="vibrate"' + sel('vibrate', alert) + '>Buzz only</option><option value="sound"' + sel('sound', alert) + '>Beep only</option><option value="none"' + sel('none', alert) + '>Silent</option></select></div>' +
    '</div></div>' +""",
             """      '<div class="row"><span class="grow" style="font-weight:600">When rest ends</span><select class="sm" data-set="alert" style="width:160px"><option value="both"' + sel('both', alert) + '>Sound and vibration</option><option value="sound"' + sel('sound', alert) + '>Sound only</option><option value="vibrate"' + sel('vibrate', alert) + '>Vibration only</option><option value="none"' + sel('none', alert) + '>Nothing</option></select></div>' +
      (state.settings.sound ? '<div class="row"><span class="grow" style="font-weight:600">Alert sound</span><select class="sm" data-set="tone" style="width:160px">' + TONES.map(t => '<option value="' + t.id + '"' + sel(t.id, state.settings.tone) + '>' + t.name + '</option>').join('') + '</select></div>' : '') +
      (alert !== 'none' ? '<div class="row" style="align-items:flex-start;gap:12px"><p class="tiny muted grow" style="margin:0">' + alertHelp() + '</p><button class="btn sm" data-act="alert-test" style="flex:none">Test</button></div>' : '') +
    '</div></div>' +""")

# the alert handlers: picking a tone plays it, Test plays the whole alert and reports where the sound went
p3 = sub(p3, "    else if (k === 'alert') { state.settings.sound = el.value === 'both' || el.value === 'sound'; state.settings.vibrate = el.value === 'both' || el.value === 'vibrate'; }",
             "    else if (k === 'alert') { state.settings.sound = el.value === 'both' || el.value === 'sound'; state.settings.vibrate = el.value === 'both' || el.value === 'vibrate'; syncRestAlert(); }\n    else if (k === 'tone') { state.settings.tone = TONES.some(t => t.id === el.value) ? el.value : 'chime'; unlockAudio(); beep(); syncRestAlert(); }")
p3 = sub(p3, "    case 'sign-out-go': signOut(); break;",
             "    case 'sign-out-go': signOut(); break;\n    case 'alert-test': testAlert(); break;")

# the notification mirrors the chosen sound; vibration only rides on a silent file
p3 = sub(p3, "let restAlertEnd = 0, restAlertAsked = false;", "let restAlertKey = '', restAlertAsked = false;")
p3 = sub(p3, "  const t = state.timer, a = state.active, want = t && !t.fired && !(a && a.pausedAt) ? t.end : 0;\n  if (want === restAlertEnd) return; restAlertEnd = want;",
             "  const t = state.timer, a = state.active, want = t && !t.fired && !(a && a.pausedAt) ? t.end : 0, snd = alertFile();\n  const key = want ? want + '|' + snd : ''; if (key === restAlertKey) return; restAlertKey = key;")
p3 = sub(p3, "schedule: {at: new Date(want), allowWhileIdle: true}, sound: 'default'}]});",
             "schedule: {at: new Date(want), allowWhileIdle: true}, sound: snd || undefined}]});")

# the sound itself
p3 = sub(p3, """let wl = null;
async function keepAwake(on){
  try {
    if (on && !wl && navigator.wakeLock) {""",
             """let wl = null;
async function keepAwake(on){
  const B = Plug('Bearing'); if (B && B.keepAwake) { B.keepAwake({on: !!on}).catch(() => {}); return; }
  try {
    if (on && !wl && navigator.wakeLock) {""")
p3 = sub(p3, """let actx = null;
function unlockAudio(){ try { const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return; if (!actx) actx = new AC(); if (actx.state === 'suspended') actx.resume(); } catch (e) {} }
function beep(){
  if (!state.settings.sound || !actx) return;
  try { const t = actx.currentTime; [0, 0.2, 0.4].forEach(off => { const o = actx.createOscillator(), g = actx.createGain(); o.type = 'sine'; o.frequency.value = 880; g.gain.setValueAtTime(0.0001, t + off); g.gain.exponentialRampToValueAtTime(0.3, t + off + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + off + 0.16); o.connect(g); g.connect(actx.destination); o.start(t + off); o.stop(t + off + 0.18); }); } catch (e) {}
}
function buzz(){ if (!state.settings.vibrate) return; if (NATIVE) { haptic('alert'); return; } if (navigator.vibrate) { try { navigator.vibrate([200, 90, 200]); } catch (e) {} } }""",
             r"""/* ---------- the rest alert ----------
   Each tone is a small synth patch scheduled on a Web Audio context. The website plays the patch live; tools/render_tones.js renders
   the same patches to the .wav files that the App Store app plays natively (over the ring switch, through headphones, ducking music)
   and that the lock-screen notification uses, so every route sounds the same. */
const TONES = [{id: 'chime', name: 'Chime', file: 'chime.wav'}, {id: 'bell', name: 'Bell', file: 'bell.wav'}, {id: 'beep', name: 'Beep', file: 'beep.wav'}, {id: 'buzzer', name: 'Buzzer', file: 'buzzer.wav'}];
const TONE_LEVEL = {chime: 0.95, bell: 0.9, beep: 0.8, buzzer: 0.6};
const toneOf = () => TONES.find(t => t.id === state.settings.tone) || TONES[0];
/* The file the notification plays: the chosen tone, a silent file when only vibration is wanted (the vibration rides on it), nothing otherwise. */
const alertFile = () => state.settings.sound ? toneOf().file : (state.settings.vibrate ? 'silent.wav' : '');
function toneGraph(ctx, dest, id, t0){
  const master = ctx.createGain(); master.gain.value = TONE_LEVEL[id] || 0.8; master.connect(dest);
  let end = t0;
  const voice = (freq, at, dur, peak, partials) => {
    partials.forEach(p => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = p[2] || 'sine'; o.frequency.value = freq * p[0];
      g.gain.setValueAtTime(0.0001, at); g.gain.linearRampToValueAtTime(peak * p[1], at + 0.008); g.gain.exponentialRampToValueAtTime(0.0001, at + dur * (p[3] || 1));
      o.connect(g); g.connect(master); o.start(at); o.stop(at + dur * (p[3] || 1) + 0.02);
    });
    end = Math.max(end, at + dur);
  };
  if (id === 'bell') { [0, 0.6].forEach(off => voice(740, t0 + off, 1.7, 0.42, [[1, 1], [2, 0.5, 'sine', 0.7], [2.76, 0.28, 'sine', 0.5], [5.4, 0.12, 'sine', 0.3]])); }
  else if (id === 'beep') { [0, 0.22, 0.44].forEach(off => voice(880, t0 + off, 0.17, 0.5, [[1, 1, 'triangle'], [2, 0.25]])); }
  else if (id === 'buzzer') { [0, 0.5].forEach(off => voice(220, t0 + off, 0.38, 0.35, [[1, 1, 'sawtooth'], [0.5, 0.6, 'square']])); }
  else { voice(1047, t0, 0.9, 0.45, [[1, 1], [2, 0.35, 'sine', 0.6], [3, 0.1, 'sine', 0.4]]); voice(1568, t0 + 0.22, 1.1, 0.45, [[1, 1], [2, 0.3, 'sine', 0.6], [3, 0.08, 'sine', 0.4]]); }
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
}""")

# coming back to the app: the audio context may have been interrupted while away
p3 = sub(p3, "if (state.active && state.ui.view === 'workout') keepAwake(true); if (state.timer) renderRest(); } });",
             "if (state.active && state.ui.view === 'workout') keepAwake(true); if (state.timer) renderRest(); if (actx && actx.state !== 'running') { try { actx.resume(); } catch (e) {} } } });")
open('part3.js', 'w', encoding='utf-8').write(p3)
print('patched 5.2')
