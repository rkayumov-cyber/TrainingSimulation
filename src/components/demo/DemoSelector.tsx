import { useState } from "react";
import {
  ArrowLeft,
  Heart,
  Thermometer,
  Syringe,
  Brain,
  HeartOff,
  Star,
  TrendingDown,
  AlertTriangle,
} from "lucide-react";
import { demoRegistry } from "../../data/demo";

interface DemoSelectorProps {
  onSelectDemo: (scenarioId: string, level: "excellent" | "mediocre" | "poor") => void;
  onBack: () => void;
}

const iconMap: Record<string, React.ReactNode> = {
  thermometer: <Thermometer className="w-6 h-6" />,
  heart: <Heart className="w-6 h-6" />,
  syringe: <Syringe className="w-6 h-6" />,
  brain: <Brain className="w-6 h-6" />,
  "heart-off": <HeartOff className="w-6 h-6" />,
};

const iconColorMap: Record<string, string> = {
  thermometer: "text-emerald-400",
  heart: "text-red-400",
  syringe: "text-amber-400",
  brain: "text-purple-400",
  "heart-off": "text-red-500",
};

const levelConfig = {
  excellent: {
    label: "Excellent",
    grade: "A",
    icon: <Star className="w-4 h-4" />,
    color: "text-emerald-400",
    bg: "bg-emerald-900/20 border-emerald-800/40 hover:bg-emerald-900/40",
    desc: "Textbook performance",
  },
  mediocre: {
    label: "Mediocre",
    grade: "C",
    icon: <TrendingDown className="w-4 h-4" />,
    color: "text-amber-400",
    bg: "bg-amber-900/20 border-amber-800/40 hover:bg-amber-900/40",
    desc: "Common mistakes",
  },
  poor: {
    label: "Poor",
    grade: "F",
    icon: <AlertTriangle className="w-4 h-4" />,
    color: "text-red-400",
    bg: "bg-red-900/20 border-red-800/40 hover:bg-red-900/40",
    desc: "Critical errors",
  },
} as const;

export function DemoSelector({ onSelectDemo, onBack }: DemoSelectorProps) {
  const [hoveredScenario, setHoveredScenario] = useState<string | null>(null);

  return (
    <div className="h-screen bg-slate-950 text-white flex flex-col">
      {/* Header */}
      <div className="border-b border-slate-800 px-6 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div className="w-px h-6 bg-slate-700" />
          <div>
            <h1 className="text-xl font-bold text-white">Demo Library</h1>
            <p className="text-slate-400 text-sm mt-0.5">
              Step through pre-built simulation demos to understand scoring,
              sequencing, and best practices
            </p>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="px-6 py-3 border-b border-slate-800/50 flex items-center gap-6">
        {(["excellent", "mediocre", "poor"] as const).map((level) => {
          const cfg = levelConfig[level];
          return (
            <div key={level} className="flex items-center gap-2">
              <span className={cfg.color}>{cfg.icon}</span>
              <span className="text-xs text-slate-400">
                <span className={`font-semibold ${cfg.color}`}>
                  Grade {cfg.grade}
                </span>{" "}
                — {cfg.desc}
              </span>
            </div>
          );
        })}
      </div>

      {/* Scenario grid */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
          {demoRegistry.map((entry) => (
            <div
              key={entry.scenarioId}
              className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden"
              onMouseEnter={() => setHoveredScenario(entry.scenarioId)}
              onMouseLeave={() => setHoveredScenario(null)}
            >
              {/* Scenario header */}
              <div className="px-4 py-3 border-b border-slate-800/50 flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center ${iconColorMap[entry.scenarioIcon] || "text-slate-400"}`}
                >
                  {iconMap[entry.scenarioIcon] || (
                    <Thermometer className="w-6 h-6" />
                  )}
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm">
                    {entry.scenarioName}
                  </h3>
                  <p className="text-slate-500 text-xs">
                    3 performance levels available
                  </p>
                </div>
              </div>

              {/* Level buttons */}
              <div className="p-3 space-y-2">
                {(["excellent", "mediocre", "poor"] as const).map((level) => {
                  const cfg = levelConfig[level];
                  const transcript = entry.transcripts[level];
                  const scorePercent = Math.round(
                    (transcript.totalScore / transcript.maxPossibleScore) * 100,
                  );

                  return (
                    <button
                      key={level}
                      onClick={() => onSelectDemo(entry.scenarioId, level)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg border transition-colors ${cfg.bg}`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={cfg.color}>{cfg.icon}</span>
                        <div className="text-left">
                          <span className={`text-sm font-medium ${cfg.color}`}>
                            {cfg.label}
                          </span>
                          <span className="text-xs text-slate-500 ml-2">
                            Grade {cfg.grade}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-mono text-slate-400">
                          {transcript.totalScore}/{transcript.maxPossibleScore}
                        </span>
                        <span className="text-xs text-slate-600 ml-1">
                          ({scorePercent}%)
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
