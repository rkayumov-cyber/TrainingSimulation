import type { ReactNode } from "react";

interface SplitScreenProps {
  left: ReactNode;
  right: ReactNode;
}

export function SplitScreen({ left, right }: SplitScreenProps) {
  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Left Panel - Patient Bedside */}
      <div className="w-1/2 border-r border-slate-700 flex flex-col bg-slate-900">
        {left}
      </div>

      {/* Right Panel - Clinical Monitor */}
      <div className="w-1/2 flex flex-col bg-slate-950">{right}</div>
    </div>
  );
}
