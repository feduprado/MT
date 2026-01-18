/* ═══════════════════════════════════════════════════════════════════════════
   SPIDERKONG - GAME STATE MODULE
   Gerenciamento do estado global da partida
   ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Cria um jogador com valores padrao
 * @param {number} number - Numero do jogador
 * @returns {Object} Objeto jogador
 */
const createPlayer = (number) => ({
  number,
  name: '',
  goals: 0,
  yellowCards: 0,
  redCard: false,
  substitutedOut: false,
  isSubstitute: false,
  swapIconSide: 'default',  // 'default' | 'swapped'
  cardIconSide: 'default'   // 'default' | 'swapped'
});

/**
 * Cria um time com valores padrao
 * @returns {Object} Objeto time
 */
const createTeam = () => ({
  name: '',
  sigla: '',
  coach: '',
  logo: '',
  // 11 titulares (indices 0-10)
  players: Array.from({ length: 11 }, (_, i) => createPlayer(i + 1))
});

/**
 * Cria o estado inicial completo do jogo
 * @returns {Object} GameState inicial
 */
const createInitialGameState = () => ({
  meta: {
    skin: 'champions',
    matchId: null,
    createdAt: null,
    version: 1
  },

  teams: {
    home: createTeam(),
    away: createTeam()
  },

  score: {
    home: 0,
    away: 0,
    aggregateHome: 0,
    aggregateAway: 0,
    penaltiesHome: 0,
    penaltiesAway: 0
  },

  penalties: {
    active: false,
    home: [null, null, null, null, null],  // 5 batidas (null = nao bateu, true = converteu, false = perdeu)
    away: [null, null, null, null, null]
  },

  timer: {
    running: false,
    elapsed: 0,        // Milissegundos decorridos
    period: '1T',      // '1T', 'INT', '2T', 'PRO', 'PEN'
    addedTime: 0,      // Acrescimos em minutos
    startedAt: null    // Timestamp de quando iniciou
  },

  history: []  // Array de eventos
});

// ═══════════════════════════════════════════════════════════════════════════
// ESTADO GLOBAL
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Estado global do jogo
 * @type {Object}
 */
let GameState = createInitialGameState();

// ═══════════════════════════════════════════════════════════════════════════
// PERSISTENCIA (localStorage)
// ═══════════════════════════════════════════════════════════════════════════

const STORAGE_KEY = 'spiderkong-state';
const SETTINGS_KEY = 'spiderkong-settings';

/**
 * Salva o estado atual no localStorage
 */
const persistState = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      version: 1,
      savedAt: Date.now(),
      gameState: GameState
    }));
  } catch (err) {
    console.error('Erro ao salvar estado:', err);
  }
};

/**
 * Carrega o estado do localStorage
 * @returns {Object|null} GameState salvo ou null se nao existir
 */
const loadFromStorage = () => {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (data && data.version === 1 && data.gameState) {
      return data.gameState;
    }
    return null;
  } catch (err) {
    console.error('Erro ao carregar estado:', err);
    return null;
  }
};

/**
 * Limpa o estado salvo no localStorage
 */
const clearStorage = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Erro ao limpar estado:', err);
  }
};

/**
 * Salva configuracoes no localStorage
 * @param {Object} settings - Configuracoes a salvar
 */
const saveSettings = (settings) => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (err) {
    console.error('Erro ao salvar configuracoes:', err);
  }
};

/**
 * Carrega configuracoes do localStorage
 * @returns {Object} Configuracoes salvas ou padrao
 */
