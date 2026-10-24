// v4.8: rest-pause chip and timer, goal met by weight, update routine from a changed workout, repeating order plan, this-week tile, 60/90 day tiles, remove closes menu.
const { chromium, devices } = require('playwright');
(async () => {
  const browser = await chromium.launch(); const ctx = await browser.newContext({ ...devices['iPhone 13'], colorScheme: 'dark' });
  const page = await ctx.newPage(); const errs = []; page.on('pageerror', e => errs.push(e.message));
  await page.goto('file:///home/claude/setlist/test.html?sample=1'); await page.waitForTimeout(500);
  const txt = sel => page.$eval(sel, el => el.textContent.replace(/\s+/g, ' ').trim());
  // ---- this week tile and 60/90 day tiles
  console.log('tiles:', await page.$$eval('.tile', els => els.map(e => e.textContent.replace(/\s+/g, ' ').trim().slice(0, 50)).join(' || ')));
  await page.evaluate(() => { __t.state.settings.metrics.days60 = true; __t.state.settings.metrics.days90 = true; __t.render(); }); await page.waitForTimeout(150);
  console.log('with 60/90:', await page.$$eval('.tile', els => els.map(e => e.textContent.replace(/\s+/g, ' ').trim()).filter(t => /60 days|90 days/.test(t)).join(' || ')));
  // ---- rest-pause chip and timer in a workout
  await page.evaluate(() => __t.startWorkout('push')); await page.waitForTimeout(300);
  console.log('chips:', await page.$$eval('.card.focus .chip', els => els.map(e => e.textContent).join(' | ')));
  await page.click('[data-act="sub-toggle"][data-tech="restpause"]'); await page.waitForTimeout(250);
  const rp = await page.evaluate(() => { const d = __t.state.active.entries[0].draft; return {tech: d.sub.tech, w: d.sub.w, r: d.sub.r, more: d.sub.more, draftR: d.r, draftW: d.w}; });
  console.log('rest-pause sub:', JSON.stringify(rp), '| panel:', (await txt('.subset')).slice(0, 170));
  await page.click('[data-act="rp-timer"]'); await page.waitForTimeout(300);
  console.log('pause timer:', JSON.stringify(await page.evaluate(() => ({kind: __t.state.timer.kind, total: __t.state.timer.total}))), '| bar:', await txt('#restbar'), '| button:', await txt('[data-act="rp-timer"]'));
  await page.selectOption('select[data-set="rpSecs"]', '30'); await page.waitForTimeout(200);
  console.log('after 30 s pick:', await txt('[data-act="rp-timer"]'), '| setting:', await page.evaluate(() => __t.state.settings.rpSecs));
  await page.click('[data-act="sub-add"]'); await page.waitForTimeout(150);
  console.log('stages after add:', await page.evaluate(() => JSON.stringify(__t.state.active.entries[0].draft.sub.more)));
  await page.click('[data-act="step"][data-f="sr.1"][data-d="1"]'); await page.waitForTimeout(100);
  await page.evaluate(() => { __t.state.timer = null; }); await page.click('[data-act="log"]'); await page.waitForTimeout(300);
  const logged = await page.evaluate(() => { const s = __t.state.active.entries[0].sets.filter(x => !x.wu)[0]; return {w: s.w, r: s.r, sub: s.sub, tw: s.tw, tr: s.tr}; });
  console.log('logged set:', JSON.stringify(logged), '| row:', (await page.$$eval('.set:not(.wuset)', els => els.map(e => e.textContent.replace(/\s+/g, ' ').trim()))).join(' || '));
  // ---- goal met: heavier weight, fewer reps
  await page.evaluate(() => { const en = __t.state.active.entries[0]; en.draft.w = en.rec.w + 20; en.draft.r = Math.max(1, en.rec.goals[1] - 2); __t.state.timer = null; __t.render(); }); await page.waitForTimeout(150);
  await page.click('[data-act="log"]'); await page.waitForTimeout(300);
  const rows = await page.$$eval('.set:not(.wuset)', els => els.map(e => e.textContent.replace(/\s+/g, ' ').trim()));
  console.log('rows:', rows.join(' || '));
  console.log('goalMet checks:', await page.evaluate(() => { const s = __t.state.active.entries[0].sets.filter(x => !x.wu); return s.map(x => x.w + 'x' + x.r + ' vs ' + x.tw + 'x' + x.tr).join(' ; '); }));
  // ---- remove from the exercise menu closes it
  await page.evaluate(() => { __t.state.active.idx = 1; __t.render(); }); await page.waitForTimeout(150);
  const before = await page.evaluate(() => __t.state.active.entries.length);
  await page.click('[data-act="ex-menu"][data-i="1"]'); await page.waitForTimeout(200);
  await page.click('.sheet [data-act="remove-entry"]'); await page.waitForTimeout(300);
  console.log('removed:', before, '->', await page.evaluate(() => __t.state.active.entries.length), '| menu open:', await page.$$eval('.modal', els => els.length > 0), '| view:', await page.evaluate(() => __t.state.ui.view));
  // ---- modified workout updates its routine at the end
  await page.evaluate(() => { const a = __t.state.active; a.entries.push(__t.makeEntry('hacksquat', {sets: 3, reps: 10, hi: 12})); __t.render(); });
  await page.evaluate(() => { __t.state.timer = null; __t.render(); }); await page.waitForTimeout(100);
  await page.click('[data-act="finish"]'); await page.waitForTimeout(400);
  console.log('summary has update:', await page.$$eval('.sheet [data-act="update-routine"]', els => els.map(e => e.textContent).join()), '| links:', await page.$$eval('.sheet .btn.link', els => els.map(e => e.textContent).join(' | ')));
  const rBefore = await page.evaluate(() => __t.state.routines.find(r => r.id === 'push').items.map(it => it.ex + ':' + it.sets + 'x' + it.reps + '-' + (it.hi || '')).join(','));
  await page.click('.sheet [data-act="update-routine"]'); await page.waitForTimeout(300);
  const rAfter = await page.evaluate(() => __t.state.routines.find(r => r.id === 'push').items.map(it => it.ex + ':' + it.sets + 'x' + it.reps + '-' + (it.hi || '')).join(','));
  console.log('routine before:', rBefore, '\nroutine after: ', rAfter, '| update gone:', await page.$$eval('.sheet [data-act="update-routine"]', els => els.length === 0));
  await page.click('.sheet [data-act="summary-done"]').catch(() => {}); await page.waitForTimeout(200);
  // ---- repeating order plan
  await page.click('[data-tab="plan"]'); await page.waitForTimeout(250);
  await page.click('[data-act="cycle-mode"][data-v="order"]'); await page.waitForTimeout(200);
  for (const v of ['push', 'pull', 'rest', 'legs', 'rest']) { await page.selectOption('select[data-cycle-add]', v); await page.waitForTimeout(120); }
  console.log('order:', await page.$$eval('#screen .card:first-child .row', els => els.map(e => e.textContent.replace(/\s+/g, ' ').trim()).filter(t => /^Day \d/.test(t)).map(t => t.replace(/↑↓×/g, '').trim()).join(' | ')));
  console.log('header:', await txt('#screen .card:first-child .tiny.muted'));
  await page.selectOption('select[data-cycle-today]', '2'); await page.waitForTimeout(200);
  const seqPlan = await page.evaluate(() => Array.from({length: 7}, (_, i) => { const k = __t.keyOf(__t.addDays(new Date(), i)); const rs = __t.dayPlan ? null : null; return k.slice(5) + ':' + (window.__t.state.cycle.seq[((Math.round((new Date(k + 'T12:00') - new Date(window.__t.state.cycle.start + 'T12:00')) / 864e5) % 5) + 5) % 5].join('') || 'rest'); }).join(' '));
  console.log('next 7 days:', seqPlan);
  await page.click('[data-act="cycle-move"][data-k="3"][data-d="-1"]'); await page.waitForTimeout(150);
  console.log('after move:', await page.$$eval('#screen .card:first-child .row', els => els.map(e => e.textContent.replace(/\s+/g, ' ').trim()).filter(t => /^Day \d/.test(t)).map(t => t.replace(/↑↓×/g, '').trim()).join(' | ')));
  await page.click('[data-tab="today"]'); await page.waitForTimeout(250);
  console.log('today title:', await txt('.title'), '| tile:', await page.$$eval('.tile', els => els.map(e => e.textContent.replace(/\s+/g, ' ').trim()).find(t => /This week/.test(t))));
  console.log('week strip dots:', await page.$$eval('.weeks .week:last-child .day .dot', els => els.map(e => e.className.replace('dot', '').trim() || 'none').join(',')));
  await page.screenshot({ path: 'sc-cycle-today.png' });
  await page.click('[data-tab="plan"]'); await page.waitForTimeout(200); await page.screenshot({ path: 'sc-cycle-plan.png' });
  await page.click('[data-act="cycle-mode"][data-v="week"]'); await page.waitForTimeout(200);
  console.log('back to weekday:', await txt('#screen .card:first-child .h3'));
  console.log(errs.length ? errs.join('\n') : 'no errors'); await browser.close();
})();
