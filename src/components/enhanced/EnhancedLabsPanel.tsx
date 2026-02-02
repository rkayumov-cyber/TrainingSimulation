import {
  FlaskConical,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
} from "lucide-react";
import { useSimulation } from "../../context";
import { useLabs } from "../../context";

export function EnhancedLabsPanel() {
  const { state } = useSimulation();
  const { dynamicLabs } = useLabs();

  if (!state.isRunning) {
    return (
      <div className="p-4 text-center text-slate-400">
        <FlaskConical className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p>Start a simulation to see dynamic labs</p>
      </div>
    );
  }

  if (dynamicLabs.length === 0) {
    return (
      <div className="p-4 text-center text-slate-400">
        <FlaskConical className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p>No dynamic labs available for this scenario</p>
      </div>
    );
  }

  const getTrendIcon = (trend: "improving" | "stable" | "worsening") => {
    switch (trend) {
      case "improving":
        return <TrendingDown className="w-4 h-4 text-emerald-400" />;
      case "worsening":
        return <TrendingUp className="w-4 h-4 text-red-400" />;
      default:
        return <Minus className="w-4 h-4 text-slate-400" />;
    }
  };

  const getValueStatus = (lab: (typeof dynamicLabs)[0]) => {
    const { currentValue, normalRange, criticalRange } = lab;

    if (
      criticalRange &&
      (currentValue < criticalRange.min || currentValue > criticalRange.max)
    ) {
      return "critical";
    }
    if (currentValue < normalRange.min || currentValue > normalRange.max) {
      return "abnormal";
    }
    return "normal";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical":
        return "text-red-400 bg-red-900/30";
      case "abnormal":
        return "text-yellow-400 bg-yellow-900/30";
      default:
        return "text-emerald-400 bg-emerald-900/30";
    }
  };

  const formatValue = (value: number) => {
    if (value < 1) return value.toFixed(3);
    if (value < 10) return value.toFixed(2);
    return value.toFixed(1);
  };

  return (
    <div className="p-4 space-y-3">
      <h3 className="text-sm font-medium text-slate-300 flex items-center gap-2">
        <FlaskConical className="w-4 h-4" />
        Dynamic Lab Values
      </h3>

      <div className="text-xs text-slate-500 mb-3">
        Labs update in real-time based on treatments and patient condition
      </div>

      <div className="space-y-2">
        {dynamicLabs.map((lab) => {
          const status = getValueStatus(lab);
          const statusColors = getStatusColor(status);
          const percentOfNormal =
            ((lab.currentValue - lab.normalRange.min) /
              (lab.normalRange.max - lab.normalRange.min)) *
            100;

          return (
            <div key={lab.name} className="bg-slate-800 rounded-lg p-3">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-white">{lab.name}</span>
                  {status === "critical" && (
                    <AlertTriangle className="w-4 h-4 text-red-400 animate-pulse" />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {getTrendIcon(
                    lab.currentValue < lab.baselineValue
                      ? "improving"
                      : lab.currentValue > lab.baselineValue
                        ? "worsening"
                        : "stable",
                  )}
                </div>
              </div>

              <div className="flex items-baseline gap-2">
                <span
                  className={`text-2xl font-bold ${
                    status === "critical"
                      ? "text-red-400"
                      : status === "abnormal"
                        ? "text-yellow-400"
                        : "text-white"
                  }`}
                >
                  {formatValue(lab.currentValue)}
                </span>
                <span className="text-slate-400 text-sm">{lab.unit}</span>
                <span className={`text-xs px-2 py-0.5 rounded ${statusColors}`}>
                  {status === "critical"
                    ? "CRITICAL"
                    : status === "abnormal"
                      ? lab.currentValue > lab.normalRange.max
                        ? "HIGH"
                        : "LOW"
                      : "NORMAL"}
                </span>
              </div>

              {/* Range indicator */}
              <div className="mt-2 space-y-1">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>
                    Reference: {lab.normalRange.min} - {lab.normalRange.max}{" "}
                    {lab.unit}
                  </span>
                </div>
                <div className="h-1.5 bg-slate-700 rounded-full relative">
                  {/* Normal range indicator */}
                  <div className="absolute inset-0 bg-emerald-900/50 rounded-full" />
                  {/* Current value marker */}
                  <div
                    className={`absolute w-2 h-2 rounded-full -top-0.5 transform -translate-x-1/2 ${
                      status === "critical"
                        ? "bg-red-500"
                        : status === "abnormal"
                          ? "bg-yellow-500"
                          : "bg-emerald-500"
                    }`}
                    style={{
                      left: `${Math.min(100, Math.max(0, percentOfNormal))}%`,
                    }}
                  />
                </div>
              </div>

              {/* Change from baseline */}
              <div className="mt-2 text-xs text-slate-500">
                Baseline: {formatValue(lab.baselineValue)} {lab.unit}
                <span
                  className={`ml-2 ${
                    lab.currentValue < lab.baselineValue
                      ? "text-emerald-400"
                      : lab.currentValue > lab.baselineValue
                        ? "text-red-400"
                        : "text-slate-400"
                  }`}
                >
                  ({lab.currentValue >= lab.baselineValue ? "+" : ""}
                  {formatValue(lab.currentValue - lab.baselineValue)})
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-xs text-slate-500 p-2 bg-slate-800/50 rounded mt-4">
        Lab values change based on:
        <ul className="mt-1 ml-4 list-disc">
          <li>Time elapsed without treatment</li>
          <li>Medications administered</li>
          <li>Overall patient condition</li>
        </ul>
      </div>
    </div>
  );
}
