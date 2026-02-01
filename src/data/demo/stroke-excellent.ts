import type { DemoTranscript } from "../../types/demo";

export const strokeExcellent: DemoTranscript = {
  id: "demo-stroke-excellent",
  scenarioId: "stroke-58m",
  scenarioName: "Acute Ischaemic Stroke — Excellent Performance",
  level: "excellent",
  grade: "A",
  totalScore: 160,
  maxPossibleScore: 175,
  summary:
    "Exemplary stroke management. Rapid recognition of stroke signs, NIHSS completed early, CT head and angiography ordered urgently, blood glucose checked to rule out mimics, BP controlled to enable thrombolysis, and tPA administered well within the treatment window. Clear, jargon-free communication throughout. Time is brain — and no time was wasted.",
  steps: [
    {
      id: "str-ex-1",
      elapsedSeconds: 0,
      vitals: { hr: 88, bpSystolic: 185, bpDiastolic: 105, spo2: 96, temp: 36.9, respRate: 18 },
      events: [
        { id: "e1", type: "alert", description: "Simulation started — Acute Stroke scenario", timestamp: 0 },
      ],
      feedbackLogs: [],
      annotation:
        "Mr. Davis, 58-year-old male, presents with sudden onset left-sided weakness, facial droop, and slurred speech. BP is significantly elevated at 185/105. These are hallmark signs of acute stroke — the priority is rapid assessment and imaging to determine stroke type (ischaemic vs haemorrhagic) and eligibility for thrombolysis. Every minute counts: 'time is brain'.",
    },
    {
      id: "str-ex-2",
      elapsedSeconds: 15,
      doctorMessage: "Hello Mr. Davis, I'm Dr. Patel. Can you smile for me and raise both arms up?",
      patientResponse: "I... my face feels funny. I can't... my left arm won't go up properly.",
      actionParsed: "check_vitals",
      actionFeedback: "FAST assessment: Face — asymmetric droop on left. Arms — left arm drifts down. Speech — slurred. Time — onset approximately 45 minutes ago.",
      vitals: { hr: 88, bpSystolic: 184, bpDiastolic: 105, spo2: 96, temp: 36.9, respRate: 18 },
      events: [
        { id: "e2", type: "action", description: "FAST screening performed — positive for stroke", timestamp: 15 },
      ],
      feedbackLogs: [
        { id: "f1", type: "info", message: "Good: immediate FAST assessment on arrival", timestamp: 15 },
      ],
      scoringImpact: { pointsEarned: 10, reason: "Vitals checked and FAST assessment within 30 seconds" },
      annotation:
        "The FAST screen (Face, Arms, Speech, Time) is the frontline stroke recognition tool. All three signs are positive here. Crucially, onset was ~45 minutes ago — well within the 4.5-hour tPA window. Documenting time of onset is essential for treatment decisions.",
    },
    {
      id: "str-ex-3",
      elapsedSeconds: 60,
      doctorMessage: "Mr. Davis, I'm going to do a quick neurological assessment. Can you follow my finger with your eyes?",
      actionParsed: "check_nihss",
      actionFeedback: "NIHSS assessment completed. Score: 14 (moderate-severe stroke). Left facial palsy, left arm and leg weakness (4/5 power), dysarthria, left-sided neglect.",
      vitals: { hr: 90, bpSystolic: 186, bpDiastolic: 106, spo2: 96, temp: 36.9, respRate: 18 },
      events: [
        { id: "e3", type: "action", description: "NIHSS completed — score 14", timestamp: 60 },
      ],
      feedbackLogs: [
        { id: "f2", type: "info", message: "NIHSS completed within 2 minutes — excellent timing", timestamp: 60 },
      ],
      scoringImpact: { pointsEarned: 20, reason: "NIHSS assessment performed promptly" },
      isCriticalAction: true,
      annotation:
        "The National Institutes of Health Stroke Scale (NIHSS) quantifies neurological deficit severity. A score of 14 indicates moderate-severe stroke. This score guides treatment urgency and helps predict outcome. NIHSS > 6 strongly supports intervention. Completing this quickly keeps the pathway on track.",
    },
    {
      id: "str-ex-4",
      elapsedSeconds: 90,
      doctorMessage: "I need to check your blood sugar quickly, Mr. Davis. Just a small prick on your finger.",
      actionParsed: "check_blood_glucose",
      actionFeedback: "Blood glucose: 6.8 mmol/L (normal). Hypoglycaemia ruled out as stroke mimic.",
      vitals: { hr: 89, bpSystolic: 185, bpDiastolic: 106, spo2: 96, temp: 36.9, respRate: 18 },
      events: [
        { id: "e4", type: "action", description: "Blood glucose checked — 6.8 mmol/L (normal)", timestamp: 90 },
      ],
      feedbackLogs: [
        { id: "f3", type: "info", message: "Good: hypoglycaemia excluded as stroke mimic", timestamp: 90 },
      ],
      scoringImpact: { pointsEarned: 10, reason: "Blood glucose checked — stroke mimic excluded" },
      annotation:
        "Hypoglycaemia can perfectly mimic stroke with focal neurological deficits. Checking blood glucose is a mandatory step before any stroke pathway decision. A normal result here confirms we are dealing with a true cerebrovascular event, not a metabolic mimic.",
    },
    {
      id: "str-ex-5",
      elapsedSeconds: 120,
      doctorMessage: "Mr. Davis, we think you may be having a stroke. I need to get an urgent brain scan to find out exactly what's happening. We're going to take you to the scanner right now.",
      patientResponse: "A stroke? Am I going to be okay?",
      actionParsed: "order_ct_head",
      actionFeedback: "Non-contrast CT head ordered URGENT. Patient fast-tracked to scanner.",
      vitals: { hr: 90, bpSystolic: 184, bpDiastolic: 105, spo2: 96, temp: 36.9, respRate: 18 },
      events: [
        { id: "e5", type: "action", description: "CT head ordered — URGENT", timestamp: 120 },
      ],
      feedbackLogs: [
        { id: "f4", type: "info", message: "CT head ordered within 3 minutes — within target 'door-to-CT' time", timestamp: 120 },
      ],
      scoringImpact: { pointsEarned: 20, reason: "CT head ordered within target time" },
      isCriticalAction: true,
      annotation:
        "Non-contrast CT head is the single most important investigation in acute stroke. It differentiates ischaemic from haemorrhagic stroke — a distinction that determines whether tPA can be given. Haemorrhagic stroke + tPA = catastrophic. The 'door-to-CT' target is under 25 minutes in most stroke pathways. Ordering at 2 minutes is outstanding.",
    },
    {
      id: "str-ex-6",
      elapsedSeconds: 180,
      doctorMessage: "I'm also ordering a CT angiogram to look at the blood vessels in your brain and neck at the same time.",
      actionParsed: "order_ct_angio",
      actionFeedback: "CT angiography ordered. Will be performed immediately after non-contrast CT.",
      vitals: { hr: 89, bpSystolic: 183, bpDiastolic: 105, spo2: 96, temp: 36.9, respRate: 18 },
      events: [
        { id: "e6", type: "action", description: "CT angiography ordered", timestamp: 180 },
      ],
      feedbackLogs: [
        { id: "f5", type: "info", message: "CTA ordered alongside CT head — efficient imaging strategy", timestamp: 180 },
      ],
      scoringImpact: { pointsEarned: 10, reason: "CT angiography ordered to identify large vessel occlusion" },
      annotation:
        "CT angiography identifies the site and nature of arterial occlusion. This is essential for determining eligibility for mechanical thrombectomy in addition to thrombolysis. Ordering it alongside the CT head avoids delays if thrombectomy is indicated. An M1 MCA occlusion is the most common target for intervention.",
    },
    {
      id: "str-ex-7",
      elapsedSeconds: 210,
      doctorMessage: "I'm also sending bloods for a coagulation screen — we need to check your clotting before we can give the treatment.",
      actionParsed: "order_coagulation",
      actionFeedback: "Coagulation screen ordered. Result: INR 1.0, APTT 28s, platelets 245,000/µL — all normal. Patient eligible for thrombolysis.",
      vitals: { hr: 88, bpSystolic: 184, bpDiastolic: 105, spo2: 96, temp: 36.9, respRate: 18 },
      events: [
        { id: "e7", type: "action", description: "Coagulation screen ordered — normal (eligible for tPA)", timestamp: 210 },
      ],
      feedbackLogs: [
        { id: "f6", type: "info", message: "Coagulation checked — no contraindication to thrombolysis", timestamp: 210 },
      ],
      scoringImpact: { pointsEarned: 10, reason: "Coagulation screen ordered before tPA" },
      annotation:
        "Thrombolysis with tPA carries a significant bleeding risk. Checking coagulation is mandatory before administration. An elevated INR (e.g., from warfarin) or low platelets would be a contraindication. Normal results here confirm eligibility. In practice, tPA can be started while awaiting coag results if clinical suspicion is strong — but confirming normal coagulation is best practice.",
    },
    {
      id: "str-ex-8",
      elapsedSeconds: 360,
      patientResponse: "The scan... what did it show?",
      doctorMessage: "Mr. Davis, the brain scan shows you haven't had a bleed, which is good news. It looks like a blood clot is blocking one of the arteries in your brain. We can see exactly where it is.",
      vitals: { hr: 90, bpSystolic: 183, bpDiastolic: 104, spo2: 96, temp: 36.9, respRate: 18 },
      events: [
        { id: "e8", type: "action", description: "CT results: no haemorrhage. CTA: left M1 MCA occlusion confirmed", timestamp: 360 },
      ],
      feedbackLogs: [
        { id: "f7", type: "info", message: "Clear, jargon-free explanation of scan results to patient", timestamp: 360 },
      ],
      annotation:
        "CT head shows no haemorrhage — this is an ischaemic stroke and tPA is not contraindicated. CTA confirms a left M1 segment middle cerebral artery occlusion — this explains the right-sided symptoms (contralateral deficits). The doctor explains findings clearly without using terms like 'MCA' or 'ischaemic' with the patient. Excellent communication.",
    },
    {
      id: "str-ex-9",
      elapsedSeconds: 420,
      doctorMessage: "Your blood pressure is a bit high, which we need to bring down slightly before we can give you the clot-busting medicine. I'm going to give you something through the drip to lower it gently.",
      actionParsed: "administer_labetalol",
      actionFeedback: "IV labetalol 20mg administered. BP target: <185/110 for tPA eligibility.",
      vitals: { hr: 82, bpSystolic: 178, bpDiastolic: 100, spo2: 96, temp: 36.9, respRate: 17 },
      events: [
        { id: "e9", type: "action", description: "IV labetalol administered — BP management for tPA eligibility", timestamp: 420 },
        { id: "e10", type: "improvement", description: "Blood pressure responding to labetalol", timestamp: 420 },
      ],
      feedbackLogs: [
        { id: "f8", type: "info", message: "BP management initiated before tPA — correct approach", timestamp: 420 },
      ],
      scoringImpact: { pointsEarned: 15, reason: "BP controlled to enable safe thrombolysis" },
      annotation:
        "BP must be <185/110 before tPA can be safely administered. Labetalol is the first-line agent — it lowers BP without causing dangerous drops. The initial 20mg dose has brought BP below threshold. Aggressive BP lowering is avoided because it can worsen ischaemia by reducing perfusion to the penumbra (at-risk brain tissue).",
    },
    {
      id: "str-ex-10",
      elapsedSeconds: 480,
      doctorMessage: "Good, your blood pressure is now at a safe level. Mr. Davis, we're going to give you a medicine called a clot-buster. It works by dissolving the blood clot that's causing your stroke. It's very important we give this as quickly as possible. There is a small risk of bleeding, but the benefit of treating the stroke far outweighs that risk. Do you understand?",
      patientResponse: "Yes... please, just help me.",
      actionParsed: "administer_tpa",
      actionFeedback: "Alteplase (tPA) 0.9mg/kg administered. 10% bolus given, remainder infused over 60 minutes. Door-to-needle time: 8 minutes.",
      vitals: { hr: 80, bpSystolic: 172, bpDiastolic: 98, spo2: 97, temp: 36.9, respRate: 17 },
      events: [
        { id: "e11", type: "action", description: "tPA administered — door-to-needle 8 minutes", timestamp: 480 },
      ],
      feedbackLogs: [
        { id: "f9", type: "info", message: "tPA administered well within 60-minute door-to-needle target", timestamp: 480 },
        { id: "f10", type: "info", message: "Informed consent obtained with clear risk-benefit explanation", timestamp: 480 },
      ],
      scoringImpact: { pointsEarned: 25, reason: "tPA administered within treatment window with informed consent" },
      isCriticalAction: true,
      annotation:
        "tPA (alteplase) is the definitive treatment for acute ischaemic stroke when given within 4.5 hours of onset. Door-to-needle time of 8 minutes is outstanding (target <60 minutes). The doctor explained the treatment in plain language — 'clot-buster' instead of 'thrombolytic' — and obtained informed consent by explaining risks and benefits. Each 15-minute reduction in door-to-needle time significantly improves outcomes.",
    },
    {
      id: "str-ex-11",
      elapsedSeconds: 600,
      doctorMessage: "We're going to keep monitoring you very closely. The medicine is working through your drip. We'll also be referring you to the specialist stroke team who may recommend an additional procedure to remove the clot directly.",
      patientResponse: "I think... my arm feels a tiny bit better already.",
      vitals: { hr: 78, bpSystolic: 168, bpDiastolic: 96, spo2: 97, temp: 36.9, respRate: 17 },
      events: [
        { id: "e12", type: "improvement", description: "Patient reports subjective improvement in left arm strength", timestamp: 600 },
      ],
      feedbackLogs: [
        { id: "f11", type: "info", message: "Post-tPA monitoring initiated appropriately", timestamp: 600 },
      ],
      annotation:
        "Early neurological improvement after tPA is a positive sign — it suggests the clot is beginning to dissolve. The doctor appropriately mentions potential thrombectomy referral given the confirmed M1 occlusion on CTA. Post-tPA monitoring includes neurological checks every 15 minutes and BP monitoring to prevent hypertensive complications.",
    },
    {
      id: "str-ex-12",
      elapsedSeconds: 720,
      vitals: { hr: 76, bpSystolic: 162, bpDiastolic: 94, spo2: 97, temp: 36.9, respRate: 16 },
      events: [
        { id: "e13", type: "improvement", description: "Vitals stabilising — BP trending down appropriately", timestamp: 720 },
        { id: "e14", type: "alert", description: "Simulation complete", timestamp: 720 },
      ],
      feedbackLogs: [
        { id: "f12", type: "info", message: "Final Score: 160/175 — Grade A", timestamp: 720 },
      ],
      annotation:
        "Exceptional stroke management. All critical actions completed rapidly: NIHSS at 60s, CT head at 120s, tPA at 480s. The 'time is brain' principle was honoured throughout — approximately 1.9 million neurons are lost per minute in untreated large vessel occlusion stroke. This performance minimised neuronal loss and maximised the chance of recovery. Clear patient communication, appropriate BP management, and correct investigation sequencing. Final score: 160/175 = Grade A.",
    },
  ],
};
