import { useState, useEffect } from "react";
import {
  Play,
  Clock,
  Target,
  Heart,
  Wind,
  Brain,
  Thermometer,
  Syringe,
  Droplets,
  Ambulance,
  Baby,
  HeartPulse,
  HeartOff,
  Skull,
  Wrench,
  BookOpen,
} from "lucide-react";
import { TraineeHeader } from "./TraineeHeader";
import { getAllScenarios } from "../../scenarios";
import {
  getScenarioProgress,
  getSessionSummaries,
} from "../../services/persistence";
import { isDemoSession } from "../../services/demo";
import type { ScenarioDefinition } from "../../types";
import type { ScenarioProgress, SessionSummary } from "../../types/session";

interface TraineeHomePageProps {
  onStartSimulation: (scenario: ScenarioDefinition) => void;
  onViewProgress: () => void;
  onViewDemos?: () => void;
}

function getScenarioIcon(id: string) {
  if (id.includes("mi")) return <Heart className="w-5 h-5" />;
  if (id.includes("anaphylaxis")) return <Syringe className="w-5 h-5" />;
  if (id.includes("asthma")) return <Wind className="w-5 h-5" />;
  if (id.includes("stroke")) return <Brain className="w-5 h-5" />;
  if (id.includes("dka")) return <Droplets className="w-5 h-5" />;
  if (id.includes("trauma")) return <Ambulance className="w-5 h-5" />;
  if (id.includes("peds-seizure")) return <Baby className="w-5 h-5" />;
  if (id.includes("eclampsia")) return <HeartPulse className="w-5 h-5" />;
  if (id.includes("cardiac-arrest")) return <HeartOff className="w-5 h-5" />;
  if (id.includes("overdose")) return <Skull className="w-5 h-5" />;
  if (id.startsWith("custom-")) return <Wrench className="w-5 h-5" />;
  return <Thermometer className="w-5 h-5" />;
}

function getScenarioColor(id: string) {
  if (id.includes("mi")) return "text-red-400";
  if (id.includes("anaphylaxis")) return "text-amber-400";
  if (id.includes("asthma")) return "text-blue-400";
  if (id.includes("stroke")) return "text-purple-400";
  if (id.includes("dka")) return "text-cyan-400";
  if (id.includes("trauma")) return "text-orange-400";
  if (id.includes("peds-seizure")) return "text-pink-400";
  if (id.includes("eclampsia")) return "text-rose-400";
  if (id.includes("cardiac-arrest")) return "text-red-500";
  if (id.includes("overdose")) return "text-violet-400";
  if (id.startsWith("custom-")) return "text-teal-400";
  return "text-emerald-400";
}

export function TraineeHomePage({
  onStartSimulation,
  onViewProgress,
  onViewDemos,
}: TraineeHomePageProps) {
  const [progressMap, setProgressMap] = useState<
    Record<string, ScenarioProgress>
  >({});
  const [recentSessions, setRecentSessions] = useState<SessionSummary[]>([]);
  const scenarios = getAllScenarios();

  useEffect(() => {
    getScenarioProgress().then((progress) => {
      const map: Record<string, ScenarioProgress> = {};
      for (const p of progress) {
        map[p.scenarioId] = p;
      }
      setProgressMap(map);
    });
    getSessionSummaries().then((summaries) => {
      setRecentSessions(summaries.slice(0, 5));
    });
  }, []);

  const gradeColor = (grade: string) => {
    switch (grade) {
      case "A":
        return "text-emerald-400";
      case "B":
        return "text-blue-400";
      case "C":
        return "text-amber-400";
      case "D":
        return "text-orange-400";
      default:
        return "text-red-400";
    }
  };

  return (
    <div className="h-screen bg-slate-950 text-white flex flex-col">
      <TraineeHeader onViewProgress={onViewProgress} />

      <div className="flex-1 overflow-y-auto">
        {/* Welcome */}
        <div className="px-6 py-6 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">
                Available Scenarios
              </h2>
              <p className="text-slate-400 text-sm">
                Select a clinical scenario to begin your simulation
              </p>
            </div>
            {onViewDemos && (
              <button
                onClick={onViewDemos}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors text-sm font-medium"
              >
                <BookOpen className="w-4 h-4" />
                View Demos
              </button>
            )}
          </div>
        </div>

        {/* Scenario Grid */}
        <div className="px-6 py-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {scenarios.map((scenario) => {
              const progress = progressMap[scenario.id];
              return (
                <button
                  key={scenario.id}
                  onClick={() => onStartSimulation(scenario)}
                  className="text-left bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-slate-600 transition-colors group"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 ${getScenarioColor(scenario.id)}`}
                    >
                      {getScenarioIcon(scenario.id)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-medium text-sm group-hover:text-emerald-400 transition-colors">
                        {scenario.name}
                      </h3>
                      <p className="text-slate-500 text-xs mt-0.5 line-clamp-2">
                        {scenario.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-800">
                    {progress ? (
                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <Target className="w-3 h-3" />
                          {progress.attempts} attempts
                        </span>
                        <span
                          className={`font-medium ${gradeColor(progress.bestGrade)}`}
                        >
                          Best: {progress.bestGrade}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-600">
                        Not attempted
                      </span>
                    )}
                    <div className="flex items-center gap-1 text-xs text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-3 h-3" />
                      Start
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Recent Sessions */}
        {recentSessions.length > 0 && (
          <div className="px-6 py-5 border-t border-slate-800">
            <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-500" />
              Recent Sessions
            </h3>
            <div className="space-y-2">
              {recentSessions.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center gap-3 bg-slate-900/50 border border-slate-800 rounded-lg px-3 py-2"
                >
                  <span className={`text-lg font-bold ${gradeColor(s.grade)}`}>
                    {s.grade}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-white text-sm truncate">
                        {s.scenarioName}
                      </p>
                      {isDemoSession(s.id) && (
                        <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded shrink-0">
                          Demo
                        </span>
                      )}
                    </div>
                    <p className="text-slate-500 text-xs">
                      {new Date(s.date).toLocaleDateString()} &middot;{" "}
                      {Math.round((s.totalScore / s.maxPossibleScore) * 100)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
