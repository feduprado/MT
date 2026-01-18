import { ObsWsClient } from './modules/obs-client.js';
import { createInitialGameState, GameState } from './modules/game-state.js';
import { SkinManager } from './modules/skin-manager.js';
import { MatchTimer } from './modules/timer.js';
import { SyncEngine } from './modules/sync.js';
import { loadState, saveStateDebounced, setStorageLogger } from './modules/storage.js';
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

const VERSION = '0.5';
const OBSWS_DEFAULT_URL = 'ws://127.0.0.1:4455';
const STORAGE_KEY = 'spiderkong-obsws-password';
const STORAGE_URL_KEY = 'spiderkong-obsws-url';
const MAX_TIMER_MS = (199 * 60 + 59) * 1000;
const MAX_TIMER_RESTORE_DRIFT_MS = 24 * 60 * 60 * 1000;

const state = createInitialGameState();
const logger = new Logger({ capacity: 400 });
setStorageLogger(logger);
const obsClient = new ObsWsClient({
  url: localStorage.getItem(STORAGE_URL_KEY) || OBSWS_DEFAULT_URL,
  password: localStorage.getItem(STORAGE_KEY) || '',
  onStateChange: handleObsState,
  onLog: (level, message, meta) => {
    logger.log(level, message, meta);
  }
});
const syncEngine = new SyncEngine(obsClient, logger, () => state);
const skinManager = new SkinManager({ obsClient, logger, syncEngine });

let lowPowerEnabled = false;
let substitutionContext = null;
let sceneLocked = false;
let skinLocked = false;
let lastObsState = null;

const matchTimer = new MatchTimer({
  onTick: (formatted, rawMs) => {
    state.timer.elapsedMs = rawMs;
    renderAll(state);
    syncEngine.syncTimer(state);
  },
  onRunningChange: (running) => {
    state.timer.running = running;
    state.timer.startedAtEpochMs = running ? matchTimer.startedAtEpochMs : null;
  }
});

const WS_STATUS = {
  DISCONNECTED: {
    text: 'DESCONECTADO',
    icon: 'link_off',
    tone: 'neutral'
  },
  CONNECTING: {
    text: 'CONECTANDO',
    icon: 'sync',
    tone: 'info'
  },
  HELLO: {
    text: 'NEGOCIANDO',
    icon: 'sync',
    tone: 'info'
  },
  IDENTIFYING: {
    text: 'NEGOCIANDO',
    icon: 'sync',
    tone: 'info'
  },
  IDENTIFIED: {
    text: 'IDENTIFICADO',
    icon: 'check_circle',
    tone: 'success'
  },
  RECONNECTING: {
    text: 'RECONEXÃO',
    icon: 'sync',
    tone: 'info'
  },
  DEGRADED_AUTH_REQUIRED: {
    text: 'AUTH REQUIRED',
    icon: 'warning',
    tone: 'warning'
  },
  AUTH_FAILED: {
    text: 'AUTH FAILED',
    icon: 'error',
    tone: 'danger'
  }
};

