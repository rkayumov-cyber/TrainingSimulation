import { describe, it, expect } from "vitest";
import {
  checkDeteriorationRules,
  initializeRuleTimers,
  getRuleProgress,
} from "./deteriorationManager";
import type { DeteriorationRule } from "../../types";

function makeRule(overrides: Partial<DeteriorationRule> = {}): DeteriorationRule {
  return {
    id: "no-oxygen",
    condition: "Hypoxia worsening",
    timerMinutes: 3,
    effect: { spo2: 80 },
    preventedBy: ["administer_oxygen"],
    triggered: false,
    startTime: Date.now(),
    ...overrides,
  };
}

describe("checkDeteriorationRules", () => {
  it("triggers rule when timer expires", () => {
    const startTime = Date.now() - 4 * 60 * 1000; // 4 minutes ago
    const rules = [makeRule({ startTime })];
    const checks = checkDeteriorationRules(rules, [], Date.now());
    expect(checks).toHaveLength(1);
    expect(checks[0].shouldTrigger).toBe(true);
    expect(checks[0].ruleId).toBe("no-oxygen");
    expect(checks[0].vitalsUpdate).toEqual({ spo2: 80 });
  });

  it("does not trigger before timer expires", () => {
    const startTime = Date.now() - 1 * 60 * 1000; // 1 minute ago (need 3)
    const rules = [makeRule({ startTime })];
    const checks = checkDeteriorationRules(rules, [], Date.now());
    expect(checks).toHaveLength(0);
  });

  it("prevents rule when correct action taken", () => {
    const startTime = Date.now() - 10 * 60 * 1000; // 10 minutes ago
    const rules = [makeRule({ startTime })];
    const checks = checkDeteriorationRules(
      rules,
      ["administer_oxygen"],
      Date.now(),
    );
    expect(checks).toHaveLength(0);
  });

  it("skips already triggered rules", () => {
    const startTime = Date.now() - 10 * 60 * 1000;
    const rules = [makeRule({ startTime, triggered: true })];
    const checks = checkDeteriorationRules(rules, [], Date.now());
    expect(checks).toHaveLength(0);
  });

  it("skips rules without startTime", () => {
    const rules = [makeRule({ startTime: undefined })];
    const checks = checkDeteriorationRules(rules, [], Date.now());
    expect(checks).toHaveLength(0);
  });

  it("handles multiple rules independently", () => {
    const old = Date.now() - 10 * 60 * 1000;
    const rules = [
      makeRule({ id: "no-oxygen", startTime: old, timerMinutes: 3 }),
      makeRule({
        id: "no-fluids",
        startTime: old,
        timerMinutes: 5,
        preventedBy: ["fluid_bolus"],
        effect: { bpSystolic: 60 },
        condition: "Hypotension worsening",
      }),
    ];
    const checks = checkDeteriorationRules(
      rules,
      ["administer_oxygen"],
      Date.now(),
    );
    // Only no-fluids should trigger (no-oxygen prevented)
    expect(checks).toHaveLength(1);
    expect(checks[0].ruleId).toBe("no-fluids");
  });
});

describe("initializeRuleTimers", () => {
  it("adds triggered=false and startTime to rules", () => {
    const rawRules = [
      {
        id: "no-oxygen",
        condition: "Hypoxia",
        timerMinutes: 3,
        effect: { spo2: 80 },
        preventedBy: ["administer_oxygen"],
      },
    ];
    const startTime = 1000000;
    const initialized = initializeRuleTimers(rawRules, startTime);
    expect(initialized).toHaveLength(1);
    expect(initialized[0].triggered).toBe(false);
    expect(initialized[0].startTime).toBe(startTime);
  });
});

describe("getRuleProgress", () => {
  it("returns 100% for triggered rule", () => {
    const rule = makeRule({ triggered: true });
    const result = getRuleProgress(rule, Date.now(), []);
    expect(result.progress).toBe(100);
    expect(result.isTriggered).toBe(true);
    expect(result.isPrevented).toBe(false);
  });

  it("returns 0% for prevented rule", () => {
    const rule = makeRule();
    const result = getRuleProgress(rule, Date.now(), ["administer_oxygen"]);
    expect(result.progress).toBe(0);
    expect(result.isPrevented).toBe(true);
    expect(result.isTriggered).toBe(false);
  });

  it("returns 0% for rule without startTime", () => {
    const rule = makeRule({ startTime: undefined });
    const result = getRuleProgress(rule, Date.now(), []);
    expect(result.progress).toBe(0);
  });

  it("calculates 50% progress at half timer", () => {
    const startTime = Date.now() - 1.5 * 60 * 1000; // 1.5 min ago, 3 min timer
    const rule = makeRule({ startTime });
    const result = getRuleProgress(rule, Date.now(), []);
    expect(result.progress).toBeCloseTo(50, 0);
  });

  it("caps progress at 100%", () => {
    const startTime = Date.now() - 10 * 60 * 1000; // 10 min ago, 3 min timer
    const rule = makeRule({ startTime });
    const result = getRuleProgress(rule, Date.now(), []);
    expect(result.progress).toBe(100);
  });
});
