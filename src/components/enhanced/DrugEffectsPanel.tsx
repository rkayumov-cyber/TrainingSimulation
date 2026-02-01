import { useContext, useState, useEffect } from "react";
import { Pill, TrendingUp, Clock } from "lucide-react";
import { SimulationContext } from "../../context/SimulationContextDef";
import type { ActiveDrugEffect } from "../../types/enhanced";

function DrugEffectItem({ effect }: { effect: ActiveDrugEffect }) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - effect.startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [effect.startTime]);

  const elapsedMinutes = Math.floor(elapsedSeconds / 60);
  const remainingSeconds = elapsedSeconds % 60;
  const intensityPercent = Math.round(effect.currentIntensity * 100);

  // Determine phase
  let phase = "Rising";
  let phaseColor = "text-yellow-400";
  if (elapsedSeconds >= effect.kinetics.peakSeconds) {
    phase = "Declining";
    phaseColor = "text-orange-400";
  }
  if (
    elapsedSeconds >= effect.kinetics.durationSeconds &&
    !effect.kinetics.requiresContinuous
  ) {
    phase = "Worn off";
    phaseColor = "text-slate-500";
  }
  if (effect.kinetics.requiresContinuous) {
    phase = "Continuous";
    phaseColor = "text-blue-400";
  }

  // Get effect descriptions
  const effectDescriptions: string[] = [];
  for (const [vital, change] of Object.entries(effect.kinetics.maxEffect)) {
    if (change !== 0) {
      const actualChange = Math.round(
        (change as number) * effect.currentIntensity,
      );
      const direction = actualChange > 0 ? "↑" : "↓";
      effectDescriptions.push(
        `${vital}: ${direction}${Math.abs(actualChange)}`,
      );
    }
  }

  return (
    <div className="bg-slate-800 rounded-lg p-3 space-y-2">
      <div className="flex justify-between items-start">
        <div>
          <div className="font-medium text-white">{effect.kinetics.name}</div>
          <div className={`text-xs ${phaseColor}`}>{phase}</div>
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-400 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {elapsedMinutes}:{remainingSeconds.toString().padStart(2, "0")}
          </div>
        </div>
      </div>

      {/* Intensity Bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-slate-400">Effect Intensity</span>
          <span className="text-slate-300">{intensityPercent}%</span>
        </div>
        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              intensityPercent > 70
                ? "bg-emerald-500"
                : intensityPercent > 30
                  ? "bg-yellow-500"
                  : "bg-orange-500"
            }`}
            style={{ width: `${intensityPercent}%` }}
          />
        </div>
      </div>

      {/* Current Effects */}
      {effectDescriptions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {effectDescriptions.map((desc, i) => (
            <span
              key={i}
              className="text-xs px-2 py-0.5 rounded bg-slate-700 text-slate-300"
            >
              {desc}
            </span>
          ))}
        </div>
      )}

      {/* Kinetics Info */}
      <div className="text-xs text-slate-500 flex items-center gap-3">
        <span>Onset: {Math.round(effect.kinetics.onsetSeconds / 60)}min</span>
        <span>Peak: {Math.round(effect.kinetics.peakSeconds / 60)}min</span>
        {!effect.kinetics.requiresContinuous && (
          <span>
            Duration: {Math.round(effect.kinetics.durationSeconds / 60)}min
          </span>
        )}
      </div>
    </div>
  );
}

export function DrugEffectsPanel() {
  const context = useContext(SimulationContext);
  if (!context) return null;

  const { activeDrugEffects, state } = context;

  if (!state.isRunning) {
    return (
      <div className="p-4 text-center text-slate-400">
        <Pill className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p>Start a simulation to see drug effects</p>
      </div>
    );
  }

  if (activeDrugEffects.length === 0) {
    return (
      <div className="p-4 text-center text-slate-400">
        <Pill className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p>No active medications</p>
        <p className="text-xs mt-1">
          Administer medications to see their kinetic effects
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-3">
      <h3 className="text-sm font-medium text-slate-300 flex items-center gap-2">
        <Pill className="w-4 h-4" />
        Active Medications
      </h3>

      {activeDrugEffects.map((effect) => (
        <DrugEffectItem key={effect.kinetics.actionId} effect={effect} />
      ))}

      <div className="text-xs text-slate-500 mt-4 p-2 bg-slate-800/50 rounded">
        <TrendingUp className="w-3 h-3 inline mr-1" />
        Drug effects are simulated with realistic onset, peak, and decay curves.
        Vital signs will change as medications take effect.
      </div>
    </div>
  );
}
