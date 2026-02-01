import { useContext } from "react";
import {
  Award,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { SimulationContext } from "../../context/SimulationContextDef";

export function ClinicalScorePanel() {
  const context = useContext(SimulationContext);
  if (!context) return null;

  const { clinicalScore, state } = context;

  if (!state.isRunning && !clinicalScore) {
    return (
      <div className="p-4 text-center text-slate-400">
        <Award className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p>Start a simulation to see clinical scoring</p>
      </div>
    );
  }

  if (!clinicalScore) {
    return (
      <div className="p-4 text-center text-slate-400">
        <p>Take some clinical actions to see your score</p>
      </div>
    );
  }

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "A":
        return "text-emerald-400";
      case "B":
        return "text-blue-400";
      case "C":
        return "text-yellow-400";
      case "D":
        return "text-orange-400";
      case "F":
        return "text-red-400";
      default:
        return "text-slate-400";
    }
  };

  const percentage = Math.round(
    (clinicalScore.totalScore / clinicalScore.maxPossibleScore) * 100,
  );

  return (
    <div className="p-4 space-y-4">
      {/* Overall Score */}
      <div className="bg-slate-800 rounded-lg p-4 text-center">
        <div
          className={`text-5xl font-bold ${getGradeColor(clinicalScore.grade)}`}
        >
          {clinicalScore.grade}
        </div>
        <div className="text-slate-400 text-sm mt-1">
          {clinicalScore.totalScore} / {clinicalScore.maxPossibleScore} points (
          {percentage}%)
        </div>
      </div>

      {/* Timing Scores */}
      <div className="bg-slate-800/50 rounded-lg p-3">
        <h4 className="text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Action Timing
        </h4>
        <div className="space-y-1">
          {Object.entries(clinicalScore.timingScores).map(([action, score]) => (
            <div key={action} className="flex justify-between text-xs">
              <span className="text-slate-400">
                {action.replace(/_/g, " ")}
              </span>
              <span className={getGradeColor(score.grade)}>
                {score.time !== null
                  ? `${Math.round(score.time)}s (${score.grade})`
                  : "Not done"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Sequencing */}
      <div className="bg-slate-800/50 rounded-lg p-3">
        <h4 className="text-sm font-medium text-slate-300 mb-2">
          Action Sequencing
        </h4>
        {clinicalScore.correctSequences.length > 0 && (
          <div className="space-y-1 mb-2">
            {clinicalScore.correctSequences.map((seq, i) => (
              <div
                key={i}
                className="flex items-start gap-2 text-xs text-emerald-400"
              >
                <CheckCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <span>{seq}</span>
              </div>
            ))}
          </div>
        )}
        {clinicalScore.sequencingErrors.length > 0 && (
          <div className="space-y-1">
            {clinicalScore.sequencingErrors.map((err, i) => (
              <div
                key={i}
                className="flex items-start gap-2 text-xs text-red-400"
              >
                <XCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <span>{err}</span>
              </div>
            ))}
          </div>
        )}
        {clinicalScore.correctSequences.length === 0 &&
          clinicalScore.sequencingErrors.length === 0 && (
            <p className="text-xs text-slate-500">
              No sequence rules evaluated yet
            </p>
          )}
      </div>

      {/* Actions Summary */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-emerald-900/30 rounded-lg p-2 text-center">
          <div className="text-lg font-bold text-emerald-400">
            {clinicalScore.appropriateActions}
          </div>
          <div className="text-xs text-slate-400">Appropriate</div>
        </div>
        <div className="bg-yellow-900/30 rounded-lg p-2 text-center">
          <div className="text-lg font-bold text-yellow-400">
            {clinicalScore.unnecessaryActions}
          </div>
          <div className="text-xs text-slate-400">Unnecessary</div>
        </div>
        <div className="bg-red-900/30 rounded-lg p-2 text-center">
          <div className="text-lg font-bold text-red-400">
            {clinicalScore.harmfulActions.length}
          </div>
          <div className="text-xs text-slate-400">Harmful</div>
        </div>
      </div>

      {/* Missed Critical Actions */}
      {clinicalScore.missedCriticalActions.length > 0 && (
        <div className="bg-red-900/20 rounded-lg p-3 border border-red-900/50">
          <h4 className="text-sm font-medium text-red-400 mb-2 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Missed Critical Actions
          </h4>
          <ul className="space-y-1">
            {clinicalScore.missedCriticalActions.map((action, i) => (
              <li key={i} className="text-xs text-red-300">
                • {action.replace(/_/g, " ")}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Communication Score */}
      <div className="bg-slate-800/50 rounded-lg p-3">
        <h4 className="text-sm font-medium text-slate-300 mb-1">
          Communication
        </h4>
        <div className="flex justify-between items-center">
          <span className="text-xs text-slate-400">
            Jargon instances: {clinicalScore.jargonCount}
          </span>
          <span className="text-xs text-slate-400">
            Clarity: {clinicalScore.clarityScore}%
          </span>
        </div>
      </div>
    </div>
  );
}
