import type { Vitals } from "../../../types";

interface PreviewVitalsProps {
  vitals: Vitals;
}

interface VitalDisplay {
  key: keyof Vitals;
  label: string;
  unit: string;
  normalMin: number;
  normalMax: number;
}

const VITALS_DISPLAY: VitalDisplay[] = [
  { key: "hr", label: "HR", unit: "bpm", normalMin: 60, normalMax: 100 },
  { key: "bpSystolic", label: "SBP", unit: "mmHg", normalMin: 90, normalMax: 140 },
  { key: "bpDiastolic", label: "DBP", unit: "mmHg", normalMin: 60, normalMax: 90 },
  { key: "spo2", label: "SpO2", unit: "%", normalMin: 95, normalMax: 100 },
  { key: "temp", label: "Temp", unit: "\u00b0C", normalMin: 36.5, normalMax: 37.5 },
  { key: "respRate", label: "RR", unit: "/min", normalMin: 12, normalMax: 20 },
];

export function PreviewVitals({ vitals }: PreviewVitalsProps) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {VITALS_DISPLAY.map((v) => {
        const value = vitals[v.key];
        const isNormal = value >= v.normalMin && value <= v.normalMax;
        const color = isNormal ? "text-emerald-400" : "text-amber-400";

        return (
          <div
            key={v.key}
            className="bg-slate-800/50 rounded px-2 py-1.5 text-center"
          >
            <div className="text-slate-500 text-xs">{v.label}</div>
            <div className={`font-mono font-bold text-sm ${color}`}>
              {v.key === "temp" ? value.toFixed(1) : Math.round(value)}
            </div>
            <div className="text-slate-600 text-xs">{v.unit}</div>
          </div>
        );
      })}
    </div>
  );
}
