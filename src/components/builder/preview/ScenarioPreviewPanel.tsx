import { useState, useCallback, useRef, useEffect } from "react";
import { Play, Square, RotateCcw, Gauge } from "lucide-react";
import type { Vitals, DeteriorationRule } from "../../../types";
import type { ScenarioBuilderFormState } from "../../../types/scenarioBuilder";
import { parseAllIntents } from "../../../services/referee";
import { processIntent } from "../../../services/referee";
import { generatePatientResponse } from "../../../services/patient";
import { PreviewChat } from "./PreviewChat";
import { PreviewVitals } from "./PreviewVitals";
import { PreviewTimeline } from "./PreviewTimeline";

interface ScenarioPreviewPanelProps {
  form: ScenarioBuilderFormState;
}

interface ChatMsg {
  sender: "doctor" | "patient";
  content: string;
  intents?: string[];
}

export function ScenarioPreviewPanel({ form }: ScenarioPreviewPanelProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState<1 | 5 | 10>(1);
  const [vitals, setVitals] = useState<Vitals>({ ...form.baselineVitals });
  const [targetVitals, setTargetVitals] = useState<Vitals>({
    ...form.baselineVitals,
  });
  const [actionsTaken, setActionsTaken] = useState<string[]>([]);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [rules, setRules] = useState<DeteriorationRule[]>([]);

  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef(0);

  // Initialize rules from form
  const initializeRules = useCallback((): DeteriorationRule[] => {
    return form.deteriorationRules.map((r) => ({
      ...r,
      triggered: false,
      startTime: Date.now(),
    }));
  }, [form.deteriorationRules]);

  // Start
  const start = useCallback(() => {
    setIsRunning(true);
    setVitals({ ...form.baselineVitals });
    setTargetVitals({ ...form.baselineVitals });
    setActionsTaken([]);
    setMessages([]);
    setElapsedMs(0);
    setRules(initializeRules());
    startTimeRef.current = Date.now();
  }, [form.baselineVitals, initializeRules]);

  // Stop
  const stop = useCallback(() => {
    setIsRunning(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Reset
  const reset = useCallback(() => {
    stop();
    setVitals({ ...form.baselineVitals });
    setTargetVitals({ ...form.baselineVitals });
    setActionsTaken([]);
    setMessages([]);
    setElapsedMs(0);
    setRules([]);
  }, [form.baselineVitals, stop]);

  // Simulation tick
  useEffect(() => {
    if (!isRunning) return;

    timerRef.current = window.setInterval(() => {
      const tickMs = 500 * speed;

      setElapsedMs((prev) => prev + tickMs);

      // Animate vitals toward target
      setVitals((prev) => {
        const next = { ...prev };
        for (const key of Object.keys(next) as (keyof Vitals)[]) {
          const diff = targetVitals[key] - next[key];
          if (Math.abs(diff) > 0.1) {
            next[key] += diff * 0.05;
          }
        }
        return next;
      });

      // Check deterioration rules
      setRules((prev) =>
        prev.map((rule) => {
          if (rule.triggered) return rule;
          if (rule.preventedBy.some((a) => actionsTaken.includes(a)))
            return rule;

          const elapsed = (Date.now() - (rule.startTime || startTimeRef.current));
          const timerMs = rule.timerMinutes * 60000 / speed;

          if (elapsed >= timerMs) {
            // Trigger deterioration
            setTargetVitals((tv) => {
              const updated = { ...tv };
              for (const [key, val] of Object.entries(rule.effect)) {
                if (val !== undefined) {
                  updated[key as keyof Vitals] = val;
                }
              }
              return updated;
            });
            return { ...rule, triggered: true };
          }
          return rule;
        }),
      );
    }, 500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, speed, targetVitals, actionsTaken]);

  // Handle send message
  const handleSend = useCallback(
    (message: string) => {
      const intents = parseAllIntents(message);
      const intentActions = intents.map((i) => i.action);

      // Add doctor message with detected intents
      setMessages((prev) => [
        ...prev,
        { sender: "doctor", content: message, intents: intentActions },
      ]);

      // Process intents
      for (const intent of intents) {
        const update = processIntent(
          intent,
          {
            vitals,
            targetVitals: vitals,
            labsOrdered: [],
            labsCompleted: [],
            chatMessages: [],
            mdtMessages: [],
            events: [],
            feedbackLogs: [],
            actionsTaken,
            deteriorationRules: rules,
            score: {
              timeToAntibiotics: null,
              timeToOxygen: null,
              timeToFluids: null,
              communicationErrors: 0,
              totalActions: actionsTaken.length,
              correctActions: 0,
            },
            startTime: startTimeRef.current,
            isRunning: true,
            isPaused: false,
            scenarioId: "preview",
          },
          form.labResults,
        );

        if (update.vitalsUpdate) {
          setTargetVitals((prev) => ({ ...prev, ...update.vitalsUpdate }));
        }

        if (update.actionRecorded) {
          setActionsTaken((prev) => [...prev, update.actionRecorded!]);
        }
      }

      // Generate patient response
      setTimeout(() => {
        const response = generatePatientResponse(message, false);
        setMessages((prev) => [
          ...prev,
          { sender: "patient", content: response },
        ]);
      }, 500);
    },
    [vitals, actionsTaken, rules, form.labResults],
  );

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="h-full flex flex-col bg-slate-950">
      {/* Header */}
      <div className="p-3 border-b border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-white">Preview Sandbox</h3>
          <span className="text-xs text-slate-500 font-mono">
            {formatTime(elapsedMs)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* Speed */}
          <button
            onClick={() => setSpeed((s) => (s === 1 ? 5 : s === 5 ? 10 : 1))}
            className="flex items-center gap-1 px-2 py-1 text-xs bg-slate-800 text-slate-400 hover:text-white rounded transition-colors"
            title="Change speed"
          >
            <Gauge className="w-3 h-3" />
            {speed}x
          </button>

          {/* Controls */}
          {!isRunning ? (
            <button
              onClick={start}
              className="flex items-center gap-1 px-2 py-1 text-xs bg-emerald-600 hover:bg-emerald-500 text-white rounded transition-colors"
            >
              <Play className="w-3 h-3" />
              Start
            </button>
          ) : (
            <button
              onClick={stop}
              className="flex items-center gap-1 px-2 py-1 text-xs bg-red-600 hover:bg-red-500 text-white rounded transition-colors"
            >
              <Square className="w-3 h-3" />
              Stop
            </button>
          )}
          <button
            onClick={reset}
            className="p-1 text-slate-500 hover:text-white transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Vitals */}
      <div className="p-3 border-b border-slate-700">
        <PreviewVitals vitals={vitals} />
      </div>

      {/* Chat */}
      <div className="flex-1 overflow-hidden">
        <PreviewChat
          messages={messages}
          onSend={handleSend}
          isRunning={isRunning}
        />
      </div>

      {/* Timeline */}
      <div className="p-3 border-t border-slate-700">
        <PreviewTimeline
          rules={rules}
          elapsedMs={elapsedMs}
          actionsTaken={actionsTaken}
        />
      </div>
    </div>
  );
}
