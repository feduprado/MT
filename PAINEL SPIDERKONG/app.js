/* ═══════════════════════════════════════════════════════════════════════════
   SPIDERKONG CONTROL PANEL - MAIN APPLICATION
   v1.0 - Controlador principal do painel
   ═══════════════════════════════════════════════════════════════════════════ */

// ═══════════════════════════════════════════════════════════════════════════
// ESTADO DA APLICACAO
// ═══════════════════════════════════════════════════════════════════════════

const AppState = {
  activeSkin: 'champions',
  currentScene: 'Match Center',
  skinItems: {},  // Cache dos sceneItemIds
  busy: false,
  initialized: false
};

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURACAO DE SKINS
// ═══════════════════════════════════════════════════════════════════════════

const SKIN_CONFIG = {
  champions: {
    groupName: 'Champions',
    font: 'CHAMPIONS',
    fontSize: 27
  },
  libertadores: {
    groupName: 'Libertadores',
    font: 'BRANDING',
    fontSize: 27
  },
  brasileiraocopa: {
    groupName: 'Brasileirao&Copa do Brasil',
    font: 'NUNITO',
    fontSize: 27
  },
  generico: {
    groupName: 'Generico',
    font: 'NUNITO',
    fontSize: 27
  }
};

const KNOWN_SKINS = ['champions', 'libertadores', 'brasileiraocopa', 'generico'];

// ═══════════════════════════════════════════════════════════════════════════
// INICIALIZACAO
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Inicializa a aplicacao
 */
const init = async () => {
  console.log('SpiderKong: Inicializando...');

  // 1. Carregar estado salvo
  const savedState = loadFromStorage();
  if (savedState) {
    restoreState(savedState);
    console.log('SpiderKong: Estado restaurado do localStorage');
  } else {
    // Novo estado
    GameState.meta.matchId = generateId();
    GameState.meta.createdAt = Date.now();
  }

  // 2. Aplicar estado na UI
  renderAll();

  // 3. Configurar callbacks do OBS
  OBSClient.setCallbacks({
    onConnected: onOBSConnected,
    onDisconnected: onOBSDisconnected,
    onError: onOBSError,
    onReconnecting: onOBSReconnecting
  });

  // 4. Carregar configuracoes e tentar conectar
  const settings = loadSettings();
  document.getElementById('settingsWsUrl').value = settings.wsUrl || 'ws://localhost:4455';
  document.getElementById('settingsWsPassword').value = settings.wsPassword || '';

  // 5. Tentar conectar ao OBS
  await connectToOBS();

  // 6. Configurar event listeners
  setupEventListeners();

  AppState.initialized = true;
  console.log('SpiderKong: Inicializacao completa');
};

/**
 * Conecta ao OBS usando as configuracoes salvas
 */
