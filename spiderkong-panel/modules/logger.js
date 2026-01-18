const REDACT_KEYS = ['password', 'token', 'secret', 'key', 'auth'];

function formatTimestamp(date) {
  return date.toISOString().replace(/\.\d{3}Z$/, 'Z');
}

function redactValue(value) {
  if (Array.isArray(value)) {
    return value.map((item) => redactValue(item));
  }
  if (value && typeof value === 'object') {
    return redactObject(value);
  }
  return value;
}

function redactObject(meta) {
  const output = Array.isArray(meta) ? [] : {};
  Object.entries(meta).forEach(([key, value]) => {
    if (REDACT_KEYS.some((token) => key.toLowerCase().includes(token))) {
      output[key] = '[REDACTED]';
      return;
    }
    output[key] = redactValue(value);
  });
  return output;
}

export class Logger {
  constructor({ capacity = 400 } = {}) {
    this.capacity = capacity;
    this.lines = [];
    this.subscribers = new Set();
    this.lowPower = false;
    this.flushTimer = null;
    this.flushIntervalMs = 500;
  }

  info(message, meta) {
    this.log('INFO', message, meta);
  }

  warn(message, meta) {
    this.log('WARN', message, meta);
  }

  error(message, meta) {
    this.log('ERROR', message, meta);
  }

  debug(message, meta) {
    this.log('DEBUG', message, meta);
  }

  log(level, message, meta) {
    const timestamp = formatTimestamp(new Date());
    const safeMeta = meta ? redactObject(meta) : null;
    const metaSuffix = safeMeta ? ` ${JSON.stringify(safeMeta)}` : '';
    const line = {
      timestamp,
      level,
      message: `${message}${metaSuffix}`
    };
    this.lines.push(line);
    if (this.lines.length > this.capacity) {
      this.lines.splice(0, this.lines.length - this.capacity);
    }
    if (this.lowPower) {
      this.scheduleFlush();
      return;
    }
    this.notify();
  }

  exportText() {
    return this.lines.map((line) => this.formatLine(line)).join('\n');
  }

  clear() {
    this.lines = [];
    this.notify();
  }

  setLowPower(enabled) {
    this.lowPower = Boolean(enabled);
    if (!this.lowPower) {
      this.clearFlushTimer();
      this.notify();
    }
  }

  subscribe(handler) {
    this.subscribers.add(handler);
    handler(this.getRenderLines());
    return () => this.subscribers.delete(handler);
  }

  getRenderLines() {
    const lines = this.lowPower
      ? this.lines.filter((line) => line.level !== 'DEBUG')
      : this.lines;
    return lines.map((line) => this.formatLine(line));
  }

  formatLine(line) {
    return `[${line.timestamp}] ${line.level}: ${line.message}`;
  }

  notify() {
    const snapshot = this.getRenderLines();
    this.subscribers.forEach((handler) => handler(snapshot));
  }

  scheduleFlush() {
    if (this.flushTimer) {
      return;
    }
    this.flushTimer = setTimeout(() => {
      this.flushTimer = null;
      this.notify();
    }, this.flushIntervalMs);
  }

  clearFlushTimer() {
    if (!this.flushTimer) {
      return;
    }
    clearTimeout(this.flushTimer);
    this.flushTimer = null;
  }
}
