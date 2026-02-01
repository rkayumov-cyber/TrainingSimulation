import { Volume2, VolumeX, Heart, HeartOff, Info } from "lucide-react";

interface DemoAudioControlsProps {
  ttsEnabled: boolean;
  onToggleTts: () => void;
  soundsEnabled: boolean;
  onToggleSounds: () => void;
  speechRate: number;
  onSpeechRateChange: (rate: number) => void;
  isSpeaking: boolean;
  isHeartbeatActive: boolean;
  ttsSupported: boolean;
}

export function DemoAudioControls({
  ttsEnabled,
  onToggleTts,
  soundsEnabled,
  onToggleSounds,
  speechRate,
  onSpeechRateChange,
  isSpeaking,
  isHeartbeatActive,
  ttsSupported,
}: DemoAudioControlsProps) {
  return (
    <div className="bg-slate-900/60 border border-slate-700/50 rounded-lg p-3 space-y-3">
      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
        Audio Controls
      </h4>

      {/* TTS Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {ttsEnabled ? (
            <Volume2
              className={`w-4 h-4 text-emerald-400 ${isSpeaking ? "animate-pulse" : ""}`}
            />
          ) : (
            <VolumeX className="w-4 h-4 text-slate-500" />
          )}
          <span className="text-sm text-slate-300">Narration</span>
        </div>
        <button
          onClick={onToggleTts}
          disabled={!ttsSupported}
          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
            ttsEnabled ? "bg-emerald-600" : "bg-slate-700"
          } ${!ttsSupported ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
          title={ttsSupported ? undefined : "Speech synthesis not supported in this browser"}
        >
          <span
            className={`inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform ${
              ttsEnabled ? "translate-x-4" : "translate-x-0.5"
            }`}
          />
        </button>
      </div>

      {/* Vitals Sound Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {soundsEnabled ? (
            <Heart
              className={`w-4 h-4 text-red-400 ${isHeartbeatActive ? "animate-pulse" : ""}`}
            />
          ) : (
            <HeartOff className="w-4 h-4 text-slate-500" />
          )}
          <span className="text-sm text-slate-300">Vitals</span>
        </div>
        <button
          onClick={onToggleSounds}
          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
            soundsEnabled ? "bg-red-600" : "bg-slate-700"
          } cursor-pointer`}
        >
          <span
            className={`inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform ${
              soundsEnabled ? "translate-x-4" : "translate-x-0.5"
            }`}
          />
        </button>
      </div>

      {/* Speed Slider */}
      {ttsEnabled && (
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Speed</span>
            <span className="text-xs font-mono text-slate-400">
              {speechRate.toFixed(1)}x
            </span>
          </div>
          <input
            type="range"
            min="0.7"
            max="1.3"
            step="0.1"
            value={speechRate}
            onChange={(e) => onSpeechRateChange(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-700 rounded-full appearance-none cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3
              [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-400
              [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3
              [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-emerald-400 [&::-moz-range-thumb]:border-0"
          />
        </div>
      )}

      {/* Info */}
      <div className="flex items-start gap-1.5 pt-1 border-t border-slate-800">
        <Info className="w-3 h-3 text-slate-500 mt-0.5 shrink-0" />
        <p className="text-[10px] text-slate-500 leading-tight">
          Audio reads dialogue aloud as you step through the demo.
        </p>
      </div>
    </div>
  );
}
