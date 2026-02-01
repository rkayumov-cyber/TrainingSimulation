import { useState } from "react";
import { Plus, Trash2, Target, ArrowRight, Clock } from "lucide-react";
import type {
  BenchmarkDefinition,
  ExpectedAction,
  ExpectedSequence,
  TimingThreshold,
} from "../../../types/scenarioBuilder";
import { KNOWN_ACTIONS } from "../../../services/referee";

interface BenchmarkStepProps {
  benchmark: BenchmarkDefinition;
  correctActions: string[];
  onUpdate: (updates: Partial<BenchmarkDefinition>) => void;
}

export function BenchmarkStep({
  benchmark,
  correctActions,
  onUpdate,
}: BenchmarkStepProps) {
  const [activeSection, setActiveSection] = useState<
    "actions" | "sequences" | "timing"
  >("actions");

  const allActions = Array.from(
    new Set([...KNOWN_ACTIONS, ...correctActions]),
  );

  // Expected actions
  const addExpectedAction = () => {
    const newAction: ExpectedAction = {
      action: "",
      label: "",
      required: true,
      maxTimeMinutes: 5,
      points: 10,
    };
    onUpdate({
      expectedActions: [...benchmark.expectedActions, newAction],
    });
  };

  const updateExpectedAction = (idx: number, updates: Partial<ExpectedAction>) => {
    const next = [...benchmark.expectedActions];
    next[idx] = { ...next[idx], ...updates };
    // Auto-fill label from action name
    if (updates.action && !next[idx].label) {
      next[idx].label = updates.action.replace(/_/g, " ");
    }
    onUpdate({ expectedActions: next });
  };

  const removeExpectedAction = (idx: number) => {
    onUpdate({
      expectedActions: benchmark.expectedActions.filter((_, i) => i !== idx),
    });
  };

  // Sequences
  const addSequence = () => {
    const newSeq: ExpectedSequence = {
      before: "",
      after: "",
      points: 5,
      penalty: -5,
    };
    onUpdate({
      expectedSequences: [...benchmark.expectedSequences, newSeq],
    });
  };

  const updateSequence = (idx: number, updates: Partial<ExpectedSequence>) => {
    const next = [...benchmark.expectedSequences];
    next[idx] = { ...next[idx], ...updates };
    onUpdate({ expectedSequences: next });
  };

  const removeSequence = (idx: number) => {
    onUpdate({
      expectedSequences: benchmark.expectedSequences.filter((_, i) => i !== idx),
    });
  };

  // Timing thresholds
  const addTimingThreshold = () => {
    const newTiming: TimingThreshold = {
      action: "",
      gradeA: 60,
      gradeB: 120,
      gradeC: 180,
      gradeD: 300,
    };
    onUpdate({
      timingThresholds: [...benchmark.timingThresholds, newTiming],
    });
  };

  const updateTimingThreshold = (
    idx: number,
    updates: Partial<TimingThreshold>,
  ) => {
    const next = [...benchmark.timingThresholds];
    next[idx] = { ...next[idx], ...updates };
    onUpdate({ timingThresholds: next });
  };

  const removeTimingThreshold = (idx: number) => {
    onUpdate({
      timingThresholds: benchmark.timingThresholds.filter((_, i) => i !== idx),
    });
  };

  const sections = [
    { id: "actions" as const, label: "Expected Actions", icon: <Target className="w-3.5 h-3.5" /> },
    { id: "sequences" as const, label: "Sequences", icon: <ArrowRight className="w-3.5 h-3.5" /> },
    { id: "timing" as const, label: "Timing", icon: <Clock className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-white mb-1">
          Benchmark Definition
        </h2>
        <p className="text-sm text-slate-400">
          Define scoring criteria to assess trainee performance against this
          scenario. This is optional.
        </p>
      </div>

      {/* Passing Score */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">
          Passing Score Threshold
        </label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={0}
            max={100}
            value={benchmark.passingScore}
            onChange={(e) =>
              onUpdate({ passingScore: parseInt(e.target.value) })
            }
            className="flex-1 accent-emerald-500"
          />
          <span className="text-white font-mono text-sm w-12 text-right">
            {benchmark.passingScore}%
          </span>
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="flex gap-1 bg-slate-800/50 p-1 rounded-lg">
        {sections.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded text-xs font-medium transition-colors ${
              activeSection === s.id
                ? "bg-slate-700 text-white"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {s.icon}
            {s.label}
          </button>
        ))}
      </div>

      {/* Expected Actions */}
      {activeSection === "actions" && (
        <div className="space-y-3">
          {benchmark.expectedActions.map((ea, idx) => (
            <div
              key={idx}
              className="bg-slate-800 border border-slate-700 rounded-lg p-3 space-y-2"
            >
              <div className="flex items-center gap-2">
                <select
                  value={ea.action}
                  onChange={(e) =>
                    updateExpectedAction(idx, { action: e.target.value })
                  }
                  className="flex-1 bg-slate-900 border border-slate-600 rounded px-2 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
                >
                  <option value="">Select action...</option>
                  {allActions.map((a) => (
                    <option key={a} value={a}>
                      {a.replace(/_/g, " ")}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => removeExpectedAction(idx)}
                  className="p-1 text-slate-500 hover:text-red-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <label className="flex items-center gap-2 text-xs text-slate-400">
                  <input
                    type="checkbox"
                    checked={ea.required}
                    onChange={(e) =>
                      updateExpectedAction(idx, { required: e.target.checked })
                    }
                    className="accent-emerald-500"
                  />
                  Required
                </label>
                <div className="flex items-center gap-1">
                  <label className="text-xs text-slate-500">Max min:</label>
                  <input
                    type="number"
                    value={ea.maxTimeMinutes}
                    onChange={(e) =>
                      updateExpectedAction(idx, {
                        maxTimeMinutes: parseFloat(e.target.value) || 1,
                      })
                    }
                    min={0.5}
                    step={0.5}
                    className="w-14 bg-slate-900 border border-slate-600 rounded px-1.5 py-1 text-xs text-white focus:outline-none"
                  />
                </div>
                <div className="flex items-center gap-1">
                  <label className="text-xs text-slate-500">Points:</label>
                  <input
                    type="number"
                    value={ea.points}
                    onChange={(e) =>
                      updateExpectedAction(idx, {
                        points: parseInt(e.target.value) || 0,
                      })
                    }
                    min={0}
                    className="w-14 bg-slate-900 border border-slate-600 rounded px-1.5 py-1 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>
            </div>
          ))}
          <button
            onClick={addExpectedAction}
            className="flex items-center gap-2 w-full justify-center px-4 py-2.5 bg-slate-800/50 border border-slate-700 border-dashed rounded-lg text-xs text-slate-400 hover:text-white transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Expected Action
          </button>
        </div>
      )}

      {/* Expected Sequences */}
      {activeSection === "sequences" && (
        <div className="space-y-3">
          <p className="text-xs text-slate-500">
            Define action ordering rules. The "before" action should be performed
            before the "after" action.
          </p>
          {benchmark.expectedSequences.map((seq, idx) => (
            <div
              key={idx}
              className="bg-slate-800 border border-slate-700 rounded-lg p-3 flex items-center gap-2"
            >
              <select
                value={seq.before}
                onChange={(e) =>
                  updateSequence(idx, { before: e.target.value })
                }
                className="flex-1 bg-slate-900 border border-slate-600 rounded px-2 py-1.5 text-xs text-white focus:outline-none"
              >
                <option value="">Before...</option>
                {allActions.map((a) => (
                  <option key={a} value={a}>
                    {a.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
              <ArrowRight className="w-4 h-4 text-slate-500 shrink-0" />
              <select
                value={seq.after}
                onChange={(e) =>
                  updateSequence(idx, { after: e.target.value })
                }
                className="flex-1 bg-slate-900 border border-slate-600 rounded px-2 py-1.5 text-xs text-white focus:outline-none"
              >
                <option value="">After...</option>
                {allActions.map((a) => (
                  <option key={a} value={a}>
                    {a.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={seq.points}
                  onChange={(e) =>
                    updateSequence(idx, { points: parseInt(e.target.value) || 0 })
                  }
                  className="w-12 bg-slate-900 border border-slate-600 rounded px-1.5 py-1 text-xs text-white focus:outline-none"
                  title="Points if correct"
                />
                <input
                  type="number"
                  value={seq.penalty}
                  onChange={(e) =>
                    updateSequence(idx, {
                      penalty: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-12 bg-slate-900 border border-slate-600 rounded px-1.5 py-1 text-xs text-red-400 focus:outline-none"
                  title="Penalty if wrong"
                />
              </div>
              <button
                onClick={() => removeSequence(idx)}
                className="p-1 text-slate-500 hover:text-red-400"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
          <button
            onClick={addSequence}
            className="flex items-center gap-2 w-full justify-center px-4 py-2.5 bg-slate-800/50 border border-slate-700 border-dashed rounded-lg text-xs text-slate-400 hover:text-white transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Sequence Rule
          </button>
        </div>
      )}

      {/* Timing Thresholds */}
      {activeSection === "timing" && (
        <div className="space-y-3">
          <p className="text-xs text-slate-500">
            Set grade cutoffs in seconds for each action. Grade F is anything
            beyond Grade D threshold.
          </p>
          {benchmark.timingThresholds.map((tt, idx) => (
            <div
              key={idx}
              className="bg-slate-800 border border-slate-700 rounded-lg p-3 space-y-2"
            >
              <div className="flex items-center gap-2">
                <select
                  value={tt.action}
                  onChange={(e) =>
                    updateTimingThreshold(idx, { action: e.target.value })
                  }
                  className="flex-1 bg-slate-900 border border-slate-600 rounded px-2 py-1.5 text-xs text-white focus:outline-none"
                >
                  <option value="">Select action...</option>
                  {allActions.map((a) => (
                    <option key={a} value={a}>
                      {a.replace(/_/g, " ")}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => removeTimingThreshold(idx)}
                  className="p-1 text-slate-500 hover:text-red-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {(["gradeA", "gradeB", "gradeC", "gradeD"] as const).map(
                  (grade) => (
                    <div key={grade} className="text-center">
                      <label
                        className={`block text-xs font-medium mb-0.5 ${
                          grade === "gradeA"
                            ? "text-emerald-400"
                            : grade === "gradeB"
                              ? "text-blue-400"
                              : grade === "gradeC"
                                ? "text-amber-400"
                                : "text-orange-400"
                        }`}
                      >
                        {grade.replace("grade", "")}
                      </label>
                      <div className="flex items-center gap-0.5">
                        <input
                          type="number"
                          value={tt[grade]}
                          onChange={(e) =>
                            updateTimingThreshold(idx, {
                              [grade]: parseInt(e.target.value) || 0,
                            })
                          }
                          min={0}
                          className="w-full bg-slate-900 border border-slate-600 rounded px-1.5 py-1 text-xs text-white text-center focus:outline-none"
                        />
                        <span className="text-xs text-slate-500">s</span>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>
          ))}
          <button
            onClick={addTimingThreshold}
            className="flex items-center gap-2 w-full justify-center px-4 py-2.5 bg-slate-800/50 border border-slate-700 border-dashed rounded-lg text-xs text-slate-400 hover:text-white transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Timing Threshold
          </button>
        </div>
      )}
    </div>
  );
}
