import {
  ArrowLeft,
  Heart,
  Wind,
  Brain,
  HeartPulse,
  Baby,
  Ambulance,
  Droplets,
  Skull,
  ShieldAlert,
  Stethoscope,
  Bug,
  Waves,
  Activity,
  CloudDrizzle,
  BabyIcon,
  Flame,
  BrainCircuit,
  Scissors,
  UserRound,
  AirVent,
} from "lucide-react";
import {
  SCENARIO_TEMPLATES,
  TEMPLATE_CATEGORIES,
} from "../../data/scenarioTemplates";
import type { TemplateCategory } from "../../data/scenarioTemplates";

interface TemplatePickerPanelProps {
  onBack: () => void;
  onSelectTemplate: (templateId: string) => void;
}

function getCategoryIcon(category: TemplateCategory) {
  switch (category) {
    case "cardiac":
      return <Heart className="w-6 h-6" />;
    case "respiratory":
      return <Wind className="w-6 h-6" />;
    case "neurological":
      return <Brain className="w-6 h-6" />;
    case "obstetric":
      return <HeartPulse className="w-6 h-6" />;
    case "pediatric":
      return <Baby className="w-6 h-6" />;
    case "trauma":
      return <Ambulance className="w-6 h-6" />;
    case "metabolic":
      return <Droplets className="w-6 h-6" />;
    case "toxicological":
      return <Skull className="w-6 h-6" />;
    case "allergy":
      return <ShieldAlert className="w-6 h-6" />;
    case "gastrointestinal":
      return <Stethoscope className="w-6 h-6" />;
    case "infectious":
      return <Bug className="w-6 h-6" />;
    case "renal":
      return <Waves className="w-6 h-6" />;
    case "pulmonary":
      return <AirVent className="w-6 h-6" />;
    case "chest_pain":
      return <Activity className="w-6 h-6" />;
    case "respiratory_failure":
      return <CloudDrizzle className="w-6 h-6" />;
    case "neonatal":
      return <BabyIcon className="w-6 h-6" />;
    case "burns":
      return <Flame className="w-6 h-6" />;
    case "psychiatric":
      return <BrainCircuit className="w-6 h-6" />;
    case "surgical":
      return <Scissors className="w-6 h-6" />;
    case "geriatric":
      return <UserRound className="w-6 h-6" />;
    default:
      return <Heart className="w-6 h-6" />;
  }
}

export function TemplatePickerPanel({
  onBack,
  onSelectTemplate,
}: TemplatePickerPanelProps) {
  return (
    <div className="h-screen bg-slate-950 text-white flex flex-col">
      <div className="border-b border-slate-800 px-6 py-4 flex items-center gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <div className="w-px h-6 bg-slate-700" />
        <h1 className="text-xl font-bold">Scenario Templates</h1>
        <span className="text-slate-500 text-sm">
          Choose a template to pre-fill your scenario builder
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-6xl mx-auto">
          {SCENARIO_TEMPLATES.map((template) => {
            const catMeta = TEMPLATE_CATEGORIES.find(
              (c) => c.key === template.category,
            );
            return (
              <button
                key={template.id}
                onClick={() => onSelectTemplate(template.id)}
                className="text-left bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-600 hover:bg-slate-900/80 transition-colors group"
              >
                <div
                  className={`w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center mb-3 ${catMeta?.color || "text-slate-400"}`}
                >
                  {getCategoryIcon(template.category)}
                </div>
                <h3 className="text-white font-semibold text-sm mb-1 group-hover:text-emerald-400 transition-colors">
                  {template.name}
                </h3>
                <p className="text-slate-500 text-xs line-clamp-2 mb-3">
                  {template.description}
                </p>

                {/* Vitals preview */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  <span className="text-xs bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">
                    HR {template.baselineVitals.hr}
                  </span>
                  <span className="text-xs bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">
                    BP {template.baselineVitals.bpSystolic}/
                    {template.baselineVitals.bpDiastolic}
                  </span>
                  <span className="text-xs bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">
                    SpO2 {template.baselineVitals.spo2}%
                  </span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {template.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs text-slate-500 bg-slate-800/50 px-1.5 py-0.5 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
