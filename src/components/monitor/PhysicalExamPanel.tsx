import { useState, useMemo, useCallback } from "react";
import {
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Circle,
  AlertCircle,
  Search,
  User,
  Eye,
  Heart,
  Wind as Lungs,
  Activity,
  Brain,
  Bone,
  Droplets,
} from "lucide-react";
import { useSimulation } from "../../context";
import {
  EXAM_FINDINGS,
  createPhysicalExamState,
  performExam,
  updateExamFromActions,
  getExamProgress,
  getExamAreaLabel,
} from "../../services/assessment/physicalExamService";
import { getScenarioExamFindings } from "../../services/assessment/scenarioExamFindings";
import type {
  PhysicalExamState,
  ExamArea,
  ExamTechnique,
} from "../../services/assessment/physicalExamService";

// ---------------------------------------------------------------------------
// Constants & Styling Maps
// ---------------------------------------------------------------------------

const TECHNIQUE_BADGE: Record<ExamTechnique, string> = {
  inspection: "bg-blue-500/20 text-blue-400",
  palpation: "bg-purple-500/20 text-purple-400",
  percussion: "bg-amber-500/20 text-amber-400",
  auscultation: "bg-emerald-500/20 text-emerald-400",
  special_test: "bg-pink-500/20 text-pink-400",
};

const TECHNIQUE_LABEL: Record<ExamTechnique, string> = {
  inspection: "Inspection",
  palpation: "Palpation",
  percussion: "Percussion",
  auscultation: "Auscultation",
  special_test: "Special Test",
};

/** Icons mapped to each exam area for the sidebar/tabs. */
const AREA_ICONS: Record<ExamArea, React.ReactNode> = {
  general: <User className="w-4 h-4" />,
  head_neck: <Eye className="w-4 h-4" />,
  cardiovascular: <Heart className="w-4 h-4" />,
  respiratory: <Lungs className="w-4 h-4" />,
  abdominal: <Activity className="w-4 h-4" />,
  neurological: <Brain className="w-4 h-4" />,
  musculoskeletal: <Bone className="w-4 h-4" />,
  skin: <Droplets className="w-4 h-4" />,
  peripheral_vascular: <Activity className="w-4 h-4" />,
  genitourinary: <Search className="w-4 h-4" />,
};

