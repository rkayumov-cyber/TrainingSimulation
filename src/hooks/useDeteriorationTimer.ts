import { useState, useEffect } from "react";
import { useSimulation } from "../context";
import { getRuleProgress } from "../services/deterioration";

export interface DeteriorationStatus {
  ruleId: string;
  condition: string;
  progress: number;
  isPrevented: boolean;
  isTriggered: boolean;
  timerMinutes: number;
}

export function useDeteriorationTimer(): DeteriorationStatus[] {
  const { state } = useSimulation();
  const [statuses, setStatuses] = useState<DeteriorationStatus[]>([]);

  useEffect(() => {
    const updateStatuses = () => {
      const now = Date.now();
      const newStatuses = state.deteriorationRules.map((rule) => {
        const { progress, isPrevented, isTriggered } = getRuleProgress(
          rule,
          now,
          state.actionsTaken,
        );

        return {
          ruleId: rule.id,
          condition: rule.condition,
          progress,
          isPrevented,
          isTriggered,
          timerMinutes: rule.timerMinutes,
        };
      });
      setStatuses(newStatuses);
    };

    updateStatuses();
    const interval = setInterval(updateStatuses, 1000);

    return () => clearInterval(interval);
  }, [state.deteriorationRules, state.actionsTaken]);

  return statuses;
}
