import { describe, it, expect } from "vitest";
import { processIntent } from "./stateUpdater";
import type { SimulationState, MedicalIntent, Vitals } from "../../types";

function makeState(overrides: Partial<Vitals> = {}): SimulationState {
  const vitals: Vitals = {
    hr: 100,
    bpSystolic: 85,
    bpDiastolic: 55,
    spo2: 88,
    temp: 38.5,
    respRate: 24,
    ...overrides,
  };

  return {
    vitals,
    targetVitals: { ...vitals },
    labsOrdered: [],
    labsCompleted: [],
    chatMessages: [],
    mdtMessages: [],
    events: [],
    feedbackLogs: [],
    actionsTaken: [],
    deteriorationRules: [],
    score: {
      timeToAntibiotics: null,
      timeToOxygen: null,
      timeToFluids: null,
      communicationErrors: 0,
      totalActions: 0,
      correctActions: 0,
    },
    startTime: Date.now(),
    isRunning: true,
    isPaused: false,
    scenarioId: "sepsis",
  };
}

function intent(action: string): MedicalIntent {
  return { action, raw: `test: ${action}` };
}

const labResults: Record<string, string> = {
  blood_cultures: "Gram-positive cocci",
  lactate: "4.2 mmol/L",
  cbc: "WBC 18.5",
  bmp: "Na 135, K 4.0",
  urinalysis: "Positive for nitrites",
  ecg: "Normal sinus rhythm",
};

describe("processIntent", () => {
  it("raises SpO2 on oxygen administration", () => {
    const state = makeState({ spo2: 88 });
    const update = processIntent(intent("administer_oxygen"), state, {});
    expect(update.vitalsUpdate?.spo2).toBe(93); // 88 + 5
    expect(update.actionRecorded).toBe("administer_oxygen");
    expect(update.preventsDeteriorationRules).toContain("no-oxygen");
  });

  it("caps SpO2 at 98 for oxygen", () => {
    const state = makeState({ spo2: 96 });
    const update = processIntent(intent("administer_oxygen"), state, {});
    expect(update.vitalsUpdate?.spo2).toBe(98);
  });

  it("raises BP and lowers HR on fluid bolus", () => {
    const state = makeState({ bpSystolic: 85, bpDiastolic: 55, hr: 110 });
    const update = processIntent(intent("fluid_bolus"), state, {});
    expect(update.vitalsUpdate?.bpSystolic).toBe(95);
    expect(update.vitalsUpdate?.bpDiastolic).toBe(60);
    expect(update.vitalsUpdate?.hr).toBe(105);
    expect(update.preventsDeteriorationRules).toContain("no-fluids");
  });

  it("clamps fluid bolus BP to maximums", () => {
    const state = makeState({ bpSystolic: 118, bpDiastolic: 78 });
    const update = processIntent(intent("fluid_bolus"), state, {});
    expect(update.vitalsUpdate?.bpSystolic).toBe(120);
    expect(update.vitalsUpdate?.bpDiastolic).toBe(80);
  });

  it("creates lab orders with results", () => {
    const state = makeState();
    const update = processIntent(
      intent("order_blood_cultures"),
      state,
      labResults,
    );
    expect(update.labOrder).toBeDefined();
    expect(update.labOrder?.name).toBe("Blood Cultures");
    expect(update.labOrder?.result).toBe("Gram-positive cocci");
  });

  it("creates clinical events for actions", () => {
    const state = makeState();
    const update = processIntent(intent("administer_oxygen"), state, {});
    expect(update.newEvents).toBeDefined();
    expect(update.newEvents!.length).toBeGreaterThan(0);
    expect(update.newEvents![0].type).toBe("action");
  });

  it("returns empty update for unknown actions", () => {
    const state = makeState();
    const update = processIntent(intent("unknown_action"), state, {});
    expect(update.vitalsUpdate).toBeUndefined();
    expect(update.newEvents).toBeUndefined();
    expect(update.labOrder).toBeUndefined();
    expect(update.actionRecorded).toBeUndefined();
  });

  it("handles epinephrine with significant vitals changes", () => {
    const state = makeState({ bpSystolic: 70, bpDiastolic: 40, hr: 95, spo2: 85 });
    const update = processIntent(intent("give_epinephrine"), state, {});
    expect(update.vitalsUpdate?.bpSystolic).toBe(95);
    expect(update.vitalsUpdate?.bpDiastolic).toBe(55);
    expect(update.vitalsUpdate?.hr).toBe(110);
    expect(update.vitalsUpdate?.spo2).toBe(91);
  });

  it("handles defibrillation setting absolute values", () => {
    const state = makeState({ hr: 0, bpSystolic: 0, bpDiastolic: 0, spo2: 20 });
    const update = processIntent(intent("defibrillate"), state, {});
    expect(update.vitalsUpdate?.hr).toBe(45);
    expect(update.vitalsUpdate?.bpSystolic).toBe(60);
    expect(update.vitalsUpdate?.bpDiastolic).toBe(35);
    expect(update.vitalsUpdate?.spo2).toBe(70);
  });

  it("handles naloxone for overdose", () => {
    const state = makeState({ respRate: 4, spo2: 72, hr: 50, bpSystolic: 80, bpDiastolic: 45 });
    const update = processIntent(intent("administer_naloxone"), state, {});
    expect(update.vitalsUpdate?.respRate).toBe(14);
    expect(update.vitalsUpdate?.spo2).toBe(84);
    expect(update.vitalsUpdate?.hr).toBe(75);
    expect(update.preventsDeteriorationRules).toContain("no-naloxone");
  });

  it("prevents deterioration rules for antibiotics", () => {
    const state = makeState();
    const update = processIntent(intent("administer_antibiotics"), state, {});
    expect(update.preventsDeteriorationRules).toContain("no-antibiotics");
    expect(update.actionRecorded).toBe("administer_antibiotics");
  });
});
