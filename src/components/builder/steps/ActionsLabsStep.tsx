import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { KNOWN_ACTIONS } from "../../../services/referee";

interface ActionsLabsStepProps {
  correctActions: string[];
  labResults: Record<string, string>;
  onUpdateActions: (actions: string[]) => void;
  onUpdateLab: (key: string, value: string) => void;
  onRemoveLab: (key: string) => void;
}

export function ActionsLabsStep({
  correctActions,
  labResults,
  onUpdateActions,
  onUpdateLab,
  onRemoveLab,
}: ActionsLabsStepProps) {
  const [customAction, setCustomAction] = useState("");
  const [newLabName, setNewLabName] = useState("");
  const [newLabValue, setNewLabValue] = useState("");

  const toggleAction = (action: string) => {
    if (correctActions.includes(action)) {
      onUpdateActions(correctActions.filter((a) => a !== action));
    } else {
      onUpdateActions([...correctActions, action]);
    }
  };

  const addCustomAction = () => {
    const trimmed = customAction.trim().replace(/\s+/g, "_").toLowerCase();
    if (trimmed && !correctActions.includes(trimmed)) {
      onUpdateActions([...correctActions, trimmed]);
      setCustomAction("");
    }
  };

  const addLab = () => {
    if (newLabName.trim() && newLabValue.trim()) {
      onUpdateLab(newLabName.trim().toLowerCase(), newLabValue.trim());
      setNewLabName("");
      setNewLabValue("");
    }
  };

  return (
    <div className="space-y-8">
      {/* Correct Actions */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-white mb-1">
            Correct Actions
          </h2>
          <p className="text-sm text-slate-400">
            Select the actions that are considered correct for this scenario.
            These are used for scoring.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-2">
          {KNOWN_ACTIONS.map((action) => (
            <label
              key={action}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer text-sm transition-colors ${
                correctActions.includes(action)
                  ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                  : "bg-slate-800/50 border border-slate-700 text-slate-400 hover:bg-slate-800"
              }`}
            >
              <input
                type="checkbox"
                checked={correctActions.includes(action)}
                onChange={() => toggleAction(action)}
                className="rounded accent-emerald-500"
              />
              <span>{action.replace(/_/g, " ")}</span>
            </label>
          ))}
        </div>

        {/* Custom action entry */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={customAction}
            onChange={(e) => setCustomAction(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addCustomAction();
              }
            }}
            placeholder="Add custom action..."
            className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
          />
          <button
            onClick={addCustomAction}
            className="flex items-center gap-1 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg text-sm transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add
          </button>
        </div>

        {correctActions.length > 0 && (
          <div className="text-xs text-slate-500">
            {correctActions.length} action{correctActions.length !== 1 ? "s" : ""} selected
          </div>
        )}
      </div>

      {/* Lab Results */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-white mb-1">Lab Results</h2>
          <p className="text-sm text-slate-400">
            Define the lab results that will be returned when the trainee orders
            tests.
          </p>
        </div>

        {Object.keys(labResults).length > 0 && (
          <div className="space-y-2">
            {Object.entries(labResults).map(([key, value]) => (
              <div
                key={key}
                className="flex items-center gap-3 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2"
              >
                <span className="text-emerald-400 text-sm font-medium w-36 shrink-0">
                  {key}
                </span>
                <input
                  type="text"
                  value={value}
                  onChange={(e) => onUpdateLab(key, e.target.value)}
                  className="flex-1 bg-transparent text-sm text-white focus:outline-none"
                />
                <button
                  onClick={() => onRemoveLab(key)}
                  className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newLabName}
            onChange={(e) => setNewLabName(e.target.value)}
            placeholder="Lab name (e.g., lactate)"
            className="w-40 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
          />
          <input
            type="text"
            value={newLabValue}
            onChange={(e) => setNewLabValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addLab();
              }
            }}
            placeholder="Result (e.g., 4.2 mmol/L (elevated))"
            className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
          />
          <button
            onClick={addLab}
            className="flex items-center gap-1 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg text-sm transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
