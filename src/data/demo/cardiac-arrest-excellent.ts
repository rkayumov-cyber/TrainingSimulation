import type { DemoTranscript } from "../../types/demo";

export const cardiacArrestExcellent: DemoTranscript = {
  id: "demo-cardiac-arrest-excellent",
  scenarioId: "cardiac-arrest-55m",
  scenarioName: "Cardiac Arrest (VF) — Excellent Performance",
  level: "excellent",
  grade: "A",
  totalScore: 175,
  maxPossibleScore: 190,
  summary:
    "Textbook ACLS execution. Cardiac arrest recognised immediately, CPR initiated within 30 seconds, defibrillation within 2 minutes. Strict 2-minute CPR cycles with minimal interruptions. Correct epinephrine and amiodarone dosing. ROSC achieved after 3rd rhythm check. Post-ROSC care initiated promptly with ABG and 12-lead ECG.",
  steps: [
    {
      id: "ca-ex-1",
      elapsedSeconds: 0,
      vitals: { hr: 0, bpSystolic: 0, bpDiastolic: 0, spo2: 0, temp: 36.5, respRate: 0 },
      events: [
        { id: "e1", type: "alert", description: "Simulation started — Cardiac Arrest scenario", timestamp: 0 },
        { id: "e2", type: "alert", description: "55yo male collapsed in ED waiting room, bystanders calling for help", timestamp: 0 },
      ],
      feedbackLogs: [],
      annotation:
        "Mr. Patel, a 55-year-old male, has collapsed in the ED waiting room. Witnesses report he was sitting normally then suddenly slumped forward. All vitals are zero — this is a cardiac arrest until proven otherwise. Every second counts.",
    },
    {
      id: "ca-ex-2",
      elapsedSeconds: 10,
      doctorMessage: "This man is unresponsive. No pulse, no breathing. This is a cardiac arrest! Someone call a code and bring the crash cart now!",
      actionParsed: "check_rhythm",
      actionFeedback: "No pulse detected. Patient is in cardiac arrest.",
      vitals: { hr: 0, bpSystolic: 0, bpDiastolic: 0, spo2: 0, temp: 36.5, respRate: 0 },
      events: [
        { id: "e3", type: "action", description: "Cardiac arrest confirmed — no pulse, no breathing", timestamp: 10 },
        { id: "e4", type: "action", description: "Code blue called, crash cart requested", timestamp: 10 },
      ],
      feedbackLogs: [
        { id: "f1", type: "info", message: "Excellent: Cardiac arrest recognised within 10 seconds", timestamp: 10 },
      ],
      scoringImpact: { pointsEarned: 15, reason: "Rapid recognition of cardiac arrest" },
      annotation:
        "Immediate recognition is critical. The doctor checked for responsiveness, pulse, and breathing simultaneously — the 'look, listen, feel' approach. Calling the code early mobilises the resuscitation team.",
    },
    {
      id: "ca-ex-3",
      elapsedSeconds: 25,
      doctorMessage: "Starting chest compressions now. Someone get the defibrillator pads on him. I want hard and fast — 100 to 120 per minute, full recoil.",
      actionParsed: "start_cpr",
      actionFeedback: "High-quality CPR initiated. Rate: 110/min, depth: 5.5cm, full chest recoil.",
      vitals: { hr: 0, bpSystolic: 0, bpDiastolic: 0, spo2: 0, temp: 36.5, respRate: 0 },
      events: [
        { id: "e5", type: "action", description: "CPR started at 25 seconds — within 30-second target", timestamp: 25 },
      ],
      feedbackLogs: [
        { id: "f2", type: "info", message: "CPR started within 30s target — excellent", timestamp: 25 },
      ],
      scoringImpact: { pointsEarned: 25, reason: "CPR initiated within 30 seconds — critical action" },
      isCriticalAction: true,
      annotation:
        "CPR within 30 seconds is the gold standard. High-quality CPR means: rate 100-120/min, depth at least 5cm (but not exceeding 6cm), allowing full chest recoil between compressions, and minimising interruptions. This is the single most important intervention in cardiac arrest.",
    },
    {
      id: "ca-ex-4",
      elapsedSeconds: 60,
      doctorMessage: "Pads are on. Stop CPR briefly — analysing rhythm now.",
      actionParsed: "defibrillate",
      actionFeedback: "Monitor shows ventricular fibrillation (VF). Defibrillator charged to 200J biphasic. Shock delivered successfully.",
      vitals: { hr: 0, bpSystolic: 0, bpDiastolic: 0, spo2: 0, temp: 36.5, respRate: 0 },
      events: [
        { id: "e6", type: "action", description: "Rhythm analysed — VF identified", timestamp: 55 },
        { id: "e7", type: "action", description: "First shock delivered at 200J biphasic", timestamp: 60 },
      ],
      feedbackLogs: [
        { id: "f3", type: "info", message: "First defibrillation within 2 minutes — excellent", timestamp: 60 },
        { id: "f4", type: "info", message: "CPR pause for rhythm check < 5 seconds — minimal interruption", timestamp: 60 },
      ],
      scoringImpact: { pointsEarned: 25, reason: "Defibrillation within 2 minutes — critical action" },
      isCriticalAction: true,
      annotation:
        "VF is a shockable rhythm. Early defibrillation is the definitive treatment for VF — every minute of delay reduces survival by 7-10%. The doctor minimised the CPR pause to under 5 seconds for rhythm analysis and shock delivery, which is ideal.",
    },
    {
      id: "ca-ex-5",
      elapsedSeconds: 65,
      doctorMessage: "Shock delivered. Resume CPR immediately! Do not stop to check a pulse. Get a BVM on him — 30 compressions to 2 breaths until we have an advanced airway.",
      actionParsed: "bag_valve_mask",
      actionFeedback: "Bag-valve-mask ventilation initiated. 30:2 compression-to-ventilation ratio. Good chest rise observed.",
      vitals: { hr: 0, bpSystolic: 0, bpDiastolic: 0, spo2: 0, temp: 36.5, respRate: 0 },
      events: [
        { id: "e8", type: "action", description: "CPR resumed immediately post-shock", timestamp: 62 },
        { id: "e9", type: "action", description: "BVM ventilation started — 30:2 ratio", timestamp: 65 },
      ],
      feedbackLogs: [
        { id: "f5", type: "info", message: "CPR resumed within 3 seconds of shock — minimal interruption", timestamp: 62 },
      ],
      scoringImpact: { pointsEarned: 15, reason: "Immediate CPR resumption and airway management" },
      annotation:
        "Never stop to check a pulse immediately after a shock — resume CPR for a full 2-minute cycle first. The heart needs time to recover even if the rhythm converts. BVM at 30:2 ratio provides adequate oxygenation during resuscitation.",
    },
    {
      id: "ca-ex-6",
      elapsedSeconds: 100,
      doctorMessage: "Get IV access while we do CPR. I need a large-bore cannula — antecubital fossa is best during a code.",
      actionParsed: "establish_iv_access",
      actionFeedback: "18G IV cannula inserted in right antecubital fossa. Access confirmed with saline flush.",
      vitals: { hr: 0, bpSystolic: 0, bpDiastolic: 0, spo2: 0, temp: 36.5, respRate: 0 },
      events: [
        { id: "e10", type: "action", description: "IV access established during ongoing CPR", timestamp: 100 },
      ],
      feedbackLogs: [
        { id: "f6", type: "info", message: "IV access obtained without interrupting CPR — correct", timestamp: 100 },
      ],
      scoringImpact: { pointsEarned: 10, reason: "IV access established efficiently during CPR" },
      annotation:
        "IV access is established during CPR without interrupting compressions. The antecubital fossa is the preferred site during cardiac arrest — it is accessible and allows rapid drug delivery to the central circulation when followed by a 20mL saline flush and arm elevation.",
    },
    {
      id: "ca-ex-7",
      elapsedSeconds: 185,
      doctorMessage: "That's 2 minutes of CPR. Stop compressions — rhythm check. Still VF. Charging to 200J again. Everyone clear! Shock! Resume CPR immediately. Now give epinephrine 1mg IV, flush with 20mL saline.",
      actionParsed: "give_epinephrine",
      actionFeedback: "Second shock delivered. CPR resumed. Epinephrine 1mg IV administered followed by 20mL saline flush.",
      vitals: { hr: 0, bpSystolic: 0, bpDiastolic: 0, spo2: 0, temp: 36.5, respRate: 0 },
      events: [
        { id: "e11", type: "action", description: "2nd rhythm check — still VF", timestamp: 180 },
        { id: "e12", type: "action", description: "2nd shock delivered at 200J", timestamp: 182 },
        { id: "e13", type: "action", description: "Epinephrine 1mg IV given after 2nd shock", timestamp: 185 },
      ],
      feedbackLogs: [
        { id: "f7", type: "info", message: "Epinephrine given after 2nd shock — correct ACLS timing", timestamp: 185 },
        { id: "f8", type: "info", message: "Correct dose: 1mg (1:10,000) IV", timestamp: 185 },
      ],
      scoringImpact: { pointsEarned: 15, reason: "Epinephrine at correct dose and timing per ACLS" },
      isCriticalAction: true,
      annotation:
        "Per ACLS algorithm: epinephrine 1mg IV is given after the 2nd shock (during the 3rd cycle of CPR). In VF/pVT, epinephrine is given every 3-5 minutes. The dose is always 1mg (1:10,000 concentration). The 20mL flush ensures drug reaches the central circulation.",
    },
    {
      id: "ca-ex-8",
      elapsedSeconds: 310,
      doctorMessage: "Another 2-minute cycle complete. Rhythm check — it's still VF. Third shock, 200J. Clear! Good. Resume CPR. Now give amiodarone 300mg IV push.",
      actionParsed: "administer_amiodarone",
      actionFeedback: "Third shock delivered. Amiodarone 300mg IV administered.",
      vitals: { hr: 0, bpSystolic: 0, bpDiastolic: 0, spo2: 0, temp: 36.5, respRate: 0 },
      events: [
        { id: "e14", type: "action", description: "3rd rhythm check — persistent VF", timestamp: 305 },
        { id: "e15", type: "action", description: "3rd shock delivered at 200J", timestamp: 307 },
        { id: "e16", type: "action", description: "Amiodarone 300mg IV administered", timestamp: 310 },
      ],
      feedbackLogs: [
        { id: "f9", type: "info", message: "Amiodarone 300mg given after 3rd shock — correct ACLS protocol", timestamp: 310 },
      ],
      scoringImpact: { pointsEarned: 15, reason: "Amiodarone at correct dose and timing" },
      isCriticalAction: true,
      annotation:
        "Amiodarone 300mg IV is given for refractory VF/pVT after the 3rd shock. A second dose of 150mg may be given if VF persists. Amiodarone stabilises myocardial cell membranes and increases the threshold for fibrillation, improving the chance of successful defibrillation.",
    },
    {
      id: "ca-ex-9",
      elapsedSeconds: 430,
      doctorMessage: "Two minutes up. Stop CPR — rhythm check now.",
      actionParsed: "check_rhythm",
      actionFeedback: "Rhythm check: organised rhythm on monitor. Pulse check — strong carotid pulse palpated! We have ROSC!",
      vitals: { hr: 110, bpSystolic: 90, bpDiastolic: 60, spo2: 88, temp: 36.5, respRate: 6 },
      events: [
        { id: "e17", type: "improvement", description: "ROSC achieved — return of spontaneous circulation!", timestamp: 430 },
        { id: "e18", type: "alert", description: "Organised sinus rhythm on monitor", timestamp: 430 },
      ],
      feedbackLogs: [
        { id: "f10", type: "info", message: "ROSC achieved at 7 minutes — within expected timeframe", timestamp: 430 },
      ],
      scoringImpact: { pointsEarned: 10, reason: "ROSC achieved with systematic ACLS approach" },
      annotation:
        "ROSC after 3 shocks and 4 cycles of CPR. The organised approach — minimising CPR interruptions, timely defibrillation, correct drug dosing — led to successful resuscitation. The patient now needs immediate post-cardiac arrest care.",
    },
    {
      id: "ca-ex-10",
      elapsedSeconds: 460,
      doctorMessage: "We have ROSC. Continue BVM ventilation, target SpO2 94-98%. Let's get a 12-lead ECG and check his blood pressure every 2 minutes. Start a normal saline infusion.",
      patientResponse: "Patient remains unconscious but has spontaneous respirations at 6/min. Pupils sluggishly reactive.",
      vitals: { hr: 110, bpSystolic: 90, bpDiastolic: 60, spo2: 92, temp: 36.5, respRate: 8 },
      events: [
        { id: "e19", type: "action", description: "Post-ROSC care initiated — ventilation and monitoring", timestamp: 460 },
        { id: "e20", type: "improvement", description: "SpO2 improving with continued ventilation", timestamp: 460 },
      ],
      feedbackLogs: [
        { id: "f11", type: "info", message: "Post-ROSC care initiated promptly — good practice", timestamp: 460 },
      ],
      annotation:
        "Post-ROSC care is critical. Avoid hyperoxia (target SpO2 94-98%), maintain adequate blood pressure, and start investigating the cause of arrest. The patient is still unconscious, which is expected immediately after ROSC.",
    },
    {
      id: "ca-ex-11",
      elapsedSeconds: 500,
      doctorMessage: "I need an ABG right now — I want to know his acid-base status and oxygenation. Also order a stat troponin, electrolytes, and renal function.",
      actionParsed: "order_abg",
      actionFeedback: "ABG drawn. Results: pH 7.18, pCO2 52, pO2 78, HCO3 16, lactate 8.2 — severe metabolic acidosis with respiratory component.",
      vitals: { hr: 108, bpSystolic: 92, bpDiastolic: 62, spo2: 93, temp: 36.4, respRate: 10 },
      events: [
        { id: "e21", type: "action", description: "ABG obtained — severe acidosis pH 7.18, lactate 8.2", timestamp: 500 },
      ],
      feedbackLogs: [
        { id: "f12", type: "info", message: "ABG ordered promptly post-ROSC — correct", timestamp: 500 },
      ],
      scoringImpact: { pointsEarned: 10, reason: "Appropriate post-ROSC investigations ordered" },
      annotation:
        "ABG shows severe metabolic acidosis (pH 7.18, lactate 8.2) with a respiratory component (pCO2 52) — expected after cardiac arrest due to anaerobic metabolism during the period of no perfusion. This will improve with adequate ventilation and circulation.",
    },
    {
      id: "ca-ex-12",
      elapsedSeconds: 540,
      doctorMessage: "Get that 12-lead ECG now. I want to see if there's an ST-elevation pattern — he may need the cath lab.",
      actionParsed: "order_ecg",
      actionFeedback: "12-lead ECG obtained. Findings: sinus tachycardia at 108/min, ST elevation in leads V1-V4 consistent with anterior STEMI.",
      vitals: { hr: 108, bpSystolic: 94, bpDiastolic: 63, spo2: 94, temp: 36.4, respRate: 12 },
      events: [
        { id: "e22", type: "action", description: "12-lead ECG obtained — anterior STEMI identified", timestamp: 540 },
        { id: "e23", type: "alert", description: "STEMI identified — cardiology and cath lab activation needed", timestamp: 540 },
      ],
      feedbackLogs: [
        { id: "f13", type: "info", message: "ECG obtained within 10 minutes post-ROSC — meets guidelines", timestamp: 540 },
      ],
      scoringImpact: { pointsEarned: 10, reason: "12-lead ECG within target post-ROSC" },
      annotation:
        "A 12-lead ECG within 10 minutes post-ROSC is essential. ST elevation in V1-V4 indicates anterior STEMI as the likely cause of the VF arrest. This patient needs emergent cardiac catheterisation and likely percutaneous coronary intervention (PCI).",
    },
    {
      id: "ca-ex-13",
      elapsedSeconds: 600,
      vitals: { hr: 105, bpSystolic: 96, bpDiastolic: 64, spo2: 95, temp: 36.3, respRate: 14 },
      events: [
        { id: "e24", type: "alert", description: "Simulation complete", timestamp: 600 },
      ],
      feedbackLogs: [
        { id: "f14", type: "info", message: "Final Score: 175/190 — Grade A", timestamp: 600 },
      ],
      annotation:
        "Outstanding ACLS performance. All critical actions completed within target times: CPR < 30 seconds, defibrillation < 2 minutes, epinephrine after 2nd shock, amiodarone after 3rd shock. Minimal CPR interruptions throughout. ROSC achieved and appropriate post-arrest care initiated with ABG and 12-lead ECG identifying anterior STEMI as the cause. Final score: 175/190 = Grade A.",
    },
  ],
};
