import { useMemo, useState } from "react";
import {
  BarChart3,
  Clock,
  Target,
  ArrowUpDown,
  Zap,
  Package,
  MessageCircle,
  ChevronDown,
  ChevronRight,
  Award,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  BookOpen,
  TrendingUp,
} from "lucide-react";
import { useSimulation } from "../../context";
import {
  generatePerformanceReport,
  hasAdvancedMetrics,
  type PerformanceReport,
  type TimeMetric,
  type CriticalDecisionPoint,
  type DomainScore,
} from "../../services/scoring";

// ============================================================================
// Grade Color Helpers
// ============================================================================

function gradeColor(grade: string): string {
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
}

function gradeBg(grade: string): string {
  switch (grade) {
    case "A":
      return "bg-emerald-500/20 border-emerald-500/30";
    case "B":
      return "bg-blue-500/20 border-blue-500/30";
    case "C":
      return "bg-yellow-500/20 border-yellow-500/30";
    case "D":
      return "bg-orange-500/20 border-orange-500/30";
    case "F":
      return "bg-red-500/20 border-red-500/30";
    default:
      return "bg-slate-500/20 border-slate-500/30";
  }
}

function impactBadge(impact: string): string {
  switch (impact) {
    case "life-saving":
      return "bg-red-500/20 text-red-300 border-red-500/30";
    case "critical":
      return "bg-orange-500/20 text-orange-300 border-orange-500/30";
    case "important":
      return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
    default:
      return "bg-slate-500/20 text-slate-300 border-slate-500/30";
  }
}

