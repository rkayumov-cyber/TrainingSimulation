import type { DemoStep } from "../../types/demo";

interface DemoStepTimelineProps {
  steps: DemoStep[];
  currentStepIndex: number;
  onJumpToStep: (index: number) => void;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function DemoStepTimeline({
  steps,
  currentStepIndex,
  onJumpToStep,
}: DemoStepTimelineProps) {
  return (
    <div className="space-y-1">
      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
        Timeline
      </h4>
      <div className="space-y-0.5 max-h-[300px] overflow-y-auto pr-1">
        {steps.map((step, idx) => {
          const isCurrent = idx === currentStepIndex;
          const isPast = idx < currentStepIndex;
          const hasAction = !!step.actionParsed;
          const hasError = step.feedbackLogs.some(
            (f) => f.type === "error" || f.type === "jargon",
          );

          return (
            <button
              key={step.id}
              onClick={() => onJumpToStep(idx)}
              className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-left transition-colors ${
                isCurrent
                  ? "bg-emerald-900/30 border border-emerald-700/40"
                  : isPast
                    ? "bg-slate-800/30 hover:bg-slate-800/50"
                    : "opacity-40 hover:opacity-60"
              }`}
            >
              <span className="text-xs font-mono text-slate-500 w-8 shrink-0">
                {formatTime(step.elapsedSeconds)}
              </span>
              <div
                className={`w-2 h-2 rounded-full shrink-0 ${
                  isCurrent
                    ? "bg-emerald-400"
                    : hasError
                      ? "bg-red-400"
                      : step.isCriticalAction
                        ? "bg-amber-400"
                        : hasAction
                          ? "bg-blue-400"
                          : "bg-slate-600"
                }`}
              />
              <span
                className={`text-xs truncate ${
                  isCurrent ? "text-white font-medium" : "text-slate-400"
                }`}
              >
                {step.actionParsed
                  ? step.actionParsed.replace(/_/g, " ")
                  : step.doctorMessage
                    ? step.doctorMessage.slice(0, 40) + (step.doctorMessage.length > 40 ? "..." : "")
                    : step.events[0]?.description || `Step ${idx + 1}`}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
