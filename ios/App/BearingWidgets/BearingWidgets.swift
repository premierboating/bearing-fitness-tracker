import ActivityKit
import SwiftUI
import WidgetKit

/*
 The Live Activity for a workout in progress: the rest countdown, the exercise being worked on and what to do next,
 on the lock screen and in the Dynamic Island. The app starts, updates and ends it through plugins/bearing-native.
 */
@main
struct BearingWidgetsBundle: WidgetBundle {
    var body: some Widget {
        RestActivityWidget()
    }
}

private let sage = Color(red: 143 / 255, green: 162 / 255, blue: 113 / 255)
private let ink = Color(red: 17 / 255, green: 19 / 255, blue: 15 / 255)

struct RestActivityWidget: Widget {
    var body: some WidgetConfiguration {
        ActivityConfiguration(for: RestActivityAttributes.self) { context in
            LockScreenView(context: context)
                .activityBackgroundTint(ink)
                .activitySystemActionForegroundColor(sage)
        } dynamicIsland: { context in
            DynamicIsland {
                DynamicIslandExpandedRegion(.leading) {
                    VStack(alignment: .leading, spacing: 2) {
                        Text(context.attributes.workout.uppercased())
                            .font(.caption2).tracking(0.8).foregroundStyle(sage)
                        Text(context.state.exercise)
                            .font(.headline).lineLimit(2)
                    }
                    .padding(.leading, 4)
                }
                DynamicIslandExpandedRegion(.trailing) {
                    Clock(state: context.state, stale: context.isStale, size: 26)
                        .padding(.trailing, 4)
                }
                DynamicIslandExpandedRegion(.bottom) {
                    VStack(alignment: .leading, spacing: 6) {
                        RestBar(state: context.state, stale: context.isStale)
                        Text(context.state.detail)
                            .font(.subheadline).foregroundStyle(.secondary).lineLimit(1)
                    }
                    .padding(.horizontal, 4)
                }
            } compactLeading: {
                Image(systemName: "figure.strengthtraining.traditional")
                    .foregroundStyle(sage)
            } compactTrailing: {
                Clock(state: context.state, stale: context.isStale, size: 14)
                    .frame(width: 50)
            } minimal: {
                if context.state.restEnd != nil && !context.state.done && !context.isStale {
                    Clock(state: context.state, stale: context.isStale, size: 11)
                        .frame(width: 34)
                } else {
                    Image(systemName: "figure.strengthtraining.traditional")
                        .foregroundStyle(sage)
                }
            }
            .keylineTint(sage)
        }
    }
}

/* The big number: the rest countdown while a rest runs, "Go" when it is over, "Paused" while paused, otherwise the workout clock. */
struct Clock: View {
    let state: RestActivityAttributes.ContentState
    let stale: Bool
    let size: CGFloat

    var body: some View {
        Group {
            if state.paused {
                Text("Paused").foregroundStyle(.secondary)
            } else if let start = state.restStart, let end = state.restEnd, start < end, !state.done, !stale, end > Date() {
                Text(timerInterval: start...end, countsDown: true, showsHours: false)
            } else if state.restEnd != nil || state.done {
                Text("Go").foregroundStyle(sage)
            } else {
                Text(timerInterval: state.started...Date.distantFuture, countsDown: false, showsHours: true)
                    .foregroundStyle(.secondary)
            }
        }
        .font(.system(size: size, weight: .semibold, design: .rounded))
        .monospacedDigit()
        .multilineTextAlignment(.trailing)
        .lineLimit(1)
        .minimumScaleFactor(0.6)
    }
}

/* The rest bar fills as the rest passes; it is hidden when nothing is running. */
struct RestBar: View {
    let state: RestActivityAttributes.ContentState
    let stale: Bool

    var body: some View {
        if let start = state.restStart, let end = state.restEnd, start < end, !state.paused, !state.done, !stale, end > Date() {
            ProgressView(timerInterval: start...end, countsDown: false, label: { EmptyView() }, currentValueLabel: { EmptyView() })
                .progressViewStyle(.linear)
                .tint(sage)
        }
    }
}

struct LockScreenView: View {
    let context: ActivityViewContext<RestActivityAttributes>

    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            HStack(alignment: .center, spacing: 12) {
                VStack(alignment: .leading, spacing: 3) {
                    Text(context.attributes.workout.uppercased())
                        .font(.caption2).tracking(0.8).foregroundStyle(sage)
                    Text(context.state.exercise)
                        .font(.title3.weight(.semibold)).lineLimit(1)
                    Text(context.state.detail)
                        .font(.subheadline).foregroundStyle(.secondary).lineLimit(1)
                }
                Spacer(minLength: 8)
                Clock(state: context.state, stale: context.isStale, size: 34)
            }
            RestBar(state: context.state, stale: context.isStale)
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 14)
        .foregroundStyle(.white)
    }
}
