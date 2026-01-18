export class MatchTimer {
  constructor() {
    this.time = 0;
    this.running = false;
  }

  start() {
    this.running = true;
  }

  pause() {
    this.running = false;
  }

  reset() {
    this.time = 0;
    this.running = false;
  }

  setManual() {
    return;
  }

  format(seconds = this.time) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
}
