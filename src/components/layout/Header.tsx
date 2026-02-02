import { useState, useRef, useEffect } from "react";
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
  MoreVertical,
  ListMusic,
  Gauge,
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

export function Header({
  onViewDashboard,
  onEndSimulation,
  onOpenBuilder,
  onEditCustomScenario,
  onBack,
}: HeaderProps) {
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
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <header className="bg-slate-900 border-b border-slate-700 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Left: Back, Title, Scenario badge */}
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors text-sm mr-1"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          )}
          <h1 className="text-lg font-bold text-white">Clinical Simulation</h1>
          <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full truncate max-w-[200px]">
            {scenario.name}
          </span>
        </div>

        {/* Center: Timer + Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-lg">
            <Clock className="w-4 h-4 text-slate-400" />
            <span className="font-mono text-lg text-white">
              {formatTime(elapsedTime)}
            </span>
          </div>

          {state.isRunning && !state.isPaused && (
            <div className="flex items-center gap-1.5 text-emerald-400">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-semibold">LIVE</span>
            </div>
          )}

          {state.isPaused && (
            <div className="flex items-center gap-1.5 text-amber-400">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span className="text-xs font-semibold">PAUSED</span>
            </div>
          )}
        </div>

        {/* Right: Controls + Overflow */}
        <div className="flex items-center gap-2">
          {/* Start / Resume / Pause */}
          {!state.isRunning ? (
            <button
              onClick={startSimulation}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg transition-colors text-sm"
            >
              <Play className="w-4 h-4" />
              Start
            </button>
          ) : state.isPaused ? (
            <button
              onClick={resumeSimulation}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg transition-colors text-sm"
            >
              <Play className="w-4 h-4" />
              Resume
            </button>
          ) : (
            <button
              onClick={pauseSimulation}
              className="flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-lg transition-colors text-sm"
            >
              <Pause className="w-4 h-4" />
              Pause
            </button>
          )}

          {/* End */}
          {onEndSimulation && (
            <button
              onClick={onEndSimulation}
              className="flex items-center gap-2 bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors text-sm"
            >
              <Square className="w-4 h-4" />
              End
            </button>
          )}

          {/* Overflow Menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-400 hover:text-white transition-colors"
              title="More options"
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-full mt-1 w-64 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-50 py-1 overflow-hidden">
                {/* Change Scenario */}
                <div className="px-3 py-2 border-b border-slate-700">
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-1.5">
                    <ListMusic className="w-3.5 h-3.5" />
                    Change Scenario
                  </div>
                  <ScenarioSelector
                    currentScenario={scenario}
                    onSelect={(id) => {
                      changeScenario(id);
                      setMenuOpen(false);
                    }}
                    disabled={state.isRunning}
                    onEditCustom={onEditCustomScenario}
                  />
                </div>

                {/* Difficulty */}
                <div className="px-3 py-2 border-b border-slate-700">
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-1.5">
                    <Gauge className="w-3.5 h-3.5" />
                    Difficulty
                  </div>
                  <DifficultySelector
                    current={difficulty}
                    onChange={(d) => {
                      changeDifficulty(d);
                      setMenuOpen(false);
                    }}
                    disabled={state.isRunning}
                  />
                </div>

                {/* Sound */}
                <button
                  onClick={() => {
                    toggleSound();
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-slate-300 hover:bg-slate-700 transition-colors"
                >
                  {soundEnabled ? (
                    <Volume2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <VolumeX className="w-4 h-4 text-slate-500" />
                  )}
                  {soundEnabled ? "Sound On" : "Sound Off"}
                </button>

                {/* Progress Dashboard */}
                {onViewDashboard && (
                  <button
                    onClick={() => {
                      onViewDashboard();
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-slate-300 hover:bg-slate-700 transition-colors"
                  >
                    <BarChart3 className="w-4 h-4 text-slate-400" />
                    Progress Dashboard
                  </button>
                )}

                {/* Scenario Builder (admin only) */}
                {onOpenBuilder && (
                  <button
                    onClick={() => {
                      onOpenBuilder();
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-slate-300 hover:bg-slate-700 transition-colors"
                  >
                    <Wrench className="w-4 h-4 text-slate-400" />
                    Scenario Builder
                  </button>
                )}

                {/* Reset */}
                <div className="border-t border-slate-700">
                  <button
                    onClick={() => {
                      resetSimulation();
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-400 hover:bg-slate-700 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reset Simulation
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
