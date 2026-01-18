const DEFAULT_URL = 'ws://127.0.0.1:4455';
const OPS = {
  HELLO: 0,
  IDENTIFY: 1,
  IDENTIFIED: 2,
  EVENT: 5,
  REQUEST: 6,
  RESPONSE: 7
};

const BACKOFF_STEPS = [1000, 2000, 5000, 10000, 30000];

function getJitter() {
  return Math.floor(Math.random() * 251);
}

function toBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}

export class ObsWsClient {
  constructor({ url = DEFAULT_URL, password = '', onStateChange, onLog } = {}) {
    this.url = url;
    this.password = password;
    this.onStateChange = onStateChange;
    this.onLog = onLog;
    this.state = 'DISCONNECTED';
    this.socket = null;
    this.listeners = new Map();
    this.pendingRequests = new Map();
    this.retryIndex = 0;
    this.reconnectTimer = null;
    this.intentionalClose = false;
    this.suppressReconnect = false;
  }

  setPassword(password) {
    this.password = password || '';
    if (this.state === 'DEGRADED_AUTH_REQUIRED') {
      this.suppressReconnect = false;
    }
  }

  connect({ force = false } = {}) {
    if (force) {
      this.retryIndex = 0;
      this.suppressReconnect = false;
    }
    this.clearReconnectTimer();
    this.intentionalClose = false;
    if (this.socket) {
      this.socket.close(1000, 'reconnect');
      this.socket = null;
    }
    this.transition('CONNECTING');
    this.log('INFO', 'ws connecting', { url: this.url });
    this.socket = new WebSocket(this.url);
    this.socket.addEventListener('message', (event) => {
      this.handleMessage(event);
    });
    this.socket.addEventListener('close', (event) => {
      this.handleClose(event);
    });
    this.socket.addEventListener('error', () => {
      this.log('ERROR', 'ws error');
    });
  }

  disconnect() {
    this.intentionalClose = true;
    this.suppressReconnect = true;
    this.clearReconnectTimer();
    this.rejectAllPending(new Error('disconnected'));
    if (this.socket) {
      this.socket.close(1000, 'disconnect');
      this.socket = null;
    }
    this.transition('DISCONNECTED');
  }

  call(requestType, requestData = {}, timeoutMs = 2500) {
    if (this.state !== 'IDENTIFIED') {
      return Promise.reject(new Error('not identified'));
    }
    const requestId = crypto.randomUUID();
    const payload = {
      op: OPS.REQUEST,
      d: {
        requestType,
        requestId,
        requestData
      }
    };
    const message = JSON.stringify(payload);
    this.socket.send(message);
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.pendingRequests.delete(requestId);
        reject(new Error(`timeout ${requestType}`));
      }, timeoutMs);
      this.pendingRequests.set(requestId, { resolve, reject, timeout });
    });
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

  emit(eventName, payload) {
    const handlers = this.listeners.get(eventName);
    if (!handlers) {
      return;
    }
    handlers.forEach((handler) => handler(payload));
  }

  transition(state, detail) {
    this.state = state;
    if (this.onStateChange) {
      this.onStateChange(state, detail);
    }
  }

  log(level, message, meta) {
    if (this.onLog) {
      this.onLog(level, message, meta);
    }
  }

  handleMessage(event) {
    let payload;
    try {
      payload = JSON.parse(event.data);
    } catch (error) {
      this.log('WARN', 'ws message parse error');
      return;
    }
    switch (payload.op) {
      case OPS.HELLO:
        void this.handleHello(payload.d);
        break;
      case OPS.IDENTIFIED:
        this.retryIndex = 0;
        this.transition('IDENTIFIED');
        this.log('INFO', 'identified');
        break;
      case OPS.EVENT:
        if (payload.d?.eventType) {
          this.emit(payload.d.eventType, payload.d);
        }
        break;
      case OPS.RESPONSE:
        this.handleResponse(payload.d);
        break;
      default:
        break;
    }
  }

  async handleHello(data) {
    this.transition('HELLO');
    this.log('INFO', 'hello received');
    const auth = data?.authentication;
    if (auth && !this.password) {
      this.transition('DEGRADED_AUTH_REQUIRED');
      this.log('WARN', 'auth required');
      this.suppressReconnect = true;
      if (this.socket) {
        this.socket.close(1000, 'auth required');
      }
      return;
    }
    let authentication = undefined;
    if (auth && this.password) {
      authentication = await this.createAuthentication(this.password, auth.salt, auth.challenge);
    }
    this.sendIdentify(authentication);
  }

  sendIdentify(authentication) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      return;
    }
    const identifyPayload = {
      op: OPS.IDENTIFY,
      d: {
        rpcVersion: 1
      }
    };
    if (authentication) {
      identifyPayload.d.authentication = authentication;
    }
    this.socket.send(JSON.stringify(identifyPayload));
    this.transition('IDENTIFYING');
    this.log('INFO', 'identify sent', { authenticated: Boolean(authentication) });
  }

  async createAuthentication(password, salt, challenge) {
    const encoder = new TextEncoder();
    const secretHash = await crypto.subtle.digest('SHA-256', encoder.encode(`${password}${salt}`));
    const secret = toBase64(secretHash);
    const authHash = await crypto.subtle.digest('SHA-256', encoder.encode(`${secret}${challenge}`));
    return toBase64(authHash);
  }

  handleResponse(data) {
    const requestId = data?.requestId;
    if (!requestId || !this.pendingRequests.has(requestId)) {
      return;
    }
    const pending = this.pendingRequests.get(requestId);
    clearTimeout(pending.timeout);
    this.pendingRequests.delete(requestId);
    const status = data.requestStatus || {};
    if (status.result === false) {
      const message = status.comment || 'request failed';
      pending.reject(new Error(message));
      return;
    }
    pending.resolve(data.responseData || {});
  }

  handleClose(event) {
    this.rejectAllPending(new Error('socket closed'));
    if (this.state === 'DEGRADED_AUTH_REQUIRED') {
      return;
    }
    if (event.code === 4009) {
      this.transition('AUTH_FAILED', { code: event.code });
      this.log('ERROR', 'auth failed', { code: event.code });
      this.suppressReconnect = true;
      return;
    }
    if (this.intentionalClose) {
      this.transition('DISCONNECTED');
      return;
    }
    this.transition('DISCONNECTED', { code: event.code, reason: event.reason });
    this.log('WARN', 'ws closed', { code: event.code, reason: event.reason });
    this.scheduleReconnect();
  }

  scheduleReconnect() {
    if (this.suppressReconnect) {
      return;
    }
    const baseDelay = BACKOFF_STEPS[Math.min(this.retryIndex, BACKOFF_STEPS.length - 1)];
    const delay = baseDelay + getJitter();
    this.retryIndex += 1;
    this.transition('RECONNECTING', { delayMs: delay });
    this.log('WARN', 'retry scheduled', { delayMs: delay });
    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, delay);
  }

  clearReconnectTimer() {
    if (!this.reconnectTimer) {
      return;
    }
    clearTimeout(this.reconnectTimer);
    this.reconnectTimer = null;
  }

  rejectAllPending(error) {
    this.pendingRequests.forEach((pending) => {
      clearTimeout(pending.timeout);
      pending.reject(error);
    });
    this.pendingRequests.clear();
  }
}
