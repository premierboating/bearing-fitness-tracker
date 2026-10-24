import Foundation
import AVFoundation
import UIKit
import Capacitor
import ActivityKit

/*
 Bearing's own native bits, reachable from the web code as Capacitor.Plugins.Bearing.

 play({name})      Plays a sound file shipped with the web assets (public/<name>) through the phone's media output:
                   over the ring/silent switch, through headphones or earbuds when they are connected, mixed with
                   whatever else is playing, which is turned down for the moment the sound lasts and then restored.
                   Resolves with the output route and the media volume so the app can tell the person what happened.
 keepAwake({on})   Keeps the screen on while a workout is running.
 liveActivity({action, workout, started, exercise, detail, restStart, restEnd, paused, done})
                   Starts or updates the Live Activity for the workout in progress (lock screen and Dynamic Island),
                   or ends it with action "end". Times are milliseconds since 1970, as JavaScript hands them over.
 */
@objc(BearingPlugin)
public class BearingPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "BearingPlugin"
    public let jsName = "Bearing"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "play", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "keepAwake", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "liveActivity", returnType: CAPPluginReturnPromise)
    ]
    private var player: AVAudioPlayer?
    private var releaseWork: DispatchWorkItem?

    @objc public func play(_ call: CAPPluginCall) {
        let name = call.getString("name") ?? "chime.wav"
        guard name.range(of: "^[A-Za-z0-9_-]+\\.(wav|caf|aiff|m4a|mp3)$", options: .regularExpression) != nil,
              let base = Bundle.main.resourcePath else {
            call.reject("bad sound name")
            return
        }
        let url = URL(fileURLWithPath: base).appendingPathComponent("public").appendingPathComponent(name)
        guard FileManager.default.fileExists(atPath: url.path) else {
            call.reject("missing sound: " + name)
            return
        }
        DispatchQueue.main.async {
            let session = AVAudioSession.sharedInstance()
            do {
                try session.setCategory(.playback, mode: .default, options: [.mixWithOthers, .duckOthers])
                try session.setActive(true)
            } catch {
                // keep going: the player may still manage with whatever category is active
            }
            do {
                let p = try AVAudioPlayer(contentsOf: url)
                p.volume = 1.0
                p.prepareToPlay()
                p.play()
                self.player = p
                self.releaseWork?.cancel()
                let work = DispatchWorkItem { [weak self] in self?.release() }
                self.releaseWork = work
                DispatchQueue.main.asyncAfter(deadline: .now() + p.duration + 0.25, execute: work)
                let out = session.currentRoute.outputs.first
                call.resolve([
                    "route": out?.portType.rawValue ?? "",
                    "routeName": out?.portName ?? "",
                    "volume": Double(session.outputVolume),
                    "duration": p.duration
                ])
            } catch {
                self.release()
                call.reject("could not play: " + error.localizedDescription)
            }
        }
    }

    /* Done playing: let go of the session so other audio comes back up to full volume. */
    private func release() {
        player = nil
        releaseWork = nil
        try? AVAudioSession.sharedInstance().setActive(false, options: [.notifyOthersOnDeactivation])
    }

    @objc public func keepAwake(_ call: CAPPluginCall) {
        let on = call.getBool("on") ?? true
        DispatchQueue.main.async {
            UIApplication.shared.isIdleTimerDisabled = on
            call.resolve(["on": on])
        }
    }

    /* The Live Activity mirrors the workout: one activity at a time, updated whenever the app has something new to show. */
    @objc public func liveActivity(_ call: CAPPluginCall) {
        guard #available(iOS 16.2, *) else {
            call.resolve(["active": false, "supported": false])
            return
        }
        let action = call.getString("action") ?? "update"
        if action == "end" {
            Task {
                for activity in Activity<RestActivityAttributes>.activities {
                    await activity.end(nil, dismissalPolicy: .immediate)
                }
                call.resolve(["active": false])
            }
            return
        }
        guard ActivityAuthorizationInfo().areActivitiesEnabled else {
            call.resolve(["active": false, "enabled": false])
            return
        }
        let date = { (key: String) -> Date? in
            if let ms = call.getDouble(key), ms > 0 { return Date(timeIntervalSince1970: ms / 1000) }
            return nil
        }
        let state = RestActivityAttributes.ContentState(
            exercise: call.getString("exercise") ?? "",
            detail: call.getString("detail") ?? "",
            restStart: date("restStart"),
            restEnd: date("restEnd"),
            paused: call.getBool("paused") ?? false,
            done: call.getBool("done") ?? false,
            started: date("started") ?? Date()
        )
        let content = ActivityContent(state: state, staleDate: state.restEnd)
        let attributes = RestActivityAttributes(workout: call.getString("workout") ?? "Workout")
        Task {
            let running = Activity<RestActivityAttributes>.activities
            if let activity = running.first {
                await activity.update(content)
                for extra in running.dropFirst() { await extra.end(nil, dismissalPolicy: .immediate) }
                call.resolve(["active": true])
            } else {
                do {
                    _ = try Activity<RestActivityAttributes>.request(attributes: attributes, content: content, pushType: nil)
                    call.resolve(["active": true])
                } catch {
                    call.reject("live activity: " + error.localizedDescription)
                }
            }
        }
    }
}
