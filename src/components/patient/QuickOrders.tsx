import { useState, useMemo } from "react";
import { Check } from "lucide-react";
import {
  getActionsByCategory,
  isActionTaken,
  getCategoryColor,
  getCategoryBgColor,
  CATEGORY_META,
} from "../../services/referee";
import type { ActionCategory } from "../../services/referee";

interface QuickOrdersProps {
  onSelectAction: (command: string) => void;
  actionsTaken: string[];
  disabled: boolean;
}

export function QuickOrders({
  onSelectAction,
  actionsTaken,
  disabled,
}: QuickOrdersProps) {
  const [activeCategory, setActiveCategory] = useState<ActionCategory | null>(
    null,
  );

  const actionsByCategory = useMemo(() => getActionsByCategory(), []);

  const categoryCounts = useMemo(() => {
    const counts: Record<ActionCategory, { done: number; total: number }> = {
      exam: { done: 0, total: 0 },
      lab: { done: 0, total: 0 },
      medication: { done: 0, total: 0 },
      treatment: { done: 0, total: 0 },
      imaging: { done: 0, total: 0 },
    };
    for (const [cat, actions] of Object.entries(actionsByCategory)) {
      const category = cat as ActionCategory;
      counts[category].total = actions.length;
      counts[category].done = actions.filter((a) =>
        isActionTaken(a, actionsTaken),
      ).length;
    }
    return counts;
  }, [actionsByCategory, actionsTaken]);

  const toggleCategory = (cat: ActionCategory) => {
    setActiveCategory((prev) => (prev === cat ? null : cat));
  };

  const activeActions = activeCategory ? actionsByCategory[activeCategory] : [];

  return (
    <div className="space-y-0">
      {/* Category pill bar */}
      <div className="flex gap-1.5 flex-wrap px-1">
        {CATEGORY_META.map((meta) => {
          const isActive = activeCategory === meta.category;
          const { done, total } = categoryCounts[meta.category];
          return (
            <button
              key={meta.category}
              onClick={() => toggleCategory(meta.category)}
              disabled={disabled}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                isActive
                  ? `${getCategoryBgColor(meta.category)} ${getCategoryColor(meta.category)} ring-1 ring-current`
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-300"
              }`}
            >
              <span>{meta.icon}</span>
              <span>{meta.label}</span>
              {done > 0 && (
                <span
                  className={`ml-0.5 px-1.5 py-0 rounded-full text-[10px] ${
                    isActive ? "bg-white/10" : "bg-slate-700"
                  }`}
                >
                  {done}/{total}
                </span>
              )}
              {isActive && <span className="ml-0.5">▼</span>}
            </button>
          );
        })}
      </div>

      {/* Expanded action grid */}
      {activeCategory && activeActions.length > 0 && (
        <div className="mt-2 mx-1 p-2 rounded-lg border border-slate-700 bg-slate-900/50 max-h-48 overflow-y-auto">
          <div className="flex flex-wrap gap-1.5">
            {activeActions.map((action) => {
              const taken = isActionTaken(action, actionsTaken);
              return (
                <button
                  key={action.actionId}
                  onClick={() => !taken && onSelectAction(action.command)}
                  disabled={disabled || taken}
                  title={action.description}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs transition-all ${
                    taken
                      ? "bg-slate-800/50 text-slate-600 cursor-default"
                      : `${getCategoryBgColor(action.category)} ${getCategoryColor(action.category)} hover:brightness-125 disabled:opacity-50 disabled:cursor-not-allowed`
                  }`}
                >
                  {taken && <Check className="w-3 h-3" />}
                  <span>{action.command}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
