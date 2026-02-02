export interface ImportedScenarioData {
  scenario: Record<string, unknown>;
  attachments?: Record<string, unknown>[];
  benchmark?: Record<string, unknown>;
  [key: string]: unknown;
}

export function parseImportedScenario(text: string): ImportedScenarioData {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(
      "Invalid JSON: The file does not contain valid JSON. Please check the file format.",
    );
  }

  if (
    typeof data !== "object" ||
    data === null ||
    !("scenario" in data) ||
    typeof (data as Record<string, unknown>).scenario !== "object" ||
    (data as Record<string, unknown>).scenario === null
  ) {
    throw new Error(
      "Invalid scenario file: The JSON must contain a \"scenario\" object. This file may not be a valid scenario export.",
    );
  }

  return data as ImportedScenarioData;
}
