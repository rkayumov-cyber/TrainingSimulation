import type { DemoTranscript } from "../../types/demo";

export const sepsisMediocre: DemoTranscript = {
  id: "demo-sepsis-mediocre",
  scenarioId: "sepsis-72f",
  scenarioName: "Acute Sepsis — Mediocre Performance",
  level: "mediocre",
  grade: "C",
  totalScore: 105,
  maxPossibleScore: 190,
  summary:
    "Delayed oxygen, missed early lactate, some jargon used with patient. Cultures drawn before antibiotics (correct sequence) but several actions arrived late. Adequate but not optimal.",
  steps: [
    {
      id: "sep-med-1",
      elapsedSeconds: 0,
      vitals: { hr: 105, bpSystolic: 105, bpDiastolic: 65, spo2: 91, temp: 39.1, respRate: 22 },
      events: [
        { id: "e1", type: "alert", description: "Simulation started — Sepsis scenario", timestamp: 0 },
      ],
      feedbackLogs: [],
      annotation:
        "Same presentation: sepsis signs with tachycardia, hypotension, fever, and low SpO2. Let's see how a mediocre response unfolds.",
    },
    {
      id: "sep-med-2",
      elapsedSeconds: 20,
      doctorMessage: "Mrs. Gable, what brings you in today?",
      patientResponse: "I don't know... I just feel awful. Everything hurts.",
      vitals: { hr: 106, bpSystolic: 104, bpDiastolic: 64, spo2: 90, temp: 39.1, respRate: 22 },
      events: [],
      feedbackLogs: [],
      annotation:
        "Doctor begins with history taking rather than assessing the patient. Not wrong, but with SpO2 at 91% and dropping, oxygen should be a higher priority.",
    },
    {
      id: "sep-med-3",
      elapsedSeconds: 60,
      doctorMessage: "Let me listen to your chest.",
      actionParsed: "check_lung_sounds",
      actionFeedback: "Bilateral crackles heard.",
      vitals: { hr: 108, bpSystolic: 102, bpDiastolic: 63, spo2: 89, temp: 39.1, respRate: 23 },
      events: [
        { id: "e2", type: "action", description: "Lung auscultation performed", timestamp: 60 },
      ],
      feedbackLogs: [
        { id: "f1", type: "warning", message: "SpO2 dropping — oxygen not yet administered", timestamp: 60 },
      ],
      annotation:
        "Doctor skipped Airway and went straight to Breathing assessment. SpO2 has dropped to 89% — oxygen is now urgently needed. The ABCDE framework was not followed.",
    },
    {
      id: "sep-med-4",
      elapsedSeconds: 130,
      doctorMessage: "Your oxygen levels are a bit low. I'll put some oxygen on.",
      actionParsed: "administer_oxygen",
      actionFeedback: "Oxygen applied via nasal cannula at 4L/min.",
      vitals: { hr: 107, bpSystolic: 101, bpDiastolic: 62, spo2: 91, temp: 39.1, respRate: 22 },
      events: [
        { id: "e3", type: "action", description: "Oxygen administered (delayed)", timestamp: 130 },
      ],
      feedbackLogs: [
        { id: "f2", type: "warning", message: "Oxygen given at 130s — just over the 120s target", timestamp: 130 },
        { id: "f3", type: "warning", message: "Nasal cannula may be insufficient for SpO2 89%", timestamp: 130 },
      ],
      scoringImpact: { pointsEarned: 10, reason: "Oxygen given but slightly late, suboptimal delivery" },
      isCriticalAction: true,
      annotation:
        "Oxygen delivered at 130 seconds — just outside the 120-second target. Also, nasal cannula at 4L/min may not be enough for someone who was at 89%. A non-rebreather would be more appropriate.",
    },
    {
      id: "sep-med-5",
      elapsedSeconds: 180,
      doctorMessage: "I need to get an IV line in. We'll draw some bloods as well.",
      actionParsed: "order_cbc",
      actionFeedback: "CBC ordered. WBC: 18,500/µL (elevated).",
      vitals: { hr: 106, bpSystolic: 100, bpDiastolic: 61, spo2: 92, temp: 39.0, respRate: 22 },
      events: [
        { id: "e4", type: "action", description: "IV access established, CBC ordered", timestamp: 180 },
      ],
      feedbackLogs: [],
      annotation:
        "IV access and bloods are appropriate, but lactate — the key sepsis marker — wasn't specifically ordered. CBC confirms infection but lactate would quantify tissue hypoperfusion.",
    },
    {
      id: "sep-med-6",
      elapsedSeconds: 240,
      doctorMessage: "Your blood pressure is hemodynamically unstable. We need to resuscitate you.",
      patientResponse: "What? What does that mean? Am I dying?",
      vitals: { hr: 108, bpSystolic: 98, bpDiastolic: 59, spo2: 92, temp: 39.0, respRate: 23 },
      events: [],
      feedbackLogs: [
        { id: "f4", type: "jargon", message: "Jargon detected: 'hemodynamically unstable' — patient cannot understand this", timestamp: 240 },
        { id: "f5", type: "jargon", message: "Jargon detected: 'resuscitate' — frightening term for patients", timestamp: 240 },
      ],
      scoringImpact: { pointsEarned: -5, reason: "Medical jargon used with patient" },
      annotation:
        "Two jargon terms used: 'hemodynamically unstable' and 'resuscitate'. The patient is frightened and confused. Plain language like 'Your blood pressure is low, so I'm going to give you fluids through a drip' would be much better.",
    },
    {
      id: "sep-med-7",
      elapsedSeconds: 280,
      doctorMessage: "Starting a fluid bolus now.",
      actionParsed: "fluid_bolus",
      actionFeedback: "1L normal saline bolus started.",
      vitals: { hr: 105, bpSystolic: 102, bpDiastolic: 62, spo2: 93, temp: 38.9, respRate: 22 },
      events: [
        { id: "e5", type: "action", description: "IV fluid bolus started", timestamp: 280 },
      ],
      feedbackLogs: [
        { id: "f6", type: "warning", message: "Fluid volume may be insufficient — guideline recommends 30ml/kg", timestamp: 280 },
      ],
      scoringImpact: { pointsEarned: 12, reason: "Fluids given but slightly late" },
      isCriticalAction: true,
      annotation:
        "Fluids started at 4:40 — somewhat delayed. Volume of 1L may also be insufficient; guidelines recommend 30ml/kg (~2L for average adult). Partial credit awarded.",
    },
    {
      id: "sep-med-8",
      elapsedSeconds: 350,
      doctorMessage: "I should get blood cultures. Two sets from different arms please.",
      actionParsed: "order_blood_cultures",
      actionFeedback: "Blood cultures drawn from two sites.",
      vitals: { hr: 103, bpSystolic: 105, bpDiastolic: 64, spo2: 93, temp: 38.9, respRate: 21 },
      events: [
        { id: "e6", type: "action", description: "Blood cultures drawn", timestamp: 350 },
      ],
      feedbackLogs: [
        { id: "f7", type: "info", message: "Cultures drawn before antibiotics — correct sequence", timestamp: 350 },
      ],
      scoringImpact: { pointsEarned: 15, reason: "Cultures before antibiotics (correct order)" },
      isCriticalAction: true,
      annotation:
        "Cultures drawn before antibiotics — this is the correct sequencing. However, this should have been done earlier alongside the initial blood draw.",
    },
    {
      id: "sep-med-9",
      elapsedSeconds: 420,
      doctorMessage: "Oh, I should have ordered a lactate. Can we add that to the bloods?",
      actionParsed: "order_lactate",
      actionFeedback: "Lactate: 5.1 mmol/L (elevated — worse than initial).",
      vitals: { hr: 104, bpSystolic: 106, bpDiastolic: 64, spo2: 93, temp: 38.8, respRate: 21 },
      events: [
        { id: "e7", type: "action", description: "Lactate ordered — 5.1 mmol/L", timestamp: 420 },
      ],
      feedbackLogs: [
        { id: "f8", type: "warning", message: "Lactate delayed — should be part of initial assessment", timestamp: 420 },
      ],
      scoringImpact: { pointsEarned: 5, reason: "Lactate ordered but significantly delayed" },
      annotation:
        "Lactate ordered 7 minutes in — this should have been part of the initial blood draw. The lactate is now 5.1, higher than baseline (4.2), suggesting worsening tissue hypoperfusion during the delay.",
    },
    {
      id: "sep-med-10",
      elapsedSeconds: 480,
      doctorMessage: "Start broad-spectrum antibiotics — piperacillin-tazobactam IV.",
      actionParsed: "administer_antibiotics",
      actionFeedback: "IV antibiotics administered.",
      vitals: { hr: 102, bpSystolic: 108, bpDiastolic: 66, spo2: 94, temp: 38.7, respRate: 20 },
      events: [
        { id: "e8", type: "action", description: "Antibiotics administered", timestamp: 480 },
      ],
      feedbackLogs: [
        { id: "f9", type: "warning", message: "Antibiotics given at 8:00 — outside 10-minute window but acceptable", timestamp: 480 },
      ],
      scoringImpact: { pointsEarned: 10, reason: "Antibiotics given, just within acceptable window" },
      isCriticalAction: true,
      annotation:
        "Antibiotics at 8 minutes. Within the outer acceptable window but not ideal. Correct choice of broad-spectrum coverage. Importantly, cultures were drawn first — the sequence was preserved.",
    },
    {
      id: "sep-med-11",
      elapsedSeconds: 540,
      vitals: { hr: 100, bpSystolic: 110, bpDiastolic: 67, spo2: 94, temp: 38.6, respRate: 20 },
      events: [
        { id: "e9", type: "alert", description: "Simulation complete", timestamp: 540 },
      ],
      feedbackLogs: [
        { id: "f10", type: "info", message: "Final Score: 105/190 — Grade C", timestamp: 540 },
      ],
      annotation:
        "Grade C performance. The right things were done eventually, but with delays and some errors. Key issues: late oxygen, missed initial lactate, jargon used with patient, insufficient fluid volume. The cultures-before-antibiotics sequence was correctly maintained. Score: 105/190.",
    },
  ],
};
