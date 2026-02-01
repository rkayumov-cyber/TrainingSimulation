import { useState, useEffect, useCallback, useRef } from "react";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  Trophy,
} from "lucide-react";
import { getDemoTranscript } from "../../data/demo";
import type { DemoTranscript, DemoStep } from "../../types/demo";
import { DemoStepChat } from "./DemoStepChat";
import { DemoStepVitals } from "./DemoStepVitals";
import { DemoStepAnnotation } from "./DemoStepAnnotation";
import { DemoStepTimeline } from "./DemoStepTimeline";
import { DemoAudioControls } from "./DemoAudioControls";
import { soundService } from "../../services/audio/soundService";

interface DemoWalkthroughPageProps {
  scenarioId: string;
  level: "excellent" | "mediocre" | "poor";
  onBack: () => void;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

const gradeColor: Record<string, string> = {
  A: "text-emerald-400",
  C: "text-amber-400",
  F: "text-red-400",
};

const gradeBg: Record<string, string> = {
  A: "bg-emerald-500/10 border-emerald-500/20",
  C: "bg-amber-500/10 border-amber-500/20",
  F: "bg-red-500/10 border-red-500/20",
};

const levelLabel: Record<string, string> = {
  excellent: "Excellent",
  mediocre: "Mediocre",
  poor: "Poor",
};

const toneSettings: Record<string, { rate: number; pitch: number }> = {
  calm: { rate: 0.9, pitch: 1.0 },
  urgent: { rate: 1.1, pitch: 1.1 },
  empathetic: { rate: 0.85, pitch: 0.95 },
  confused: { rate: 0.8, pitch: 1.05 },
};

function speakText(
  text: string,
  options: {
    rate?: number;
    pitch?: number;
    isDoctor?: boolean;
    onEnd?: () => void;
    onStart?: () => void;
  } = {},
): void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  const baseRate = options.rate ?? 0.9;
  utterance.rate = options.isDoctor ? baseRate * 1.05 : baseRate * 0.95;
  utterance.pitch = options.isDoctor ? 0.9 : 1.0;
  utterance.lang = "en-US";

  const voices = window.speechSynthesis.getVoices();
  const preferred =
    voices.find(
      (v) =>
        v.lang.startsWith("en") && v.name.toLowerCase().includes("natural"),
    ) ?? voices.find((v) => v.lang.startsWith("en-US"));
  if (preferred) utterance.voice = preferred;

  if (options.onStart) utterance.onstart = options.onStart;
  if (options.onEnd) utterance.onend = options.onEnd;
  utterance.onerror = () => options.onEnd?.();

  window.speechSynthesis.speak(utterance);
}

