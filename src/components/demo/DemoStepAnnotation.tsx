import { BookOpen, AlertTriangle, Star, MessageCircle } from "lucide-react";
import type { DemoStep } from "../../types/demo";

interface DemoStepAnnotationProps {
  step: DemoStep;
}

export function DemoStepAnnotation({ step }: DemoStepAnnotationProps) {
  if (
    !step.annotation &&
    !step.communicationNote &&
    step.feedbackLogs.length === 0 &&
    !step.scoringImpact
  )
    return null;

  return (
    <div className="space-y-2">
      {step.communicationNote && (
        <div className="bg-violet-900/20 border border-violet-800/30 rounded-lg p-3">
          <div className="flex items-center gap-1.5 mb-1.5">
            <MessageCircle className="w-3.5 h-3.5 text-violet-400" />
            <span className="text-xs font-semibold text-violet-400 uppercase tracking-wide">
              Communication Note
            </span>
          </div>
          <p className="text-sm text-violet-100/90 leading-relaxed">
            {step.communicationNote}
          </p>
        </div>
      )}

      {step.annotation && (
        <div className="bg-indigo-900/20 border border-indigo-800/30 rounded-lg p-3">
          <div className="flex items-center gap-1.5 mb-1.5">
            <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wide">
              Teaching Note
            </span>
          </div>
          <p className="text-sm text-indigo-100/90 leading-relaxed">
            {step.annotation}
          </p>
        </div>
      )}

      {step.scoringImpact && (
        <div
          className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
            step.scoringImpact.pointsEarned >= 0
              ? "bg-emerald-900/20 border-emerald-800/30"
              : "bg-red-900/20 border-red-800/30"
          }`}
        >
          <Star
            className={`w-3.5 h-3.5 ${
              step.scoringImpact.pointsEarned >= 0
                ? "text-emerald-400"
                : "text-red-400"
            }`}
          />
          <span
            className={`text-sm font-mono font-bold ${
              step.scoringImpact.pointsEarned >= 0
                ? "text-emerald-400"
                : "text-red-400"
            }`}
          >
            {step.scoringImpact.pointsEarned >= 0 ? "+" : ""}
            {step.scoringImpact.pointsEarned}pts
          </span>
          <span className="text-sm text-slate-300">
            {step.scoringImpact.reason}
          </span>
        </div>
      )}

      {step.feedbackLogs.length > 0 && (
        <div className="space-y-1">
          {step.feedbackLogs.map((log) => (
            <div
              key={log.id}
              className={`flex items-start gap-2 px-3 py-1.5 rounded text-xs ${
                log.type === "error"
                  ? "bg-red-900/20 text-red-300"
                  : log.type === "jargon"
                    ? "bg-amber-900/20 text-amber-300"
                    : log.type === "warning"
                      ? "bg-orange-900/20 text-orange-300"
                      : "bg-slate-800/50 text-slate-400"
              }`}
            >
              {(log.type === "error" || log.type === "jargon") && (
                <AlertTriangle className="w-3 h-3 shrink-0 mt-0.5" />
              )}
              <span>{log.message}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