const connectToOBS = async () => {
  const settings = loadSettings();

  updateConnectionStatus('connecting');

  try {
    await OBSClient.connect({
      url: settings.wsUrl,
      password: settings.wsPassword
    });
  } catch (err) {
    console.error('SpiderKong: Falha ao conectar ao OBS:', err);
    updateConnectionStatus('disconnected');
    showToast('Falha ao conectar ao OBS: ' + err.message, 'error');
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// CALLBACKS DO OBS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Callback quando conectado ao OBS
 */
const onOBSConnected = async () => {
  console.log('SpiderKong: Conectado ao OBS');
  updateConnectionStatus('connected');
  showToast('Conectado ao OBS', 'success');

  try {
    // Carregar cenas disponiveis
    const scenes = await OBSClient.getSceneList();
    populateSceneDropdown(scenes);

    // Obter cena atual
    const currentScene = await OBSClient.getCurrentScene();
    AppState.currentScene = currentScene;
    document.getElementById('sceneDropdown').value = currentScene;

    // Aplicar skin do estado
    AppState.activeSkin = GameState.meta.skin || 'champions';
    document.getElementById('skinDropdown').value = AppState.activeSkin;

  } catch (err) {
    console.error('SpiderKong: Erro ao inicializar apos conexao:', err);
  }
};

/**
 * Callback quando desconectado do OBS
 */
const onOBSDisconnected = () => {
  console.log('SpiderKong: Desconectado do OBS');
  updateConnectionStatus('disconnected');
};

/**
 * Callback quando ocorre erro no OBS
 * @param {Error} error - Erro ocorrido
 */
const onOBSError = (error) => {
  console.error('SpiderKong: Erro no OBS:', error);
  showToast('Erro no OBS', 'error');
};

/**
 * Callback quando tentando reconectar ao OBS
 * @param {number} attempt - Numero da tentativa
 */
const onOBSReconnecting = (attempt) => {
  console.log('SpiderKong: Reconectando ao OBS (tentativa ' + attempt + ')');
  updateConnectionStatus('reconnecting');
};

// ═══════════════════════════════════════════════════════════════════════════
// UI - STATUS DE CONEXAO
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Atualiza o indicador de status de conexao
 * @param {string} status - 'connected', 'disconnected', 'connecting', 'reconnecting'
 */
const updateConnectionStatus = (status) => {
  const statusEl = document.getElementById('connectionStatus');
  const textEl = statusEl.querySelector('.status-text');

  // Remover classes anteriores
  statusEl.classList.remove('connected', 'disconnected', 'connecting', 'reconnecting');

  // Aplicar nova classe e texto
  statusEl.classList.add(status);

  const statusTexts = {
    connected: 'Conectado',
    disconnected: 'Desconectado',
    connecting: 'Conectando...',
    reconnecting: 'Reconectando...'
  };

  textEl.textContent = statusTexts[status] || status;
};

// ═══════════════════════════════════════════════════════════════════════════
// UI - POPULACAO DE DROPDOWNS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Popula o dropdown de cenas
 * @param {Array} scenes - Lista de cenas do OBS
 */
const populateSceneDropdown = (scenes) => {
  const dropdown = document.getElementById('sceneDropdown');
  dropdown.innerHTML = '';

  scenes.forEach(scene => {
    const option = document.createElement('option');
    option.value = scene.sceneName;
    option.textContent = scene.sceneName;
    dropdown.appendChild(option);
  });
};

// ═══════════════════════════════════════════════════════════════════════════
// UI - RENDERIZACAO
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Renderiza toda a UI com base no GameState
 */
const renderAll = () => {
  renderTeams();
  renderRosters();
  renderScore();
  renderTimer();
  renderActions();
  renderPenalties();
  renderHistory();
};

/**
 * Renderiza a secao de times
 */
const renderTeams = () => {
  // Time da casa
  document.getElementById('homeName').value = GameState.teams.home.name || '';
  document.getElementById('homeSigla').value = GameState.teams.home.sigla || '';
  document.getElementById('homeCoach').value = GameState.teams.home.coach || '';

  // Time visitante
  document.getElementById('awayName').value = GameState.teams.away.name || '';
  document.getElementById('awaySigla').value = GameState.teams.away.sigla || '';
  document.getElementById('awayCoach').value = GameState.teams.away.coach || '';

  // Logos
  updateLogoPreview('home', GameState.teams.home.logo);
  updateLogoPreview('away', GameState.teams.away.logo);

  // Titulos das secoes de acoes
  document.getElementById('homeActionsTitle').textContent =
    GameState.teams.home.name || 'TIME DA CASA';
  document.getElementById('awayActionsTitle').textContent =
    GameState.teams.away.name || 'TIME VISITANTE';

  // Titulos das secoes de penaltis
  document.getElementById('homePenaltiesTitle').textContent =
    GameState.teams.home.name || 'TIME DA CASA';
  document.getElementById('awayPenaltiesTitle').textContent =
    GameState.teams.away.name || 'TIME VISITANTE';
};

/**
 * Atualiza preview do logo do time
 * @param {string} team - 'home' ou 'away'
 * @param {string} logoPath - Caminho do logo
 */
const updateLogoPreview = (team, logoPath) => {
  const img = document.getElementById(team + 'LogoPreview');
  const placeholder = document.getElementById(team + 'LogoPlaceholder');

  if (logoPath) {
    img.src = logoPath;
    img.style.display = 'block';
    placeholder.style.display = 'none';
  } else {
    img.src = '';
    img.style.display = 'none';
    placeholder.style.display = 'flex';
  }
};

/**
 * Renderiza as listas de escalacao (cadastro)
 */
const renderRosters = () => {
  renderRosterList('home');
  renderRosterList('away');
};

/**
 * Renderiza a lista de escalacao de um time
 * @param {string} team - 'home' ou 'away'
 */
const renderRosterList = (team) => {
  const container = document.getElementById(team + 'PlayersList');
  container.innerHTML = '';

  for (let i = 0; i < 11; i++) {
    const player = GameState.teams[team].players[i];
    const div = document.createElement('div');
    div.className = 'roster-item';

    const numSpan = document.createElement('span');
    numSpan.className = 'roster-item-number';
    numSpan.textContent = pad2(i + 1);

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'input roster-item-input';
    input.id = team + '-player-' + i;
    input.placeholder = 'Nome do jogador';
    input.value = player?.name || '';

    if (team === 'away') {
      div.appendChild(input);
      div.appendChild(numSpan);
    } else {
      div.appendChild(numSpan);
      div.appendChild(input);
    }

    container.appendChild(div);
  }
};

/**
 * Renderiza o placar
 */
const renderScore = () => {
  document.getElementById('scoreHome').textContent = GameState.score.home;
  document.getElementById('scoreAway').textContent = GameState.score.away;
  document.getElementById('aggregateHome').value = GameState.score.aggregateHome;
  document.getElementById('aggregateAway').value = GameState.score.aggregateAway;
};

/**
 * Renderiza o cronometro
 */
const renderTimer = () => {
  document.getElementById('timerDisplay').textContent = formatTime(GameState.timer.elapsed);

  // Atualizar estado dos botoes
  const btnPlay = document.getElementById('btnTimerPlay');
  const btnPause = document.getElementById('btnTimerPause');

  if (GameState.timer.running) {
    btnPlay.disabled = true;
    btnPause.disabled = false;
  } else {
    btnPlay.disabled = false;
    btnPause.disabled = true;
  }

  // Atualizar periodo ativo
  document.querySelectorAll('.period-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.period === GameState.timer.period);
  });

  // Mostrar/ocultar secao de penaltis
  const penaltiesSection = document.getElementById('sectionPenalties');
  penaltiesSection.style.display = GameState.timer.period === 'PEN' ? 'block' : 'none';
};

/**
 * Renderiza a lista de acoes dos jogadores
 */
const renderActions = () => {
  renderActionsList('home');
  renderActionsList('away');
};

/**
 * Renderiza a lista de acoes de um time
 * @param {string} team - 'home' ou 'away'
 */
const renderActionsList = (team) => {
  const container = document.getElementById(team + 'ActionsList');
  container.innerHTML = '';

  const players = GameState.teams[team].players;
  let hasSubstitutes = false;

  players.forEach((player, index) => {
    if (!player) return;

    // Separador para jogadores que entraram
    if (player.isSubstitute && !hasSubstitutes) {
      hasSubstitutes = true;
      const divider = document.createElement('div');
      divider.className = 'substitutes-divider';
      container.appendChild(divider);
    }

    const row = document.createElement('div');
    row.className = 'player-row';

    // Estados
    if (player.substitutedOut) row.classList.add('substituted');
    if (player.redCard) row.classList.add('expelled');

    // Numero
    const numSpan = document.createElement('span');
    numSpan.className = 'player-number';
    numSpan.textContent = pad2(player.number);

    // Nome
    const nameSpan = document.createElement('span');
    nameSpan.className = 'player-name';
    nameSpan.textContent = player.name || '---';

    // Badges
    const badges = document.createElement('div');
    badges.className = 'player-badges';

    // Badge de gols
    if (player.goals > 0) {
      const goalBadge = document.createElement('span');
      goalBadge.className = 'badge badge-goal';
      goalBadge.textContent = player.goals > 1 ? player.goals : '';
      badges.appendChild(goalBadge);
    }

    // Badge de cartao
    if (player.yellowCards === 2 || (player.yellowCards === 1 && player.redCard)) {
      const cardBadge = document.createElement('span');
      cardBadge.className = 'badge badge-double-yellow';
      badges.appendChild(cardBadge);
    } else if (player.redCard) {
      const cardBadge = document.createElement('span');
      cardBadge.className = 'badge badge-red';
      badges.appendChild(cardBadge);
    } else if (player.yellowCards === 1) {
      const cardBadge = document.createElement('span');
      cardBadge.className = 'badge badge-yellow';
      badges.appendChild(cardBadge);
    }

    // Badge de substituicao
    if (player.substitutedOut) {
      const swapBadge = document.createElement('span');
      swapBadge.className = 'badge badge-swap';
      swapBadge.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"/></svg>';
      badges.appendChild(swapBadge);
    }

    // Botoes de acao
    const actions = document.createElement('div');
    actions.className = 'player-actions';

    // Botao GOL
    const btnGoal = createActionButton('goal', 'GOL', () => onPlayerGoal(team, index));
    btnGoal.disabled = player.redCard;
    actions.appendChild(btnGoal);

    // Botao AMARELO
    const btnYellow = createActionButton('yellow-card', 'AMARELO', () => onPlayerYellow(team, index));
    btnYellow.disabled = player.redCard || player.yellowCards >= 2;
    actions.appendChild(btnYellow);

    // Botao VERMELHO
    const btnRed = createActionButton('red-card', 'VERMELHO', () => onPlayerRed(team, index));
    btnRed.disabled = player.redCard;
    actions.appendChild(btnRed);

    // Botao SUBSTITUICAO (apenas para titulares que nao sairam/expulsos)
    if (!player.isSubstitute && !player.substitutedOut && !player.redCard) {
      const btnSub = createActionButton('substitution', 'SUBST', () => onPlayerSubstitution(team, index));
      actions.appendChild(btnSub);
    }

    // Montar row de acordo com o lado
    if (team === 'away') {
      row.appendChild(actions);
      row.appendChild(badges);
      row.appendChild(nameSpan);
      row.appendChild(numSpan);
    } else {
      row.appendChild(numSpan);
      row.appendChild(nameSpan);
      row.appendChild(badges);
      row.appendChild(actions);
    }

    container.appendChild(row);
  });
};

/**
 * Cria um botao de acao
 * @param {string} type - Tipo do botao (goal, yellow-card, red-card, substitution)
 * @param {string} title - Titulo do botao
 * @param {Function} onClick - Funcao ao clicar
 * @returns {HTMLButtonElement}
 */
const createActionButton = (type, title, onClick) => {
  const btn = document.createElement('button');
  btn.className = 'btn btn-icon btn-icon-sm btn-' + type;
  btn.title = title;
  btn.onclick = onClick;

  // Icones SVG por tipo
  const icons = {
    'goal': '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="8"/></svg>',
    'yellow-card': '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="7" y="4" width="10" height="16" rx="1"/></svg>',
    'red-card': '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="7" y="4" width="10" height="16" rx="1"/></svg>',
    'substitution': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"/></svg>'
  };

  btn.innerHTML = icons[type] || '';

  return btn;
};

/**
 * Renderiza os marcadores de penaltis
 */
const renderPenalties = () => {
  ['home', 'away'].forEach(team => {
    const container = document.getElementById(team + 'Penalties');
    const markers = container.querySelectorAll('.penalty-marker');

    markers.forEach((marker, index) => {
      const state = GameState.penalties[team][index];
      marker.classList.remove('converted', 'missed');

      if (state === true) {
        marker.classList.add('converted');
      } else if (state === false) {
        marker.classList.add('missed');
      }
    });

    // Atualizar contador
    const score = GameState.penalties[team].filter(p => p === true).length;
    document.getElementById(team + 'PenaltyScore').textContent = score;
  });
};

/**
 * Renderiza o historico de eventos
 */
const renderHistory = () => {
  const container = document.getElementById('historyList');

  if (GameState.history.length === 0) {
    container.innerHTML = '<div class="history-empty">Nenhum evento registrado</div>';
    return;
  }

  container.innerHTML = '';

  GameState.history.forEach(event => {
    const item = document.createElement('div');
    item.className = 'history-item';

    // Minuto
    const minute = document.createElement('span');
    minute.className = 'history-minute';
    minute.textContent = event.minute || '--\'';

    // Tipo
    const type = document.createElement('span');
    type.className = 'history-type history-type-' + getHistoryTypeClass(event.type);
    type.innerHTML = getHistoryTypeIcon(event.type);

    // Texto
    const text = document.createElement('span');
    text.className = 'history-text';
    text.innerHTML = formatHistoryText(event);

    item.appendChild(minute);
    item.appendChild(type);
    item.appendChild(text);
    container.appendChild(item);
  });
};

/**
 * Retorna a classe CSS para o tipo de evento
 * @param {string} type - Tipo do evento
 * @returns {string}
 */
const getHistoryTypeClass = (type) => {
  const classes = {
    goal: 'goal',
    yellow_card: 'yellow',
    red_card: 'red',
    second_yellow_red: 'red',
    substitution: 'sub'
  };
  return classes[type] || '';
};

/**
 * Retorna o icone SVG para o tipo de evento
 * @param {string} type - Tipo do evento
 * @returns {string}
 */
const getHistoryTypeIcon = (type) => {
  const icons = {
    goal: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="6"/></svg>',
    yellow_card: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="8" y="5" width="8" height="14" rx="1"/></svg>',
    red_card: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="8" y="5" width="8" height="14" rx="1"/></svg>',
    second_yellow_red: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="8" y="5" width="8" height="14" rx="1"/></svg>',
    substitution: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"/></svg>'
  };
  return icons[type] || '';
};

/**
 * Formata o texto do evento do historico
 * @param {Object} event - Evento
 * @returns {string}
 */
const formatHistoryText = (event) => {
  const teamName = event.team === 'home'
    ? (GameState.teams.home.sigla || 'CASA')
    : (GameState.teams.away.sigla || 'VISIT');

  switch (event.type) {
    case 'goal':
      const goalText = event.totalGoals > 1 ? ' (' + event.totalGoals + ')' : '';
      return '<span class="history-team">' + teamName + '</span> - ' + event.playerName + goalText;

    case 'yellow_card':
      return '<span class="history-team">' + teamName + '</span> - ' + event.playerName + ' (Amarelo)';

    case 'red_card':
      return '<span class="history-team">' + teamName + '</span> - ' + event.playerName + ' (Vermelho)';

    case 'second_yellow_red':
      return '<span class="history-team">' + teamName + '</span> - ' + event.playerName + ' (2o Amarelo)';

    case 'substitution':
      return '<span class="history-team">' + teamName + '</span> - ' + event.playerOutName + ' &rarr; ' + event.playerInName;

    default:
      return event.type;
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// ACOES DOS JOGADORES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Registra gol de um jogador
 * @param {string} team - 'home' ou 'away'
 * @param {number} playerIdx - Indice do jogador
 */
const onPlayerGoal = (team, playerIdx) => {
  const player = GameState.teams[team].players[playerIdx];
  if (!player || player.redCard) return;

  player.goals++;
  GameState.score[team]++;

  // Registrar no historico
  addHistoryEvent({
    type: EventTypes.GOAL,
    team,
    playerNumber: player.number,
    playerName: player.name,
    minute: getCurrentMinute(),
    totalGoals: player.goals
  });

  renderAll();
  showToast('GOL! ' + player.name, 'success');
};

/**
 * Registra cartao amarelo de um jogador
 * @param {string} team - 'home' ou 'away'
 * @param {number} playerIdx - Indice do jogador
 */
const onPlayerYellow = (team, playerIdx) => {
  const player = GameState.teams[team].players[playerIdx];
  if (!player || player.redCard || player.yellowCards >= 2) return;

  player.yellowCards++;

  // Registrar no historico
  addHistoryEvent({
    type: EventTypes.YELLOW_CARD,
    team,
    playerNumber: player.number,
    playerName: player.name,
    minute: getCurrentMinute(),
    cardCount: player.yellowCards
  });

  // Segundo amarelo = vermelho
  if (player.yellowCards === 2) {
    player.redCard = true;

    addHistoryEvent({
      type: EventTypes.SECOND_YELLOW_RED,
      team,
      playerNumber: player.number,
      playerName: player.name,
      minute: getCurrentMinute()
    });

    showToast('EXPULSO! ' + player.name + ' (2o amarelo)', 'error');
  } else {
    showToast('Amarelo: ' + player.name, 'warning');
  }

  renderAll();
};

/**
 * Registra cartao vermelho de um jogador
 * @param {string} team - 'home' ou 'away'
 * @param {number} playerIdx - Indice do jogador
 */
const onPlayerRed = (team, playerIdx) => {
  const player = GameState.teams[team].players[playerIdx];
  if (!player || player.redCard) return;

  player.redCard = true;

  addHistoryEvent({
    type: EventTypes.RED_CARD,
    team,
    playerNumber: player.number,
    playerName: player.name,
    minute: getCurrentMinute()
  });

  renderAll();
  showToast('EXPULSO! ' + player.name, 'error');
};

/**
 * Inicia substituicao de um jogador
 * @param {string} team - 'home' ou 'away'
 * @param {number} playerIdx - Indice do jogador
 */
const onPlayerSubstitution = (team, playerIdx) => {
  const player = GameState.teams[team].players[playerIdx];
  if (!player || player.redCard || player.substitutedOut) return;

  // Armazenar dados para o modal
  window.pendingSubstitution = { team, playerIdx, player };

  // Preencher modal
  document.getElementById('subOutNumber').textContent = '#' + player.number;
  document.getElementById('subOutName').textContent = player.name || '---';
  document.getElementById('subInNumber').value = '';
  document.getElementById('subInName').value = '';

  // Abrir modal
  openModal('modalSubstitution');
};

/**
 * Confirma a substituicao
 */
const confirmSubstitution = () => {
  const sub = window.pendingSubstitution;
  if (!sub) return;

  const playerInName = document.getElementById('subInName').value.trim();
  const playerInNumber = parseInt(document.getElementById('subInNumber').value) || 0;

  if (!playerInName) {
    showToast('Digite o nome do jogador que entra', 'error');
    return;
  }

  const playerOut = GameState.teams[sub.team].players[sub.playerIdx];
  playerOut.substitutedOut = true;

  // Criar jogador que entra
  const playerIn = createPlayer(playerInNumber);
  playerIn.name = playerInName;
  playerIn.isSubstitute = true;

  // Adicionar a lista de jogadores
  GameState.teams[sub.team].players.push(playerIn);

  // Registrar no historico
  addHistoryEvent({
    type: EventTypes.SUBSTITUTION,
    team: sub.team,
    minute: getCurrentMinute(),
    playerOutNumber: playerOut.number,
    playerOutName: playerOut.name,
    playerInNumber: playerIn.number,
    playerInName: playerIn.name
  });

  closeModal();
  renderAll();
  showToast('Substituicao: ' + playerOut.name + ' -> ' + playerIn.name, 'success');

  window.pendingSubstitution = null;
};

// ═══════════════════════════════════════════════════════════════════════════
// PLACAR
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Incrementa o placar de um time
 * @param {string} team - 'home' ou 'away'
 */
const onScorePlus = (team) => {
  GameState.score[team]++;
  renderScore();
  persistState();
};

/**
 * Decrementa o placar de um time
 * @param {string} team - 'home' ou 'away'
 */
const onScoreMinus = (team) => {
  if (GameState.score[team] > 0) {
    GameState.score[team]--;
    renderScore();
    persistState();
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// CRONOMETRO
// ═══════════════════════════════════════════════════════════════════════════

const Timer = {
  interval: null,

  start() {
    if (GameState.timer.running) return;

    GameState.timer.running = true;
    GameState.timer.startedAt = Date.now() - GameState.timer.elapsed;

    this.interval = setInterval(() => {
      GameState.timer.elapsed = Date.now() - GameState.timer.startedAt;
      document.getElementById('timerDisplay').textContent = formatTime(GameState.timer.elapsed);
    }, 1000);

    renderTimer();
    persistState();
  },

  pause() {
    if (!GameState.timer.running) return;

    GameState.timer.running = false;
    clearInterval(this.interval);
    this.interval = null;

    renderTimer();
    persistState();
  },

  reset() {
    this.pause();
    GameState.timer.elapsed = 0;
    GameState.timer.startedAt = null;

    renderTimer();
    persistState();
  },

  setManual(minutes, seconds) {
    this.pause();
    GameState.timer.elapsed = (minutes * 60 + seconds) * 1000;

    renderTimer();
    persistState();
  }
};

/**
 * Define o periodo atual
 * @param {string} period - '1T', 'INT', '2T', 'PRO', 'PEN'
 */
const setPeriod = (period) => {
  GameState.timer.period = period;
  renderTimer();
  persistState();
};

/**
 * Abre modal para definir tempo manualmente
 */
const openTimerModal = () => {
  const totalSec = Math.floor(GameState.timer.elapsed / 1000);
  document.getElementById('timerSetMinutes').value = Math.floor(totalSec / 60);
  document.getElementById('timerSetSeconds').value = totalSec % 60;
  openModal('modalTimer');
};

/**
 * Confirma o tempo definido manualmente
 */
const confirmTimerSet = () => {
  const minutes = parseInt(document.getElementById('timerSetMinutes').value) || 0;
  const seconds = parseInt(document.getElementById('timerSetSeconds').value) || 0;
  Timer.setManual(minutes, seconds);
  closeModal();
};

// ═══════════════════════════════════════════════════════════════════════════
// PENALTIS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Cicla o estado de um penalti (null -> true -> false -> null)
 * @param {string} team - 'home' ou 'away'
 * @param {number} index - Indice do penalti (0-4)
 */
const cyclePenalty = (team, index) => {
  const states = [null, true, false];
  const current = GameState.penalties[team][index];
  const nextIdx = (states.indexOf(current) + 1) % 3;
  GameState.penalties[team][index] = states[nextIdx];

  // Atualizar placar de penaltis
  GameState.score.penaltiesHome = GameState.penalties.home.filter(p => p === true).length;
  GameState.score.penaltiesAway = GameState.penalties.away.filter(p => p === true).length;

  renderPenalties();
  persistState();
};

/**
 * Reseta todos os penaltis
 */
const resetPenalties = () => {
  GameState.penalties.home = [null, null, null, null, null];
  GameState.penalties.away = [null, null, null, null, null];
  GameState.score.penaltiesHome = 0;
  GameState.score.penaltiesAway = 0;

  renderPenalties();
  persistState();
  showToast('Penaltis resetados', 'success');
};

// ═══════════════════════════════════════════════════════════════════════════
// ESCALACAO
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Salva os nomes dos jogadores de um time
 * @param {string} team - 'home' ou 'away'
 */
const savePlayerNames = (team) => {
  // Tecnico
  const coachInput = document.getElementById(team + 'Coach');
  GameState.teams[team].coach = coachInput.value.trim();

  // Titulares (indices 0-10)
  for (let i = 0; i < 11; i++) {
    const input = document.getElementById(team + '-player-' + i);
    GameState.teams[team].players[i].name = input.value.trim();
  }

  persistState();
  renderAll();
  showToast('Escalacao salva', 'success');
};

/**
 * Limpa a escalacao de um time
 * @param {string} team - 'home' ou 'away'
 */
const clearRoster = (team) => {
  GameState.teams[team].coach = '';
  for (let i = 0; i < 11; i++) {
    GameState.teams[team].players[i].name = '';
  }

  persistState();
  renderRosterList(team);
  showToast('Escalacao limpa', 'success');
};

// ═══════════════════════════════════════════════════════════════════════════
// RESET
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Reset parcial (placar e timer)
 */
const resetPartial = () => {
  Timer.pause();
  resetPartialState();
  renderAll();
  showToast('Placar resetado', 'success');
};

/**
 * Abre modal de confirmacao de reset total
 */
const confirmResetTotal = () => {
  openModal('modalConfirmReset');
};

/**
 * Reset total
 */
const resetTotal = () => {
  Timer.pause();
  resetTotalState();
  closeModal();
  renderAll();
  showToast('Partida resetada', 'success');
};

// ═══════════════════════════════════════════════════════════════════════════
// SINCRONIZACAO COM OBS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Sincroniza todo o estado com o OBS
 */
const syncAllToObs = async () => {
  if (!OBSClient.isConnected()) {
    showToast('Nao conectado ao OBS', 'error');
    return;
  }

  showToast('Sincronizando...', 'warning');

  // TODO: Implementar na Fase 6
  console.log('SpiderKong: syncAllToObs - a implementar na Fase 6');

  showToast('Sincronizacao completa', 'success');
};

// ═══════════════════════════════════════════════════════════════════════════
// MODAIS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Abre um modal
 * @param {string} modalId - ID do modal
 */
const openModal = (modalId) => {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = 'flex';
    // Focar no primeiro input se houver
    const firstInput = modal.querySelector('input:not([type="hidden"])');
    if (firstInput) {
      setTimeout(() => firstInput.focus(), 100);
    }
  }
};

/**
 * Fecha todos os modais abertos
 */
const closeModal = () => {
  document.querySelectorAll('.modal-mask').forEach(modal => {
    modal.style.display = 'none';
  });
};

/**
 * Salva as configuracoes do modal de settings
 */
const saveSettingsFromModal = () => {
  const wsUrl = document.getElementById('settingsWsUrl').value.trim();
  const wsPassword = document.getElementById('settingsWsPassword').value;

  saveSettings({ wsUrl, wsPassword });
  closeModal();
  showToast('Configuracoes salvas', 'success');

  // Reconectar com novas configuracoes
  OBSClient.disconnect();
  setTimeout(connectToOBS, 500);
};

// ═══════════════════════════════════════════════════════════════════════════
// TOAST NOTIFICATIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Mostra uma notificacao toast
 * @param {string} message - Mensagem
 * @param {string} type - 'success', 'error', 'warning'
 */
const showToast = (message, type = 'success') => {
  const container = document.getElementById('toastContainer');

  const toast = document.createElement('div');
  toast.className = 'toast toast-' + type;

  const icons = {
    success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>',
    error: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6m0-6l6 6"/></svg>',
    warning: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 9v4m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/></svg>'
  };

  toast.innerHTML = '<span class="toast-icon">' + icons[type] + '</span><span class="toast-message">' + message + '</span>';

  container.appendChild(toast);

  // Auto-remover apos 3 segundos
  setTimeout(() => {
    toast.classList.add('toast-out');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
};

// ═══════════════════════════════════════════════════════════════════════════
// SECOES COLAPSAVEIS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Toggle de secao colapsavel
 * @param {string} sectionId - ID da secao
 */
const toggleSection = (sectionId) => {
  const section = document.getElementById(sectionId);
  if (section) {
    section.classList.toggle('collapsed');
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// EVENT LISTENERS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Configura os event listeners da aplicacao
 */
const setupEventListeners = () => {
  // Fechar modal ao clicar fora
  document.querySelectorAll('.modal-mask').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  });

  // Fechar modal com ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  });

  // Botao de settings
  document.getElementById('btnSettings').addEventListener('click', () => {
    openModal('modalSettings');
  });

  // Dropdown de cena
  document.getElementById('sceneDropdown').addEventListener('change', (e) => {
    AppState.currentScene = e.target.value;
  });

  // Dropdown de skin
  document.getElementById('skinDropdown').addEventListener('change', (e) => {
    AppState.activeSkin = e.target.value;
    GameState.meta.skin = e.target.value;
    persistState();
    // TODO: Trocar skin no OBS (Fase 6)
  });

  // Inputs de agregado
  document.getElementById('aggregateHome').addEventListener('change', (e) => {
    GameState.score.aggregateHome = parseInt(e.target.value) || 0;
    persistState();
  });

  document.getElementById('aggregateAway').addEventListener('change', (e) => {
    GameState.score.aggregateAway = parseInt(e.target.value) || 0;
    persistState();
  });

  // Inputs de time
  ['home', 'away'].forEach(team => {
    document.getElementById(team + 'Name').addEventListener('change', (e) => {
      GameState.teams[team].name = e.target.value.trim();
      persistState();
      renderTeams();
    });

    document.getElementById(team + 'Sigla').addEventListener('change', (e) => {
      GameState.teams[team].sigla = e.target.value.trim().toUpperCase();
      persistState();
    });

    document.getElementById(team + 'Coach').addEventListener('change', (e) => {
      GameState.teams[team].coach = e.target.value.trim();
      persistState();
    });
  });

  // Salvar configuracoes
  const btnSaveSettings = document.querySelector('#modalSettings .btn-primary');
  if (btnSaveSettings) {
    btnSaveSettings.onclick = saveSettingsFromModal;
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// INICIAR APLICACAO
// ═══════════════════════════════════════════════════════════════════════════

// Aguardar DOM carregar
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
