import { useState, useCallback } from "react";
import { getKnowledgeService } from "../services/knowledge";
import type { SearchResult } from "../types/knowledge";

export interface KnowledgeHint {
  id: string;
  query: string;
  results: SearchResult[];
  timestamp: number;
}

export function useKnowledge() {
  const [isSearching, setIsSearching] = useState(false);
  const [lastHint, setLastHint] = useState<KnowledgeHint | null>(null);
  const [error, setError] = useState<string | null>(null);

  const knowledgeService = getKnowledgeService();

  const searchKnowledge = useCallback(
    async (query: string, context?: { scenario?: string; action?: string }) => {
      if (!query.trim()) return null;

      setIsSearching(true);
      setError(null);

      try {
        const { results } = await knowledgeService.searchWithContext(
          query,
          context,
        );

        const hint: KnowledgeHint = {
          id: `hint-${Date.now()}`,
          query,
          results,
          timestamp: Date.now(),
        };

        setLastHint(hint);
        return hint;
      } catch (e) {
        setError(e instanceof Error ? e.message : "Search failed");
        return null;
      } finally {
        setIsSearching(false);
      }
    },
    [knowledgeService],
  );

  const getRelevantInfo = useCallback(
    async (action: string, scenario: string) => {
      // Build a query based on the action and scenario
      const queries: Record<string, string> = {
        administer_oxygen: "oxygen therapy indications dosing",
        administer_fluids: "fluid resuscitation guidelines",
        administer_antibiotics: "antibiotic therapy sepsis empiric",
        order_blood_cultures: "blood culture collection timing",
        check_vitals: "vital signs assessment monitoring",
        administer_epinephrine: "epinephrine anaphylaxis dosing",
        administer_aspirin: "aspirin acute coronary syndrome",
        order_ecg: "ECG interpretation cardiac",
        order_troponin: "troponin cardiac biomarker",
        administer_salbutamol: "salbutamol bronchodilator asthma",
      };

      const baseQuery = queries[action] || action.replace(/_/g, " ");
      return searchKnowledge(`${baseQuery} ${scenario}`, { scenario, action });
    },
    [searchKnowledge],
  );

  const clearHint = useCallback(() => {
    setLastHint(null);
  }, []);

  return {
    isSearching,
    lastHint,
    error,
    searchKnowledge,
    getRelevantInfo,
    clearHint,
  };
}
