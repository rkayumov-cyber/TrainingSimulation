import type { ChatMessage } from "../../types";
import { User, Stethoscope } from "lucide-react";

interface MessageBubbleProps {
  message: ChatMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isDoctor = message.sender === "doctor";

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className={`flex gap-3 ${isDoctor ? "flex-row-reverse" : "flex-row"}`}>
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isDoctor ? "bg-blue-600" : "bg-slate-600"
        }`}
      >
        {isDoctor ? (
          <Stethoscope className="w-4 h-4 text-white" />
        ) : (
          <User className="w-4 h-4 text-white" />
        )}
      </div>

      {/* Message */}
      <div
        className={`flex flex-col ${isDoctor ? "items-end" : "items-start"} max-w-[80%]`}
      >
        <div
          className={`px-4 py-2 rounded-2xl ${
            isDoctor
              ? "bg-blue-600 text-white rounded-tr-sm"
              : "bg-slate-700 text-slate-100 rounded-tl-sm"
          }`}
        >
          <p className="text-sm leading-relaxed">{message.content}</p>
        </div>
        <span className="text-xs text-slate-500 mt-1 px-2">
          {isDoctor ? "Doctor" : "Patient"} • {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
}
