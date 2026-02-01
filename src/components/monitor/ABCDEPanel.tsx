import { useState, useMemo } from "react";
import {
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronRight,
  Wind,
  Activity,
  Heart,
  Brain,
  Eye,
} from "lucide-react";
import { useSimulation } from "../../context";
import {
  createABCDEAssessment,
  updateABCDEAssessment,
  getABCDEProgress,
} from "../../services/assessment/abcdeService";
import type {
  ABCDEAssessment,
  ABCDECategory,
} from "../../services/assessment/abcdeService";

// ── Icon mapping per category ────────────────

const CATEGORY_ICONS: Record<ABCDECategory, React.ElementType> = {
  airway: Wind,
  breathing: Activity,
  circulation: Heart,
  disability: Brain,
  exposure: Eye,
};

// ── Color mapping per category ───────────────

const CATEGORY_COLORS: Record<
  ABCDECategory,
  { bg: string; text: string; bar: string }
> = {
  airway: {
    bg: "bg-red-500/20",
    text: "text-red-400",
    bar: "bg-red-500",
  },
  breathing: {
    bg: "bg-blue-500/20",
    text: "text-blue-400",
    bar: "bg-blue-500",
  },
  circulation: {
    bg: "bg-purple-500/20",
    text: "text-purple-400",
    bar: "bg-purple-500",
  },
  disability: {
    bg: "bg-amber-500/20",
    text: "text-amber-400",
    bar: "bg-amber-500",
  },
  exposure: {
    bg: "bg-teal-500/20",
    text: "text-teal-400",
    bar: "bg-teal-500",
  },
};

// ── Display labels ───────────────────────────

const CATEGORY_LABELS: Record<ABCDECategory, { letter: string; name: string }> =
  {
    airway: { letter: "A", name: "Airway" },
    breathing: { letter: "B", name: "Breathing" },
    circulation: { letter: "C", name: "Circulation" },
    disability: { letter: "D", name: "Disability" },
    exposure: { letter: "E", name: "Exposure" },
  };

const ABCDE_ORDER: ABCDECategory[] = [
  "airway",
  "breathing",
  "circulation",
  "disability",
  "exposure",
];

// ── Component ────────────────────────────────

export function ABCDEPanel() {
  const { state } = useSimulation();

  // Derive assessment from current simulation state.
  // createABCDEAssessment builds a fresh blank assessment, then
  // updateABCDEAssessment applies all actions taken so far.
  const assessment = useMemo<ABCDEAssessment>(() => {
    const base = createABCDEAssessment();
    return updateABCDEAssessment(
      base,
      state.actionsTaken,
      state.chatMessages.length,
    );
  }, [state.actionsTaken, state.chatMessages.length]);

  // Accordion expand state: track which categories are open
  const [expanded, setExpanded] = useState<Record<ABCDECategory, boolean>>({
    airway: true,
    breathing: false,
    circulation: false,
    disability: false,
    exposure: false,
  });

  // Progress entries for the bottom bar
  const progress = useMemo(() => getABCDEProgress(assessment), [assessment]);

  // Toggle accordion
  const toggleCategory = (cat: ABCDECategory) => {
    setExpanded((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  return (
    <div className="p-4 space-y-4">
      {/* ── Header ─────────────────────────────── */}
      <div className="flex items-center justify-between">
        <h2 className="text-white font-semibold text-lg flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-400" />
          ABCDE Assessment
        </h2>
        <span
          className={`text-xs font-bold px-2.5 py-1 rounded-full ${
            assessment.percentComplete === 100
              ? "bg-emerald-500/20 text-emerald-400"
              : "bg-slate-700 text-slate-300"
          }`}
        >
          {assessment.percentComplete}%
        </span>
      </div>

      {/* ── Category accordions ────────────────── */}
      <div className="space-y-2">
        {ABCDE_ORDER.map((cat) => {
          const catState = assessment.categories[cat];
          const colors = CATEGORY_COLORS[cat];
          const labels = CATEGORY_LABELS[cat];
          const Icon = CATEGORY_ICONS[cat];
          const isExpanded = expanded[cat];
          const isCurrent = assessment.currentPhase === cat;
          const isComplete = catState.completed;

          // Icon color based on status
          const iconColorClass = isComplete
            ? "text-green-400"
            : isCurrent
              ? "text-emerald-400"
              : "text-slate-500";

          return (
            <div
              key={cat}
              className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden"
            >
              {/* Accordion header */}
              <button
                onClick={() => toggleCategory(cat)}
                className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-slate-750 transition-colors text-left"
              >
                {/* Category icon */}
                <Icon className={`w-5 h-5 flex-shrink-0 ${iconColorClass}`} />

                {/* Letter badge */}
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded ${colors.bg} ${colors.text}`}
                >
                  {labels.letter}
                </span>

                {/* Category name */}
                <span className="text-white text-sm font-medium flex-1">
                  {labels.letter} &mdash; {labels.name}
                </span>

                {/* Progress fraction */}
                <span className="text-slate-400 text-xs font-mono mr-1">
                  {catState.score}/{catState.maxScore}
                </span>

                {/* Chevron */}
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-slate-500 flex-shrink-0" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-500 flex-shrink-0" />
                )}
              </button>

              {/* Expanded content */}
              {isExpanded && (
                <div className="px-3 pb-3 space-y-1.5">
                  <div className="border-t border-slate-700 mb-2" />
                  {catState.items.map((item) => (
                    <div
                      key={item.id}
                      className={`flex items-start gap-2.5 py-1.5 px-2 rounded ${
                        item.completed ? "bg-emerald-950/20" : "bg-transparent"
                      }`}
                    >
                      {/* Check / circle icon */}
                      {item.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-600 flex-shrink-0 mt-0.5" />
                      )}

                      {/* Label + description */}
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm leading-tight ${
                            item.completed
                              ? "text-slate-500 line-through"
                              : "text-slate-200"
                          }`}
                        >
                          {item.label}
                        </p>
                        <p
                          className={`text-xs leading-snug mt-0.5 ${
                            item.completed ? "text-slate-600" : "text-slate-500"
                          }`}
                        >
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Segmented progress bar ─────────────── */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>Overall Progress</span>
          <span>
            {assessment.totalScore}/{assessment.maxTotalScore} items
          </span>
        </div>
        <div className="flex h-2 rounded-full overflow-hidden bg-slate-700 gap-px">
          {progress.map((entry) => {
            const widthPercent =
              assessment.maxTotalScore > 0
                ? (entry.total / assessment.maxTotalScore) * 100
                : 20;
            const fillPercent = entry.percent;
            const colors = CATEGORY_COLORS[entry.category];

            return (
              <div
                key={entry.category}
                className="relative h-full bg-slate-700"
                style={{ width: `${widthPercent}%` }}
                title={`${entry.label}: ${entry.completed}/${entry.total}`}
              >
                <div
                  className={`absolute inset-y-0 left-0 ${colors.bar} transition-all duration-500 ease-out`}
                  style={{ width: `${fillPercent}%` }}
                />
              </div>
            );
          })}
        </div>
        {/* Category color legend */}
        <div className="flex items-center gap-3 flex-wrap pt-1">
          {ABCDE_ORDER.map((cat) => {
            const colors = CATEGORY_COLORS[cat];
            const labels = CATEGORY_LABELS[cat];
            return (
              <div key={cat} className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${colors.bar}`} />
                <span className="text-[10px] text-slate-500">
                  {labels.letter}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