const loadSettings = () => {
  try {
    const data = JSON.parse(localStorage.getItem(SETTINGS_KEY));
    return data || {
      wsUrl: 'ws://localhost:4455',
      wsPassword: ''
    };
  } catch (err) {
    return {
      wsUrl: 'ws://localhost:4455',
      wsPassword: ''
    };
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// HISTORICO DE EVENTOS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Tipos de eventos do historico
 */
const EventTypes = {
  GOAL: 'goal',
  YELLOW_CARD: 'yellow_card',
  RED_CARD: 'red_card',
  SECOND_YELLOW_RED: 'second_yellow_red',
  SUBSTITUTION: 'substitution'
};

/**
 * Adiciona um evento ao historico
 * @param {Object} event - Evento a adicionar
 */
const addHistoryEvent = (event) => {
  const historyEvent = {
    id: generateId(),
    timestamp: Date.now(),
    ...event
  };
  GameState.history.unshift(historyEvent);
  persistState();
  return historyEvent;
};

/**
 * Remove um evento do historico pelo ID
 * @param {string} eventId - ID do evento
 */
const removeHistoryEvent = (eventId) => {
  const index = GameState.history.findIndex(e => e.id === eventId);
  if (index !== -1) {
    GameState.history.splice(index, 1);
    persistState();
  }
};

/**
 * Limpa todo o historico
 */
const clearHistory = () => {
  GameState.history = [];
  persistState();
};

// ═══════════════════════════════════════════════════════════════════════════
// UTILIDADES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Gera um ID unico
 * @returns {string} ID unico
 */
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
};

/**
 * Formata numero com 2 digitos (padding)
 * @param {number} n - Numero
 * @returns {string} Numero formatado
 */
const pad2 = (n) => String(n).padStart(2, '0');

/**
 * Obtem o minuto atual do cronometro
 * @returns {string} Minuto formatado (ex: "45'")
 */
const getCurrentMinute = () => {
  const totalSec = Math.floor(GameState.timer.elapsed / 1000);
  const min = Math.floor(totalSec / 60);
  return `${min}'`;
};

/**
 * Formata tempo em mm:ss
 * @param {number} ms - Milissegundos
 * @returns {string} Tempo formatado
 */
const formatTime = (ms) => {
  const totalSec = Math.floor(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${pad2(min)}:${pad2(sec)}`;
};

/**
 * Reseta apenas placar e timer (reset parcial)
 */
const resetPartialState = () => {
  GameState.score = {
    home: 0,
    away: 0,
    aggregateHome: 0,
    aggregateAway: 0,
    penaltiesHome: 0,
    penaltiesAway: 0
  };

  GameState.penalties = {
    active: false,
    home: [null, null, null, null, null],
    away: [null, null, null, null, null]
  };

  GameState.timer = {
    running: false,
    elapsed: 0,
    period: '1T',
    addedTime: 0,
    startedAt: null
  };

  // Zerar gols dos jogadores
  ['home', 'away'].forEach(team => {
    GameState.teams[team].players.forEach(player => {
      if (player) {
        player.goals = 0;
      }
    });
  });

  persistState();
};

/**
 * Reseta todo o estado (reset total)
 */
const resetTotalState = () => {
  const currentSkin = GameState.meta.skin;
  GameState = createInitialGameState();
  GameState.meta.skin = currentSkin;
  GameState.meta.matchId = generateId();
  GameState.meta.createdAt = Date.now();
  persistState();
};

/**
 * Restaura o estado a partir de dados salvos
 * @param {Object} savedState - Estado salvo
 */
const restoreState = (savedState) => {
  if (savedState) {
    // Merge com estado inicial para garantir todas as propriedades
    GameState = {
      ...createInitialGameState(),
      ...savedState,
      meta: {
        ...createInitialGameState().meta,
        ...savedState.meta
      },
      teams: {
        home: {
          ...createTeam(),
          ...savedState.teams?.home,
          players: savedState.teams?.home?.players || createTeam().players
        },
        away: {
          ...createTeam(),
          ...savedState.teams?.away,
          players: savedState.teams?.away?.players || createTeam().players
        }
      },
      score: {
        ...createInitialGameState().score,
        ...savedState.score
      },
      penalties: {
        ...createInitialGameState().penalties,
        ...savedState.penalties
      },
      timer: {
        ...createInitialGameState().timer,
        ...savedState.timer
      },
      history: savedState.history || []
    };
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTS (global para uso em outros modulos)
// ═══════════════════════════════════════════════════════════════════════════

window.GameState = GameState;
window.createInitialGameState = createInitialGameState;
window.createPlayer = createPlayer;
window.createTeam = createTeam;
window.persistState = persistState;
window.loadFromStorage = loadFromStorage;
window.clearStorage = clearStorage;
window.saveSettings = saveSettings;
window.loadSettings = loadSettings;
window.EventTypes = EventTypes;
window.addHistoryEvent = addHistoryEvent;
window.removeHistoryEvent = removeHistoryEvent;
window.clearHistory = clearHistory;
window.generateId = generateId;
window.pad2 = pad2;
window.getCurrentMinute = getCurrentMinute;
window.formatTime = formatTime;
window.resetPartialState = resetPartialState;
window.resetTotalState = resetTotalState;
window.restoreState = restoreState;
