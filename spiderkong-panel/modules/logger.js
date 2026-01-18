export class Logger {
  constructor({ capacity = 400 } = {}) {
    this.capacity = capacity;
    this.lines = [];
    this.subscribers = new Set();
  }

  info(message) {
    this.addLine('INFO', message);
  }

  warn(message) {
    this.addLine('WARN', message);
  }

  error(message) {
    this.addLine('ERROR', message);
  }

  debug(message) {
    this.addLine('DEBUG', message);
  }

  exportText() {
    return this.lines.join('\n');
  }

  clear() {
    this.lines = [];
    this.notify();
  }

  subscribe(handler) {
    this.subscribers.add(handler);
    handler(this.lines.slice());
    return () => this.subscribers.delete(handler);
  }

  addLine(level, message) {
    const timestamp = new Date().toISOString();
    const line = `[${timestamp}] ${level}: ${message}`;
    this.lines.push(line);
    if (this.lines.length > this.capacity) {
      this.lines.splice(0, this.lines.length - this.capacity);
    }
    this.notify();
  }

  notify() {
    const snapshot = this.lines.slice();
    this.subscribers.forEach((handler) => handler(snapshot));
  }
}
