import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  LayoutTemplate,
  Pencil,
  Trash2,
  Download,
  Play,
  Wrench,
} from "lucide-react";
import { getAllScenarios } from "../../scenarios";
import {
  getAllCustomScenarios,
  deleteCustomScenario,
  exportScenario,
} from "../../services/persistence";
import { registerCustomScenarios } from "../../scenarios";
import type { ScenarioDefinition } from "../../types";
import type { CustomScenarioDefinition } from "../../types/scenarioBuilder";

function isCustomScenario(
  s: ScenarioDefinition,
): s is CustomScenarioDefinition {
  return "isCustom" in s && (s as CustomScenarioDefinition).isCustom === true;
}

interface ScenarioListPanelProps {
  onNewScenario: () => void;
  onNewFromTemplate: () => void;
  onEditScenario: (id: string) => void;
  onPreviewScenario: (id: string) => void;
}

export function ScenarioListPanel({
  onNewScenario,
  onNewFromTemplate,
  onEditScenario,
  onPreviewScenario,
}: ScenarioListPanelProps) {
  const [search, setSearch] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const scenarios = getAllScenarios();

  // Re-register customs on mount
  useEffect(() => {
    getAllCustomScenarios().then((customs) => {
      registerCustomScenarios(customs);
      setRefreshKey((k) => k + 1);
    });
  }, []);

  const filtered = scenarios.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase()),
  );

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this custom scenario permanently?")) return;
    await deleteCustomScenario(id);
    const customs = await getAllCustomScenarios();
    registerCustomScenarios(customs);
    setRefreshKey((k) => k + 1);
  };

  const handleExport = async (id: string) => {
    const data = await exportScenario(id);
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `scenario-${data.scenario.name.replace(/\s+/g, "-").toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Use refreshKey to trigger re-render
  void refreshKey;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Scenarios</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={onNewFromTemplate}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
          >
            <LayoutTemplate className="w-3.5 h-3.5" />
            From Template
          </button>
          <button
            onClick={onNewScenario}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            New Scenario
          </button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search scenarios..."
          className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
        />
      </div>

      <div className="space-y-2">
        {filtered.map((scenario) => {
          const custom = isCustomScenario(scenario);
          return (
            <div
              key={scenario.id}
              className="bg-slate-800 border border-slate-700 rounded-lg p-3 flex items-start gap-3"
            >
              <div className="w-8 h-8 rounded bg-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                {custom ? (
                  <Wrench className="w-4 h-4 text-teal-400" />
                ) : (
                  <Play className="w-4 h-4 text-emerald-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-white text-sm font-medium truncate">
                    {scenario.name}
                  </p>
                  {custom && (
                    <span className="text-xs text-teal-400 bg-teal-400/10 px-1.5 py-0.5 rounded shrink-0">
                      Custom
                    </span>
                  )}
                </div>
                <p className="text-slate-400 text-xs mt-0.5 line-clamp-1">
                  {scenario.description}
                </p>
                {custom && (
                  <div className="flex items-center gap-1 mt-1.5">
                    {(scenario as CustomScenarioDefinition).tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs text-slate-500 bg-slate-700 px-1.5 py-0.5 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => onPreviewScenario(scenario.id)}
                  className="p-1.5 text-slate-500 hover:text-blue-400 transition-colors"
                  title="Preview"
                >
                  <Play className="w-3.5 h-3.5" />
                </button>
                {custom && (
                  <>
                    <button
                      onClick={() => onEditScenario(scenario.id)}
                      className="p-1.5 text-slate-500 hover:text-amber-400 transition-colors"
                      title="Edit"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleExport(scenario.id)}
                      className="p-1.5 text-slate-500 hover:text-emerald-400 transition-colors"
                      title="Export"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(scenario.id)}
                      className="p-1.5 text-slate-500 hover:text-red-400 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <p className="text-slate-500 text-sm text-center py-8">
            No scenarios found
          </p>
        )}
      </div>
    </div>
  );
}
