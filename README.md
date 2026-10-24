# Bearing

A phone-first strength and cardio log with a built-in coach. One web page, no framework, no build step beyond concatenation. The same page ships three ways:

- the website (Netlify): https://bearing-beta.netlify.app
- the iOS app (App Store, unlisted) built by Codemagic from this repo
- an Android APK from the same Codemagic pipeline, handed out directly

## Layout

```
web/                 the app itself
  part1.html         styles and the page shell
  part2.js           data: exercise catalog, standards, coach engine, state and migrations
  part3.js           rendering, handlers, accounts and sync, native bridge
  config.json        web address, Supabase URL and publishable key (public values)
  site_static/       icons, manifest, Netlify headers, privacy.html, support.html
  build_site.py      builds everything (see below)
  mk_test.py         writes test.html with a hook for the Playwright tests
  sounds/            the rest-alert tones (.wav), rendered by tools/render_tones.js from the synth patches in part3.js
  tests/             Playwright scripts and a mock account service
  tools/             render_tones.js
www/                 built copy for the native apps (generated, committed so Codemagic needs no Python)
plugins/bearing-native/  Bearing's own Capacitor plugin (iOS): the alert sound, keep-awake, and the Live Activity bridge
ios/App/BearingWidgets/  the widget extension: the Live Activity (lock screen and Dynamic Island) in SwiftUI
ios/, android/       Capacitor projects (generated once, hand-edited settings kept)
assets/              icon and splash sources
capacitor.config.json
codemagic.yaml       the cloud build pipeline
```

## Building

```
python3 web/build_site.py
```

That writes `web/setlist.html` (the single-file app), `dist/site/` (the Netlify site) and `www/` (the native copy). Deploy the website by dragging `dist/site` onto the Netlify project, or by zipping it.

## Shipping a new app version

1. Bump `APP_VERSION` in `web/part2.js`.
2. For a store release also bump `MARKETING_VERSION` in `ios/App/App.xcodeproj/project.pbxproj` and `versionName` in `android/app/build.gradle`. Build numbers come from Codemagic automatically.
3. Run `python3 web/build_site.py` and commit `www/` with the source.
4. Push to `main`. Codemagic builds the iOS archive, signs it with the App Store Connect key kept in Codemagic, and uploads it to TestFlight. The Android workflow produces a debug APK as a build artifact.

## The rest alert

Settings under You: sound, vibration, both or nothing, and a choice of four tones. The tones are small synth patches in `part3.js`; the website plays them live through Web Audio, and `web/tools/render_tones.js` renders the same patches to `web/sounds/*.wav`, which `build_site.py` copies to the root of the site and of `www/`. The App Store app plays the file natively through `plugins/bearing-native` (AVAudioSession playback, mixed with other audio and ducking it), so it is heard with the ring switch on silent and through headphones. The lock-screen notification plays the same file; for vibration only it plays `silent.wav`, which carries the vibration without a sound. iOS plays no notification sound while the ring switch is on silent, whatever the app; that is a platform rule, not a setting. After changing a tone patch, run `python3 mk_test.py && node tools/render_tones.js` and rebuild.

## The Live Activity (iOS)

While a workout runs, the lock screen and the Dynamic Island show the exercise being worked on, what to do next ("Set 3 of 4 · 185 lb × 8", "Next: Incline press") and the rest countdown, with "Go" when the rest is over and "Paused" while paused. The web code builds that line (`liveLine`/`syncLive` in `part3.js`, sent through the plugin whenever it changes) and the SwiftUI views live in `ios/App/BearingWidgets`. `RestActivityAttributes.swift` exists in both the plugin and the extension and the two copies must stay identical; ActivityKit matches them by type name. The extension is its own target with bundle id `com.bengruver.bearing.BearingWidgets`, so it needs its own App Store provisioning profile in Codemagic (reference `bearing-widgets-app-store`); the `ios_signing` block picks it up by the bundle id prefix. iOS 16.2 or newer; older phones simply do not show it. The target was added with `ios/tools/add_widget_target.js`, since there is no Xcode in the loop.

## Accounts and sync

When `config.json` has a `syncKey`, an account is required: the app opens on a sign-in screen, and the whole log syncs as one row per user in the Supabase table `bearing_state` (row-level security: each user reads and writes only their own row). The key is Supabase's publishable key, which is meant to be public; the user's own session token is what grants access. Without a key the account features are hidden and the app is local-only.

Supabase setup lives in the project dashboard: the table and the `delete_user` function (SQL), email sign-in with "Confirm email" off, and the Site URL set to the web address so password-reset links land on the site.

## Secrets

None are in this repo. The App Store Connect API key (.p8) lives only in Codemagic. Netlify form submissions (the in-app feedback) go to the Netlify dashboard.

## Tests

```
cd web && python3 build_site.py && python3 mk_test.py
cd tests && node shot81.js                 # smoke test
(node mock_sync.js &) && node shot84.js    # required accounts against the mock service
node shot83.js                             # native bridge with a fake Capacitor (needs the mock too)
node shot85.js                             # the rest alert: settings, tones, notification sound, native player
node shot86.js                             # the Live Activity bridge and the pause fix
```
