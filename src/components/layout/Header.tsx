import {
  Play,
  Pause,
  RotateCcw,
  Clock,
  AlertTriangle,
  Volume2,
  VolumeX,
  BarChart3,
  Square,
  Wrench,
  ArrowLeft,
} from "lucide-react";
import { useSimulation } from "../../context";
import { useSound } from "../../hooks";
import { ScenarioSelector } from "./ScenarioSelector";
import { DifficultySelector } from "./DifficultySelector";

interface HeaderProps {
  onViewDashboard?: () => void;
  onEndSimulation?: () => void;
  onOpenBuilder?: () => void;
  onEditCustomScenario?: (scenarioId: string) => void;
  onBack?: () => void;
}

export function Header({ onViewDashboard, onEndSimulation, onOpenBuilder, onEditCustomScenario, onBack }: HeaderProps) {
  const {
    state,
    scenario,
    elapsedTime,
    startSimulation,
    pauseSimulation,
    resumeSimulation,
    resetSimulation,
    changeScenario,
    difficulty,
    changeDifficulty,
  } = useSimulation();

  const { soundEnabled, toggleSound } = useSound();

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <header className="bg-slate-900 border-b border-slate-700 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors text-sm mr-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          )}
          <h1 className="text-xl font-bold text-white">Clinical Simulation</h1>
          <span className="text-slate-400">|</span>
          <ScenarioSelector
            currentScenario={scenario}
            onSelect={changeScenario}
            disabled={state.isRunning}
            onEditCustom={onEditCustomScenario}
          />
          <span className="text-slate-400">|</span>
          <DifficultySelector
            current={difficulty}
            onChange={changeDifficulty}
            disabled={state.isRunning}
          />
        </div>

        <div className="flex items-center gap-6">
          {/* Timer */}
          <div className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-lg">
            <Clock className="w-5 h-5 text-slate-400" />
            <span className="font-mono text-xl text-white">
              {formatTime(elapsedTime)}
            </span>
          </div>

          {/* Status indicator */}
          {state.isRunning && !state.isPaused && (
            <div className="flex items-center gap-2 text-emerald-400">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span className="text-sm font-medium">LIVE</span>
            </div>
          )}

          {state.isPaused && (
            <div className="flex items-center gap-2 text-amber-400">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm font-medium">PAUSED</span>
            </div>
          )}

          {/* Scenario Builder */}
          {onOpenBuilder && (
            <button
              onClick={onOpenBuilder}
              className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-400 hover:text-white transition-colors"
              title="Scenario Builder"
            >
              <Wrench className="w-5 h-5" />
            </button>
          )}

          {/* Progress Dashboard */}
          {onViewDashboard && (
            <button
              onClick={onViewDashboard}
              className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-400 hover:text-white transition-colors"
              title="Progress Dashboard"
            >
              <BarChart3 className="w-5 h-5" />
            </button>
          )}

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className={`p-2 rounded-lg transition-colors ${
              soundEnabled
                ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                : "bg-slate-700 hover:bg-slate-600 text-slate-400"
            }`}
            title={soundEnabled ? "Mute sounds" : "Enable sounds"}
          >
            {soundEnabled ? (
              <Volume2 className="w-5 h-5" />
            ) : (
              <VolumeX className="w-5 h-5" />
            )}
          </button>

          {/* Controls */}
          <div className="flex items-center gap-2">
            {!state.isRunning ? (
              <button
                onClick={startSimulation}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Play className="w-4 h-4" />
                Start
              </button>
            ) : state.isPaused ? (
              <button
                onClick={resumeSimulation}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Play className="w-4 h-4" />
                Resume
              </button>
            ) : (
              <button
                onClick={pauseSimulation}
                className="flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Pause className="w-4 h-4" />
                Pause
              </button>
            )}

            {onEndSimulation && (
              <button
                onClick={onEndSimulation}
                className="flex items-center gap-2 bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Square className="w-4 h-4" />
                End
              </button>
            )}

            <button
              onClick={resetSimulation}
              className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
