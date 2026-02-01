import type {
  SimulationState,
  Vitals,
  ChatMessage,
  MDTMessage,
  ClinicalEvent,
  FeedbackLog,
  LabOrder,
  DeteriorationRule,
} from "../types";
import { v4 as uuidv4 } from "uuid";

export type SimulationAction =
  | { type: "UPDATE_VITALS"; payload: Partial<Vitals> }
  | { type: "SET_TARGET_VITALS"; payload: Partial<Vitals> }
  | { type: "ADD_CHAT_MESSAGE"; payload: Omit<ChatMessage, "id" | "timestamp"> }
  | { type: "ADD_MDT_MESSAGE"; payload: Omit<MDTMessage, "id" | "timestamp"> }
  | { type: "ADD_EVENT"; payload: Omit<ClinicalEvent, "id" | "timestamp"> }
  | { type: "ADD_FEEDBACK"; payload: Omit<FeedbackLog, "id" | "timestamp"> }
  | {
      type: "ORDER_LAB";
      payload: Omit<LabOrder, "id" | "orderedAt" | "status">;
    }
  | { type: "COMPLETE_LAB"; payload: { id: string } }
  | { type: "COMPLETE_LAB_BY_NAME"; payload: { name: string } }
  | { type: "RECORD_ACTION"; payload: string }
  | {
      type: "TRIGGER_DETERIORATION";
      payload: { ruleId: string; vitalsUpdate: Partial<Vitals> };
    }
  | { type: "PREVENT_DETERIORATION"; payload: { ruleIds: string[] } }
  | { type: "UPDATE_SCORE"; payload: Partial<SimulationState["score"]> }
  | { type: "START_SIMULATION" }
  | { type: "PAUSE_SIMULATION" }
  | { type: "RESUME_SIMULATION" }
  | { type: "END_SIMULATION" }
  | { type: "RESET_SIMULATION"; payload: SimulationState }
  | { type: "TICK_VITALS" };

