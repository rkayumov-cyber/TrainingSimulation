import { useState } from "react";
import {
  Trophy,
  Clock,
  MessageSquareWarning,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  ListChecks,
  MessageCircle,
  Target,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  LayoutDashboard,
  ShieldCheck,
  FileText,
} from "lucide-react";
import { useSimulation } from "../../context";
import { CRITICAL_ACTIONS, TIME_TARGETS } from "../../services/scoring";
import type { ChecklistResult, CompetencyDomain } from "../../types/difficulty";
import type { BenchmarkResult } from "../../types/scenarioBuilder";
import { SOAPNotePanel } from "./SOAPNotePanel";

interface DebriefingPanelProps {
  onReset: () => void;
  onViewDashboard: () => void;
}

type DebriefPhase = "gather" | "analyze" | "summary" | "soap";

export function DebriefingPanel({
  onReset,
  onViewDashboard,
}: DebriefingPanelProps) {
  const {
    state,
    scenario,
    elapsedTime,
    clinicalScore,
    actionTimestamps,
    checklistResult,
    difficulty,
    benchmarkResult,
  } = useSimulation();
  const [activePhase, setActivePhase] = useState<DebriefPhase>("summary");
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["timeline", "timing", "actions", "communication"]),
  );

  if (state.isRunning) return null;
  if (state.score.totalActions === 0) return null;

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) next.delete(section);
      else next.add(section);
      return next;
    });
  };

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  const formatSeconds = (s: number) => {
    const minutes = Math.floor(s / 60);
    const secs = Math.floor(s % 60);
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
        return "bg-emerald-500/20 border-emerald-500/30";
      case "B":
        return "bg-blue-500/20 border-blue-500/30";
      case "C":
        return "bg-amber-500/20 border-amber-500/30";
      case "D":
        return "bg-orange-500/20 border-orange-500/30";
      default:
        return "bg-red-500/20 border-red-500/30";
    }
  };

  const criticalActions =
    CRITICAL_ACTIONS[scenario.id] || scenario.correctActions;
  const timeTargets = TIME_TARGETS[scenario.id] || {};
  const overallGrade = clinicalScore?.grade || "F";
  const scorePercent = clinicalScore
    ? Math.round(
        (clinicalScore.totalScore / clinicalScore.maxPossibleScore) * 100,
      )
    : 0;

  // Build timeline of actions with timestamps
  const timeline = state.actionsTaken
    .map((action) => {
      const ts = actionTimestamps[action];
      const elapsed = ts ? (ts - state.startTime) / 1000 : 0;
      const isCritical = criticalActions.includes(action);
      const target = timeTargets[action];
      const grade = clinicalScore?.timingScores[action]?.grade;
      return { action, elapsed, isCritical, target, grade };
    })
    .sort((a, b) => a.elapsed - b.elapsed);

  // Ideal sequence of critical actions (by their time targets, ascending)
  const idealSequence = Object.entries(timeTargets)
    .sort(([, a], [, b]) => a - b)
    .map(([action, target]) => ({ action, target }));

  const phases: { id: DebriefPhase; label: string; icon: React.ReactNode }[] = [
    { id: "gather", label: "Gather", icon: <ListChecks className="w-4 h-4" /> },
    {
      id: "analyze",
      label: "Analyze",
      icon: <BarChart3 className="w-4 h-4" />,
    },
    { id: "summary", label: "Summary", icon: <Target className="w-4 h-4" /> },
    { id: "soap", label: "SOAP Note", icon: <FileText className="w-4 h-4" /> },
  ];

  return (
    <div className="fixed inset-0 bg-slate-950/95 flex items-center justify-center z-50 overflow-y-auto py-6">
      <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-3xl w-full mx-4 shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl border ${gradeBg(overallGrade)}`}>
                <Trophy className={`w-8 h-8 ${gradeColor(overallGrade)}`} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Post-Simulation Debrief
                </h2>
                <p className="text-slate-400 text-sm">{scenario.name}</p>
              </div>
            </div>
            <div className="text-right">
              <div className={`text-4xl font-bold ${gradeColor(overallGrade)}`}>
                {overallGrade}
              </div>
              <div className="text-slate-400 text-sm">
                {scorePercent}% score
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-slate-400">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              Duration: {formatDuration(elapsedTime)}
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4" />
              {state.actionsTaken.length} actions taken
            </span>
            <span className="flex items-center gap-1">
              <MessageSquareWarning className="w-4 h-4" />
              {state.score.communicationErrors} comm errors
            </span>
          </div>
        </div>

        {/* GAS Phase Tabs */}
        <div className="flex border-b border-slate-800">
          {phases.map((phase) => (
            <button
              key={phase.id}
              onClick={() => setActivePhase(phase.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                activePhase === phase.id
                  ? "text-white border-b-2 border-emerald-400 bg-slate-800/50"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/30"
              }`}
            >
              {phase.icon}
              {phase.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
          {activePhase === "gather" && (
            <GatherPhase
              timeline={timeline}
              events={state.events}
              feedbackLogs={state.feedbackLogs}
              startTime={state.startTime}
              formatSeconds={formatSeconds}
              gradeColor={gradeColor}
              expandedSections={expandedSections}
              toggleSection={toggleSection}
            />
          )}

          {activePhase === "analyze" && (
            <AnalyzePhase
              timeline={timeline}
              idealSequence={idealSequence}
              clinicalScore={clinicalScore}
              criticalActions={criticalActions}
              actionsTaken={state.actionsTaken}
              formatSeconds={formatSeconds}
              gradeColor={gradeColor}
              expandedSections={expandedSections}
              toggleSection={toggleSection}
            />
          )}

          {activePhase === "soap" && <SOAPNotePanel />}

          {activePhase === "summary" && (
            <SummaryPhase
              clinicalScore={clinicalScore}
              scorePercent={scorePercent}
              overallGrade={overallGrade}
              criticalActions={criticalActions}
              actionsTaken={state.actionsTaken}
              communicationErrors={state.score.communicationErrors}
              gradeColor={gradeColor}
              gradeBg={gradeBg}
              scenarioName={scenario.name}
              checklistResult={checklistResult}
              difficulty={difficulty}
              benchmarkResult={benchmarkResult}
            />
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={onViewDashboard}
            className="flex items-center gap-2 px-4 py-2 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors text-sm"
          >
            <LayoutDashboard className="w-4 h-4" />
            View Progress
          </button>
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors text-sm font-medium"
          >
            <RotateCcw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// GATHER PHASE - "What happened?"
// ============================================

interface GatherPhaseProps {
  timeline: {
    action: string;
    elapsed: number;
    isCritical: boolean;
    target?: number;
    grade?: string;
  }[];
  events: { type: string; description: string; timestamp: number }[];
  feedbackLogs: { type: string; message: string; timestamp: number }[];
  startTime: number;
  formatSeconds: (s: number) => string;
  gradeColor: (g: string) => string;
  expandedSections: Set<string>;
  toggleSection: (s: string) => void;
}

function GatherPhase({
  timeline,
  events,
  feedbackLogs,
  startTime,
  formatSeconds,
  gradeColor,
  expandedSections,
  toggleSection,
}: GatherPhaseProps) {
  return (
    <div className="space-y-4">
      <div className="bg-slate-800/50 rounded-lg p-3 text-sm text-slate-300 border border-slate-700">
        <strong className="text-white">Gather Phase:</strong> Review what
        happened during the simulation. Walk through the timeline of your
        actions and events.
      </div>

      {/* Action Timeline */}
      <CollapsibleSection
        title="Action Timeline"
        icon={<Clock className="w-4 h-4 text-blue-400" />}
        isOpen={expandedSections.has("timeline")}
        onToggle={() => toggleSection("timeline")}
      >
        <div className="space-y-1">
          {timeline.map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 py-1.5">
              <span className="text-slate-500 font-mono text-xs w-12 text-right">
                {formatSeconds(item.elapsed)}
              </span>
              <div
                className={`w-2 h-2 rounded-full ${item.isCritical ? "bg-emerald-400" : "bg-slate-500"}`}
              />
              <span className="text-slate-300 text-sm flex-1">
                {item.action.replace(/_/g, " ")}
              </span>
              {item.grade && (
                <span className={`text-xs font-bold ${gradeColor(item.grade)}`}>
                  {item.grade}
                </span>
              )}
              {item.isCritical && (
                <span className="text-xs text-emerald-400/70 bg-emerald-400/10 px-1.5 py-0.5 rounded">
                  critical
                </span>
              )}
            </div>
          ))}
          {timeline.length === 0 && (
            <p className="text-slate-500 text-sm">No actions recorded.</p>
          )}
        </div>
      </CollapsibleSection>

      {/* Events Log */}
      <CollapsibleSection
        title="Clinical Events"
        icon={<AlertTriangle className="w-4 h-4 text-amber-400" />}
        isOpen={expandedSections.has("events")}
        onToggle={() => toggleSection("events")}
      >
        <div className="space-y-1">
          {events.map((event, idx) => {
            const elapsed = (event.timestamp - startTime) / 1000;
            const typeColor =
              event.type === "deterioration"
                ? "text-red-400"
                : event.type === "improvement"
                  ? "text-emerald-400"
                  : event.type === "action"
                    ? "text-blue-400"
                    : "text-amber-400";
            return (
              <div key={idx} className="flex items-center gap-3 py-1.5">
                <span className="text-slate-500 font-mono text-xs w-12 text-right">
                  {formatSeconds(elapsed)}
                </span>
                <span
                  className={`text-xs uppercase font-medium w-20 ${typeColor}`}
                >
                  {event.type}
                </span>
                <span className="text-slate-300 text-sm">
                  {event.description}
                </span>
              </div>
            );
          })}
        </div>
      </CollapsibleSection>

      {/* Feedback / Errors */}
      <CollapsibleSection
        title="Feedback & Warnings"
        icon={<MessageCircle className="w-4 h-4 text-orange-400" />}
        isOpen={expandedSections.has("feedback")}
        onToggle={() => toggleSection("feedback")}
      >
        <div className="space-y-1">
          {feedbackLogs.map((log, idx) => {
            const typeColor =
              log.type === "jargon"
                ? "text-amber-400"
                : log.type === "error"
                  ? "text-red-400"
                  : log.type === "warning"
                    ? "text-orange-400"
                    : "text-blue-400";
            return (
              <div key={idx} className="flex items-start gap-3 py-1.5">
                <span
                  className={`text-xs uppercase font-medium w-16 mt-0.5 ${typeColor}`}
                >
                  {log.type}
                </span>
                <span className="text-slate-300 text-sm">{log.message}</span>
              </div>
            );
          })}
          {feedbackLogs.length === 0 && (
            <p className="text-slate-500 text-sm">
              No feedback items recorded.
            </p>
          )}
        </div>
      </CollapsibleSection>
    </div>
  );
}

// ============================================
// ANALYZE PHASE - "Why did it happen?"
// ============================================

interface AnalyzePhaseProps {
  timeline: {
    action: string;
    elapsed: number;
    isCritical: boolean;
    target?: number;
    grade?: string;
  }[];
  idealSequence: { action: string; target: number }[];
  clinicalScore: import("../../types/enhanced").ClinicalDecisionScore | null;
  criticalActions: string[];
  actionsTaken: string[];
  formatSeconds: (s: number) => string;
  gradeColor: (g: string) => string;
  expandedSections: Set<string>;
  toggleSection: (s: string) => void;
}

function AnalyzePhase({
  timeline,
  idealSequence,
  clinicalScore,
  criticalActions,
  actionsTaken,
  formatSeconds,
  gradeColor,
  expandedSections,
  toggleSection,
}: AnalyzePhaseProps) {
  const missedActions = criticalActions.filter(
    (a) => !actionsTaken.includes(a),
  );

  return (
    <div className="space-y-4">
      <div className="bg-slate-800/50 rounded-lg p-3 text-sm text-slate-300 border border-slate-700">
        <strong className="text-white">Analyze Phase:</strong> Compare your
        performance against the ideal approach. Identify gaps in timing,
        sequencing, and actions.
      </div>

      {/* Timing Comparison */}
      <CollapsibleSection
        title="Timing Analysis"
        icon={<Clock className="w-4 h-4 text-blue-400" />}
        isOpen={expandedSections.has("timing")}
        onToggle={() => toggleSection("timing")}
      >
        <div className="space-y-3">
          {idealSequence.map(({ action, target }) => {
            const actual = timeline.find((t) => t.action === action);
            const wasPerformed = !!actual;
            const grade = clinicalScore?.timingScores[action]?.grade;
            const timeDiff = actual ? actual.elapsed - target : null;

            return (
              <div key={action} className="bg-slate-800/50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white text-sm font-medium">
                    {action.replace(/_/g, " ")}
                  </span>
                  {wasPerformed ? (
                    <span className={`font-bold ${gradeColor(grade || "F")}`}>
                      {grade}
                    </span>
                  ) : (
                    <span className="text-red-400 text-xs font-medium">
                      MISSED
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <span className="text-slate-400">
                    Target:{" "}
                    <span className="text-slate-300 font-mono">
                      {formatSeconds(target)}
                    </span>
                  </span>
                  {wasPerformed && (
                    <>
                      <span className="text-slate-400">
                        Actual:{" "}
                        <span className="text-slate-300 font-mono">
                          {formatSeconds(actual.elapsed)}
                        </span>
                      </span>
                      {timeDiff !== null && (
                        <span
                          className={
                            timeDiff <= 0
                              ? "text-emerald-400"
                              : "text-amber-400"
                          }
                        >
                          {timeDiff <= 0 ? "" : "+"}
                          {formatSeconds(Math.abs(timeDiff))}{" "}
                          {timeDiff <= 0 ? "early" : "late"}
                        </span>
                      )}
                    </>
                  )}
                </div>
                {/* Progress bar */}
                {wasPerformed && (
                  <div className="mt-2 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        grade === "A"
                          ? "bg-emerald-400"
                          : grade === "B"
                            ? "bg-blue-400"
                            : grade === "C"
                              ? "bg-amber-400"
                              : "bg-red-400"
                      }`}
                      style={{
                        width: `${Math.min(100, (target / actual.elapsed) * 100)}%`,
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CollapsibleSection>

      {/* Sequence Comparison */}
      <CollapsibleSection
        title="Action Sequence"
        icon={<ArrowRight className="w-4 h-4 text-purple-400" />}
        isOpen={expandedSections.has("sequence")}
        onToggle={() => toggleSection("sequence")}
      >
        <div className="space-y-3">
          {/* Ideal vs Actual */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <h4 className="text-xs text-slate-400 uppercase mb-2">
                Ideal Order
              </h4>
              <div className="space-y-1">
                {idealSequence.map(({ action }, idx) => (
                  <div key={action} className="flex items-center gap-2 text-sm">
                    <span className="text-slate-500 text-xs w-4">
                      {idx + 1}.
                    </span>
                    <span className="text-slate-300">
                      {action.replace(/_/g, " ")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xs text-slate-400 uppercase mb-2">
                Your Order
              </h4>
              <div className="space-y-1">
                {timeline
                  .filter((t) => t.isCritical)
                  .map((item, idx) => (
                    <div
                      key={item.action}
                      className="flex items-center gap-2 text-sm"
                    >
                      <span className="text-slate-500 text-xs w-4">
                        {idx + 1}.
                      </span>
                      <span className="text-slate-300">
                        {item.action.replace(/_/g, " ")}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Sequencing feedback */}
          {clinicalScore?.sequencingErrors &&
            clinicalScore.sequencingErrors.length > 0 && (
              <div className="mt-3">
                <h4 className="text-xs text-red-400 uppercase mb-1">
                  Sequence Errors
                </h4>
                {clinicalScore.sequencingErrors.map((err, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 text-sm py-1"
                  >
                    <XCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                    <span className="text-slate-300">{err}</span>
                  </div>
                ))}
              </div>
            )}
          {clinicalScore?.correctSequences &&
            clinicalScore.correctSequences.length > 0 && (
              <div className="mt-2">
                <h4 className="text-xs text-emerald-400 uppercase mb-1">
                  Correct Sequences
                </h4>
                {clinicalScore.correctSequences.map((seq, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 text-sm py-1"
                  >
                    <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                    <span className="text-slate-300">{seq}</span>
                  </div>
                ))}
              </div>
            )}
        </div>
      </CollapsibleSection>

      {/* Missed Actions */}
      {missedActions.length > 0 && (
        <CollapsibleSection
          title={`Missed Critical Actions (${missedActions.length})`}
          icon={<XCircle className="w-4 h-4 text-red-400" />}
          isOpen={expandedSections.has("missed")}
          onToggle={() => toggleSection("missed")}
        >
          <div className="space-y-2">
            {missedActions.map((action) => (
              <div
                key={action}
                className="flex items-center gap-3 py-1.5 bg-red-500/5 rounded px-2"
              >
                <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span className="text-slate-300 text-sm">
                  {action.replace(/_/g, " ")}
                </span>
              </div>
            ))}
          </div>
        </CollapsibleSection>
      )}
    </div>
  );
}

// ============================================
// SUMMARY PHASE - "What can we learn?"
// ============================================

interface SummaryPhaseProps {
  clinicalScore: import("../../types/enhanced").ClinicalDecisionScore | null;
  scorePercent: number;
  overallGrade: string;
  criticalActions: string[];
  actionsTaken: string[];
  communicationErrors: number;
  gradeColor: (g: string) => string;
  gradeBg: (g: string) => string;
  scenarioName: string;
  checklistResult: ChecklistResult | null;
  difficulty: string;
  benchmarkResult?: BenchmarkResult | null;
}

function SummaryPhase({
  clinicalScore,
  scorePercent,
  overallGrade,
  criticalActions,
  actionsTaken,
  communicationErrors,
  gradeColor,
  gradeBg,
  scenarioName,
  checklistResult,
  difficulty,
  benchmarkResult,
}: SummaryPhaseProps) {
  const completedCritical = criticalActions.filter((a) =>
    actionsTaken.includes(a),
  ).length;
  const missedCount = criticalActions.length - completedCritical;

  // Generate key takeaways
  const takeaways: { type: "positive" | "improvement"; message: string }[] = [];

  if (clinicalScore) {
    if (clinicalScore.grade === "A" || clinicalScore.grade === "B") {
      takeaways.push({
        type: "positive",
        message: "Strong overall clinical performance",
      });
    }
    if (missedCount === 0) {
      takeaways.push({
        type: "positive",
        message: "All critical actions were completed",
      });
    } else {
      takeaways.push({
        type: "improvement",
        message: `${missedCount} critical action${missedCount > 1 ? "s were" : " was"} missed`,
      });
    }
    if (communicationErrors === 0) {
      takeaways.push({
        type: "positive",
        message: "Clear patient communication with no jargon",
      });
    } else {
      takeaways.push({
        type: "improvement",
        message: `${communicationErrors} instance${communicationErrors > 1 ? "s" : ""} of medical jargon used with the patient`,
      });
    }
    if (
      clinicalScore.sequencingErrors.length === 0 &&
      clinicalScore.correctSequences.length > 0
    ) {
      takeaways.push({
        type: "positive",
        message: "Correct action sequencing maintained",
      });
    } else if (clinicalScore.sequencingErrors.length > 0) {
      takeaways.push({
        type: "improvement",
        message: "Review proper sequence of critical interventions",
      });
    }
    if (clinicalScore.harmfulActions.length > 0) {
      takeaways.push({
        type: "improvement",
        message: `${clinicalScore.harmfulActions.length} potentially harmful action${clinicalScore.harmfulActions.length > 1 ? "s" : ""} performed`,
      });
    }
    if (clinicalScore.unnecessaryActions > 0) {
      takeaways.push({
        type: "improvement",
        message: `${clinicalScore.unnecessaryActions} unnecessary action${clinicalScore.unnecessaryActions > 1 ? "s" : ""} — stay focused on the presentation`,
      });
    }
  }

  return (
    <div className="space-y-4">
      <div className="bg-slate-800/50 rounded-lg p-3 text-sm text-slate-300 border border-slate-700">
        <strong className="text-white">Summary Phase:</strong> Key takeaways and
        areas for improvement. Use these insights to guide your next attempt.
      </div>

      {/* Overall Score Card */}
      <div className={`rounded-xl p-5 border ${gradeBg(overallGrade)}`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-semibold text-lg">{scenarioName}</h3>
            <p className="text-slate-400 text-sm mt-1">Overall Performance</p>
          </div>
          <div className="text-center">
            <div className={`text-5xl font-bold ${gradeColor(overallGrade)}`}>
              {overallGrade}
            </div>
            <div className="text-slate-400 text-sm">{scorePercent}%</div>
          </div>
        </div>

        {/* Score breakdown bar */}
        <div className="mt-4 grid grid-cols-4 gap-3 text-center">
          <ScorePill
            label="Timing"
            value={
              clinicalScore
                ? `${Object.values(clinicalScore.timingScores).filter((t) => t.grade === "A" || t.grade === "B").length}/${Object.keys(clinicalScore.timingScores).length}`
                : "-"
            }
            sub="on time"
          />
          <ScorePill
            label="Sequencing"
            value={
              clinicalScore ? `${clinicalScore.correctSequences.length}` : "-"
            }
            sub="correct"
          />
          <ScorePill
            label="Actions"
            value={`${completedCritical}/${criticalActions.length}`}
            sub="critical"
          />
          <ScorePill
            label="Comm"
            value={clinicalScore ? `${clinicalScore.clarityScore}%` : "-"}
            sub="clarity"
          />
        </div>
      </div>

      {/* Key Takeaways */}
      <div className="bg-slate-800 rounded-lg p-4">
        <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          Key Takeaways
        </h3>
        <div className="space-y-2">
          {takeaways.map((item, idx) => (
            <div key={idx} className="flex items-start gap-2.5 py-1">
              {item.type === "positive" ? (
                <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
              )}
              <span className="text-slate-300 text-sm">{item.message}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Missed Critical Actions Detail */}
      {missedCount > 0 && clinicalScore?.missedCriticalActions && (
        <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
          <h3 className="text-red-400 font-semibold mb-2 text-sm flex items-center gap-2">
            <XCircle className="w-4 h-4" />
            Missed Critical Actions
          </h3>
          <div className="flex flex-wrap gap-2">
            {clinicalScore.missedCriticalActions.map((action) => (
              <span
                key={action}
                className="bg-red-500/10 text-red-300 text-xs px-2.5 py-1 rounded-lg border border-red-500/20"
              >
                {action.replace(/_/g, " ")}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* OSCE Checklist Result */}
      {checklistResult && (
        <div
          className={`rounded-lg p-4 border ${checklistResult.passed ? "bg-emerald-500/5 border-emerald-500/20" : "bg-amber-500/5 border-amber-500/20"}`}
        >
          <h3 className="text-white font-semibold mb-3 text-sm flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            OSCE Competency Assessment
            <span
              className={`ml-auto text-xs font-bold px-2 py-0.5 rounded ${checklistResult.passed ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}`}
            >
              {checklistResult.passed ? "PASSED" : "NOT PASSED"}
            </span>
          </h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Items Completed:</span>
              <span className="text-white font-medium">
                {checklistResult.completed}/{checklistResult.total}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Critical Items:</span>
              <span className="text-white font-medium">
                {checklistResult.criticalCompleted}/
                {checklistResult.criticalTotal}
              </span>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {(
              Object.entries(checklistResult.domainScores) as [
                CompetencyDomain,
                { total: number; completed: number },
              ][]
            )
              .filter(([, s]) => s.total > 0)
              .map(([domain, score]) => (
                <div
                  key={domain}
                  className="bg-slate-800/50 rounded p-2 text-center"
                >
                  <div className="text-slate-400 text-xs capitalize">
                    {domain}
                  </div>
                  <div className="text-white font-bold">
                    {score.completed}/{score.total}
                  </div>
                </div>
              ))}
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Difficulty:{" "}
            <span className="text-slate-300 capitalize">{difficulty}</span>
          </div>
        </div>
      )}

      {/* Benchmark Comparison */}
      {benchmarkResult && (
        <div
          className={`rounded-lg p-4 border ${
            benchmarkResult.passed
              ? "bg-emerald-500/5 border-emerald-500/20"
              : "bg-red-500/5 border-red-500/20"
          }`}
        >
          <h3 className="text-white font-semibold mb-3 text-sm flex items-center gap-2">
            <Target className="w-4 h-4 text-blue-400" />
            Benchmark Comparison
            <span
              className={`ml-auto text-xs font-bold px-2 py-0.5 rounded ${
                benchmarkResult.passed
                  ? "bg-emerald-500/20 text-emerald-400"
                  : "bg-red-500/20 text-red-400"
              }`}
            >
              {benchmarkResult.passed ? "PASSED" : "NOT PASSED"}{" "}
              ({benchmarkResult.percentage}%)
            </span>
          </h3>
          <div className="space-y-2">
            {benchmarkResult.actionResults.map((ar, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-slate-300 flex items-center gap-1.5">
                  {ar.completed ? (
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5 text-red-400" />
                  )}
                  {ar.label}
                  {ar.required && (
                    <span className="text-xs text-amber-400">*</span>
                  )}
                </span>
                <span className="text-slate-400 text-xs font-mono">
                  {ar.pointsEarned}/{ar.pointsPossible}
                </span>
              </div>
            ))}
          </div>
          {benchmarkResult.timingResults.length > 0 && (
            <div className="mt-3 pt-3 border-t border-slate-700">
              <h4 className="text-xs text-slate-400 uppercase mb-1">
                Timing Grades
              </h4>
              <div className="flex flex-wrap gap-2">
                {benchmarkResult.timingResults.map((tr, idx) => (
                  <span
                    key={idx}
                    className={`text-xs px-2 py-0.5 rounded ${gradeColor(tr.grade)} bg-slate-800`}
                  >
                    {tr.action.replace(/_/g, " ")}: {tr.grade}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Completed Actions */}
      <div className="bg-slate-800 rounded-lg p-4">
        <h3 className="text-white font-semibold mb-2 text-sm flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          Completed Actions
        </h3>
        <div className="flex flex-wrap gap-2">
          {actionsTaken.map((action, idx) => {
            const isCritical = criticalActions.includes(action);
            return (
              <span
                key={idx}
                className={`text-xs px-2.5 py-1 rounded-lg border ${
                  isCritical
                    ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/20"
                    : "bg-slate-700/50 text-slate-300 border-slate-600"
                }`}
              >
                {action.replace(/_/g, " ")}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ============================================
// SHARED COMPONENTS
// ============================================

function CollapsibleSection({
  title,
  icon,
  isOpen,
  onToggle,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-slate-800 rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-750 transition-colors"
      >
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-white font-semibold text-sm">{title}</span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-slate-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-400" />
        )}
      </button>
      {isOpen && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}

function ScorePill({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="bg-slate-900/50 rounded-lg p-2">
      <div className="text-slate-400 text-xs">{label}</div>
      <div className="text-white font-bold text-lg">{value}</div>
      <div className="text-slate-500 text-xs">{sub}</div>
    </div>
  );
}
