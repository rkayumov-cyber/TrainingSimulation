import { describe, it, expect, beforeEach } from "vitest";
import {
  simulationReducer,
  createInitialState,
} from "./simulationReducer";
import type { SimulationState, Vitals, DeteriorationRule } from "../types";

const baseVitals: Vitals = {
  hr: 100,
  bpSystolic: 90,
  bpDiastolic: 60,
  spo2: 92,
  temp: 38.5,
  respRate: 22,
};

const sampleRules: DeteriorationRule[] = [
  {
    id: "no-oxygen",
    condition: "Hypoxia worsening",
    timerMinutes: 3,
    effect: { spo2: 80 },
    preventedBy: ["administer_oxygen"],
    triggered: false,
    startTime: Date.now(),
  },
];

let state: SimulationState;

beforeEach(() => {
  state = createInitialState("sepsis", baseVitals, sampleRules);
});

describe("createInitialState", () => {
  it("creates state with correct initial values", () => {
    expect(state.scenarioId).toBe("sepsis");
    expect(state.vitals).toEqual(baseVitals);
    expect(state.targetVitals).toEqual(baseVitals);
    expect(state.isRunning).toBe(false);
    expect(state.isPaused).toBe(false);
    expect(state.actionsTaken).toEqual([]);
    expect(state.chatMessages).toEqual([]);
    expect(state.events).toEqual([]);
    expect(state.labsOrdered).toEqual([]);
    expect(state.labsCompleted).toEqual([]);
    expect(state.feedbackLogs).toEqual([]);
    expect(state.score.timeToAntibiotics).toBeNull();
    expect(state.score.timeToOxygen).toBeNull();
    expect(state.score.timeToFluids).toBeNull();
    expect(state.score.communicationErrors).toBe(0);
    expect(state.score.totalActions).toBe(0);
  });

  it("copies vitals independently from baseline", () => {
    const mutableVitals = { ...baseVitals };
    const s = createInitialState("test", mutableVitals, []);
    mutableVitals.hr = 999;
    expect(s.vitals.hr).toBe(100);
  });
});

