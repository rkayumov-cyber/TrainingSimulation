import { describe, it, expect } from "vitest";
import {
  detectJargon,
  hasJargon,
  getJargonSuggestion,
} from "./jargonDetector";

describe("detectJargon", () => {
  it("finds known jargon terms", () => {
    const matches = detectJargon("The patient has tachycardia");
    expect(matches).toHaveLength(1);
    expect(matches[0].term).toBe("tachycardia");
    expect(matches[0].plainEnglish).toBe("fast heart rate");
  });

  it("returns empty array for plain language", () => {
    const matches = detectJargon("The patient has a fast heart rate");
    expect(matches).toHaveLength(0);
  });

  it("finds multiple jargon terms sorted by position", () => {
    const matches = detectJargon(
      "Patient is hypotensive and tachycardic with hypoxia",
    );
    expect(matches.length).toBeGreaterThanOrEqual(3);
    // Should be sorted by position
    for (let i = 1; i < matches.length; i++) {
      expect(matches[i].position).toBeGreaterThanOrEqual(
        matches[i - 1].position,
      );
    }
  });

  it("uses word boundaries to avoid false positives", () => {
    // "iv" should match only as a standalone word
    const matches = detectJargon("give iv fluids");
    const ivMatch = matches.find((m) => m.plainEnglish === "through a vein");
    expect(ivMatch).toBeDefined();

    // Should not match "iv" inside "give" or similar
    const noMatch = detectJargon("the driver was fine");
    const falseIv = noMatch.find((m) => m.plainEnglish === "through a vein");
    expect(falseIv).toBeUndefined();
  });

  it("handles case-insensitive matching", () => {
    const matches = detectJargon("TACHYCARDIA detected");
    expect(matches).toHaveLength(1);
  });

  it("detects medical abbreviations", () => {
    const matches = detectJargon("give meds stat po bid");
    const terms = matches.map((m) => m.plainEnglish);
    expect(terms).toContain("right away");
    expect(terms).toContain("by mouth");
    expect(terms).toContain("twice a day");
  });

  it("detects conditions and procedures", () => {
    expect(detectJargon("suspected sepsis").length).toBeGreaterThan(0);
    expect(detectJargon("need to intubate").length).toBeGreaterThan(0);
    expect(detectJargon("showing cyanosis").length).toBeGreaterThan(0);
  });
});

describe("hasJargon", () => {
  it("returns true when jargon is present", () => {
    expect(hasJargon("patient has tachycardia")).toBe(true);
  });

  it("returns false when no jargon is present", () => {
    expect(hasJargon("the patient is doing well")).toBe(false);
  });
});

describe("getJargonSuggestion", () => {
  it("returns empty string for no matches", () => {
    expect(getJargonSuggestion([])).toBe("");
  });

  it("formats a single jargon match as suggestion", () => {
    const matches = detectJargon("Patient is tachycardic");
    const suggestion = getJargonSuggestion(matches);
    expect(suggestion).toContain("Consider simpler language:");
    expect(suggestion).toContain("tachycardic");
    expect(suggestion).toContain("fast heart rate");
  });

  it("formats multiple matches joined by comma", () => {
    const matches = detectJargon("hypotension with tachycardia");
    const suggestion = getJargonSuggestion(matches);
    expect(suggestion).toContain("Consider simpler language:");
    expect(suggestion).toContain(",");
  });
});
