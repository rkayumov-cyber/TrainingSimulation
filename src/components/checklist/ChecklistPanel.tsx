import {
  CheckCircle2,
  Circle,
  Shield,
  ShieldAlert,
  Stethoscope,
  FlaskConical,
  Pill,
  MessageCircle,
  ShieldCheck,
  ArrowUpCircle,
} from "lucide-react";
import { useSimulation } from "../../context";
import type {
  CompetencyChecklist,
  CompetencyDomain,
  ChecklistResult,
} from "../../types/difficulty";
import { calculateChecklistResult } from "../../services/checklist";

interface ChecklistPanelProps {
  checklist: CompetencyChecklist | null;
  checklistResult: ChecklistResult | null;
}

const DOMAIN_CONFIG: Record<
  CompetencyDomain,
  { label: string; icon: React.ReactNode; color: string }
> = {
  assessment: {
    label: "Assessment",
    icon: <Stethoscope className="w-3.5 h-3.5" />,
    color: "text-blue-400",
  },
  investigation: {
    label: "Investigation",
    icon: <FlaskConical className="w-3.5 h-3.5" />,
    color: "text-purple-400",
  },
  treatment: {
    label: "Treatment",
    icon: <Pill className="w-3.5 h-3.5" />,
    color: "text-emerald-400",
  },
  communication: {
    label: "Communication",
    icon: <MessageCircle className="w-3.5 h-3.5" />,
    color: "text-amber-400",
  },
  safety: {
    label: "Safety",
    icon: <ShieldCheck className="w-3.5 h-3.5" />,
    color: "text-red-400",
  },
  escalation: {
    label: "Escalation",
    icon: <ArrowUpCircle className="w-3.5 h-3.5" />,
    color: "text-orange-400",
  },
};

export function ChecklistPanel({
  checklist,
  checklistResult,
}: ChecklistPanelProps) {
  const { state } = useSimulation();

  if (!checklist || checklist.items.length === 0) {
    return (
      <div className="p-4 text-center text-slate-500 text-sm">
        No checklist available for this scenario.
      </div>
    );
  }

  const result = checklistResult || calculateChecklistResult(checklist);
  const percentage =
    result.total > 0 ? Math.round((result.completed / result.total) * 100) : 0;

  // Group items by domain
  const domains = new Map<CompetencyDomain, typeof checklist.items>();
  for (const item of checklist.items) {
    const existing = domains.get(item.domain) || [];
    existing.push(item);
    domains.set(item.domain, existing);
  }

  return (
    <div className="p-3 space-y-3">
      {/* Summary bar */}
      <div className="bg-slate-800 rounded-lg p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white text-sm font-medium">
            Competency Progress
          </span>
          <span className="text-slate-400 text-xs">
            {result.completed}/{result.total} ({percentage}%)
          </span>
        </div>
        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              percentage >= checklist.passThreshold
                ? "bg-emerald-500"
                : percentage >= 50
                  ? "bg-amber-500"
                  : "bg-red-500"
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-2 text-xs">
          <span className="text-slate-500">
            Pass: {checklist.passThreshold}%
          </span>
          <span className="flex items-center gap-1">
            <ShieldAlert className="w-3 h-3 text-red-400" />
            <span className="text-slate-400">
              Critical: {result.criticalCompleted}/{result.criticalTotal}
            </span>
          </span>
        </div>
        {!state.isRunning && state.score.totalActions > 0 && (
          <div
            className={`mt-2 text-center text-sm font-medium rounded py-1 ${
              result.passed
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : "bg-red-500/10 text-red-400 border border-red-500/20"
            }`}
          >
            {result.passed ? "PASSED" : "NOT YET PASSED"}
          </div>
        )}
      </div>

      {/* Domain groups */}
      {Array.from(domains.entries()).map(([domain, items]) => {
        const config = DOMAIN_CONFIG[domain];
        const domainCompleted = items.filter((i) => i.completed).length;

        return (
          <div
            key={domain}
            className="bg-slate-800/50 rounded-lg overflow-hidden"
          >
            <div className="flex items-center justify-between px-3 py-2 border-b border-slate-700/50">
              <div
                className={`flex items-center gap-1.5 text-xs font-medium ${config.color}`}
              >
                {config.icon}
                {config.label}
              </div>
              <span className="text-slate-500 text-xs">
                {domainCompleted}/{items.length}
              </span>
            </div>
            <div className="p-2 space-y-0.5">
              {items
                .sort((a, b) => a.order - b.order)
                .map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center gap-2 px-2 py-1.5 rounded text-sm ${
                      item.completed ? "bg-emerald-500/5" : ""
                    }`}
                  >
                    {item.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-600 shrink-0" />
                    )}
                    <span
                      className={
                        item.completed ? "text-slate-300" : "text-slate-400"
                      }
                    >
                      {item.label}
                    </span>
                    {item.isCritical && (
                      <Shield className="w-3 h-3 text-red-400 shrink-0 ml-auto" />
                    )}
                  </div>
                ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
