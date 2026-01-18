/**
 * SpiderKong Panel - Configuration
 * Complete configuration for OBS WebSocket integration
 */

window.CONFIG = {
  // ===========================================
  // WebSocket Connection
  // ===========================================
  wsUrl: "ws://127.0.0.1:4455",
  password: "",

  // ===========================================
  // Reconnection Settings
  // ===========================================
  reconnect: {
    enabled: true,
    delays: [1000, 2000, 5000, 10000, 30000],
    maxAttempts: Infinity
  },

  // ===========================================
  // Default Scene
  // ===========================================
  defaultScene: "Match Center",

  // ===========================================
  // Skins Configuration
  // ===========================================
  skins: ["generico", "champions", "libertadores", "brasileiraocopa"],
  defaultSkin: "generico",

  // Font mapping per skin
  skinFonts: {
    generico: "Nunito",
    champions: "CHAMPIONS",
    libertadores: "BRANDING",
    brasileiraocopa: "Nunito"
  },

  // ===========================================
  // OBS Source Naming Patterns
  // Use <skin> as placeholder for skin name
  // ===========================================
  sourcePatterns: {
    // Scoreboard
    scoreHome: "<skin>_placar_casa",
    scoreAway: "<skin>_placar_fora",
    teamNameHome: "<skin>_nome_casa",
    teamNameAway: "<skin>_nome_fora",
    teamSiglaHome: "<skin>_sigla_casa",
    teamSiglaAway: "<skin>_sigla_fora",
    teamLogoHome: "<skin>_escudo_casa",
    teamLogoAway: "<skin>_escudo_fora",
    coachHome: "<skin>_tecnico_casa",
    coachAway: "<skin>_tecnico_fora",

    // Timer
    timer: "<skin>_cronometro",
    period: "<skin>_periodo",

    // Aggregate
    aggHome: "<skin>_agregado_casa",
    aggAway: "<skin>_agregado_fora",
    aggTotalHome: "<skin>_agregado_total_casa",
    aggTotalAway: "<skin>_agregado_total_fora",

    // Penalties Score
    penScoreHome: "<skin>_penaltis_casa",
    penScoreAway: "<skin>_penaltis_fora",

    // Penalty markers (1-5)
    penMarkerHome: "<skin>_pen_casa_",
    penMarkerAway: "<skin>_pen_fora_",

    // Player slots (1-11)
    playerName: "<skin>_jogador_nome_",
    playerNumber: "<skin>_jogador_num_",
    playerGoal: "<skin>_jogador_gol_",
    playerGoalCount: "<skin>_jogador_gols_",
    playerCard: "<skin>_jogador_cartao_",
    playerSub: "<skin>_jogador_sub_"
  },

  // ===========================================
  // OBS Groups Configuration
  // ===========================================
  groups: {
    scoreboard: "Placar",
    timer: "Cronometro",
    penalties: "Penaltis",
    roster: "Escalacao",
    cards: "Cartoes"
  },

  // ===========================================
  // Asset Paths
  // ===========================================
  assets: {
    // Card icons
    cardYellow: "Assets/Cartoes/amarelo.png",
    cardRed: "Assets/Cartoes/vermelho.png",
    cardYellowRed: "Assets/Cartoes/amarelo_vermelho.png",

    // Goal icons
    goalSingle: "Assets/Cartoes/ball.png",
    goalMultiple: "Assets/Cartoes/ball.png",

    // Substitution icon
    subIcon: "Assets/Cartoes/swap.png",

    // Penalty markers
    penGoal: "Assets/Penaltis/gol.png",
    penMiss: "Assets/Penaltis/fora.png",
    penEmpty: "Assets/Penaltis/vazio.png",

    // Teams folder
    teamsFolder: "Assets/Times/",

    // Players folder
    playersFolder: "Assets/Players/",
    reservesFolder: "Assets/Reservas/"
  },

  // ===========================================
  // Match Center Specific
  // ===========================================
  mc: {
    groupSlots: "02. MC Cards jogadores",
    groupCards: "01. MC Cartoes",
    groupReserves: "03. MC Reservas",
    slotPrefix: "MC_Slot_",
    slotCount: 11,
    reservePrefix: "MC_Res_",
    reserveCount: 12,
    swapSuffix: "__swap",
    swapDelayMs: 160
  },

  // ===========================================
  // Timer Configuration
  // ===========================================
  timer: {
    maxMinutes: 199,
    maxSeconds: 59,
    syncIntervalMs: 1000
  },

  // ===========================================
  // Penalties Configuration
  // ===========================================
  penalties: {
    shotsPerTeam: 5,
    states: ["empty", "goal", "miss"]
  },

  // ===========================================
  // History Configuration
  // ===========================================
  history: {
    maxEvents: 50
  },

  // ===========================================
  // Storage Configuration
  // ===========================================
  storage: {
    key: "spiderkong_state",
    version: "2.0.0",
    autoSaveDebounceMs: 500,
    maxSizeBytes: 500000
  },

  // ===========================================
  // UI Configuration
  // ===========================================
  ui: {
    rosterSlots: 11,
    defaultPlayerNumber: "00"
  }
};
