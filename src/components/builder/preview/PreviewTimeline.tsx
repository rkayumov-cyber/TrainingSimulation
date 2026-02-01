import type { DeteriorationRule } from "../../../types";

interface PreviewTimelineProps {
  rules: DeteriorationRule[];
  elapsedMs: number;
  actionsTaken: string[];
}

export function PreviewTimeline({
  rules,
  elapsedMs,
  actionsTaken,
}: PreviewTimelineProps) {
  const elapsedMinutes = elapsedMs / 60000;

  return (
    <div className="space-y-2">
      <h4 className="text-xs text-slate-400 uppercase font-medium">
        Deterioration Timeline
      </h4>
      {rules.length === 0 && (
        <p className="text-xs text-slate-600">No deterioration rules.</p>
      )}
      {rules.map((rule) => {
        const isPrevented = rule.preventedBy.some((a) =>
          actionsTaken.includes(a),
        );
        const isTriggered = rule.triggered;
        const progress = Math.min(1, elapsedMinutes / rule.timerMinutes);

        let barColor = "bg-amber-500";
        let statusText = `${Math.max(0, rule.timerMinutes - elapsedMinutes).toFixed(1)}m remaining`;

        if (isPrevented) {
          barColor = "bg-emerald-500";
          statusText = "Prevented";
        } else if (isTriggered) {
          barColor = "bg-red-500";
          statusText = "Triggered";
        }

        return (
          <div key={rule.id} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 truncate">
                {rule.condition || rule.id}
              </span>
              <span
                className={`shrink-0 ml-2 ${
                  isPrevented
                    ? "text-emerald-400"
                    : isTriggered
                      ? "text-red-400"
                      : "text-amber-400"
                }`}
              >
                {statusText}
              </span>
            </div>
            <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                style={{ width: `${progress * 100}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
