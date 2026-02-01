import { useSimulation } from "../../context";
import { Thermometer, Wind, Heart, Droplets } from "lucide-react";

export function PatientStatus() {
  const { state, scenario } = useSimulation();
  const { vitals } = state;

  // Determine patient conditions based on vitals
  const isHypoxic = vitals.spo2 < 90;
  const isCyanotic = vitals.spo2 < 85;
  const isHypotensive = vitals.bpSystolic < 90;
  const isTachycardic = vitals.hr > 110;
  const isFebrile = vitals.temp > 38.5;
  const isTachypneic = vitals.respRate > 24;

  // Determine skin color
  const getSkinColor = () => {
    if (isCyanotic) return "from-blue-300 to-blue-400";
    if (isHypoxic) return "from-blue-200 to-slate-300";
    if (isHypotensive) return "from-slate-200 to-slate-300";
    return "from-amber-100 to-amber-200";
  };

  // Determine overall status
  const getStatusText = () => {
    const conditions: string[] = [];
    if (isCyanotic) conditions.push("Cyanotic");
    else if (isHypoxic) conditions.push("Pale");
    if (isHypotensive) conditions.push("Clammy");
    if (isFebrile) conditions.push("Flushed & Shivering");
    if (isTachypneic) conditions.push("Labored breathing");

    if (conditions.length === 0) return "Appears stable";
    return conditions.join(", ");
  };

  const isCritical = isCyanotic || (isHypotensive && vitals.bpSystolic < 80);

  return (
    <div className="bg-slate-800/50 border-b border-slate-700 p-4">
      <div className="flex items-center gap-4">
        {/* Patient Avatar */}
        <div className="relative">
          <div
            className={`w-16 h-16 rounded-full bg-gradient-to-br ${getSkinColor()} flex items-center justify-center
              ${isFebrile ? "animate-pulse" : ""}
              ${isCritical ? "ring-4 ring-red-500 ring-opacity-50" : ""}
            `}
          >
            {/* Simple face */}
            <svg viewBox="0 0 40 40" className="w-12 h-12">
              {/* Eyes */}
              <circle cx="14" cy="16" r="2" fill="#475569" />
              <circle cx="26" cy="16" r="2" fill="#475569" />
              {/* Mouth - changes based on condition */}
              {isCritical ? (
                // Distressed mouth
                <path
                  d="M 14 28 Q 20 24 26 28"
                  stroke="#475569"
                  strokeWidth="2"
                  fill="none"
                />
              ) : isHypoxic || isHypotensive ? (
                // Neutral/worried mouth
                <line
                  x1="14"
                  y1="26"
                  x2="26"
                  y2="26"
                  stroke="#475569"
                  strokeWidth="2"
                />
              ) : (
                // Slight smile
                <path
                  d="M 14 24 Q 20 28 26 24"
                  stroke="#475569"
                  strokeWidth="2"
                  fill="none"
                />
              )}
            </svg>
          </div>

          {/* Shivering animation overlay */}
          {isFebrile && (
            <div className="absolute inset-0 animate-[shake_0.5s_ease-in-out_infinite]">
              <div className="w-16 h-16 rounded-full border-2 border-amber-400/30" />
            </div>
          )}

          {/* Critical indicator */}
          {isCritical && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-ping" />
          )}
        </div>

        {/* Patient Info */}
        <div className="flex-1">
          <h3 className="text-white font-medium">{scenario.patientName}</h3>
          <p
            className={`text-sm ${isCritical ? "text-red-400" : "text-slate-400"}`}
          >
            {getStatusText()}
          </p>

          {/* Quick vital indicators */}
          <div className="flex items-center gap-3 mt-2">
            <div
              className={`flex items-center gap-1 text-xs ${
                isTachycardic ? "text-red-400" : "text-slate-500"
              }`}
              title={`Heart Rate: ${vitals.hr} bpm`}
            >
              <Heart
                className={`w-3 h-3 ${isTachycardic ? "animate-pulse" : ""}`}
              />
              {vitals.hr}
            </div>

            <div
              className={`flex items-center gap-1 text-xs ${
                isHypoxic ? "text-red-400" : "text-slate-500"
              }`}
              title={`SpO2: ${vitals.spo2}%`}
            >
              <Droplets className="w-3 h-3" />
              {vitals.spo2}%
            </div>

            <div
              className={`flex items-center gap-1 text-xs ${
                isFebrile ? "text-amber-400" : "text-slate-500"
              }`}
              title={`Temperature: ${vitals.temp}°C`}
            >
              <Thermometer className="w-3 h-3" />
              {vitals.temp}°
            </div>

            <div
              className={`flex items-center gap-1 text-xs ${
                isTachypneic ? "text-amber-400" : "text-slate-500"
              }`}
              title={`Respiratory Rate: ${vitals.respRate}/min`}
            >
              <Wind className="w-3 h-3" />
              {vitals.respRate}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
