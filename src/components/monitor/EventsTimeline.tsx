import {
  ClipboardList,
  AlertTriangle,
  CheckCircle,
  TrendingDown,
  Activity,
} from "lucide-react";
import { useSimulation } from "../../context";
import type { ClinicalEvent } from "../../types";

function EventIcon({ type }: { type: ClinicalEvent["type"] }) {
  switch (type) {
    case "action":
      return <CheckCircle className="w-4 h-4 text-emerald-400" />;
    case "deterioration":
      return <TrendingDown className="w-4 h-4 text-red-400" />;
    case "improvement":
      return <Activity className="w-4 h-4 text-blue-400" />;
    case "alert":
      return <AlertTriangle className="w-4 h-4 text-amber-400" />;
    default:
      return <ClipboardList className="w-4 h-4 text-slate-400" />;
  }
}

function getEventColor(type: ClinicalEvent["type"]) {
  switch (type) {
    case "action":
      return "border-emerald-800 bg-emerald-950/30";
    case "deterioration":
      return "border-red-800 bg-red-950/30";
    case "improvement":
      return "border-blue-800 bg-blue-950/30";
    case "alert":
      return "border-amber-800 bg-amber-950/30";
    default:
      return "border-slate-700 bg-slate-800/50";
  }
}

export function EventsTimeline() {
  const { state } = useSimulation();

  const formatElapsed = (eventTime: number) => {
    const elapsed = eventTime - state.startTime;
    const seconds = Math.floor(elapsed / 1000);
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `+${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  // Show most recent events first
  const recentEvents = [...state.events].reverse().slice(0, 10);

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-white font-semibold text-lg flex items-center gap-2">
        <ClipboardList className="w-5 h-5 text-blue-400" />
        Events Timeline
      </h2>

      {recentEvents.length === 0 && (
        <div className="text-slate-500 text-sm text-center py-8">
          No events recorded yet
        </div>
      )}

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {recentEvents.map((event) => (
          <div
            key={event.id}
            className={`${getEventColor(event.type)} border rounded-lg p-3 flex items-start gap-3`}
          >
            <EventIcon type={event.type} />
            <div className="flex-1 min-w-0">
              <p className="text-slate-200 text-sm">{event.description}</p>
              <span className="text-slate-500 text-xs font-mono">
                {formatElapsed(event.timestamp)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
