# bearing-native

Bearing's own Capacitor plugin, kept in the repo and installed from `file:plugins/bearing-native`. `npx cap sync ios` picks it up like any other plugin (Package.swift and the plugin class list are regenerated), so there is nothing to click in Xcode.

From the web code it is `Capacitor.Plugins.Bearing`:

- `play({name: 'chime.wav'})` plays a file from the web assets (`www/`, which lands in the app bundle as `public/`) through the media output: over the ring/silent switch, through headphones when connected, mixed with other audio, which ducks while the sound plays. Resolves with `{route, routeName, volume, duration}`.
- `keepAwake({on: true})` keeps the screen on.

iOS only. On Android the web code falls back to Web Audio and the Screen Wake Lock API, which the Android WebView supports.
