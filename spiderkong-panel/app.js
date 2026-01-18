import { ObsWsClient } from './modules/obs-client.js';
import { createInitialGameState, GameState } from './modules/game-state.js';
import { SkinManager } from './modules/skin-manager.js';
import { MatchTimer } from './modules/timer.js';
import { SyncEngine } from './modules/sync.js';
import {
  bindActions,
  bindMainActions,
  cacheDom,
  renderAll,
  renderLoggerLines,
  setBusy,
  setControlsEnabled,
  setLowPowerState,
  setWsStatusPill
} from './modules/ui.js';
import { Logger } from './modules/logger.js';

const VERSION = '0.4';
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
const syncEngine = new SyncEngine(obsClient, logger, () => state);

let lowPowerEnabled = false;
let substitutionContext = null;

const matchTimer = new MatchTimer({
  onTick: (formatted, rawMs) => {
    state.timer.elapsedMs = rawMs;
    renderAll(state);
  },
  onRunningChange: (running) => {
    state.timer.running = running;
    state.timer.startedAtEpochMs = running ? matchTimer.startedAtEpochMs : null;
  }
});

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
  updateSyncButtonLabel(stateName);
}

function updateSyncButtonLabel(stateName) {
  const dom = cacheDom();
  if (!dom.btnSyncObs) {
    return;
  }
  dom.btnSyncObs.textContent = stateName === 'IDENTIFIED' ? 'SYNC OBS' : 'TENTAR CONECTAR';
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

function clampScore(value) {
  return Math.max(0, Math.min(99, value));
}

function parseClampNumber(value) {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) {
    return 0;
  }
  return clampScore(parsed);
}

function parseClampTimerMinutes(value) {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) {
    return 0;
  }
  return Math.max(0, Math.min(199, parsed));
}

function parseClampTimerSeconds(value) {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) {
    return 0;
  }
  return Math.max(0, Math.min(59, parsed));
}

function updateScore(team, delta) {
  const current = state.score[team] ?? 0;
  state.score[team] = clampScore(current + delta);
  renderAll(state);
  syncEngine.syncScore(state);
}

function updateAggregate(team, value) {
  if (team === 'home') {
    state.score.aggregateHome = parseClampNumber(value);
  } else {
    state.score.aggregateAway = parseClampNumber(value);
  }
  renderAll(state);
  syncEngine.syncScore(state);
}

function updateTeamFromInputs(team) {
  const dom = cacheDom();
  if (team === 'home') {
    state.teams.home.name = dom.homeTeamName?.value.trim() || '';
    state.teams.home.sigla = dom.homeTeamSigla?.value.trim() || '';
    state.teams.home.coach = dom.homeCoach?.value.trim() || '';
  } else {
    state.teams.away.name = dom.awayTeamName?.value.trim() || '';
    state.teams.away.sigla = dom.awayTeamSigla?.value.trim() || '';
    state.teams.away.coach = dom.awayCoach?.value.trim() || '';
  }
  renderAll(state);
}

