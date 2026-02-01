import type {
  BenchmarkDefinition,
  BenchmarkResult,
  BenchmarkActionResult,
  BenchmarkSequenceResult,
  BenchmarkTimingResult,
} from "../../types/scenarioBuilder";
import type { ActionRecord } from "../../types/session";

export function gradeSession(
  actionsTaken: ActionRecord[],
  benchmark: BenchmarkDefinition,
  _startTime: number,
): BenchmarkResult {
  const actionMap = new Map<string, ActionRecord>();
  for (const record of actionsTaken) {
    if (!actionMap.has(record.action)) {
      actionMap.set(record.action, record);
    }
  }

  // Grade expected actions
  const actionResults: BenchmarkActionResult[] = benchmark.expectedActions.map(
    (ea) => {
      const record = actionMap.get(ea.action);
      const completed = !!record;
      const timeSeconds = record ? record.elapsedSeconds : null;
      const withinTime =
        completed && timeSeconds !== null
          ? timeSeconds <= ea.maxTimeMinutes * 60
          : false;

      return {
        action: ea.action,
        label: ea.label || ea.action.replace(/_/g, " "),
        completed,
        required: ea.required,
        timeSeconds,
        pointsEarned: completed && withinTime ? ea.points : completed ? Math.floor(ea.points * 0.5) : 0,
        pointsPossible: ea.points,
      };
    },
  );

  // Grade sequences
  const sequenceResults: BenchmarkSequenceResult[] =
    benchmark.expectedSequences.map((seq) => {
      const beforeRecord = actionMap.get(seq.before);
      const afterRecord = actionMap.get(seq.after);

      if (!beforeRecord || !afterRecord) {
        return {
          before: seq.before,
          after: seq.after,
          correct: false,
          pointsEarned: 0,
        };
      }

      const correct = beforeRecord.timestamp < afterRecord.timestamp;
      return {
        before: seq.before,
        after: seq.after,
        correct,
        pointsEarned: correct ? seq.points : seq.penalty,
      };
    });

  // Grade timing
  const timingResults: BenchmarkTimingResult[] =
    benchmark.timingThresholds.map((tt) => {
      const record = actionMap.get(tt.action);
      if (!record) {
        return { action: tt.action, grade: "F" as const, timeSeconds: null };
      }

      const seconds = record.elapsedSeconds;
      let grade: "A" | "B" | "C" | "D" | "F";
      if (seconds <= tt.gradeA) grade = "A";
      else if (seconds <= tt.gradeB) grade = "B";
      else if (seconds <= tt.gradeC) grade = "C";
      else if (seconds <= tt.gradeD) grade = "D";
      else grade = "F";

      return { action: tt.action, grade, timeSeconds: seconds };
    });

  // Calculate total
  const actionScore = actionResults.reduce((sum, r) => sum + r.pointsEarned, 0);
  const actionMax = actionResults.reduce((sum, r) => sum + r.pointsPossible, 0);
  const sequenceScore = sequenceResults.reduce(
    (sum, r) => sum + r.pointsEarned,
    0,
  );
  const sequenceMax = benchmark.expectedSequences.reduce(
    (sum, s) => sum + s.points,
    0,
  );

  const totalScore = actionScore + Math.max(0, sequenceScore);
  const maxScore = actionMax + sequenceMax;
  const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;

  return {
    actionResults,
    sequenceResults,
    timingResults,
    totalScore,
    maxScore,
    percentage,
    passed: percentage >= benchmark.passingScore,
  };
}
