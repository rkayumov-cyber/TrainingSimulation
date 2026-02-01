import type { DynamicLabValue, LabEvolution } from "../../types/enhanced";

// Dynamic lab definitions per scenario
export const SCENARIO_LABS: Record<string, DynamicLabValue[]> = {
  sepsis: [
    {
      name: "Lactate",
      baselineValue: 4.2,
      currentValue: 4.2,
      unit: "mmol/L",
      normalRange: { min: 0.5, max: 2.0 },
      criticalRange: { min: 0, max: 4.0 },
      deteriorationRate: 0.3, // Increases 0.3 per minute untreated
      improvementTriggers: [
        {
          action: "administer_fluids",
          improvementRate: -0.15,
          maxImprovement: 2.5,
        },
        {
          action: "administer_antibiotics",
          improvementRate: -0.05,
          maxImprovement: 1.5,
        },
      ],
    },
    {
      name: "WBC",
      baselineValue: 18.5,
      currentValue: 18.5,
      unit: "x10^9/L",
      normalRange: { min: 4.5, max: 11.0 },
      deteriorationRate: 0.1,
      improvementTriggers: [
        {
          action: "administer_antibiotics",
          improvementRate: -0.2,
          maxImprovement: 8.0,
        },
      ],
    },
    {
      name: "Creatinine",
      baselineValue: 1.8,
      currentValue: 1.8,
      unit: "mg/dL",
      normalRange: { min: 0.7, max: 1.3 },
      deteriorationRate: 0.05,
      improvementTriggers: [
        {
          action: "administer_fluids",
          improvementRate: -0.02,
          maxImprovement: 0.5,
        },
      ],
    },
    {
      name: "Procalcitonin",
      baselineValue: 8.5,
      currentValue: 8.5,
      unit: "ng/mL",
      normalRange: { min: 0, max: 0.5 },
      criticalRange: { min: 0, max: 2.0 },
      deteriorationRate: 0.2,
      improvementTriggers: [
        {
          action: "administer_antibiotics",
          improvementRate: -0.1,
          maxImprovement: 5.0,
        },
      ],
    },
  ],
  mi: [
    {
      name: "Troponin I",
      baselineValue: 0.08,
      currentValue: 0.08,
      unit: "ng/mL",
      normalRange: { min: 0, max: 0.04 },
      criticalRange: { min: 0, max: 0.1 },
      deteriorationRate: 0.15, // Rises initially (expected in MI)
      improvementTriggers: [
        // Troponin will rise then fall - special handling
        { action: "administer_aspirin", improvementRate: 0, maxImprovement: 0 }, // Stabilizes
      ],
    },
    {
      name: "CK-MB",
      baselineValue: 12,
      currentValue: 12,
      unit: "U/L",
      normalRange: { min: 0, max: 5 },
      deteriorationRate: 2,
      improvementTriggers: [],
    },
    {
      name: "BNP",
      baselineValue: 450,
      currentValue: 450,
      unit: "pg/mL",
      normalRange: { min: 0, max: 100 },
      deteriorationRate: 10,
      improvementTriggers: [
        {
          action: "administer_nitro",
          improvementRate: -5,
          maxImprovement: 150,
        },
      ],
    },
  ],
  anaphylaxis: [
    {
      name: "Tryptase",
      baselineValue: 45,
      currentValue: 45,
      unit: "ng/mL",
      normalRange: { min: 0, max: 11.4 },
      deteriorationRate: 2,
      improvementTriggers: [
        {
          action: "administer_epinephrine",
          improvementRate: -1.5,
          maxImprovement: 25,
        },
      ],
    },
    {
      name: "Histamine",
      baselineValue: 85,
      currentValue: 85,
      unit: "ng/mL",
      normalRange: { min: 0, max: 10 },
      deteriorationRate: 3,
      improvementTriggers: [
        {
          action: "administer_epinephrine",
          improvementRate: -2,
          maxImprovement: 50,
        },
        {
          action: "administer_antihistamine",
          improvementRate: -1.5,
          maxImprovement: 40,
        },
      ],
    },
  ],
  asthma: [
    {
      name: "Peak Flow",
      baselineValue: 45,
      currentValue: 45,
      unit: "% predicted",
      normalRange: { min: 80, max: 100 },
      criticalRange: { min: 25, max: 50 },
      deteriorationRate: -2, // Decreases
      improvementTriggers: [
        {
          action: "administer_salbutamol",
          improvementRate: 3,
          maxImprovement: 35,
        },
        {
          action: "administer_ipratropium",
          improvementRate: 1.5,
          maxImprovement: 15,
        },
        {
          action: "administer_steroids",
          improvementRate: 1,
          maxImprovement: 10,
        },
      ],
    },
    {
      name: "pCO2",
      baselineValue: 48,
      currentValue: 48,
      unit: "mmHg",
      normalRange: { min: 35, max: 45 },
      criticalRange: { min: 30, max: 50 },
      deteriorationRate: 0.5,
      improvementTriggers: [
        {
          action: "administer_salbutamol",
          improvementRate: -0.3,
          maxImprovement: 8,
        },
        {
          action: "administer_oxygen",
          improvementRate: -0.1,
          maxImprovement: 3,
        },
      ],
    },
    {
      name: "pH",
      baselineValue: 7.32,
      currentValue: 7.32,
      unit: "",
      normalRange: { min: 7.35, max: 7.45 },
      deteriorationRate: -0.005,
      improvementTriggers: [
        {
          action: "administer_salbutamol",
          improvementRate: 0.003,
          maxImprovement: 0.08,
        },
      ],
    },
  ],
};

