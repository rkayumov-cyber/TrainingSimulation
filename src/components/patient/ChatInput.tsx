import { useState, useRef, useMemo, useCallback } from "react";
import type { KeyboardEvent } from "react";
import { Send, Command, Mic, MicOff, ListChecks, Pen } from "lucide-react";
import { useSimulation } from "../../context";
import { useSpeechRecognition } from "../../hooks";
import {
  filterSuggestionsGrouped,
  getCategoryColor,
  getCategoryBgColor,
  CATEGORY_META,
} from "../../services/referee";
import type { ActionSuggestion } from "../../services/referee";
import { generateMultipleChoiceOptions } from "../../services/referee/multipleChoice";
import type { MultipleChoiceOption } from "../../services/referee/multipleChoice";
import { QuickOrders } from "./QuickOrders";

function getUrgencyStyles(urgency: MultipleChoiceOption["urgency"]) {
  switch (urgency) {
    case "critical":
      return "border-red-500/50 bg-red-950/30 hover:bg-red-900/40 hover:border-red-400";
    case "important":
      return "border-amber-500/50 bg-amber-950/30 hover:bg-amber-900/40 hover:border-amber-400";
    case "supportive":
      return "border-blue-500/50 bg-blue-950/30 hover:bg-blue-900/40 hover:border-blue-400";
    case "distractor":
      return "border-slate-600 bg-slate-800/50 hover:bg-slate-700/50 hover:border-slate-500";
  }
}

function getUrgencyLabel(urgency: MultipleChoiceOption["urgency"]) {
  switch (urgency) {
    case "critical":
      return { text: "Urgent", className: "text-red-400 bg-red-900/40" };
    case "important":
      return {
        text: "Recommended",
        className: "text-amber-400 bg-amber-900/40",
      };
    case "supportive":
      return { text: "Consider", className: "text-blue-400 bg-blue-900/40" };
    case "distractor":
      return { text: "Option", className: "text-slate-400 bg-slate-800" };
  }
}

