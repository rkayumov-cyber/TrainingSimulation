import { Heart, Activity, Droplets, Thermometer, Wind } from "lucide-react";
import { useSimulation } from "../../context";
import { VitalCard } from "./VitalCard";
import { ECGDisplay } from "./ECGDisplay";

export function VitalsPanel() {
  const { state } = useSimulation();
  const { vitals } = state;

  // Determine abnormal values
  const isHRAbnormal = vitals.hr > 100 || vitals.hr < 60;
  const isBPAbnormal = vitals.bpSystolic < 90 || vitals.bpSystolic > 140;
  const isSpo2Abnormal = vitals.spo2 < 94;
  const isTempAbnormal = vitals.temp > 38 || vitals.temp < 36;
  const isRRAbnormal = vitals.respRate > 20 || vitals.respRate < 12;

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-white font-semibold text-lg flex items-center gap-2">
        <Activity className="w-5 h-5 text-emerald-400" />
        Vital Signs
      </h2>

      <div className="grid grid-cols-2 gap-3">
        <VitalCard
          label="Heart Rate"
          value={vitals.hr}
          unit="bpm"
          icon={<Heart className="w-4 h-4" />}
          color={isHRAbnormal ? "red" : "green"}
          isAbnormal={isHRAbnormal}
        />

        <VitalCard
          label="Blood Pressure"
          value={`${vitals.bpSystolic}/${vitals.bpDiastolic}`}
          unit="mmHg"
          icon={<Activity className="w-4 h-4" />}
          color={isBPAbnormal ? "yellow" : "green"}
          isAbnormal={isBPAbnormal}
        />

        <VitalCard
          label="SpO2"
          value={vitals.spo2}
          unit="%"
          icon={<Droplets className="w-4 h-4" />}
          color={isSpo2Abnormal ? "red" : "blue"}
          isAbnormal={isSpo2Abnormal}
        />

        <VitalCard
          label="Temperature"
          value={vitals.temp.toFixed(1)}
          unit="°C"
          icon={<Thermometer className="w-4 h-4" />}
          color={isTempAbnormal ? "red" : "purple"}
          isAbnormal={isTempAbnormal}
        />

        <VitalCard
          label="Resp Rate"
          value={vitals.respRate}
          unit="/min"
          icon={<Wind className="w-4 h-4" />}
          color={isRRAbnormal ? "yellow" : "green"}
          isAbnormal={isRRAbnormal}
        />
      </div>

      <ECGDisplay />
    </div>
  );
}
