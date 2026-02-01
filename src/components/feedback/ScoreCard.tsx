import {
  Trophy,
  Clock,
  MessageSquareWarning,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useSimulation } from "../../context";

export function ScoreCard() {
  const { state, elapsedTime } = useSimulation();

  // Only show when simulation has ended
  if (state.isRunning) return null;
  if (state.score.totalActions === 0) return null;

  const formatDuration = (ms: number | null) => {
    if (ms === null) return "Not done";
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  const getTimeGrade = (ms: number | null, targetMinutes: number) => {
    if (ms === null) return { grade: "F", color: "text-red-400" };
    const minutes = ms / (1000 * 60);
    if (minutes <= targetMinutes)
      return { grade: "A", color: "text-emerald-400" };
    if (minutes <= targetMinutes * 1.5)
      return { grade: "B", color: "text-blue-400" };
    if (minutes <= targetMinutes * 2)
      return { grade: "C", color: "text-amber-400" };
    return { grade: "D", color: "text-red-400" };
  };

  const oxygenGrade = getTimeGrade(state.score.timeToOxygen, 2);
  const fluidsGrade = getTimeGrade(state.score.timeToFluids, 3);
  const antibioticsGrade = getTimeGrade(state.score.timeToAntibiotics, 10);

  const jargonCount = state.feedbackLogs.filter(
    (f) => f.type === "jargon",
  ).length;

  return (
    <div className="fixed inset-0 bg-slate-950/90 flex items-center justify-center z-50">
      <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 max-w-lg w-full mx-4 shadow-2xl">
        <div className="text-center mb-6">
          <Trophy className="w-12 h-12 text-amber-400 mx-auto mb-2" />
          <h2 className="text-2xl font-bold text-white">Simulation Complete</h2>
          <p className="text-slate-400">
            Total time: {formatDuration(elapsedTime)}
          </p>
        </div>

        <div className="space-y-4">
          {/* Sepsis Bundle Times */}
          <div className="bg-slate-800 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-400" />
              Sepsis Bundle Timing
            </h3>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Time to Oxygen</span>
                <div className="flex items-center gap-2">
                  <span className="text-white font-mono">
                    {formatDuration(state.score.timeToOxygen)}
                  </span>
                  <span className={`font-bold ${oxygenGrade.color}`}>
                    {oxygenGrade.grade}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Time to IV Fluids</span>
                <div className="flex items-center gap-2">
                  <span className="text-white font-mono">
                    {formatDuration(state.score.timeToFluids)}
                  </span>
                  <span className={`font-bold ${fluidsGrade.color}`}>
                    {fluidsGrade.grade}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Time to Antibiotics</span>
                <div className="flex items-center gap-2">
                  <span className="text-white font-mono">
                    {formatDuration(state.score.timeToAntibiotics)}
                  </span>
                  <span className={`font-bold ${antibioticsGrade.color}`}>
                    {antibioticsGrade.grade}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Communication Score */}
          <div className="bg-slate-800 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <MessageSquareWarning className="w-4 h-4 text-amber-400" />
              Communication
            </h3>

            <div className="flex items-center justify-between">
              <span className="text-slate-400">Jargon instances detected</span>
              <div className="flex items-center gap-2">
                <span className="text-white font-mono">{jargonCount}</span>
                {jargonCount === 0 ? (
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                ) : (
                  <XCircle className="w-4 h-4 text-amber-400" />
                )}
              </div>
            </div>
          </div>

          {/* Actions Summary */}
          <div className="bg-slate-800 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              Actions Taken
            </h3>

            <div className="flex flex-wrap gap-2">
              {state.actionsTaken.map((action, idx) => (
                <span
                  key={idx}
                  className="bg-emerald-900/50 text-emerald-300 text-xs px-2 py-1 rounded"
                >
                  {action.replace(/_/g, " ")}
                </span>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-slate-500 text-sm mt-6">
          Press Reset to try again
        </p>
      </div>
    </div>
  );
}