function openTimerModal() {
  const dom = cacheDom();
  if (!dom.modalMask || !dom.modalTimerSet) {
    return;
  }
  const totalSeconds = Math.floor((state.timer.elapsedMs || 0) / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (dom.timerSetMinutes) {
    dom.timerSetMinutes.value = String(minutes);
  }
  if (dom.timerSetSeconds) {
    dom.timerSetSeconds.value = String(seconds);
  }
  dom.modalMask.classList.remove('hidden');
  dom.modalTimerSet.classList.remove('hidden');
}

function closeTimerModal() {
  const dom = cacheDom();
  if (!dom.modalMask || !dom.modalTimerSet) {
    return;
  }
  dom.modalMask.classList.add('hidden');
  dom.modalTimerSet.classList.add('hidden');
}

function confirmTimerModal() {
  const dom = cacheDom();
  const minutes = parseClampTimerMinutes(dom.timerSetMinutes?.value || '0');
  const seconds = parseClampTimerSeconds(dom.timerSetSeconds?.value || '0');
  matchTimer.setManual(minutes, seconds);
  state.timer.elapsedMs = matchTimer.elapsedMs;
  state.timer.running = matchTimer.running;
  state.timer.startedAtEpochMs = matchTimer.startedAtEpochMs;
  renderAll(state);
  closeTimerModal();
}

function selectPeriod(period) {
  if (!period) {
    return;
  }
  state.timer.period = period;
  renderAll(state);
}

function toggleRoster() {
  const dom = cacheDom();
  if (!dom.rosterBody || !dom.rosterToggle) {
    return;
  }
  dom.rosterBody.classList.toggle('is-collapsed');
  dom.rosterToggle.classList.toggle('roster-open');
}

function clearRoster(team) {
  const dom = cacheDom();
  const coachInput = team === 'home' ? dom.rosterHomeCoach : dom.rosterAwayCoach;
  const players = team === 'home' ? dom.rosterHomePlayers : dom.rosterAwayPlayers;
  if (coachInput) {
    coachInput.value = '';
  }
  players.forEach((input) => {
    if (input) {
      input.value = '';
    }
  });
  if (team === 'home') {
    state.teams.home.coach = '';
    state.teams.home.slots.forEach((player) => {
      player.name = '';
    });
  } else {
    state.teams.away.coach = '';
    state.teams.away.slots.forEach((player) => {
      player.name = '';
    });
  }
  renderAll(state);
}

function saveRoster(team) {
  const dom = cacheDom();
  const coachInput = team === 'home' ? dom.rosterHomeCoach : dom.rosterAwayCoach;
  const players = team === 'home' ? dom.rosterHomePlayers : dom.rosterAwayPlayers;
  if (team === 'home') {
    state.teams.home.coach = coachInput?.value.trim() || '';
    players.forEach((input, index) => {
      state.teams.home.slots[index].name = input?.value.trim() || '';
    });
  } else {
    state.teams.away.coach = coachInput?.value.trim() || '';
    players.forEach((input, index) => {
      state.teams.away.slots[index].name = input?.value.trim() || '';
    });
  }
  renderAll(state);
  syncEngine.syncAllPlayers(state);
}

function getHistoryMinute() {
  if (state.timer.period === 'INT' || state.timer.period === 'PEN') {
    return '—';
  }
  const baseMinute = Math.floor((state.timer.elapsedMs || 0) / 60000);
  let offset = 0;
  if (state.timer.period === '2T') {
    offset = 45;
  }
  if (state.timer.period === 'PRO') {
    offset = 90;
  }
  return `${baseMinute + offset}'`;
}

function addHistory(entry) {
  state.history.unshift(entry);
  if (state.history.length > 50) {
    state.history.length = 50;
  }
}

function buildHistoryLabel({ type, team, player, playerIn }) {
  const teamLabel = team === 'home' ? 'Casa' : 'Visitante';
  if (type === 'goal') {
    return `${teamLabel} Gol ${player.number} ${player.name}`;
  }
  if (type === 'yellow_card') {
    return `${teamLabel} Cartao amarelo ${player.number} ${player.name}`;
  }
  if (type === 'red_card') {
    return `${teamLabel} Cartao vermelho ${player.number} ${player.name}`;
  }
  if (type === 'second_yellow_red') {
    return `${teamLabel} Segundo amarelo ${player.number} ${player.name}`;
  }
  if (type === 'substitution') {
    return `${teamLabel} Substituicao ${player.number} ${player.name} saiu / ${playerIn.number} ${playerIn.name} entrou`;
  }
  return '';
}

function onPlayerGoal(team, slotIndex) {
  const player = state.teams[team].slots[slotIndex];
  if (!player || player.redCard) {
    return;
  }
  player.goals += 1;
  state.score[team] = clampScore((state.score[team] || 0) + 1);
  if (player.yellowCards > 0 || player.redCard) {
    player.cardIconSide = player.cardIconSide === 'default' ? 'swapped' : 'default';
  }
  if (state.teams[team].substitutionSlots[slotIndex]) {
    player.swapIconSide = player.swapIconSide === 'default' ? 'swapped' : 'default';
  }
  addHistory({
    type: 'goal',
    team,
    playerName: player.name,
    playerNumber: player.number,
    minute: getHistoryMinute(),
    totalGoals: player.goals,
    label: buildHistoryLabel({ type: 'goal', team, player })
  });
  renderAll(state);
  syncEngine.syncPlayer(team, slotIndex + 1, state);
  syncEngine.syncScore(state);
}

function onPlayerYellow(team, slotIndex) {
  const player = state.teams[team].slots[slotIndex];
  if (!player || player.redCard || player.yellowCards >= 2) {
    return;
  }
  player.yellowCards += 1;
  addHistory({
    type: 'yellow_card',
    team,
    playerName: player.name,
    playerNumber: player.number,
    minute: getHistoryMinute(),
    label: buildHistoryLabel({ type: 'yellow_card', team, player })
  });
  if (player.yellowCards === 2) {
    player.redCard = true;
    addHistory({
      type: 'second_yellow_red',
      team,
      playerName: player.name,
      playerNumber: player.number,
      minute: getHistoryMinute(),
      label: buildHistoryLabel({ type: 'second_yellow_red', team, player })
    });
  }
  renderAll(state);
  syncEngine.syncPlayer(team, slotIndex + 1, state);
}

function onPlayerRed(team, slotIndex) {
  const player = state.teams[team].slots[slotIndex];
  if (!player || player.redCard) {
    return;
  }
  player.redCard = true;
  addHistory({
    type: 'red_card',
    team,
    playerName: player.name,
    playerNumber: player.number,
    minute: getHistoryMinute(),
    label: buildHistoryLabel({ type: 'red_card', team, player })
  });
  renderAll(state);
  syncEngine.syncPlayer(team, slotIndex + 1, state);
}

function onPlayerSubOpen(team, slotIndex) {
  const player = state.teams[team].slots[slotIndex];
  if (!player || player.redCard) {
    return;
  }
  const dom = cacheDom();
  if (!dom.modalMask || !dom.modalSubstitution) {
    return;
  }
  if (dom.subOutNumber) {
    dom.subOutNumber.textContent = String(player.number ?? '');
  }
  if (dom.subOutName) {
    dom.subOutName.textContent = player.name || '';
  }
  if (dom.subInNumber) {
    dom.subInNumber.value = '';
  }
  if (dom.subInName) {
    dom.subInName.value = '';
  }
  substitutionContext = { team, slotIndex };
  dom.modalMask.classList.remove('hidden');
  dom.modalSubstitution.classList.remove('hidden');
}

function closeSubModal() {
  const dom = cacheDom();
  if (!dom.modalMask || !dom.modalSubstitution) {
    return;
  }
  dom.modalMask.classList.add('hidden');
  dom.modalSubstitution.classList.add('hidden');
  substitutionContext = null;
}

function onPlayerSubConfirm() {
  const dom = cacheDom();
  if (!substitutionContext || !dom.subInName || !dom.subInNumber) {
    return;
  }
  const name = dom.subInName.value.trim();
  if (!name) {
    return;
  }
  const number = parseClampNumber(dom.subInNumber.value || '0');
  const { team, slotIndex } = substitutionContext;
  const teamState = state.teams[team];
  const playerOut = teamState.slots[slotIndex];
  if (!playerOut) {
    return;
  }
  playerOut.substitutedOut = true;
  teamState.out.push(playerOut);
  const playerIn = {
    id: crypto.randomUUID(),
    slot: playerOut.slot,
    number,
    name,
    goals: 0,
    yellowCards: 0,
    redCard: false,
    substitutedOut: false,
    isSubstitute: true,
    swapIconSide: playerOut.swapIconSide,
    cardIconSide: playerOut.cardIconSide
  };
  teamState.slots[slotIndex] = playerIn;
  teamState.substitutionSlots[slotIndex] = true;
  addHistory({
    type: 'substitution',
    team,
    playerName: playerOut.name,
    playerNumber: playerOut.number,
    minute: getHistoryMinute(),
    label: buildHistoryLabel({ type: 'substitution', team, player: playerOut, playerIn }),
    playerInName: playerIn.name,
    playerInNumber: playerIn.number
  });
  renderAll(state);
  syncEngine.syncPlayer(team, slotIndex + 1, state);
  closeSubModal();
}

function onHistoryClear() {
  state.history = [];
  renderAll(state);
}

function handlePlayerAction(dataset) {
  const team = dataset.team;
  const slotIndex = Number.parseInt(dataset.slot, 10);
  if (!team || Number.isNaN(slotIndex)) {
    return;
  }
  switch (dataset.action) {
    case 'goal':
      onPlayerGoal(team, slotIndex);
      break;
    case 'yellow':
      onPlayerYellow(team, slotIndex);
      break;
    case 'red':
      onPlayerRed(team, slotIndex);
      break;
    case 'substitution':
      onPlayerSubOpen(team, slotIndex);
      break;
    default:
      break;
  }
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
  updateSyncButtonLabel('DISCONNECTED');
  setLowPowerState(lowPowerEnabled);
  setControlsEnabled(true);
  renderAll(state);
}

function bindEvents() {
  bindMainActions({
    onApplyHomeTeam: () => updateTeamFromInputs('home'),
    onApplyAwayTeam: () => updateTeamFromInputs('away'),
    onScoreHomeMinus: () => updateScore('home', -1),
    onScoreHomePlus: () => updateScore('home', 1),
    onScoreAwayMinus: () => updateScore('away', -1),
    onScoreAwayPlus: () => updateScore('away', 1),
    onAggHomeChange: (event) => updateAggregate('home', event.target.value),
    onAggAwayChange: (event) => updateAggregate('away', event.target.value),
    onTimerPlay: () => {
      matchTimer.start();
      state.timer.running = matchTimer.running;
      state.timer.startedAtEpochMs = matchTimer.startedAtEpochMs;
    },
    onTimerPause: () => {
      matchTimer.pause();
      state.timer.running = matchTimer.running;
      state.timer.elapsedMs = matchTimer.elapsedMs;
    },
    onTimerReset: () => {
      matchTimer.reset();
      state.timer.running = matchTimer.running;
      state.timer.elapsedMs = matchTimer.elapsedMs;
    },
    onTimerSet: () => openTimerModal(),
    onTimerSetCancel: () => closeTimerModal(),
    onTimerSetConfirm: () => confirmTimerModal(),
    onModalMaskClick: () => {
      closeTimerModal();
      closeSubModal();
    },
    onPeriodSelect: (period) => selectPeriod(period),
    onRosterToggle: () => toggleRoster(),
    onHomeRosterClear: () => clearRoster('home'),
    onHomeRosterSave: () => saveRoster('home'),
    onAwayRosterClear: () => clearRoster('away'),
    onAwayRosterSave: () => saveRoster('away'),
    onHistoryClear: () => onHistoryClear(),
    onSubCancel: () => closeSubModal(),
    onSubConfirm: () => onPlayerSubConfirm(),
    onPlayerAction: (dataset) => handlePlayerAction(dataset)
  });

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
