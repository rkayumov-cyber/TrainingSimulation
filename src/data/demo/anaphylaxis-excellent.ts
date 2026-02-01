import type { DemoTranscript } from "../../types/demo";

export const anaphylaxisExcellent: DemoTranscript = {
  id: "demo-anaphylaxis-excellent",
  scenarioId: "anaphylaxis-28f",
  scenarioName: "Severe Anaphylaxis — Excellent Performance",
  level: "excellent",
  grade: "A",
  totalScore: 170,
  maxPossibleScore: 185,
  summary:
    "Exemplary anaphylaxis management. Epinephrine IM given within 60 seconds, high-flow oxygen applied immediately, IV access established with aggressive fluid resuscitation, antihistamine and steroids administered in correct sequence. Clear, empathetic communication with no jargon. All critical actions completed within target times.",
  steps: [
    {
      id: "ana-ex-1",
      elapsedSeconds: 0,
      vitals: { hr: 120, bpSystolic: 85, bpDiastolic: 50, spo2: 89, temp: 37.0, respRate: 28 },
      events: [
        { id: "e1", type: "alert", description: "Simulation started — Anaphylaxis scenario", timestamp: 0 },
      ],
      feedbackLogs: [],
      annotation:
        "Patient presents with tachycardia (HR 120), hypotension (85/50), hypoxia (SpO2 89%), and tachypnoea (RR 28). These are hallmarks of severe anaphylaxis with cardiovascular compromise. Immediate intervention is required — every second counts.",
    },
    {
      id: "ana-ex-2",
      elapsedSeconds: 10,
      doctorMessage: "Hello Ms. Chen, I'm Dr. Reyes. Can you tell me what happened? Can you breathe okay?",
      patientResponse:
        "I ate... peanuts... my throat... it's closing up... I can't breathe properly... everything is itchy...",
      vitals: { hr: 122, bpSystolic: 84, bpDiastolic: 49, spo2: 88, temp: 37.0, respRate: 29 },
      events: [],
      feedbackLogs: [],
      annotation:
        "Rapid initial assessment. Patient reports throat tightness, dyspnoea, and generalised pruritus after peanut exposure — classic anaphylaxis triad of airway compromise, breathing difficulty, and skin changes. History confirms allergen exposure.",
    },
    {
      id: "ana-ex-3",
      elapsedSeconds: 25,
      doctorMessage: "I'm going to check your airway now. Open your mouth wide for me, please.",
      actionParsed: "check_airway",
      actionFeedback: "Visible tongue and lip swelling (angioedema). Audible stridor. Uvula oedematous. Airway at risk of obstruction.",
      vitals: { hr: 124, bpSystolic: 83, bpDiastolic: 48, spo2: 88, temp: 37.0, respRate: 29 },
      events: [
        { id: "e2", type: "action", description: "Airway assessed — angioedema and stridor identified", timestamp: 25 },
      ],
      feedbackLogs: [
        { id: "f1", type: "info", message: "Good: Airway assessed first — ABCDE approach", timestamp: 25 },
      ],
      scoringImpact: { pointsEarned: 10, reason: "Airway assessment within 30 seconds" },
      annotation:
        "Angioedema with stridor indicates upper airway compromise. This is the most immediately life-threatening feature of anaphylaxis. The airway can occlude completely within minutes — epinephrine must be given NOW.",
    },
    {
      id: "ana-ex-4",
      elapsedSeconds: 45,
      doctorMessage:
        "Ms. Chen, I'm going to give you a strong medicine in your thigh right now. It will help open your airways and bring your blood pressure up. You'll feel a sharp scratch.",
      actionParsed: "give_epinephrine",
      actionFeedback: "Epinephrine 0.5mg IM administered to anterolateral thigh.",
      vitals: { hr: 125, bpSystolic: 82, bpDiastolic: 47, spo2: 87, temp: 37.0, respRate: 30 },
      events: [
        { id: "e3", type: "action", description: "Epinephrine 0.5mg IM given — anterolateral thigh", timestamp: 45 },
      ],
      feedbackLogs: [
        { id: "f2", type: "info", message: "Epinephrine given within 60s — excellent timing", timestamp: 45 },
        { id: "f3", type: "info", message: "Correct route (IM) and dose (0.5mg 1:1000)", timestamp: 45 },
      ],
      scoringImpact: { pointsEarned: 25, reason: "Epinephrine IM within 60 seconds — critical action" },
      isCriticalAction: true,
      annotation:
        "CRITICAL ACTION: Epinephrine is the FIRST-LINE treatment for anaphylaxis. 0.5mg IM into the anterolateral thigh provides rapid absorption. Given within 45 seconds — outstanding. Delays in epinephrine are the leading cause of anaphylaxis deaths. IV epinephrine is reserved for cardiac arrest only.",
    },
    {
      id: "ana-ex-5",
      elapsedSeconds: 70,
      doctorMessage:
        "I'm putting an oxygen mask on you now. This will help you breathe more easily.",
      actionParsed: "administer_oxygen",
      actionFeedback: "High-flow oxygen applied via non-rebreather mask at 15L/min.",
      vitals: { hr: 118, bpSystolic: 86, bpDiastolic: 52, spo2: 91, temp: 37.0, respRate: 27 },
      events: [
        { id: "e4", type: "action", description: "High-flow oxygen administered at 15L/min", timestamp: 70 },
        { id: "e5", type: "improvement", description: "SpO2 beginning to improve with oxygen therapy", timestamp: 70 },
      ],
      feedbackLogs: [
        { id: "f4", type: "info", message: "Oxygen applied promptly after epinephrine — correct priority", timestamp: 70 },
      ],
      scoringImpact: { pointsEarned: 15, reason: "High-flow oxygen within 90 seconds" },
      isCriticalAction: true,
      annotation:
        "High-flow oxygen at 15L/min via non-rebreather mask is essential in anaphylaxis with hypoxia. SpO2 was 87% — this patient needs maximal oxygen delivery. Note the epinephrine is already starting to work (HR and BP beginning to stabilise).",
    },
    {
      id: "ana-ex-6",
      elapsedSeconds: 100,
      doctorMessage:
        "I need to put a small needle in your arm so we can give you fluids and more medicines. You'll feel a scratch.",
      actionParsed: "establish_iv_access",
      actionFeedback: "Two large-bore IV cannulae (16G) inserted — bilateral antecubital fossae.",
      vitals: { hr: 115, bpSystolic: 88, bpDiastolic: 54, spo2: 92, temp: 37.0, respRate: 26 },
      events: [
        { id: "e6", type: "action", description: "IV access established — two large-bore cannulae", timestamp: 100 },
      ],
      feedbackLogs: [
        { id: "f5", type: "info", message: "Two large-bore IVs placed — appropriate for aggressive fluid resuscitation", timestamp: 100 },
      ],
      scoringImpact: { pointsEarned: 10, reason: "IV access established promptly" },
      annotation:
        "Two large-bore cannulae enable rapid fluid resuscitation. In anaphylaxis, massive vasodilation and capillary leak can cause a patient to lose up to 35% of intravascular volume within minutes. Wide-bore access is essential for high-volume fluid delivery.",
    },
    {
      id: "ana-ex-7",
      elapsedSeconds: 130,
      doctorMessage:
        "I'm starting some fluids through your drip now. This will help bring your blood pressure back up. You're doing really well, Ms. Chen.",
      actionParsed: "fluid_bolus",
      actionFeedback: "500ml normal saline bolus running wide open. Second bag prepared.",
      vitals: { hr: 112, bpSystolic: 92, bpDiastolic: 58, spo2: 93, temp: 37.0, respRate: 25 },
      events: [
        { id: "e7", type: "action", description: "IV fluid bolus initiated — 500ml NaCl 0.9%", timestamp: 130 },
        { id: "e8", type: "improvement", description: "Blood pressure responding to fluids and epinephrine", timestamp: 130 },
      ],
      feedbackLogs: [
        { id: "f6", type: "info", message: "Fluid resuscitation started within target time — excellent", timestamp: 130 },
      ],
      scoringImpact: { pointsEarned: 20, reason: "Fluid bolus within 3 minutes of presentation" },
      isCriticalAction: true,
      annotation:
        "Aggressive IV fluid resuscitation corrects the distributive shock of anaphylaxis. Crystalloid boluses of 500–1000ml should be given rapidly and repeated as needed. Vasodilation from histamine release causes relative hypovolaemia — fluids restore preload and cardiac output.",
    },
    {
      id: "ana-ex-8",
      elapsedSeconds: 180,
      doctorMessage:
        "Ms. Chen, the strong medicine is helping. I'm now going to give you another medicine through the drip to help with the swelling and itching.",
      actionParsed: "give_antihistamine",
      actionFeedback: "Chlorphenamine 10mg IV administered slowly.",
      patientResponse: "Okay... I think... my throat feels a little better... still tight though.",
      vitals: { hr: 108, bpSystolic: 96, bpDiastolic: 60, spo2: 94, temp: 37.0, respRate: 24 },
      events: [
        { id: "e9", type: "action", description: "Chlorphenamine 10mg IV administered", timestamp: 180 },
        { id: "e10", type: "improvement", description: "Patient reports improvement in throat tightness", timestamp: 180 },
      ],
      feedbackLogs: [
        { id: "f7", type: "info", message: "Antihistamine given after epinephrine — correct priority order", timestamp: 180 },
      ],
      scoringImpact: { pointsEarned: 15, reason: "Antihistamine administered — correct sequence after epinephrine" },
      annotation:
        "Chlorphenamine (H1 antihistamine) is a second-line treatment in anaphylaxis. It helps with urticaria and itching but does NOT treat the life-threatening cardiovascular or respiratory features — that is epinephrine's role. Always give epinephrine first.",
    },
    {
      id: "ana-ex-9",
      elapsedSeconds: 240,
      doctorMessage:
        "I'm also going to give you a medicine called hydrocortisone through the drip. It helps prevent the reaction from coming back later.",
      actionParsed: "give_steroids",
      actionFeedback: "Hydrocortisone 200mg IV administered.",
      vitals: { hr: 104, bpSystolic: 100, bpDiastolic: 63, spo2: 95, temp: 37.0, respRate: 22 },
      events: [
        { id: "e11", type: "action", description: "Hydrocortisone 200mg IV administered", timestamp: 240 },
      ],
      feedbackLogs: [
        { id: "f8", type: "info", message: "Steroids given to prevent biphasic reaction — good practice", timestamp: 240 },
      ],
      scoringImpact: { pointsEarned: 15, reason: "IV steroids administered to prevent biphasic reaction" },
      annotation:
        "Hydrocortisone 200mg IV helps prevent the biphasic reaction, which occurs in up to 20% of anaphylaxis cases (typically 4–12 hours after initial reaction). While steroids have no immediate effect, they are an important part of the complete anaphylaxis management protocol.",
    },
    {
      id: "ana-ex-10",
      elapsedSeconds: 300,
      doctorMessage:
        "Ms. Chen, you're responding well to the treatment. Your breathing sounds better and your blood pressure is coming back up. How are you feeling?",
      patientResponse:
        "Better... the itching is calming down... I can breathe easier now. Thank you, doctor.",
      vitals: { hr: 100, bpSystolic: 105, bpDiastolic: 66, spo2: 96, temp: 37.0, respRate: 20 },
      events: [
        { id: "e12", type: "improvement", description: "Significant clinical improvement across all parameters", timestamp: 300 },
      ],
      feedbackLogs: [
        { id: "f9", type: "info", message: "Clear communication — patient reassured without jargon", timestamp: 300 },
      ],
      scoringImpact: { pointsEarned: 10, reason: "Excellent patient communication throughout" },
      annotation:
        "All vital signs trending toward normal. HR 100 (from 120), BP 105/66 (from 85/50), SpO2 96% (from 89%), RR 20 (from 28). The epinephrine, oxygen, and fluids have reversed the immediate life-threatening features. Patient is clinically improving.",
    },
    {
      id: "ana-ex-11",
      elapsedSeconds: 390,
      doctorMessage:
        "We're going to keep a very close eye on you for the next few hours. Sometimes these reactions can come back, so we want to make sure you're safe. We'll also arrange allergy testing and an adrenaline pen for you to carry.",
      patientResponse: "Thank you so much. I was really scared.",
      vitals: { hr: 96, bpSystolic: 110, bpDiastolic: 68, spo2: 97, temp: 37.0, respRate: 18 },
      events: [
        { id: "e13", type: "action", description: "Post-reaction observation and follow-up plan communicated", timestamp: 390 },
      ],
      feedbackLogs: [
        { id: "f10", type: "info", message: "Good: Biphasic reaction risk explained to patient in plain language", timestamp: 390 },
        { id: "f11", type: "info", message: "Good: Follow-up allergy referral and EpiPen prescription mentioned", timestamp: 390 },
      ],
      scoringImpact: { pointsEarned: 10, reason: "Discharge planning and safety-netting addressed" },
      annotation:
        "Important safety-netting: patients must be observed for at least 6–12 hours for biphasic reactions. Referral to allergy clinic and prescription of an adrenaline auto-injector (EpiPen) are essential for long-term management. Patient education about allergen avoidance prevents future episodes.",
    },
    {
      id: "ana-ex-12",
      elapsedSeconds: 450,
      vitals: { hr: 92, bpSystolic: 115, bpDiastolic: 70, spo2: 98, temp: 37.0, respRate: 16 },
      events: [
        { id: "e14", type: "alert", description: "Simulation complete", timestamp: 450 },
      ],
      feedbackLogs: [
        { id: "f12", type: "info", message: "Final Score: 170/185 — Grade A", timestamp: 450 },
      ],
      annotation:
        "Outstanding anaphylaxis management. Epinephrine IM given within 45 seconds — the single most important intervention. ABCDE approach followed systematically. All critical actions (epinephrine, oxygen, fluids) delivered within target times. Correct sequencing: epinephrine first, then oxygen, fluids, antihistamine, steroids. Jargon-free communication with empathetic reassurance throughout. Safety-netting and discharge planning addressed. Final score: 170/185 = Grade A.",
    },
  ],
};
