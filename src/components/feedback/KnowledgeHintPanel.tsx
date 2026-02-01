import { useState, useEffect, useRef } from "react";
import { BookOpen, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { useSimulation } from "../../context";
import { useKnowledge } from "../../hooks";
import type { SearchResult } from "../../types/knowledge";

export function KnowledgeHintPanel() {
  const { state } = useSimulation();
  const { getRelevantInfo, lastHint, isSearching } = useKnowledge();
  const [isExpanded, setIsExpanded] = useState(true);
  const lastActionRef = useRef<string | null>(null);

  // Fetch relevant knowledge when a new action is taken
  useEffect(() => {
    const latestAction = state.actionsTaken[state.actionsTaken.length - 1];
    if (latestAction && latestAction !== lastActionRef.current) {
      lastActionRef.current = latestAction;
      getRelevantInfo(latestAction, state.scenarioId);
    }
  }, [state.actionsTaken, state.scenarioId, getRelevantInfo]);

  if (!lastHint || lastHint.results.length === 0) {
    return null;
  }

  return (
    <div className="p-4 space-y-3 border-t border-slate-700">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between"
      >
        <h2 className="text-white font-semibold text-lg flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-400" />
          Clinical Reference
          {isSearching && (
            <span className="text-xs text-slate-400 animate-pulse">
              Searching...
            </span>
          )}
        </h2>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-slate-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-400" />
        )}
      </button>

      {isExpanded && (
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {lastHint.results
            .slice(0, 3)
            .map((result: SearchResult, index: number) => (
              <div
                key={`${result.chunk.id}-${index}`}
                className="bg-blue-950/30 border border-blue-800/50 rounded-lg p-3"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-blue-400 text-xs font-medium flex items-center gap-1">
                    <ExternalLink className="w-3 h-3" />
                    {result.document.title}
                  </span>
                  <span className="text-emerald-400 text-xs">
                    {(result.score * 100).toFixed(0)}% relevant
                  </span>
                </div>
                <p className="text-slate-300 text-sm line-clamp-2">
                  {result.chunk.content}
                </p>
                <p className="text-slate-500 text-xs mt-1">
                  Page {result.chunk.pageNumber}
                </p>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
