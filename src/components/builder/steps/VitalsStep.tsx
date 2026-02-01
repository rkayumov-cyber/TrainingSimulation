import type { Vitals } from "../../../types";

interface VitalsStepProps {
  vitals: Vitals;
  onUpdateVital: (key: keyof Vitals, value: number) => void;
}

interface VitalConfig {
  key: keyof Vitals;
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  normalMin: number;
  normalMax: number;
  warningMin: number;
  warningMax: number;
}

const VITAL_CONFIGS: VitalConfig[] = [
  {
    key: "hr",
    label: "Heart Rate",
    unit: "bpm",
    min: 30,
    max: 250,
    step: 1,
    normalMin: 60,
    normalMax: 100,
    warningMin: 50,
    warningMax: 120,
  },
  {
    key: "bpSystolic",
    label: "BP Systolic",
    unit: "mmHg",
    min: 50,
    max: 250,
    step: 1,
    normalMin: 90,
    normalMax: 140,
    warningMin: 80,
    warningMax: 160,
  },
  {
    key: "bpDiastolic",
    label: "BP Diastolic",
    unit: "mmHg",
    min: 20,
    max: 150,
    step: 1,
    normalMin: 60,
    normalMax: 90,
    warningMin: 50,
    warningMax: 100,
  },
  {
    key: "spo2",
    label: "SpO2",
    unit: "%",
    min: 50,
    max: 100,
    step: 1,
    normalMin: 95,
    normalMax: 100,
    warningMin: 90,
    warningMax: 100,
  },
  {
    key: "temp",
    label: "Temperature",
    unit: "\u00b0C",
    min: 34,
    max: 42,
    step: 0.1,
    normalMin: 36.5,
    normalMax: 37.5,
    warningMin: 36,
    warningMax: 38.5,
  },
  {
    key: "respRate",
    label: "Respiratory Rate",
    unit: "/min",
    min: 4,
    max: 60,
    step: 1,
    normalMin: 12,
    normalMax: 20,
    warningMin: 10,
    warningMax: 25,
  },
];

function getVitalStatus(
  value: number,
  config: VitalConfig,
): "normal" | "warning" | "critical" {
  if (value >= config.normalMin && value <= config.normalMax) return "normal";
  if (value >= config.warningMin && value <= config.warningMax) return "warning";
  return "critical";
}

const STATUS_COLORS = {
  normal: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
  warning: "text-amber-400 bg-amber-500/10 border-amber-500/30",
  critical: "text-red-400 bg-red-500/10 border-red-500/30",
};

const SLIDER_TRACK_COLORS = {
  normal: "accent-emerald-500",
  warning: "accent-amber-500",
  critical: "accent-red-500",
};

export function VitalsStep({ vitals, onUpdateVital }: VitalsStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-white mb-1">
          Baseline Vital Signs
        </h2>
        <p className="text-sm text-slate-400">
          Set the starting vital signs for the patient. Colors indicate normal
          (green), warning (amber), or critical (red) ranges.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {VITAL_CONFIGS.map((config) => {
          const value = vitals[config.key];
          const status = getVitalStatus(value, config);

          return (
            <div
              key={config.key}
              className={`rounded-lg p-4 border ${STATUS_COLORS[status]}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="text-white font-medium text-sm">
                    {config.label}
                  </span>
                  <span className="text-slate-500 text-xs ml-2">
                    ({config.unit})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={config.key === "temp" ? value.toFixed(1) : value}
                    onChange={(e) =>
                      onUpdateVital(
                        config.key,
                        Math.min(
                          config.max,
                          Math.max(config.min, parseFloat(e.target.value) || config.min),
                        ),
                      )
                    }
                    min={config.min}
                    max={config.max}
                    step={config.step}
                    className="w-20 bg-slate-900/50 border border-slate-600 rounded px-2 py-1 text-white text-right text-sm font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
                  />
                  <span className="text-xs uppercase font-medium w-16">
                    {status}
                  </span>
                </div>
              </div>
              <input
                type="range"
                min={config.min}
                max={config.max}
                step={config.step}
                value={value}
                onChange={(e) =>
                  onUpdateVital(config.key, parseFloat(e.target.value))
                }
                className={`w-full h-2 rounded-lg appearance-none cursor-pointer bg-slate-700 ${SLIDER_TRACK_COLORS[status]}`}
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>{config.min}</span>
                <span className="text-slate-400">
                  Normal: {config.normalMin}-{config.normalMax}
                </span>
                <span>{config.max}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
