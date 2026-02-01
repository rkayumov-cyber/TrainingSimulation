type SoundType = "heartbeat" | "alarm" | "warning" | "success" | "click";

class SoundService {
  private audioContext: AudioContext | null = null;
  private enabled: boolean = true;
  private lastHeartbeat: number = 0;
  private heartbeatInterval: number | null = null;

  private getContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new AudioContext();
    }
    return this.audioContext;
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (!enabled) {
      this.stopHeartbeat();
    }
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  private playTone(
    frequency: number,
    duration: number,
    type: OscillatorType = "sine",
    volume: number = 0.1,
  ) {
    if (!this.enabled) return;

    try {
      const ctx = this.getContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

      // Envelope for smoother sound
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.01);
      gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration);
    } catch {
      // Audio context may not be available
    }
  }

  play(type: SoundType) {
    if (!this.enabled) return;

    switch (type) {
      case "heartbeat":
        // Double beep like a real monitor
        this.playTone(880, 0.08, "sine", 0.15);
        setTimeout(() => this.playTone(660, 0.08, "sine", 0.1), 100);
        break;

      case "alarm":
        // Urgent repeating alarm
        this.playTone(880, 0.15, "square", 0.2);
        setTimeout(() => this.playTone(660, 0.15, "square", 0.2), 200);
        setTimeout(() => this.playTone(880, 0.15, "square", 0.2), 400);
        break;

      case "warning":
        // Single warning tone
        this.playTone(440, 0.3, "triangle", 0.15);
        break;

      case "success":
        // Pleasant ascending tone
        this.playTone(523, 0.1, "sine", 0.1);
        setTimeout(() => this.playTone(659, 0.1, "sine", 0.1), 100);
        setTimeout(() => this.playTone(784, 0.15, "sine", 0.1), 200);
        break;

      case "click":
        this.playTone(1000, 0.02, "square", 0.05);
        break;
    }
  }

  startHeartbeat(bpm: number) {
    if (!this.enabled) return;

    this.stopHeartbeat();

    const interval = (60 / bpm) * 1000;
    this.heartbeatInterval = window.setInterval(() => {
      this.play("heartbeat");
    }, interval);

    // Play immediately
    this.play("heartbeat");
  }

  stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  updateHeartRate(bpm: number) {
    if (!this.enabled || !this.heartbeatInterval) return;

    // Only restart if BPM changed significantly
    const currentInterval = this.heartbeatInterval ? (60 / bpm) * 1000 : 0;
    if (Math.abs(currentInterval - this.lastHeartbeat) > 50) {
      this.lastHeartbeat = currentInterval;
      this.startHeartbeat(bpm);
    }
  }

  playAlarmForVitals(vitals: { hr: number; spo2: number; bpSystolic: number }) {
    if (!this.enabled) return;

    // Critical values trigger alarm
    if (
      vitals.spo2 < 88 ||
      vitals.bpSystolic < 80 ||
      vitals.hr > 140 ||
      vitals.hr < 40
    ) {
      this.play("alarm");
    } else if (vitals.spo2 < 92 || vitals.bpSystolic < 90 || vitals.hr > 120) {
      this.play("warning");
    }
  }
}

export const soundService = new SoundService();
