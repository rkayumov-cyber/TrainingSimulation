import { useState } from "react";
import {
  ChevronDown,
  Heart,
  Syringe,
  Wind,
  Thermometer,
  Brain,
  Droplets,
  Ambulance,
  Baby,
  HeartPulse,
  HeartOff,
  Skull,
  Wrench,
  Pencil,
  Trash2,
} from "lucide-react";
import { getAllScenarios } from "../../scenarios";
import { deleteCustomScenario, getAllCustomScenarios } from "../../services/persistence";
import { registerCustomScenarios } from "../../scenarios";
import type { ScenarioDefinition } from "../../types";
import type { CustomScenarioDefinition } from "../../types/scenarioBuilder";

interface ScenarioSelectorProps {
  currentScenario: ScenarioDefinition;
  onSelect: (scenario: ScenarioDefinition) => void;
  disabled?: boolean;
  onEditCustom?: (scenarioId: string) => void;
  readOnly?: boolean;
}

function isCustomScenario(s: ScenarioDefinition): s is CustomScenarioDefinition {
  return "isCustom" in s && (s as CustomScenarioDefinition).isCustom === true;
}

function getScenarioIcon(id: string) {
  if (id.includes("mi")) return <Heart className="w-4 h-4" />;
  if (id.includes("anaphylaxis")) return <Syringe className="w-4 h-4" />;
  if (id.includes("asthma")) return <Wind className="w-4 h-4" />;
  if (id.includes("stroke")) return <Brain className="w-4 h-4" />;
  if (id.includes("dka")) return <Droplets className="w-4 h-4" />;
  if (id.includes("trauma")) return <Ambulance className="w-4 h-4" />;
  if (id.includes("peds-seizure")) return <Baby className="w-4 h-4" />;
  if (id.includes("eclampsia")) return <HeartPulse className="w-4 h-4" />;
  if (id.includes("cardiac-arrest")) return <HeartOff className="w-4 h-4" />;
  if (id.includes("overdose")) return <Skull className="w-4 h-4" />;
  if (id.startsWith("custom-")) return <Wrench className="w-4 h-4" />;
  return <Thermometer className="w-4 h-4" />;
}

function getScenarioColor(id: string) {
  if (id.includes("mi")) return "text-red-400";
  if (id.includes("anaphylaxis")) return "text-amber-400";
  if (id.includes("asthma")) return "text-blue-400";
  if (id.includes("stroke")) return "text-purple-400";
  if (id.includes("dka")) return "text-cyan-400";
  if (id.includes("trauma")) return "text-orange-400";
  if (id.includes("peds-seizure")) return "text-pink-400";
  if (id.includes("eclampsia")) return "text-rose-400";
  if (id.includes("cardiac-arrest")) return "text-red-500";
  if (id.includes("overdose")) return "text-violet-400";
  if (id.startsWith("custom-")) return "text-teal-400";
  return "text-emerald-400";
}

export function ScenarioSelector({
  currentScenario,
  onSelect,
  disabled,
  onEditCustom,
  readOnly,
}: ScenarioSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const allScenarios = getAllScenarios();

  const handleDelete = async (e: React.MouseEvent, scenarioId: string) => {
    e.stopPropagation();
    if (!confirm("Delete this custom scenario?")) return;

    await deleteCustomScenario(scenarioId);
    const customs = await getAllCustomScenarios();
    registerCustomScenarios(customs);

    // If we deleted the current scenario, select the first built-in
    if (currentScenario.id === scenarioId) {
      const first = getAllScenarios()[0];
      if (first) onSelect(first);
    }

    // Force re-render
    setIsOpen(false);
    setTimeout(() => setIsOpen(true), 0);
  };

  const handleEdit = (e: React.MouseEvent, scenarioId: string) => {
    e.stopPropagation();
    setIsOpen(false);
    onEditCustom?.(scenarioId);
  };

  return (
    <div className="relative">
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
          disabled
            ? "bg-slate-800 text-slate-500 cursor-not-allowed"
            : "bg-slate-800 hover:bg-slate-700 text-white cursor-pointer"
        }`}
      >
        <span className={getScenarioColor(currentScenario.id)}>
          {getScenarioIcon(currentScenario.id)}
        </span>
        <span className="text-sm font-medium max-w-[200px] truncate">
          {currentScenario.name}
        </span>
        {isCustomScenario(currentScenario) && (
          <span className="text-xs text-teal-400 bg-teal-400/10 px-1.5 py-0.5 rounded">
            Custom
          </span>
        )}
        <ChevronDown
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && !disabled && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute top-full left-0 mt-2 w-80 bg-slate-900 border border-slate-700 rounded-lg shadow-xl z-20 overflow-hidden max-h-96 overflow-y-auto">
            <div className="px-3 py-2 border-b border-slate-700">
              <span className="text-xs text-slate-500 uppercase tracking-wide">
                Select Scenario ({allScenarios.length} available)
              </span>
            </div>

            {allScenarios.map((scenario) => {
              const custom = isCustomScenario(scenario);

              return (
                <button
                  key={scenario.id}
                  onClick={() => {
                    onSelect(scenario);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-3 flex items-start gap-3 transition-colors hover:bg-slate-800 ${
                    scenario.id === currentScenario.id ? "bg-slate-800" : ""
                  }`}
                >
                  <span className={`mt-0.5 ${getScenarioColor(scenario.id)}`}>
                    {getScenarioIcon(scenario.id)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-white text-sm font-medium">
                        {scenario.name}
                      </p>
                      {custom && (
                        <span className="text-xs text-teal-400 bg-teal-400/10 px-1.5 py-0.5 rounded shrink-0">
                          Custom
                        </span>
                      )}
                    </div>
                    <p className="text-slate-400 text-xs mt-0.5 line-clamp-2">
                      {scenario.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {scenario.id === currentScenario.id && (
                      <span className="text-emerald-400 text-xs">Active</span>
                    )}
                    {custom && onEditCustom && !readOnly && (
                      <>
                        <button
                          onClick={(e) => handleEdit(e, scenario.id)}
                          className="p-1 text-slate-500 hover:text-blue-400 transition-colors"
                          title="Edit scenario"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => handleDelete(e, scenario.id)}
                          className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                          title="Delete scenario"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
