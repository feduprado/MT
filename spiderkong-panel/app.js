import { ObsWsClient } from './modules/obs-client.js';
import { createInitialGameState, GameState } from './modules/game-state.js';
import { SkinManager } from './modules/skin-manager.js';
import { MatchTimer } from './modules/timer.js';
import { SyncEngine } from './modules/sync.js';
import {
  bindActions,
  cacheDom,
  renderAll,
  renderLoggerLines,
  setBusy,
  setLowPowerState,
  setWsStatusPill,
  toggleSection
} from './modules/ui.js';
import { Logger } from './modules/logger.js';

const VERSION = '0.2';
const OBSWS_URL = 'ws://127.0.0.1:4455';
const STORAGE_KEY = 'spiderkong-obsws-password';

const state = createInitialGameState();
const logger = new Logger({ capacity: 400 });
const obsClient = new ObsWsClient({
  url: OBSWS_URL,
  password: localStorage.getItem(STORAGE_KEY) || '',
  onStateChange: handleObsState,
  onLog: (level, message, meta) => {
    logger.log(level, message, meta);
  }
});
const skinManager = new SkinManager();
const matchTimer = new MatchTimer();
const syncEngine = new SyncEngine();

let lowPowerEnabled = false;

const WS_STATUS = {
  DISCONNECTED: {
    text: 'DESCONECTADO',
    icon: './assets/icons/link_off.svg',
    tone: 'neutral'
  },
  CONNECTING: {
    text: 'CONECTANDO',
    icon: './assets/icons/sync.svg',
    tone: 'info'
  },
  HELLO: {
    text: 'NEGOCIANDO',
    icon: './assets/icons/sync.svg',
    tone: 'info'
  },
  IDENTIFYING: {
    text: 'NEGOCIANDO',
    icon: './assets/icons/sync.svg',
    tone: 'info'
  },
  IDENTIFIED: {
    text: 'IDENTIFICADO',
    icon: './assets/icons/check_circle.svg',
    tone: 'success'
  },
  RECONNECTING: {
    text: 'RECONEXÃO',
    icon: './assets/icons/sync.svg',
    tone: 'info'
  },
  DEGRADED_AUTH_REQUIRED: {
    text: 'AUTH REQUIRED',
    icon: './assets/icons/warning.svg',
    tone: 'warning'
  },
  AUTH_FAILED: {
    text: 'AUTH FAILED',
    icon: './assets/icons/error.svg',
    tone: 'danger'
  }
};

function handleObsState(stateName) {
  const config = WS_STATUS[stateName] || WS_STATUS.DISCONNECTED;
  setWsStatusPill(config);
}

function registerLoggerPanel() {
  logger.subscribe((lines) => {
    renderLoggerLines(lines);
  });
}

function fillSelect(select, options) {
  if (!select) {
    return;
  }
  select.replaceChildren();
  options.forEach((option) => {
    const node = document.createElement('option');
    node.value = option.value;
    node.textContent = option.label;
    select.appendChild(node);
  });
}

function bindNotImplemented(selector) {
  const element = document.querySelector(selector);
  if (!element) {
    return;
  }
  element.addEventListener('click', () => {
    logger.info(`Action ${selector} not implemented.`);
  });
}

function bindPeriodButtons() {
  const periodButtons = document.querySelectorAll('#periodButtons [data-period]');
  periodButtons.forEach((button) => {
    button.addEventListener('click', () => {
      logger.info(`Period ${button.dataset.period} not implemented.`);
    });
  });
}

async function copyLogs() {
  try {
    await navigator.clipboard.writeText(logger.exportText());
    logger.info('logs copied');
  } catch (error) {
    logger.warn('clipboard copy failed');
  }
}

function toggleLowPower() {
  lowPowerEnabled = !lowPowerEnabled;
  logger.setLowPower(lowPowerEnabled);
  setLowPowerState(lowPowerEnabled);
  logger.info(`low power ${lowPowerEnabled ? 'enabled' : 'disabled'}`);
}

function connectNow() {
  obsClient.connect({ force: true });
}

function disconnectNow() {
  obsClient.disconnect();
}

function setObsPassword(password) {
  const safePassword = password || '';
  localStorage.setItem(STORAGE_KEY, safePassword);
  obsClient.setPassword(safePassword);
}

function clearObsPassword() {
  localStorage.removeItem(STORAGE_KEY);
  obsClient.setPassword('');
}

function initUi() {
  const dom = cacheDom();
  fillSelect(dom.sceneSelect, [{ value: 'match-center', label: 'Match Center' }]);
  fillSelect(dom.skinSelect, [
    { value: 'champions', label: 'Champions' },
    { value: 'libertadores', label: 'Libertadores' },
    { value: 'brasileiraocopa', label: 'Brasileirão Copa' },
    { value: 'generico', label: 'Genérico' }
  ]);
  fillSelect(dom.homeTeamSelect, [
    { value: '', label: 'Selecione' },
    { value: 'home-1', label: 'Time A' },
    { value: 'home-2', label: 'Time B' }
  ]);
  fillSelect(dom.awayTeamSelect, [
    { value: '', label: 'Selecione' },
    { value: 'away-1', label: 'Time C' },
    { value: 'away-2', label: 'Time D' }
  ]);

  setWsStatusPill(WS_STATUS.DISCONNECTED);
  setLowPowerState(lowPowerEnabled);
  renderAll(state);
}

function bindEvents() {
  const selectors = [
    '#btnHomeRosterClear',
    '#btnHomeRosterSave',
    '#btnAwayRosterClear',
    '#btnAwayRosterSave',
    '#btnScoreHomeMinus',
    '#btnScoreHomePlus',
    '#btnScoreAwayMinus',
    '#btnScoreAwayPlus',
    '#btnTimerPlay',
    '#btnTimerPause',
    '#btnTimerReset',
    '#btnTimerSet',
    '#btnPenaltiesClear',
    '#btnHistoryClear',
    '#btnResetScoreTimer',
    '#btnResetAll',
    '#btnSubCancel',
    '#btnSubConfirm'
  ];

  selectors.forEach((selector) => bindNotImplemented(selector));
  bindPeriodButtons();

  const rosterToggle = document.getElementById('rosterToggle');
  if (rosterToggle) {
    rosterToggle.addEventListener('click', () => {
      toggleSection('rosterBody');
      logger.info('Toggle roster view.');
    });
  }

  bindActions({
    onSyncObs: () => {
      setBusy(true);
      connectNow();
      setTimeout(() => setBusy(false), 600);
    },
    onLogCopy: copyLogs,
    onLogClear: () => logger.clear(),
    onLowPowerToggle: toggleLowPower
  });
}

function init() {
  registerLoggerPanel();
  initUi();
  bindEvents();
  logger.info(`SpiderKong Control Panel ${VERSION} ready.`);
  connectNow();
}

document.addEventListener('DOMContentLoaded', init);

window.SK = {
  version: VERSION,
  init,
  connectNow,
  disconnectNow,
  setObsPassword,
  clearObsPassword
};

export {
  logger,
  obsClient,
  skinManager,
  matchTimer,
  syncEngine,
  state,
  GameState
};
