const STORAGE_KEY = 'spiderkong-state';
const STORAGE_VERSION = 1;
const DEBOUNCE_MS = 500;
const MAX_STORAGE_BYTES = 450 * 1024;

let logger = null;
let saveTimer = null;
let pendingState = null;

function logWarn(message, meta) {
  if (logger && typeof logger.warn === 'function') {
    logger.warn(message, meta);
    return;
  }
  console.warn(message, meta || '');
}

function byteSize(value) {
  return new TextEncoder().encode(value).length;
}

function buildPayload(state) {
  return {
    version: STORAGE_VERSION,
    savedAtEpochMs: Date.now(),
    state
  };
}

function prepareState(state) {
  const snapshot = JSON.parse(JSON.stringify(state));
  if (!Array.isArray(snapshot.history)) {
    snapshot.history = [];
  }
  if (snapshot.history.length > 50) {
    snapshot.history = snapshot.history.slice(0, 50);
  }
  return snapshot;
}

function saveStateSnapshot(state) {
  if (!state) {
    return;
  }
  let snapshot = prepareState(state);
  let history = Array.isArray(snapshot.history) ? [...snapshot.history] : [];
  let payload = buildPayload(snapshot);
  let json = JSON.stringify(payload);
  let size = byteSize(json);

  while (history.length > 0 && size > MAX_STORAGE_BYTES) {
    history.pop();
    snapshot = { ...snapshot, history };
    payload = buildPayload(snapshot);
    json = JSON.stringify(payload);
    size = byteSize(json);
  }

  if (size > MAX_STORAGE_BYTES) {
    snapshot = { ...snapshot, history: [] };
    payload = buildPayload(snapshot);
    json = JSON.stringify(payload);
    size = byteSize(json);
    logWarn('storage size limit reached, saving without history');
  }

  try {
    localStorage.setItem(STORAGE_KEY, json);
  } catch (error) {
    logWarn('storage save failed', { error: error?.message || 'unknown' });
  }
}

export function setStorageLogger(nextLogger) {
  logger = nextLogger;
}

export function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }
  let parsed = null;
  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    logWarn('storage load failed: invalid json');
    return null;
  }
  if (!parsed || parsed.version !== STORAGE_VERSION || !parsed.state) {
    logWarn('storage load failed: invalid payload');
    return null;
  }
  const restored = parsed.state;
  const homeSlots = restored?.teams?.home?.slots;
  const awaySlots = restored?.teams?.away?.slots;
  if (!Array.isArray(homeSlots) || homeSlots.length !== 11) {
    logWarn('storage load failed: home slots invalid');
    return null;
  }
  if (!Array.isArray(awaySlots) || awaySlots.length !== 11) {
    logWarn('storage load failed: away slots invalid');
    return null;
  }
  if (typeof restored?.timer?.elapsedMs !== 'number') {
    logWarn('storage load failed: timer invalid');
    return null;
  }
  return restored;
}

export function saveStateDebounced(state) {
  pendingState = state;
  if (saveTimer) {
    return;
  }
  saveTimer = setTimeout(() => {
    saveTimer = null;
    saveStateSnapshot(pendingState);
  }, DEBOUNCE_MS);
}

export function clearState() {
  localStorage.removeItem(STORAGE_KEY);
}
