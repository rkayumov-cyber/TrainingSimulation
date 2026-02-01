import { useMemo } from "react";
import {
  AlertTriangle,
  Shield,
  Activity,
  ThermometerSun,
  Heart,
  Wind,
  Gauge,
} from "lucide-react";
import { useSimulation } from "../../context";
import { calculateNEWS2, getNews2Color } from "../../services/assessment/news2Service";
import type { NEWS2Result } from "../../services/assessment/news2Service";

const SCORE_BADGE: Record<number, string> = {
  0: "bg-green-500/20 text-green-400",
  1: "bg-yellow-500/20 text-yellow-400",
  2: "bg-orange-500/20 text-orange-400",
  3: "bg-red-500/20 text-red-400",
};

const RISK_BANNER: Record<NEWS2Result["riskLevel"], string> = {
  low: "bg-green-500/10 border-green-500/30 text-green-400",
  "low-key": "bg-yellow-500/10 border-yellow-500/30 text-yellow-400",
  medium: "bg-orange-500/10 border-orange-500/30 text-orange-400",
  high: "bg-red-500/10 border-red-500/30 text-red-400",
};

const RISK_LABEL: Record<NEWS2Result["riskLevel"], string> = {
  low: "Low Risk",
  "low-key": "Low-Key Risk",
  medium: "Medium Risk",
  high: "High Risk",
};

const TOTAL_SCORE_BG: Record<NEWS2Result["riskLevel"], string> = {
  low: "bg-green-500",
  "low-key": "bg-yellow-500",
  medium: "bg-orange-500",
  high: "bg-red-500",
};

const PARAM_ICONS: Record<string, React.ReactNode> = {
  "Respiration Rate": <Wind className="w-4 h-4 text-slate-400" />,
  "SpO2 (Scale 1)": <Activity className="w-4 h-4 text-slate-400" />,
  "SpO2 (Scale 2)": <Activity className="w-4 h-4 text-slate-400" />,
  "Systolic Blood Pressure": <Gauge className="w-4 h-4 text-slate-400" />,
  "Heart Rate": <Heart className="w-4 h-4 text-slate-400" />,
  Temperature: <ThermometerSun className="w-4 h-4 text-slate-400" />,
  "Consciousness (AVPU)": <Shield className="w-4 h-4 text-slate-400" />,
  "Supplemental Oxygen": <Wind className="w-4 h-4 text-slate-400" />,
};

export function NEWS2Panel() {
  const { state } = useSimulation();
  const { vitals, actionsTaken } = state;

  const supplementalOxygen = actionsTaken.includes("administer_oxygen");

  const news2: NEWS2Result = useMemo(
    () => calculateNEWS2(vitals, supplementalOxygen),
    [vitals, supplementalOxygen],
  );

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-white font-semibold text-lg flex items-center gap-2">
          <AlertTriangle className={`w-5 h-5 ${getNews2Color(news2.riskLevel)}`} />
          NEWS2 Score
        </h2>
        <span
          className={`${TOTAL_SCORE_BG[news2.riskLevel]} text-white text-xl font-bold rounded-full w-10 h-10 flex items-center justify-center`}
        >
          {news2.totalScore}
        </span>
      </div>

      {/* Risk Level Banner */}
      <div
        className={`${RISK_BANNER[news2.riskLevel]} border rounded-lg px-4 py-2 text-sm font-medium`}
      >
        {RISK_LABEL[news2.riskLevel]}
      </div>

      {/* Parameters Grid */}
      <div className="grid grid-cols-2 gap-3">
        {news2.parameters.map((param) => (
          <div
            key={param.name}
            className="bg-slate-800 border border-slate-700 rounded-lg p-3"
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5 text-slate-300 text-sm font-medium">
                {PARAM_ICONS[param.name]}
                {param.name}
              </div>
              <span
                className={`${SCORE_BADGE[Math.min(param.score, 3)]} text-xs font-bold px-2 py-0.5 rounded-full`}
              >
                {param.score}
              </span>
            </div>
            <div className="text-white text-sm font-semibold">
              {param.name === "Supplemental Oxygen"
                ? param.value === 1
                  ? "Yes"
                  : "No"
                : param.name === "Consciousness (AVPU)"
                  ? "Alert"
                  : param.value}
            </div>
            <div className="text-slate-500 text-xs mt-0.5">
              {param.rangeDescription}
            </div>
          </div>
        ))}
      </div>

      {/* Clinical Action Recommendation */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-3">
        <h3 className="text-slate-400 text-xs uppercase tracking-wide mb-1">
          Clinical Response
        </h3>
        <p className="text-slate-200 text-sm">{news2.clinicalResponse}</p>
      </div>
    </div>
  );
}
