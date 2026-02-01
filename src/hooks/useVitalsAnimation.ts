import { useState, useEffect, useRef } from "react";
import type { Vitals } from "../types";

export function useVitalsAnimation(
  targetVitals: Vitals,
  animationSpeed: number = 0.1,
) {
  const [displayVitals, setDisplayVitals] = useState(targetVitals);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const animate = () => {
      setDisplayVitals((current) => {
        const lerp = (from: number, to: number) =>
          from + (to - from) * animationSpeed;

        return {
          hr: Math.round(lerp(current.hr, targetVitals.hr)),
          bpSystolic: Math.round(
            lerp(current.bpSystolic, targetVitals.bpSystolic),
          ),
          bpDiastolic: Math.round(
            lerp(current.bpDiastolic, targetVitals.bpDiastolic),
          ),
          spo2: Math.round(lerp(current.spo2, targetVitals.spo2)),
          temp: Math.round(lerp(current.temp, targetVitals.temp) * 10) / 10,
          respRate: Math.round(lerp(current.respRate, targetVitals.respRate)),
        };
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [targetVitals, animationSpeed]);

  return displayVitals;
}
