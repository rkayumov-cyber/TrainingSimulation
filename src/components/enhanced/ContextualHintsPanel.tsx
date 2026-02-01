import { useContext } from "react";
import { Lightbulb, BookOpen, AlertCircle } from "lucide-react";
import { SimulationContext } from "../../context/SimulationContextDef";
import { getGuidelineForScenario } from "../../services/knowledge";

export function ContextualHintsPanel() {
  const context = useContext(SimulationContext);
  if (!context) return null;

  const { contextualHints, state, scenario } = context;
  const guideline = getGuidelineForScenario(scenario.id);

  if (!state.isRunning) {
    return (
      <div className="p-4 text-center text-slate-400">
        <Lightbulb className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p>Start a simulation to see clinical hints</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {/* Contextual Hints */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-slate-300 flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-yellow-400" />
          Clinical Hints
        </h3>

        {contextualHints.length > 0 ? (
          <div className="space-y-2">
            {contextualHints.map((hint, i) => (
              <div
                key={i}
                className={`p-3 rounded-lg text-sm ${
                  hint.includes("CRITICAL")
                    ? "bg-red-900/30 border border-red-900/50 text-red-200"
                    : "bg-slate-800 text-slate-300"
                }`}
              >
                {hint.includes("CRITICAL") && (
                  <AlertCircle className="w-4 h-4 text-red-400 inline mr-2" />
                )}
                {hint}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500">
            Take actions to receive contextual clinical guidance
          </p>
        )}
      </div>

      {/* Guideline Reference */}
      {guideline && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-slate-300 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-400" />
            {guideline.source}
          </h3>

          {/* Key Actions */}
          <div className="bg-slate-800 rounded-lg p-3">
            <h4 className="text-xs font-medium text-slate-400 mb-2">
              Key Actions
            </h4>
            <ul className="space-y-1">
              {guideline.keyActions.slice(0, 5).map((action, i) => {
                const isCompleted = state.actionsTaken.some((a) =>
                  action.toLowerCase().includes(a.replace(/_/g, " ")),
                );
                return (
                  <li
                    key={i}
                    className={`text-xs flex items-start gap-2 ${
                      isCompleted ? "text-emerald-400" : "text-slate-400"
                    }`}
                  >
                    <span
                      className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${
                        isCompleted
                          ? "border-emerald-400 bg-emerald-900/50"
                          : "border-slate-600"
                      }`}
                    >
                      {isCompleted && "✓"}
                    </span>
                    {action}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Sequence Recommendations */}
          <div className="bg-blue-900/20 rounded-lg p-3 border border-blue-900/50">
            <h4 className="text-xs font-medium text-blue-400 mb-2">
              Sequence Tips
            </h4>
            <ul className="space-y-1">
              {guideline.sequenceRecommendations.slice(0, 3).map((rec, i) => (
                <li key={i} className="text-xs text-blue-200">
                  • {rec}
                </li>
              ))}
            </ul>
          </div>

          {/* Contraindications */}
          {guideline.contraindications.length > 0 && (
            <div className="bg-red-900/20 rounded-lg p-3 border border-red-900/50">
              <h4 className="text-xs font-medium text-red-400 mb-2">
                Cautions
              </h4>
              <ul className="space-y-1">
                {guideline.contraindications.slice(0, 2).map((contra, i) => (
                  <li key={i} className="text-xs text-red-200">
                    • {contra}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
