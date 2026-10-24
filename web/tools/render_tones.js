// Renders the rest-alert tones to web/sounds/*.wav from the same synth patches the website plays live (toneGraph in part3.js),
// plus silent.wav, which a vibration-only notification rides on. Run after mk_test.py: node tools/render_tones.js
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const OUT = path.join(__dirname, '..', 'sounds');
const SR = 44100;
function wav(samples){
  const n = samples.length, buf = Buffer.alloc(44 + n * 2);
  buf.write('RIFF', 0); buf.writeUInt32LE(36 + n * 2, 4); buf.write('WAVE', 8); buf.write('fmt ', 12);
  buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(1, 22); buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 2, 28); buf.writeUInt16LE(2, 32); buf.writeUInt16LE(16, 34);
  buf.write('data', 36); buf.writeUInt32LE(n * 2, 40);
  for (let i = 0; i < n; i++) { const v = Math.max(-1, Math.min(1, samples[i])); buf.writeInt16LE(Math.round(v < 0 ? v * 32768 : v * 32767), 44 + i * 2); }
  return buf;
}
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const errs = []; page.on('pageerror', e => errs.push(e.message));
  await page.goto('file://' + path.join(__dirname, '..', 'test.html') + '?sample=1'); await page.waitForTimeout(400);
  const ids = await page.evaluate(() => __t.TONES.map(t => t.id));
  for (const id of ids) {
    const r = await page.evaluate(async ([id, sr]) => {
      const ctx = new OfflineAudioContext(1, sr * 3, sr);
      const end = __t.toneGraph(ctx, ctx.destination, id, 0.02);
      const buf = await ctx.startRendering();
      const data = buf.getChannelData(0), n = Math.min(data.length, Math.ceil((end + 0.15) * sr));
      let peak = 0, sum = 0; for (let i = 0; i < n; i++) { const a = Math.abs(data[i]); if (a > peak) peak = a; sum += data[i] * data[i]; }
      return { samples: Array.from(data.subarray(0, n)), peak, rms: Math.sqrt(sum / n), secs: n / sr };
    }, [id, SR]);
    fs.writeFileSync(path.join(OUT, id + '.wav'), wav(r.samples));
    console.log(id.padEnd(7), r.secs.toFixed(2) + 's', 'peak', r.peak.toFixed(2), 'rms', r.rms.toFixed(3));
  }
  fs.writeFileSync(path.join(OUT, 'silent.wav'), wav(new Array(Math.round(SR * 0.5)).fill(0)));
  console.log('silent  0.50s');
  console.log(errs.length ? 'ERRORS: ' + errs.join(' | ') : 'ok');
  await browser.close();
})();
