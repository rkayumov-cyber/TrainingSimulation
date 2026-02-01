import { useState, useMemo } from "react";
import {
  BookOpen,
  Pill,
  GitBranch,
  ClipboardList,
  Search,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
  Info,
  Heart,
  Brain,
} from "lucide-react";
import { useSimulation } from "../../context";
import {
  DRUG_DOSING_REFERENCE,
  CLINICAL_PROCEDURES,
  RESUSCITATION_ALGORITHMS,
  ASSESSMENT_MNEMONICS,
  getDifferentialsForScenario,
} from "../../services/knowledge/clinicalProtocols";
import type {
  DrugDosing,
  ClinicalProcedure,
  ResuscitationAlgorithm,
  AssessmentMnemonic,
  DifferentialDiagnosis,
} from "../../services/knowledge/clinicalProtocols";

type SubTab =
  | "drugs"
  | "procedures"
  | "algorithms"
  | "mnemonics"
  | "differentials";

export function ClinicalReferencePanel() {
  const [subTab, setSubTab] = useState<SubTab>("drugs");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const { state } = useSimulation();

  const scenarioId = state.currentScenario?.id || "";

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const subTabs: { id: SubTab; label: string; icon: React.ReactNode }[] = [
    { id: "drugs", label: "Drugs", icon: <Pill className="w-3.5 h-3.5" /> },
    {
      id: "procedures",
      label: "Procedures",
      icon: <ClipboardList className="w-3.5 h-3.5" />,
    },
    {
      id: "algorithms",
      label: "Algorithms",
      icon: <GitBranch className="w-3.5 h-3.5" />,
    },
    {
      id: "mnemonics",
      label: "Mnemonics",
      icon: <Brain className="w-3.5 h-3.5" />,
    },
    {
      id: "differentials",
      label: "DDx",
      icon: <Heart className="w-3.5 h-3.5" />,
    },
  ];

  // Filter drugs by search
  const filteredDrugs = useMemo(() => {
    if (!searchQuery.trim()) return DRUG_DOSING_REFERENCE;
    const q = searchQuery.toLowerCase();
    return DRUG_DOSING_REFERENCE.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.genericName.toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q) ||
        d.indications.some((i) => i.toLowerCase().includes(q)),
    );
  }, [searchQuery]);

  // Scenario-relevant differentials
  const scenarioDifferentials = useMemo(
    () => getDifferentialsForScenario(scenarioId),
    [scenarioId],
  );

  return (
    <div className="flex flex-col h-full">
      {/* Sub-tab navigation */}
      <div className="flex border-b border-slate-700 bg-slate-900/50 overflow-x-auto">
        {subTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSubTab(tab.id)}
            className={`flex items-center gap-1 px-2.5 py-2 text-xs font-medium transition-colors whitespace-nowrap ${
              subTab === tab.id
                ? "text-cyan-400 border-b-2 border-cyan-400"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search (for drugs/procedures) */}
      {(subTab === "drugs" || subTab === "procedures") && (
        <div className="p-2 border-b border-slate-700">
          <div className="relative">
            <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${subTab}...`}
              className="w-full bg-slate-900 border border-slate-600 rounded pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {subTab === "drugs" && (
          <DrugReference
            drugs={filteredDrugs}
            expandedItems={expandedItems}
            toggleExpand={toggleExpand}
          />
        )}
        {subTab === "procedures" && (
          <ProcedureReference
            procedures={CLINICAL_PROCEDURES}
            expandedItems={expandedItems}
            toggleExpand={toggleExpand}
            searchQuery={searchQuery}
          />
        )}
        {subTab === "algorithms" && (
          <AlgorithmReference
            algorithms={RESUSCITATION_ALGORITHMS}
            expandedItems={expandedItems}
            toggleExpand={toggleExpand}
          />
        )}
        {subTab === "mnemonics" && (
          <MnemonicReference mnemonics={ASSESSMENT_MNEMONICS} />
        )}
        {subTab === "differentials" && (
          <DifferentialReference differentials={scenarioDifferentials} />
        )}
      </div>
    </div>
  );
}

// ============================================
// SUB-COMPONENTS
// ============================================

