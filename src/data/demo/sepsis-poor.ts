import type { DemoTranscript } from "../../types/demo";

export const sepsisPoor: DemoTranscript = {
  id: "demo-sepsis-poor",
  scenarioId: "sepsis-72f",
  scenarioName: "Acute Sepsis — Poor Performance",
  level: "poor",
  grade: "F",
  totalScore: 45,
  maxPossibleScore: 190,
  summary:
    "Dangerous management: no oxygen given (patient desaturated to 85%), antibiotics given without cultures (wrong sequence), morphine administered without indication (harmful), extensive jargon. Multiple deterioration events triggered.",
  steps: [
    {
      id: "sep-poor-1",
      elapsedSeconds: 0,
      vitals: { hr: 105, bpSystolic: 105, bpDiastolic: 65, spo2: 91, temp: 39.1, respRate: 22 },
      events: [
        { id: "e1", type: "alert", description: "Simulation started — Sepsis scenario", timestamp: 0 },
      ],
      feedbackLogs: [],
      annotation:
        "Same starting presentation. Watch how delayed and disordered management leads to patient deterioration and a failing grade.",
    },
    {
      id: "sep-poor-2",
      elapsedSeconds: 30,
      doctorMessage: "So, what's your presenting complaint today?",
      patientResponse: "I... I don't feel good. So cold...",
      vitals: { hr: 107, bpSystolic: 103, bpDiastolic: 64, spo2: 90, temp: 39.1, respRate: 23 },
      events: [],
      feedbackLogs: [],
      annotation:
        "Opening with 'presenting complaint' is clinical phrasing — the patient is confused and won't understand. SpO2 already dropping and no intervention started.",
    },
    {
      id: "sep-poor-3",
      elapsedSeconds: 90,
      doctorMessage: "I think you might have a systemic inflammatory response. Let me check your capillary refill and assess for end-organ dysfunction.",
      patientResponse: "What? I don't understand any of that...",
      vitals: { hr: 110, bpSystolic: 100, bpDiastolic: 62, spo2: 89, temp: 39.1, respRate: 24 },
      events: [],
      feedbackLogs: [
        { id: "f1", type: "jargon", message: "Jargon: 'systemic inflammatory response'", timestamp: 90 },
        { id: "f2", type: "jargon", message: "Jargon: 'capillary refill'", timestamp: 90 },
        { id: "f3", type: "jargon", message: "Jargon: 'end-organ dysfunction'", timestamp: 90 },
      ],
      scoringImpact: { pointsEarned: -10, reason: "Multiple jargon terms used" },
      annotation:
        "Three jargon terms in a single sentence to a confused elderly patient. This is a significant communication failure. Meanwhile, SpO2 has dropped to 89% with no oxygen given.",
    },
    {
      id: "sep-poor-4",
      elapsedSeconds: 180,
      doctorMessage: "Let's order some bloods — CBC, BMP, coags.",
      actionParsed: "order_cbc",
      actionFeedback: "CBC ordered.",
      vitals: { hr: 115, bpSystolic: 96, bpDiastolic: 58, spo2: 87, temp: 39.2, respRate: 25 },
      events: [
        { id: "e2", type: "deterioration", description: "SpO2 dropping — no oxygen given", timestamp: 180 },
      ],
      feedbackLogs: [
        { id: "f4", type: "error", message: "CRITICAL: SpO2 87% — patient needs oxygen immediately", timestamp: 180 },
      ],
      annotation:
        "Three minutes in and still no oxygen. SpO2 is now 87% and falling. Ordering routine bloods while the patient is hypoxic represents a serious prioritisation failure. Lactate was also not ordered.",
    },
    {
      id: "sep-poor-5",
      elapsedSeconds: 240,
      doctorMessage: "She seems to be in pain. Let's give morphine 5mg IV for comfort.",
      actionParsed: "give_morphine",
      actionFeedback: "Morphine 5mg IV administered.",
      vitals: { hr: 112, bpSystolic: 90, bpDiastolic: 52, spo2: 85, temp: 39.2, respRate: 24 },
      events: [
        { id: "e3", type: "deterioration", description: "SpO2 critical — 85%", timestamp: 240 },
        { id: "e4", type: "alert", description: "HARMFUL ACTION: Morphine given in sepsis", timestamp: 240 },
      ],
      feedbackLogs: [
        { id: "f5", type: "error", message: "HARMFUL: Morphine causes respiratory depression and hypotension — contraindicated in sepsis with hypotension", timestamp: 240 },
        { id: "f6", type: "error", message: "No indication for morphine — patient has infection pain, not acute injury", timestamp: 240 },
      ],
      scoringImpact: { pointsEarned: -20, reason: "Harmful action: morphine in hypotensive sepsis" },
      annotation:
        "HARMFUL ACTION. Morphine causes respiratory depression (worsens hypoxia) and vasodilation (worsens hypotension). Giving morphine to a septic, hypotensive patient with SpO2 85% is dangerous. This earns a -20 point penalty.",
    },
    {
      id: "sep-poor-6",
      elapsedSeconds: 360,
      doctorMessage: "Her sats are low. Better start antibiotics quickly — give pip-taz.",
      actionParsed: "administer_antibiotics",
      actionFeedback: "Antibiotics administered WITHOUT blood cultures.",
      vitals: { hr: 118, bpSystolic: 88, bpDiastolic: 50, spo2: 85, temp: 39.2, respRate: 26 },
      events: [
        { id: "e5", type: "action", description: "Antibiotics given — no prior cultures", timestamp: 360 },
      ],
      feedbackLogs: [
        { id: "f7", type: "error", message: "SEQUENCE ERROR: Antibiotics given BEFORE blood cultures", timestamp: 360 },
        { id: "f8", type: "warning", message: "Blood cultures not drawn — may not be able to identify organism", timestamp: 360 },
      ],
      scoringImpact: { pointsEarned: -15, reason: "Antibiotics before cultures — wrong sequence" },
      isCriticalAction: true,
      annotation:
        "Antibiotics given without drawing blood cultures first — a critical sequencing error. Antibiotics can sterilise blood, making culture results unreliable. Also, 'sats' is medical shorthand the patient might not understand.",
    },
    {
      id: "sep-poor-7",
      elapsedSeconds: 480,
      doctorMessage: "Oh wait, I should have done cultures first. Let me draw them now.",
      actionParsed: "order_blood_cultures",
      actionFeedback: "Blood cultures drawn — but antibiotics already given, cultures may be unreliable.",
      vitals: { hr: 120, bpSystolic: 86, bpDiastolic: 48, spo2: 85, temp: 39.3, respRate: 27 },
      events: [
        { id: "e6", type: "action", description: "Blood cultures drawn (post-antibiotics)", timestamp: 480 },
      ],
      feedbackLogs: [
        { id: "f9", type: "warning", message: "Cultures drawn after antibiotics — significantly reduced diagnostic value", timestamp: 480 },
      ],
      annotation:
        "Doctor recognises the error but it's too late — cultures after antibiotics have significantly reduced sensitivity. This is a common real-world mistake with serious consequences for patient care.",
    },
    {
      id: "sep-poor-8",
      elapsedSeconds: 540,
      doctorMessage: "Let's start a fluid challenge — 500ml over an hour.",
      actionParsed: "fluid_bolus",
      actionFeedback: "500ml saline ordered over 60 minutes.",
      vitals: { hr: 122, bpSystolic: 84, bpDiastolic: 46, spo2: 85, temp: 39.3, respRate: 28 },
      events: [
        { id: "e7", type: "deterioration", description: "Haemodynamic collapse — BP 84/46", timestamp: 540 },
      ],
      feedbackLogs: [
        { id: "f10", type: "error", message: "Insufficient fluid volume and rate — 30ml/kg bolus over 15-30min is recommended", timestamp: 540 },
        { id: "f11", type: "error", message: "STILL no oxygen administered", timestamp: 540 },
      ],
      scoringImpact: { pointsEarned: 5, reason: "Fluids given but grossly inadequate" },
      isCriticalAction: true,
      annotation:
        "500ml over 60 minutes is woefully inadequate for septic shock. Guidelines call for 30ml/kg (~2L) as a bolus. The slow rate means the patient won't see meaningful haemodynamic improvement. STILL no oxygen at 9 minutes.",
    },
    {
      id: "sep-poor-9",
      elapsedSeconds: 600,
      vitals: { hr: 125, bpSystolic: 82, bpDiastolic: 44, spo2: 84, temp: 39.4, respRate: 30 },
      events: [
        { id: "e8", type: "deterioration", description: "Patient critically deteriorating", timestamp: 600 },
        { id: "e9", type: "alert", description: "Simulation complete", timestamp: 600 },
      ],
      feedbackLogs: [
        { id: "f12", type: "error", message: "MISSED: Oxygen never administered", timestamp: 600 },
        { id: "f13", type: "error", message: "MISSED: Lactate never ordered", timestamp: 600 },
        { id: "f14", type: "error", message: "Final Score: 45/190 — Grade F", timestamp: 600 },
      ],
      annotation:
        "Grade F. Critical failures: oxygen never given (SpO2 dropped to 84%), harmful morphine administration, antibiotics before cultures, grossly insufficient fluids, no lactate ordered, extensive jargon. Multiple deterioration events triggered. This patient would likely require ICU escalation and may not survive. Score: 45/190.",
    },
  ],
};