describe("simulationReducer", () => {
  describe("START_SIMULATION / PAUSE / RESUME", () => {
    it("starts simulation", () => {
      const result = simulationReducer(state, { type: "START_SIMULATION" });
      expect(result.isRunning).toBe(true);
      expect(result.isPaused).toBe(false);
      expect(result.startTime).toBeGreaterThan(0);
    });

    it("pauses simulation", () => {
      const running = simulationReducer(state, { type: "START_SIMULATION" });
      const paused = simulationReducer(running, { type: "PAUSE_SIMULATION" });
      expect(paused.isPaused).toBe(true);
    });

    it("resumes simulation", () => {
      const running = simulationReducer(state, { type: "START_SIMULATION" });
      const paused = simulationReducer(running, { type: "PAUSE_SIMULATION" });
      const resumed = simulationReducer(paused, { type: "RESUME_SIMULATION" });
      expect(resumed.isPaused).toBe(false);
    });
  });

  describe("TICK_VITALS", () => {
    it("lerps vitals toward target at 10% per tick", () => {
      // Set target different from current
      const withTarget = simulationReducer(state, {
        type: "SET_TARGET_VITALS",
        payload: { hr: 120 },
      });
      const ticked = simulationReducer(withTarget, { type: "TICK_VITALS" });
      // Current HR = 100, target = 120, lerp(100, 120, 0.1) = 102
      expect(ticked.vitals.hr).toBe(102);
    });

    it("converges vitals over multiple ticks", () => {
      let s = simulationReducer(state, {
        type: "SET_TARGET_VITALS",
        payload: { spo2: 98 },
      });
      for (let i = 0; i < 20; i++) {
        s = simulationReducer(s, { type: "TICK_VITALS" });
      }
      // After many ticks, should be close to target (rounding limits precision)
      expect(Math.abs(s.vitals.spo2 - 98)).toBeLessThanOrEqual(5);
    });

    it("handles temp lerp with single decimal precision", () => {
      const withTarget = simulationReducer(state, {
        type: "SET_TARGET_VITALS",
        payload: { temp: 37.0 },
      });
      const ticked = simulationReducer(withTarget, { type: "TICK_VITALS" });
      // temp should be rounded to 1 decimal
      const decimals = ticked.vitals.temp.toString().split(".")[1]?.length || 0;
      expect(decimals).toBeLessThanOrEqual(1);
    });
  });

  describe("RECORD_ACTION", () => {
    it("records an action and increments totalActions", () => {
      const result = simulationReducer(state, {
        type: "RECORD_ACTION",
        payload: "administer_oxygen",
      });
      expect(result.actionsTaken).toContain("administer_oxygen");
      expect(result.score.totalActions).toBe(1);
    });

    it("does not duplicate actions", () => {
      let s = simulationReducer(state, {
        type: "RECORD_ACTION",
        payload: "administer_oxygen",
      });
      s = simulationReducer(s, {
        type: "RECORD_ACTION",
        payload: "administer_oxygen",
      });
      expect(
        s.actionsTaken.filter((a) => a === "administer_oxygen"),
      ).toHaveLength(1);
      expect(s.score.totalActions).toBe(1);
    });

    it("tracks timeToAntibiotics on first antibiotics action", () => {
      const started = simulationReducer(state, { type: "START_SIMULATION" });
      const result = simulationReducer(started, {
        type: "RECORD_ACTION",
        payload: "administer_antibiotics",
      });
      expect(result.score.timeToAntibiotics).not.toBeNull();
    });

    it("tracks timeToOxygen on first oxygen action", () => {
      const started = simulationReducer(state, { type: "START_SIMULATION" });
      const result = simulationReducer(started, {
        type: "RECORD_ACTION",
        payload: "administer_oxygen",
      });
      expect(result.score.timeToOxygen).not.toBeNull();
    });

    it("tracks timeToFluids on first fluid action", () => {
      const started = simulationReducer(state, { type: "START_SIMULATION" });
      const result = simulationReducer(started, {
        type: "RECORD_ACTION",
        payload: "fluid_bolus",
      });
      expect(result.score.timeToFluids).not.toBeNull();
    });
  });

  describe("ORDER_LAB", () => {
    it("adds a lab order", () => {
      const result = simulationReducer(state, {
        type: "ORDER_LAB",
        payload: { name: "CBC", result: "WBC 18.5" },
      });
      expect(result.labsOrdered).toHaveLength(1);
      expect(result.labsOrdered[0].name).toBe("CBC");
      expect(result.labsOrdered[0].status).toBe("ordered");
    });

    it("prevents duplicate lab orders by name", () => {
      let s = simulationReducer(state, {
        type: "ORDER_LAB",
        payload: { name: "CBC", result: "WBC 18.5" },
      });
      s = simulationReducer(s, {
        type: "ORDER_LAB",
        payload: { name: "CBC", result: "WBC 18.5" },
      });
      expect(s.labsOrdered).toHaveLength(1);
    });
  });

  describe("ADD_FEEDBACK", () => {
    it("adds feedback and increments communicationErrors on jargon", () => {
      const result = simulationReducer(state, {
        type: "ADD_FEEDBACK",
        payload: { type: "jargon", message: "Jargon detected" },
      });
      expect(result.feedbackLogs).toHaveLength(1);
      expect(result.score.communicationErrors).toBe(1);
    });

    it("does not increment communicationErrors for non-jargon feedback", () => {
      const result = simulationReducer(state, {
        type: "ADD_FEEDBACK",
        payload: { type: "info", message: "Good action" },
      });
      expect(result.feedbackLogs).toHaveLength(1);
      expect(result.score.communicationErrors).toBe(0);
    });
  });

  describe("TRIGGER_DETERIORATION", () => {
    it("marks rule as triggered and updates target vitals", () => {
      const result = simulationReducer(state, {
        type: "TRIGGER_DETERIORATION",
        payload: { ruleId: "no-oxygen", vitalsUpdate: { spo2: 80 } },
      });
      const rule = result.deteriorationRules.find((r) => r.id === "no-oxygen");
      expect(rule?.triggered).toBe(true);
      expect(result.targetVitals.spo2).toBe(80);
    });
  });

  describe("PREVENT_DETERIORATION", () => {
    it("removes startTime from specified rules", () => {
      const result = simulationReducer(state, {
        type: "PREVENT_DETERIORATION",
        payload: { ruleIds: ["no-oxygen"] },
      });
      const rule = result.deteriorationRules.find((r) => r.id === "no-oxygen");
      expect(rule?.startTime).toBeUndefined();
    });
  });

  describe("RESET_SIMULATION", () => {
    it("returns the provided payload state", () => {
      const newState = createInitialState("mi", baseVitals, []);
      const result = simulationReducer(state, {
        type: "RESET_SIMULATION",
        payload: newState,
      });
      expect(result.scenarioId).toBe("mi");
      expect(result).toEqual(newState);
    });
  });
});
