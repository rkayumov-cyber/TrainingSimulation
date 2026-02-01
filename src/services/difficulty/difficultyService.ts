import type { DeteriorationRule, ScenarioDefinition } from "../../types";
import type {
  DifficultyLevel,
  DifficultyModifiers,
} from "../../types/difficulty";
import { DIFFICULTY_PRESETS } from "../../types/difficulty";

export function getDifficultyModifiers(
  level: DifficultyLevel,
  performanceRatio?: number,
): DifficultyModifiers {
  if (level !== "adaptive") {
    return DIFFICULTY_PRESETS[level];
  }

  // Adaptive: interpolate between beginner and expert based on performance
  // performanceRatio: 0 = struggling, 1 = excelling
  const ratio = performanceRatio ?? 0.5;

  if (ratio < 0.3) {
    return {
      ...DIFFICULTY_PRESETS.beginner,
      deteriorationTimerMultiplier: 1.8,
    };
  } else if (ratio < 0.6) {
    return DIFFICULTY_PRESETS.intermediate;
  } else {
    return {
      ...DIFFICULTY_PRESETS.expert,
      deteriorationTimerMultiplier: 0.75,
    };
  }
}

export function applyDifficultyToRules(
  rules: ScenarioDefinition["deteriorationRules"],
  modifiers: DifficultyModifiers,
): ScenarioDefinition["deteriorationRules"] {
  return rules.map((rule) => ({
    ...rule,
    timerMinutes: rule.timerMinutes * modifiers.deteriorationTimerMultiplier,
  }));
}

export function applyDifficultyToInitializedRules(
  rules: DeteriorationRule[],
  modifiers: DifficultyModifiers,
): DeteriorationRule[] {
  return rules.map((rule) => ({
    ...rule,
    timerMinutes: rule.timerMinutes * modifiers.deteriorationTimerMultiplier,
  }));
}

/**
 * Calculate adaptive performance ratio based on current simulation state.
 * Returns 0-1 where 0 = struggling, 1 = excelling.
 */
export function calculateAdaptivePerformance(
  actionsTaken: string[],
  correctActions: string[],
  communicationErrors: number,
  elapsedMs: number,
): number {
  if (elapsedMs < 10000) return 0.5; // Not enough data yet

  const correctCount = actionsTaken.filter((a) =>
    correctActions.includes(a),
  ).length;
  const actionRatio =
    correctActions.length > 0 ? correctCount / correctActions.length : 0;

  const elapsedMinutes = elapsedMs / 60000;
  // Penalize for being slow (more than 2 min per action)
  const paceRatio = Math.min(
    1,
    actionsTaken.length / Math.max(1, elapsedMinutes / 2),
  );

  const commPenalty = Math.min(0.3, communicationErrors * 0.1);

  return Math.max(
    0,
    Math.min(1, actionRatio * 0.5 + paceRatio * 0.3 + 0.2 - commPenalty),
  );
}