function cancelSpeech(): void {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

export function DemoWalkthroughPage({
  scenarioId,
  level,
  onBack,
}: DemoWalkthroughPageProps) {
  const [transcript, setTranscript] = useState<DemoTranscript | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [autoPlaying, setAutoPlaying] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [soundsEnabled, setSoundsEnabled] = useState(false);
  const [speechRate, setSpeechRate] = useState(0.9);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(
    null,
  );
  const [isHeartbeatActive, setIsHeartbeatActive] = useState(false);

  const autoPlayRef = useRef(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const ttsSupported =
    typeof window !== "undefined" && "speechSynthesis" in window;

  useEffect(() => {
    const t = getDemoTranscript(scenarioId, level);
    setTranscript(t || null);
    setCurrentStep(0);
    setAutoPlaying(false);
    cancelSpeech();
    soundService.stopHeartbeat();
    setIsHeartbeatActive(false);
  }, [scenarioId, level]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancelSpeech();
      soundService.stopHeartbeat();
    };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentStep]);

  // Speak step dialogue when step changes (manual or auto-play)
  const speakStep = useCallback(
    (step: DemoStep, onComplete?: () => void) => {
      if (!ttsEnabled || !ttsSupported) {
        onComplete?.();
        return;
      }

      const tone = step.speakerTone
        ? toneSettings[step.speakerTone]
        : { rate: 1, pitch: 1 };

      const speakDoctor = () => {
        if (step.doctorMessage) {
          setSpeakingMessageId(`doc-${step.id}`);
          setIsSpeaking(true);
          speakText(step.doctorMessage, {
            rate: speechRate * tone.rate,
            pitch: tone.pitch,
            isDoctor: true,
            onEnd: () => {
              setSpeakingMessageId(null);
              setIsSpeaking(false);
              speakPatient();
            },
          });
        } else {
          speakPatient();
        }
      };

      const speakPatient = () => {
        if (step.patientResponse) {
          setSpeakingMessageId(`pat-${step.id}`);
          setIsSpeaking(true);
          speakText(step.patientResponse, {
            rate: speechRate * tone.rate,
            pitch: tone.pitch,
            isDoctor: false,
            onEnd: () => {
              setSpeakingMessageId(null);
              setIsSpeaking(false);
              onComplete?.();
            },
          });
        } else {
          onComplete?.();
        }
      };

      speakDoctor();
    },
    [ttsEnabled, ttsSupported, speechRate],
  );

  // Handle vitals sounds on step change
  useEffect(() => {
    if (!transcript) return;
    const step = transcript.steps[currentStep];
    if (!step) return;

    if (soundsEnabled) {
      const { hr, spo2, bpSystolic } = step.vitals;

      // Only start heartbeat if HR > 0 (not cardiac arrest)
      if (hr > 0) {
        soundService.setEnabled(true);
        soundService.startHeartbeat(hr);
        setIsHeartbeatActive(true);
      } else {
        soundService.stopHeartbeat();
        setIsHeartbeatActive(false);
      }

      // Check alarm thresholds
      soundService.playAlarmForVitals({ hr, spo2, bpSystolic });
    } else {
      soundService.stopHeartbeat();
      setIsHeartbeatActive(false);
    }
  }, [currentStep, soundsEnabled, transcript]);

  // Auto-play with TTS awareness
  useEffect(() => {
    autoPlayRef.current = autoPlaying;
  }, [autoPlaying]);

  const advanceAutoPlay = useCallback(() => {
    if (!transcript || !autoPlayRef.current) return;

    setCurrentStep((prev) => {
      const next = prev + 1;
      if (next >= transcript.steps.length) {
        setAutoPlaying(false);
        return prev;
      }

      const nextStep = transcript.steps[next];

      if (ttsEnabled && ttsSupported) {
        // Speak the step, then schedule next advance after speech + 1s pause
        speakStep(nextStep, () => {
          setTimeout(() => {
            if (autoPlayRef.current) {
              advanceAutoPlay();
            }
          }, 1000);
        });
      } else {
        // No TTS: advance on 3s timer
        setTimeout(() => {
          if (autoPlayRef.current) {
            advanceAutoPlay();
          }
        }, 3000);
      }

      return next;
    });
  }, [transcript, ttsEnabled, ttsSupported, speakStep]);

  // Kick off auto-play
  useEffect(() => {
    if (autoPlaying && transcript) {
      if (ttsEnabled && ttsSupported) {
        // Speak current step first, then begin advancing
        const currentStepData = transcript.steps[currentStep];
        speakStep(currentStepData, () => {
          setTimeout(() => {
            if (autoPlayRef.current) {
              advanceAutoPlay();
            }
          }, 1000);
        });
      } else {
        // No TTS: just use timer
        const timer = setTimeout(() => {
          if (autoPlayRef.current) {
            advanceAutoPlay();
          }
        }, 3000);
        return () => clearTimeout(timer);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlaying]);

  // Stop speech when autoplay stops
  useEffect(() => {
    if (!autoPlaying) {
      // Don't cancel mid-message for manual TTS clicks
    }
  }, [autoPlaying]);

  const goNext = useCallback(() => {
    if (!transcript) return;
    cancelSpeech();
    setIsSpeaking(false);
    setSpeakingMessageId(null);
    setCurrentStep((prev) => {
      const next = prev < transcript.steps.length - 1 ? prev + 1 : prev;
      // Speak when manually navigating
      if (ttsEnabled && next !== prev) {
        setTimeout(() => speakStep(transcript.steps[next]), 50);
      }
      return next;
    });
  }, [transcript, ttsEnabled, speakStep]);

  const goPrev = useCallback(() => {
    cancelSpeech();
    setIsSpeaking(false);
    setSpeakingMessageId(null);
    setCurrentStep((prev) => (prev > 0 ? prev - 1 : prev));
  }, []);

  const goToStep = useCallback(
    (index: number) => {
      cancelSpeech();
      setIsSpeaking(false);
      setSpeakingMessageId(null);
      setCurrentStep(index);
      setAutoPlaying(false);
    },
    [],
  );

  const toggleAutoPlay = useCallback(() => {
    setAutoPlaying((prev) => {
      if (prev) {
        cancelSpeech();
        setIsSpeaking(false);
        setSpeakingMessageId(null);
      }
      return !prev;
    });
  }, []);

  const reset = useCallback(() => {
    cancelSpeech();
    setIsSpeaking(false);
    setSpeakingMessageId(null);
    setCurrentStep(0);
    setAutoPlaying(false);
  }, []);

  const toggleTts = useCallback(() => {
    setTtsEnabled((prev) => {
      if (prev) {
        cancelSpeech();
        setIsSpeaking(false);
        setSpeakingMessageId(null);
      }
      return !prev;
    });
  }, []);

  const toggleSounds = useCallback(() => {
    setSoundsEnabled((prev) => {
      if (prev) {
        soundService.stopHeartbeat();
        setIsHeartbeatActive(false);
      }
      return !prev;
    });
  }, []);

  const handleSpeakMessage = useCallback(
    (text: string) => {
      if (!ttsEnabled || !ttsSupported) return;
      cancelSpeech();
      setIsSpeaking(true);
      speakText(text, {
        rate: speechRate,
        isDoctor: true,
        onStart: () => setIsSpeaking(true),
        onEnd: () => {
          setIsSpeaking(false);
          setSpeakingMessageId(null);
        },
      });
    },
    [ttsEnabled, ttsSupported, speechRate],
  );

  if (!transcript) {
    return (
      <div className="h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-slate-400 text-sm">Demo not found.</div>
      </div>
    );
  }

  const step = transcript.steps[currentStep];
  const prevVitals =
    currentStep > 0 ? transcript.steps[currentStep - 1].vitals : undefined;
  const isLast = currentStep === transcript.steps.length - 1;
  const isFirst = currentStep === 0;
  const scorePercent = Math.round(
    (transcript.totalScore / transcript.maxPossibleScore) * 100,
  );

  return (
    <div className="h-screen bg-slate-950 text-white flex flex-col">
      {/* Header */}
      <div className="border-b border-slate-800 px-5 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div className="w-px h-5 bg-slate-700" />
          <div>
            <h1 className="text-sm font-semibold text-white">
              {transcript.scenarioName}
            </h1>
            <span className="text-xs text-slate-500">
              {levelLabel[level]} Performance Demo
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div
            className={`px-3 py-1 rounded-lg border ${gradeBg[transcript.grade]}`}
          >
            <span className={`text-sm font-bold ${gradeColor[transcript.grade]}`}>
              Grade {transcript.grade}
            </span>
            <span className="text-xs text-slate-400 ml-2">
              {transcript.totalScore}/{transcript.maxPossibleScore} ({scorePercent}%)
            </span>
          </div>
          <div className="flex items-center gap-1 bg-slate-800 rounded-lg px-1 py-0.5">
            <span className="text-xs text-slate-400 px-1.5 font-mono">
              {currentStep + 1}/{transcript.steps.length}
            </span>
          </div>
        </div>
      </div>

      {/* Main content - split screen */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Chat replay */}
        <div className="w-1/2 border-r border-slate-800 flex flex-col">
          <div className="px-4 py-2 border-b border-slate-800/50 bg-slate-900/30">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                Chat Replay
              </h3>
              <span className="text-xs font-mono text-slate-500">
                {formatTime(step.elapsedSeconds)}
              </span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <DemoStepChat
              steps={transcript.steps}
              currentStepIndex={currentStep}
              ttsEnabled={ttsEnabled}
              onSpeakMessage={handleSpeakMessage}
              speakingMessageId={speakingMessageId}
            />
            <div ref={chatEndRef} />
          </div>
        </div>

        {/* Right: Clinical data + annotation */}
        <div className="w-1/2 flex flex-col overflow-y-auto">
          {/* Audio Controls */}
          <div className="px-4 py-3 border-b border-slate-800/50">
            <DemoAudioControls
              ttsEnabled={ttsEnabled}
              onToggleTts={toggleTts}
              soundsEnabled={soundsEnabled}
              onToggleSounds={toggleSounds}
              speechRate={speechRate}
              onSpeechRateChange={setSpeechRate}
              isSpeaking={isSpeaking}
              isHeartbeatActive={isHeartbeatActive}
              ttsSupported={ttsSupported}
            />
          </div>

          {/* Vitals */}
          <div className="px-4 py-3 border-b border-slate-800/50">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
              Vitals at {formatTime(step.elapsedSeconds)}
            </h3>
            <DemoStepVitals vitals={step.vitals} previousVitals={prevVitals} />
          </div>

          {/* Annotation & feedback */}
          <div className="px-4 py-3 border-b border-slate-800/50">
            <DemoStepAnnotation step={step} />
          </div>

          {/* Timeline */}
          <div className="px-4 py-3 flex-1">
            <DemoStepTimeline
              steps={transcript.steps}
              currentStepIndex={currentStep}
              onJumpToStep={goToStep}
            />
          </div>

          {/* Final summary card when on last step */}
          {isLast && (
            <div className="px-4 pb-4">
              <div
                className={`rounded-xl border p-4 ${gradeBg[transcript.grade]}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Trophy
                    className={`w-5 h-5 ${gradeColor[transcript.grade]}`}
                  />
                  <span
                    className={`text-lg font-bold ${gradeColor[transcript.grade]}`}
                  >
                    Final Grade: {transcript.grade}
                  </span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {transcript.summary}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom controls */}
      <div className="border-t border-slate-800 px-5 py-3 flex items-center justify-between shrink-0 bg-slate-900/50">
        {/* Progress bar */}
        <div className="flex-1 mr-6">
          <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-300"
              style={{
                width: `${((currentStep + 1) / transcript.steps.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={reset}
            className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800"
            title="Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={goPrev}
            disabled={isFirst}
            className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed"
            title="Previous step"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={toggleAutoPlay}
            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors ${
              autoPlaying
                ? "bg-amber-600 hover:bg-amber-500 text-white"
                : "bg-emerald-600 hover:bg-emerald-500 text-white"
            }`}
          >
            {autoPlaying ? (
              <>
                <Pause className="w-4 h-4" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                {isLast ? "Done" : "Auto-Play"}
              </>
            )}
          </button>
          <button
            onClick={goNext}
            disabled={isLast}
            className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed"
            title="Next step"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
