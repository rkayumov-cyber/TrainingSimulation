import { Check } from "lucide-react";
import { BUILDER_STEPS, type BuilderStep } from "../../types/scenarioBuilder";

interface ScenarioBuilderStepperProps {
  currentStep: BuilderStep;
  completedSteps: Set<BuilderStep>;
  onStepClick: (step: BuilderStep) => void;
}

export function ScenarioBuilderStepper({
  currentStep,
  completedSteps,
  onStepClick,
}: ScenarioBuilderStepperProps) {
  return (
    <nav className="flex items-center gap-1 px-6 py-3 bg-slate-900 border-b border-slate-700 overflow-x-auto">
      {BUILDER_STEPS.map((step, idx) => {
        const isActive = step.key === currentStep;
        const isComplete = completedSteps.has(step.key);
        const stepNum = idx + 1;

        return (
          <div key={step.key} className="flex items-center">
            {idx > 0 && (
              <div
                className={`w-6 h-px mx-1 ${
                  isComplete ? "bg-emerald-500" : "bg-slate-700"
                }`}
              />
            )}
            <button
              onClick={() => onStepClick(step.key)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                isActive
                  ? "bg-emerald-600/20 text-emerald-400 border border-emerald-500/30"
                  : isComplete
                    ? "bg-slate-800 text-emerald-400 hover:bg-slate-750"
                    : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-slate-300"
              }`}
            >
              {isComplete && !isActive ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                    isActive
                      ? "bg-emerald-500 text-white"
                      : "bg-slate-700 text-slate-400"
                  }`}
                >
                  {stepNum}
                </span>
              )}
              {step.label}
            </button>
          </div>
        );
      })}
    </nav>
  );
}
