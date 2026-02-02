import React, {
  useReducer,
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
} from "react";
import type {
  SimulationState,
  MedicalIntent,
  ScenarioDefinition,
  Vitals,
} from "../types";
import type {
  VitalsSnapshot,
  SessionRecord,
  ActionRecord,
} from "../types/session";
import type {
  ClinicalDecisionScore,
  PatientState,
  TaskDelegation,
} from "../types/enhanced";
import type {
  DifficultyLevel,
  DifficultyModifiers,
  CompetencyChecklist,
  ChecklistResult,
  ComplicationRule,
} from "../types/difficulty";
import {
  simulationReducer,
  createInitialState,
} from "../reducers/simulationReducer";
import type { SimulationAction } from "../reducers/simulationReducer";
import {
  parseAllIntents,
  detectJargon,
  processIntent,
  getJargonSuggestion,
} from "../services/referee";
import { generatePatientResponse } from "../services/patient";
import {
  checkDeteriorationRules,
  initializeRuleTimers,
} from "../services/deterioration";
import { sepsisScenario } from "../scenarios/sepsis";
import { getScenarioById } from "../scenarios";
import { SimulationContext } from "./SimulationContextDef";
import { saveSession, logActivity } from "../services/persistence";
import { v4 as uuidv4 } from "uuid";
import { createSimulationLoop } from "../services/simulation/simulationLoop";
import type { SimulationLoop } from "../services/simulation/simulationLoop";

// Import new enhanced services
import {
  getDrugEffectManager,
  resetDrugEffectManager,
  DRUG_KINETICS,
} from "../services/pharmacology";
import { getDynamicLabManager, resetDynamicLabManager } from "../services/labs";
import {
  getTeamSimulationManager,
  resetTeamSimulationManager,
  parseDelegationCommand,
} from "../services/team";
import { calculateClinicalScore, assessAction } from "../services/scoring";
import {
  createInitialPatientState,
  updatePatientState,
  generateContextualResponse,
  generateDeteriorationAlert,
} from "../services/patient";
import { generateContextualSuggestions } from "../services/knowledge";
import {
  getDifficultyModifiers,
  calculateAdaptivePerformance,
} from "../services/difficulty";
import {
  getChecklistForScenario,
  updateChecklist,
  calculateChecklistResult,
} from "../services/checklist";
import {
  getComplicationsForScenario,
  checkComplications,
  markComplicationTriggered,
} from "../services/complications";
import { getImagingManager, resetImagingManager } from "../services/imaging";
import type { BenchmarkResult } from "../types/scenarioBuilder";
import { getBenchmarkByScenario } from "../services/persistence";
import { gradeSession } from "../services/benchmark";
import {
  resetAdvisoryCooldowns,
} from "../services/team/advisoryService";
import { PharmacologyProvider } from "./PharmacologyContext";
import { LabsProvider } from "./LabsContext";
import { TeamProvider } from "./TeamContext";
import { ImagingProvider } from "./ImagingContext";

function createInitialSimulationStateForScenario(
  scenario: ScenarioDefinition,
): SimulationState {
  const initialRules = initializeRuleTimers(
    scenario.deteriorationRules,
    Date.now(),
  );
  return createInitialState(scenario.id, scenario.baselineVitals, initialRules);
}

// Enhanced context value type (extracted: activeDrugEffects→PharmacologyContext,
// dynamicLabs→LabsContext, advisoryMessages/acceptAdvisory/dismissAdvisory→TeamContext,
// imagingStudies/orderImaging→ImagingContext)
export interface EnhancedSimulationContextValue {
  state: SimulationState;
  scenario: ScenarioDefinition;
  dispatch: React.Dispatch<SimulationAction>;
  sendDoctorMessage: (message: string) => void;
  sendMDTMessage: (sender: string, message: string) => void;
  startSimulation: () => void;
  pauseSimulation: () => void;
  resumeSimulation: () => void;
  endSimulation: () => void;
  resetSimulation: () => void;
  changeScenario: (scenario: ScenarioDefinition) => void;
  elapsedTime: number;
  // Enhanced features
  clinicalScore: ClinicalDecisionScore | null;
  patientState: PatientState | null;
  teamTasks: TaskDelegation[];
  contextualHints: string[];
  actionTimestamps: Record<string, number>;
  lastSessionId: string | null;
  // P1: Difficulty, Checklists, Complications
  difficulty: DifficultyLevel;
  difficultyModifiers: DifficultyModifiers;
  changeDifficulty: (level: DifficultyLevel) => void;
  checklist: CompetencyChecklist | null;
  checklistResult: ChecklistResult | null;
  complications: ComplicationRule[];
  // Benchmark
  benchmarkResult: BenchmarkResult | null;
}

