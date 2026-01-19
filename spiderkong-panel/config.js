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
  // REGRA DURA: generico e brasileiraocopa = "NUNITO" (exatamente)
  skinFonts: {
    generico: "NUNITO",
    champions: "CHAMPIONS",
    libertadores: "BRANDING",
    brasileiraocopa: "NUNITO"
  },

  // ===========================================
  // SKIN SWAP - Inventario de Itens Visuais por Skin
  // ===========================================
  // Os nomes EXATOS dos itens .png dentro de cada grupo de skin no OBS
  // O sistema controla visibilidade INDIVIDUAL de cada item, NUNCA do grupo
  skinVisualItems: {
    // Itens comuns a TODAS as skins (lista base)
    // Cada skin tera estes itens com o nome da skin como prefixo do grupo
    commonItems: [
      "background.png",
      "placar.png",
      "cronometro.png",
      "escalacoes.png",
      "rectangles.png",
      "historicos.png",
      "tecnicos.png",
      "inform.png",
      "webcam.png",
      "chat_place.png",
      "qrcodes_place.png",
      "penalti_place.png",
      // Marcadores de penalti 1-5 por lado
      "penalti_esq_1.png",
      "penalti_esq_2.png",
      "penalti_esq_3.png",
      "penalti_esq_4.png",
      "penalti_esq_5.png",
      "penalti_dir_1.png",
      "penalti_dir_2.png",
      "penalti_dir_3.png",
      "penalti_dir_4.png",
      "penalti_dir_5.png"
    ],
    // Nomes dos grupos de skin no OBS (case-sensitive)
    skinGroups: {
      generico: "Generico",
      champions: "Champions",
      libertadores: "Libertadores",
      brasileiraocopa: "BrasileiraoCopa"
    }
  },

  // ===========================================
  // SKIN Assets Group - Itens compartilhados que precisam de refresh
  // ===========================================
  skinAssetsGroup: "SKIN Assets",
  skinAssetsItems: [
    // Escudos dinamicos
    "escudo_esq",
    "escudo_dir",
    // Logo da competicao (se existir)
    "logo_competicao"
  ],

  // ===========================================
  // OBS Source Names - LITERAL (com <skin> no nome)
  // IMPORTANTE: Estes sao os nomes EXATOS dos sources no OBS
  // O texto "<skin>" e parte LITERAL do nome, NAO e substituido
  // ===========================================
  textSources: {
    // Geral
    aovivo: "aovivo_<skin>",

    // Cronometro
    cronometroEtapa: "cronometro_etapa_<skin>",
    cronometroTempo: "cronometro_tempo_<skin>",

    // Placar - Siglas
    placarSiglaEsq: "placar_siglatime_esq_<skin>",
    placarSiglaDir: "placar_siglatime_dir_<skin>",

    // Placar - Gols
    placarGolsEsq: "placar_gols_esq_<skin>",
    placarGolsDir: "placar_gols_dir_<skin>",

    // Placar - Agregado
    placarAgregadoEsq: "placar_agregado_esq_<skin>",
    placarAgregadoDir: "placar_agregado_dir_<skin>",

    // Escalacao - Labels
    escalacaoEsq: "esq_escalacao_<skin>",
    escalacaoDir: "dir_escalacao_<skin>",
    escalacaoTimeEsq: "esq_escalacao_time_<skin>",
    escalacaoTimeDir: "dir_escalacao_time_<skin>",
    escalacaoTecnicoEsq: "esq_escalacao_tecnico_<skin>",
    escalacaoTecnicoDir: "dir_escalacao_tecnico_<skin>",

    // Historico
    historicoEsq: "esq_historico_<skin>",
    historicoDir: "dir_historico_<skin>"
  },

  // ===========================================
  // Padroes para sources gerados dinamicamente
  // {side} = esq|dir, {slot} = 01-11
  // ===========================================
  dynamicPatterns: {
    jogador: "{side}_jogador_{slot}_<skin>",
    moregoalballText: "{side}_moregoalball_text_{slot}_<skin>",
    goalball: "{side}_goalball_{slot}_<skin>",
    moregoalball: "{side}_moregoalball_{slot}_<skin>",
    card: "{side}_card_{slot}_<skin>",
    swap: "{side}_swap_{slot}_<skin>"
  },

  // ===========================================
  // LEGADO: sourcePatterns (corrigidos para nomes literais)
  // ===========================================
  sourcePatterns: {
    // Scoreboard - nomes literais com <skin>
    scoreHome: "placar_gols_esq_<skin>",
    scoreAway: "placar_gols_dir_<skin>",
    teamNameHome: "esq_escalacao_time_<skin>",
    teamNameAway: "dir_escalacao_time_<skin>",
    teamSiglaHome: "placar_siglatime_esq_<skin>",
    teamSiglaAway: "placar_siglatime_dir_<skin>",
    teamLogoHome: "escudo_esq_<skin>",
    teamLogoAway: "escudo_dir_<skin>",
    coachHome: "esq_escalacao_tecnico_<skin>",
    coachAway: "dir_escalacao_tecnico_<skin>",

    // Timer
    timer: "cronometro_tempo_<skin>",
    period: "cronometro_etapa_<skin>",

    // Aggregate
    aggHome: "placar_agregado_esq_<skin>",
    aggAway: "placar_agregado_dir_<skin>",
    aggTotalHome: "placar_agregado_esq_<skin>",
    aggTotalAway: "placar_agregado_dir_<skin>",

    // Penalties Score
    penScoreHome: "penalti_score_esq_<skin>",
    penScoreAway: "penalti_score_dir_<skin>"
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