// Special handling for troponin curve in MI
export function calculateTroponinValue(
  baselineValue: number,
  elapsedMinutes: number,
  aspirinGiven: boolean,
  aspirinTime: number | null,
): number {
  // Troponin rises for first 12-24 hours, then falls
  // Peak is around 12-24 hours post-MI onset
  const peakTime = 720; // 12 hours in minutes
  const fallRate = 0.005; // Per minute during fall (slower)

  let value = baselineValue;

  if (elapsedMinutes < peakTime) {
    // Rising phase - exponential rise
    const progress = elapsedMinutes / peakTime;
    value =
      baselineValue + (2.5 - baselineValue) * (1 - Math.exp(-3 * progress));
  } else {
    // Falling phase
    const timePastPeak = elapsedMinutes - peakTime;
    const peakValue = 2.5;
    value = peakValue * Math.exp(-fallRate * timePastPeak);
  }

  // Aspirin can help stabilize and accelerate normalization
  if (aspirinGiven && aspirinTime !== null) {
    const timeSinceAspirin = elapsedMinutes - aspirinTime;
    if (timeSinceAspirin > 0) {
      value *= Math.exp(-0.001 * timeSinceAspirin);
    }
  }

  return Math.max(0.01, value);
}

export class DynamicLabManager {
  private labs: Map<string, DynamicLabValue> = new Map();
  private history: Map<string, LabEvolution> = new Map();
  private actionTimes: Map<string, number> = new Map();
  private scenarioId: string = "";
  private startTime: number = 0;

  initialize(scenarioId: string, startTime: number): void {
    this.scenarioId = scenarioId;
    this.startTime = startTime;
    this.labs.clear();
    this.history.clear();
    this.actionTimes.clear();

    const scenarioLabs = SCENARIO_LABS[scenarioId] || [];
    for (const lab of scenarioLabs) {
      this.labs.set(lab.name, { ...lab });
      this.history.set(lab.name, {
        labName: lab.name,
        history: [{ time: 0, value: lab.baselineValue }],
        trend: "stable",
      });
    }
  }

  recordAction(action: string, time: number): void {
    if (!this.actionTimes.has(action)) {
      this.actionTimes.set(action, time);
    }
  }

