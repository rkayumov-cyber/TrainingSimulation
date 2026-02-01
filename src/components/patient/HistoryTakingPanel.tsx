// ============================================================================
// HistoryTakingPanel.tsx
//
// Structured history-taking panel with categorised questions the doctor can
// click to ask. Tracks progress per category and overall completion.
// ============================================================================

import { useState, useCallback } from "react";
import { useSimulation } from "../../context";
import {
  HISTORY_CATEGORIES,
  createHistoryTakingState,
  updateHistoryTakingState,
  getCategoryProgress,
} from "../../services/assessment/historyTakingService";
import type {
  HistoryTakingState,
  HistoryCategory,
} from "../../services/assessment/historyTakingService";
import {
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Circle,
  MessageSquare,
  FileText,
  Pill,
  Users,
  Home,
  Stethoscope,
  ClipboardList,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// ---------------------------------------------------------------------------
// Icon mapping by category ID
// ---------------------------------------------------------------------------

const CATEGORY_ICON_MAP: Record<HistoryCategory, LucideIcon> = {
  presenting_complaint: MessageSquare,
  hpi: FileText,
  pmh: ClipboardList,
  drug_history: Pill,
  family_history: Users,
  social_history: Home,
  systems_review: Stethoscope,
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function HistoryTakingPanel() {
  const { sendDoctorMessage } = useSimulation();

  const [historyState, setHistoryState] = useState<HistoryTakingState>(
    createHistoryTakingState,
  );
  const [expandedCategories, setExpandedCategories] = useState<
    Set<HistoryCategory>
  >(new Set());

  // ── Toggle a category open / closed ────────────────────────────────────
  const toggleCategory = useCallback((categoryId: HistoryCategory) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  }, []);

  // ── Ask a question ─────────────────────────────────────────────────────
  const askQuestion = useCallback(
    (questionId: string, questionText: string) => {
      sendDoctorMessage(questionText);
      setHistoryState((prev) => updateHistoryTakingState(prev, questionId));
    },
    [sendDoctorMessage],
  );

  // ── Derived data ───────────────────────────────────────────────────────
  const categoryProgress = getCategoryProgress(historyState);
  const askedSet = new Set(historyState.questionsAsked);

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700 bg-slate-800">
        <h2 className="text-sm font-semibold tracking-wide uppercase text-slate-200">
          History Taking
        </h2>
        <span className="text-xs text-slate-400">
          {historyState.askedCount}/{historyState.totalQuestions} questions
          {historyState.percentComplete > 0 && (
            <span className="ml-1 text-blue-400">
              ({historyState.percentComplete}%)
            </span>
          )}
        </span>
      </div>

      {/* ── Overall progress bar ───────────────────────────────────────── */}
      <div className="px-4 pt-3 pb-1">
        <div className="h-1.5 w-full rounded-full bg-slate-700 overflow-hidden">
          <div
            className="h-full rounded-full bg-blue-500 transition-all duration-300"
            style={{ width: `${historyState.percentComplete}%` }}
          />
        </div>
      </div>

      {/* ── Category accordion list (scrollable) ───────────────────────── */}
      <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-2 mt-2">
        {HISTORY_CATEGORIES.map((category) => {
          const isExpanded = expandedCategories.has(category.id);
          const progress = categoryProgress.find(
            (p) => p.category === category.id,
          );
          const Icon = CATEGORY_ICON_MAP[category.id] ?? MessageSquare;
          const isComplete = progress
            ? progress.asked === progress.total
            : false;

          return (
            <div
              key={category.id}
              className="rounded-lg border border-slate-700 bg-slate-800 overflow-hidden"
            >
              {/* ── Category header (clickable) ──────────────────────── */}
              <button
                type="button"
                onClick={() => toggleCategory(category.id)}
                className="flex items-center gap-3 w-full px-3 py-2.5 text-left hover:bg-slate-700/40 transition-colors"
              >
                {/* Expand / collapse chevron */}
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
                )}

                {/* Category icon */}
                <Icon
                  className={`w-4 h-4 shrink-0 ${isComplete ? "text-green-400" : "text-blue-400"}`}
                />

                {/* Name + inline progress */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-sm font-medium truncate ${isComplete ? "text-green-300" : "text-slate-200"}`}
                    >
                      {category.name}
                    </span>
                    <span className="text-xs text-slate-500 ml-2 shrink-0">
                      {progress?.asked ?? 0}/{progress?.total ?? 0}
                    </span>
                  </div>

                  {/* Mini progress bar */}
                  <div className="h-1 w-full rounded-full bg-slate-700 mt-1">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isComplete ? "bg-green-500" : "bg-blue-500"
                      }`}
                      style={{ width: `${progress?.percent ?? 0}%` }}
                    />
                  </div>
                </div>
              </button>

              {/* ── Expanded question list ────────────────────────────── */}
              {isExpanded && (
                <div className="px-3 pb-2 space-y-1">
                  {category.questions.map((question) => {
                    const isAsked = askedSet.has(question.id);

                    return isAsked ? (
                      // ── Asked state (greyed out) ──────────────────────
                      <div
                        key={question.id}
                        className="flex items-start gap-2.5 rounded-lg px-3 py-2 text-slate-500"
                      >
                        <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-green-500/70" />
                        <span className="text-sm line-through leading-snug">
                          {question.text}
                        </span>
                      </div>
                    ) : (
                      // ── Unasked state (clickable) ─────────────────────
                      <button
                        key={question.id}
                        type="button"
                        onClick={() => askQuestion(question.id, question.text)}
                        className="flex items-start gap-2.5 w-full text-left rounded-lg px-3 py-2 cursor-pointer hover:bg-slate-700/50 transition-colors group"
                      >
                        <Circle className="w-4 h-4 mt-0.5 shrink-0 text-blue-400 group-hover:text-blue-300" />
                        <span className="text-sm text-blue-400 group-hover:text-blue-300 leading-snug">
                          {question.text}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
