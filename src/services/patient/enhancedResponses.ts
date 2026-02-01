import type {
  EmotionalState,
  PatientState,
  TreatmentResponse,
} from "../../types/enhanced";
import type { Vitals } from "../../types/simulation";

// Treatment responses - how patient reacts to treatments
export const TREATMENT_RESPONSES: Record<string, TreatmentResponse[]> = {
  administer_oxygen: [
    {
      actionId: "administer_oxygen",
      patientResponse: "Oh... that's helping. I can breathe a bit easier now.",
      emotionalChange: "relieved",
      breathingChange: -2,
    },
    {
      actionId: "administer_oxygen",
      patientResponse: "The mask feels cold but... yes, that's better.",
      emotionalChange: "relieved",
      breathingChange: -2,
    },
  ],
  administer_fluids: [
    {
      actionId: "administer_fluids",
      patientResponse:
        "I feel something cold going into my arm... is that normal?",
      emotionalChange: "anxious",
    },
    {
      actionId: "administer_fluids",
      patientResponse: "That IV... it's making me feel a bit better actually.",
      emotionalChange: "relieved",
    },
  ],
  administer_morphine: [
    {
      actionId: "administer_morphine",
      patientResponse: "Oh... the pain... it's going away. Thank you, doctor.",
      emotionalChange: "relieved",
      painChange: -4,
    },
    {
      actionId: "administer_morphine",
      patientResponse: "I feel... warm. Sleepy. The pain is much better.",
      emotionalChange: "calm",
      painChange: -5,
    },
  ],
  administer_epinephrine: [
    {
      actionId: "administer_epinephrine",
      patientResponse:
        "My heart is racing but... I can breathe! I can breathe again!",
      emotionalChange: "relieved",
      breathingChange: -4,
    },
    {
      actionId: "administer_epinephrine",
      patientResponse:
        "That made my heart pound but the swelling... it's going down!",
      emotionalChange: "relieved",
    },
  ],
  administer_aspirin: [
    {
      actionId: "administer_aspirin",
      patientResponse:
        "Just aspirin? For a heart attack? Okay... I'll chew it.",
    },
  ],
  administer_nitro: [
    {
      actionId: "administer_nitro",
      patientResponse:
        "Under my tongue? Okay... oh, it tingles. The chest pressure is easing a bit.",
      painChange: -2,
    },
    {
      actionId: "administer_nitro",
      patientResponse:
        "That tablet... I feel a bit lightheaded but the pain is better.",
      painChange: -2,
    },
  ],
  administer_salbutamol: [
    {
      actionId: "administer_salbutamol",
      patientResponse:
        "*taking deep breath* That nebulizer... I can feel my chest opening up.",
      emotionalChange: "relieved",
      breathingChange: -3,
    },
    {
      actionId: "administer_salbutamol",
      patientResponse:
        "My hands are shaking a bit but... I can breathe so much better.",
      breathingChange: -3,
    },
  ],
  administer_antibiotics: [
    {
      actionId: "administer_antibiotics",
      patientResponse:
        "More medicine through the IV? Okay... when will I start feeling better?",
    },
  ],
  administer_steroids: [
    {
      actionId: "administer_steroids",
      patientResponse:
        "Steroids? Like athletes use? Oh, medical steroids. Okay.",
    },
  ],
  administer_antihistamine: [
    {
      actionId: "administer_antihistamine",
      patientResponse:
        "That made me feel a bit drowsy... but the itching is less.",
      emotionalChange: "calm",
    },
  ],
  administer_tpa: [
    {
      actionId: "administer_tpa",
      patientResponse:
        "More medicine... I hope this helps. My arm still won't move...",
      emotionalChange: "anxious",
    },
    {
      actionId: "administer_tpa",
      patientResponse: "What is that? A clot buster? Okay... please help me...",
      emotionalChange: "anxious",
    },
  ],
  administer_labetalol: [
    {
      actionId: "administer_labetalol",
      patientResponse:
        "I feel something going into the IV... is that for my blood pressure?",
    },
  ],
  administer_naloxone: [
    {
      actionId: "administer_naloxone",
      patientResponse:
        "*suddenly gasping* What... where am I?! Get off me! I'm fine!",
      emotionalChange: "panicked",
      breathingChange: -5,
    },
    {
      actionId: "administer_naloxone",
      patientResponse:
        "*eyes opening wide* Wha... no! Leave me alone! *agitated*",
      emotionalChange: "panicked",
    },
  ],
  administer_magnesium: [
    {
      actionId: "administer_magnesium",
      patientResponse:
        "That feels warm going in... is my baby okay? Please tell me my baby is okay...",
      emotionalChange: "anxious",
    },
  ],
  start_insulin_drip: [
    {
      actionId: "start_insulin_drip",
      patientResponse:
        "Insulin... finally. I'm so sorry I ran out. I feel terrible...",
      emotionalChange: "relieved",
    },
  ],
  administer_diazepam: [
    {
      actionId: "administer_diazepam",
      patientResponse: "",
    },
  ],
  administer_amiodarone: [
    {
      actionId: "administer_amiodarone",
      patientResponse: "",
    },
  ],
};

