import { Gauge } from "lucide-react";
import type { DifficultyLevel } from "../../types/difficulty";

interface DifficultySelectorProps {
  current: DifficultyLevel;
  onChange: (level: DifficultyLevel) => void;
  disabled: boolean;
}

const LEVELS: { id: DifficultyLevel; label: string; color: string }[] = [
  { id: "beginner", label: "Beginner", color: "text-emerald-400" },
  { id: "intermediate", label: "Standard", color: "text-blue-400" },
  { id: "expert", label: "Expert", color: "text-red-400" },
  { id: "adaptive", label: "Adaptive", color: "text-purple-400" },
];

export function DifficultySelector({
  current,
  onChange,
  disabled,
}: DifficultySelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <Gauge className="w-4 h-4 text-slate-400" />
      <select
        value={current}
        onChange={(e) => onChange(e.target.value as DifficultyLevel)}
        disabled={disabled}
        className="bg-slate-800 text-white text-sm rounded-lg px-2 py-1 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {LEVELS.map((level) => (
          <option key={level.id} value={level.id}>
            {level.label}
          </option>
        ))}
      </select>
    </div>
  );
}
