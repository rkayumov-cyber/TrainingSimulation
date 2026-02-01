import { useEffect, useRef, useState } from "react";
import { useSimulation } from "../../context";
import { useSpeechSynthesis } from "../../hooks";
import { MessageBubble } from "./MessageBubble";
import { User, Volume2, VolumeX } from "lucide-react";

export function ChatWindow() {
  const { state, scenario } = useSimulation();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const lastMessageCountRef = useRef(state.chatMessages.length);

  const {
    speak,
    cancel,
    isSpeaking,
    isSupported: ttsSupported,
  } = useSpeechSynthesis();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [state.chatMessages]);

  // Speak new patient messages when TTS is enabled
  useEffect(() => {
    if (!ttsEnabled) return;

    const messages = state.chatMessages;
    if (messages.length > lastMessageCountRef.current) {
      const newMessages = messages.slice(lastMessageCountRef.current);
      for (const msg of newMessages) {
        if (msg.sender === "patient") {
          speak(msg.content);
        }
      }
    }
    lastMessageCountRef.current = messages.length;
  }, [state.chatMessages, ttsEnabled, speak]);

  const toggleTts = () => {
    if (ttsEnabled) {
      cancel();
    }
    setTtsEnabled(!ttsEnabled);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Patient Header */}
      <div className="bg-slate-800 px-4 py-3 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-600 flex items-center justify-center">
            <User className="w-5 h-5 text-slate-300" />
          </div>
          <div className="flex-1">
            <h2 className="text-white font-medium">{scenario.patientName}</h2>
            <p className="text-sm text-slate-400">Patient &bull; Room 4</p>
          </div>
          {ttsSupported && (
            <button
              onClick={toggleTts}
              className={`p-2 rounded-lg transition-colors ${
                ttsEnabled
                  ? "bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30"
                  : "bg-slate-700 text-slate-400 hover:bg-slate-600"
              }`}
              title={
                ttsEnabled ? "Disable patient voice" : "Enable patient voice"
              }
            >
              {ttsEnabled ? (
                <Volume2
                  className={`w-4 h-4 ${isSpeaking ? "animate-pulse" : ""}`}
                />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {state.chatMessages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-slate-500">
            <User className="w-12 h-12 mb-2 opacity-50" />
            <p className="text-center">
              {state.isRunning
                ? "Start talking to the patient..."
                : "Start the simulation to begin"}
            </p>
          </div>
        )}

        {state.chatMessages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