// Deterioration responses - how patient reacts to getting worse
export const DETERIORATION_RESPONSES: Record<string, string[]> = {
  low_spo2: [
    "Doctor... I can't... catch my breath...",
    "Everything's going... dark at the edges...",
    "*gasping* Please... help me...",
    "I feel like I'm drowning...",
  ],
  low_bp: [
    "I feel so dizzy... the room is spinning...",
    "Doctor... I don't feel right... everything's fading...",
    "I'm going to faint... I can feel it...",
  ],
  high_hr: [
    "My heart... it's pounding so hard... is that normal?",
    "I can feel my heart racing... it won't slow down!",
  ],
  high_temp: [
    "I'm burning up... but also freezing... *shivering*",
    "So cold... why am I shivering when I'm so hot?",
  ],
  pain_increase: [
    "The pain... it's getting worse! Please do something!",
    "It hurts so much... worse than before...",
    "*grimacing* Ahhh... the pain...",
  ],
};

// Emotional state transitions based on vitals
export function determineEmotionalState(
  vitals: Vitals,
  currentState: PatientState,
  treatmentsReceived: string[],
): EmotionalState {
  // Critical vitals override everything
  if (vitals.spo2 < 88 || vitals.bpSystolic < 80) {
    return "panicked";
  }

  if (vitals.spo2 < 92 || vitals.bpSystolic < 90) {
    return "distressed";
  }

  // Check if condition is improving
  const hasOxygen = treatmentsReceived.includes("administer_oxygen");
  const hasPainMeds = treatmentsReceived.includes("administer_morphine");
  const hasEpi = treatmentsReceived.includes("administer_epinephrine");

  if (
    (hasOxygen && vitals.spo2 > 94) ||
    (hasPainMeds && currentState.painLevel < 3) ||
    (hasEpi && vitals.bpSystolic > 100)
  ) {
    return "relieved";
  }

  // High temp with confusion
  if (vitals.temp > 39 && currentState.consciousness === "confused") {
    return "confused";
  }

  // Default anxious in emergency
  if (vitals.hr > 100 || vitals.respRate > 22) {
    return "anxious";
  }

  return "calm";
}

// Generate contextual response based on what doctor said/did
export function generateContextualResponse(
  action: string,
  currentState: PatientState,
  vitals: Vitals,
  _scenarioId?: string, // Reserved for scenario-specific responses
): string {
  // Check for treatment response first
  const treatmentResponses = TREATMENT_RESPONSES[action];
  if (treatmentResponses && treatmentResponses.length > 0) {
    const response =
      treatmentResponses[Math.floor(Math.random() * treatmentResponses.length)];
    return response.patientResponse;
  }

  // If patient is deteriorating, they might not respond coherently
  if (vitals.spo2 < 85) {
    return "*struggling to breathe* Can't... talk... help...";
  }

  if (currentState.emotionalState === "panicked") {
    return "Please... just help me... I'm scared...";
  }

  // Generic acknowledgments based on action type
  if (action.startsWith("check_") || action.startsWith("examine_")) {
    const examResponses = [
      "What are you checking for, doctor?",
      "Is everything okay?",
      "*holds still* Go ahead...",
      "Does it look bad?",
    ];
    return examResponses[Math.floor(Math.random() * examResponses.length)];
  }

  if (action.startsWith("order_")) {
    const labResponses = [
      "Another test? Okay... will this help figure out what's wrong?",
      "How long until we know the results?",
      "I've already had so many tests...",
    ];
    return labResponses[Math.floor(Math.random() * labResponses.length)];
  }

  // Fallback
  return "What's happening, doctor? Am I going to be okay?";
}

