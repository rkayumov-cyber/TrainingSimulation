import { useState, useEffect } from "react";
import {
  BarChart3,
  Trophy,
  Clock,
  TrendingUp,
  ArrowLeft,
  Target,
  Calendar,
  Hash,
  Trash2,
  ChevronRight,
} from "lucide-react";
import type { SessionSummary, ScenarioProgress } from "../../types/session";
import {
  getSessionSummaries,
  getScenarioProgress,
  deleteSession,
  clearAllSessions,
} from "../../services/persistence";
import { isDemoSession } from "../../services/demo";

interface ProgressDashboardProps {
  onBack: () => void;
}

export function ProgressDashboard({ onBack }: ProgressDashboardProps) {
  const [summaries, setSummaries] = useState<SessionSummary[]>([]);
  const [progress, setProgress] = useState<ScenarioProgress[]>([]);
  const [activeTab, setActiveTab] = useState<"overview" | "history">(
    "overview",
  );
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    Promise.all([getSessionSummaries(), getScenarioProgress()]).then(
      ([s, p]) => {
        if (!cancelled) {
          setSummaries(s);
          setProgress(p);
          setLoading(false);
        }
      },
    );
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  const handleDelete = async (id: string) => {
    await deleteSession(id);
    setRefreshKey((k) => k + 1);
  };

  const handleClearAll = async () => {
    await clearAllSessions();
    setRefreshKey((k) => k + 1);
  };

  const formatDate = (ts: number) => {
    return new Date(ts).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

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

  const gradeBg = (grade: string) => {
    switch (grade) {
      case "A":
        return "bg-emerald-500/10 border-emerald-500/20";
      case "B":
        return "bg-blue-500/10 border-blue-500/20";
      case "C":
        return "bg-amber-500/10 border-amber-500/20";
      case "D":
        return "bg-orange-500/10 border-orange-500/20";
      default:
        return "bg-red-500/10 border-red-500/20";
    }
  };

  // Stats
  const totalSessions = summaries.length;
  const avgScore =
    totalSessions > 0
      ? Math.round(
          summaries.reduce(
            (sum, s) => sum + (s.totalScore / s.maxPossibleScore) * 100,
            0,
          ) / totalSessions,
        )
      : 0;
  const bestGradeOverall = summaries.reduce((best, s) => {
    const order: Record<string, number> = { A: 5, B: 4, C: 3, D: 2, F: 1 };
    return order[s.grade] > order[best] ? s.grade : best;
  }, "F" as string);

  if (loading) {
    return (
      <div className="h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-slate-400 text-sm">Loading session history...</div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-slate-950 text-white flex flex-col">
      {/* Header */}
      <div className="border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Simulation
          </button>
          <div className="w-px h-6 bg-slate-700" />
          <h1 className="text-xl font-bold flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-400" />
            Progress Dashboard
          </h1>
        </div>
        {totalSessions > 0 && (
          <button
            onClick={handleClearAll}
            className="text-xs text-slate-500 hover:text-red-400 transition-colors flex items-center gap-1"
          >
            <Trash2 className="w-3 h-3" />
            Clear History
          </button>
        )}
      </div>

      {totalSessions === 0 ? (
        <EmptyState onBack={onBack} />
      ) : (
        <div className="flex-1 overflow-y-auto">
          {/* Summary Stats */}
          <div className="px-6 py-5">
            <div className="grid grid-cols-4 gap-4">
              <StatCard
                icon={<Hash className="w-5 h-5 text-blue-400" />}
                label="Total Sessions"
                value={totalSessions.toString()}
              />
              <StatCard
                icon={<Target className="w-5 h-5 text-emerald-400" />}
                label="Avg Score"
                value={`${avgScore}%`}
              />
              <StatCard
                icon={<Trophy className="w-5 h-5 text-amber-400" />}
                label="Best Grade"
                value={bestGradeOverall}
                valueColor={gradeColor(bestGradeOverall)}
              />
              <StatCard
                icon={<BarChart3 className="w-5 h-5 text-purple-400" />}
                label="Scenarios Tried"
                value={progress.length.toString()}
              />
            </div>
          </div>

          {/* Tabs */}
          <div className="px-6 flex border-b border-slate-800">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-4 py-2.5 text-sm font-medium transition-colors ${
                activeTab === "overview"
                  ? "text-white border-b-2 border-emerald-400"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Scenario Overview
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`px-4 py-2.5 text-sm font-medium transition-colors ${
                activeTab === "history"
                  ? "text-white border-b-2 border-emerald-400"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Session History
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-5">
            {activeTab === "overview" && (
              <div className="space-y-4">
                {progress.map((p) => (
                  <ScenarioCard
                    key={p.scenarioId}
                    progress={p}
                    gradeColor={gradeColor}
                    gradeBg={gradeBg}
                    formatDate={formatDate}
                  />
                ))}
              </div>
            )}

            {activeTab === "history" && (
              <div className="space-y-2">
                {summaries.map((s) => (
                  <SessionRow
                    key={s.id}
                    summary={s}
                    gradeColor={gradeColor}
                    gradeBg={gradeBg}
                    formatDate={formatDate}
                    formatDuration={formatDuration}
                    onDelete={() => handleDelete(s.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================
// SUB-COMPONENTS
// ============================================

function EmptyState({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center">
        <BarChart3 className="w-16 h-16 text-slate-700 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-slate-400 mb-2">
          No Sessions Yet
        </h2>
        <p className="text-slate-500 text-sm mb-6 max-w-sm">
          Complete a simulation scenario to see your performance data and track
          progress over time.
        </p>
        <button
          onClick={onBack}
          className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors text-sm font-medium"
        >
          Start a Simulation
        </button>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  valueColor,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-slate-400 text-xs">{label}</span>
      </div>
      <div className={`text-2xl font-bold ${valueColor || "text-white"}`}>
        {value}
      </div>
    </div>
  );
}

function ScenarioCard({
  progress: p,
  gradeColor,
  gradeBg,
  formatDate,
}: {
  progress: ScenarioProgress;
  gradeColor: (g: string) => string;
  gradeBg: (g: string) => string;
  formatDate: (ts: number) => string;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-800/50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div
            className={`w-12 h-12 rounded-lg border flex items-center justify-center ${gradeBg(p.bestGrade)}`}
          >
            <span className={`text-xl font-bold ${gradeColor(p.bestGrade)}`}>
              {p.bestGrade}
            </span>
          </div>
          <div className="text-left">
            <h3 className="text-white font-semibold text-sm">
              {p.scenarioName}
            </h3>
            <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Hash className="w-3 h-3" />
                {p.attempts} attempt{p.attempts !== 1 ? "s" : ""}
              </span>
              <span className="flex items-center gap-1">
                <Target className="w-3 h-3" />
                Avg: {Math.round(p.averageScore)}pts
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatDate(p.lastAttempt)}
              </span>
            </div>
          </div>
        </div>
        <ChevronRight
          className={`w-5 h-5 text-slate-500 transition-transform ${expanded ? "rotate-90" : ""}`}
        />
      </button>

      {expanded && p.gradeHistory.length > 0 && (
        <div className="px-5 pb-4 border-t border-slate-800 pt-3">
          <h4 className="text-xs text-slate-400 uppercase mb-3 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            Grade History
          </h4>
          {/* Simple visual bar chart */}
          <div className="flex items-end gap-1.5 h-20">
            {p.gradeHistory.map((entry, idx) => {
              const gradeHeight: Record<string, number> = {
                A: 100,
                B: 80,
                C: 60,
                D: 40,
                F: 20,
              };
              const height = gradeHeight[entry.grade] || 20;
              return (
                <div
                  key={idx}
                  className="flex-1 flex flex-col items-center gap-1"
                >
                  <span
                    className={`text-xs font-bold ${gradeColor(entry.grade)}`}
                  >
                    {entry.grade}
                  </span>
                  <div
                    className={`w-full rounded-t transition-all ${
                      entry.grade === "A"
                        ? "bg-emerald-500/40"
                        : entry.grade === "B"
                          ? "bg-blue-500/40"
                          : entry.grade === "C"
                            ? "bg-amber-500/40"
                            : entry.grade === "D"
                              ? "bg-orange-500/40"
                              : "bg-red-500/40"
                    }`}
                    style={{ height: `${height}%` }}
                  />
                </div>
              );
            })}
          </div>
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>First</span>
            <span>Latest</span>
          </div>
        </div>
      )}
    </div>
  );
}

function SessionRow({
  summary: s,
  gradeColor,
  gradeBg,
  formatDate,
  formatDuration,
  onDelete,
}: {
  summary: SessionSummary;
  gradeColor: (g: string) => string;
  gradeBg: (g: string) => string;
  formatDate: (ts: number) => string;
  formatDuration: (ms: number) => string;
  onDelete: () => void;
}) {
  const scorePercent = Math.round((s.totalScore / s.maxPossibleScore) * 100);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 flex items-center gap-4">
      <div
        className={`w-10 h-10 rounded-lg border flex items-center justify-center shrink-0 ${gradeBg(s.grade)}`}
      >
        <span className={`text-lg font-bold ${gradeColor(s.grade)}`}>
          {s.grade}
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-white text-sm font-medium truncate">
            {s.scenarioName}
          </span>
          {isDemoSession(s.id) && (
            <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded">
              Demo
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
          <span>{formatDate(s.date)}</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatDuration(s.durationMs)}
          </span>
        </div>
      </div>

      <div className="text-right shrink-0">
        <div className="text-white text-sm font-mono">{scorePercent}%</div>
        <div className="text-slate-500 text-xs">{s.actionCount} actions</div>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="text-slate-600 hover:text-red-400 transition-colors p-1 shrink-0"
        title="Delete session"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
