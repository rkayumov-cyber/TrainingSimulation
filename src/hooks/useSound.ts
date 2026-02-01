import { useEffect, useState, useCallback } from "react";
import { soundService } from "../services/audio";
import { useSimulation } from "../context";

export function useSound() {
  const { state } = useSimulation();
  const [soundEnabled, setSoundEnabled] = useState(false);

  // Toggle sound
  const toggleSound = useCallback(() => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    soundService.setEnabled(newState);

    if (newState && state.isRunning) {
      soundService.startHeartbeat(state.vitals.hr);
    } else {
      soundService.stopHeartbeat();
    }
  }, [soundEnabled, state.isRunning, state.vitals.hr]);

  // Start/stop heartbeat when simulation starts/stops
  useEffect(() => {
    if (soundEnabled && state.isRunning && !state.isPaused) {
      soundService.startHeartbeat(state.vitals.hr);
    } else {
      soundService.stopHeartbeat();
    }

    return () => {
      soundService.stopHeartbeat();
    };
  }, [soundEnabled, state.isRunning, state.isPaused, state.vitals.hr]);

  // Check for alarm conditions periodically
  useEffect(() => {
    if (!soundEnabled || !state.isRunning || state.isPaused) return;

    const checkAlarms = () => {
      soundService.playAlarmForVitals({
        hr: state.vitals.hr,
        spo2: state.vitals.spo2,
        bpSystolic: state.vitals.bpSystolic,
      });
    };

    // Check every 5 seconds
    const interval = setInterval(checkAlarms, 5000);

    return () => clearInterval(interval);
  }, [soundEnabled, state.isRunning, state.isPaused, state.vitals]);

  // Play success sound when actions are taken
  useEffect(() => {
    if (!soundEnabled) return;

    if (state.actionsTaken.length > 0) {
      soundService.play("success");
    }
  }, [soundEnabled, state.actionsTaken]);

  return {
    soundEnabled,
    toggleSound,
  };
}
