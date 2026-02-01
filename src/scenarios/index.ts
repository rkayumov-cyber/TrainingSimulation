import type { ScenarioDefinition } from "../types";
import { sepsisScenario } from "./sepsis";
import { miScenario } from "./mi";
import { anaphylaxisScenario } from "./anaphylaxis";
import { asthmaScenario } from "./asthma";
import { strokeScenario } from "./stroke";
import { dkaScenario } from "./dka";
import { traumaScenario } from "./trauma";
import { pedsSeizureScenario } from "./peds-seizure";
import { eclampsiaScenario } from "./eclampsia";
import { cardiacArrestScenario } from "./cardiac-arrest";
import { overdoseScenario } from "./overdose";
import { masterPEScenario } from "./master-pe";

export const scenarios: ScenarioDefinition[] = [
  masterPEScenario,
  sepsisScenario,
  miScenario,
  anaphylaxisScenario,
  asthmaScenario,
  strokeScenario,
  dkaScenario,
  traumaScenario,
  pedsSeizureScenario,
  eclampsiaScenario,
  cardiacArrestScenario,
  overdoseScenario,
];

let customScenarios: ScenarioDefinition[] = [];

export function registerCustomScenarios(customs: ScenarioDefinition[]): void {
  customScenarios = customs;
}

export function getAllScenarios(): ScenarioDefinition[] {
  return [...scenarios, ...customScenarios];
}

export function getScenarioById(id: string): ScenarioDefinition | undefined {
  return getAllScenarios().find((s) => s.id === id);
}

export {
  masterPEScenario,
  sepsisScenario,
  miScenario,
  anaphylaxisScenario,
  asthmaScenario,
  strokeScenario,
  dkaScenario,
  traumaScenario,
  pedsSeizureScenario,
  eclampsiaScenario,
  cardiacArrestScenario,
  overdoseScenario,
};
