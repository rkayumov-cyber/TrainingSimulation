import { useState, useEffect } from "react";
import {
  ScanLine,
  Clock,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { useSimulation } from "../../context";
import { ECGInterpretationPanel } from "./ECGInterpretation";
import { ABGInterpreter } from "./ABGInterpreter";
import { getImagingManager, interpretABG } from "../../services/imaging";
import type { ImagingStudy } from "../../types/imaging";

export function ImagingPanel() {
  const { state, orderImaging, imagingStudies } = useSimulation();
  const [expandedStudy, setExpandedStudy] = useState<string | null>(null);
  const [showECG, setShowECG] = useState(false);
  const [showABG, setShowABG] = useState(false);
  const [, setTick] = useState(0);

  // Force re-render periodically to update pending → completed transitions
  useEffect(() => {
    if (!state.isRunning) return;
    const interval = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [state.isRunning]);

  const manager = getImagingManager();
  const ecgInterpretation = manager.getECGInterpretation();
  const abgValues = manager.getABGValues();
  const abgInterpretation = abgValues ? interpretABG(abgValues) : null;

  // Re-read studies from manager to catch completions
  const currentStudies: ImagingStudy[] = manager.getAllStudies();

  const available = currentStudies.filter((s) => s.status === "available");
  const pending = currentStudies.filter((s) => s.status === "pending");
  const completed = currentStudies.filter((s) => s.status === "completed");

  // Also include context-tracked studies for consistency
  const allCompleted = [...completed];
  // If context has additional studies not in manager
  for (const cs of imagingStudies) {
    if (
      cs.status === "completed" &&
      !allCompleted.find((s) => s.id === cs.id)
    ) {
      allCompleted.push(cs);
    }
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <ScanLine className="w-5 h-5 text-cyan-400" />
        <h3 className="text-white font-medium">
          Clinical Imaging & Diagnostics
        </h3>
      </div>

      {!state.isRunning && (
        <p className="text-slate-500 text-sm">
          Start a simulation to access imaging studies.
        </p>
      )}

      {/* Available Studies */}
      {state.isRunning && available.length > 0 && (
        <div>
          <h4 className="text-slate-400 text-xs uppercase tracking-wide mb-2">
            Available Studies
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {available.map((study) => (
              <button
                key={study.id}
                onClick={() => orderImaging(study.id)}
                className="bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-cyan-600 rounded-lg p-3 text-left transition-colors"
              >
                <p className="text-white text-sm font-medium">{study.name}</p>
                <p className="text-slate-500 text-xs mt-0.5">Click to order</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Pending Studies */}
      {pending.length > 0 && (
        <div>
          <h4 className="text-slate-400 text-xs uppercase tracking-wide mb-2">
            Pending
          </h4>
          <div className="space-y-2">
            {pending.map((study) => (
              <div
                key={study.id}
                className="bg-slate-800 border border-amber-800/50 rounded-lg p-3 flex items-center gap-3"
              >
                <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />
                <div>
                  <p className="text-white text-sm">{study.name}</p>
                  <p className="text-amber-400 text-xs flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Processing...
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completed Studies */}
      {allCompleted.length > 0 && (
        <div>
          <h4 className="text-slate-400 text-xs uppercase tracking-wide mb-2">
            Completed
          </h4>
          <div className="space-y-2">
            {allCompleted.map((study) => (
              <div
                key={study.id}
                className="bg-slate-800 border border-emerald-800/50 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() =>
                    setExpandedStudy(
                      expandedStudy === study.id ? null : study.id,
                    )
                  }
                  className="w-full p-3 flex items-center gap-3 hover:bg-slate-750 transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <div className="flex-1 text-left">
                    <p className="text-white text-sm">{study.name}</p>
                    {study.findings && (
                      <p className="text-slate-400 text-xs truncate">
                        {study.findings.summary}
                      </p>
                    )}
                  </div>
                  {expandedStudy === study.id ? (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  )}
                </button>

                {expandedStudy === study.id && study.findings && (
                  <div className="border-t border-slate-700 p-3 space-y-2">
                    {/* Urgent findings */}
                    {study.findings.urgentFindings &&
                      study.findings.urgentFindings.length > 0 && (
                        <div className="bg-red-900/30 border border-red-800 rounded p-2">
                          <div className="flex items-center gap-1 mb-1">
                            <AlertTriangle className="w-3 h-3 text-red-400" />
                            <span className="text-red-400 text-xs font-medium">
                              Urgent
                            </span>
                          </div>
                          {study.findings.urgentFindings.map((f, i) => (
                            <p key={i} className="text-red-300 text-xs">
                              {f}
                            </p>
                          ))}
                        </div>
                      )}

                    {/* Details */}
                    <div className="space-y-1">
                      {study.findings.details.map((detail, i) => (
                        <p
                          key={i}
                          className="text-slate-300 text-xs flex items-start gap-1"
                        >
                          <span className="text-slate-500 mt-0.5">•</span>
                          {detail}
                        </p>
                      ))}
                    </div>

                    {/* Normal findings */}
                    {study.findings.normalFindings &&
                      study.findings.normalFindings.length > 0 && (
                        <div className="mt-2">
                          {study.findings.normalFindings.map((f, i) => (
                            <p
                              key={i}
                              className="text-emerald-400 text-xs flex items-center gap-1"
                            >
                              <CheckCircle2 className="w-3 h-3" /> {f}
                            </p>
                          ))}
                        </div>
                      )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ECG Interpretation */}
      {state.isRunning && ecgInterpretation && (
        <div>
          <button
            onClick={() => setShowECG(!showECG)}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            {showECG ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
            ECG Interpretation
          </button>
          {showECG && <ECGInterpretationPanel data={ecgInterpretation} />}
        </div>
      )}

      {/* ABG Interpreter */}
      {state.isRunning && abgInterpretation && (
        <div>
          <button
            onClick={() => setShowABG(!showABG)}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            {showABG ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
            ABG Analysis
          </button>
          {showABG && <ABGInterpreter interpretation={abgInterpretation} />}
        </div>
      )}

      {/* Empty state */}
      {state.isRunning &&
        available.length === 0 &&
        pending.length === 0 &&
        allCompleted.length === 0 &&
        !ecgInterpretation &&
        !abgInterpretation && (
          <p className="text-slate-500 text-sm text-center py-4">
            No imaging studies available for this scenario.
          </p>
        )}
    </div>
  );
}
