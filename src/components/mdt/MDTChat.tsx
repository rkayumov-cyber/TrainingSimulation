import { useState, useRef, useEffect } from "react";
import {
  ChevronDown,
  ChevronUp,
  Users,
  Send,
  CheckCircle,
  X,
  MessageCircle,
} from "lucide-react";
import { useSimulation, useTeam } from "../../context";

function getUrgencyDot(urgency: "critical" | "important" | "fyi") {
  switch (urgency) {
    case "critical":
      return "bg-red-400";
    case "important":
      return "bg-amber-400";
    case "fyi":
      return "bg-blue-400";
  }
}

export function MDTChat() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [message, setMessage] = useState("");
  const {
    state,
    sendMDTMessage,
    difficultyModifiers,
  } = useSimulation();
  const {
    advisoryMessages,
    acceptAdvisory,
    dismissAdvisory,
  } = useTeam();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const pendingAdvisories = advisoryMessages.filter(
    (a) => a.status === "pending",
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [state.mdtMessages, advisoryMessages]);

  const handleSend = () => {
    if (!message.trim() || !state.isRunning) return;
    sendMDTMessage("Doctor", message.trim());
    setMessage("");
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const badgeCount =
    state.mdtMessages.length +
    (difficultyModifiers.advisoryModeEnabled ? pendingAdvisories.length : 0);

  return (
    <div className="border-t border-slate-700 bg-slate-800">
      {/* Header - Always visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-700/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-purple-400" />
          <span className="text-slate-300 font-medium text-sm">
            Team Chat
            {difficultyModifiers.advisoryModeEnabled && (
              <span className="text-slate-500 text-xs ml-1">
                (Advisory Mode)
              </span>
            )}
          </span>
          {badgeCount > 0 && (
            <span
              className={`text-white text-xs px-2 py-0.5 rounded-full ${
                pendingAdvisories.length > 0
                  ? "bg-amber-600 animate-pulse"
                  : "bg-purple-600"
              }`}
            >
              {badgeCount}
            </span>
          )}
        </div>
        {isExpanded ? (
          <ChevronDown className="w-4 h-4 text-slate-400" />
        ) : (
          <ChevronUp className="w-4 h-4 text-slate-400" />
        )}
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div className="border-t border-slate-700">
          {/* Pending advisory suggestions (if advisory mode enabled) */}
          {difficultyModifiers.advisoryModeEnabled &&
            pendingAdvisories.length > 0 && (
              <div className="p-3 space-y-2 border-b border-slate-700 bg-slate-900/50">
                <div className="flex items-center gap-1.5">
                  <MessageCircle className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-xs font-medium text-amber-400">
                    Team Suggestions
                  </span>
                </div>
                {pendingAdvisories.map((adv) => (
                  <div
                    key={adv.id}
                    className="bg-slate-800 rounded-lg p-3 border border-slate-700"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`w-2 h-2 rounded-full ${getUrgencyDot(adv.urgency)}`}
                          />
                          <span className="text-purple-400 text-xs font-medium">
                            {adv.fromName}
                          </span>
                          <span className="text-slate-500 text-xs">
                            {formatTime(adv.timestamp)}
                          </span>
                        </div>
                        <p className="text-slate-200 text-sm">
                          {adv.suggestion}
                        </p>
                        <p className="text-slate-500 text-xs mt-1 italic">
                          {adv.reasoning}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => acceptAdvisory(adv.id)}
                        disabled={!state.isRunning || state.isPaused}
                        className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded bg-emerald-700 hover:bg-emerald-600 text-white transition-colors disabled:opacity-50"
                      >
                        <CheckCircle className="w-3 h-3" />
                        Accept & Execute
                      </button>
                      <button
                        onClick={() => dismissAdvisory(adv.id)}
                        className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors"
                      >
                        <X className="w-3 h-3" />
                        Dismiss
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

          {/* Messages */}
          <div className="h-48 overflow-y-auto p-3 space-y-2">
            {state.mdtMessages.length === 0 && (
              <div className="text-slate-500 text-sm text-center py-4">
                Internal team chat — patient cannot see this
                {difficultyModifiers.advisoryModeEnabled && (
                  <p className="text-xs mt-1">
                    Team members will suggest actions as the case progresses
                  </p>
                )}
              </div>
            )}

            {state.mdtMessages.map((msg) => (
              <div key={msg.id} className="bg-slate-900 rounded-lg px-3 py-2">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-purple-400 text-sm font-medium">
                    {msg.sender}
                  </span>
                  <span className="text-slate-500 text-xs">
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
                <p className="text-slate-300 text-sm mt-1">{msg.content}</p>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-slate-700">
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSend();
                }}
                placeholder="Message your team..."
                disabled={!state.isRunning || state.isPaused}
                className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50"
              />
              <button
                onClick={handleSend}
                disabled={!message.trim() || !state.isRunning || state.isPaused}
                className="bg-purple-600 hover:bg-purple-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
