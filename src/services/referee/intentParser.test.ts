import { describe, it, expect } from "vitest";
import { parseIntent, parseAllIntents, KNOWN_ACTIONS } from "./intentParser";

describe("parseIntent", () => {
  it("returns null for non-medical input", () => {
    expect(parseIntent("hello how are you")).toBeNull();
    expect(parseIntent("the weather is nice today")).toBeNull();
    expect(parseIntent("")).toBeNull();
  });

  // Oxygen
  it("recognizes oxygen administration", () => {
    expect(parseIntent("give oxygen")?.action).toBe("administer_oxygen");
    expect(parseIntent("start nasal cannula")?.action).toBe(
      "administer_oxygen",
    );
    expect(parseIntent("apply non-rebreather")?.action).toBe(
      "administer_oxygen",
    );
    expect(parseIntent("put on o2")?.action).toBe("administer_oxygen");
  });

  // Fluids
  it("recognizes fluid administration", () => {
    expect(parseIntent("give saline")?.action).toBe("fluid_bolus");
    expect(parseIntent("start 500ml normal saline")?.action).toBe(
      "fluid_bolus",
    );
    expect(parseIntent("fluid bolus")?.action).toBe("fluid_bolus");
    expect(parseIntent("iv access")?.action).toBe("fluid_bolus");
  });

  // Antibiotics
  it("recognizes antibiotics", () => {
    expect(parseIntent("give antibiotics")?.action).toBe(
      "administer_antibiotics",
    );
    expect(parseIntent("start ceftriaxone")?.action).toBe(
      "administer_antibiotics",
    );
    expect(parseIntent("order broad-spectrum antibiotics")?.action).toBe(
      "administer_antibiotics",
    );
  });

  // Labs
  it("recognizes lab orders", () => {
    expect(parseIntent("order blood cultures")?.action).toBe(
      "order_blood_cultures",
    );
    expect(parseIntent("get a lactate")?.action).toBe("order_lactate");
    expect(parseIntent("order cbc")?.action).toBe("order_cbc");
    expect(parseIntent("send a bmp")?.action).toBe("order_bmp");
    expect(parseIntent("order urinalysis")?.action).toBe("order_urinalysis");
    expect(parseIntent("order chest x-ray")?.action).toBe("order_chest_xray");
    expect(parseIntent("get an ecg")?.action).toBe("order_ecg");
  });

  // Physical exams
  it("recognizes physical examinations", () => {
    expect(parseIntent("listen to heart sounds")?.action).toBe(
      "check_heart_sounds",
    );
    expect(parseIntent("auscultate lung sounds")?.action).toBe(
      "check_lung_sounds",
    );
    expect(parseIntent("palpate the abdomen")?.action).toBe("check_abdomen");
    expect(parseIntent("check pupils")?.action).toBe("check_pupils");
    expect(parseIntent("check vitals")?.action).toBe("check_vitals");
  });

  // MI-specific
  it("recognizes MI-specific actions", () => {
    expect(parseIntent("give aspirin")?.action).toBe("give_aspirin");
    expect(parseIntent("give nitroglycerin")?.action).toBe("give_nitro");
    expect(parseIntent("give morphine")?.action).toBe("give_morphine");
    expect(parseIntent("order troponin")?.action).toBe("order_troponin");
  });

  // Anaphylaxis
  it("recognizes anaphylaxis actions", () => {
    expect(parseIntent("give epinephrine")?.action).toBe("give_epinephrine");
    expect(parseIntent("give antihistamine")?.action).toBe(
      "give_antihistamine",
    );
    expect(parseIntent("give hydrocortisone")?.action).toBe("give_steroids");
    expect(parseIntent("check airway")?.action).toBe("check_airway");
  });

  // Stroke
  it("recognizes stroke actions", () => {
    expect(parseIntent("order ct head")?.action).toBe("order_ct_head");
    expect(parseIntent("check nihss")?.action).toBe("check_nihss");
    expect(parseIntent("give tpa")?.action).toBe("administer_tpa");
    expect(parseIntent("give labetalol")?.action).toBe(
      "administer_labetalol",
    );
  });

  // DKA
  it("recognizes DKA actions", () => {
    expect(parseIntent("check blood glucose")?.action).toBe(
      "check_blood_glucose",
    );
    expect(parseIntent("start insulin drip")?.action).toBe(
      "start_insulin_drip",
    );
    expect(parseIntent("check urine ketones")?.action).toBe(
      "check_urine_ketones",
    );
  });

  // Trauma
  it("recognizes trauma actions", () => {
    expect(parseIntent("do a fast scan")?.action).toBe("order_fast_scan");
    expect(parseIntent("check gcs")?.action).toBe("check_gcs");
    expect(parseIntent("insert chest drain")?.action).toBe(
      "insert_chest_drain",
    );
    expect(parseIntent("order blood type and crossmatch")?.action).toBe(
      "order_blood_type_crossmatch",
    );
  });

  // Cardiac arrest
  it("recognizes cardiac arrest actions", () => {
    expect(parseIntent("start cpr")?.action).toBe("start_cpr");
    expect(parseIntent("defibrillate")?.action).toBe("defibrillate");
    expect(parseIntent("bag valve mask")?.action).toBe("bag_valve_mask");
    expect(parseIntent("give amiodarone")?.action).toBe(
      "administer_amiodarone",
    );
    expect(parseIntent("check rhythm")?.action).toBe("check_rhythm");
  });

  // Overdose
  it("recognizes overdose actions", () => {
    expect(parseIntent("give naloxone")?.action).toBe("administer_naloxone");
    expect(parseIntent("narcan")?.action).toBe("administer_naloxone");
    expect(parseIntent("order tox screen")?.action).toBe(
      "order_toxicology_screen",
    );
  });

  // Dengue / myocarditis
  it("recognizes dengue/myocarditis actions", () => {
    expect(parseIntent("order cardiac mri")?.action).toBe(
      "order_cardiac_mri",
    );
    expect(parseIntent("order dengue serology")?.action).toBe(
      "order_dengue_serology",
    );
    expect(parseIntent("give colchicine")?.action).toBe(
      "administer_colchicine",
    );
    expect(parseIntent("consult cardiology")?.action).toBe(
      "consult_cardiology",
    );
  });

  it("preserves raw input text", () => {
    const result = parseIntent("Give Oxygen Please");
    expect(result?.raw).toBe("Give Oxygen Please");
  });
});

