import { FlaskConical, Clock, CheckCircle, Loader } from "lucide-react";
import { useSimulation } from "../../context";

export function LabsPanel() {
  const { state } = useSimulation();

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-white font-semibold text-lg flex items-center gap-2">
        <FlaskConical className="w-5 h-5 text-purple-400" />
        Laboratory
      </h2>

      {state.labsOrdered.length === 0 && state.labsCompleted.length === 0 && (
        <div className="text-slate-500 text-sm text-center py-8">
          No labs ordered yet
        </div>
      )}

      {/* Pending Labs */}
      {state.labsOrdered.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-slate-400 text-xs uppercase tracking-wide flex items-center gap-2">
            <Clock className="w-3 h-3" />
            Pending
          </h3>
          {state.labsOrdered.map((lab) => (
            <div
              key={lab.id}
              className="bg-amber-950/30 border border-amber-800/50 rounded-lg p-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-amber-300 font-medium">{lab.name}</span>
                <div className="flex items-center gap-2 text-amber-400">
                  <Loader className="w-4 h-4 animate-spin" />
                  <span className="text-xs">Processing</span>
                </div>
              </div>
              <span className="text-slate-500 text-xs">
                Ordered at {formatTime(lab.orderedAt)}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Completed Labs */}
      {state.labsCompleted.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-slate-400 text-xs uppercase tracking-wide flex items-center gap-2">
            <CheckCircle className="w-3 h-3" />
            Results
          </h3>
          {state.labsCompleted.map((lab) => (
            <div
              key={lab.id}
              className="bg-emerald-950/30 border border-emerald-800/50 rounded-lg p-3"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-emerald-300 font-medium">{lab.name}</span>
                <CheckCircle className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-slate-300 text-sm">{lab.result}</p>
              {lab.completedAt && (
                <span className="text-slate-500 text-xs">
                  Completed at {formatTime(lab.completedAt)}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
