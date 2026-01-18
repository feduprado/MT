export class ObsWsClient {
  constructor() {
    this.connected = false;
    this.listeners = new Map();
  }

  connect() {
    this.connected = true;
    return Promise.resolve();
  }

  disconnect() {
    this.connected = false;
    return Promise.resolve();
  }

  call() {
    return Promise.resolve();
  }

  on(eventName, handler) {
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, new Set());
    }
    this.listeners.get(eventName).add(handler);
  }

  off(eventName, handler) {
    if (!this.listeners.has(eventName)) {
      return;
    }
    this.listeners.get(eventName).delete(handler);
  }
}