  updateLabs(currentTime: number): void {
    const elapsedMinutes = (currentTime - this.startTime) / 60000;

    for (const [name, lab] of this.labs) {
      // Special handling for troponin
      if (name === "Troponin I" && this.scenarioId === "mi") {
        const aspirinTime = this.actionTimes.get("administer_aspirin");
        const aspirinGiven = aspirinTime !== undefined;
        lab.currentValue = calculateTroponinValue(
          lab.baselineValue,
          elapsedMinutes,
          aspirinGiven,
          aspirinGiven ? (aspirinTime! - this.startTime) / 60000 : null,
        );
      } else {
        // Standard lab calculation
        let netChangeRate = lab.deteriorationRate;

        // Apply improvement from treatments
        for (const trigger of lab.improvementTriggers) {
          if (this.actionTimes.has(trigger.action)) {
            const actionTime = this.actionTimes.get(trigger.action)!;
            const minutesSinceAction = (currentTime - actionTime) / 60000;

            if (minutesSinceAction > 0) {
              // Effect ramps up over 5 minutes
              const effectStrength = Math.min(1, minutesSinceAction / 5);
              netChangeRate += trigger.improvementRate * effectStrength;
            }
          }
        }

        // Calculate new value
        const deltaTime = 1; // Assume 1 minute updates
        let newValue = lab.currentValue + netChangeRate * deltaTime;

        // Apply improvement caps
        for (const trigger of lab.improvementTriggers) {
          if (this.actionTimes.has(trigger.action)) {
            const improvementSoFar = lab.baselineValue - newValue;
            if (improvementSoFar > trigger.maxImprovement) {
              newValue = lab.baselineValue - trigger.maxImprovement;
            }
          }
        }

        // Keep within reasonable bounds
        newValue = Math.max(0, newValue);
        lab.currentValue = newValue;
      }

      // Update history
      const evolution = this.history.get(name)!;
      evolution.history.push({ time: elapsedMinutes, value: lab.currentValue });

      // Calculate trend
      if (evolution.history.length >= 2) {
        const recent = evolution.history.slice(-3);
        const avgChange =
          recent.reduce((sum, _, i) => {
            if (i === 0) return sum;
            return sum + (recent[i].value - recent[i - 1].value);
          }, 0) /
          (recent.length - 1);

        if (avgChange > 0.01) evolution.trend = "worsening";
        else if (avgChange < -0.01) evolution.trend = "improving";
        else evolution.trend = "stable";
      }
    }
  }

  getLab(name: string): DynamicLabValue | undefined {
    return this.labs.get(name);
  }

  getAllLabs(): DynamicLabValue[] {
    return Array.from(this.labs.values());
  }

  getLabEvolution(name: string): LabEvolution | undefined {
    return this.history.get(name);
  }

  getFormattedResult(name: string): string {
    const lab = this.labs.get(name);
    if (!lab) return "Pending";

    const value = lab.currentValue;
    const isNormal =
      value >= lab.normalRange.min && value <= lab.normalRange.max;
    const isCritical =
      lab.criticalRange &&
      (value < lab.criticalRange.min || value > lab.criticalRange.max);

    let status = "";
    if (isCritical) status = " (CRITICAL)";
    else if (!isNormal)
      status = value > lab.normalRange.max ? " (HIGH)" : " (LOW)";

    // Format based on value magnitude
    let formatted: string;
    if (value < 1) {
      formatted = value.toFixed(3);
    } else if (value < 10) {
      formatted = value.toFixed(2);
    } else {
      formatted = value.toFixed(1);
    }

    return `${formatted} ${lab.unit}${status}`;
  }

  getTrend(name: string): "improving" | "stable" | "worsening" {
    return this.history.get(name)?.trend || "stable";
  }

  clear(): void {
    this.labs.clear();
    this.history.clear();
    this.actionTimes.clear();
  }
}

// Singleton
let labManager: DynamicLabManager | null = null;

export function getDynamicLabManager(): DynamicLabManager {
  if (!labManager) {
    labManager = new DynamicLabManager();
  }
  return labManager;
}

export function resetDynamicLabManager(): void {
  labManager = new DynamicLabManager();
}
