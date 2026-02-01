import { useState } from "react";
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import type { Vitals } from "../../../types";
import type { DeteriorationRuleForm } from "../../../types/scenarioBuilder";
import { KNOWN_ACTIONS } from "../../../services/referee";

interface DeteriorationStepProps {
  rules: DeteriorationRuleForm[];
  onAdd: () => void;
  onUpdate: (id: string, updates: Partial<DeteriorationRuleForm>) => void;
  onRemove: (id: string) => void;
}

const VITAL_KEYS: { key: keyof Vitals; label: string }[] = [
  { key: "hr", label: "Heart Rate" },
  { key: "bpSystolic", label: "BP Systolic" },
  { key: "bpDiastolic", label: "BP Diastolic" },
  { key: "spo2", label: "SpO2" },
  { key: "temp", label: "Temperature" },
  { key: "respRate", label: "Resp Rate" },
];

export function DeteriorationStep({
  rules,
  onAdd,
  onUpdate,
  onRemove,
}: DeteriorationStepProps) {
  const [expandedRules, setExpandedRules] = useState<Set<string>>(new Set());

  const toggleExpanded = (id: string) => {
    setExpandedRules((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-white mb-1">
          Deterioration Rules
        </h2>
        <p className="text-sm text-slate-400">
          Define how the patient's condition deteriorates if certain actions are
          not taken within the specified time.
        </p>
      </div>

      {rules.length === 0 && (
        <div className="text-center py-8 text-slate-500 bg-slate-800/30 rounded-lg border border-slate-700/50 border-dashed">
          <p className="mb-2">No deterioration rules defined yet.</p>
          <p className="text-xs">
            Click "Add Rule" to create a time-based deterioration trigger.
          </p>
        </div>
      )}

      <div className="space-y-3">
        {rules.map((rule) => {
          const isExpanded = expandedRules.has(rule.id);

          return (
            <div
              key={rule.id}
              className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3">
                <button
                  onClick={() => toggleExpanded(rule.id)}
                  className="flex items-center gap-3 flex-1 text-left"
                >
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                  <div>
                    <span className="text-white text-sm font-medium">
                      {rule.condition || "Untitled Rule"}
                    </span>
                    <span className="text-slate-500 text-xs ml-2">
                      {rule.timerMinutes} min
                    </span>
                  </div>
                </button>
                <button
                  onClick={() => onRemove(rule.id)}
                  className="p-1.5 text-slate-500 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Expanded content */}
              {isExpanded && (
                <div className="px-4 pb-4 space-y-4 border-t border-slate-700 pt-3">
                  {/* Condition */}
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">
                      Condition Description
                    </label>
                    <input
                      type="text"
                      value={rule.condition}
                      onChange={(e) =>
                        onUpdate(rule.id, { condition: e.target.value })
                      }
                      placeholder="e.g., No oxygen administered"
                      className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
                    />
                  </div>

                  {/* Timer */}
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">
                      Timer (minutes until deterioration)
                    </label>
                    <input
                      type="number"
                      value={rule.timerMinutes}
                      onChange={(e) =>
                        onUpdate(rule.id, {
                          timerMinutes: Math.max(1, parseInt(e.target.value) || 1),
                        })
                      }
                      min={1}
                      max={60}
                      className="w-24 bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
                    />
                  </div>

                  {/* Vitals Effect */}
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">
                      Vitals Effect (values patient deteriorates to)
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {VITAL_KEYS.map(({ key, label }) => (
                        <div key={key} className="flex items-center gap-2">
                          <label className="text-xs text-slate-500 w-20 shrink-0">
                            {label}
                          </label>
                          <input
                            type="number"
                            value={rule.effect[key] ?? ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              const newEffect = { ...rule.effect };
                              if (val === "") {
                                delete newEffect[key];
                              } else {
                                newEffect[key] = parseFloat(val);
                              }
                              onUpdate(rule.id, { effect: newEffect });
                            }}
                            placeholder="-"
                            className="w-full bg-slate-900 border border-slate-600 rounded px-2 py-1 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Prevented By */}
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">
                      Prevented By (actions that stop this deterioration)
                    </label>
                    <ActionMultiSelect
                      selected={rule.preventedBy}
                      onChange={(actions) =>
                        onUpdate(rule.id, { preventedBy: actions })
                      }
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button
        onClick={onAdd}
        className="flex items-center gap-2 w-full justify-center px-4 py-3 bg-slate-800 hover:bg-slate-750 border border-slate-700 border-dashed rounded-lg text-sm text-slate-400 hover:text-white transition-colors"
      >
        <Plus className="w-4 h-4" />
        Add Deterioration Rule
      </button>
    </div>
  );
}

function ActionMultiSelect({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (actions: string[]) => void;
}) {
  const [search, setSearch] = useState("");

  const filtered = KNOWN_ACTIONS.filter(
    (a) =>
      a.toLowerCase().includes(search.toLowerCase()) && !selected.includes(a),
  );

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5">
        {selected.map((action) => (
          <span
            key={action}
            className="flex items-center gap-1 bg-emerald-500/10 text-emerald-400 text-xs px-2 py-1 rounded border border-emerald-500/20"
          >
            {action.replace(/_/g, " ")}
            <button
              onClick={() => onChange(selected.filter((a) => a !== action))}
              className="hover:text-red-400"
            >
              &times;
            </button>
          </span>
        ))}
      </div>
      <div className="relative">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search actions..."
          className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
        />
        {search && filtered.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-slate-900 border border-slate-600 rounded max-h-32 overflow-y-auto z-10">
            {filtered.slice(0, 10).map((action) => (
              <button
                key={action}
                onClick={() => {
                  onChange([...selected, action]);
                  setSearch("");
                }}
                className="w-full text-left px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800 transition-colors"
              >
                {action.replace(/_/g, " ")}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