function formatTime(seconds: number | null): string {
  if (seconds === null) return "Not done";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

// ============================================================================
// Sub-Components
// ============================================================================

function OverallScoreCard({ report }: { report: PerformanceReport }) {
  return (
    <div className={`rounded-lg border p-4 ${gradeBg(report.overallGrade)}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" />
          <span className="text-sm font-semibold text-white">
            Overall Performance
          </span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className={`text-3xl font-bold ${gradeColor(report.overallGrade)}`}>
            {report.overallScore}
          </span>
          <span className="text-xs text-slate-400">/100</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span
          className={`text-2xl font-bold ${gradeColor(report.overallGrade)}`}
        >
          Grade: {report.overallGrade}
        </span>
        <span className="text-xs text-slate-400">
          Duration: {formatTime(report.totalDurationSeconds)}
        </span>
      </div>
      {/* Expert comparison */}
      <div className="mt-3 pt-3 border-t border-white/10">
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <TrendingUp className="w-3 h-3" />
          <span>
            Expert avg: {report.expertBenchmark.averageExpertScore} | Your
            percentile: {report.expertBenchmark.percentile}th
          </span>
        </div>
        {report.expertBenchmark.areasAboveExpert.length > 0 && (
          <div className="text-xs text-emerald-400 mt-1">
            Above expert: {report.expertBenchmark.areasAboveExpert.join(", ")}
          </div>
        )}
        {report.expertBenchmark.areasBelowExpert.length > 0 && (
          <div className="text-xs text-orange-400 mt-1">
            Below expert: {report.expertBenchmark.areasBelowExpert.join(", ")}
          </div>
        )}
      </div>
    </div>
  );
}

function DomainScoreBar({ domain }: { domain: DomainScore }) {
  return (
    <div className="mb-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-slate-300">
          {domain.domain}{" "}
          <span className="text-slate-500">({domain.weight}%)</span>
        </span>
        <span className={`text-xs font-bold ${gradeColor(domain.grade)}`}>
          {domain.score} ({domain.grade})
        </span>
      </div>
      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${
            domain.score >= 80
              ? "bg-emerald-500"
              : domain.score >= 60
                ? "bg-yellow-500"
                : "bg-red-500"
          }`}
          style={{ width: `${domain.score}%` }}
        />
      </div>
      <p className="text-xs text-slate-500 mt-0.5">{domain.feedback}</p>
    </div>
  );
}

function TimeMetricRow({ metric }: { metric: TimeMetric }) {
  return (
    <div className="flex items-center gap-2 py-1.5 border-b border-slate-800/50 last:border-0">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1">
          {metric.achieved ? (
            <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
          ) : (
            <XCircle className="w-3 h-3 text-red-400 flex-shrink-0" />
          )}
          <span className="text-xs text-slate-200 truncate">
            {metric.label}
          </span>
        </div>
        <p className="text-xs text-slate-500 ml-4 truncate">
          {metric.description}
        </p>
      </div>
      <div className="text-right flex-shrink-0">
        <span
          className={`text-xs font-mono ${metric.achieved ? gradeColor(metric.grade) : "text-slate-500"}`}
        >
          {formatTime(metric.actualSeconds)}
        </span>
        <div className="text-xs text-slate-600">
          target: {formatTime(metric.benchmarkSeconds)}
        </div>
      </div>
      <span
        className={`text-xs font-bold w-6 text-center ${gradeColor(metric.grade)}`}
      >
        {metric.grade}
      </span>
    </div>
  );
}

function CriticalDecisionRow({ cdp }: { cdp: CriticalDecisionPoint }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="border-b border-slate-800/50 last:border-0">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-2 py-2 text-left hover:bg-slate-800/30"
      >
        {cdp.wasCorrect ? (
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
        ) : (
          <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
        )}
        <span className="flex-1 text-xs text-slate-200">
          {cdp.description}
        </span>
        <span
          className={`text-xs px-1.5 py-0.5 rounded border ${impactBadge(cdp.impact)}`}
        >
          {cdp.impact}
        </span>
        {expanded ? (
          <ChevronDown className="w-3 h-3 text-slate-500" />
        ) : (
          <ChevronRight className="w-3 h-3 text-slate-500" />
        )}
      </button>
      {expanded && (
        <div className="ml-6 pb-2 space-y-1">
          <div className="text-xs">
            <span className="text-slate-500">Correct: </span>
            <span className="text-emerald-300">{cdp.correctDecision}</span>
          </div>
          {cdp.actualDecision && (
            <div className="text-xs">
              <span className="text-slate-500">Your action: </span>
              <span
                className={
                  cdp.wasCorrect ? "text-emerald-300" : "text-red-300"
                }
              >
                {cdp.actualDecision}
              </span>
            </div>
          )}
          <div className="text-xs text-slate-400 italic">{cdp.feedback}</div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function PerformanceMetricsPanel() {
  const {
    state,
    actionTimestamps,
    elapsedTime,
  } = useSimulation();
  const [activeSection, setActiveSection] = useState<string>("overview");

  const scenarioId = state.scenarioId;
  const hasMetrics = hasAdvancedMetrics(scenarioId);
  const endTime = state.startTime + elapsedTime;

  const report = useMemo<PerformanceReport | null>(() => {
    if (!hasMetrics) return null;

    const jargonCount = state.feedbackLogs.filter(
      (f) => f.type === "jargon",
    ).length;
    const mdtCount = state.mdtMessages.length;

    return generatePerformanceReport(
      scenarioId,
      state.scenarioId,
      state.actionsTaken,
      actionTimestamps,
      state.startTime,
      endTime,
      jargonCount,
      mdtCount,
    );
  }, [
    hasMetrics,
    scenarioId,
    state.scenarioId,
    state.actionsTaken,
    actionTimestamps,
    state.startTime,
    endTime,
    state.feedbackLogs,
    state.mdtMessages,
  ]);

  if (!hasMetrics) {
    return (
      <div className="p-4 text-center">
        <BarChart3 className="w-8 h-8 text-slate-600 mx-auto mb-2" />
        <p className="text-sm text-slate-400">
          Advanced performance metrics are available for the{" "}
          <span className="text-amber-400 font-semibold">Master PE</span>{" "}
          scenario.
        </p>
        <p className="text-xs text-slate-500 mt-1">
          Select the Master PE scenario to access detailed time-to-action
          benchmarks, diagnostic accuracy scoring, sequence analysis, and expert
          comparison.
        </p>
      </div>
    );
  }

  if (!report) return null;

  const sections = [
    { id: "overview", label: "Overview", icon: <BarChart3 className="w-3.5 h-3.5" /> },
    { id: "timing", label: "Timing", icon: <Clock className="w-3.5 h-3.5" /> },
    { id: "diagnosis", label: "Dx Accuracy", icon: <Target className="w-3.5 h-3.5" /> },
    { id: "sequence", label: "Sequence", icon: <ArrowUpDown className="w-3.5 h-3.5" /> },
    { id: "decisions", label: "Decisions", icon: <Zap className="w-3.5 h-3.5" /> },
    { id: "resources", label: "Resources", icon: <Package className="w-3.5 h-3.5" /> },
    { id: "recommendations", label: "Learn", icon: <BookOpen className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Section Tabs */}
      <div className="flex border-b border-slate-800 overflow-x-auto">
        {sections.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            className={`flex items-center gap-1 px-2.5 py-2 text-xs whitespace-nowrap transition-colors ${
              activeSection === s.id
                ? "text-amber-400 border-b-2 border-amber-400 bg-slate-900/50"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {s.icon}
            {s.label}
          </button>
        ))}
      </div>

      {/* Section Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {/* OVERVIEW */}
        {activeSection === "overview" && (
          <>
            <OverallScoreCard report={report} />
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Domain Breakdown
              </h4>
              {report.domains.map((d) => (
                <DomainScoreBar key={d.domain} domain={d} />
              ))}
            </div>
          </>
        )}

        {/* TIMING */}
        {activeSection === "timing" && (
          <>
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Time to Key Actions
              </h4>
            </div>
            <div className="bg-slate-900/50 rounded-lg border border-slate-800 p-2">
              {report.timeMetrics.map((tm, i) => (
                <TimeMetricRow key={i} metric={tm} />
              ))}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Grades: A = within benchmark, B = acceptable, C = delayed, D =
              significantly delayed, F = critically late
            </div>
          </>
        )}

        {/* DIAGNOSTIC ACCURACY */}
        {activeSection === "diagnosis" && (
          <>
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-purple-400" />
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Diagnostic Accuracy
              </h4>
            </div>
            {/* Working Diagnosis */}
            <div
              className={`rounded-lg border p-3 ${report.diagnosticAccuracy.workingDiagnosisCorrect ? "bg-emerald-900/20 border-emerald-700/30" : "bg-red-900/20 border-red-700/30"}`}
            >
              <div className="flex items-center gap-2">
                {report.diagnosticAccuracy.workingDiagnosisCorrect ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-400" />
                )}
                <span className="text-sm font-semibold text-white">
                  {report.diagnosticAccuracy.workingDiagnosisCorrect
                    ? "Correct Diagnosis Reached"
                    : "Diagnosis Not Reached"}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Correct: {report.diagnosticAccuracy.correctDiagnosis}
              </p>
              <p className="text-xs text-slate-400">
                Confidence: {report.diagnosticAccuracy.diagnosticConfidence}%
              </p>
            </div>

            {/* Key Clues */}
            <div className="mt-3">
              <h5 className="text-xs font-medium text-slate-400 mb-1">
                Key Diagnostic Clues (
                {
                  report.diagnosticAccuracy.keyCluesIdentified.filter(
                    (c) => c.identified,
                  ).length
                }
                /{report.diagnosticAccuracy.keyCluesIdentified.length})
              </h5>
              <div className="space-y-1">
                {report.diagnosticAccuracy.keyCluesIdentified.map((c, i) => (
                  <div key={i} className="flex items-start gap-1.5">
                    {c.identified ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-400 mt-0.5 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-3 h-3 text-red-400 mt-0.5 flex-shrink-0" />
                    )}
                    <span
                      className={`text-xs ${c.identified ? "text-slate-300" : "text-slate-500"}`}
                    >
                      {c.clue}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Differentials */}
            <div className="mt-3">
              <h5 className="text-xs font-medium text-slate-400 mb-1">
                Differentials Considered
              </h5>
              <div className="flex flex-wrap gap-1">
                {report.diagnosticAccuracy.differentialExpected.map((d, i) => {
                  const considered =
                    report.diagnosticAccuracy.differentialConsidered.includes(d);
                  return (
                    <span
                      key={i}
                      className={`text-xs px-2 py-0.5 rounded border ${
                        considered
                          ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300"
                          : "bg-slate-800/50 border-slate-700/30 text-slate-500"
                      }`}
                    >
                      {considered ? "+" : "-"} {d}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Red Herrings */}
            {report.diagnosticAccuracy.redHerringsFallenFor.length > 0 && (
              <div className="mt-3">
                <h5 className="text-xs font-medium text-red-400 mb-1">
                  <AlertTriangle className="w-3 h-3 inline mr-1" />
                  Diagnostic Pitfalls
                </h5>
                {report.diagnosticAccuracy.redHerringsFallenFor.map((r, i) => (
                  <p key={i} className="text-xs text-red-300/80 ml-4">
                    {r}
                  </p>
                ))}
              </div>
            )}
          </>
        )}

        {/* SEQUENCING */}
        {activeSection === "sequence" && (
          <>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4 text-blue-400" />
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Action Sequencing
                </h4>
              </div>
              <span
                className={`text-sm font-bold ${gradeColor(report.sequencing.sequenceScore >= 80 ? "A" : report.sequencing.sequenceScore >= 60 ? "C" : "F")}`}
              >
                {report.sequencing.sequenceScore}/100
              </span>
            </div>

            {/* Critical Errors */}
            {report.sequencing.criticalSequenceErrors.length > 0 && (
              <div className="bg-red-900/20 border border-red-700/30 rounded-lg p-2 mb-2">
                <h5 className="text-xs font-medium text-red-300 mb-1">
                  Critical Sequence Errors
                </h5>
                {report.sequencing.criticalSequenceErrors.map((e, i) => (
                  <p key={i} className="text-xs text-red-300/80">
                    {e}
                  </p>
                ))}
              </div>
            )}

            {/* Out of Order */}
            {report.sequencing.outOfOrderActions.length > 0 && (
              <div className="bg-slate-900/50 rounded-lg border border-slate-800 p-2">
                <h5 className="text-xs font-medium text-slate-400 mb-1">
                  Out of Order Actions
                </h5>
                {report.sequencing.outOfOrderActions.map((o, i) => (
                  <p key={i} className="text-xs text-slate-400">
                    {o.explanation}
                  </p>
                ))}
              </div>
            )}

            {/* Optimal Sequence */}
            <div className="mt-3">
              <h5 className="text-xs font-medium text-slate-400 mb-1">
                Optimal Sequence
              </h5>
              <div className="space-y-0.5">
                {report.sequencing.optimalSequence.map((a, i) => {
                  const done = report.sequencing.actualSequence.includes(a);
                  return (
                    <div
                      key={i}
                      className="flex items-center gap-1.5 text-xs"
                    >
                      <span className="text-slate-600 font-mono w-4 text-right">
                        {i + 1}
                      </span>
                      {done ? (
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <XCircle className="w-3 h-3 text-slate-600" />
                      )}
                      <span
                        className={done ? "text-slate-300" : "text-slate-600"}
                      >
                        {a.replace(/_/g, " ")}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* CRITICAL DECISIONS */}
        {activeSection === "decisions" && (
          <>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Critical Decision Points
                </h4>
              </div>
              <span className="text-xs text-slate-400">
                {report.criticalDecisions.filter((c) => c.wasCorrect).length}/
                {report.criticalDecisions.length} correct
              </span>
            </div>
            <div className="bg-slate-900/50 rounded-lg border border-slate-800 p-2">
              {report.criticalDecisions.map((cdp) => (
                <CriticalDecisionRow key={cdp.id} cdp={cdp} />
              ))}
            </div>
          </>
        )}

        {/* RESOURCES */}
        {activeSection === "resources" && (
          <>
            <div className="flex items-center gap-2 mb-2">
              <Package className="w-4 h-4 text-teal-400" />
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Resource Utilization
              </h4>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-slate-900/50 rounded-lg border border-slate-800 p-2 text-center">
                <span className="text-lg font-bold text-white">
                  {report.resourceUtilization.totalTestsOrdered}
                </span>
                <p className="text-xs text-slate-400">Total Tests</p>
              </div>
              <div className="bg-slate-900/50 rounded-lg border border-slate-800 p-2 text-center">
                <span className="text-lg font-bold text-emerald-400">
                  {report.resourceUtilization.relevantTests}
                </span>
                <p className="text-xs text-slate-400">Relevant</p>
              </div>
            </div>

            <div
              className={`rounded-lg border p-2 mt-2 ${
                report.resourceUtilization.costEfficiency === "excellent"
                  ? "bg-emerald-900/20 border-emerald-700/30"
                  : report.resourceUtilization.costEfficiency === "good"
                    ? "bg-blue-900/20 border-blue-700/30"
                    : "bg-orange-900/20 border-orange-700/30"
              }`}
            >
              <span className="text-xs text-slate-300">
                Cost Efficiency:{" "}
                <span className="font-semibold capitalize">
                  {report.resourceUtilization.costEfficiency}
                </span>{" "}
                ({report.resourceUtilization.resourceScore}/100)
              </span>
            </div>

            {report.resourceUtilization.missedCriticalTests.length > 0 && (
              <div className="mt-2">
                <h5 className="text-xs font-medium text-red-400 mb-1">
                  Missed Critical Tests
                </h5>
                {report.resourceUtilization.missedCriticalTests.map((t, i) => (
                  <p key={i} className="text-xs text-red-300/80 ml-2">
                    - {t.replace(/_/g, " ")}
                  </p>
                ))}
              </div>
            )}
            {report.resourceUtilization.unnecessaryTests.length > 0 && (
              <div className="mt-2">
                <h5 className="text-xs font-medium text-orange-400 mb-1">
                  Unnecessary Tests
                </h5>
                {report.resourceUtilization.unnecessaryTests.map((t, i) => (
                  <p key={i} className="text-xs text-orange-300/80 ml-2">
                    - {t.replace(/_/g, " ")}
                  </p>
                ))}
              </div>
            )}
            {report.resourceUtilization.duplicateOrders.length > 0 && (
              <div className="mt-2">
                <h5 className="text-xs font-medium text-yellow-400 mb-1">
                  Duplicate Orders
                </h5>
                {report.resourceUtilization.duplicateOrders.map((t, i) => (
                  <p key={i} className="text-xs text-yellow-300/80 ml-2">
                    - {t.replace(/_/g, " ")}
                  </p>
                ))}
              </div>
            )}

            {/* Communication mini-section */}
            <div className="mt-3 pt-3 border-t border-slate-800">
              <div className="flex items-center gap-2 mb-1">
                <MessageCircle className="w-3 h-3 text-slate-400" />
                <h5 className="text-xs font-medium text-slate-400">
                  Communication ({report.communication.score}/100)
                </h5>
              </div>
              <div className="space-y-0.5 ml-5 text-xs text-slate-400">
                <div>
                  Jargon instances: {report.communication.jargonInstances}
                </div>
                <div>
                  Team communication:{" "}
                  {report.communication.teamCommunication ? "Yes" : "No"}
                </div>
                <div>
                  SBAR used: {report.communication.sbarUsed ? "Yes" : "No"}
                </div>
              </div>
            </div>
          </>
        )}

        {/* RECOMMENDATIONS */}
        {activeSection === "recommendations" && (
          <>
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Learning Recommendations
              </h4>
            </div>

            {report.recommendations.length > 0 ? (
              <div className="space-y-2">
                {report.recommendations.map((r, i) => (
                  <div
                    key={i}
                    className={`text-xs rounded-lg border p-2 ${
                      r.startsWith("CRITICAL")
                        ? "bg-red-900/20 border-red-700/30 text-red-300"
                        : r.startsWith("IMPORTANT")
                          ? "bg-orange-900/20 border-orange-700/30 text-orange-300"
                          : "bg-slate-900/50 border-slate-800 text-slate-300"
                    }`}
                  >
                    {r}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-emerald-900/20 border border-emerald-700/30 rounded-lg p-3 text-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                <p className="text-xs text-emerald-300">
                  Excellent performance! No critical recommendations.
                </p>
              </div>
            )}

            <div className="mt-4">
              <h5 className="text-xs font-medium text-slate-400 mb-1">
                Suggested Readings
              </h5>
              <div className="space-y-1">
                {report.suggestedReadings.map((r, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-1.5 text-xs text-slate-400"
                  >
                    <BookOpen className="w-3 h-3 mt-0.5 flex-shrink-0 text-indigo-400" />
                    <span>{r}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
