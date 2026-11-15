// v5.5: sets and reps changed mid-workout (coach re-plans, routine optional), achievements celebrate at finish, the club card reads right.
const { chromium, devices } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ ...devices['iPhone 13'], colorScheme: 'dark' });
  const page = await ctx.newPage();
  const errs = []; page.on('pageerror', e => errs.push(e.message));
  await page.goto('file:///home/claude/setlist/test.html?sample=1'); await page.waitForTimeout(400);
  await page.evaluate(() => { __t.startWorkout('push'); }); await page.waitForTimeout(300);
  const snap = () => page.evaluate(() => { const en = __t.state.active.entries[__t.state.active.idx]; return {ex: en.ex, target: en.target, w: en.draft.w, r: en.draft.r, goals: en.rec && en.rec.goals, recW: en.rec && en.rec.w}; });
  console.log('start:', JSON.stringify(await snap()));
  console.log('Change link present:', !!(await page.$('[data-act="target-open"]')));
  await page.click('[data-act="target-open"]'); await page.waitForTimeout(200);
  console.log('sheet:', await page.$eval('.sheet .h2', el => el.textContent), '| routine box:', !!(await page.$('#tgt-routine')), '| coach line:', await page.$eval('#tgt-coach', el => el.textContent.slice(0, 60)));
  await page.selectOption('[data-tgt="reps"]', '5'); await page.waitForTimeout(250);
  const afterReps = await snap(); console.log('reps -> 5:', JSON.stringify(afterReps), '| coach line:', await page.$eval('#tgt-coach', el => el.textContent.slice(0, 70)));
  await page.selectOption('[data-tgt="hi"]', '6'); await page.waitForTimeout(200);
  await page.selectOption('[data-tgt="sets"]', '5'); await page.waitForTimeout(200);
  const afterSets = await snap(); console.log('sets -> 5, up to 6:', JSON.stringify({target: afterSets.target, goals: afterSets.goals}));
  console.log('eyebrow shows:', await page.$eval('.card.focus .eyebrow', el => el.textContent));
  // routine untouched until asked
  const rit = () => page.evaluate(() => { const r = __t.state.routines.find(x => x.id === __t.state.active.routine); const it = r.items.find(x => x.ex === __t.state.active.entries[__t.state.active.idx].ex); return {sets: it.sets, reps: it.reps, hi: it.hi, fail: it.fail}; });
  console.log('routine before box:', JSON.stringify(await rit()));
  await page.check('#tgt-routine'); await page.waitForTimeout(200);
  console.log('routine after box:', JSON.stringify(await rit()));
  await page.uncheck('#tgt-routine'); await page.waitForTimeout(200);
  console.log('routine after unbox (restored):', JSON.stringify(await rit()));
  await page.check('#tgt-routine'); await page.waitForTimeout(200);
  await page.selectOption('[data-tgt="reps"]', 'fail'); await page.waitForTimeout(200);
  console.log('to failure:', JSON.stringify((await snap()).target), '| routine:', JSON.stringify(await rit()), '| hi select gone:', !(await page.$('[data-tgt="hi"]')));
  await page.selectOption('[data-tgt="reps"]', '8'); await page.waitForTimeout(200);
  console.log('back to 8:', JSON.stringify((await snap()).target));
  await page.screenshot({ path: 'sc-target.png' });
  await page.click('[data-act="close"]'); await page.waitForTimeout(200);
  // log a set, then change sets: the logged set stays, the draft follows the next goal
  await page.click('[data-act="log"]'); await page.waitForTimeout(300); await page.click('[data-act="rest-skip"]').catch(() => {}); await page.waitForTimeout(100);
  await page.click('[data-act="target-open"]'); await page.waitForTimeout(200); await page.selectOption('[data-tgt="reps"]', '12'); await page.waitForTimeout(200);
  const s2 = await snap(); console.log('after a logged set, reps -> 12:', JSON.stringify({sets: s2.target.sets, reps: s2.target.reps, hi: s2.target.hi, draftR: s2.r, goals: s2.goals, logged: await page.evaluate(() => __t.state.active.entries[__t.state.active.idx].sets.length)}));
  await page.click('[data-act="close"]'); await page.waitForTimeout(150);
  // finish: a fresh workout count achievement should not fire (10 already earned, 50 far), but let's force a new one: 1.5x squat is close; set the body weight low
  await page.evaluate(() => { __t.state.profile.bw = 100; });
  await page.evaluate(() => { __t.finish(); }); await page.waitForTimeout(400);
  const w = await page.evaluate(() => { const w = __t.state.workouts[__t.state.workouts.length - 1]; return {ach: w.ach, banner: (document.querySelector('.newbadge') || {}).textContent || ''}; });
  console.log('finish celebration:', JSON.stringify(w));
  // achievements sheet opens from the card
  await page.evaluate(() => { __t.closeSheet(); __t.state.ui.view = 'progress'; __t.render(); }); await page.waitForTimeout(200);
  await page.click('[data-act="achv-open"]'); await page.waitForTimeout(250);
  console.log('sheet heads:', await page.$$eval('.sheet .datehead', els => els.map(e => e.textContent.trim().replace(/\s+/g, ' ')).join(' | ')), '| badges:', await page.$$eval('.sheet .badge', els => els.length));
  await page.screenshot({ path: 'sc-achv-sheet.png' });
  console.log(errs.length ? 'ERRORS: ' + errs.join('\n') : 'no errors'); await browser.close();
})();
