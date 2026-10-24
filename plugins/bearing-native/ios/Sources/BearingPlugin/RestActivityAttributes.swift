import ActivityKit
import Foundation

/*
 What the Live Activity knows about the workout in progress. The same file lives in the app (plugins/bearing-native) and in the
 widget extension; ActivityKit matches the two by the type name, so the two copies must stay identical.
 */
@available(iOS 16.2, *)
struct RestActivityAttributes: ActivityAttributes {
    public struct ContentState: Codable, Hashable {
        /// the exercise being worked on
        var exercise: String
        /// what to do next, already worded: "Set 3 of 4 · 185 lb × 8", "Next: Incline press", "All sets done"
        var detail: String
        /// when the running rest started and ends; nil when no rest is running
        var restStart: Date?
        var restEnd: Date?
        /// the workout is paused (the countdown is frozen in the app)
        var paused: Bool
        /// the rest is over and the person has not started the next set yet
        var done: Bool
        /// when the workout started, pauses excluded, for the elapsed clock
        var started: Date
    }

    /// the routine's name, fixed for the whole activity
    var workout: String
}
