interface ResponsePattern {
  patterns: RegExp[];
  responses: string[];
}

const responsePatterns: ResponsePattern[] = [
  {
    patterns: [/hello|hi|good (morning|afternoon|evening)/i],
    responses: [
      "Oh... hello doctor. I'm so tired...",
      "Hi... I don't feel well at all.",
      "Hello... *shivers* I'm so cold.",
    ],
  },
  {
    patterns: [/how (are you|do you feel)|what('s| is) (wrong|the matter)/i],
    responses: [
      "I feel terrible, doctor. So cold... and everything's a bit fuzzy.",
      "Not good... I just want to sleep. My head hurts.",
      "I've been shivering for hours. Can I have a blanket? Everything feels strange.",
    ],
  },
  {
    patterns: [/name|who are you|can you tell me your name/i],
    responses: [
      "I'm... Mrs. Gable. Eleanor Gable.",
      "Gable... my name is Eleanor Gable... I think.",
      "Mrs. Gable... sorry, my mind is all foggy today.",
    ],
  },
  {
    patterns: [/pain|hurt|where does it hurt/i],
    responses: [
      "My head hurts... and I ache all over. Like the flu but worse.",
      "Everywhere hurts, really. But my head especially.",
      "I have this terrible headache... and my back aches too.",
    ],
  },
  {
    patterns: [/when did (this|it) start|how long/i],
    responses: [
      "Yesterday... or was it the day before? I can't remember properly.",
      "I started feeling bad yesterday. Got worse overnight.",
      "My daughter said I've been unwell for a day or two... I'm not sure.",
    ],
  },
  {
    patterns: [/temperature|fever|hot|cold/i],
    responses: [
      "I feel so cold, doctor. But my daughter said I was burning up.",
      "I've been shivering. Am I cold? I feel like I'm freezing.",
      "Cold... so cold. Can I have another blanket please?",
    ],
  },
  {
    patterns: [/breathe|breathing|short of breath|lungs/i],
    responses: [
      "It's... it's a bit hard to catch my breath sometimes.",
      "Breathing feels harder than normal. Like I've been running.",
      "I get winded easily. Everything is such an effort.",
    ],
  },
  {
    patterns: [/urine|urinate|pee|toilet|wee/i],
    responses: [
      "It burns when I go. And I've been going a lot.",
      "Yes, it's been hurting when I use the toilet. Very uncomfortable.",
      "I've had some trouble with that... it stings.",
    ],
  },
  {
    patterns: [/eat|appetite|food|hungry/i],
    responses: [
      "I haven't wanted to eat. Nothing tastes right.",
      "No appetite at all. Just tired.",
      "The thought of food makes me feel sick.",
    ],
  },
  {
    patterns: [/medicine|medication|taking anything|drugs/i],
    responses: [
      "I take... um... a water tablet? And something for my blood pressure.",
      "My daughter knows better than me. Some pills for my heart I think.",
      "I'm on a few things... my mind is too foggy to remember them all.",
    ],
  },
  {
    patterns: [/allerg/i],
    responses: [
      "Penicillin. I'm allergic to penicillin. It makes me come out in a rash.",
      "Just penicillin, doctor. Nothing else that I know of.",
      "Yes, penicillin. Can't have that one.",
    ],
  },
  {
    patterns: [/family|live|home|who.*(looks after|takes care)/i],
    responses: [
      "My daughter lives nearby. She's the one who called the ambulance.",
      "I live alone, but my daughter visits every day. She's worried sick.",
      "My husband passed years ago. My daughter Sarah takes care of me now.",
    ],
  },
  {
    patterns: [/oxygen|mask|something on your face/i],
    responses: [
      "Okay doctor, if it helps...",
      "Alright. It feels strange but I'll keep it on.",
      "Is this helping? I suppose I do feel a tiny bit better.",
    ],
  },
  {
    patterns: [/needle|blood|draw|poke|sample/i],
    responses: [
      "Oh... I don't like needles, but if you have to...",
      "Alright, doctor. Just be gentle please.",
      "*winces* Okay... if it helps figure out what's wrong.",
    ],
  },
  {
    patterns: [/examine|look at|check|listen/i],
    responses: [
      "Go ahead, doctor.",
      "Okay... *tries to sit up*",
      "Alright. Sorry if I'm not much help.",
    ],
  },
  {
    patterns: [/understand|follow|can you hear me/i],
    responses: [
      "Yes... I can hear you. Things are just a bit blurry.",
      "I'm trying, doctor. My head feels full of cotton wool.",
      "Sort of... I'm doing my best.",
    ],
  },
  {
    patterns: [/squeeze|grip|hold my hand/i],
    responses: [
      "*squeezes weakly*",
      "Like this? I feel so weak...",
      "*grips your hand* Is that okay?",
    ],
  },
  {
    patterns: [/cough/i],
    responses: [
      "*coughs weakly* That hurts...",
      "*coughs* Not much coming up...",
      "*attempts to cough* Ow... my chest.",
    ],
  },
  {
    patterns: [/sleep|rest|tired/i],
    responses: [
      "I just want to sleep, doctor. I'm so tired...",
      "Can I close my eyes for a bit? I'm exhausted.",
      "So tired... everything is such an effort.",
    ],
  },
];

const confusedResponses = [
  "I'm sorry, I didn't catch that... my mind is so foggy.",
  "What was that, doctor? I'm having trouble focusing.",
  "I... I don't understand. Can you say that differently?",
  "Sorry... I can't quite follow. I'm so tired.",
  "Hmm? I'm not sure what you mean...",
];

const jargonConfusionResponses = [
  "I don't know what that means, doctor...",
  "Those are big words... I'm just a confused old lady.",
  "What does that mean? I don't understand medical talk.",
  "Sorry, I don't know those words. Can you explain in plain English?",
  "I'm not a doctor... I don't understand those terms.",
];

export function generatePatientResponse(
  doctorMessage: string,
  hasJargon: boolean,
): string {
  if (hasJargon) {
    return jargonConfusionResponses[
      Math.floor(Math.random() * jargonConfusionResponses.length)
    ];
  }

  for (const { patterns, responses } of responsePatterns) {
    for (const pattern of patterns) {
      if (pattern.test(doctorMessage)) {
        return responses[Math.floor(Math.random() * responses.length)];
      }
    }
  }

  return confusedResponses[
    Math.floor(Math.random() * confusedResponses.length)
  ];
}