function handleObsState(stateName) {
  const config = WS_STATUS[stateName] || WS_STATUS.DISCONNECTED;
  setWsStatusPill(config);
  updateSyncButtonLabel(stateName);
  if (stateName === 'IDENTIFIED' && lastObsState !== 'IDENTIFIED') {
    void refreshObsDiscovery();
  }
  lastObsState = stateName;
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

function getSkinLabel(skin) {
  switch (skin) {
    case 'champions':
      return 'Champions';
    case 'libertadores':
      return 'Libertadores';
    case 'brasileiraocopa':
      return 'Brasileirão Copa';
    case 'generico':
      return 'Genérico';
    default:
      return skin;
  }
}

function buildOptions(values, getLabel) {
  return values.map((value) => ({
    value,
    label: getLabel(value)
  }));
}

function pickSceneName(scenes, currentProgramSceneName) {
  if (!scenes.length) {
    return '';
  }
  const matchCenter = scenes.find((scene) => scene === 'Match Center');
  if (!sceneLocked && matchCenter) {
    return matchCenter;
  }
  if (state.meta.sceneName && scenes.includes(state.meta.sceneName)) {
    return state.meta.sceneName;
  }
  if (matchCenter) {
    return matchCenter;
  }
  if (currentProgramSceneName && scenes.includes(currentProgramSceneName)) {
    return currentProgramSceneName;
  }
  return scenes[0];
}

function pickSkinName(skins) {
  if (!skins.length) {
    return '';
  }
  if (skinLocked && skins.includes(state.meta.skin)) {
    return state.meta.skin;
  }
  if (state.meta.skin && skins.includes(state.meta.skin)) {
    return state.meta.skin;
  }
  return skins[0];
}

async function refreshSkinOptions(sceneName) {
  const dom = cacheDom();
  const discoveredSkins = await skinManager.discoverSkins(sceneName);
  const skins = discoveredSkins.length ? discoveredSkins : skinManager.getKnownSkins();
  const selectedSkin = pickSkinName(skins);
  if (selectedSkin) {
    state.meta.skin = selectedSkin;
  }
  fillSelect(dom.skinSelect, buildOptions(skins, getSkinLabel));
  if (dom.skinSelect && selectedSkin) {
    dom.skinSelect.value = selectedSkin;
  }
  persistState();
  renderAll(state);
}

async function refreshObsDiscovery() {
  if (!syncEngine.isIdentified()) {
    return;
  }
  const dom = cacheDom();
  const previousScene = state.meta.sceneName;
  const { scenes, currentProgramSceneName } = await skinManager.discoverScenes();
  if (!scenes.length) {
    return;
  }
  const selectedScene = pickSceneName(scenes, currentProgramSceneName);
  if (selectedScene) {
    state.meta.sceneName = selectedScene;
  }
  fillSelect(dom.sceneSelect, buildOptions(scenes, (scene) => scene));
  if (dom.sceneSelect && selectedScene) {
    dom.sceneSelect.value = selectedScene;
  }
  await refreshSkinOptions(selectedScene);
  if (previousScene !== selectedScene) {
    syncEngine.syncAll(state);
  }
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

function setObsUrl(url) {
  const safeUrl = (url || '').trim() || OBSWS_DEFAULT_URL;
  localStorage.setItem(STORAGE_URL_KEY, safeUrl);
  obsClient.setUrl(safeUrl);
  obsClient.connect({ force: true });
}

function clearObsUrl() {
  localStorage.removeItem(STORAGE_URL_KEY);
  obsClient.setUrl(OBSWS_DEFAULT_URL);
  obsClient.connect({ force: true });
}

function clearObsPassword() {
  localStorage.removeItem(STORAGE_KEY);
  obsClient.setPassword('');
}

async function handleSceneChange(event) {
  const sceneName = event?.target?.value?.trim();
  if (!sceneName) {
    return;
  }
  sceneLocked = true;
  state.meta.sceneName = sceneName;
  persistState();
  renderAll(state);
  skinLocked = false;
  await refreshSkinOptions(sceneName);
  if (syncEngine.isIdentified()) {
    setBusy(true);
    await syncEngine.syncAll(state);
    setBusy(false);
  }
}

async function handleSkinChange(event) {
  const newSkin = event?.target?.value?.trim();
  if (!newSkin || newSkin === state.meta.skin) {
    return;
  }
  skinLocked = true;
  setBusy(true);
  const ok = await skinManager.changeSkin(newSkin, state);
  if (!ok) {
    const dom = cacheDom();
    if (dom.skinSelect) {
      dom.skinSelect.value = state.meta.skin;
    }
  }
  persistState();
  renderAll(state);
  setBusy(false);
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

function clampTimerMs(value) {
  if (!Number.isFinite(value)) {
    return 0;
  }
  return Math.max(0, Math.min(MAX_TIMER_MS, value));
}

function persistState() {
  saveStateDebounced(state);
}

function countConverted(list) {
  if (!Array.isArray(list)) {
    return 0;
  }
  return list.filter((value) => value === true).length;
}

function normalizePenaltyArray(values) {
  const output = Array.from({ length: 5 }, () => null);
  if (!Array.isArray(values)) {
    return output;
  }
  for (let i = 0; i < 5; i += 1) {
    const value = values[i];
    if (value === true) {
      output[i] = true;
    } else if (value === false) {
      output[i] = false;
    } else {
      output[i] = null;
    }
  }
  return output;
}

function recalculatePenaltyScore() {
  state.score.penaltiesHome = countConverted(state.penalties?.home);
  state.score.penaltiesAway = countConverted(state.penalties?.away);
}

function applyPlayerSnapshot(target, snapshot) {
  if (!snapshot || !target) {
    return;
  }
  target.id = snapshot.id || target.id || crypto.randomUUID();
  target.slot = snapshot.slot ?? target.slot;
  target.number = snapshot.number ?? target.number;
  target.name = snapshot.name ?? '';
  target.goals = snapshot.goals ?? 0;
  target.yellowCards = snapshot.yellowCards ?? 0;
  target.redCard = Boolean(snapshot.redCard);
  target.substitutedOut = Boolean(snapshot.substitutedOut);
  target.isSubstitute = Boolean(snapshot.isSubstitute);
  target.swapIconSide = snapshot.swapIconSide || 'default';
  target.cardIconSide = snapshot.cardIconSide || 'default';
}

function applyTeamSnapshot(target, snapshot) {
  if (!target || !snapshot) {
    return;
  }
  target.name = snapshot.name ?? target.name;
  target.sigla = snapshot.sigla ?? target.sigla;
  target.coach = snapshot.coach ?? target.coach;
  target.logo = snapshot.logo ?? target.logo;

  if (Array.isArray(snapshot.slots)) {
    snapshot.slots.slice(0, 11).forEach((playerSnapshot, index) => {
      applyPlayerSnapshot(target.slots[index], playerSnapshot);
    });
  }

  if (Array.isArray(snapshot.out)) {
    target.out.length = 0;
    snapshot.out.forEach((playerSnapshot) => {
      const player = { ...playerSnapshot };
      applyPlayerSnapshot(player, playerSnapshot);
      target.out.push(player);
    });
  }

  if (Array.isArray(snapshot.substitutionSlots)) {
    target.substitutionSlots = Array.from({ length: 11 }, (_, index) =>
      Boolean(snapshot.substitutionSlots[index])
    );
  }
}

function applyStateSnapshot(snapshot) {
  if (!snapshot) {
    return;
  }
  const base = createInitialGameState();
  state.meta.skin = snapshot.meta?.skin ?? base.meta.skin;
  state.meta.sceneName = snapshot.meta?.sceneName ?? base.meta.sceneName;

  applyTeamSnapshot(state.teams.home, snapshot.teams?.home || base.teams.home);
  applyTeamSnapshot(state.teams.away, snapshot.teams?.away || base.teams.away);

  state.score.home = clampScore(snapshot.score?.home ?? base.score.home);
  state.score.away = clampScore(snapshot.score?.away ?? base.score.away);
  state.score.aggregateHome = clampScore(snapshot.score?.aggregateHome ?? base.score.aggregateHome);
  state.score.aggregateAway = clampScore(snapshot.score?.aggregateAway ?? base.score.aggregateAway);
  state.score.penaltiesHome = clampScore(snapshot.score?.penaltiesHome ?? base.score.penaltiesHome);
  state.score.penaltiesAway = clampScore(snapshot.score?.penaltiesAway ?? base.score.penaltiesAway);

  state.penalties.active =
    typeof snapshot.penalties?.active === 'boolean'
      ? snapshot.penalties.active
      : snapshot.timer?.period === 'PEN';
  state.penalties.home = normalizePenaltyArray(snapshot.penalties?.home);
  state.penalties.away = normalizePenaltyArray(snapshot.penalties?.away);

  state.timer.running = Boolean(snapshot.timer?.running);
  state.timer.elapsedMs = clampTimerMs(snapshot.timer?.elapsedMs ?? 0);
  state.timer.period = snapshot.timer?.period || base.timer.period;
  state.timer.startedAtEpochMs = snapshot.timer?.startedAtEpochMs ?? null;

  state.history = Array.isArray(snapshot.history) ? snapshot.history.slice(0, 50) : [];
  recalculatePenaltyScore();
}
function updateScore(team, delta) {
  const current = state.score[team] ?? 0;
  state.score[team] = clampScore(current + delta);
  renderAll(state);
  syncEngine.syncScore(state);
  persistState();
}

function updateAggregate(team, value) {
  if (team === 'home') {
    state.score.aggregateHome = parseClampNumber(value);
  } else {
    state.score.aggregateAway = parseClampNumber(value);
  }
  renderAll(state);
  syncEngine.syncScore(state);
  persistState();
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
  syncEngine.syncTeams(state);
  persistState();
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
  syncEngine.syncTimer(state);
  persistState();
  closeTimerModal();
}

function selectPeriod(period) {
  if (!period) {
    return;
  }
  state.timer.period = period;
  state.penalties.active = period === 'PEN';
  renderAll(state);
  syncEngine.syncTimer(state);
  syncEngine.syncPenalties(state);
  persistState();
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
  persistState();
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
  syncEngine.syncTeams(state);
  persistState();
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
  persistState();
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
  persistState();
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
  persistState();
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
  persistState();
}

function onHistoryClear() {
  state.history = [];
  renderAll(state);
  persistState();
}

function cyclePenalty(value) {
  if (value === null || value === undefined) {
    return true;
  }
  if (value === true) {
    return false;
  }
  return null;
}

function logPenaltiesStub() {
  if (syncEngine.isIdentified()) {
    syncEngine.syncPenalties(state);
    syncEngine.syncScore(state);
    return;
  }
  syncEngine.logOffline();
}

function logResetStub() {
  if (syncEngine.isIdentified()) {
    syncEngine.syncAll(state);
    return;
  }
  syncEngine.logOffline();
}

function onPenaltyCycle(team, index) {
  const parsedIndex = Number.parseInt(index, 10);
  if (!team || Number.isNaN(parsedIndex)) {
    return;
  }
  if (team !== 'home' && team !== 'away') {
    return;
  }
  const list = team === 'home' ? state.penalties.home : state.penalties.away;
  if (!Array.isArray(list) || parsedIndex < 0 || parsedIndex > 4) {
    return;
  }
  list[parsedIndex] = cyclePenalty(list[parsedIndex]);
  recalculatePenaltyScore();
  renderAll(state);
  persistState();
  logPenaltiesStub();
}

function onPenaltiesClear() {
  state.penalties.home = normalizePenaltyArray([]);
  state.penalties.away = normalizePenaltyArray([]);
  recalculatePenaltyScore();
  renderAll(state);
  persistState();
  logPenaltiesStub();
}

function resetPlayersStats(teamState) {
  teamState.slots.forEach((player) => {
    player.goals = 0;
    player.yellowCards = 0;
    player.redCard = false;
  });
  teamState.out.forEach((player) => {
    player.goals = 0;
    player.yellowCards = 0;
    player.redCard = false;
  });
}

function onResetPartial() {
  state.score.home = 0;
  state.score.away = 0;
  state.score.aggregateHome = 0;
  state.score.aggregateAway = 0;
  state.penalties.home = normalizePenaltyArray([]);
  state.penalties.away = normalizePenaltyArray([]);
  recalculatePenaltyScore();

  matchTimer.reset();
  state.timer.elapsedMs = matchTimer.elapsedMs;
  state.timer.running = matchTimer.running;
  state.timer.startedAtEpochMs = matchTimer.startedAtEpochMs;
  state.timer.period = '1T';
  state.penalties.active = false;

  resetPlayersStats(state.teams.home);
  resetPlayersStats(state.teams.away);

  addHistory({
    type: 'system_reset_partial',
    minute: '—',
    label: 'Reset parcial aplicado'
  });

  renderAll(state);
  persistState();
  logResetStub();
}

function onResetTotal() {
  const preservedMeta = {
    skin: state.meta.skin,
    sceneName: state.meta.sceneName
  };
  const freshState = createInitialGameState();
  freshState.meta.skin = preservedMeta.skin;
  freshState.meta.sceneName = preservedMeta.sceneName;
  applyStateSnapshot(freshState);

  matchTimer.reset();
  matchTimer.elapsedMs = state.timer.elapsedMs;
  matchTimer.running = state.timer.running;
  matchTimer.startedAtEpochMs = state.timer.startedAtEpochMs;
  matchTimer.lastSecond = Math.floor(state.timer.elapsedMs / 1000);

  renderAll(state);
  persistState();
  logResetStub();
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
  const sceneFallback = state.meta.sceneName || 'Match Center';
  fillSelect(dom.sceneSelect, [{ value: sceneFallback, label: sceneFallback }]);
  const skins = skinManager.getKnownSkins();
  fillSelect(dom.skinSelect, buildOptions(skins, getSkinLabel));
  if (dom.skinSelect && state.meta.skin) {
    dom.skinSelect.value = state.meta.skin;
  }
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

function restoreStateFromStorage() {
  const restored = loadState();
  if (!restored) {
    return false;
  }
  applyStateSnapshot(restored);
  return true;
}

function restoreTimerFromState() {
  matchTimer.elapsedMs = clampTimerMs(state.timer.elapsedMs || 0);
  state.timer.elapsedMs = matchTimer.elapsedMs;
  matchTimer.lastSecond = Math.floor(matchTimer.elapsedMs / 1000);
  if (!state.timer.running) {
    return;
  }
  const startedAt = state.timer.startedAtEpochMs;
  if (!Number.isFinite(startedAt)) {
    state.timer.running = false;
    state.timer.startedAtEpochMs = null;
    return;
  }
  const drift = Date.now() - startedAt;
  if (drift > MAX_TIMER_RESTORE_DRIFT_MS) {
    logger.warn('timer drift too large, pausing');
    state.timer.running = false;
    state.timer.elapsedMs = clampTimerMs(drift);
    state.timer.startedAtEpochMs = null;
    matchTimer.elapsedMs = state.timer.elapsedMs;
    matchTimer.lastSecond = Math.floor(matchTimer.elapsedMs / 1000);
    renderAll(state);
    return;
  }
  state.timer.elapsedMs = clampTimerMs(drift);
  matchTimer.elapsedMs = state.timer.elapsedMs;
  matchTimer.lastSecond = Math.floor(matchTimer.elapsedMs / 1000);
  matchTimer.start();
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
      syncEngine.syncTimer(state);
      persistState();
    },
    onTimerPause: () => {
      matchTimer.pause();
      state.timer.running = matchTimer.running;
      state.timer.elapsedMs = matchTimer.elapsedMs;
      syncEngine.syncTimer(state);
      persistState();
    },
    onTimerReset: () => {
      matchTimer.reset();
      state.timer.running = matchTimer.running;
      state.timer.elapsedMs = matchTimer.elapsedMs;
      syncEngine.syncTimer(state);
      persistState();
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
    onPenaltyCycle: (team, index) => onPenaltyCycle(team, index),
    onPenaltiesClear: () => onPenaltiesClear(),
    onResetPartial: () => onResetPartial(),
    onResetTotal: () => onResetTotal(),
    onSubCancel: () => closeSubModal(),
    onSubConfirm: () => onPlayerSubConfirm(),
    onPlayerAction: (dataset) => handlePlayerAction(dataset),
    onSceneChange: (event) => handleSceneChange(event),
    onSkinChange: (event) => handleSkinChange(event)
  });

  bindActions({
    onSyncObs: async () => {
      if (syncEngine.isIdentified()) {
        logger.info('sync all requested');
        setBusy(true);
        await syncEngine.syncAll(state);
        setBusy(false);
        return;
      }
      logger.info('connect requested');
      connectNow();
    },
    onLogCopy: copyLogs,
    onLogClear: () => logger.clear(),
    onLowPowerToggle: toggleLowPower
  });
}

function init() {
  registerLoggerPanel();
  restoreStateFromStorage();
  initUi();
  restoreTimerFromState();
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
  clearObsPassword,
  setObsUrl,
  clearObsUrl
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
