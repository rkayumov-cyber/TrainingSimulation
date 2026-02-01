import type { Vitals } from "../../types/simulation";
import type {
  DrugKinetics,
  ActiveDrugEffect,
  KineticCurve,
} from "../../types/enhanced";

// Drug kinetics definitions
export const DRUG_KINETICS: DrugKinetics[] = [
  // Oxygen
  {
    actionId: "administer_oxygen",
    name: "Supplemental Oxygen",
    onsetSeconds: 30,
    peakSeconds: 180, // 3 minutes to full effect
    durationSeconds: Infinity, // Continuous while applied
    curve: "sigmoid",
    effects: { spo2: 0 }, // Placeholder, actual effect calculated
    maxEffect: { spo2: 10 }, // Can improve SpO2 by up to 10%
    requiresContinuous: true,
  },
  // IV Fluids
  {
    actionId: "administer_fluids",
    name: "IV Fluid Bolus",
    onsetSeconds: 120, // 2 minutes
    peakSeconds: 600, // 10 minutes
    durationSeconds: 2700, // 45 minutes
    curve: "exponential",
    effects: { bpSystolic: 0, hr: 0 },
    maxEffect: { bpSystolic: 20, hr: -10 }, // BP up, HR down
    requiresContinuous: false,
  },
  // Antibiotics (sepsis)
  {
    actionId: "administer_antibiotics",
    name: "IV Antibiotics",
    onsetSeconds: 600, // 10 minutes
    peakSeconds: 3600, // 1 hour
    durationSeconds: 28800, // 8 hours
    curve: "sigmoid",
    effects: { temp: 0 },
    maxEffect: { temp: -1.5 }, // Gradual temperature reduction
    requiresContinuous: false,
  },
  // Epinephrine (anaphylaxis)
  {
    actionId: "administer_epinephrine",
    name: "Epinephrine IM",
    onsetSeconds: 30,
    peakSeconds: 180, // 3 minutes
    durationSeconds: 900, // 15 minutes
    curve: "exponential",
    effects: { bpSystolic: 0, hr: 0, spo2: 0 },
    maxEffect: { bpSystolic: 30, hr: 20, spo2: 5 },
    requiresContinuous: false,
  },
  // Aspirin (MI)
  {
    actionId: "administer_aspirin",
    name: "Aspirin",
    onsetSeconds: 300, // 5 minutes
    peakSeconds: 1800, // 30 minutes
    durationSeconds: 86400, // 24 hours
    curve: "linear",
    effects: {}, // Prevents deterioration, no direct vital effect
    maxEffect: {},
    requiresContinuous: false,
  },
  // Nitroglycerin (MI)
  {
    actionId: "administer_nitro",
    name: "Nitroglycerin SL",
    onsetSeconds: 60, // 1 minute
    peakSeconds: 300, // 5 minutes
    durationSeconds: 1800, // 30 minutes
    curve: "exponential",
    effects: { bpSystolic: 0, hr: 0 },
    maxEffect: { bpSystolic: -15, hr: 5 }, // BP down, slight HR increase
    requiresContinuous: false,
  },
  // Morphine
  {
    actionId: "administer_morphine",
    name: "Morphine IV",
    onsetSeconds: 120, // 2 minutes
    peakSeconds: 600, // 10 minutes
    durationSeconds: 14400, // 4 hours
    curve: "sigmoid",
    effects: { hr: 0, respRate: 0, bpSystolic: 0 },
    maxEffect: { hr: -10, respRate: -4, bpSystolic: -10 },
    requiresContinuous: false,
  },
  // Salbutamol (asthma)
  {
    actionId: "administer_salbutamol",
    name: "Salbutamol Nebulizer",
    onsetSeconds: 30,
    peakSeconds: 300, // 5 minutes
    durationSeconds: 3600, // 1 hour
    curve: "sigmoid",
    effects: { spo2: 0, respRate: 0, hr: 0 },
    maxEffect: { spo2: 8, respRate: -6, hr: 10 }, // Improves breathing, increases HR
    requiresContinuous: false,
  },
  // Steroids
  {
    actionId: "administer_steroids",
    name: "IV Corticosteroids",
    onsetSeconds: 1800, // 30 minutes
    peakSeconds: 7200, // 2 hours
    durationSeconds: 28800, // 8 hours
    curve: "sigmoid",
    effects: { spo2: 0, respRate: 0 },
    maxEffect: { spo2: 3, respRate: -2 },
    requiresContinuous: false,
  },
  // Antihistamine
  {
    actionId: "administer_antihistamine",
    name: "Diphenhydramine IV",
    onsetSeconds: 120,
    peakSeconds: 600,
    durationSeconds: 14400, // 4 hours
    curve: "exponential",
    effects: {},
    maxEffect: {},
    requiresContinuous: false,
  },
  // Ipratropium (asthma)
  {
    actionId: "administer_ipratropium",
    name: "Ipratropium Nebulizer",
    onsetSeconds: 300, // 5 minutes
    peakSeconds: 1200, // 20 minutes
    durationSeconds: 14400, // 4 hours
    curve: "sigmoid",
    effects: { spo2: 0, respRate: 0 },
    maxEffect: { spo2: 4, respRate: -3 },
    requiresContinuous: false,
  },
  // Antipyretic
  {
    actionId: "administer_antipyretic",
    name: "Acetaminophen",
    onsetSeconds: 900, // 15 minutes
    peakSeconds: 2700, // 45 minutes
    durationSeconds: 14400, // 4 hours
    curve: "sigmoid",
    effects: { temp: 0 },
    maxEffect: { temp: -1.5 },
    requiresContinuous: false,
  },
];

