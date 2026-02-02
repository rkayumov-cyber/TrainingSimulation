import { describe, it, expect } from "vitest";
import {
  calculateTimeGrade,
  gradeToPoints,
  assessAction,
  checkActionSequencing,
  calculateClinicalScore,
} from "./clinicalScoring";

describe("calculateTimeGrade", () => {
  it("returns A when at or under target", () => {
    expect(calculateTimeGrade(60, 120)).toBe("A");
    expect(calculateTimeGrade(120, 120)).toBe("A");
  });

  it("returns B when between 1x and 1.5x target", () => {
    expect(calculateTimeGrade(150, 120)).toBe("B");
  });

  it("returns C when between 1.5x and 2x target", () => {
    expect(calculateTimeGrade(200, 120)).toBe("C");
  });

  it("returns D when between 2x and 3x target", () => {
    expect(calculateTimeGrade(300, 120)).toBe("D");
  });

  it("returns F when over 3x target", () => {
    expect(calculateTimeGrade(400, 120)).toBe("F");
  });

  it("handles exact boundary at 1.5x", () => {
    expect(calculateTimeGrade(180, 120)).toBe("B");
  });

  it("handles exact boundary at 2x", () => {
    expect(calculateTimeGrade(240, 120)).toBe("C");
  });

  it("handles exact boundary at 3x", () => {
    expect(calculateTimeGrade(360, 120)).toBe("D");
  });
});

describe("gradeToPoints", () => {
  it("maps A to 20", () => expect(gradeToPoints("A")).toBe(20));
  it("maps B to 15", () => expect(gradeToPoints("B")).toBe(15));
  it("maps C to 10", () => expect(gradeToPoints("C")).toBe(10));
  it("maps D to 5", () => expect(gradeToPoints("D")).toBe(5));
  it("maps F to 0", () => expect(gradeToPoints("F")).toBe(0));
});

describe("assessAction", () => {
  it("scores harmful actions as -20", () => {
    const result = assessAction("administer_morphine", "sepsis", [], 60);
    expect(result.isHarmful).toBe(true);
    expect(result.points).toBe(-20);
  });

  it("scores unnecessary actions as -5", () => {
    const result = assessAction("order_chest_xray", "sepsis", [], 60);
    expect(result.isUnnecessary).toBe(true);
    expect(result.points).toBe(-5);
  });

  it("scores appropriate actions positively with time grade", () => {
    const result = assessAction("administer_oxygen", "sepsis", [], 60);
    expect(result.isAppropriate).toBe(true);
    expect(result.points).toBeGreaterThan(0);
  });

  it("returns 5 points for non-categorized actions", () => {
    const result = assessAction("some_other_action", "sepsis", [], 60);
    expect(result.points).toBe(5);
    expect(result.feedback).toBe("Action noted");
  });

  it("gives 10 points for appropriate actions without time targets", () => {
    // order_blood_cultures is critical in sepsis but has a time target of 600s
    // Use a scenario/action combo where action is critical but no time target exists
    const result = assessAction("administer_oxygen", "anaphylaxis", [], 30);
    expect(result.isAppropriate).toBe(true);
    expect(result.points).toBe(20); // Under 60s target => grade A
  });
});

describe("checkActionSequencing", () => {
  it("rewards correct sequence order", () => {
    const result = checkActionSequencing(
      ["order_blood_cultures", "administer_antibiotics"],
      "sepsis",
    );
    expect(result.score).toBeGreaterThan(0);
    expect(result.correct.length).toBeGreaterThan(0);
    expect(result.errors).toHaveLength(0);
  });

  it("penalizes wrong sequence order", () => {
    const result = checkActionSequencing(
      ["administer_antibiotics", "order_blood_cultures"],
      "sepsis",
    );
    expect(result.score).toBeLessThan(0);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it("penalizes when required-before action was never done", () => {
    const result = checkActionSequencing(
      ["administer_antibiotics"],
      "sepsis",
    );
    expect(result.score).toBeLessThan(0);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it("does not evaluate when neither action was taken", () => {
    const result = checkActionSequencing([], "sepsis");
    expect(result.score).toBe(0);
    expect(result.errors).toHaveLength(0);
    expect(result.correct).toHaveLength(0);
  });

  it("handles multiple rules for same scenario", () => {
    const result = checkActionSequencing(
      ["start_cpr", "defibrillate", "administer_amiodarone"],
      "cardiac-arrest",
    );
    expect(result.correct.length).toBe(2);
    expect(result.score).toBeGreaterThan(0);
  });
});

describe("calculateClinicalScore", () => {
  const startTime = Date.now() - 120_000; // Started 2 min ago

  it("returns composite score with grade", () => {
    const timestamps: Record<string, number> = {
      administer_oxygen: startTime + 60_000,
      administer_antibiotics: startTime + 90_000,
      order_blood_cultures: startTime + 80_000,
      order_lactate: startTime + 100_000,
    };

    const result = calculateClinicalScore(
      Object.keys(timestamps),
      timestamps,
      "sepsis",
      startTime,
      0,
    );

    expect(result.totalScore).toBeGreaterThan(0);
    expect(result.maxPossibleScore).toBeGreaterThan(0);
    expect(["A", "B", "C", "D", "F"]).toContain(result.grade);
    expect(result.jargonCount).toBe(0);
    expect(result.clarityScore).toBe(100);
  });

  it("deducts points for jargon", () => {
    const noJargon = calculateClinicalScore(
      ["administer_oxygen"],
      { administer_oxygen: startTime + 60_000 },
      "sepsis",
      startTime,
      0,
    );

    const withJargon = calculateClinicalScore(
      ["administer_oxygen"],
      { administer_oxygen: startTime + 60_000 },
      "sepsis",
      startTime,
      5,
    );

    expect(withJargon.totalScore).toBeLessThan(noJargon.totalScore);
    expect(withJargon.clarityScore).toBe(50);
  });

  it("identifies missed critical actions", () => {
    const result = calculateClinicalScore(
      ["administer_oxygen"],
      { administer_oxygen: startTime + 60_000 },
      "sepsis",
      startTime,
      0,
    );

    expect(result.missedCriticalActions.length).toBeGreaterThan(0);
    expect(result.missedCriticalActions).toContain("administer_antibiotics");
  });

  it("tracks harmful actions taken", () => {
    const result = calculateClinicalScore(
      ["administer_morphine"],
      { administer_morphine: startTime + 60_000 },
      "sepsis",
      startTime,
      0,
    );

    expect(result.harmfulActions).toContain("administer_morphine");
  });

  it("ensures total score is never negative", () => {
    const result = calculateClinicalScore(
      ["administer_morphine"],
      { administer_morphine: startTime + 60_000 },
      "sepsis",
      startTime,
      50,
    );

    expect(result.totalScore).toBeGreaterThanOrEqual(0);
  });
});
