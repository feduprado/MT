/**
 * SpiderKong Panel - Configuration
 * Based on OBSPort structure
 */

window.CONFIG = {
  // WebSocket
  wsUrl: "ws://127.0.0.1:4455",
  password: "",

  // Default Scene
  defaultScene: "Match Center",

  // Available Skins
  skins: ["generico", "champions", "libertadores", "brasileiraocopa"],
  defaultSkin: "generico",

  // Slot Configuration
  slotPrefix: "Slot_",
  slotCount: 11,

  // Source Naming Pattern (use <skin> as placeholder)
  sourcePatterns: {
    // Scoreboard
    scoreHome: "<skin>_score_home",
    scoreAway: "<skin>_score_away",
    teamNameHome: "<skin>_team_home",
    teamNameAway: "<skin>_team_away",
    teamSiglaHome: "<skin>_sigla_home",
    teamSiglaAway: "<skin>_sigla_away",
    teamLogoHome: "<skin>_logo_home",
    teamLogoAway: "<skin>_logo_away",
    coachHome: "<skin>_coach_home",
    coachAway: "<skin>_coach_away",

    // Timer
    timer: "<skin>_timer",
    period: "<skin>_period",

    // Aggregate
    aggHome: "<skin>_agg_home",
    aggAway: "<skin>_agg_away",

    // Penalties
    penaltyPrefix: "<skin>_pen_",

    // Player slots
    playerName: "<skin>_player_name_",
    playerNumber: "<skin>_player_num_",
    playerGoals: "<skin>_player_goals_",
    playerCard: "<skin>_player_card_",
    playerSub: "<skin>_player_sub_"
  },

  // Groups in OBS
  groups: {
    scoreboard: "Placar",
    timer: "Cronometro",
    penalties: "Penaltis",
    roster: "Escalacao"
  },

  // Card Assets
  cardAssets: {
    yellow: "Assets/Cartoes/amarelo.png",
    red: "Assets/Cartoes/vermelho.png",
    yellowRed: "Assets/Cartoes/amarelo_vermelho.png"
  },

  // Match Center specific
  mc: {
    groupSlots: "02. MC Cards jogadores",
    groupCards: "01. MC Cartoes",
    groupReserves: "03. MC Reservas",
    slotPrefix: "MC_Slot_",
    slotCount: 11,
    reservePrefix: "MC_Res_",
    reserveCount: 12,
    swapSuffix: "__swap",
    swapDelayMs: 160,
    ballFile: "Assets/Cartoes/ball.png",
    ballFileRes: "Assets/Cartoes/ball_res.png",
    cardYellowFile: "Assets/Cartoes/amarelo.png",
    cardRedFile: "Assets/Cartoes/vermelho.png",
    reserveCardYellowFile: "Assets/Cartoes/amarelo_res.png",
    reserveCardRedFile: "Assets/Cartoes/vermelho_res.png"
  },

  // Timer limits
  timer: {
    maxMinutes: 199,
    maxSeconds: 59
  },

  // Storage key
  storageKey: "spiderkong_state",

  // Auto-save debounce (ms)
  autoSaveDebounce: 500,

  // Reconnect settings
  reconnect: {
    enabled: true,
    delays: [1000, 2000, 5000, 10000, 30000],
    maxAttempts: 10
  }
};
