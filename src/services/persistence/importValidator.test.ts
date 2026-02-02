import { describe, it, expect } from "vitest";
import { parseImportedScenario } from "./importValidator";

describe("parseImportedScenario", () => {
  it("parses valid scenario JSON", () => {
    const data = JSON.stringify({
      scenario: { id: "test", name: "Test Scenario" },
      attachments: [],
    });
    const result = parseImportedScenario(data);
    expect(result.scenario).toBeDefined();
    expect(result.scenario.id).toBe("test");
    expect(result.attachments).toEqual([]);
  });

  it("throws on invalid JSON", () => {
    expect(() => parseImportedScenario("{not valid json")).toThrow(
      "Invalid JSON",
    );
  });

  it("throws when scenario field is missing", () => {
    const data = JSON.stringify({ name: "test" });
    expect(() => parseImportedScenario(data)).toThrow(
      'must contain a "scenario" object',
    );
  });

  it("throws when scenario field is null", () => {
    const data = JSON.stringify({ scenario: null });
    expect(() => parseImportedScenario(data)).toThrow(
      'must contain a "scenario" object',
    );
  });

  it("throws when scenario field is a string", () => {
    const data = JSON.stringify({ scenario: "not an object" });
    expect(() => parseImportedScenario(data)).toThrow(
      'must contain a "scenario" object',
    );
  });

  it("handles JSON with optional benchmark field", () => {
    const data = JSON.stringify({
      scenario: { id: "test" },
      benchmark: { expectedActions: [] },
    });
    const result = parseImportedScenario(data);
    expect(result.benchmark).toBeDefined();
  });
});
