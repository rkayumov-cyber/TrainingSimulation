import { User, Stethoscope, Volume2 } from "lucide-react";
import type { DemoStep } from "../../types/demo";

interface DemoStepChatProps {
  steps: DemoStep[];
  currentStepIndex: number;
  ttsEnabled?: boolean;
  onSpeakMessage?: (text: string) => void;
  speakingMessageId?: string | null;
}

export function DemoStepChat({
  steps,
  currentStepIndex,
  ttsEnabled,
  onSpeakMessage,
  speakingMessageId,
}: DemoStepChatProps) {
  const visibleSteps = steps.slice(0, currentStepIndex + 1);

  return (
    <div className="flex flex-col gap-3">
      {visibleSteps.map((step) => (
        <div key={step.id} className="space-y-2">
          {step.doctorMessage && (
            <div className="flex gap-2 items-start">
              <div className="w-7 h-7 rounded-full bg-emerald-600/20 flex items-center justify-center shrink-0 mt-0.5">
                <Stethoscope className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="bg-emerald-900/30 border border-emerald-800/40 rounded-lg rounded-tl-sm px-3 py-2 text-sm text-emerald-100 max-w-[85%]">
                {step.doctorMessage}
              </div>
              {ttsEnabled && onSpeakMessage && (
                <button
                  onClick={() => onSpeakMessage(step.doctorMessage!)}
                  className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 hover:bg-slate-700/50 transition-colors"
                  title="Speak this message"
                >
                  <Volume2
                    className={`w-3 h-3 ${
                      speakingMessageId === `doc-${step.id}`
                        ? "text-emerald-400 animate-pulse"
                        : "text-slate-500 hover:text-slate-300"
                    }`}
                  />
                </button>
              )}
            </div>
          )}
          {step.patientResponse && (
            <div className="flex gap-2 items-start justify-end">
              {ttsEnabled && onSpeakMessage && (
                <button
                  onClick={() => onSpeakMessage(step.patientResponse!)}
                  className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 hover:bg-slate-700/50 transition-colors"
                  title="Speak this message"
                >
                  <Volume2
                    className={`w-3 h-3 ${
                      speakingMessageId === `pat-${step.id}`
                        ? "text-blue-400 animate-pulse"
                        : "text-slate-500 hover:text-slate-300"
                    }`}
                  />
                </button>
              )}
              <div className="bg-slate-800 border border-slate-700 rounded-lg rounded-tr-sm px-3 py-2 text-sm text-slate-200 max-w-[85%]">
                {step.patientResponse}
              </div>
              <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
              </div>
            </div>
          )}
          {step.actionParsed && (
            <div className="flex justify-center">
              <div
                className={`text-xs px-3 py-1 rounded-full border ${
                  step.isCriticalAction
                    ? "bg-amber-900/30 border-amber-700/40 text-amber-300"
                    : "bg-slate-800/60 border-slate-700 text-slate-400"
                }`}
              >
                {step.isCriticalAction && "★ "}
                {step.actionParsed.replace(/_/g, " ")}
                {step.scoringImpact && (
                  <span
                    className={`ml-1.5 font-mono ${
                      step.scoringImpact.pointsEarned >= 0
                        ? "text-emerald-400"
                        : "text-red-400"
                    }`}
                  >
                    {step.scoringImpact.pointsEarned >= 0 ? "+" : ""}
                    {step.scoringImpact.pointsEarned}pts
                  </span>
                )}
              </div>
            </div>
          )}
          {step.actionFeedback && (
            <div className="flex justify-center">
              <p className="text-xs text-slate-500 italic max-w-[80%] text-center">
                {step.actionFeedback}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
