import { useState } from "react";
import { Send } from "lucide-react";

interface ChatMessage {
  sender: "doctor" | "patient";
  content: string;
  intents?: string[];
}

interface PreviewChatProps {
  messages: ChatMessage[];
  onSend: (message: string) => void;
  isRunning: boolean;
}

export function PreviewChat({ messages, onSend, isRunning }: PreviewChatProps) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim() || !isRunning) return;
    onSend(input.trim());
    setInput("");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-2 p-2">
        {messages.length === 0 && (
          <p className="text-xs text-slate-600 text-center py-4">
            {isRunning
              ? "Type a message to test intent parsing..."
              : "Start the preview to begin testing."}
          </p>
        )}
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.sender === "doctor" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-lg px-3 py-2 text-xs ${
                msg.sender === "doctor"
                  ? "bg-emerald-600/20 text-emerald-300 border border-emerald-500/20"
                  : "bg-slate-800 text-slate-300 border border-slate-700"
              }`}
            >
              <p>{msg.content}</p>
              {msg.intents && msg.intents.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {msg.intents.map((intent, i) => (
                    <span
                      key={i}
                      className="bg-blue-500/20 text-blue-400 text-xs px-1.5 py-0.5 rounded border border-blue-500/20"
                    >
                      {intent.replace(/_/g, " ")}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="border-t border-slate-700 p-2">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={
              isRunning ? "Type a doctor message..." : "Start preview first"
            }
            disabled={!isRunning}
            className="flex-1 bg-slate-800 border border-slate-600 rounded px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={!isRunning || !input.trim()}
            className="p-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
