import type {
  MedicalIntent,
  SimulationState,
  Vitals,
  ClinicalEvent,
  LabOrder,
} from "../../types";
import { v4 as uuidv4 } from "uuid";

export interface StateUpdate {
  vitalsUpdate?: Partial<Vitals>;
  newEvents?: ClinicalEvent[];
  labOrder?: Omit<LabOrder, "id" | "orderedAt" | "status">;
  actionRecorded?: string;
  preventsDeteriorationRules?: string[];
}

export function processIntent(
  intent: MedicalIntent,
  currentState: SimulationState,
  labResults: Record<string, string>,
): StateUpdate {
  const now = Date.now();
  const update: StateUpdate = {};

  switch (intent.action) {
    case "administer_oxygen":
      update.vitalsUpdate = {
        spo2: Math.min(98, currentState.vitals.spo2 + 5),
      };
      update.newEvents = [
        {
          id: uuidv4(),
          type: "action",
          description: "Oxygen therapy initiated",
          timestamp: now,
        },
      ];
      update.actionRecorded = "administer_oxygen";
      update.preventsDeteriorationRules = ["no-oxygen"];
      break;

    case "fluid_bolus":
      update.vitalsUpdate = {
        bpSystolic: Math.min(120, currentState.vitals.bpSystolic + 10),
        bpDiastolic: Math.min(80, currentState.vitals.bpDiastolic + 5),
        hr: Math.max(80, currentState.vitals.hr - 5),
      };
      update.newEvents = [
        {
          id: uuidv4(),
          type: "action",
          description: "IV fluid bolus administered",
          timestamp: now,
        },
      ];
      update.actionRecorded = "fluid_bolus";
      update.preventsDeteriorationRules = ["no-fluids"];
      break;

    case "administer_antibiotics":
      update.newEvents = [
        {
          id: uuidv4(),
          type: "action",
          description: "Broad-spectrum antibiotics administered",
          timestamp: now,
        },
      ];
      update.actionRecorded = "administer_antibiotics";
      update.preventsDeteriorationRules = ["no-antibiotics"];
      break;

    case "order_blood_cultures":
      update.labOrder = {
        name: "Blood Cultures",
        result: labResults.blood_cultures,
      };
      update.newEvents = [
        {
          id: uuidv4(),
          type: "action",
          description: "Blood cultures ordered",
          timestamp: now,
        },
      ];
      update.actionRecorded = "order_blood_cultures";
      break;

    case "order_lactate":
      update.labOrder = {
        name: "Lactate",
        result: labResults.lactate,
      };
      update.newEvents = [
        {
          id: uuidv4(),
          type: "action",
          description: "Lactate level ordered",
          timestamp: now,
        },
      ];
      update.actionRecorded = "order_lactate";
      break;

    case "order_cbc":
      update.labOrder = {
        name: "CBC",
        result: labResults.cbc,
      };
      update.newEvents = [
        {
          id: uuidv4(),
          type: "action",
          description: "CBC ordered",
          timestamp: now,
        },
      ];
      update.actionRecorded = "order_cbc";
      break;

    case "order_bmp":
      update.labOrder = {
        name: "BMP",
        result: labResults.bmp,
      };
      update.newEvents = [
        {
          id: uuidv4(),
          type: "action",
          description: "Basic metabolic panel ordered",
          timestamp: now,
        },
      ];
      update.actionRecorded = "order_bmp";
      break;

    case "order_urinalysis":
      update.labOrder = {
        name: "Urinalysis",
        result: labResults.urinalysis,
      };
      update.newEvents = [
        {
          id: uuidv4(),
          type: "action",
          description: "Urinalysis ordered",
          timestamp: now,
        },
      ];
      update.actionRecorded = "order_urinalysis";
      break;

    case "order_chest_xray":
      update.labOrder = {
        name: "Chest X-Ray",
        result: labResults.chest_xray,
      };
      update.newEvents = [
        {
          id: uuidv4(),
          type: "action",
          description: "Chest X-ray ordered",
          timestamp: now,
        },
      ];
      update.actionRecorded = "order_chest_xray";
      break;

    case "order_ecg":
      update.labOrder = {
        name: "ECG",
        result: labResults.ecg,
      };
      update.newEvents = [
        {
          id: uuidv4(),
          type: "action",
          description: "ECG ordered",
          timestamp: now,
        },
      ];
      update.actionRecorded = "order_ecg";
      break;

    case "check_heart_sounds":
      update.newEvents = [
        {
          id: uuidv4(),
          type: "action",
          description: "Heart sounds auscultated: Regular rhythm, no murmurs",
          timestamp: now,
        },
      ];
      update.actionRecorded = "check_heart_sounds";
      break;

    case "check_lung_sounds":
      update.newEvents = [
        {
          id: uuidv4(),
          type: "action",
          description:
            "Lung sounds auscultated: Decreased breath sounds at bases bilaterally",
          timestamp: now,
        },
      ];
      update.actionRecorded = "check_lung_sounds";
      break;

    case "check_abdomen":
      update.newEvents = [
        {
          id: uuidv4(),
          type: "action",
          description: "Abdomen examined: Soft, mild suprapubic tenderness",
          timestamp: now,
        },
      ];
      update.actionRecorded = "check_abdomen";
      break;

    case "check_pupils":
      update.newEvents = [
        {
          id: uuidv4(),
          type: "action",
          description: "Pupils examined: Equal and reactive to light",
          timestamp: now,
        },
      ];
      update.actionRecorded = "check_pupils";
      break;

    case "check_vitals":
      update.newEvents = [
        {
          id: uuidv4(),
          type: "action",
          description: "Vital signs reviewed",
          timestamp: now,
        },
      ];
      update.actionRecorded = "check_vitals";
      break;

    case "establish_iv_access":
      update.newEvents = [
        {
          id: uuidv4(),
          type: "action",
          description: "IV access established",
          timestamp: now,
        },
      ];
      update.actionRecorded = "establish_iv_access";
      break;

    case "give_antipyretic":
      update.vitalsUpdate = {
        temp: Math.max(37.5, currentState.vitals.temp - 0.5),
      };
      update.newEvents = [
        {
          id: uuidv4(),
          type: "action",
          description: "Antipyretic administered",
          timestamp: now,
        },
      ];
      update.actionRecorded = "give_antipyretic";
      break;

    case "start_vasopressors":
      update.vitalsUpdate = {
        bpSystolic: Math.min(110, currentState.vitals.bpSystolic + 15),
        bpDiastolic: Math.min(70, currentState.vitals.bpDiastolic + 10),
      };
      update.newEvents = [
        {
          id: uuidv4(),
          type: "action",
          description: "Vasopressor infusion started",
          timestamp: now,
        },
      ];
      update.actionRecorded = "start_vasopressors";
      break;

    // MI-specific actions
    case "give_aspirin":
      update.newEvents = [
        {
          id: uuidv4(),
          type: "action",
          description: "Aspirin 300mg administered",
          timestamp: now,
        },
      ];
      update.actionRecorded = "give_aspirin";
      update.preventsDeteriorationRules = ["no-aspirin"];
      break;

    case "give_nitro":
      update.vitalsUpdate = {
        bpSystolic: Math.max(90, currentState.vitals.bpSystolic - 15),
        bpDiastolic: Math.max(60, currentState.vitals.bpDiastolic - 10),
      };
      update.newEvents = [
        {
          id: uuidv4(),
          type: "action",
          description: "Nitroglycerin administered sublingually",
          timestamp: now,
        },
      ];
      update.actionRecorded = "give_nitro";
      update.preventsDeteriorationRules = ["no-nitro"];
      break;

    case "give_morphine":
      update.vitalsUpdate = {
        hr: Math.max(70, currentState.vitals.hr - 10),
        respRate: Math.max(14, currentState.vitals.respRate - 2),
      };
      update.newEvents = [
        {
          id: uuidv4(),
          type: "action",
          description: "Morphine 2-4mg IV administered for pain",
          timestamp: now,
        },
      ];
      update.actionRecorded = "give_morphine";
      break;

    case "order_troponin":
      update.labOrder = {
        name: "Troponin",
        result: labResults.troponin || "Troponin I: Pending",
      };
      update.newEvents = [
        {
          id: uuidv4(),
          type: "action",
          description: "Cardiac troponin ordered",
          timestamp: now,
        },
      ];
      update.actionRecorded = "order_troponin";
      break;

    // Anaphylaxis-specific actions
    case "give_epinephrine":
      update.vitalsUpdate = {
        bpSystolic: Math.min(110, currentState.vitals.bpSystolic + 25),
        bpDiastolic: Math.min(70, currentState.vitals.bpDiastolic + 15),
        hr: Math.min(120, currentState.vitals.hr + 15),
        spo2: Math.min(96, currentState.vitals.spo2 + 6),
      };
      update.newEvents = [
        {
          id: uuidv4(),
          type: "action",
          description: "Epinephrine 0.5mg IM administered",
          timestamp: now,
        },
      ];
      update.actionRecorded = "give_epinephrine";
      update.preventsDeteriorationRules = ["no-epi"];
      break;

    case "give_antihistamine":
      update.newEvents = [
        {
          id: uuidv4(),
          type: "action",
          description: "Antihistamine (diphenhydramine) administered",
          timestamp: now,
        },
      ];
      update.actionRecorded = "give_antihistamine";
      break;

    case "give_steroids":
      update.newEvents = [
        {
          id: uuidv4(),
          type: "action",
          description: "IV corticosteroids administered",
          timestamp: now,
        },
      ];
      update.actionRecorded = "give_steroids";
      update.preventsDeteriorationRules = ["no-steroids-asthma"];
      break;

    case "check_airway":
      update.newEvents = [
        {
          id: uuidv4(),
          type: "action",
          description: "Airway assessed: Patent but with audible stridor",
          timestamp: now,
        },
      ];
      update.actionRecorded = "check_airway";
      break;

    // Asthma-specific actions
    case "give_salbutamol":
      update.vitalsUpdate = {
        spo2: Math.min(96, currentState.vitals.spo2 + 4),
        respRate: Math.max(18, currentState.vitals.respRate - 4),
        hr: Math.min(130, currentState.vitals.hr + 10), // Tachycardia as side effect
      };
      update.newEvents = [
        {
          id: uuidv4(),
          type: "action",
          description: "Salbutamol nebulizer administered",
          timestamp: now,
        },
      ];
      update.actionRecorded = "give_salbutamol";
      update.preventsDeteriorationRules = ["no-bronchodilator"];
      break;

    case "give_ipratropium":
      update.vitalsUpdate = {
        respRate: Math.max(16, currentState.vitals.respRate - 2),
      };
      update.newEvents = [
        {
          id: uuidv4(),
          type: "action",
          description: "Ipratropium bromide nebulizer administered",
          timestamp: now,
        },
      ];
      update.actionRecorded = "give_ipratropium";
      break;

    case "check_peak_flow":
      update.labOrder = {
        name: "Peak Flow",
        result: labResults.peak_flow || "Peak flow: Assessment pending",
      };
      update.newEvents = [
        {
          id: uuidv4(),
          type: "action",
          description: "Peak flow measurement obtained",
          timestamp: now,
        },
      ];
      update.actionRecorded = "check_peak_flow";
      break;

    case "order_abg":
      update.labOrder = {
        name: "ABG",
        result: labResults.abg || "Arterial blood gas: Pending",
      };
      update.newEvents = [
        {
          id: uuidv4(),
          type: "action",
          description: "Arterial blood gas ordered",
          timestamp: now,
        },
      ];
      update.actionRecorded = "order_abg";
      break;

    // ==========================================
    // Stroke-specific actions
    // ==========================================
    case "order_ct_head":
      update.labOrder = {
        name: "CT Head",
        result: labResults.ct_head || "CT Head: Pending",
      };
      update.newEvents = [
        {
          id: uuidv4(),
          type: "action",
          description: "CT head ordered (urgent)",
          timestamp: now,
        },
      ];
      update.actionRecorded = "order_ct_head";
      update.preventsDeteriorationRules = ["no-ct-head"];
      break;

    case "order_ct_angio":
      update.labOrder = {
        name: "CT Angiography",
        result: labResults.ct_angio || "CT Angiography: Pending",
      };
      update.newEvents = [
        {
          id: uuidv4(),
          type: "action",
          description: "CT angiography ordered",
          timestamp: now,
        },
      ];
      update.actionRecorded = "order_ct_angio";
      update.preventsDeteriorationRules = ["no-ct-head"];
      break;

    case "check_nihss":
      update.labOrder = {
        name: "NIHSS",
        result: labResults.nihss || "NIHSS assessment: Pending",
      };
      update.newEvents = [
        {
          id: uuidv4(),
          type: "action",
          description: "NIH Stroke Scale assessment performed",
          timestamp: now,
        },
      ];
      update.actionRecorded = "check_nihss";
      break;

    case "administer_tpa":
      update.newEvents = [
        {
          id: uuidv4(),
          type: "action",
          description: "tPA (alteplase) thrombolysis initiated",
          timestamp: now,
        },
      ];
      update.actionRecorded = "administer_tpa";
      update.preventsDeteriorationRules = ["no-tpa"];
      break;

    case "administer_labetalol":
      update.vitalsUpdate = {
        bpSystolic: Math.max(140, currentState.vitals.bpSystolic - 25),
        bpDiastolic: Math.max(85, currentState.vitals.bpDiastolic - 15),
        hr: Math.max(60, currentState.vitals.hr - 8),
      };
      update.newEvents = [
        {
          id: uuidv4(),
          type: "action",
          description: "Labetalol IV administered for blood pressure control",
          timestamp: now,
        },
      ];
      update.actionRecorded = "administer_labetalol";
      update.preventsDeteriorationRules = [
        "no-bp-control",
        "no-bp-control-eclampsia",
      ];
      break;

    case "administer_nicardipine":
      update.vitalsUpdate = {
        bpSystolic: Math.max(140, currentState.vitals.bpSystolic - 20),
        bpDiastolic: Math.max(85, currentState.vitals.bpDiastolic - 12),
      };
      update.newEvents = [
        {
          id: uuidv4(),
          type: "action",
          description:
            "Nicardipine infusion started for blood pressure control",
          timestamp: now,
        },
      ];
      update.actionRecorded = "administer_nicardipine";
      update.preventsDeteriorationRules = [
        "no-bp-control",
        "no-bp-control-eclampsia",
      ];
      break;

    case "order_coagulation":
      update.labOrder = {
        name: "Coagulation Panel",
        result: labResults.coagulation || "Coagulation panel: Pending",
      };
      update.newEvents = [
        {
          id: uuidv4(),
          type: "action",
          description: "Coagulation panel ordered (PT/INR/aPTT)",
          timestamp: now,
        },
      ];
      update.actionRecorded = "order_coagulation";
      break;

    // ==========================================
    // DKA-specific actions
    // ==========================================
    case "check_blood_glucose":
      update.labOrder = {
        name: "Blood Glucose",
        result: labResults.blood_glucose || "Blood glucose: Pending",
      };
      update.newEvents = [
        {
          id: uuidv4(),
          type: "action",
          description: "Blood glucose level checked",
          timestamp: now,
        },
      ];
      update.actionRecorded = "check_blood_glucose";
      update.preventsDeteriorationRules = [
        "no-potassium-check",
        "no-glucose-check",
      ];
      break;

    case "start_insulin_drip":
      update.newEvents = [
        {
          id: uuidv4(),
          type: "action",
          description: "Fixed-rate insulin infusion started (0.1 units/kg/hr)",
          timestamp: now,
        },
      ];
      update.actionRecorded = "start_insulin_drip";
      update.preventsDeteriorationRules = ["no-insulin"];
      break;

    case "check_urine_ketones":
      update.labOrder = {
        name: "Urine Ketones",
        result: labResults.urine_ketones || "Urine ketones: Pending",
      };
      update.newEvents = [
        {
          id: uuidv4(),
          type: "action",
          description: "Urine ketones tested",
          timestamp: now,
        },
      ];
      update.actionRecorded = "check_urine_ketones";
      break;

    case "order_liver_enzymes":
      update.labOrder = {
        name: "Liver Enzymes",
        result: labResults.liver_enzymes || "Liver function tests: Pending",
      };
      update.newEvents = [
        {
          id: uuidv4(),
          type: "action",
          description: "Liver enzymes ordered (AST/ALT/ALP)",
          timestamp: now,
        },
      ];
      update.actionRecorded = "order_liver_enzymes";
      break;

    // ==========================================
    // Trauma-specific actions
    // ==========================================
    case "order_fast_scan":
      update.labOrder = {
        name: "FAST Scan",
        result: labResults.fast_scan || "FAST ultrasound: Pending",
      };
      update.newEvents = [
        {
          id: uuidv4(),
          type: "action",
          description: "FAST (Focused Assessment with Sonography) performed",
          timestamp: now,
        },
      ];
      update.actionRecorded = "order_fast_scan";
      update.preventsDeteriorationRules = ["no-fast-scan"];
      break;

    case "check_gcs":
      update.labOrder = {
        name: "GCS",
        result: labResults.gcs || "Glasgow Coma Scale: Assessment pending",
      };
      update.newEvents = [
        {
          id: uuidv4(),
          type: "action",
          description: "Glasgow Coma Scale assessed",
          timestamp: now,
        },
      ];
      update.actionRecorded = "check_gcs";
      break;

    case "insert_chest_drain":
      update.vitalsUpdate = {
        spo2: Math.min(96, currentState.vitals.spo2 + 8),
        respRate: Math.max(18, currentState.vitals.respRate - 6),
      };
      update.newEvents = [
        {
          id: uuidv4(),
          type: "action",
          description:
            "Chest drain (intercostal tube) inserted — air rushing out",
          timestamp: now,
        },
      ];
      update.actionRecorded = "insert_chest_drain";
      update.preventsDeteriorationRules = ["no-chest-intervention"];
      break;

    case "order_blood_type_crossmatch":
      update.labOrder = {
        name: "Blood Type & Crossmatch",
        result:
          labResults.blood_type_crossmatch ||
          "Blood type & crossmatch: Pending",
      };
      update.newEvents = [
        {
          id: uuidv4(),
          type: "action",
          description: "Blood type and crossmatch ordered (4 units pRBC)",
          timestamp: now,
        },
      ];
      update.actionRecorded = "order_blood_type_crossmatch";
      update.preventsDeteriorationRules = ["no-fluids-trauma"];
      break;

    case "order_pelvis_xray":
      update.labOrder = {
        name: "Pelvis X-Ray",
        result: labResults.pelvis_xray || "Pelvis X-ray: Pending",
      };
      update.newEvents = [
        {
          id: uuidv4(),
          type: "action",
          description: "Pelvis X-ray ordered",
          timestamp: now,
        },
      ];
      update.actionRecorded = "order_pelvis_xray";
      break;

    // ==========================================
    // Pediatric seizure actions
    // ==========================================
    case "administer_diazepam":
      update.vitalsUpdate = {
        hr: Math.max(120, currentState.vitals.hr - 20),
        respRate: Math.max(20, currentState.vitals.respRate - 6),
      };
      update.newEvents = [
        {
          id: uuidv4(),
          type: "action",
          description:
            "Benzodiazepine administered — seizure activity reducing",
          timestamp: now,
        },
      ];
      update.actionRecorded = "administer_diazepam";
      update.preventsDeteriorationRules = ["no-benzo"];
      break;

    // ==========================================
    // Eclampsia-specific actions
    // ==========================================
    case "administer_magnesium":
      update.vitalsUpdate = {
        bpSystolic: Math.max(150, currentState.vitals.bpSystolic - 15),
        bpDiastolic: Math.max(95, currentState.vitals.bpDiastolic - 10),
      };
      update.newEvents = [
        {
          id: uuidv4(),
          type: "action",
          description: "Magnesium sulfate loading dose administered (4g IV)",
          timestamp: now,
        },
      ];
      update.actionRecorded = "administer_magnesium";
      update.preventsDeteriorationRules = ["no-magnesium"];
      break;

    case "check_proteinuria":
      update.labOrder = {
        name: "Urine Protein",
        result: labResults.proteinuria || "Urine protein: Pending",
      };
      update.newEvents = [
        {
          id: uuidv4(),
          type: "action",
          description: "Urine protein dipstick performed",
          timestamp: now,
        },
      ];
      update.actionRecorded = "check_proteinuria";
      break;

    case "check_fetal_heart":
      update.labOrder = {
        name: "Fetal Heart Rate",
        result:
          labResults.fetal_heart || "Fetal heart rate: Assessment pending",
      };
      update.newEvents = [
        {
          id: uuidv4(),
          type: "action",
          description: "Fetal heart rate monitored via CTG",
          timestamp: now,
        },
      ];
      update.actionRecorded = "check_fetal_heart";
      update.preventsDeteriorationRules = ["no-fetal-monitoring"];
      break;

    case "prepare_for_delivery":
      update.newEvents = [
        {
          id: uuidv4(),
          type: "action",
          description:
            "Preparations for emergency delivery initiated — obstetrics and NICU alerted",
          timestamp: now,
        },
      ];
      update.actionRecorded = "prepare_for_delivery";
      break;

    // ==========================================
    // Cardiac arrest (ACLS) actions
    // ==========================================
    case "start_cpr":
      update.vitalsUpdate = {
        bpSystolic: Math.min(60, currentState.vitals.bpSystolic + 40),
        bpDiastolic: Math.min(30, currentState.vitals.bpDiastolic + 20),
      };
      update.newEvents = [
        {
          id: uuidv4(),
          type: "action",
          description:
            "CPR initiated — high-quality chest compressions started",
          timestamp: now,
        },
      ];
      update.actionRecorded = "start_cpr";
      update.preventsDeteriorationRules = ["no-cpr"];
      break;

    case "defibrillate":
      update.vitalsUpdate = {
        hr: 45,
        bpSystolic: Math.min(85, currentState.vitals.bpSystolic + 60),
        bpDiastolic: Math.min(55, currentState.vitals.bpDiastolic + 35),
        spo2: Math.min(88, currentState.vitals.spo2 + 50),
      };
      update.newEvents = [
        {
          id: uuidv4(),
          type: "action",
          description: "Defibrillation delivered — 200J biphasic shock",
          timestamp: now,
        },
      ];
      update.actionRecorded = "defibrillate";
      update.preventsDeteriorationRules = ["no-defib"];
      break;

    case "bag_valve_mask":
      update.vitalsUpdate = {
        spo2: Math.min(94, currentState.vitals.spo2 + 15),
        respRate: 12,
      };
      update.newEvents = [
        {
          id: uuidv4(),
          type: "action",
          description: "Bag-valve-mask ventilation initiated",
          timestamp: now,
        },
      ];
      update.actionRecorded = "bag_valve_mask";
      update.preventsDeteriorationRules = [
        "no-airway-management",
        "no-airway-od",
      ];
      break;

    case "administer_amiodarone":
      update.newEvents = [
        {
          id: uuidv4(),
          type: "action",
          description: "Amiodarone 300mg IV bolus administered",
          timestamp: now,
        },
      ];
      update.actionRecorded = "administer_amiodarone";
      break;

    case "check_rhythm":
      update.labOrder = {
        name: "Rhythm Check",
        result: labResults.rhythm_check || "Rhythm check: Assessment pending",
      };
      update.newEvents = [
        {
          id: uuidv4(),
          type: "action",
          description: "Cardiac rhythm analysed — pause CPR for rhythm check",
          timestamp: now,
        },
      ];
      update.actionRecorded = "check_rhythm";
      break;

    // ==========================================
    // Overdose-specific actions
    // ==========================================
    case "administer_naloxone":
      update.vitalsUpdate = {
        respRate: Math.min(16, currentState.vitals.respRate + 10),
        spo2: Math.min(96, currentState.vitals.spo2 + 12),
        hr: Math.min(85, currentState.vitals.hr + 25),
        bpSystolic: Math.min(115, currentState.vitals.bpSystolic + 25),
        bpDiastolic: Math.min(70, currentState.vitals.bpDiastolic + 15),
      };
      update.newEvents = [
        {
          id: uuidv4(),
          type: "action",
          description: "Naloxone 0.4mg IV administered — patient responding",
          timestamp: now,
        },
      ];
      update.actionRecorded = "administer_naloxone";
      update.preventsDeteriorationRules = ["no-naloxone"];
      break;

    case "order_toxicology_screen":
      update.labOrder = {
        name: "Toxicology Screen",
        result: labResults.toxicology_screen || "Toxicology screen: Pending",
      };
      update.newEvents = [
        {
          id: uuidv4(),
          type: "action",
          description: "Toxicology screen ordered (urine and serum)",
          timestamp: now,
        },
      ];
      update.actionRecorded = "order_toxicology_screen";
      break;
  }

  return update;
}