export function simulationReducer(
  state: SimulationState,
  action: SimulationAction,
): SimulationState {
  switch (action.type) {
    case "UPDATE_VITALS":
      return {
        ...state,
        targetVitals: {
          ...state.targetVitals,
          ...action.payload,
        },
      };

    case "SET_TARGET_VITALS":
      return {
        ...state,
        targetVitals: {
          ...state.targetVitals,
          ...action.payload,
        },
      };

    case "TICK_VITALS": {
      const lerp = (current: number, target: number, factor: number) =>
        current + (target - current) * factor;
      const factor = 0.1;

      return {
        ...state,
        vitals: {
          hr: Math.round(lerp(state.vitals.hr, state.targetVitals.hr, factor)),
          bpSystolic: Math.round(
            lerp(
              state.vitals.bpSystolic,
              state.targetVitals.bpSystolic,
              factor,
            ),
          ),
          bpDiastolic: Math.round(
            lerp(
              state.vitals.bpDiastolic,
              state.targetVitals.bpDiastolic,
              factor,
            ),
          ),
          spo2: Math.round(
            lerp(state.vitals.spo2, state.targetVitals.spo2, factor),
          ),
          temp:
            Math.round(
              lerp(state.vitals.temp, state.targetVitals.temp, factor) * 10,
            ) / 10,
          respRate: Math.round(
            lerp(state.vitals.respRate, state.targetVitals.respRate, factor),
          ),
        },
      };
    }

    case "ADD_CHAT_MESSAGE":
      return {
        ...state,
        chatMessages: [
          ...state.chatMessages,
          {
            id: uuidv4(),
            timestamp: Date.now(),
            ...action.payload,
          },
        ],
      };

    case "ADD_MDT_MESSAGE":
      return {
        ...state,
        mdtMessages: [
          ...state.mdtMessages,
          {
            id: uuidv4(),
            timestamp: Date.now(),
            ...action.payload,
          },
        ],
      };

    case "ADD_EVENT":
      return {
        ...state,
        events: [
          ...state.events,
          {
            id: uuidv4(),
            timestamp: Date.now(),
            ...action.payload,
          },
        ],
      };

    case "ADD_FEEDBACK":
      return {
        ...state,
        feedbackLogs: [
          ...state.feedbackLogs,
          {
            id: uuidv4(),
            timestamp: Date.now(),
            ...action.payload,
          },
        ],
        score:
          action.payload.type === "jargon"
            ? {
                ...state.score,
                communicationErrors: state.score.communicationErrors + 1,
              }
            : state.score,
      };

    case "ORDER_LAB": {
      const existingLab = state.labsOrdered.find(
        (l) => l.name === action.payload.name,
      );
      if (existingLab) return state;

      const newLab: LabOrder = {
        id: uuidv4(),
        orderedAt: Date.now(),
        status: "ordered",
        ...action.payload,
      };

      return {
        ...state,
        labsOrdered: [...state.labsOrdered, newLab],
      };
    }

    case "COMPLETE_LAB": {
      const labIndex = state.labsOrdered.findIndex(
        (l) => l.id === action.payload.id,
      );
      if (labIndex === -1) return state;

      const lab = state.labsOrdered[labIndex];
      const completedLab: LabOrder = {
        ...lab,
        status: "completed",
        completedAt: Date.now(),
      };

      return {
        ...state,
        labsOrdered: state.labsOrdered.filter(
          (l) => l.id !== action.payload.id,
        ),
        labsCompleted: [...state.labsCompleted, completedLab],
      };
    }

    case "COMPLETE_LAB_BY_NAME": {
      const lab = state.labsOrdered.find((l) => l.name === action.payload.name);
      if (!lab) return state;

      const completedLab: LabOrder = {
        ...lab,
        status: "completed",
        completedAt: Date.now(),
      };

      return {
        ...state,
        labsOrdered: state.labsOrdered.filter(
          (l) => l.name !== action.payload.name,
        ),
        labsCompleted: [...state.labsCompleted, completedLab],
      };
    }

    case "RECORD_ACTION": {
      if (state.actionsTaken.includes(action.payload)) return state;

      const newScore = { ...state.score };
      const elapsedMs = Date.now() - state.startTime;

      if (
        action.payload === "administer_antibiotics" &&
        newScore.timeToAntibiotics === null
      ) {
        newScore.timeToAntibiotics = elapsedMs;
      }
      if (
        action.payload === "administer_oxygen" &&
        newScore.timeToOxygen === null
      ) {
        newScore.timeToOxygen = elapsedMs;
      }
      if (action.payload === "fluid_bolus" && newScore.timeToFluids === null) {
        newScore.timeToFluids = elapsedMs;
      }

      newScore.totalActions = state.score.totalActions + 1;

      return {
        ...state,
        actionsTaken: [...state.actionsTaken, action.payload],
        score: newScore,
      };
    }

    case "TRIGGER_DETERIORATION": {
      const ruleIndex = state.deteriorationRules.findIndex(
        (r) => r.id === action.payload.ruleId,
      );
      if (ruleIndex === -1) return state;

      const updatedRules = [...state.deteriorationRules];
      updatedRules[ruleIndex] = {
        ...updatedRules[ruleIndex],
        triggered: true,
      };

      return {
        ...state,
        deteriorationRules: updatedRules,
        targetVitals: {
          ...state.targetVitals,
          ...action.payload.vitalsUpdate,
        },
      };
    }

    case "PREVENT_DETERIORATION": {
      const updatedRules = state.deteriorationRules.map((rule) => {
        if (action.payload.ruleIds.includes(rule.id)) {
          return { ...rule, startTime: undefined };
        }
        return rule;
      });

      return {
        ...state,
        deteriorationRules: updatedRules,
      };
    }

    case "UPDATE_SCORE":
      return {
        ...state,
        score: {
          ...state.score,
          ...action.payload,
        },
      };

    case "START_SIMULATION":
      return {
        ...state,
        isRunning: true,
        isPaused: false,
        startTime: Date.now(),
        deteriorationRules: state.deteriorationRules.map((rule) => ({
          ...rule,
          startTime: Date.now(),
        })),
      };

    case "PAUSE_SIMULATION":
      return {
        ...state,
        isPaused: true,
      };

    case "RESUME_SIMULATION":
      return {
        ...state,
        isPaused: false,
      };

    case "END_SIMULATION":
      return {
        ...state,
        isRunning: false,
      };

    case "RESET_SIMULATION":
      return action.payload;

    default:
      return state;
  }
}

export function createInitialState(
  scenarioId: string,
  baselineVitals: Vitals,
  deteriorationRules: DeteriorationRule[],
): SimulationState {
  return {
    vitals: { ...baselineVitals },
    targetVitals: { ...baselineVitals },
    labsOrdered: [],
    labsCompleted: [],
    chatMessages: [],
    mdtMessages: [],
    events: [],
    feedbackLogs: [],
    actionsTaken: [],
    deteriorationRules,
    score: {
      timeToAntibiotics: null,
      timeToOxygen: null,
      timeToFluids: null,
      communicationErrors: 0,
      totalActions: 0,
      correctActions: 0,
    },
    startTime: Date.now(),
    isRunning: false,
    isPaused: false,
    scenarioId,
  };
}
