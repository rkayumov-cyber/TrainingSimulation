import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createSimulationLoop } from "./simulationLoop";

describe("createSimulationLoop", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Mock requestAnimationFrame / cancelAnimationFrame
    let rafId = 0;
    const rafCallbacks = new Map<number, FrameRequestCallback>();
    vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
      const id = ++rafId;
      rafCallbacks.set(id, cb);
      // Schedule callback to run on next timer tick
      setTimeout(() => {
        const callback = rafCallbacks.get(id);
        if (callback) {
          rafCallbacks.delete(id);
          callback(performance.now());
        }
      }, 16); // ~60fps
      return id;
    });
    vi.stubGlobal("cancelAnimationFrame", (id: number) => {
      rafCallbacks.delete(id);
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("creates a loop with all expected methods", () => {
    const loop = createSimulationLoop();
    expect(loop.start).toBeTypeOf("function");
    expect(loop.stop).toBeTypeOf("function");
    expect(loop.pause).toBeTypeOf("function");
    expect(loop.resume).toBeTypeOf("function");
    expect(loop.registerHandler).toBeTypeOf("function");
    expect(loop.unregisterHandler).toBeTypeOf("function");
  });

  it("fires handler after its interval elapses", () => {
    const loop = createSimulationLoop();
    const callback = vi.fn();

    loop.registerHandler({ id: "test", intervalMs: 1000, callback });
    loop.start();

    // Advance time enough for multiple RAF frames + interval
    vi.advanceTimersByTime(1100);
    expect(callback).toHaveBeenCalled();
  });

  it("does not fire handler before its interval", () => {
    const loop = createSimulationLoop();
    const callback = vi.fn();

    loop.registerHandler({ id: "test", intervalMs: 5000, callback });
    loop.start();

    // Only advance 500ms
    vi.advanceTimersByTime(500);
    expect(callback).not.toHaveBeenCalled();
  });

  it("fires handlers at different intervals independently", () => {
    const loop = createSimulationLoop();
    const fast = vi.fn();
    const slow = vi.fn();

    loop.registerHandler({ id: "fast", intervalMs: 500, callback: fast });
    loop.registerHandler({ id: "slow", intervalMs: 2000, callback: slow });
    loop.start();

    vi.advanceTimersByTime(1100);
    expect(fast.mock.calls.length).toBeGreaterThanOrEqual(1);
    expect(slow).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1200);
    expect(slow).toHaveBeenCalled();
  });

  it("stops firing after stop is called", () => {
    const loop = createSimulationLoop();
    const callback = vi.fn();

    loop.registerHandler({ id: "test", intervalMs: 500, callback });
    loop.start();

    vi.advanceTimersByTime(600);
    const callCount = callback.mock.calls.length;

    loop.stop();
    vi.advanceTimersByTime(5000);
    expect(callback.mock.calls.length).toBe(callCount);
  });

  it("pauses and resumes correctly", () => {
    const loop = createSimulationLoop();
    const callback = vi.fn();

    loop.registerHandler({ id: "test", intervalMs: 500, callback });
    loop.start();

    vi.advanceTimersByTime(600);
    const callsBeforePause = callback.mock.calls.length;

    loop.pause();
    vi.advanceTimersByTime(5000);
    expect(callback.mock.calls.length).toBe(callsBeforePause);

    loop.resume();
    vi.advanceTimersByTime(600);
    expect(callback.mock.calls.length).toBeGreaterThan(callsBeforePause);
  });

  it("unregisters a handler", () => {
    const loop = createSimulationLoop();
    const callback = vi.fn();

    loop.registerHandler({ id: "test", intervalMs: 500, callback });
    loop.start();

    vi.advanceTimersByTime(600);
    const callCount = callback.mock.calls.length;

    loop.unregisterHandler("test");
    vi.advanceTimersByTime(2000);
    expect(callback.mock.calls.length).toBe(callCount);
  });

  it("handles registering handler while running", () => {
    const loop = createSimulationLoop();
    const callback = vi.fn();

    loop.start();
    vi.advanceTimersByTime(100);

    loop.registerHandler({ id: "late", intervalMs: 500, callback });
    vi.advanceTimersByTime(600);
    expect(callback).toHaveBeenCalled();
  });
});
