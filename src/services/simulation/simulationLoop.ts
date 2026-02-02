export interface LoopHandler {
  id: string;
  intervalMs: number;
  callback: () => void;
}

export interface SimulationLoop {
  start: () => void;
  stop: () => void;
  pause: () => void;
  resume: () => void;
  registerHandler: (handler: LoopHandler) => void;
  unregisterHandler: (id: string) => void;
}

export function createSimulationLoop(): SimulationLoop {
  const handlers = new Map<string, LoopHandler & { lastRunMs: number }>();
  let rafId: number | null = null;
  let running = false;
  let paused = false;

  function tick() {
    if (!running || paused) return;

    const now = performance.now();

    for (const handler of handlers.values()) {
      if (now - handler.lastRunMs >= handler.intervalMs) {
        handler.callback();
        handler.lastRunMs = now;
      }
    }

    rafId = requestAnimationFrame(tick);
  }

  function start() {
    if (running) return;
    running = true;
    paused = false;

    // Reset lastRunMs for all handlers
    const now = performance.now();
    for (const handler of handlers.values()) {
      handler.lastRunMs = now;
    }

    rafId = requestAnimationFrame(tick);
  }

  function stop() {
    running = false;
    paused = false;
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  function pause() {
    paused = true;
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  function resume() {
    if (!running) return;
    paused = false;

    // Reset lastRunMs to avoid burst-firing after pause
    const now = performance.now();
    for (const handler of handlers.values()) {
      handler.lastRunMs = now;
    }

    rafId = requestAnimationFrame(tick);
  }

  function registerHandler(handler: LoopHandler) {
    handlers.set(handler.id, {
      ...handler,
      lastRunMs: performance.now(),
    });
  }

  function unregisterHandler(id: string) {
    handlers.delete(id);
  }

  return { start, stop, pause, resume, registerHandler, unregisterHandler };
}
