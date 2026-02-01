import type { ReactNode } from "react";

interface VitalCardProps {
  label: string;
  value: string | number;
  unit: string;
  icon: ReactNode;
  color: "green" | "red" | "yellow" | "blue" | "purple";
  isAbnormal?: boolean;
  trend?: "up" | "down" | "stable";
}

const colorClasses = {
  green: {
    bg: "bg-emerald-950/50",
    border: "border-emerald-800",
    text: "text-emerald-400",
    glow: "shadow-emerald-500/20",
  },
  red: {
    bg: "bg-red-950/50",
    border: "border-red-800",
    text: "text-red-400",
    glow: "shadow-red-500/20",
  },
  yellow: {
    bg: "bg-amber-950/50",
    border: "border-amber-800",
    text: "text-amber-400",
    glow: "shadow-amber-500/20",
  },
  blue: {
    bg: "bg-blue-950/50",
    border: "border-blue-800",
    text: "text-blue-400",
    glow: "shadow-blue-500/20",
  },
  purple: {
    bg: "bg-purple-950/50",
    border: "border-purple-800",
    text: "text-purple-400",
    glow: "shadow-purple-500/20",
  },
};

export function VitalCard({
  label,
  value,
  unit,
  icon,
  color,
  isAbnormal,
}: VitalCardProps) {
  const colors = colorClasses[color];

  return (
    <div
      className={`${colors.bg} ${colors.border} border rounded-lg p-3 ${
        isAbnormal ? `shadow-lg ${colors.glow} animate-pulse` : ""
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-slate-400 text-xs font-medium uppercase tracking-wide">
          {label}
        </span>
        <span className={`${colors.text}`}>{icon}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className={`text-3xl font-bold font-mono ${colors.text}`}>
          {value}
        </span>
        <span className="text-slate-500 text-sm">{unit}</span>
      </div>
    </div>
  );
}