/** The areas we display (excludes genitourinary which has no findings). */
const DISPLAY_AREAS: ExamArea[] = [
  "general",
  "head_neck",
  "cardiovascular",
  "respiratory",
  "abdominal",
  "neurological",
  "musculoskeletal",
  "skin",
  "peripheral_vascular",
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function PhysicalExamPanel() {
  const { state, scenario } = useSimulation();

  // Track only the IDs of manually-performed exams (user clicks).
  // Auto-performed exams (from simulation actions) are derived via useMemo.
  const [manualExamIds, setManualExamIds] = useState<string[]>([]);
  const [selectedArea, setSelectedArea] = useState<ExamArea>("general");

  // Scenario-specific abnormal findings (keyed by finding ID).
  // First checks the scenario definition, then falls back to centralized data.
  const scenarioFindings = useMemo<Record<string, string> | undefined>(() => {
    const scenarioDef = scenario as unknown as Record<string, unknown>;
    if (
      scenarioDef.examFindings &&
      typeof scenarioDef.examFindings === "object"
    ) {
      return scenarioDef.examFindings as Record<string, string>;
    }
    // Fall back to centralized scenario exam findings
    const scenarioId = state.scenarioId || (scenarioDef.id as string);
    if (scenarioId) {
      return getScenarioExamFindings(scenarioId);
    }
    return undefined;
  }, [scenario, state.scenarioId]);

  // Derive the full exam state from:
  // 1. Auto-performed exams triggered by simulation actions
  // 2. Manually-performed exams clicked by the user
  // This avoids calling setState inside useEffect.
  const examState = useMemo<PhysicalExamState>(() => {
    // Start with auto-performed exams from actions taken
    let derived = updateExamFromActions(
      createPhysicalExamState(),
      state.actionsTaken,
      scenarioFindings,
    );
    // Layer on manually-performed exams
    for (const id of manualExamIds) {
      derived = performExam(derived, id, scenarioFindings);
    }
    return derived;
  }, [state.actionsTaken, manualExamIds, scenarioFindings]);

  // Derived progress data
  const progress = useMemo(() => getExamProgress(examState), [examState]);
  const totalExamined = examState.totalFindings;
  const totalAvailable = EXAM_FINDINGS.length;
  const totalAbnormal = examState.abnormalFindings;

  // Findings for the currently selected area
  const areaFindings = useMemo(
    () => EXAM_FINDINGS.filter((f) => f.area === selectedArea),
    [selectedArea],
  );

  // Set of already-performed finding IDs for quick lookup
  const performedIds = useMemo(
    () => new Set(examState.results.map((r) => r.findingId)),
    [examState.results],
  );

  // Handle clicking an exam to perform it
  const handlePerformExam = useCallback((findingId: string) => {
    setManualExamIds((prev) =>
      prev.includes(findingId) ? prev : [...prev, findingId],
    );
  }, []);

  // Get result for a performed finding
  const getResult = useCallback(
    (findingId: string) =>
      examState.results.find((r) => r.findingId === findingId),
    [examState.results],
  );

  // Progress for a given area
  const getAreaProgress = useCallback(
    (area: ExamArea) => progress.find((p) => p.area === area),
    [progress],
  );

  return (
    <div className="p-4 space-y-4">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <h2 className="text-white font-semibold text-lg flex items-center gap-2">
          <Search className="w-5 h-5 text-cyan-400" />
          Physical Examination
        </h2>
        <div className="flex items-center gap-3 text-xs">
          <span className="text-slate-400">
            <span className="text-white font-semibold">{totalExamined}</span>/
            {totalAvailable} examined
          </span>
          {totalAbnormal > 0 && (
            <span className="text-red-400 font-medium flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {totalAbnormal} abnormal
            </span>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-slate-800 rounded-full h-1.5">
        <div
          className="bg-cyan-500 h-1.5 rounded-full transition-all duration-500"
          style={{ width: `${examState.percentComplete}%` }}
        />
      </div>

      {/* ── Area Tabs (horizontal scrollable) ───────────────────────────── */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-700">
        {DISPLAY_AREAS.map((area) => {
          const ap = getAreaProgress(area);
          const isSelected = area === selectedArea;
          const hasAbnormal = (ap?.abnormal ?? 0) > 0;
          return (
            <button
              key={area}
              onClick={() => setSelectedArea(area)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors
                ${
                  isSelected
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                    : "bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700 hover:text-slate-300"
                }`}
            >
              {AREA_ICONS[area]}
              <span>{getExamAreaLabel(area)}</span>
              {ap && ap.examined > 0 && (
                <span
                  className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold
                    ${
                      hasAbnormal
                        ? "bg-red-500/20 text-red-400"
                        : ap.examined === ap.total
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-slate-600/50 text-slate-300"
                    }`}
                >
                  {ap.examined}/{ap.total}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Selected Area Content ────────────────────────────────────────── */}
      <div className="space-y-2">
        {/* Area heading */}
        <div className="flex items-center justify-between">
          <h3 className="text-slate-300 text-sm font-medium flex items-center gap-2">
            {AREA_ICONS[selectedArea]}
            {getExamAreaLabel(selectedArea)}
          </h3>
          {(() => {
            const ap = getAreaProgress(selectedArea);
            if (!ap) return null;
            return (
              <span className="text-slate-500 text-xs">
                {ap.examined}/{ap.total} completed
              </span>
            );
          })()}
        </div>

        {/* Findings list */}
        <div className="space-y-1.5">
          {areaFindings.map((finding) => {
            const performed = performedIds.has(finding.id);
            const result = performed ? getResult(finding.id) : null;

            if (performed && result) {
              // ── Performed finding ──
              return (
                <div
                  key={finding.id}
                  className={`rounded-lg p-3 border transition-colors ${
                    result.isAbnormal
                      ? "bg-red-950/30 border-red-800/50"
                      : "bg-emerald-950/20 border-emerald-800/40"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {result.isAbnormal ? (
                      <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-sm font-medium ${
                            result.isAbnormal
                              ? "text-red-300"
                              : "text-emerald-300"
                          }`}
                        >
                          {finding.label}
                        </span>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${TECHNIQUE_BADGE[finding.technique]}`}
                        >
                          {TECHNIQUE_LABEL[finding.technique]}
                        </span>
                      </div>
                      <p
                        className={`text-xs mt-1 ${
                          result.isAbnormal
                            ? "text-red-400/90"
                            : "text-emerald-400/80"
                        }`}
                      >
                        {result.finding}
                      </p>
                    </div>
                  </div>
                </div>
              );
            }

            // ── Not yet performed (clickable) ──
            return (
              <button
                key={finding.id}
                onClick={() => handlePerformExam(finding.id)}
                className="w-full text-left rounded-lg p-3 bg-slate-800/60 border border-slate-700/60
                  hover:bg-slate-700/80 hover:border-slate-600 transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Circle className="w-4 h-4 text-slate-600 group-hover:text-cyan-500 transition-colors shrink-0" />
                  <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
                    <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
                      {finding.label}
                    </span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${TECHNIQUE_BADGE[finding.technique]}`}
                    >
                      {TECHNIQUE_LABEL[finding.technique]}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 transition-colors shrink-0" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Summary Accordion ────────────────────────────────────────────── */}
      {examState.results.length > 0 && (
        <SummaryAccordion examState={examState} />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-component: collapsible summary of all abnormal findings
// ---------------------------------------------------------------------------

function SummaryAccordion({ examState }: { examState: PhysicalExamState }) {
  const [isOpen, setIsOpen] = useState(false);

  const abnormalResults = examState.results.filter((r) => r.isAbnormal);

  if (abnormalResults.length === 0) return null;

  return (
    <div className="bg-red-950/20 border border-red-800/40 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-red-300 hover:bg-red-950/30 transition-colors"
      >
        <span className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          Abnormal Findings ({abnormalResults.length})
        </span>
        {isOpen ? (
          <ChevronDown className="w-4 h-4" />
        ) : (
          <ChevronRight className="w-4 h-4" />
        )}
      </button>
      {isOpen && (
        <div className="px-3 pb-3 space-y-1.5">
          {abnormalResults.map((result) => {
            const finding = EXAM_FINDINGS.find(
              (f) => f.id === result.findingId,
            );
            return (
              <div
                key={result.findingId}
                className="flex items-start gap-2 text-xs"
              >
                <AlertCircle className="w-3 h-3 text-red-400 mt-0.5 shrink-0" />
                <div>
                  <span className="text-red-300 font-medium">
                    {finding?.label ?? result.findingId}:
                  </span>{" "}
                  <span className="text-red-400/80">{result.finding}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
