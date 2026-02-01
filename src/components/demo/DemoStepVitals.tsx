import { Heart, Wind, Thermometer, Activity, Gauge } from "lucide-react";
import type { Vitals } from "../../types";

interface DemoStepVitalsProps {
  vitals: Vitals;
  previousVitals?: Vitals;
}

function VitalItem({
  icon,
  label,
  value,
  unit,
  previous,
  dangerLow,
  dangerHigh,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  unit: string;
  previous?: number;
  dangerLow?: number;
  dangerHigh?: number;
}) {
  const isDanger =
    (dangerLow !== undefined && value <= dangerLow) ||
    (dangerHigh !== undefined && value >= dangerHigh);

  const trend =
    previous !== undefined
      ? value > previous
        ? "up"
        : value < previous
          ? "down"
          : "same"
      : "same";

  const trendArrow = trend === "up" ? "▲" : trend === "down" ? "▼" : "";
  const trendColor =
    trend === "same"
      ? "text-slate-500"
      : isDanger
        ? "text-red-400"
        : "text-emerald-400";

  return (
    <div
      className={`rounded-lg border p-2.5 ${
        isDanger
          ? "bg-red-900/20 border-red-800/40"
          : "bg-slate-800/50 border-slate-700/50"
      }`}
    >
      <div className="flex items-center gap-1.5 mb-1">
        {icon}
        <span className="text-xs text-slate-400">{label}</span>
      </div>
      <div className="flex items-baseline gap-1.5">
        <span
          className={`text-lg font-bold font-mono ${isDanger ? "text-red-400" : "text-white"}`}
        >
          {value}
        </span>
        <span className="text-xs text-slate-500">{unit}</span>
        {trendArrow && (
          <span className={`text-xs ${trendColor}`}>{trendArrow}</span>
        )}
      </div>
    </div>
  );
}

export function DemoStepVitals({
  vitals,
  previousVitals,
}: DemoStepVitalsProps) {
  return (
    <div className="grid grid-cols-3 gap-2">
      <VitalItem
        icon={<Heart className="w-3.5 h-3.5 text-red-400" />}
        label="HR"
        value={vitals.hr}
        unit="bpm"
        previous={previousVitals?.hr}
        dangerLow={50}
        dangerHigh={120}
      />
      <VitalItem
        icon={<Gauge className="w-3.5 h-3.5 text-blue-400" />}
        label="BP"
        value={vitals.bpSystolic}
        unit={`/${vitals.bpDiastolic}`}
        previous={previousVitals?.bpSystolic}
        dangerLow={90}
        dangerHigh={180}
      />
      <VitalItem
        icon={<Activity className="w-3.5 h-3.5 text-cyan-400" />}
        label="SpO2"
        value={vitals.spo2}
        unit="%"
        previous={previousVitals?.spo2}
        dangerLow={92}
      />
      <VitalItem
        icon={<Thermometer className="w-3.5 h-3.5 text-amber-400" />}
        label="Temp"
        value={vitals.temp}
        unit="°C"
        previous={previousVitals?.temp}
        dangerHigh={38.5}
      />
      <VitalItem
        icon={<Wind className="w-3.5 h-3.5 text-teal-400" />}
        label="RR"
        value={vitals.respRate}
        unit="/min"
        previous={previousVitals?.respRate}
        dangerLow={12}
        dangerHigh={25}
      />
    </div>
  );
}
