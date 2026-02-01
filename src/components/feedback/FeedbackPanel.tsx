import {
  AlertCircle,
  MessageSquareWarning,
  Info,
  AlertTriangle,
} from "lucide-react";
import { useSimulation } from "../../context";
import type { FeedbackLog } from "../../types";

function FeedbackIcon({ type }: { type: FeedbackLog["type"] }) {
  switch (type) {
    case "jargon":
      return <MessageSquareWarning className="w-4 h-4 text-amber-400" />;
    case "error":
      return <AlertCircle className="w-4 h-4 text-red-400" />;
    case "warning":
      return <AlertTriangle className="w-4 h-4 text-amber-400" />;
    case "info":
      return <Info className="w-4 h-4 text-blue-400" />;
    default:
      return <Info className="w-4 h-4 text-slate-400" />;
  }
}

function getFeedbackColor(type: FeedbackLog["type"]) {
  switch (type) {
    case "jargon":
      return "border-amber-800/50 bg-amber-950/30";
    case "error":
      return "border-red-800/50 bg-red-950/30";
    case "warning":
      return "border-amber-800/50 bg-amber-950/30";
    case "info":
      return "border-blue-800/50 bg-blue-950/30";
    default:
      return "border-slate-700 bg-slate-800/50";
  }
}

export function FeedbackPanel() {
  const { state } = useSimulation();

  const formatTime = (timestamp: number) => {
    const elapsed = timestamp - state.startTime;
    const seconds = Math.floor(elapsed / 1000);
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `+${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  // Show most recent feedback first
  const recentFeedback = [...state.feedbackLogs].reverse().slice(0, 10);

  if (recentFeedback.length === 0) return null;

  return (
    <div className="p-4 space-y-4 border-t border-slate-700">
      <h2 className="text-white font-semibold text-lg flex items-center gap-2">
        <MessageSquareWarning className="w-5 h-5 text-amber-400" />
        Feedback
        <span className="bg-amber-600 text-white text-xs px-2 py-0.5 rounded-full">
          {state.feedbackLogs.length}
        </span>
      </h2>

      <div className="space-y-2 max-h-48 overflow-y-auto">
        {recentFeedback.map((feedback) => (
          <div
            key={feedback.id}
            className={`${getFeedbackColor(feedback.type)} border rounded-lg p-3 flex items-start gap-3`}
          >
            <FeedbackIcon type={feedback.type} />
            <div className="flex-1 min-w-0">
              <p className="text-slate-200 text-sm">{feedback.message}</p>
              <span className="text-slate-500 text-xs font-mono">
                {formatTime(feedback.timestamp)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
