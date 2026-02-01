import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { useDeteriorationTimer } from "../../hooks";
import { useSimulation } from "../../context";

export function DeteriorationTimers() {
  const { state } = useSimulation();
  const statuses = useDeteriorationTimer();

  if (!state.isRunning) return null;

  return (
    <div className="p-4 border-t border-slate-800">
      <h3 className="text-white font-semibold text-sm flex items-center gap-2 mb-3">
        <AlertTriangle className="w-4 h-4 text-amber-400" />
        Clinical Urgency
      </h3>

      <div className="space-y-2">
        {statuses.map((status) => (
          <div key={status.ruleId} className="text-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="text-slate-400 text-xs">{status.condition}</span>
              {status.isPrevented ? (
                <span className="flex items-center gap-1 text-emerald-400 text-xs">
                  <CheckCircle className="w-3 h-3" />
                  Addressed
                </span>
              ) : status.isTriggered ? (
                <span className="flex items-center gap-1 text-red-400 text-xs">
                  <XCircle className="w-3 h-3" />
                  Triggered
                </span>
              ) : (
                <span className="text-slate-500 text-xs">
                  {status.timerMinutes}min limit
                </span>
              )}
            </div>

            {/* Progress bar */}
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              {status.isPrevented ? (
                <div className="h-full bg-emerald-500 w-full" />
              ) : status.isTriggered ? (
                <div className="h-full bg-red-500 w-full" />
              ) : (
                <div
                  className={`h-full transition-all duration-1000 ${
                    status.progress > 75
                      ? "bg-red-500 animate-pulse"
                      : status.progress > 50
                        ? "bg-amber-500"
                        : "bg-blue-500"
                  }`}
                  style={{ width: `${status.progress}%` }}
                />
              )}
            </div>

            {/* Time remaining */}
            {!status.isPrevented &&
              !status.isTriggered &&
              status.progress > 0 && (
                <div className="text-right mt-1">
                  <span
                    className={`text-xs font-mono ${
                      status.progress > 75 ? "text-red-400" : "text-slate-500"
                    }`}
                  >
                    {Math.ceil(
                      status.timerMinutes * (1 - status.progress / 100) * 60,
                    )}
                    s remaining
                  </span>
                </div>
              )}
          </div>
        ))}
      </div>
    </div>
  );
}