function DrugReference({
  drugs,
  expandedItems,
  toggleExpand,
}: {
  drugs: DrugDosing[];
  expandedItems: Set<string>;
  toggleExpand: (id: string) => void;
}) {
  if (drugs.length === 0) {
    return (
      <div className="text-slate-500 text-xs text-center py-4">
        No drugs match your search
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {drugs.map((drug) => {
        const isExpanded = expandedItems.has(drug.genericName);
        return (
          <div
            key={drug.genericName}
            className="bg-slate-800 rounded-lg border border-slate-700"
          >
            <button
              onClick={() => toggleExpand(drug.genericName)}
              className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-slate-700/50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-white text-sm font-medium truncate">
                    {drug.name}
                  </span>
                  <span className="text-slate-500 text-xs shrink-0">
                    {drug.category}
                  </span>
                </div>
              </div>
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
              ) : (
                <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
              )}
            </button>

            {isExpanded && (
              <div className="px-3 pb-3 space-y-2 border-t border-slate-700">
                {/* Dosing */}
                <div className="mt-2">
                  <div className="text-cyan-400 text-xs font-medium mb-1">
                    Adult Dose
                  </div>
                  <p className="text-slate-300 text-xs">{drug.adultDose}</p>
                </div>
                {drug.pediatricDose && (
                  <div>
                    <div className="text-cyan-400 text-xs font-medium mb-1">
                      Pediatric Dose
                    </div>
                    <p className="text-slate-300 text-xs">
                      {drug.pediatricDose}
                    </p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-slate-500 text-xs">Route: </span>
                    <span className="text-slate-300 text-xs">{drug.route}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-xs">Onset: </span>
                    <span className="text-slate-300 text-xs">
                      {drug.onsetTime}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-xs">Duration: </span>
                    <span className="text-slate-300 text-xs">
                      {drug.duration}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-xs">Max: </span>
                    <span className="text-slate-300 text-xs">
                      {drug.maxDose}
                    </span>
                  </div>
                </div>

                {/* Contraindications */}
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    <AlertTriangle className="w-3 h-3 text-red-400" />
                    <span className="text-red-400 text-xs font-medium">
                      Contraindications
                    </span>
                  </div>
                  <ul className="space-y-0.5">
                    {drug.contraindications.map((c, i) => (
                      <li key={i} className="text-slate-400 text-xs pl-2">
                        • {c}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Nursing considerations */}
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    <Info className="w-3 h-3 text-amber-400" />
                    <span className="text-amber-400 text-xs font-medium">
                      Key Considerations
                    </span>
                  </div>
                  <ul className="space-y-0.5">
                    {drug.nursingConsiderations.map((n, i) => (
                      <li key={i} className="text-slate-400 text-xs pl-2">
                        • {n}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function ProcedureReference({
  procedures,
  expandedItems,
  toggleExpand,
  searchQuery,
}: {
  procedures: ClinicalProcedure[];
  expandedItems: Set<string>;
  toggleExpand: (id: string) => void;
  searchQuery: string;
}) {
  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return procedures;
    const q = searchQuery.toLowerCase();
    return procedures.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q),
    );
  }, [procedures, searchQuery]);

  return (
    <div className="space-y-1">
      {filtered.map((proc) => {
        const isExpanded = expandedItems.has(proc.id);
        return (
          <div
            key={proc.id}
            className="bg-slate-800 rounded-lg border border-slate-700"
          >
            <button
              onClick={() => toggleExpand(proc.id)}
              className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-slate-700/50 transition-colors"
            >
              <div>
                <div className="text-white text-sm font-medium">
                  {proc.name}
                </div>
                <div className="text-slate-500 text-xs">{proc.category}</div>
              </div>
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
              ) : (
                <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
              )}
            </button>

            {isExpanded && (
              <div className="px-3 pb-3 space-y-3 border-t border-slate-700">
                {/* Indications */}
                <div className="mt-2">
                  <div className="text-cyan-400 text-xs font-medium mb-1">
                    Indications
                  </div>
                  <ul className="space-y-0.5">
                    {proc.indications.map((ind, i) => (
                      <li key={i} className="text-slate-300 text-xs pl-2">
                        • {ind}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Equipment */}
                <div>
                  <div className="text-amber-400 text-xs font-medium mb-1">
                    Equipment
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {proc.equipment.map((eq, i) => (
                      <span
                        key={i}
                        className="bg-slate-700 text-slate-300 text-xs px-1.5 py-0.5 rounded"
                      >
                        {eq}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Steps */}
                <div>
                  <div className="text-emerald-400 text-xs font-medium mb-1">
                    Steps
                  </div>
                  <ol className="space-y-1.5">
                    {proc.steps.map((step) => (
                      <li key={step.step} className="flex gap-2">
                        <span
                          className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                            step.criticalStep
                              ? "bg-red-600 text-white"
                              : "bg-slate-600 text-slate-300"
                          }`}
                        >
                          {step.step}
                        </span>
                        <div>
                          <span className="text-white text-xs font-medium">
                            {step.action}
                          </span>
                          {step.criticalStep && (
                            <span className="text-red-400 text-xs ml-1">
                              (Critical)
                            </span>
                          )}
                          <p className="text-slate-400 text-xs mt-0.5">
                            {step.detail}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Complications */}
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    <AlertTriangle className="w-3 h-3 text-red-400" />
                    <span className="text-red-400 text-xs font-medium">
                      Complications
                    </span>
                  </div>
                  <ul className="space-y-0.5">
                    {proc.complications.map((c, i) => (
                      <li key={i} className="text-slate-400 text-xs pl-2">
                        • {c}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function AlgorithmReference({
  algorithms,
  expandedItems,
  toggleExpand,
}: {
  algorithms: ResuscitationAlgorithm[];
  expandedItems: Set<string>;
  toggleExpand: (id: string) => void;
}) {
  return (
    <div className="space-y-2">
      {algorithms.map((algo) => {
        const isExpanded = expandedItems.has(algo.id);
        return (
          <div
            key={algo.id}
            className="bg-slate-800 rounded-lg border border-slate-700"
          >
            <button
              onClick={() => toggleExpand(algo.id)}
              className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-slate-700/50 transition-colors"
            >
              <div>
                <div className="text-white text-sm font-medium">
                  {algo.name}
                </div>
                <div className="text-slate-500 text-xs">{algo.source}</div>
              </div>
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
              ) : (
                <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
              )}
            </button>

            {isExpanded && (
              <div className="px-3 pb-3 border-t border-slate-700 mt-0">
                <p className="text-slate-400 text-xs mt-2 mb-3">
                  {algo.description}
                </p>
                <div className="space-y-2">
                  {algo.steps.map((step) => (
                    <div
                      key={step.id}
                      className="bg-slate-900 rounded-lg p-2.5 border border-slate-600"
                    >
                      <div className="text-cyan-400 text-xs font-bold mb-1">
                        {step.label}
                      </div>
                      <p className="text-slate-300 text-xs">{step.detail}</p>
                      {step.nextSteps.length > 0 && (
                        <div className="mt-1.5 flex flex-wrap gap-1">
                          {step.nextSteps.map((ns, i) => (
                            <span
                              key={i}
                              className="bg-slate-700 text-emerald-400 text-xs px-2 py-0.5 rounded"
                            >
                              {ns.condition} →
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function MnemonicReference({
  mnemonics,
}: {
  mnemonics: AssessmentMnemonic[];
}) {
  return (
    <div className="space-y-3">
      {mnemonics.map((m) => (
        <div
          key={m.id}
          className="bg-slate-800 rounded-lg border border-slate-700 p-3"
        >
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="w-4 h-4 text-purple-400" />
            <span className="text-white text-sm font-bold">{m.name}</span>
            <span className="text-slate-500 text-xs">— {m.fullName}</span>
          </div>
          <p className="text-slate-400 text-xs mb-2">{m.purpose}</p>
          <div className="space-y-1.5">
            {m.components.map((c) => (
              <div
                key={c.letter}
                className="flex gap-2 bg-slate-900 rounded p-2"
              >
                <span className="shrink-0 w-6 h-6 rounded bg-purple-700 text-white text-xs font-bold flex items-center justify-center">
                  {c.letter}
                </span>
                <div>
                  <span className="text-purple-300 text-xs font-medium">
                    {c.meaning}
                  </span>
                  <p className="text-slate-400 text-xs mt-0.5">{c.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function DifferentialReference({
  differentials,
}: {
  differentials: DifferentialDiagnosis[];
}) {
  if (differentials.length === 0) {
    return (
      <div className="text-slate-500 text-xs text-center py-8">
        <Heart className="w-8 h-8 mx-auto mb-2 opacity-50" />
        Start a scenario to see relevant differential diagnoses
      </div>
    );
  }

  const likelihoodColor = {
    high: "text-red-400 bg-red-900/30",
    moderate: "text-amber-400 bg-amber-900/30",
    low: "text-slate-400 bg-slate-700",
  };

  return (
    <div className="space-y-3">
      {differentials.map((dd) => (
        <div
          key={dd.presentation}
          className="bg-slate-800 rounded-lg border border-slate-700 p-3"
        >
          <div className="text-white text-sm font-bold mb-2">
            {dd.presentation}
          </div>
          <div className="space-y-2">
            {dd.differentials.map((d) => (
              <div
                key={d.condition}
                className="bg-slate-900 rounded p-2 border border-slate-700"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-cyan-400 text-xs font-medium">
                    {d.condition}
                  </span>
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded ${likelihoodColor[d.likelihood]}`}
                  >
                    {d.likelihood}
                  </span>
                </div>
                <div className="text-xs">
                  <span className="text-emerald-400">Key features: </span>
                  <span className="text-slate-400">
                    {d.keyFeatures.join(", ")}
                  </span>
                </div>
                <div className="text-xs mt-0.5">
                  <span className="text-red-400">Ruled out by: </span>
                  <span className="text-slate-400">
                    {d.ruledOutBy.join(", ")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
