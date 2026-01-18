import { ObsWsClient } from './modules/obs-client.js';
import { createInitialGameState, GameState } from './modules/game-state.js';
import { SkinManager } from './modules/skin-manager.js';
import { MatchTimer } from './modules/timer.js';
import { SyncEngine } from './modules/sync.js';
import { cacheDom, renderAll, setBusy, setWsStatusPill, toggleSection } from './modules/ui.js';
import { Logger } from './modules/logger.js';

const VERSION = '0.1.0';

const state = createInitialGameState();
const logger = new Logger({ capacity: 400 });
const obsClient = new ObsWsClient();
const skinManager = new SkinManager();
const matchTimer = new MatchTimer();
const syncEngine = new SyncEngine();

function registerLoggerPanel() {
  const loggerLines = document.getElementById('loggerLines');
  if (!loggerLines) {
    return;
  }
  logger.subscribe((lines) => {
    loggerLines.innerHTML = lines
      .map((line) => `<div>${line}</div>`)
      .join('');
    loggerLines.scrollTop = loggerLines.scrollHeight;
  });
}

function fillSelect(select, options) {
  select.innerHTML = '';
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

function initUi() {
  const dom = cacheDom();
  fillSelect(dom.sceneSelect, [
    { value: '', label: 'Selecione' },
    { value: 'scene-1', label: 'Scene 1' },
    { value: 'scene-2', label: 'Scene 2' }
  ]);
  fillSelect(dom.skinSelect, [
    { value: '', label: 'Selecione' },
    { value: 'default', label: 'Default' }
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

  setWsStatusPill('disconnected');
  renderAll(state);
}

function bindEvents() {
  const selectors = [
    '#btnSyncObs',
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
    '#btnSubConfirm',
    '#btnLogCopy',
    '#btnLogClear',
    '#btnLowPower'
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
}

function init() {
  registerLoggerPanel();
  initUi();
  bindEvents();
  logger.info(`SpiderKong Control Panel ${VERSION} ready.`);
}

document.addEventListener('DOMContentLoaded', init);

window.SK = {
  version: VERSION,
  init
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