export function SimulationProvider({
  children,
  initialScenarioId,
}: {
  children: React.ReactNode;
  initialScenarioId?: string | null;
}) {
  const [scenario, setScenario] = useState<ScenarioDefinition>(() => {
    if (initialScenarioId) {
      const found = getScenarioById(initialScenarioId);
      if (found) return found;
    }
    return sepsisScenario;
  });

  const [state, dispatch] = useReducer(simulationReducer, scenario, (s) =>
    createInitialSimulationStateForScenario(s),
  );
  const [elapsedTime, setElapsedTime] = useState(0);
  const loopRef = useRef<SimulationLoop | null>(null);

  // Enhanced state
  const [clinicalScore, setClinicalScore] =
    useState<ClinicalDecisionScore | null>(null);
  const [patientState, setPatientState] = useState<PatientState | null>(null);
  const [teamTasks, setTeamTasks] = useState<TaskDelegation[]>([]);
  const [contextualHints, setContextualHints] = useState<string[]>([]);
  const [actionTimestamps, setActionTimestamps] = useState<
    Record<string, number>
  >({});

  // Session persistence state
  const [lastSessionId, setLastSessionId] = useState<string | null>(null);
  const vitalsSnapshotsRef = useRef<VitalsSnapshot[]>([]);

  // P1: Difficulty state
  const [difficulty, setDifficulty] = useState<DifficultyLevel>("intermediate");
  const [checklist, setChecklist] = useState<CompetencyChecklist | null>(null);
  const [complications, setComplications] = useState<ComplicationRule[]>([]);
  const fluidCountRef = useRef(0);

  // Benchmark state
  const [benchmarkResult, setBenchmarkResult] = useState<BenchmarkResult | null>(null);

  // Previous vitals for deterioration detection
  const previousVitalsRef = useRef<Vitals | null>(null);

  // Latest-state refs for the simulation loop (game-loop-in-React pattern)
  const stateRef = useRef(state);
  const scenarioValRef = useRef(scenario);
  const patientStateRef = useRef(patientState);
  const actionTimestampsRef = useRef(actionTimestamps);
  const difficultyModifiersRef = useRef<DifficultyModifiers | null>(null);

  useEffect(() => { stateRef.current = state; });
  useEffect(() => { scenarioValRef.current = scenario; });
  useEffect(() => { patientStateRef.current = patientState; });
  useEffect(() => { actionTimestampsRef.current = actionTimestamps; });

  // Initialize managers on scenario change using a ref to track initialization
  const scenarioRef = useRef(scenario.id);
  useEffect(() => {
    // Only reinitialize if scenario actually changed
    if (scenarioRef.current !== scenario.id || !patientState) {
      scenarioRef.current = scenario.id;

      const drugManager = getDrugEffectManager();
      const labManager = getDynamicLabManager();
      const teamManager = getTeamSimulationManager();

      drugManager.clear();
      labManager.initialize(scenario.id, Date.now());
      teamManager.initialize();

      // Use callback pattern to batch state updates
      const newPatientState = createInitialPatientState(
        scenario.id,
        scenario.baselineVitals,
      );

      // Schedule updates in a microtask to avoid synchronous setState in effect
      queueMicrotask(() => {
        setPatientState(newPatientState);
        setActionTimestamps({});
        setClinicalScore(null);
        setContextualHints([]);
      });
    }
  }, [scenario, patientState]);

  // Unified simulation loop — replaces 8 individual setInterval timers
  useEffect(() => {
    if (!state.isRunning) {
      if (loopRef.current) {
        loopRef.current.stop();
        loopRef.current = null;
      }
      return;
    }

    const loop = createSimulationLoop();
    loopRef.current = loop;

    // 1. Main timer (1000ms) — elapsed time
    loop.registerHandler({
      id: "main-timer",
      intervalMs: 1000,
      callback: () => {
        setElapsedTime(Date.now() - stateRef.current.startTime);
      },
    });

    // 2. Vitals animation (500ms) — smooth lerp
    loop.registerHandler({
      id: "vitals-animation",
      intervalMs: 500,
      callback: () => {
        dispatch({ type: "TICK_VITALS" });
      },
    });

    // 3. Deterioration (5000ms) — patient decline checks
    loop.registerHandler({
      id: "deterioration",
      intervalMs: 5000,
      callback: () => {
        const s = stateRef.current;
        const checks = checkDeteriorationRules(
          s.deteriorationRules,
          s.actionsTaken,
          Date.now(),
        );

        for (const check of checks) {
          if (check.shouldTrigger) {
            dispatch({
              type: "TRIGGER_DETERIORATION",
              payload: {
                ruleId: check.ruleId,
                vitalsUpdate: check.vitalsUpdate,
              },
            });
            dispatch({
              type: "ADD_EVENT",
              payload: {
                type: "deterioration",
                description: check.description,
              },
            });

            if (patientStateRef.current && previousVitalsRef.current) {
              const alert = generateDeteriorationAlert(
                previousVitalsRef.current,
                s.vitals,
                patientStateRef.current,
              );
              if (alert) {
                dispatch({
                  type: "ADD_CHAT_MESSAGE",
                  payload: { sender: "patient", content: alert },
                });
              }
            }
          }
        }

        previousVitalsRef.current = { ...s.vitals };
      },
    });

    // 5. Vitals snapshot (10000ms) — debrief timeline
    loop.registerHandler({
      id: "vitals-snapshot",
      intervalMs: 10000,
      callback: () => {
        vitalsSnapshotsRef.current.push({
          timestamp: Date.now(),
          vitals: { ...stateRef.current.vitals },
        });
      },
    });

    if (state.isPaused) {
      // Don't start the loop if already paused
    } else {
      loop.start();
    }

    return () => {
      loop.stop();
      if (loopRef.current === loop) {
        loopRef.current = null;
      }
    };
  }, [state.isRunning]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle pause/resume via the loop
  useEffect(() => {
    if (!loopRef.current || !state.isRunning) return;
    if (state.isPaused) {
      loopRef.current.pause();
    } else {
      loopRef.current.resume();
    }
  }, [state.isPaused, state.isRunning]);

  // Compute difficulty modifiers as derived state
  const difficultyModifiers = useMemo(() => {
    if (difficulty === "adaptive" && state.isRunning) {
      const perf = calculateAdaptivePerformance(
        state.actionsTaken,
        scenario.correctActions,
        state.score.communicationErrors,
        elapsedTime,
      );
      return getDifficultyModifiers("adaptive", perf);
    }
    return getDifficultyModifiers(difficulty);
  }, [
    difficulty,
    state.isRunning,
    state.actionsTaken,
    scenario.correctActions,
    state.score.communicationErrors,
    elapsedTime,
  ]);
  useEffect(() => { difficultyModifiersRef.current = difficultyModifiers; }, [difficultyModifiers]);

  // Compute checklist result as derived state
  const checklistResult = useMemo(() => {
    if (!checklist || checklist.items.length === 0) return null;
    return calculateChecklistResult(checklist);
  }, [checklist]);

  // Compute clinical score as derived state
  const computedClinicalScore = useMemo(() => {
    if (state.actionsTaken.length > 0 && state.isRunning) {
      return calculateClinicalScore(
        state.actionsTaken,
        actionTimestamps,
        scenario.id,
        state.startTime,
        state.score.communicationErrors,
      );
    }
    return clinicalScore;
  }, [
    state.actionsTaken,
    actionTimestamps,
    scenario.id,
    state.startTime,
    state.score.communicationErrors,
    state.isRunning,
    clinicalScore,
  ]);

  // Compute contextual hints as derived state
  const computedContextualHints = useMemo(() => {
    if (state.isRunning) {
      const suggestions = generateContextualSuggestions(
        scenario.id,
        state.actionsTaken[state.actionsTaken.length - 1] || null,
        {
          spo2: state.vitals.spo2,
          bpSystolic: state.vitals.bpSystolic,
          hr: state.vitals.hr,
          temp: state.vitals.temp,
          respRate: state.vitals.respRate,
        },
        state.actionsTaken,
      );
      return suggestions.slice(0, 3).map((s) => s.content);
    }
    return contextualHints;
  }, [
    state.actionsTaken,
    state.vitals,
    scenario.id,
    state.isRunning,
    contextualHints,
  ]);

  const sendDoctorMessage = useCallback(
    (message: string) => {
      // Add doctor message
      dispatch({
        type: "ADD_CHAT_MESSAGE",
        payload: { sender: "doctor", content: message },
      });

      // Check for jargon
      const jargonMatches = detectJargon(message);
      const hasJargonInMessage = jargonMatches.length > 0;

      if (hasJargonInMessage) {
        const suggestion = getJargonSuggestion(jargonMatches);
        dispatch({
          type: "ADD_FEEDBACK",
          payload: {
            type: "jargon",
            message: `Jargon detected. ${suggestion}`,
          },
        });
      }

      // Check for team delegation commands
      const delegation = parseDelegationCommand(message);
      if (delegation) {
        const teamManager = getTeamSimulationManager();
        const task = teamManager.delegateTask(delegation.task, delegation.role);
        if (task) {
          setTeamTasks((prev) => [...prev, task]);
          const availableTeam = teamManager.getAvailableTeam();
          const assignedMember = availableTeam.find(
            (m) => m.role === task.assignedTo,
          );
          if (assignedMember) {
            const response = teamManager.generateTeamResponse(
              delegation.task,
              assignedMember,
            );
            dispatch({
              type: "ADD_MDT_MESSAGE",
              payload: { sender: assignedMember.name, content: response },
            });
          }

          // Listen for task completion
          teamManager.onTaskComplete((completedTask) => {
            setTeamTasks((prev) =>
              prev.map((t) => (t.id === completedTask.id ? completedTask : t)),
            );
            if (completedTask.result) {
              dispatch({
                type: "ADD_MDT_MESSAGE",
                payload: { sender: "Team", content: completedTask.result },
              });
            }
          });
        }
      }

      // Parse intents and process them
      const intents: MedicalIntent[] = parseAllIntents(message);

      for (const intent of intents) {
        const update = processIntent(intent, state, scenario.labResults);

        if (update.vitalsUpdate) {
          dispatch({ type: "SET_TARGET_VITALS", payload: update.vitalsUpdate });
        }

        if (update.newEvents) {
          for (const event of update.newEvents) {
            dispatch({
              type: "ADD_EVENT",
              payload: { type: event.type, description: event.description },
            });
          }
        }

        if (update.labOrder) {
          dispatch({ type: "ORDER_LAB", payload: update.labOrder });

          // Record lab order for dynamic labs
          const labManager = getDynamicLabManager();
          labManager.recordAction(
            `order_${update.labOrder.name.toLowerCase().replace(/\s+/g, "_")}`,
            Date.now(),
          );

          // Auto-complete labs after delay - use name-based completion for stability
          const labName = update.labOrder.name;
          setTimeout(
            () => {
              dispatch({
                type: "COMPLETE_LAB_BY_NAME",
                payload: { name: labName },
              });
            },
            5000 + Math.random() * 5000,
          );
        }

        if (update.actionRecorded) {
          dispatch({ type: "RECORD_ACTION", payload: update.actionRecorded });

          // Record timestamp for scoring
          setActionTimestamps((prev) => ({
            ...prev,
            [update.actionRecorded!]: Date.now(),
          }));

          // Record action for drug effects
          const drugManager = getDrugEffectManager();
          const hasDrugKinetics = DRUG_KINETICS.some(
            (d) => d.actionId === update.actionRecorded,
          );
          if (hasDrugKinetics) {
            drugManager.addDrug(update.actionRecorded, Date.now());
          }

          // Record action for dynamic labs
          const labManager = getDynamicLabManager();
          labManager.recordAction(update.actionRecorded, Date.now());

          // Assess action and provide feedback
          const assessment = assessAction(
            update.actionRecorded,
            scenario.id,
            state.actionsTaken,
            (Date.now() - state.startTime) / 1000,
          );

          if (assessment.feedback && assessment.feedback !== "Action noted") {
            dispatch({
              type: "ADD_FEEDBACK",
              payload: {
                type: assessment.isHarmful
                  ? "error"
                  : assessment.isUnnecessary
                    ? "warning"
                    : "info",
                message: assessment.feedback,
              },
            });
          }

          // Update patient state
          if (patientState) {
            const newPatientState = updatePatientState(
              patientState,
              update.actionRecorded,
              state.vitals,
            );
            setPatientState(newPatientState);
          }
        }

        if (update.preventsDeteriorationRules) {
          dispatch({
            type: "PREVENT_DETERIORATION",
            payload: { ruleIds: update.preventsDeteriorationRules },
          });
        }
      }

      // Track fluid boluses for complication checks
      const newActions = intents.map((i) => i.action).filter(Boolean);
      for (const act of newActions) {
        if (act === "fluid_bolus") {
          fluidCountRef.current += 1;
        }
      }

      // Update OSCE checklist
      const allActions = [
        ...state.actionsTaken,
        ...newActions.filter((a): a is string => !!a),
      ];
      const doctorMessages = state.chatMessages
        .filter((m) => m.sender === "doctor")
        .map((m) => m.content)
        .concat(message);
      setChecklist((prev) => {
        if (!prev) return prev;
        return updateChecklist(
          prev,
          allActions,
          doctorMessages,
          state.score.communicationErrors,
          Date.now(),
        );
      });

      // Check complications
      if (difficultyModifiers.complicationsEnabled) {
        setComplications((prevRules) => {
          const results = checkComplications(
            prevRules,
            allActions,
            actionTimestamps,
            state.startTime,
            fluidCountRef.current,
          );
          let updatedRules = prevRules;
          for (const r of results) {
            if (r.shouldTrigger) {
              updatedRules = markComplicationTriggered(updatedRules, r.rule.id);
              // Apply vitals effects
              if (Object.keys(r.rule.vitalsEffect).length > 0) {
                dispatch({
                  type: "SET_TARGET_VITALS",
                  payload: r.rule.vitalsEffect,
                });
              }
              // Show feedback
              if (r.rule.feedbackMessage) {
                dispatch({
                  type: "ADD_FEEDBACK",
                  payload: { type: "error", message: r.rule.feedbackMessage },
                });
              }
              // Patient message
              if (r.rule.patientMessage) {
                dispatch({
                  type: "ADD_CHAT_MESSAGE",
                  payload: {
                    sender: "patient",
                    content: r.rule.patientMessage,
                  },
                });
              }
              // Add event
              dispatch({
                type: "ADD_EVENT",
                payload: {
                  type: "deterioration",
                  description: `Complication: ${r.rule.name}`,
                },
              });
            }
          }
          return updatedRules;
        });
      }

      // Generate patient response after a short delay
      setTimeout(
        () => {
          // Use enhanced response if we have an action, otherwise use basic response
          const lastAction =
            intents.length > 0 ? intents[intents.length - 1].action : null;
          let patientResponse: string;

          if (lastAction && patientState) {
            patientResponse = generateContextualResponse(
              lastAction,
              patientState,
              state.vitals,
              scenario.id,
            );
          } else {
            patientResponse = generatePatientResponse(
              message,
              hasJargonInMessage,
            );
          }

          dispatch({
            type: "ADD_CHAT_MESSAGE",
            payload: { sender: "patient", content: patientResponse },
          });
        },
        1000 + Math.random() * 1500,
      );
    },
    [
      state,
      scenario.labResults,
      scenario.id,
      patientState,
      difficultyModifiers.complicationsEnabled,
      actionTimestamps,
    ],
  );

  const sendMDTMessage = useCallback((sender: string, message: string) => {
    dispatch({
      type: "ADD_MDT_MESSAGE",
      payload: { sender, content: message },
    });
  }, []);

  const startSimulation = useCallback(() => {
    // Initialize all managers
    const drugManager = getDrugEffectManager();
    const labManager = getDynamicLabManager();
    const teamManager = getTeamSimulationManager();

    drugManager.clear();
    labManager.initialize(scenario.id, Date.now());
    teamManager.initialize();

    // Initialize imaging manager
    const imgManager = getImagingManager();
    imgManager.initialize(scenario.id);

    setPatientState(
      createInitialPatientState(scenario.id, scenario.baselineVitals),
    );
    setActionTimestamps({});
    setClinicalScore(null);
    setTeamTasks([]);
    setContextualHints([]);
    previousVitalsRef.current = { ...scenario.baselineVitals };
    vitalsSnapshotsRef.current = [];
    setLastSessionId(null);

    // P1: Initialize checklist & complications for this scenario + difficulty
    setChecklist(getChecklistForScenario(scenario.id));
    const modifiers = getDifficultyModifiers(difficulty);
    if (modifiers.complicationsEnabled) {
      setComplications(getComplicationsForScenario(scenario.id));
    } else {
      setComplications([]);
    }
    fluidCountRef.current = 0;

    // Reset advisory cooldowns
    resetAdvisoryCooldowns();

    dispatch({ type: "START_SIMULATION" });
    dispatch({
      type: "ADD_EVENT",
      payload: { type: "alert", description: "Simulation started" },
    });

    // Log activity
    const sessionUser = sessionStorage.getItem("clinical-sim-auth-session");
    if (sessionUser) {
      try {
        const user = JSON.parse(sessionUser);
        logActivity({
          id: uuidv4(),
          userName: user.name,
          userRole: user.role,
          action: "session_started",
          scenarioId: scenario.id,
          scenarioName: scenario.name,
          timestamp: Date.now(),
        });
      } catch { /* ignore */ }
    }
  }, [scenario, difficulty]);

  const pauseSimulation = useCallback(() => {
    dispatch({ type: "PAUSE_SIMULATION" });
  }, []);

  const resumeSimulation = useCallback(() => {
    dispatch({ type: "RESUME_SIMULATION" });
  }, []);

  const endSimulation = useCallback(() => {
    dispatch({ type: "END_SIMULATION" });
    dispatch({
      type: "ADD_EVENT",
      payload: { type: "alert", description: "Simulation ended" },
    });

    // Calculate final score
    const finalScore = calculateClinicalScore(
      state.actionsTaken,
      actionTimestamps,
      scenario.id,
      state.startTime,
      state.score.communicationErrors,
    );
    setClinicalScore(finalScore);

    // Build and save session record
    const endTime = Date.now();
    const sessionId = uuidv4();
    const criticalActions = scenario.correctActions;
    const missedActions = criticalActions.filter(
      (a) => !state.actionsTaken.includes(a),
    );

    const actionRecords: ActionRecord[] = state.actionsTaken.map((action) => ({
      action,
      timestamp: actionTimestamps[action] || state.startTime,
      elapsedSeconds: actionTimestamps[action]
        ? (actionTimestamps[action] - state.startTime) / 1000
        : 0,
    }));

    const session: SessionRecord = {
      id: sessionId,
      scenarioId: scenario.id,
      scenarioName: scenario.name,
      startTime: state.startTime,
      endTime,
      durationMs: endTime - state.startTime,
      score: { ...state.score },
      clinicalScore: finalScore,
      actionsTaken: actionRecords,
      events: [...state.events],
      feedbackLogs: [...state.feedbackLogs],
      vitalsSnapshots: [...vitalsSnapshotsRef.current],
      missedActions,
      grade: finalScore.grade,
      totalScore: finalScore.totalScore,
      maxPossibleScore: finalScore.maxPossibleScore,
    };

    saveSession(session).then(() => {
      setLastSessionId(sessionId);
    });

    // Log activity
    const sessionUser = sessionStorage.getItem("clinical-sim-auth-session");
    if (sessionUser) {
      try {
        const user = JSON.parse(sessionUser);
        logActivity({
          id: uuidv4(),
          userName: user.name,
          userRole: user.role,
          action: "session_ended",
          scenarioId: scenario.id,
          scenarioName: scenario.name,
          details: `Grade: ${finalScore.grade}, Score: ${finalScore.totalScore}/${finalScore.maxPossibleScore}`,
          timestamp: Date.now(),
        });
      } catch { /* ignore */ }
    }

    // Check for benchmark and grade if exists
    getBenchmarkByScenario(scenario.id).then((benchmark) => {
      if (benchmark && benchmark.expectedActions.length > 0) {
        const result = gradeSession(actionRecords, benchmark, state.startTime);
        setBenchmarkResult(result);
      } else {
        setBenchmarkResult(null);
      }
    });
  }, [
    state.actionsTaken,
    actionTimestamps,
    scenario,
    state.startTime,
    state.score,
    state.events,
    state.feedbackLogs,
  ]);

  const changeDifficulty = useCallback((level: DifficultyLevel) => {
    setDifficulty(level);
  }, []);

  const resetSimulation = useCallback(() => {
    // Reset all managers
    resetDrugEffectManager();
    resetDynamicLabManager();
    resetTeamSimulationManager();
    resetImagingManager();

    const newState = createInitialSimulationStateForScenario(scenario);
    dispatch({ type: "RESET_SIMULATION", payload: newState });
    setElapsedTime(0);
    setPatientState(null);
    setTeamTasks([]);
    setContextualHints([]);
    setActionTimestamps({});
    setClinicalScore(null);
    vitalsSnapshotsRef.current = [];
    setLastSessionId(null);
    setChecklist(null);
    setComplications([]);
    setBenchmarkResult(null);
    resetAdvisoryCooldowns();
    fluidCountRef.current = 0;
  }, [scenario]);

  const changeScenario = useCallback((newScenario: ScenarioDefinition) => {
    // Reset all managers
    resetDrugEffectManager();
    resetDynamicLabManager();
    resetTeamSimulationManager();
    resetImagingManager();

    setScenario(newScenario);
    const newState = createInitialSimulationStateForScenario(newScenario);
    dispatch({ type: "RESET_SIMULATION", payload: newState });
    setElapsedTime(0);
    setPatientState(null);
    setTeamTasks([]);
    setContextualHints([]);
    setActionTimestamps({});
    setClinicalScore(null);
    vitalsSnapshotsRef.current = [];
    setLastSessionId(null);
    setChecklist(null);
    setComplications([]);
    setBenchmarkResult(null);
    resetAdvisoryCooldowns();
    fluidCountRef.current = 0;
  }, []);

  return (
    <SimulationContext.Provider
      value={{
        state,
        scenario,
        dispatch,
        sendDoctorMessage,
        sendMDTMessage,
        startSimulation,
        pauseSimulation,
        resumeSimulation,
        endSimulation,
        resetSimulation,
        changeScenario,
        elapsedTime,
        // Enhanced features
        clinicalScore: computedClinicalScore,
        patientState,
        teamTasks,
        contextualHints: computedContextualHints,
        actionTimestamps,
        lastSessionId,
        // P1: Difficulty, Checklists, Complications
        difficulty,
        difficultyModifiers,
        changeDifficulty,
        checklist,
        checklistResult,
        complications,
        // Benchmark
        benchmarkResult,
      }}
    >
      <PharmacologyProvider
        loopRef={loopRef}
        isRunning={state.isRunning}
        baselineVitals={scenario.baselineVitals}
        dispatch={dispatch}
      >
        <LabsProvider
          loopRef={loopRef}
          isRunning={state.isRunning}
        >
          <TeamProvider
            loopRef={loopRef}
            isRunning={state.isRunning}
            sendDoctorMessage={sendDoctorMessage}
            dispatch={dispatch}
            stateRef={stateRef}
            scenarioRef={scenarioValRef}
            difficultyModifiersRef={difficultyModifiersRef}
          >
            <ImagingProvider dispatch={dispatch}>
              {children}
            </ImagingProvider>
          </TeamProvider>
        </LabsProvider>
      </PharmacologyProvider>
    </SimulationContext.Provider>
  );
}
