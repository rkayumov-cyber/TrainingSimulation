import { useEffect, useRef } from "react";
import { useSimulation } from "../../context";

export function ECGDisplay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { state } = useSimulation();
  const animationRef = useRef<number>(0);
  const offsetRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const midY = height / 2;

    // ECG waveform generation based on heart rate
    const generateECGPoint = (x: number, hr: number): number => {
      const cycleLength = 600 / (hr / 60); // Pixels per heartbeat cycle
      const phase = (x % cycleLength) / cycleLength;

      // P wave (0-0.1)
      if (phase < 0.1) {
        return midY - 8 * Math.sin(phase * 10 * Math.PI);
      }
      // PR segment (0.1-0.15)
      if (phase < 0.15) {
        return midY;
      }
      // QRS complex (0.15-0.25)
      if (phase < 0.17) {
        return midY + 5;
      }
      if (phase < 0.2) {
        return midY - 35 * Math.sin((phase - 0.17) * 33 * Math.PI);
      }
      if (phase < 0.25) {
        return midY + 8;
      }
      // ST segment (0.25-0.35)
      if (phase < 0.35) {
        return midY;
      }
      // T wave (0.35-0.5)
      if (phase < 0.5) {
        return midY - 10 * Math.sin((phase - 0.35) * 6.67 * Math.PI);
      }
      // Baseline
      return midY;
    };

    const draw = () => {
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(0, 0, width, height);

      // Draw grid
      ctx.strokeStyle = "#1e3a5f";
      ctx.lineWidth = 0.5;

      // Small grid
      for (let x = 0; x < width; x += 10) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 10) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Large grid
      ctx.strokeStyle = "#2d4a6f";
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 50) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 50) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw ECG trace
      ctx.strokeStyle = "#22c55e";
      ctx.lineWidth = 2;
      ctx.shadowColor = "#22c55e";
      ctx.shadowBlur = 4;
      ctx.beginPath();

      const hr = state.vitals.hr;

      for (let x = 0; x < width; x++) {
        const y = generateECGPoint(x + offsetRef.current, hr);
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Animate sweep
      if (state.isRunning && !state.isPaused) {
        offsetRef.current += 2;
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [state.vitals.hr, state.isRunning, state.isPaused]);

  return (
    <div className="bg-slate-950 rounded-lg border border-slate-800 p-2">
      <div className="flex items-center justify-between mb-2 px-2">
        <span className="text-emerald-400 text-xs font-medium uppercase tracking-wide">
          ECG Lead II
        </span>
        <span className="text-slate-500 text-xs">25mm/s</span>
      </div>
      <canvas
        ref={canvasRef}
        width={400}
        height={100}
        className="w-full rounded"
      />
    </div>
  );
}
