const MAX_MS = (199 * 60 + 59) * 1000;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export class MatchTimer {
  constructor({ onTick, onRunningChange } = {}) {
    this.elapsedMs = 0;
    this.running = false;
    this.startedAtEpochMs = null;
    this.intervalId = null;
    this.lastSecond = -1;
    this.onTick = typeof onTick === 'function' ? onTick : () => {};
    this.onRunningChange = typeof onRunningChange === 'function' ? onRunningChange : () => {};
  }

  start() {
    if (this.running) {
      return;
    }
    this.running = true;
    this.startedAtEpochMs = Date.now() - this.elapsedMs;
    this.onRunningChange(true);
    this.startInterval();
  }

  pause() {
    if (!this.running) {
      return;
    }
    this.elapsedMs = Date.now() - this.startedAtEpochMs;
    this.running = false;
    this.startedAtEpochMs = null;
    this.stopInterval();
    this.onRunningChange(false);
    this.onTick(this.format(this.elapsedMs), this.elapsedMs);
  }

  reset() {
    this.pause();
    this.elapsedMs = 0;
    this.lastSecond = -1;
    this.onTick(this.format(this.elapsedMs), this.elapsedMs);
  }

  setManual(minutes = 0, seconds = 0) {
    const safeMinutes = Number.isFinite(minutes) ? minutes : 0;
    const safeSeconds = Number.isFinite(seconds) ? seconds : 0;
    this.pause();
    const totalSeconds = Math.max(0, safeMinutes) * 60 + Math.max(0, safeSeconds);
    this.elapsedMs = clamp(totalSeconds * 1000, 0, MAX_MS);
    this.lastSecond = Math.floor(this.elapsedMs / 1000);
    this.onTick(this.format(this.elapsedMs), this.elapsedMs);
  }

  format(ms = this.elapsedMs) {
    const totalSeconds = Math.floor(ms / 1000);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  startInterval() {
    if (this.intervalId) {
      return;
    }
    this.intervalId = setInterval(() => {
      if (!this.running) {
        return;
      }
      this.elapsedMs = Date.now() - this.startedAtEpochMs;
      const currentSecond = Math.floor(this.elapsedMs / 1000);
      if (currentSecond !== this.lastSecond) {
        this.lastSecond = currentSecond;
        this.onTick(this.format(this.elapsedMs), this.elapsedMs);
      }
    }, 250);
  }

  stopInterval() {
    if (!this.intervalId) {
      return;
    }
    clearInterval(this.intervalId);
    this.intervalId = null;
  }
}
