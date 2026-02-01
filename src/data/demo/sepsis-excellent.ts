import type { DemoTranscript } from "../../types/demo";

export const sepsisExcellent: DemoTranscript = {
  id: "demo-sepsis-excellent",
  scenarioId: "sepsis-72f",
  scenarioName: "Acute Sepsis — Excellent Performance",
  level: "excellent",
  grade: "A",
  totalScore: 175,
  maxPossibleScore: 190,
  summary:
    "Textbook management of sepsis. ABCDE approach followed, all critical actions within target times, correct sequencing (cultures before antibiotics), clear patient communication throughout.",
  steps: [
    {
      id: "sep-ex-1",
      elapsedSeconds: 0,
      vitals: { hr: 105, bpSystolic: 105, bpDiastolic: 65, spo2: 91, temp: 39.1, respRate: 22 },
      events: [
        { id: "e1", type: "alert", description: "Simulation started — Sepsis scenario", timestamp: 0 },
      ],
      feedbackLogs: [],
      annotation:
        "Patient presents with tachycardia, hypotension, fever, low SpO2 and elevated respiratory rate — classic sepsis signs. The clock is ticking.",
    },
    {
      id: "sep-ex-2",
      elapsedSeconds: 15,
      doctorMessage: "Hello Mrs. Gable, I'm Dr. Smith. Can you tell me how you're feeling?",
      patientResponse:
        "I'm... so cold... and tired. My head is fuzzy. I just want to sleep.",
      vitals: { hr: 106, bpSystolic: 104, bpDiastolic: 64, spo2: 91, temp: 39.1, respRate: 22 },
      events: [],
      feedbackLogs: [],
      annotation:
        "Open question assesses mental status. Patient is confused — altered consciousness is a red flag for sepsis severity.",
    },
    {
      id: "sep-ex-3",
      elapsedSeconds: 30,
      doctorMessage: "I'm going to check your airway now. Can you open your mouth for me?",
      actionParsed: "check_airway",
      actionFeedback: "Airway patent, no obstruction.",
      vitals: { hr: 106, bpSystolic: 103, bpDiastolic: 64, spo2: 90, temp: 39.1, respRate: 23 },
      events: [
        { id: "e2", type: "action", description: "Airway assessed — patent", timestamp: 30 },
      ],
      feedbackLogs: [
        { id: "f1", type: "info", message: "Good: ABCDE approach — Airway first", timestamp: 30 },
      ],
      annotation:
        "ABCDE approach: always check Airway first. Systematic assessment prevents missed critical findings.",
    },
    {
      id: "sep-ex-4",
      elapsedSeconds: 45,
      doctorMessage:
        "I'm going to put an oxygen mask on you to help your breathing. You might feel some cool air on your face.",
      actionParsed: "administer_oxygen",
      actionFeedback: "High-flow oxygen applied via non-rebreather mask at 15L/min.",
      vitals: { hr: 104, bpSystolic: 103, bpDiastolic: 64, spo2: 93, temp: 39.1, respRate: 22 },
      events: [
        { id: "e3", type: "action", description: "Oxygen administered", timestamp: 45 },
      ],
      feedbackLogs: [
        { id: "f2", type: "info", message: "Oxygen given within 120s target — excellent timing", timestamp: 45 },
      ],
      scoringImpact: { pointsEarned: 20, reason: "Oxygen within target time" },
      isCriticalAction: true,
      annotation:
        "Critical action delivered within the 120-second target. SpO2 of 91% warrants immediate oxygen. Non-rebreather at 15L/min is appropriate for severe hypoxia.",
    },
    {
      id: "sep-ex-5",
      elapsedSeconds: 90,
      doctorMessage: "I'm going to listen to your lungs now. Take a deep breath for me.",
      actionParsed: "check_lung_sounds",
      actionFeedback: "Bilateral coarse crackles at both bases. Reduced air entry bilaterally.",
      vitals: { hr: 103, bpSystolic: 102, bpDiastolic: 63, spo2: 94, temp: 39.1, respRate: 21 },
      events: [
        { id: "e4", type: "action", description: "Lung auscultation performed", timestamp: 90 },
      ],
      feedbackLogs: [],
      annotation:
        "Bilateral crackles consistent with infection. Reduced air entry suggests consolidation. These findings support a respiratory source for sepsis.",
    },
    {
      id: "sep-ex-6",
      elapsedSeconds: 120,
      doctorMessage: "Now I'll listen to your heart.",
      actionParsed: "check_heart_sounds",
      actionFeedback: "Tachycardic but regular rhythm. No murmurs or additional sounds.",
      vitals: { hr: 102, bpSystolic: 103, bpDiastolic: 64, spo2: 94, temp: 39.1, respRate: 21 },
      events: [
        { id: "e5", type: "action", description: "Heart auscultation performed", timestamp: 120 },
      ],
      feedbackLogs: [],
      annotation:
        "Heart sounds confirm tachycardia without murmur — consistent with sepsis-driven compensatory response rather than primary cardiac cause.",
    },
    {
      id: "sep-ex-7",
      elapsedSeconds: 150,
      doctorMessage:
        "Mrs. Gable, I need to take some blood to run some important tests. You'll feel a small scratch.",
      actionParsed: "order_lactate",
      actionFeedback: "Lactate ordered. Result: 4.2 mmol/L (elevated).",
      vitals: { hr: 103, bpSystolic: 102, bpDiastolic: 63, spo2: 94, temp: 39.0, respRate: 21 },
      events: [
        { id: "e6", type: "action", description: "Lactate ordered — 4.2 mmol/L", timestamp: 150 },
      ],
      feedbackLogs: [
        { id: "f3", type: "info", message: "Lactate > 2 mmol/L — triggers Sepsis Bundle", timestamp: 150 },
      ],
      scoringImpact: { pointsEarned: 15, reason: "Lactate ordered early" },
      annotation:
        "Lactate > 2 mmol/L confirms tissue hypoperfusion and triggers the Sepsis Bundle. > 4 mmol/L indicates severe sepsis with high mortality risk.",
    },
    {
      id: "sep-ex-8",
      elapsedSeconds: 180,
      doctorMessage:
        "I also need to take blood cultures before we start any medicines. Another small scratch.",
      actionParsed: "order_blood_cultures",
      actionFeedback: "Two sets of blood cultures drawn from separate sites.",
      vitals: { hr: 104, bpSystolic: 101, bpDiastolic: 62, spo2: 94, temp: 39.0, respRate: 21 },
      events: [
        { id: "e7", type: "action", description: "Blood cultures drawn", timestamp: 180 },
      ],
      feedbackLogs: [
        { id: "f4", type: "info", message: "Correct: cultures drawn BEFORE antibiotics", timestamp: 180 },
      ],
      scoringImpact: { pointsEarned: 20, reason: "Cultures before antibiotics — correct sequence" },
      isCriticalAction: true,
      annotation:
        "Blood cultures MUST be drawn before antibiotics. Starting antibiotics first can sterilise cultures, making it impossible to identify the causative organism and tailor treatment.",
    },
    {
      id: "sep-ex-9",
      elapsedSeconds: 200,
      doctorMessage: "I'm also ordering a full blood count and metabolic panel.",
      actionParsed: "order_cbc",
      actionFeedback: "CBC ordered. WBC: 18,500/µL (elevated).",
      vitals: { hr: 104, bpSystolic: 100, bpDiastolic: 62, spo2: 94, temp: 39.0, respRate: 21 },
      events: [
        { id: "e8", type: "action", description: "CBC + BMP ordered", timestamp: 200 },
      ],
      feedbackLogs: [],
      annotation:
        "Elevated WBC confirms systemic infection. BMP will assess kidney function (often impaired in sepsis) and electrolytes.",
    },
    {
      id: "sep-ex-10",
      elapsedSeconds: 240,
      doctorMessage:
        "Mrs. Gable, I'm going to give you some fluids through a drip to help bring your blood pressure up. You'll feel the fluid going in.",
      actionParsed: "fluid_bolus",
      actionFeedback: "30ml/kg crystalloid bolus initiated (approximately 2L normal saline).",
      vitals: { hr: 100, bpSystolic: 108, bpDiastolic: 66, spo2: 95, temp: 38.9, respRate: 20 },
      events: [
        { id: "e9", type: "action", description: "IV fluid bolus started", timestamp: 240 },
        { id: "e10", type: "improvement", description: "Blood pressure improving with fluids", timestamp: 240 },
      ],
      feedbackLogs: [
        { id: "f5", type: "info", message: "Fluid resuscitation within 5min target — excellent", timestamp: 240 },
      ],
      scoringImpact: { pointsEarned: 20, reason: "Fluid bolus within target time" },
      isCriticalAction: true,
      annotation:
        "30ml/kg crystalloid bolus is the Surviving Sepsis Campaign recommendation. Rapid fluid resuscitation restores intravascular volume and improves organ perfusion. BP already responding.",
    },
    {
      id: "sep-ex-11",
      elapsedSeconds: 300,
      patientResponse: "I... I feel a bit better. The drip is helping I think. Still cold though.",
      vitals: { hr: 98, bpSystolic: 110, bpDiastolic: 68, spo2: 95, temp: 38.8, respRate: 20 },
      events: [
        { id: "e11", type: "improvement", description: "Patient reports feeling better", timestamp: 300 },
      ],
      feedbackLogs: [],
      annotation:
        "Patient symptom improvement correlates with objective vital sign improvement. SpO2 95%, BP normalising — treatment is working.",
    },
    {
      id: "sep-ex-12",
      elapsedSeconds: 390,
      doctorMessage: "How much have you been going to the toilet today? I need to check your fluid balance.",
      actionParsed: "check_urine_output",
      actionFeedback: "Urine output estimated at < 0.5ml/kg/hr — oliguria consistent with hypoperfusion.",
      vitals: { hr: 97, bpSystolic: 111, bpDiastolic: 68, spo2: 95, temp: 38.7, respRate: 20 },
      events: [
        { id: "e12", type: "action", description: "Urine output assessed", timestamp: 390 },
      ],
      feedbackLogs: [],
      annotation:
        "Urine output < 0.5ml/kg/hr indicates inadequate renal perfusion — another marker of sepsis severity. Monitor for improvement with fluid therapy.",
    },
    {
      id: "sep-ex-13",
      elapsedSeconds: 420,
      doctorMessage:
        "Mrs. Gable, I'm going to give you a strong medicine through your drip to fight the infection. This is very important.",
      actionParsed: "administer_antibiotics",
      actionFeedback: "Broad-spectrum IV antibiotics administered (piperacillin-tazobactam).",
      vitals: { hr: 96, bpSystolic: 112, bpDiastolic: 69, spo2: 96, temp: 38.6, respRate: 19 },
      events: [
        { id: "e13", type: "action", description: "IV antibiotics administered", timestamp: 420 },
      ],
      feedbackLogs: [
        { id: "f6", type: "info", message: "Antibiotics within 10min target — excellent timing", timestamp: 420 },
        { id: "f7", type: "info", message: "Correct sequence maintained: cultures → antibiotics", timestamp: 420 },
      ],
      scoringImpact: { pointsEarned: 15, reason: "Antibiotics within target, correct sequence" },
      isCriticalAction: true,
      annotation:
        "Antibiotics given within 10-minute target AND after blood cultures — textbook Sepsis Bundle execution. Each hour of antibiotic delay increases mortality by ~8%.",
    },
    {
      id: "sep-ex-14",
      elapsedSeconds: 480,
      vitals: { hr: 94, bpSystolic: 115, bpDiastolic: 70, spo2: 96, temp: 38.5, respRate: 18 },
      events: [
        { id: "e14", type: "alert", description: "Simulation complete", timestamp: 480 },
      ],
      feedbackLogs: [
        { id: "f8", type: "info", message: "Final Score: 175/190 — Grade A", timestamp: 480 },
      ],
      annotation:
        "Outstanding performance. All critical actions completed within target times. ABCDE approach followed systematically. Cultures drawn before antibiotics. Clear, jargon-free communication with patient throughout. Final score: 175/190 = Grade A.",
    },
  ],
};
