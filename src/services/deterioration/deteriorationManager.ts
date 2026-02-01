import type { DeteriorationRule, Vitals } from "../../types";

export interface DeteriorationCheck {
  ruleId: string;
  shouldTrigger: boolean;
  vitalsUpdate: Partial<Vitals>;
  description: string;
}

export function checkDeteriorationRules(
  rules: DeteriorationRule[],
  actionsTaken: string[],
  currentTime: number,
): DeteriorationCheck[] {
  const checks: DeteriorationCheck[] = [];

  for (const rule of rules) {
    if (rule.triggered) continue;

    const isPrevented = rule.preventedBy.some((action) =>
      actionsTaken.includes(action),
    );

    if (isPrevented) continue;

    if (!rule.startTime) continue;

    const elapsedMinutes = (currentTime - rule.startTime) / (1000 * 60);

    if (elapsedMinutes >= rule.timerMinutes) {
      checks.push({
        ruleId: rule.id,
        shouldTrigger: true,
        vitalsUpdate: rule.effect,
        description: `Deterioration: ${rule.condition}`,
      });
    }
  }

  return checks;
}

export function initializeRuleTimers(
  rules: Omit<DeteriorationRule, "triggered" | "startTime">[],
  startTime: number,
): DeteriorationRule[] {
  return rules.map((rule) => ({
    ...rule,
    triggered: false,
    startTime,
  }));
}

export function getRuleProgress(
  rule: DeteriorationRule,
  currentTime: number,
  actionsTaken: string[],
): { progress: number; isPrevented: boolean; isTriggered: boolean } {
  if (rule.triggered) {
    return { progress: 100, isPrevented: false, isTriggered: true };
  }

  const isPrevented = rule.preventedBy.some((action) =>
    actionsTaken.includes(action),
  );

  if (isPrevented) {
    return { progress: 0, isPrevented: true, isTriggered: false };
  }

  if (!rule.startTime) {
    return { progress: 0, isPrevented: false, isTriggered: false };
  }

  const elapsedMinutes = (currentTime - rule.startTime) / (1000 * 60);
  const progress = Math.min(100, (elapsedMinutes / rule.timerMinutes) * 100);

  return { progress, isPrevented: false, isTriggered: false };
}
