# test.html = setlist.html with a viewport meta and a window.__t hook into the app's closure for Playwright tests.
src = open('setlist.html', encoding='utf-8').read()
names = ['render', 'renderModal', 'recommend', 'whyLine', 'startWorkout', 'coachPicks', 'obSteps', 'tipsFor', 'CATALOG', 'metsOf', 'setLoad', 'recommendCardio', 'cardioWhy', 'shareText',
         'athleteScore', 'scoreDelta', 'scoreHistory', 'scoreLevers', 'closeSheet', 'finish', 'logSet', 'makeEntry', 'historyFor', 'lastPerformance', 'waterGoal', 'dayPlan', 'todayKey', 'keyOf', 'addDays', 'save', 'saveNow', 'load', 'fresh', 'toneGraph', 'TONES', 'TONE_LEVEL', 'beep', 'buzz', 'unlockAudio', 'syncRestAlert', 'alertFile', 'testAlert', 'keepAwake', 'syncLive', 'liveLine', 'togglePause']
hook = "window.__t = {}; Object.defineProperty(window.__t, 'state', {get: () => state, set: v => { state = v; }}); Object.defineProperty(window.__t, 'sheet', {get: () => sheet, set: v => { sheet = v; }});\n" + \
       ''.join("try { window.__t[%r] = eval(%r); } catch (e) {}\n" % (n, n) for n in names)
marker = '})();\n</script>'
assert src.count(marker) == 1
test = '<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n' + src.replace(marker, hook + marker)
open('test.html', 'w', encoding='utf-8').write(test)
print('test.html written')