describe("parseAllIntents", () => {
  it("returns multiple intents from compound instructions", () => {
    const intents = parseAllIntents(
      "give oxygen and order blood cultures and start antibiotics",
    );
    const actions = intents.map((i) => i.action);
    expect(actions).toContain("administer_oxygen");
    expect(actions).toContain("order_blood_cultures");
    expect(actions).toContain("administer_antibiotics");
  });

  it("deduplicates by action", () => {
    const intents = parseAllIntents(
      "give oxygen, start nasal cannula, apply o2",
    );
    const oxygenIntents = intents.filter(
      (i) => i.action === "administer_oxygen",
    );
    expect(oxygenIntents).toHaveLength(1);
  });

  it("returns empty array for non-medical input", () => {
    expect(parseAllIntents("hello")).toEqual([]);
  });
});

describe("KNOWN_ACTIONS", () => {
  it("is a non-empty array", () => {
    expect(KNOWN_ACTIONS.length).toBeGreaterThan(0);
  });

  it("has no duplicates", () => {
    const unique = new Set(KNOWN_ACTIONS);
    expect(unique.size).toBe(KNOWN_ACTIONS.length);
  });

  it("contains expected actions", () => {
    expect(KNOWN_ACTIONS).toContain("administer_oxygen");
    expect(KNOWN_ACTIONS).toContain("fluid_bolus");
    expect(KNOWN_ACTIONS).toContain("administer_antibiotics");
  });
});
