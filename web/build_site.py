# Builds Bearing from the three source parts.
#   web/setlist.html   the single-file app (also what the claude.ai preview runs)
#   dist/site/         the Netlify site: flags, icons, service worker, legal pages
#   www/               the same page for the native app (Capacitor copies it into ios/ and android/)
# Settings live in config.json: the web address, and the Supabase URL and publishable key for accounts.
# An empty syncKey hides the account features entirely.
# Output folders can be overridden with SITE_OUT and NATIVE_WWW.
import re, os, shutil, base64, json
here = os.path.dirname(os.path.abspath(__file__))
os.chdir(here)
cfg = json.load(open('config.json', encoding='utf-8'))
src = ''.join(open(f, encoding='utf-8').read() for f in ['part1.html', 'part2.js', 'part3.js'])
open('setlist.html', 'w', encoding='utf-8').write(src)
ver = re.search(r"const APP_VERSION = '([0-9.]+)'", src).group(1)
out = os.environ.get('SITE_OUT') or ('/mnt/user-data/outputs/site' if os.path.isdir('/mnt/user-data/outputs') else os.path.join(here, '..', 'dist', 'site'))
native = os.environ.get('NATIVE_WWW') or os.path.join(here, '..', 'www')
os.makedirs(out, exist_ok=True)
for f in os.listdir('site_static'): shutil.copy(os.path.join('site_static', f), os.path.join(out, f))
# the alert tones sit at the root of both builds: the notification plugins look for a bare filename there (public/ in the app bundle)
sounds = sorted(f for f in os.listdir('sounds') if f.endswith('.wav'))
for f in sounds: shutil.copy(os.path.join('sounds', f), os.path.join(out, f))
m = re.search(r'<link rel="apple-touch-icon" href="data:image/png;base64,([A-Za-z0-9+/=]+)">', src)
assert m, 'apple-touch-icon link missing'
html = src.replace(m.group(0), '<link rel="apple-touch-icon" href="apple-touch-icon.png" data-inline="' + m.group(1) + '">')
open(os.path.join(out, 'apple-touch-icon.png'), 'wb').write(base64.b64decode(m.group(1)))
def flags(native_build):
    f = {'NETLIFY_FORMS': True, 'SITE_BUILD': not native_build, 'NATIVE_BUILD': native_build,
         'BEARING_SITE_URL': cfg['siteUrl'], 'BEARING_SYNC_URL': cfg['syncUrl'], 'BEARING_SYNC_KEY': cfg['syncKey']}
    return ' '.join('window.%s = %s;' % (k, json.dumps(v)) for k, v in f.items())
def prefix(native_build):
    return ('<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'
            '<meta name="robots" content="noindex">\n<script>' + flags(native_build) + '</script>\n<link rel="icon" href="favicon.ico" sizes="any">\n')
open(os.path.join(out, 'index.html'), 'w', encoding='utf-8').write(prefix(False) + html + '\n\n</body>\n</html>\n')
sw = """/* Offline cache for the workout log. Network first, so updates arrive when online; cache when not. */
const CACHE = 'wl-%s';
const ASSETS = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './icon-512-maskable.png', './apple-touch-icon.png', './favicon.svg', './favicon.ico'%s];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const req = e.request; if (req.method !== 'GET') return;
  let url; try { url = new URL(req.url); } catch (x) { return; }
  if (url.origin !== location.origin) return;
  e.respondWith(fetch(req).then(res => { if (res && res.ok && res.type === 'basic') { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); } return res; }).catch(() => caches.match(req).then(r => r || (req.mode === 'navigate' ? caches.match('./index.html') : undefined))));
});
""" % (ver, ''.join(", './%s'" % f for f in sounds))
open(os.path.join(out, 'sw.js'), 'w').write(sw)
# the native copy: no service worker; feedback is posted to the website; Capacitor fills in the rest
os.makedirs(native, exist_ok=True)
open(os.path.join(native, 'index.html'), 'w', encoding='utf-8').write(prefix(True) + html + '\n\n</body>\n</html>\n')
for f in ['apple-touch-icon.png', 'favicon.ico', 'favicon.svg', 'icon-192.png', 'icon-512.png']: shutil.copy(os.path.join('site_static', f), os.path.join(native, f))
for f in sounds: shutil.copy(os.path.join('sounds', f), os.path.join(native, f))
print('built', ver, '| site:', os.path.relpath(out, here), '| native:', os.path.relpath(native, here), '| accounts:', 'on' if cfg['syncKey'] else 'off (no syncKey)')
