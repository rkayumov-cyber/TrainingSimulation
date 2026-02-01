import { FlaskConical } from "lucide-react";
import type { ABGInterpretation } from "../../types/imaging";

interface ABGInterpreterProps {
  interpretation: ABGInterpretation;
}

function isNormal(label: string, value: number): boolean {
  const ranges: Record<string, [number, number]> = {
    pH: [7.35, 7.45],
    pCO2: [35, 45],
    pO2: [80, 100],
    hco3: [22, 26],
    baseExcess: [-2, 2],
    lactate: [0, 2],
  };
  const range = ranges[label];
  if (!range) return true;
  return value >= range[0] && value <= range[1];
}

export function ABGInterpreter({ interpretation }: ABGInterpreterProps) {
  const { values, steps } = interpretation;

  const valueEntries: {
    label: string;
    key: keyof typeof values;
    unit: string;
    normalRange: string;
  }[] = [
    { label: "pH", key: "pH", unit: "", normalRange: "7.35 - 7.45" },
    { label: "pCO2", key: "pCO2", unit: "mmHg", normalRange: "35 - 45" },
    { label: "pO2", key: "pO2", unit: "mmHg", normalRange: "80 - 100" },
    { label: "HCO3", key: "hco3", unit: "mEq/L", normalRange: "22 - 26" },
    {
      label: "Base Excess",
      key: "baseExcess",
      unit: "",
      normalRange: "-2 to +2",
    },
    {
      label: "Lactate",
      key: "lactate",
      unit: "mmol/L",
      normalRange: "0 - 2.0",
    },
  ];

  return (
    <div className="bg-slate-800 rounded-lg p-4 space-y-3">
      <div className="flex items-center gap-2">
        <FlaskConical className="w-4 h-4 text-cyan-400" />
        <h4 className="text-white font-medium text-sm">ABG Analysis</h4>
      </div>

      {/* Values Table */}
      <div className="bg-slate-900 rounded-lg overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-slate-700">
              <th className="text-left text-slate-500 px-3 py-1.5">
                Parameter
              </th>
              <th className="text-right text-slate-500 px-3 py-1.5">Value</th>
              <th className="text-right text-slate-500 px-3 py-1.5">Normal</th>
            </tr>
          </thead>
          <tbody>
            {valueEntries.map((entry) => {
              const val = values[entry.key];
              const normal = isNormal(entry.key, val as number);
              return (
                <tr key={entry.key} className="border-b border-slate-800">
                  <td className="px-3 py-1.5 text-slate-300">{entry.label}</td>
                  <td
                    className={`px-3 py-1.5 text-right font-mono font-medium ${normal ? "text-emerald-400" : "text-red-400"}`}
                  >
                    {entry.key === "pH" ? (val as number).toFixed(2) : val}
                    {entry.unit ? ` ${entry.unit}` : ""}
                  </td>
                  <td className="px-3 py-1.5 text-right text-slate-500">
                    {entry.normalRange}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Step-by-Step Interpretation */}
      <div className="space-y-2">
        <h5 className="text-slate-400 text-xs uppercase tracking-wide">
          Step-by-Step Interpretation
        </h5>
        {steps.map((step) => (
          <div
            key={step.step}
            className={`rounded p-2 text-xs border ${
              step.isAbnormal
                ? "bg-red-900/20 border-red-800/50"
                : "bg-slate-900 border-slate-700"
            }`}
          >
            <div className="flex items-center gap-2">
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  step.isAbnormal
                    ? "bg-red-800 text-red-200"
                    : "bg-slate-700 text-slate-300"
                }`}
              >
                {step.step}
              </span>
              <span className="text-slate-400">{step.label}:</span>
              <span
                className={
                  step.isAbnormal ? "text-red-300" : "text-emerald-300"
                }
              >
                {step.finding}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