// Generate deterioration alert from patient
export function generateDeteriorationAlert(
  previousVitals: Vitals,
  currentVitals: Vitals,
  _currentState?: PatientState, // Reserved for state-aware responses
): string | null {
  // SpO2 dropping
  if (currentVitals.spo2 < previousVitals.spo2 - 3 && currentVitals.spo2 < 92) {
    const responses = DETERIORATION_RESPONSES["low_spo2"];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // BP dropping
  if (
    currentVitals.bpSystolic < previousVitals.bpSystolic - 10 &&
    currentVitals.bpSystolic < 90
  ) {
    const responses = DETERIORATION_RESPONSES["low_bp"];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // HR spiking
  if (currentVitals.hr > previousVitals.hr + 15 && currentVitals.hr > 110) {
    const responses = DETERIORATION_RESPONSES["high_hr"];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  return null;
}

// Update patient state after treatment
export function updatePatientState(
  currentState: PatientState,
  action: string,
  vitals: Vitals,
): PatientState {
  const newState = { ...currentState };
  newState.lastStateChange = Date.now();

  // Find treatment response
  const responses = TREATMENT_RESPONSES[action];
  if (responses && responses.length > 0) {
    const response = responses[Math.floor(Math.random() * responses.length)];

    if (response.emotionalChange) {
      newState.emotionalState = response.emotionalChange;
    }
    if (response.painChange) {
      newState.painLevel = Math.max(
        0,
        Math.min(10, newState.painLevel + response.painChange),
      );
    }
    if (response.breathingChange) {
      newState.breathingDifficulty = Math.max(
        0,
        Math.min(10, newState.breathingDifficulty + response.breathingChange),
      );
    }

    // Track that patient noticed this treatment
    if (!newState.treatmentAcknowledgments.includes(action)) {
      newState.treatmentAcknowledgments.push(action);
    }
  }

  // Update consciousness based on vitals
  if (vitals.spo2 < 80 || vitals.bpSystolic < 70) {
    newState.consciousness = "unresponsive";
  } else if (vitals.spo2 < 88 || vitals.bpSystolic < 85) {
    newState.consciousness = "drowsy";
  } else if (vitals.temp > 39.5) {
    newState.consciousness = "confused";
  } else {
    newState.consciousness = "alert";
  }

  // Update emotional state
  newState.emotionalState = determineEmotionalState(
    vitals,
    newState,
    newState.treatmentAcknowledgments,
  );

  return newState;
}

// Create initial patient state for scenario
export function createInitialPatientState(
  scenarioId: string,
  vitals: Vitals,
): PatientState {
  let emotionalState: EmotionalState = "anxious";
  let painLevel = 3;
  let breathingDifficulty = 3;

  switch (scenarioId) {
    case "sepsis":
      emotionalState = "confused";
      painLevel = 2;
      breathingDifficulty = 4;
      break;
    case "mi":
      emotionalState = "distressed";
      painLevel = 8;
      breathingDifficulty = 4;
      break;
    case "anaphylaxis":
      emotionalState = "panicked";
      painLevel = 3;
      breathingDifficulty = 8;
      break;
    case "asthma":
      emotionalState = "distressed";
      painLevel = 2;
      breathingDifficulty = 9;
      break;
    case "stroke":
      emotionalState = "confused";
      painLevel = 4;
      breathingDifficulty = 2;
      break;
    case "dka":
      emotionalState = "distressed";
      painLevel = 5;
      breathingDifficulty = 6;
      break;
    case "trauma":
      emotionalState = "panicked";
      painLevel = 9;
      breathingDifficulty = 6;
      break;
    case "peds-seizure":
      emotionalState = "panicked";
      painLevel = 0;
      breathingDifficulty = 5;
      break;
    case "eclampsia":
      emotionalState = "confused";
      painLevel = 6;
      breathingDifficulty = 3;
      break;
    case "cardiac-arrest":
      emotionalState = "panicked";
      painLevel = 0;
      breathingDifficulty = 10;
      break;
    case "overdose":
      emotionalState = "confused";
      painLevel = 0;
      breathingDifficulty = 8;
      break;
  }

  return {
    emotionalState,
    painLevel,
    breathingDifficulty,
    consciousness: vitals.spo2 < 90 ? "drowsy" : "alert",
    treatmentAcknowledgments: [],
    lastStateChange: Date.now(),
  };
}