// Calculate effect intensity based on kinetic curve
export function calculateIntensity(
  curve: KineticCurve,
  elapsedSeconds: number,
  onsetSeconds: number,
  peakSeconds: number,
  durationSeconds: number,
): number {
  if (elapsedSeconds < onsetSeconds) {
    // Before onset - linear ramp up to small effect
    return (elapsedSeconds / onsetSeconds) * 0.2;
  }

  const timeAfterOnset = elapsedSeconds - onsetSeconds;
  const timeToPeak = peakSeconds - onsetSeconds;
  const timeAfterPeak = elapsedSeconds - peakSeconds;
  const decayDuration = durationSeconds - peakSeconds;

  switch (curve) {
    case "immediate":
      if (elapsedSeconds >= onsetSeconds && elapsedSeconds < durationSeconds) {
        return 1;
      }
      return 0;

    case "linear":
      if (elapsedSeconds < peakSeconds) {
        // Rising phase
        return 0.2 + (timeAfterOnset / timeToPeak) * 0.8;
      } else if (elapsedSeconds < durationSeconds) {
        // Decay phase
        return 1 - timeAfterPeak / decayDuration;
      }
      return 0;

    case "exponential":
      if (elapsedSeconds < peakSeconds) {
        // Rapid rise
        const progress = timeAfterOnset / timeToPeak;
        return 0.2 + (1 - Math.exp(-3 * progress)) * 0.8;
      } else if (elapsedSeconds < durationSeconds) {
        // Exponential decay
        const decayProgress = timeAfterPeak / decayDuration;
        return Math.exp(-2 * decayProgress);
      }
      return 0;

    case "sigmoid":
      if (elapsedSeconds < peakSeconds) {
        // Sigmoid rise
        const progress = timeAfterOnset / timeToPeak;
        const sigmoid = 1 / (1 + Math.exp(-10 * (progress - 0.5)));
        return 0.2 + sigmoid * 0.8;
      } else if (elapsedSeconds < durationSeconds) {
        // Gradual decay
        const decayProgress = timeAfterPeak / decayDuration;
        return 1 - decayProgress * 0.5; // Slower decay for sigmoid drugs
      }
      return 0;

    default:
      return 0;
  }
}

// Calculate the current vital effect from a drug
export function calculateDrugEffect(
  kinetics: DrugKinetics,
  elapsedSeconds: number,
  _currentVitals?: Vitals, // Reserved for vital-aware adjustments
): Partial<Vitals> {
  const intensity = calculateIntensity(
    kinetics.curve,
    elapsedSeconds,
    kinetics.onsetSeconds,
    kinetics.peakSeconds,
    kinetics.durationSeconds,
  );

  const effects: Partial<Vitals> = {};

  for (const [key, maxChange] of Object.entries(kinetics.maxEffect)) {
    if (maxChange !== undefined && maxChange !== 0) {
      const vitalKey = key as keyof Vitals;
      const change = maxChange * intensity;
      effects[vitalKey] = change;
    }
  }

  return effects;
}

// Manage active drug effects
export class DrugEffectManager {
  private activeEffects: Map<string, ActiveDrugEffect> = new Map();

  addDrug(actionId: string, startTime: number): void {
    const kinetics = DRUG_KINETICS.find((d) => d.actionId === actionId);
    if (!kinetics) return;

    // For continuous drugs, just update the start time if already active
    if (kinetics.requiresContinuous && this.activeEffects.has(actionId)) {
      return;
    }

    this.activeEffects.set(actionId, {
      kinetics,
      startTime,
      currentIntensity: 0,
      isActive: true,
    });
  }

  removeDrug(actionId: string): void {
    this.activeEffects.delete(actionId);
  }

  calculateTotalEffects(
    currentTime: number,
    baselineVitals: Vitals,
  ): Partial<Vitals> {
    const totalEffects: Partial<Vitals> = {
      hr: 0,
      bpSystolic: 0,
      bpDiastolic: 0,
      spo2: 0,
      temp: 0,
      respRate: 0,
    };

    for (const [actionId, effect] of this.activeEffects) {
      const elapsedSeconds = (currentTime - effect.startTime) / 1000;

      // Check if drug effect has worn off
      if (
        !effect.kinetics.requiresContinuous &&
        elapsedSeconds > effect.kinetics.durationSeconds
      ) {
        this.activeEffects.delete(actionId);
        continue;
      }

      const drugEffect = calculateDrugEffect(
        effect.kinetics,
        elapsedSeconds,
        baselineVitals,
      );

      // Accumulate effects
      for (const [key, value] of Object.entries(drugEffect)) {
        if (value !== undefined) {
          const vitalKey = key as keyof Vitals;
          totalEffects[vitalKey] = (totalEffects[vitalKey] || 0) + value;
        }
      }

      // Update intensity
      effect.currentIntensity = calculateIntensity(
        effect.kinetics.curve,
        elapsedSeconds,
        effect.kinetics.onsetSeconds,
        effect.kinetics.peakSeconds,
        effect.kinetics.durationSeconds,
      );
    }

    return totalEffects;
  }

  getActiveEffects(): ActiveDrugEffect[] {
    return Array.from(this.activeEffects.values());
  }

  getEffectIntensity(actionId: string): number {
    return this.activeEffects.get(actionId)?.currentIntensity || 0;
  }

  clear(): void {
    this.activeEffects.clear();
  }
}

// Singleton instance
let drugEffectManager: DrugEffectManager | null = null;

export function getDrugEffectManager(): DrugEffectManager {
  if (!drugEffectManager) {
    drugEffectManager = new DrugEffectManager();
  }
  return drugEffectManager;
}

export function resetDrugEffectManager(): void {
  drugEffectManager = new DrugEffectManager();
}
