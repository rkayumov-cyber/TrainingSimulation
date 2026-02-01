import { Heart, AlertTriangle } from "lucide-react";
import type { ECGInterpretation as ECGData } from "../../types/imaging";

interface ECGInterpretationProps {
  data: ECGData;
}

export function ECGInterpretationPanel({ data }: ECGInterpretationProps) {
  return (
    <div className="bg-slate-800 rounded-lg p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Heart className="w-4 h-4 text-red-400" />
        <h4 className="text-white font-medium text-sm">ECG Interpretation</h4>
      </div>

      {/* Urgent Findings */}
      {data.urgentFindings.length > 0 && (
        <div className="bg-red-900/30 border border-red-800 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span className="text-red-400 text-sm font-medium">
              Urgent Findings
            </span>
          </div>
          {data.urgentFindings.map((finding, i) => (
            <p key={i} className="text-red-300 text-sm">
              {finding}
            </p>
          ))}
        </div>
      )}

      {/* Structured Data */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-slate-900 rounded p-2">
          <span className="text-slate-500">Rhythm</span>
          <p className="text-white">{data.rhythm}</p>
        </div>
        <div className="bg-slate-900 rounded p-2">
          <span className="text-slate-500">Rate</span>
          <p className="text-white">{data.rate} bpm</p>
        </div>
        <div className="bg-slate-900 rounded p-2">
          <span className="text-slate-500">Axis</span>
          <p className="text-white">{data.axis}</p>
        </div>
        <div className="bg-slate-900 rounded p-2">
          <span className="text-slate-500">PR Interval</span>
          <p className="text-white">{data.prInterval}</p>
        </div>
        <div className="bg-slate-900 rounded p-2">
          <span className="text-slate-500">QRS Duration</span>
          <p className="text-white">{data.qrsDuration}</p>
        </div>
        <div className="bg-slate-900 rounded p-2">
          <span className="text-slate-500">QTc</span>
          <p className="text-white">{data.qtcInterval}</p>
        </div>
      </div>

      <div className="space-y-1 text-xs">
        <div className="bg-slate-900 rounded p-2">
          <span className="text-slate-500">ST Segment</span>
          <p
            className={
              data.stSegment.toLowerCase().includes("elevation")
                ? "text-red-400"
                : "text-white"
            }
          >
            {data.stSegment}
          </p>
        </div>
        <div className="bg-slate-900 rounded p-2">
          <span className="text-slate-500">T Waves</span>
          <p
            className={
              data.tWaves.toLowerCase().includes("hyperacute") ||
              data.tWaves.toLowerCase().includes("peaked")
                ? "text-amber-400"
                : "text-white"
            }
          >
            {data.tWaves}
          </p>
        </div>
      </div>

      <div className="bg-slate-900 rounded p-2 text-xs">
        <span className="text-slate-500">Overall Impression</span>
        <p className="text-emerald-400 font-medium mt-1">
          {data.overallImpression}
        </p>
      </div>
    </div>
  );
}