export function ChatInput() {
  const [message, setMessage] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const [showFreeText, setShowFreeText] = useState(false);
  const { state, scenario, sendDoctorMessage, difficultyModifiers } =
    useSimulation();
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const {
    isListening,
    isSupported: micSupported,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition();

  // Callbacks for speech recognition results
  const handleSpeechResult = useCallback((finalText: string) => {
    setMessage(finalText);
    inputRef.current?.focus();
  }, []);

  const handleSpeechInterim = useCallback((interimText: string) => {
    setMessage(interimText);
  }, []);

  // Derive grouped suggestions from message (autocomplete)
  const groupedSuggestions = useMemo(
    () => filterSuggestionsGrouped(message),
    [message],
  );
  const flatSuggestions = useMemo(
    () => groupedSuggestions.flatMap((g) => g.suggestions),
    [groupedSuggestions],
  );
  const showSuggestions =
    isFocused && flatSuggestions.length > 0 && message.length >= 2;

  // Generate MC options when in beginner mode
  const mcEnabled = difficultyModifiers.multipleChoiceEnabled && !showFreeText;
  const multipleChoiceOptions = useMemo(() => {
    if (!mcEnabled || !state.isRunning) return [];
    return generateMultipleChoiceOptions(
      scenario.id,
      state.actionsTaken,
      state.vitals,
      scenario.correctActions,
    );
  }, [
    mcEnabled,
    state.isRunning,
    scenario.id,
    state.actionsTaken,
    state.vitals,
    scenario.correctActions,
  ]);

  const handleSend = () => {
    if (!message.trim() || !state.isRunning) return;

    sendDoctorMessage(message.trim());
    setMessage("");
    setSelectedIndex(0);
  };

  const handleMCSelect = (option: MultipleChoiceOption) => {
    if (!state.isRunning || state.isPaused) return;
    sendDoctorMessage(option.command);
  };

  const handleQuickOrder = (command: string) => {
    if (!state.isRunning || state.isPaused) return;
    sendDoctorMessage(command);
  };

  const selectSuggestion = (command: string) => {
    setMessage(command);
    setSelectedIndex(0);
    inputRef.current?.focus();
  };

  const toggleMic = () => {
    if (isListening) {
      stopListening();
    } else {
      resetTranscript();
      startListening(handleSpeechResult, handleSpeechInterim);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (showSuggestions && flatSuggestions.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % flatSuggestions.length);
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(
          (prev) =>
            (prev - 1 + flatSuggestions.length) % flatSuggestions.length,
        );
        return;
      }
      if (
        e.key === "Tab" ||
        (e.key === "Enter" && flatSuggestions.length > 0)
      ) {
        e.preventDefault();
        selectSuggestion(flatSuggestions[selectedIndex].command);
        return;
      }
      if (e.key === "Escape") {
        setIsFocused(false);
        inputRef.current?.blur();
        return;
      }
    }

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Build flat index for tracking selected item across grouped display
  const getFlatIndex = (suggestion: ActionSuggestion): number => {
    return flatSuggestions.indexOf(suggestion);
  };

  // ── Multiple Choice mode ────────────────────
  if (mcEnabled && multipleChoiceOptions.length > 0 && state.isRunning) {
    return (
      <div className="border-t border-slate-700 bg-slate-800">
        <div className="flex items-center justify-between px-4 pt-4 mb-3">
          <div className="flex items-center gap-2">
            <ListChecks className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-medium text-slate-300">
              What would you do next?
            </span>
          </div>
          <button
            onClick={() => setShowFreeText(true)}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors px-2 py-1 rounded hover:bg-slate-700"
          >
            <Pen className="w-3 h-3" />
            Type instead
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 px-4">
          {multipleChoiceOptions.map((option) => {
            const urgencyLabel = getUrgencyLabel(option.urgency);
            return (
              <button
                key={option.id}
                onClick={() => handleMCSelect(option)}
                disabled={state.isPaused}
                className={`text-left p-3 rounded-lg border transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed ${getUrgencyStyles(option.urgency)}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded ${getCategoryBgColor(option.category)} ${getCategoryColor(option.category)}`}
                  >
                    {option.category}
                  </span>
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded ${urgencyLabel.className}`}
                  >
                    {urgencyLabel.text}
                  </span>
                </div>
                <p className="text-white text-sm font-medium">
                  {option.command}
                </p>
                <p className="text-slate-400 text-xs mt-0.5">
                  {option.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* Quick Orders below MC options */}
        <div className="px-4 pt-3 pb-4">
          <p className="text-xs text-slate-500 mb-2">
            Or browse all available orders:
          </p>
          <QuickOrders
            onSelectAction={handleQuickOrder}
            actionsTaken={state.actionsTaken}
            disabled={!state.isRunning || state.isPaused}
          />
        </div>
      </div>
    );
  }

  // ── Free text mode (default / expert / intermediate) ────
  return (
    <div className="border-t border-slate-700 bg-slate-800 relative">
      {/* Grouped autocomplete suggestions */}
      {showSuggestions && flatSuggestions.length > 0 && (
        <div className="absolute bottom-full left-4 right-4 mb-2 bg-slate-900 border border-slate-700 rounded-lg shadow-xl overflow-hidden max-h-64 overflow-y-auto">
          <div className="px-3 py-2 border-b border-slate-700 flex items-center gap-2">
            <Command className="w-4 h-4 text-slate-500" />
            <span className="text-xs text-slate-500">
              Quick Actions - Use arrow keys to navigate, Tab to select
            </span>
          </div>
          {groupedSuggestions.map((group) => {
            const meta = CATEGORY_META.find(
              (m) => m.category === group.category,
            );
            return (
              <div key={group.category}>
                <div className="px-3 py-1.5 border-b border-slate-800 bg-slate-900/80">
                  <span
                    className={`text-[10px] uppercase tracking-wider font-semibold ${getCategoryColor(group.category)}`}
                  >
                    {meta?.icon} {meta?.label ?? group.category}
                  </span>
                </div>
                {group.suggestions.map((suggestion) => {
                  const flatIdx = getFlatIndex(suggestion);
                  return (
                    <button
                      key={suggestion.command}
                      onClick={() => selectSuggestion(suggestion.command)}
                      onMouseEnter={() => setSelectedIndex(flatIdx)}
                      className={`w-full text-left px-3 py-2 flex items-center gap-3 transition-colors ${
                        flatIdx === selectedIndex
                          ? "bg-slate-800"
                          : "hover:bg-slate-800/50"
                      }`}
                    >
                      <span
                        className={`text-xs px-2 py-0.5 rounded ${getCategoryBgColor(suggestion.category)} ${getCategoryColor(suggestion.category)}`}
                      >
                        {suggestion.category}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium">
                          {suggestion.command}
                        </p>
                        <p className="text-slate-500 text-xs truncate">
                          {suggestion.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}

      {/* Show toggle back to MC mode if available */}
      {difficultyModifiers.multipleChoiceEnabled &&
        showFreeText &&
        state.isRunning && (
          <div className="px-4 pt-3">
            <button
              onClick={() => setShowFreeText(false)}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors px-2 py-1 rounded hover:bg-slate-700"
            >
              <ListChecks className="w-3 h-3" />
              Show options
            </button>
          </div>
        )}

      {/* Quick Orders above text input */}
      {state.isRunning && (
        <div className="px-4 pt-3 pb-2">
          <QuickOrders
            onSelectAction={handleQuickOrder}
            actionsTaken={state.actionsTaken}
            disabled={!state.isRunning || state.isPaused}
          />
        </div>
      )}

      <div className="flex gap-2 px-4 pb-1">
        <textarea
          ref={inputRef}
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            setSelectedIndex(0);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            // Delay hiding to allow click on suggestions
            setTimeout(() => setIsFocused(false), 150);
          }}
          placeholder={
            isListening
              ? "Listening..."
              : state.isRunning
                ? 'Type to speak or enter a command (e.g., "give oxygen")...'
                : "Start simulation to begin..."
          }
          disabled={!state.isRunning || state.isPaused}
          className={`flex-1 bg-slate-900 border rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none disabled:opacity-50 disabled:cursor-not-allowed ${
            isListening ? "border-red-500" : "border-slate-600"
          }`}
          rows={2}
        />
        {micSupported && (
          <button
            onClick={toggleMic}
            disabled={!state.isRunning || state.isPaused}
            className={`p-3 rounded-lg transition-colors self-end disabled:opacity-50 disabled:cursor-not-allowed ${
              isListening
                ? "bg-red-600 hover:bg-red-500 text-white animate-pulse"
                : "bg-slate-700 hover:bg-slate-600 text-slate-300"
            }`}
            title={isListening ? "Stop listening" : "Start voice input"}
          >
            {isListening ? (
              <MicOff className="w-5 h-5" />
            ) : (
              <Mic className="w-5 h-5" />
            )}
          </button>
        )}
        <button
          onClick={handleSend}
          disabled={!message.trim() || !state.isRunning || state.isPaused}
          className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white p-3 rounded-lg transition-colors self-end"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
      <p className="text-xs text-slate-500 px-4 pb-3 pt-1">
        Enter to send | Tab for autocomplete | Shift+Enter for new line
        {micSupported ? " | Mic for voice" : ""}
      </p>
    </div>
  );
}
