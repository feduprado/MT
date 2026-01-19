/**
 * SpiderKong Panel - Main Application
 * Complete broadcast control panel for OBS integration
 * Version 2.0.0
 */
 
(() => {
  "use strict";
 
  // Prevent double initialization
  if (window.__SPIDERKONG_LOADED__) return;
  window.__SPIDERKONG_LOADED__ = true;
 
  console.log("[SpiderKong] Initializing v2.0.0");
 
  // ===========================================
  // CONFIGURATION
  // ===========================================
  const CFG = window.CONFIG || {};
 
  // ===========================================
  // DOM HELPERS
  // ===========================================
  const $ = (id) => document.getElementById(id);
  const $$ = (sel) => document.querySelectorAll(sel);
 
  // ===========================================
  // UTILITIES
  // ===========================================
  const now = () => new Date().toLocaleTimeString("pt-BR", { hour12: false });
 
  const log = (msg, data = null) => {
    const line = `[${now()}] ${msg}`;
    if (data) {
      console.log(line, data);
    } else {
      console.log(line);
    }
  };
 
  const clamp = (val, min, max) => Math.max(min, Math.min(max, val));
 
  const pad2 = (n) => String(n).padStart(2, "0");
 
  const formatTime = (ms) => {
    const totalSec = Math.floor(ms / 1000);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${pad2(m)}:${pad2(s)}`;
  };
 
  const parseTime = (str) => {
    const parts = (str || "").split(":");
    if (parts.length !== 2) return 0;
    const m = parseInt(parts[0], 10) || 0;
    const s = parseInt(parts[1], 10) || 0;
    return (m * 60 + s) * 1000;
  };
 
  const uuid = () => crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
 
  const SKIN_FONT_FALLBACKS = {
    CHAMPIONS: "Regular",
    BRANDING: "Medium",
    NUNITO: "Medium"
  };
 
  const SKIN_FONT_SUPPORT = {
    CHAMPIONS: ["regular"],
    BRANDING: ["regular", "medium", "bold", "semibold", "extrabold", "black", "light", "italic", "medium italic", "bold italic"],
    NUNITO: ["regular", "medium", "bold", "semibold", "extrabold", "black", "light", "italic", "medium italic", "bold italic"]
  };
 
  const BASE_SKIN_TEXT_ITEMS = [
    "aovivo_<skin>",
    "cronometro_etapa_<skin>",
    "cronometro_tempo_<skin>",
    "placar_siglatime_esq_<skin>",
    "placar_siglatime_dir_<skin>",
    "placar_gols_esq_<skin>",
    "placar_gols_dir_<skin>",
    "placar_agregado_esq_<skin>",
    "placar_agregado_dir_<skin>",
    "esq_escalacao_<skin>",
    "dir_escalacao_<skin>",
    "esq_escalacao_time_<skin>",
    "dir_escalacao_time_<skin>",
    "esq_escalacao_tecnico_<skin>",
    "dir_escalacao_tecnico_<skin>",
    "esq_historico_<skin>",
    "dir_historico_<skin>"
  ];
 
  const textMeasureCanvas = document.createElement("canvas");
  const textMeasureContext = textMeasureCanvas.getContext("2d");
 
  // ===========================================
  // DOM ELEMENTS CACHE
  // ===========================================
  const el = {
    // Header
    sceneSelect: $("sceneSelect"),
    skinSelect: $("skinSelect"),
    pillWs: $("pillWs"),
    pillWsText: $("pillWsText"),
 
    // Teams
    homeTeamSelect: $("homeTeamSelect"),
    awayTeamSelect: $("awayTeamSelect"),
    homeTeamName: $("homeTeamName"),
    awayTeamName: $("awayTeamName"),
    homeTeamSigla: $("homeTeamSigla"),
    awayTeamSigla: $("awayTeamSigla"),
    homeCoach: $("homeCoach"),
    awayCoach: $("awayCoach"),
    homeLogoPreview: $("homeLogoPreview"),
    awayLogoPreview: $("awayLogoPreview"),
    btnApplyHome: $("btnApplyHome"),
    btnApplyAway: $("btnApplyAway"),
 
    // Score
    scoreHome: $("scoreHome"),
    scoreAway: $("scoreAway"),
    scoreSiglaHome: $("scoreSiglaHome"),
    scoreSiglaAway: $("scoreSiglaAway"),
    scoreNameHome: $("scoreNameHome"),
    scoreNameAway: $("scoreNameAway"),
    btnScoreHomeMinus: $("btnScoreHomeMinus"),
    btnScoreHomePlus: $("btnScoreHomePlus"),
    btnScoreAwayMinus: $("btnScoreAwayMinus"),
    btnScoreAwayPlus: $("btnScoreAwayPlus"),
    btnScoreReset: $("btnScoreReset"),
 
    // Aggregate
    btnToggleAgg: $("btnToggleAgg"),
    aggControls: $("aggControls"),
    aggHome: $("aggHome"),
    aggAway: $("aggAway"),
    aggTotalDisplay: $("aggTotalDisplay"),
    btnAggHomeMinus: $("btnAggHomeMinus"),
    btnAggHomePlus: $("btnAggHomePlus"),
    btnAggAwayMinus: $("btnAggAwayMinus"),
    btnAggAwayPlus: $("btnAggAwayPlus"),
 
    // Timer
    timerDisplay: $("timerDisplay"),
    timerSetInput: $("timerSetInput"),
    btnTimerSet: $("btnTimerSet"),
    btnTimerStart: $("btnTimerStart"),
    btnTimerPause: $("btnTimerPause"),
    btnTimerReset: $("btnTimerReset"),
    btnPeriod1T: $("btnPeriod1T"),
    btnPeriod2T: $("btnPeriod2T"),
    btnPeriodInt: $("btnPeriodInt"),
    btnPeriodPro: $("btnPeriodPro"),
    btnPeriodPen: $("btnPeriodPen"),
 
    // Penalties
    penaltiesCard: $("penaltiesCard"),
    penTagHome: $("penTagHome"),
    penTagAway: $("penTagAway"),
    penListHome: $("penListHome"),
    penListAway: $("penListAway"),
    penScoreHome: $("penScoreHome"),
    penScoreAway: $("penScoreAway"),
    btnPenaltyReset: $("btnPenaltyReset"),
 
    // Roster
    btnToggleRoster: $("btnToggleRoster"),
    rosterBody: $("rosterBody"),
    rosterCoachHome: $("rosterCoachHome"),
    rosterCoachAway: $("rosterCoachAway"),
    rosterInputsHome: $("rosterInputsHome"),
    rosterInputsAway: $("rosterInputsAway"),
    btnApplyRoster: $("btnApplyRoster"),
    btnClearRoster: $("btnClearRoster"),
 
    // Players in field
    btnTogglePlayers: $("btnTogglePlayers"),
    playersBody: $("playersBody"),
    playersListHome: $("playersListHome"),
    playersListAway: $("playersListAway"),
 
    // History
    btnToggleHistory: $("btnToggleHistory"),
    historyBody: $("historyBody"),
    historyList: $("historyList"),
    btnClearHistory: $("btnClearHistory"),
 
    // Actions
    btnSyncObs: $("btnSyncObs"),
    btnReconnect: $("btnReconnect"),
    btnResetPartial: $("btnResetPartial"),
    btnResetTotal: $("btnResetTotal"),
 
    // Player Modal
    playerModal: $("playerModal"),
    btnPlayerModalClose: $("btnPlayerModalClose"),
    playerModalNumber: $("playerModalNumber"),
    playerModalName: $("playerModalName"),
    playerModalTeam: $("playerModalTeam"),
    playerModalStats: $("playerModalStats"),
    btnPlayerGoal: $("btnPlayerGoal"),
    btnPlayerYellow: $("btnPlayerYellow"),
    btnPlayerRed: $("btnPlayerRed"),
    btnPlayerSub: $("btnPlayerSub"),
 
    // Sub Modal
    subModal: $("subModal"),
    btnSubModalClose: $("btnSubModalClose"),
    subModalOutName: $("subModalOutName"),
    subInNumber: $("subInNumber"),
    subInName: $("subInName"),
    btnSubConfirm: $("btnSubConfirm")
  };
 
  // ===========================================
  // STATE
  // ===========================================
  function createPlayer(slot, number = null, name = "") {
    return {
      id: uuid(),
      slot,
      number: number !== null ? number : slot,
      name,
      goals: 0,
      yellowCards: 0,
      redCard: false,
      substitutedOut: false,
      isEntered: false, // true for players who entered via substitution
      swapIconSide: "left",
      cardIconSide: "left"
    };
  }
 
  function createTeam() {
    return {
      name: "",
      sigla: "",
      coach: "",
      logo: "",
      players: Array.from({ length: 11 }, (_, i) => createPlayer(i + 1))
    };
  }
 
  function createPenalties() {
    return Array.from({ length: 5 }, () => "empty");
  }
 
  const state = {
    // Version for storage compatibility
    version: CFG.storage?.version || "2.0.0",
 
    // WebSocket
    ws: null,
    connected: false,
    retryIndex: 0,
    reconnectTimer: null,
    pendingRequests: new Map(),
    requestCounter: 1,
 
    // Scene/Skin
    currentScene: "",
    currentSkin: CFG.defaultSkin || "generico",
    availableScenes: [],
    discoveredSkins: [],
 
    // Teams
    teams: {
      home: createTeam(),
      away: createTeam()
    },
 
    // Score
    score: {
      home: 0,
      away: 0
    },
 
    // Aggregate
    aggregate: {
      enabled: false,
      home: 0,
      away: 0
    },
 
    // Timer
    timer: {
      running: false,
      elapsedMs: 0,
      period: "1T",
      startedAt: null,
      handle: null
    },
 
    // Penalties
    penalties: {
      active: false,
      home: createPenalties(),
      away: createPenalties()
    },
 
    // History
    history: [],
 
    // UI State
    selectedPlayer: null,
    selectedTeam: null,
 
    // Caches
    sceneItemIdCache: new Map(),
    inputFileCache: new Map(),
    inputSettingsCache: new Map(),
    textAnchors: new Map(),
    textMetrics: new Map(),
    managedTextItems: new Set(),

    // Skin swap state
    skinSwapBusy: false,
    skinSwapPending: null,
    skinSwapDebounceTimer: null
  };
 
  // ===========================================
  // WEBSOCKET - OBS WebSocket v5
  // ===========================================
  const OP = {
    HELLO: 0,
    IDENTIFY: 1,
    IDENTIFIED: 2,
    EVENT: 5,
    REQUEST: 6,
    RESPONSE: 7
  };
 
  async function sha256Base64(text) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const buffer = await crypto.subtle.digest("SHA-256", data);
    const bytes = new Uint8Array(buffer);
    let binary = "";
    bytes.forEach((b) => (binary += String.fromCharCode(b)));
    return btoa(binary);
  }
 
  function updateWsStatus(status) {
    if (!el.pillWs) return;
 
    el.pillWs.classList.remove("pill--on", "pill--off", "pill--connecting");
 
    const icon = el.pillWs.querySelector(".material-symbols-outlined");
 
    switch (status) {
      case "connected":
        el.pillWs.classList.add("pill--on");
        if (icon) icon.textContent = "wifi";
        if (el.pillWsText) el.pillWsText.textContent = "Conectado";
        break;
      case "connecting":
        el.pillWs.classList.add("pill--connecting");
        if (icon) icon.textContent = "sync";
        if (el.pillWsText) el.pillWsText.textContent = "Conectando...";
        break;
      case "disconnected":
      default:
        el.pillWs.classList.add("pill--off");
        if (icon) icon.textContent = "wifi_off";
        if (el.pillWsText) el.pillWsText.textContent = "Desconectado";
        break;
    }
  }
 
  function wsConnect(force = false) {
    if (force) {
      state.retryIndex = 0;
    }
 
    clearTimeout(state.reconnectTimer);
 
    if (state.ws) {
      state.ws.close(1000, "reconnect");
      state.ws = null;
    }
 
    const url = CFG.wsUrl || "ws://127.0.0.1:4455";
    log(`WS connecting to ${url}`);
    updateWsStatus("connecting");
 
    state.ws = new WebSocket(url);
 
    state.ws.onopen = () => {
      log("WS open");
    };
 
    state.ws.onerror = () => {
      log("WS error");
    };
 
    state.ws.onclose = (ev) => {
      state.connected = false;
      state.ws = null;
      rejectAllPending(new Error("socket closed"));
      updateWsStatus("disconnected");
      log(`WS closed (code: ${ev.code})`);
 
      if (CFG.reconnect?.enabled !== false) {
        scheduleReconnect();
      }
    };
 
    state.ws.onmessage = async (ev) => {
      let msg;
      try {
        msg = JSON.parse(ev.data);
      } catch {
        return;
      }
 
      const op = msg.op;
      const d = msg.d;
 
      if (op === OP.HELLO) {
        await handleHello(d);
      } else if (op === OP.IDENTIFIED) {
        handleIdentified();
      } else if (op === OP.EVENT) {
        handleEvent(d);
      } else if (op === OP.RESPONSE) {
        handleResponse(d);
      }
    };
  }
 
  async function handleHello(data) {
    log("WS hello received", { authRequired: !!data?.authentication });
 
    let auth;
    if (data?.authentication && CFG.password) {
      const salt = data.authentication.salt;
      const challenge = data.authentication.challenge;
      const secret = await sha256Base64(`${CFG.password}${salt}`);
      auth = await sha256Base64(`${secret}${challenge}`);
    }
 
    const payload = {
      op: OP.IDENTIFY,
      d: {
        rpcVersion: 1,
        eventSubscriptions: 2047
      }
    };
 
    if (auth) {
      payload.d.authentication = auth;
    }
 
    state.ws.send(JSON.stringify(payload));
    log("WS identify sent");
  }
 
  async function handleIdentified() {
    state.connected = true;
    state.retryIndex = 0;
    updateWsStatus("connected");
    log("WS identified - connected!");
 
    // Post-connection initialization
    await onConnected();
  }
 
  function handleEvent(data) {
    const eventType = data?.eventType;
    if (!eventType) return;
 
    if (eventType === "CurrentProgramSceneChanged") {
      state.currentScene = data.eventData?.sceneName || "";
      if (el.sceneSelect) {
        el.sceneSelect.value = state.currentScene;
      }
    }
  }
 
  function handleResponse(data) {
    const id = data?.requestId;
    const pending = state.pendingRequests.get(id);
    if (!pending) return;
 
    state.pendingRequests.delete(id);
    clearTimeout(pending.timeout);
 
    const status = data.requestStatus || {};
    if (status.result === false) {
      pending.reject(new Error(status.comment || "request failed"));
    } else {
      pending.resolve(data.responseData || {});
    }
  }
 
  function scheduleReconnect() {
    const delays = CFG.reconnect?.delays || [1000, 2000, 5000, 10000, 30000];
    const delay = delays[Math.min(state.retryIndex, delays.length - 1)];
    const jitter = Math.floor(Math.random() * 251);
 
    state.retryIndex++;
    log(`WS reconnect scheduled in ${delay + jitter}ms`);
 
    state.reconnectTimer = setTimeout(() => {
      wsConnect();
    }, delay + jitter);
  }
 
  function rejectAllPending(error) {
    state.pendingRequests.forEach((p) => {
      clearTimeout(p.timeout);
      p.reject(error);
    });
    state.pendingRequests.clear();
  }
 
  function call(requestType, requestData = {}, timeoutMs = 3000) {
    if (!state.connected || !state.ws) {
      return Promise.reject(new Error("not connected"));
    }
 
    const requestId = String(state.requestCounter++);
 
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        state.pendingRequests.delete(requestId);
        reject(new Error(`timeout: ${requestType}`));
      }, timeoutMs);
 
      state.pendingRequests.set(requestId, { resolve, reject, timeout });
 
      state.ws.send(JSON.stringify({
        op: OP.REQUEST,
        d: { requestType, requestId, requestData }
      }));
    });
  }
 
  // ===========================================
  // POST-CONNECTION INITIALIZATION
  // ===========================================
  async function onConnected() {
    try {
      // 1. Load scenes
      await loadScenes();
 
      // 2. Discover skins
      await discoverSkins();
 
      // 3. Load teams data
      loadTeamsData();
 
      // 4. Apply current skin
      if (state.currentSkin) {
        await applySkin(state.currentSkin, false);
      }
 
      // 5. Full sync
      await syncAll();
 
      log("Post-connection initialization complete");
    } catch (err) {
      log("Error in post-connection init", err.message);
    }
  }
 
  // ===========================================
  // OBS OPERATIONS
  // ===========================================
  async function loadScenes() {
    try {
      const res = await call("GetSceneList");
      state.availableScenes = (res.scenes || []).map((s) => s.sceneName).reverse();
      state.currentScene = res.currentProgramSceneName || "";
 
      if (el.sceneSelect) {
        el.sceneSelect.innerHTML = "";
        state.availableScenes.forEach((name) => {
          const opt = document.createElement("option");
          opt.value = name;
          opt.textContent = name;
          el.sceneSelect.appendChild(opt);
        });
        el.sceneSelect.value = state.currentScene;
      }
 
      log(`Loaded ${state.availableScenes.length} scenes`);
    } catch (err) {
      log("Error loading scenes", err.message);
    }
  }
 
  async function discoverSkins() {
    // For now, use configured skins
    state.discoveredSkins = CFG.skins || ["generico"];
 
    if (el.skinSelect) {
      el.skinSelect.innerHTML = "";
      state.discoveredSkins.forEach((skin) => {
        const opt = document.createElement("option");
        opt.value = skin;
        opt.textContent = skin.charAt(0).toUpperCase() + skin.slice(1);
        el.skinSelect.appendChild(opt);
      });
      el.skinSelect.value = state.currentSkin;
    }
 
    log(`Discovered skins: ${state.discoveredSkins.join(", ")}`);
  }
 
  async function setScene(sceneName) {
    if (!state.connected) return;
 
    try {
      await call("SetCurrentProgramScene", { sceneName });
      state.currentScene = sceneName;
      log(`Scene changed to: ${sceneName}`);
    } catch (err) {
      log("Error changing scene", err.message);
    }
  }
 
  function getSourceName(pattern) {
    // NOTA: Nao substituimos mais <skin> - os nomes no OBS sao literais
    // Esta funcao agora apenas retorna o pattern como esta
    // pois os sourcePatterns ja contem os nomes corretos com <skin> literal
    if (!pattern) return "";
    return pattern;  // Retorna o nome literal, sem substituicao
  }
 
  function getSkinFontFace(skin) {
    const font = CFG.skinFonts?.[skin];
    return font || "NUNITO";
  }
 
  function normalizeFontStyle(style) {
    return String(style || "").trim().replace(/\s+/g, " ").toLowerCase();
  }
 
  function getFontWeightFromStyle(style) {
    const normalized = normalizeFontStyle(style);
    if (normalized.includes("black")) return 900;
    if (normalized.includes("extrabold") || normalized.includes("extra bold")) return 800;
    if (normalized.includes("bold")) return 700;
    if (normalized.includes("semibold") || normalized.includes("semi bold")) return 600;
    if (normalized.includes("medium")) return 500;
    if (normalized.includes("light")) return 300;
    return 400;
  }
 
  function getFontStyleFromStyle(style) {
    const normalized = normalizeFontStyle(style);
    return normalized.includes("italic") ? "italic" : "normal";
  }
 
  function buildCanvasFont(font) {
    if (!font) return "";
    const weight = getFontWeightFromStyle(font.style);
    const fontStyle = getFontStyleFromStyle(font.style);
    const size = Number(font.size) || 0;
    const face = font.face || "NUNITO";
    return `${fontStyle} ${weight} ${size}px "${face}"`;
  }
 
  function measureTextWidth(text, font) {
    if (!textMeasureContext || !font) return 0;
    const canvasFont = buildCanvasFont(font);
    if (!canvasFont) return 0;
    textMeasureContext.font = canvasFont;
    const lines = String(text || "").split("\n");
    let maxWidth = 0;
    for (const line of lines) {
      const width = textMeasureContext.measureText(line).width;
      if (width > maxWidth) maxWidth = width;
    }
    return maxWidth;
  }
 
  function getAlignmentFromName(name) {
    if (/(^|_)esq(_|$)/.test(name)) return "left";
    if (/(^|_)dir(_|$)/.test(name)) return "right";
    return "center";
  }
 
  function getAlignmentFactor(alignment) {
    if (alignment === undefined || alignment === null) return 0;
    const horizontal = alignment % 4;
    if (horizontal === 1) return 0.5;
    if (horizontal === 2) return 1;
    return 0;
  }
 
  function buildSkinTextItemNames() {
    // IMPORTANTE: NAO substituir <skin> - o nome literal inclui "<skin>"
    // Os nomes no OBS sao exatamente como definidos em BASE_SKIN_TEXT_ITEMS
    const items = [...BASE_SKIN_TEXT_ITEMS];
    for (let i = 1; i <= 11; i++) {
      const slot = pad2(i);
      // Nomes literais com <skin> - NAO substituir!
      items.push(`esq_jogador_${slot}_<skin>`);
      items.push(`dir_jogador_${slot}_<skin>`);
      items.push(`esq_moregoalball_text_${slot}_<skin>`);
      items.push(`dir_moregoalball_text_${slot}_<skin>`);
    }
    return items;
  }
 
  function refreshManagedTextItems() {
    // Sem parametro - nomes sao literais com <skin>
    state.managedTextItems = new Set(buildSkinTextItemNames());
  }
 
  async function getSceneItemId(sceneName, itemName) {
    const cacheKey = `${sceneName}:${itemName}`;
    let sceneItemId = state.sceneItemIdCache.get(cacheKey);
 
    if (!sceneItemId) {
      const res = await call("GetSceneItemId", {
        sceneName,
        sourceName: itemName
      });
      sceneItemId = res.sceneItemId;
      state.sceneItemIdCache.set(cacheKey, sceneItemId);
    }
 
    return sceneItemId;
  }
 
  async function getSceneItemTransform(sceneName, itemName) {
    const sceneItemId = await getSceneItemId(sceneName, itemName);
    const res = await call("GetSceneItemTransform", {
      sceneName,
      sceneItemId
    });
    return { sceneItemId, transform: res.sceneItemTransform || {} };
  }
 
  function getTransformWidth(transform) {
    if (!transform) return 0;
    if (typeof transform.width === "number") return transform.width;
    if (typeof transform.sourceWidth === "number") {
      const scaleX = typeof transform.scaleX === "number" ? transform.scaleX : 1;
      return transform.sourceWidth * scaleX;
    }
    return 0;
  }
 
  async function getInputSettingsCached(inputName) {
    if (state.inputSettingsCache.has(inputName)) {
      return state.inputSettingsCache.get(inputName);
    }
    const res = await call("GetInputSettings", { inputName });
    const settings = res.inputSettings || {};
    state.inputSettingsCache.set(inputName, settings);
    return settings;
  }
 
  function resolveFontStyle(targetFace, style) {
    const normalizedStyle = normalizeFontStyle(style || "");
    const supported = SKIN_FONT_SUPPORT[targetFace] || [];
    if (supported.includes(normalizedStyle)) {
      return style || "";
    }
    return SKIN_FONT_FALLBACKS[targetFace] || style || "";
  }
 
  async function ensureTextAnchor(inputName) {
    if (state.textAnchors.has(inputName)) return state.textAnchors.get(inputName);
    if (!state.currentScene) return null;
 
    const { transform } = await getSceneItemTransform(state.currentScene, inputName);
    const width = getTransformWidth(transform);
    if (!width) return null;
 
    const alignment = getAlignmentFromName(inputName);
    const alignmentFactor = getAlignmentFactor(transform.alignment);
    const leftEdge = (transform.positionX || 0) - alignmentFactor * width;
    const anchorX = alignment === "left" ? leftEdge : alignment === "center" ? leftEdge + width / 2 : leftEdge + width;
    const anchor = { anchorX, alignment };
    state.textAnchors.set(inputName, anchor);
    return anchor;
  }
 
  async function updateTextFont(inputName, targetFace) {
    const settings = await getInputSettingsCached(inputName);
    const font = settings.font;
    if (!font) return;
 
    const resolvedStyle = resolveFontStyle(targetFace, font.style);
    const nextFont = {
      face: targetFace,
      style: resolvedStyle,
      size: font.size,
      flags: font.flags
    };
 
    if (font.face === nextFont.face && font.style === nextFont.style) {
      return;
    }
 
    await call("SetInputSettings", {
      inputName,
      inputSettings: { font: nextFont }
    });
 
    state.inputSettingsCache.set(inputName, {
      ...settings,
      font: nextFont
    });
  }
 
  async function updateTextAlignment(inputName, textOverride = null) {
    if (!state.currentScene) return;
 
    const anchor = await ensureTextAnchor(inputName);
    if (!anchor) return;
 
    const settings = await getInputSettingsCached(inputName);
    const font = settings.font;
    if (!font) return;
 
    const text = textOverride !== null ? textOverride : settings.text || "";
    const width = measureTextWidth(text, font);
    state.textMetrics.set(inputName, { width, text });
 
    const { sceneItemId, transform } = await getSceneItemTransform(state.currentScene, inputName);
    const alignmentFactor = getAlignmentFactor(transform.alignment);
    let leftEdge = anchor.anchorX;
 
    if (anchor.alignment === "center") {
      leftEdge = anchor.anchorX - width / 2;
    } else if (anchor.alignment === "right") {
      leftEdge = anchor.anchorX - width;
    }
 
    const positionX = leftEdge + alignmentFactor * width;
    const positionY = transform.positionY || 0;
 
    await call("SetSceneItemTransform", {
      sceneName: state.currentScene,
      sceneItemId,
      sceneItemTransform: {
        positionX,
        positionY
      }
    });
  }
 
  async function setInputText(inputName, text) {
    if (!state.connected || !inputName) return;
 
    try {
      await call("SetInputSettings", {
        inputName,
        inputSettings: { text: String(text) }
      });
      const cached = state.inputSettingsCache.get(inputName) || {};
      state.inputSettingsCache.set(inputName, {
        ...cached,
        text: String(text)
      });
 
      if (state.managedTextItems.has(inputName)) {
        await updateTextAlignment(inputName, String(text));
      }
    } catch (err) {
      log(`[setInputText] Failed for "${inputName}": ${err.message}`);
    }
  }
 
  async function setInputFile(inputName, file) {
    if (!state.connected || !inputName) return;
 
    try {
      await call("SetInputSettings", {
        inputName,
        inputSettings: { file }
      });
    } catch (err) {
      log(`[setInputFile] Failed for "${inputName}": ${err.message}`);
    }
  }
 
  async function setSceneItemEnabled(sceneName, itemName, enabled) {
    if (!state.connected) return;
 
    try {
      const sceneItemId = await getSceneItemId(sceneName, itemName);
      await call("SetSceneItemEnabled", {
        sceneName,
        sceneItemId,
        sceneItemEnabled: enabled
      });
    } catch (err) {
      log(`[setSceneItemEnabled] Failed for "${itemName}": ${err.message}`);
    }
  }
 
  // ===========================================
  // SKIN MANAGEMENT - Sistema de Troca por SUFIXO
  // ===========================================
  //
  // Este sistema opera em itens INDIVIDUAIS baseado no SUFIXO do nome:
  //   - _champions.png
  //   - _libertadores.png
  //   - _brasileiraocopa.png
  //   - _generico.png
  //
  // NÃO usa grupos OBS. Opera diretamente nos itens da cena "Match Center".
  // ===========================================

  // Constantes de configuração para troca de skin
  const SKIN_SWAP_DEBOUNCE_MS = 300;
  const SKIN_SWAP_ITEM_DELAY_MS = 10; // Delay entre itens para transição suave

  // Regex para detectar itens de skin pelo sufixo
  const SKIN_SUFFIX_REGEX = /_(champions|libertadores|brasileiraocopa|generico)\.png$/i;

  // Lista válida de skins (lowercase)
  const VALID_SKINS = ["champions", "libertadores", "brasileiraocopa", "generico"];

  // Cache de itens de skin descobertos na cena
  // Map<sceneName, Array<{sceneItemId, sourceName, skin}>>
  const skinItemsCache = new Map();

  /**
   * Verifica se o sistema está pronto para troca de skin
   * @returns {boolean} true se pode executar troca
   */
  function canExecuteSkinSwap() {
    if (!state.connected) {
      log("[SkinSwap] ABORTADO: WebSocket não está conectado (state.connected=false)");
      return false;
    }
    if (!state.ws) {
      log("[SkinSwap] ABORTADO: WebSocket é null");
      return false;
    }

    // CORREÇÃO: Validação robusta - garantir que as cenas foram carregadas
    if (!state.availableScenes || state.availableScenes.length === 0) {
      log("[SkinSwap] ABORTADO: Lista de cenas ainda não foi carregada do OBS");
      log("[SkinSwap] Aguarde a conexão ser estabelecida completamente");
      return false;
    }

    // CORREÇÃO: Verificar se a cena alvo (defaultScene) existe
    const targetScene = CFG.defaultScene || "Match Center";
    if (!state.availableScenes.includes(targetScene)) {
      log(`[SkinSwap] ABORTADO: Cena alvo "${targetScene}" NÃO EXISTE no OBS`);
      log(`[SkinSwap] Cenas disponíveis: ${state.availableScenes.join(", ")}`);
      log(`[SkinSwap] Corrija CONFIG.defaultScene ou crie a cena no OBS`);
      return false;
    }

    // Log informativo sobre a cena ativa vs cena alvo
    if (state.currentScene !== targetScene) {
      log(`[SkinSwap] INFO: Cena ativa no OBS é "${state.currentScene}", mas operando na cena "${targetScene}" (onde os PNGs estão)`);
    }

    return true;
  }

  /**
   * Extrai o sufixo de skin do nome do source
   * @param {string} sourceName - nome do source no OBS
   * @returns {string|null} skin detectada (lowercase) ou null se não for item de skin
   */
  function extractSkinSuffix(sourceName) {
    const match = sourceName.match(SKIN_SUFFIX_REGEX);
    if (match) {
      return match[1].toLowerCase();
    }
    return null;
  }

  /**
   * Faz flatten recursivo de todos os itens de uma cena/grupo
   * Quando encontra um grupo, expande seus filhos recursivamente
   * @param {string} sceneName - nome da cena ou grupo
   * @param {number} depth - profundidade atual da recursão (para logging)
   * @returns {Promise<Array<{sceneItemId: number, sourceName: string, sceneItemEnabled: boolean, parentScene: string}>>}
   */
  async function flattenSceneItems(sceneName, depth = 0) {
    const indent = "  ".repeat(depth);
    const allItems = [];

    try {
      const res = await call("GetSceneItemList", { sceneName });
      const sceneItems = res.sceneItems || [];

      if (depth === 0) {
        log(`[SkinSwap] ${indent}Cena "${sceneName}": ${sceneItems.length} itens de primeiro nível`);
      }

      for (const item of sceneItems) {
        // Verifica se é um grupo (isGroup pode ser true, ou inputKind pode ser "group")
        const isGroup = item.isGroup === true || item.inputKind === "group";

        if (isGroup) {
          log(`[SkinSwap] ${indent}📁 Grupo encontrado: "${item.sourceName}" - expandindo...`);
          // Recursivamente expande o grupo (grupos funcionam como sub-cenas)
          const groupItems = await flattenSceneItems(item.sourceName, depth + 1);
          // Adiciona os itens do grupo, marcando sua origem
          for (const groupItem of groupItems) {
            allItems.push({
              ...groupItem,
              parentGroup: item.sourceName
            });
          }
        } else {
          // Item normal - adiciona diretamente
          allItems.push({
            sceneItemId: item.sceneItemId,
            sourceName: item.sourceName,
            sceneItemEnabled: item.sceneItemEnabled,
            parentScene: sceneName
          });
        }
      }
    } catch (err) {
      log(`[SkinSwap] ${indent}ERRO ao expandir "${sceneName}": ${err.message}`);
    }

    return allItems;
  }

  /**
   * Descobre TODOS os itens de skin na cena (por sufixo)
   * Usa GetSceneItemList com flatten recursivo para listar itens (inclusive dentro de grupos)
   * @param {string} sceneName - nome da cena
   * @param {boolean} forceRefresh - se deve ignorar cache
   * @returns {Promise<Array<{sceneItemId: number, sourceName: string, skin: string, parentScene: string}>>}
   */
  async function discoverSkinItemsBySuffix(sceneName, forceRefresh = false) {
    const cacheKey = sceneName;

    if (!forceRefresh && skinItemsCache.has(cacheKey)) {
      return skinItemsCache.get(cacheKey);
    }

    log(`[SkinSwap] Descobrindo itens de skin na cena "${sceneName}" por sufixo...`);
    log(`[SkinSwap] Fazendo flatten recursivo (expandindo grupos)...`);

    try {
      // Usa flatten recursivo para pegar itens de dentro de grupos também
      const allItems = await flattenSceneItems(sceneName);

      log(`[SkinSwap] Total de itens após flatten: ${allItems.length}`);

      const skinItems = [];
      const ignoredPngs = []; // PNGs que não terminam com sufixo válido
      const groups = new Set();

      for (const item of allItems) {
        const skin = extractSkinSuffix(item.sourceName);
        if (skin) {
          skinItems.push({
            sceneItemId: item.sceneItemId,
            sourceName: item.sourceName,
            skin: skin,
            sceneItemEnabled: item.sceneItemEnabled,
            parentScene: item.parentScene || sceneName,
            parentGroup: item.parentGroup || null
          });
          if (item.parentGroup) {
            groups.add(item.parentGroup);
          }
        } else {
          // Log de PNGs ignorados (para debug)
          if (item.sourceName && item.sourceName.toLowerCase().includes('.png')) {
            ignoredPngs.push(item.sourceName);
          }
        }
      }

      // Agrupa por skin para log
      const bySkin = {};
      for (const item of skinItems) {
        if (!bySkin[item.skin]) bySkin[item.skin] = [];
        bySkin[item.skin].push(item.sourceName);
      }

      log(`[SkinSwap] Descobertos ${skinItems.length} itens de skin:`);
      for (const [skin, items] of Object.entries(bySkin)) {
        log(`[SkinSwap]   - ${skin}: ${items.length} itens`);
      }

      if (groups.size > 0) {
        log(`[SkinSwap] Itens encontrados em ${groups.size} grupo(s): ${[...groups].join(", ")}`);
      }

      // Aviso sobre PNGs ignorados
      if (ignoredPngs.length > 0) {
        log(`[SkinSwap] AVISO: ${ignoredPngs.length} itens PNG IGNORADOS (não terminam com _<skin>.png):`);
        for (const name of ignoredPngs.slice(0, 5)) {
          log(`[SkinSwap]   ⚠ IGNORADO: "${name}"`);
        }
        if (ignoredPngs.length > 5) {
          log(`[SkinSwap]   ... e mais ${ignoredPngs.length - 5} itens`);
        }
      }

      // Se não encontrou NADA, dá dicas de debug
      if (skinItems.length === 0) {
        log(`[SkinSwap] ⚠⚠⚠ NENHUM ITEM DE SKIN ENCONTRADO! ⚠⚠⚠`);
        log(`[SkinSwap] Possíveis causas:`);
        log(`[SkinSwap]   1. Os PNGs não terminam com _champions.png, _libertadores.png, etc.`);
        log(`[SkinSwap]   2. Os PNGs estão em uma cena diferente de "${sceneName}"`);
        log(`[SkinSwap]   3. Os grupos no OBS não estão sendo expandidos corretamente`);
        log(`[SkinSwap] Total de itens na cena (após flatten): ${allItems.length}`);
        if (allItems.length > 0) {
          log(`[SkinSwap] Primeiros 10 itens encontrados:`);
          for (const item of allItems.slice(0, 10)) {
            log(`[SkinSwap]   - "${item.sourceName}" (em ${item.parentScene})`);
          }
        }
      }

      skinItemsCache.set(cacheKey, skinItems);
      return skinItems;

    } catch (err) {
      log(`[SkinSwap] ERRO ao descobrir itens da cena "${sceneName}": ${err.message}`);
      return [];
    }
  }

  /**
   * Limpa o cache de itens de skin (para forçar redescoberta)
   */
  function clearSkinItemsCache() {
    skinItemsCache.clear();
    log("[SkinSwap] Cache de itens de skin limpo");
  }

  /**
   * Define visibilidade de um item específico na cena
   * @param {string} sceneName - nome da cena
   * @param {number} sceneItemId - ID do item
   * @param {boolean} enabled - visibilidade
   * @returns {Promise<boolean>} sucesso
   */
  async function setSceneItemVisible(sceneName, sceneItemId, enabled) {
    try {
      await call("SetSceneItemEnabled", {
        sceneName: sceneName,
        sceneItemId: sceneItemId,
        sceneItemEnabled: enabled
      });
      return true;
    } catch (err) {
      return false;
    }
  }

  /**
   * Tenta obter sceneItemId de um item usando cache
   * @param {string} sceneName - nome da cena
   * @param {string} sourceName - nome do source a buscar
   * @returns {Promise<number|null>} sceneItemId ou null
   */
  async function tryGetSceneItemId(sceneName, sourceName) {
    const cacheKey = `${sceneName}:${sourceName}`;

    if (state.sceneItemIdCache.has(cacheKey)) {
      return state.sceneItemIdCache.get(cacheKey);
    }

    try {
      const res = await call("GetSceneItemId", { sceneName, sourceName });
      if (res.sceneItemId) {
        state.sceneItemIdCache.set(cacheKey, res.sceneItemId);
        return res.sceneItemId;
      }
    } catch (e) {
      // Não encontrado
    }

    return null;
  }

  /**
   * NÚCLEO DA TROCA DE SKIN - Opera por sufixo, item por item
   *
   * @param {string} newSkin - skin desejada (champions, libertadores, brasileiraocopa, generico)
   * @returns {Promise<{shown: number, hidden: number, failed: number, missing: string[]}>}
   */
  async function executeSkinSwapBySuffix(newSkin) {
    // CORREÇÃO: Usar SEMPRE a cena padrão (Match Center) onde os PNGs estão,
    // independentemente da cena ativa no Programa do OBS
    const sceneName = CFG.defaultScene || "Match Center";
    const normalizedSkin = newSkin.toLowerCase();

    log(`[SkinSwap] ========================================`);
    log(`[SkinSwap] EXECUTANDO TROCA POR SUFIXO`);
    log(`[SkinSwap] Cena ALVO (defaultScene): ${sceneName}`);
    log(`[SkinSwap] Cena ATIVA no OBS: ${state.currentScene}`);
    log(`[SkinSwap] Nova skin: ${normalizedSkin}`);
    log(`[SkinSwap] ========================================`);

    // 1) Descobrir todos os itens de skin na cena
    const allSkinItems = await discoverSkinItemsBySuffix(sceneName, true);

    if (allSkinItems.length === 0) {
      log(`[SkinSwap] AVISO: Nenhum item de skin encontrado na cena!`);
      log(`[SkinSwap] Verifique se os itens no OBS terminam com _champions.png, _generico.png, etc.`);
      return { shown: 0, hidden: 0, failed: 0, missing: [] };
    }

    let shown = 0;
    let hidden = 0;
    let failed = 0;
    const missing = [];

    // 2) Para cada item, decide se mostra ou oculta baseado no sufixo
    for (const item of allSkinItems) {
      const shouldBeVisible = (item.skin === normalizedSkin);
      const action = shouldBeVisible ? "MOSTRAR" : "OCULTAR";

      // IMPORTANTE: Usar parentScene (pode ser um grupo) para SetSceneItemEnabled
      // Se o item está em um grupo, parentScene será o nome do grupo
      // Se o item está direto na cena, parentScene será o nome da cena
      const targetScene = item.parentGroup || item.parentScene || sceneName;
      const success = await setSceneItemVisible(targetScene, item.sceneItemId, shouldBeVisible);

      if (success) {
        if (shouldBeVisible) {
          shown++;
          log(`[SkinSwap]   ✓ "${item.sourceName}" VISÍVEL`);
        } else {
          hidden++;
          // Log apenas se era visível antes (para não poluir)
          if (item.sceneItemEnabled) {
            log(`[SkinSwap]   ✓ "${item.sourceName}" OCULTO`);
          }
        }
      } else {
        failed++;
        missing.push(item.sourceName);
        log(`[SkinSwap]   ✗ "${item.sourceName}" FALHOU ao ${action}`);
      }

      // Pequeno delay para não sobrecarregar o OBS
      if (SKIN_SWAP_ITEM_DELAY_MS > 0) {
        await new Promise(r => setTimeout(r, SKIN_SWAP_ITEM_DELAY_MS));
      }
    }

    log(`[SkinSwap] ----------------------------------------`);
    log(`[SkinSwap] RESULTADO:`);
    log(`[SkinSwap]   Itens visíveis (${normalizedSkin}): ${shown}`);
    log(`[SkinSwap]   Itens ocultos (outras skins): ${hidden}`);
    log(`[SkinSwap]   Falhas: ${failed}`);
    if (missing.length > 0) {
      log(`[SkinSwap]   Itens com problema: ${missing.join(", ")}`);
    }
    log(`[SkinSwap] ========================================`);

    return { shown, hidden, failed, missing };
  }

  /**
   * Oculta itens do grupo SKIN Assets (escudos, logo, etc.)
   * Mantido para compatibilidade - pode ser usado para assets compartilhados
   */
  async function hideSkinAssets() {
    // CORREÇÃO: Usar sempre a cena padrão onde os assets estão
    const sceneName = CFG.defaultScene || "Match Center";
    log("[SkinSwap] Ocultando SKIN Assets (se existirem)...");
    const assetsGroup = CFG.skinAssetsGroup || "SKIN Assets";

    // Tenta ocultar o grupo se existir
    const groupId = await tryGetSceneItemId(sceneName, assetsGroup);
    if (groupId) {
      try {
        await call("SetSceneItemEnabled", {
          sceneName: sceneName,
          sceneItemId: groupId,
          sceneItemEnabled: false
        });
        log(`[SkinSwap] Grupo "${assetsGroup}" oculto`);
      } catch (e) {
        log(`[SkinSwap] Grupo "${assetsGroup}" não pôde ser oculto: ${e.message}`);
      }
    }
  }

  /**
   * Mostra itens do grupo SKIN Assets
   */
  async function showSkinAssets() {
    // CORREÇÃO: Usar sempre a cena padrão onde os assets estão
    const sceneName = CFG.defaultScene || "Match Center";
    log("[SkinSwap] Mostrando SKIN Assets (se existirem)...");
    const assetsGroup = CFG.skinAssetsGroup || "SKIN Assets";

    const groupId = await tryGetSceneItemId(sceneName, assetsGroup);
    if (groupId) {
      try {
        await call("SetSceneItemEnabled", {
          sceneName: sceneName,
          sceneItemId: groupId,
          sceneItemEnabled: true
        });
        log(`[SkinSwap] Grupo "${assetsGroup}" visível`);
      } catch (e) {
        log(`[SkinSwap] Grupo "${assetsGroup}" não pôde ser mostrado: ${e.message}`);
      }
    }
  }

  /**
   * Atualiza fontes de todos os textos dinâmicos para a nova skin
   * REGRA DURA: brasileiraocopa e generico usam "NUNITO"
   * @param {string} skinKey - chave da nova skin
   */
  async function updateSkinFonts(skinKey) {
    log(`[SkinSwap] FASE 3: Atualizando fontes para skin "${skinKey}"...`);

    // REGRA DURA DE FONTE
    const targetFace = getSkinFontFace(skinKey);
    log(`[SkinSwap] Fonte alvo: "${targetFace}" (regra: ${skinKey === 'brasileiraocopa' || skinKey === 'generico' ? 'NUNITO obrigatório' : 'fonte da skin'})`);

    refreshManagedTextItems();

    let updated = 0;
    let skipped = 0;
    let failed = 0;
    const errors = [];

    for (const inputName of state.managedTextItems) {
      try {
        let settings;
        try {
          settings = await call("GetInputSettings", { inputName });
          settings = settings.inputSettings || {};
        } catch (e) {
          // Input não existe - pular silenciosamente
          skipped++;
          continue;
        }

        const font = settings.font;
        if (!font) {
          skipped++;
          continue;
        }

        // Se já está com a fonte correta, pula
        if (font.face === targetFace) {
          skipped++;
          continue;
        }

        // Preserva size e flags, ajusta style se necessário
        const resolvedStyle = resolveFontStyle(targetFace, font.style);
        const nextFont = {
          face: targetFace,
          style: resolvedStyle,
          size: font.size,
          flags: font.flags
        };

        try {
          await call("SetInputSettings", {
            inputName,
            inputSettings: { font: nextFont }
          });

          state.inputSettingsCache.set(inputName, { ...settings, font: nextFont });
          updated++;
          log(`[SkinSwap]   - "${inputName}": ${font.face} -> ${targetFace}`);
        } catch (fontErr) {
          // Tenta fallback sem style
          log(`[SkinSwap]   - "${inputName}": erro com style "${resolvedStyle}", tentando fallback...`);
          try {
            const fallbackFont = {
              face: targetFace,
              style: SKIN_FONT_FALLBACKS[targetFace] || "Regular",
              size: font.size,
              flags: font.flags
            };
            await call("SetInputSettings", {
              inputName,
              inputSettings: { font: fallbackFont }
            });
            state.inputSettingsCache.set(inputName, { ...settings, font: fallbackFont });
            updated++;
            log(`[SkinSwap]   - "${inputName}": fallback sucesso`);
          } catch (e2) {
            // Último recurso: só muda a face
            try {
              await call("SetInputSettings", {
                inputName,
                inputSettings: { font: { ...font, face: targetFace } }
              });
              updated++;
            } catch (e3) {
              failed++;
              errors.push(`${inputName}: ${e3.message}`);
            }
          }
        }
      } catch (err) {
        failed++;
        errors.push(`${inputName}: ${err.message}`);
      }
    }

    log(`[SkinSwap] FASE 3 completa: ${updated} atualizados, ${skipped} pulados, ${failed} falharam`);
    if (errors.length > 0 && errors.length <= 5) {
      log(`[SkinSwap] Erros de fonte:`, errors);
    }
  }

  /**
   * Executa a troca de skin de forma atômica e ordenada
   * NOVO: Usa sistema de SUFIXOS em vez de grupos
   */
  async function executeSkinSwap(oldSkin, newSkin) {
    const targetScene = CFG.defaultScene || "Match Center";
    log(`[SkinSwap] ========================================`);
    log(`[SkinSwap] INICIANDO TROCA: ${oldSkin} -> ${newSkin}`);
    log(`[SkinSwap] Cena ALVO (onde os PNGs estão): ${targetScene}`);
    log(`[SkinSwap] Cena ATIVA no OBS: ${state.currentScene}`);
    log(`[SkinSwap] Método: SUFIXO (item por item)`);
    log(`[SkinSwap] ========================================`);

    const startTime = Date.now();

    try {
      // FASE 1: Executar troca de skin por sufixo (núcleo)
      // Esta função oculta itens de outras skins e mostra itens da nova skin
      log("[SkinSwap] FASE 1: Trocando visibilidade dos PNGs por sufixo...");
      const result = await executeSkinSwapBySuffix(newSkin);
      log(`[SkinSwap] FASE 1 completa: ${result.shown} visíveis, ${result.hidden} ocultos, ${result.failed} falhas`);

      // FASE 2: Atualizar SKIN Assets (grupo compartilhado, se existir)
      log("[SkinSwap] FASE 2: Atualizando SKIN Assets...");
      await showSkinAssets();

      // FASE 3: Atualizar fontes para nova skin
      log("[SkinSwap] FASE 3: Atualizando fontes...");
      await updateSkinFonts(newSkin);

      // FASE 4: Re-sincronizar todos os dados do jogo
      log("[SkinSwap] FASE 4: Re-sincronizando dados do jogo...");
      await syncAllAfterSkinSwap();

      const elapsed = Date.now() - startTime;
      log(`[SkinSwap] ========================================`);
      log(`[SkinSwap] TROCA COMPLETA em ${elapsed}ms`);
      log(`[SkinSwap] Skin ativa: ${newSkin}`);
      log(`[SkinSwap] Itens afetados: ${result.shown + result.hidden}`);
      log(`[SkinSwap] ========================================`);

    } catch (err) {
      log(`[SkinSwap] ERRO DURANTE TROCA: ${err.message}`);
      console.error("[SkinSwap] Stack:", err.stack);

      // Recuperação: tenta pelo menos executar a troca básica
      try {
        log("[SkinSwap] Tentando recuperação...");
        await executeSkinSwapBySuffix(newSkin);
        await showSkinAssets();
        log("[SkinSwap] Recuperação parcial concluída");
      } catch (e) {
        log(`[SkinSwap] Falha na recuperação: ${e.message}`);
      }
    }
  }

  /**
   * Re-sincroniza todos os dados após troca de skin
   */
  async function syncAllAfterSkinSwap() {
    // Sync em paralelo para velocidade
    const tasks = [
      syncScore(),
      syncTeams(),
      syncTimer(),
      syncAggregate()
    ];

    // Sync de jogadores (mais pesado)
    tasks.push(syncPlayers());

    await Promise.all(tasks);

    // Pênaltis se ativos
    if (state.penalties.active) {
      await syncPenalties();
    }

    log("[SkinSwap] Resync completo: placar, times, timer, agregado, jogadores" + (state.penalties.active ? ", pênaltis" : ""));
  }

  async function syncSkinTextStyles() {
    if (!state.connected || !state.currentScene) return;
 
    refreshManagedTextItems();
    const targetFace = getSkinFontFace(state.currentSkin);
 
    for (const inputName of state.managedTextItems) {
      try {
        await ensureTextAnchor(inputName);
        await updateTextFont(inputName, targetFace);
        await updateTextAlignment(inputName);
      } catch (err) {
        log(`[syncSkinTextStyles] Source "${inputName}" not found or error: ${err.message}`);
      }
    }
  }
 
  /**
   * Aplica uma nova skin com todas as verificações e proteções
   * @param {string} newSkin - nome da nova skin
   * @param {boolean} animate - se deve animar a transição
   */
  async function applySkin(newSkin, animate = true) {
    // Verifica se pode executar
    if (!canExecuteSkinSwap()) {
      log(`[SkinSwap] Troca cancelada - sistema não está pronto`);
      return;
    }

    const oldSkin = state.currentSkin;

    // Se é a mesma skin, apenas sincroniza
    if (oldSkin === newSkin) {
      log(`[SkinSwap] Skin "${newSkin}" já está ativa, apenas sincronizando...`);
      await syncAll();
      return;
    }

    // Busy lock - se já está executando, agenda para depois
    if (state.skinSwapBusy) {
      log(`[SkinSwap] Busy - agendando troca para "${newSkin}"`);
      state.skinSwapPending = newSkin;
      return;
    }

    // Marca como ocupado
    state.skinSwapBusy = true;
    state.currentSkin = newSkin;

    try {
      // Executa a troca
      await executeSkinSwap(oldSkin, newSkin);

      // Atualiza UI
      if (el.skinSelect) {
        el.skinSelect.value = newSkin;
      }

      // Persiste
      saveState();

    } finally {
      // Libera o lock
      state.skinSwapBusy = false;

      // Verifica se há troca pendente
      if (state.skinSwapPending) {
        const pending = state.skinSwapPending;
        state.skinSwapPending = null;
        log(`[SkinSwap] Executando troca pendente para "${pending}"`);
        await applySkin(pending, animate);
      }
    }
  }

  /**
   * Troca a skin com debounce para evitar chamadas muito rápidas
   * @param {string} newSkin - nome da nova skin
   */
  async function changeSkin(newSkin) {
    if (newSkin === state.currentSkin && !state.skinSwapBusy) {
      log(`[SkinSwap] Skin "${newSkin}" já está ativa`);
      return;
    }

    // Debounce - cancela timer anterior e agenda novo
    clearTimeout(state.skinSwapDebounceTimer);

    state.skinSwapDebounceTimer = setTimeout(async () => {
      await applySkin(newSkin, true);
    }, SKIN_SWAP_DEBOUNCE_MS);

    log(`[SkinSwap] Troca para "${newSkin}" agendada (debounce ${SKIN_SWAP_DEBOUNCE_MS}ms)`);
  }

  // ===========================================
  // SYNC OPERATIONS
  // ===========================================
  async function syncAll() {
    if (!state.connected) {
      log("Cannot sync - not connected");
      return;
    }
 
    log("Starting full sync...");
 
    await syncSkinTextStyles();
 
    await Promise.all([
      syncScore(),
      syncTeams(),
      syncTimer(),
      syncAggregate(),
      syncPenalties(),
      syncPlayers()
    ]);
 
    log("Full sync complete");
  }
 
  async function syncScore() {
    const patterns = CFG.sourcePatterns || {};
 
    await Promise.all([
      setInputText(getSourceName(patterns.scoreHome), String(state.score.home)),
      setInputText(getSourceName(patterns.scoreAway), String(state.score.away))
    ]);
  }
 
  async function syncTeams() {
    const patterns = CFG.sourcePatterns || {};
    const home = state.teams.home;
    const away = state.teams.away;
 
    const tasks = [
      setInputText(getSourceName(patterns.teamNameHome), home.name),
      setInputText(getSourceName(patterns.teamNameAway), away.name),
      setInputText(getSourceName(patterns.teamSiglaHome), home.sigla),
      setInputText(getSourceName(patterns.teamSiglaAway), away.sigla),
      setInputText(getSourceName(patterns.coachHome), home.coach),
      setInputText(getSourceName(patterns.coachAway), away.coach)
    ];
 
    if (home.logo) {
      tasks.push(setInputFile(getSourceName(patterns.teamLogoHome), home.logo));
    }
    if (away.logo) {
      tasks.push(setInputFile(getSourceName(patterns.teamLogoAway), away.logo));
    }
 
    await Promise.all(tasks);
  }
 
  async function syncTimer() {
    const patterns = CFG.sourcePatterns || {};
 
    await Promise.all([
      setInputText(getSourceName(patterns.timer), formatTime(state.timer.elapsedMs)),
      setInputText(getSourceName(patterns.period), state.timer.period)
    ]);
  }
 
  async function syncAggregate() {
    if (!state.aggregate.enabled) return;
 
    const patterns = CFG.sourcePatterns || {};
    const totalHome = state.score.home + state.aggregate.home;
    const totalAway = state.score.away + state.aggregate.away;
 
    await Promise.all([
      setInputText(getSourceName(patterns.aggHome), String(state.aggregate.home)),
      setInputText(getSourceName(patterns.aggAway), String(state.aggregate.away)),
      setInputText(getSourceName(patterns.aggTotalHome), String(totalHome)),
      setInputText(getSourceName(patterns.aggTotalAway), String(totalAway))
    ]);
  }
 
  async function syncPenalties() {
    if (!state.penalties.active) return;

    const patterns = CFG.sourcePatterns || {};

    // Sync penalty scores
    const homeScore = state.penalties.home.filter((s) => s === "goal").length;
    const awayScore = state.penalties.away.filter((s) => s === "goal").length;

    await Promise.all([
      setInputText(getSourceName(patterns.penScoreHome), String(homeScore)),
      setInputText(getSourceName(patterns.penScoreAway), String(awayScore))
    ]);

    // Sync individual penalty markers to OBS
    await syncPenaltyMarkers();
  }

  /**
   * Sync individual penalty markers to OBS
   * Shows goalball icon for goal, xgoal icon for miss, hidden for empty
   */
  async function syncPenaltyMarkers() {
    if (!state.connected || !state.currentScene) return;

    const sides = [
      { key: "home", prefix: "esq" },
      { key: "away", prefix: "dir" }
    ];

    for (const { key, prefix } of sides) {
      const shots = state.penalties[key];

      for (let i = 0; i < 5; i++) {
        const markerNum = i + 1;
        const status = shots[i];

        // Penalty marker icons follow naming convention from config.skinVisualItems
        // Goal icon: penalti_esq_1.png to penalti_esq_5.png
        // Miss icon: shown by different asset file
        const pengoalName = `${prefix}_pengoal_${markerNum}`;
        const penmissName = `${prefix}_penmiss_${markerNum}`;

        const showGoal = status === "goal";
        const showMiss = status === "miss";

        // Try to set goal marker visibility
        try {
          await setSceneItemEnabled(state.currentScene, pengoalName, showGoal);
        } catch (e) {
          // Marker may not exist with this naming
        }

        // Try to set miss marker visibility
        try {
          await setSceneItemEnabled(state.currentScene, penmissName, showMiss);
        } catch (e) {
          // Marker may not exist with this naming
        }
      }
    }
  }
 
  /**
   * Format player text for OBS display
   * Home team (esq): "00 NOMEJOGADOR" (number left of name)
   * Away team (dir): "NOMEJOGADOR 00" (name left of number)
   *
   * Se o nome estiver vazio, retorna apenas o número (sem espaço extra)
   */
  function formatPlayerText(player, side) {
    const num = String(player.number || "").trim();
    const paddedNum = num.length > 0 ? pad2(parseInt(num, 10) || 0) : "";
    const name = (player.name || "").trim().toUpperCase();

    // Se nome vazio, retorna só o número
    if (!name) {
      return paddedNum;
    }

    // Se número vazio, retorna só o nome
    if (!paddedNum) {
      return name;
    }

    if (side === "home") {
      // Casa (esq_jogador_XX): número à ESQUERDA do nome
      // Formato: "01 NEYMAR"
      return `${paddedNum} ${name}`;
    } else {
      // Visitante (dir_jogador_XX): nome à ESQUERDA do número
      // Formato: "MESSI 10"
      return `${name} ${paddedNum}`;
    }
  }

  /**
   * Sync individual player icons to OBS
   * Handles visibility and positioning of goal/card/swap icons
   * 
   * REGRA #5: Icons are positioned RELATIVE to player name
   * When player has multiple icons (card + goal), one swaps to opposite side
   */
  async function syncPlayerIcons(side, playerIndex, player, prefix, slot) {
    if (!state.connected || !state.currentScene) return;

    const hasGoals = player.goals > 0;
    const hasYellow = player.yellowCards === 1 && !player.redCard;
    const hasRed = player.redCard || player.yellowCards >= 2;
    const isSubstituted = player.substitutedOut;
    const hasCard = hasYellow || hasRed;

    // Determine icon positions based on multiple icons
    // Default: icons on same side as player (esq = left icons, dir = right icons)
    // If player has multiple icons, goal icon swaps to opposite side
    const needsIconSwap = (hasCard || isSubstituted) && hasGoals;
    
    // Goal indicators
    const goalballName = `${prefix}_goalball_${slot}_<skin>`;
    const moregoalballName = `${prefix}_moregoalball_${slot}_<skin>`;
    const moregoalballTextName = `${prefix}_moregoalball_text_${slot}_<skin>`;

    // Show single goal icon for 1 goal
    const showGoalball = hasGoals && player.goals === 1;
    // Show multiple goal icon for 2+ goals
    const showMoregoalball = hasGoals && player.goals > 1;

    try {
      await setSceneItemEnabled(state.currentScene, goalballName, showGoalball);
      
      // Position goal icon (swap side if needed)
      if (showGoalball && needsIconSwap) {
        await positionIconRelativeToText(goalballName, prefix, slot, "opposite");
      } else if (showGoalball) {
        await positionIconRelativeToText(goalballName, prefix, slot, "default");
      }
    } catch (e) {
      // Icon may not exist
    }

    try {
      await setSceneItemEnabled(state.currentScene, moregoalballName, showMoregoalball);
      if (showMoregoalball) {
        await setInputText(moregoalballTextName, String(player.goals));
        
        // Position multiple goals icon (swap side if needed)
        if (needsIconSwap) {
          await positionIconRelativeToText(moregoalballName, prefix, slot, "opposite");
        } else {
          await positionIconRelativeToText(moregoalballName, prefix, slot, "default");
        }
      }
    } catch (e) {
      // Icon may not exist
    }

    // Card indicator - always on default side
    const cardName = `${prefix}_card_${slot}_<skin>`;
    const showCard = hasCard;

    try {
      await setSceneItemEnabled(state.currentScene, cardName, showCard);
      if (showCard) {
        await positionIconRelativeToText(cardName, prefix, slot, "default");
      }
    } catch (e) {
      // Icon may not exist
    }

    // Swap indicator - always on default side
    const swapName = `${prefix}_swap_${slot}_<skin>`;

    try {
      await setSceneItemEnabled(state.currentScene, swapName, isSubstituted);
      if (isSubstituted) {
        await positionIconRelativeToText(swapName, prefix, slot, "default");
      }
    } catch (e) {
      // Icon may not exist
    }
  }

  /**
   * Position an icon relative to the player text
   * @param {string} iconName - Name of the icon source
   * @param {string} prefix - esq or dir
   * @param {string} slot - Player slot (01-11)
   * @param {string} position - "default" or "opposite"
   */
  async function positionIconRelativeToText(iconName, prefix, slot, position) {
    if (!state.connected || !state.currentScene) return;

    try {
      const textName = `${prefix}_jogador_${slot}_<skin>`;
      
      // Get current cached settings for the text (has font info)
      const textSettings = state.inputSettingsCache.get(textName);
      if (!textSettings || !textSettings.font) return;

      // Get text transform (position info)
      const { transform: textTransform } = await getSceneItemTransform(state.currentScene, textName);
      if (!textTransform) return;

      // Measure text width
      const text = textSettings.text || "";
      const textWidth = measureTextWidth(text, textSettings.font);
      if (!textWidth) return;

      // Get icon transform
      const { sceneItemId: iconId, transform: iconTransform } = await getSceneItemTransform(state.currentScene, iconName);
      if (!iconId) return;

      // Calculate icon position
      // For esq (home): text is left-aligned, icons go to the RIGHT of text
      // For dir (away): text is right-aligned, icons go to the LEFT of text
      const iconWidth = iconTransform.sourceWidth || 20;
      const padding = 8; // Gap between text and icon

      let newX;
      if (prefix === "esq") {
        // Home team - default icon position is right of text
        if (position === "opposite") {
          // Swap to left of text
          newX = textTransform.positionX - iconWidth - padding;
        } else {
          // Default: right of text
          newX = textTransform.positionX + textWidth + padding;
        }
      } else {
        // Away team - default icon position is left of text  
        if (position === "opposite") {
          // Swap to right of text
          newX = textTransform.positionX + textWidth + padding;
        } else {
          // Default: left of text
          newX = textTransform.positionX - iconWidth - padding;
        }
      }

      // Keep Y position same as icon's current Y (aligned with player row)
      const newY = iconTransform.positionY;

      // Only update if position changed significantly (avoid jitter)
      const currentX = iconTransform.positionX || 0;
      if (Math.abs(currentX - newX) > 2) {
        await call("SetSceneItemTransform", {
          sceneName: state.currentScene,
          sceneItemId: iconId,
          sceneItemTransform: {
            positionX: newX,
            positionY: newY
          }
        });
      }
    } catch (e) {
      // Positioning failed - icon will stay at default OBS position
    }
  }

  /**
   * Sync all players to OBS
   */
  async function syncPlayers() {
    const tasks = [];

    for (const side of ["home", "away"]) {
      const team = state.teams[side];
      const prefix = side === "home" ? "esq" : "dir";

      // Only sync first 11 players (titulares)
      for (let i = 0; i < 11 && i < team.players.length; i++) {
        const player = team.players[i];
        const slot = pad2(i + 1);

        // Format player text with number
        const playerText = formatPlayerText(player, side);

        // Jogador text - nome literal: {prefix}_jogador_{slot}_<skin>
        const inputName = `${prefix}_jogador_${slot}_<skin>`;
        tasks.push(setInputText(inputName, playerText));

        // Sync player icons (goal, card, swap)
        tasks.push(syncPlayerIcons(side, i, player, prefix, slot));
      }
    }

    await Promise.all(tasks);
  }

  /**
   * Sync a single player to OBS (text + icons)
   */
  async function syncPlayer(side, playerIndex) {
    const team = state.teams[side];
    const player = team.players[playerIndex];
    if (!player || playerIndex >= 11) return;

    const prefix = side === "home" ? "esq" : "dir";
    const slot = pad2(playerIndex + 1);

    // Format player text with number
    const playerText = formatPlayerText(player, side);

    // Nome literal: {prefix}_jogador_{slot}_<skin>
    const inputName = `${prefix}_jogador_${slot}_<skin>`;
    await setInputText(inputName, playerText);

    // Sync player icons
    await syncPlayerIcons(side, playerIndex, player, prefix, slot);
  }
 
  // ===========================================
  // TEAMS
  // ===========================================
  function loadTeamsData() {
    const teamsData = window.SPIDERKONG_TEAMS?.teams || [];
 
    [el.homeTeamSelect, el.awayTeamSelect].forEach((select) => {
      if (!select) return;
 
      // Keep first option
      select.innerHTML = '<option value="">Selecionar time...</option>';
 
      teamsData.forEach((team) => {
        const opt = document.createElement("option");
        opt.value = team.name;
        opt.textContent = team.name;
        opt.dataset.sigla = team.sigla || "";
        opt.dataset.file = team.file || "";
        select.appendChild(opt);
      });
    });
  }
 
  function onTeamSelect(side) {
    const select = side === "home" ? el.homeTeamSelect : el.awayTeamSelect;
    const nameInput = side === "home" ? el.homeTeamName : el.awayTeamName;
    const siglaInput = side === "home" ? el.homeTeamSigla : el.awayTeamSigla;
    const logoPreview = side === "home" ? el.homeLogoPreview : el.awayLogoPreview;
 
    if (!select) return;
 
    const opt = select.options[select.selectedIndex];
    if (!opt || !opt.value) return;
 
    const teamData = {
      name: opt.value,
      sigla: opt.dataset.sigla || "",
      logo: opt.dataset.file || ""
    };
 
    // Update inputs
    if (nameInput) nameInput.value = teamData.name;
    if (siglaInput) siglaInput.value = teamData.sigla;
    if (logoPreview) logoPreview.src = teamData.logo;
 
    // Update state
    state.teams[side].name = teamData.name;
    state.teams[side].sigla = teamData.sigla;
    state.teams[side].logo = teamData.logo;
  }
 
  async function applyTeam(side) {
    const nameInput = side === "home" ? el.homeTeamName : el.awayTeamName;
    const siglaInput = side === "home" ? el.homeTeamSigla : el.awayTeamSigla;
    const coachInput = side === "home" ? el.homeCoach : el.awayCoach;
 
    state.teams[side].name = nameInput?.value || "";
    state.teams[side].sigla = siglaInput?.value || "";
    state.teams[side].coach = coachInput?.value || "";
 
    // Update scoreboard display
    updateScoreboardDisplay();
 
    // Sync to OBS
    await syncTeams();
 
    saveState();
    log(`Team ${side} applied`);
  }
 
  function updateScoreboardDisplay() {
    if (el.scoreSiglaHome) el.scoreSiglaHome.textContent = state.teams.home.sigla || "CAS";
    if (el.scoreSiglaAway) el.scoreSiglaAway.textContent = state.teams.away.sigla || "VIS";
    if (el.scoreNameHome) el.scoreNameHome.textContent = state.teams.home.name || "Casa";
    if (el.scoreNameAway) el.scoreNameAway.textContent = state.teams.away.name || "Visitante";
 
    // Update penalty tags
    if (el.penTagHome) el.penTagHome.textContent = state.teams.home.sigla || "CAS";
    if (el.penTagAway) el.penTagAway.textContent = state.teams.away.sigla || "VIS";
  }
 
  // ===========================================
  // SCORE
  // ===========================================
  function updateScoreUI() {
    if (el.scoreHome) el.scoreHome.textContent = String(state.score.home);
    if (el.scoreAway) el.scoreAway.textContent = String(state.score.away);
  }
 
  async function changeScore(side, delta) {
    const current = state.score[side];
    state.score[side] = clamp(current + delta, 0, 99);
 
    updateScoreUI();
    updateAggregateUI();
 
    await syncScore();
    if (state.aggregate.enabled) {
      await syncAggregate();
    }
 
    saveState();
  }
 
  async function resetScore() {
    state.score.home = 0;
    state.score.away = 0;
 
    updateScoreUI();
    updateAggregateUI();
 
    await syncScore();
    if (state.aggregate.enabled) {
      await syncAggregate();
    }
 
    saveState();
    log("Score reset");
  }
 
  // ===========================================
  // AGGREGATE
  // ===========================================
  function toggleAggregate() {
    state.aggregate.enabled = !state.aggregate.enabled;
 
    if (el.btnToggleAgg) {
      el.btnToggleAgg.classList.toggle("active", state.aggregate.enabled);
      el.btnToggleAgg.innerHTML = `
        <span class="material-symbols-outlined">calculate</span>
        Agregado: ${state.aggregate.enabled ? "ON" : "OFF"}
      `;
    }
 
    if (el.aggControls) {
      el.aggControls.classList.toggle("isHidden", !state.aggregate.enabled);
    }
 
    updateAggregateUI();
    saveState();
  }
 
  async function changeAggregate(side, delta) {
    const current = state.aggregate[side];
    state.aggregate[side] = clamp(current + delta, 0, 99);
 
    updateAggregateUI();
    await syncAggregate();
    saveState();
  }
 
  function updateAggregateUI() {
    if (el.aggHome) el.aggHome.textContent = String(state.aggregate.home);
    if (el.aggAway) el.aggAway.textContent = String(state.aggregate.away);
 
    const totalHome = state.score.home + state.aggregate.home;
    const totalAway = state.score.away + state.aggregate.away;
 
    if (el.aggTotalDisplay) {
      el.aggTotalDisplay.textContent = `(${totalHome}) - (${totalAway})`;
    }
  }
 
  // ===========================================
  // TIMER
  // ===========================================
  function updateTimerUI() {
    const display = formatTime(state.timer.elapsedMs);
    if (el.timerDisplay) {
      el.timerDisplay.textContent = display;
      el.timerDisplay.classList.toggle("running", state.timer.running);
    }
  }
 
  function startTimer() {
    if (state.timer.running) return;
 
    state.timer.running = true;
    state.timer.startedAt = Date.now() - state.timer.elapsedMs;
 
    state.timer.handle = setInterval(() => {
      state.timer.elapsedMs = Date.now() - state.timer.startedAt;
      updateTimerUI();
      syncTimer();
    }, 1000);
 
    updateTimerUI();
    log("Timer started");
  }
 
  function pauseTimer() {
    if (!state.timer.running) return;
 
    state.timer.running = false;
    clearInterval(state.timer.handle);
    state.timer.handle = null;
    state.timer.elapsedMs = Date.now() - state.timer.startedAt;
 
    updateTimerUI();
    syncTimer();
    saveState();
    log(`Timer paused at ${formatTime(state.timer.elapsedMs)}`);
  }
 
  function resetTimer() {
    pauseTimer();
    state.timer.elapsedMs = 0;
    state.timer.startedAt = null;
 
    updateTimerUI();
    syncTimer();
    saveState();
    log("Timer reset");
  }
 
  function setTimerFromInput() {
    const input = el.timerSetInput?.value || "";
    const ms = parseTime(input);
    state.timer.elapsedMs = ms;
 
    if (state.timer.running) {
      state.timer.startedAt = Date.now() - ms;
    }
 
    updateTimerUI();
    syncTimer();
    saveState();
    log(`Timer set to ${formatTime(ms)}`);
  }
 
  async function setPeriod(period) {
    state.timer.period = period;
 
    // Update UI
    [el.btnPeriod1T, el.btnPeriod2T, el.btnPeriodInt, el.btnPeriodPro, el.btnPeriodPen].forEach((btn) => {
      if (btn) {
        btn.classList.toggle("active", btn.dataset.period === period);
      }
    });
 
    // Show/hide penalties panel
    const isPenalties = period === "PEN";
    state.penalties.active = isPenalties;
 
    if (el.penaltiesCard) {
      el.penaltiesCard.classList.toggle("isHidden", !isPenalties);
    }
 
    if (isPenalties) {
      renderPenalties();
    }
 
    await syncTimer();
    if (isPenalties) {
      await syncPenalties();
    }
 
    saveState();
    log(`Period set to ${period}`);
  }
 
  // ===========================================
  // PENALTIES
  // ===========================================
  function renderPenalties() {
    renderPenaltyList(el.penListHome, state.penalties.home, "home");
    renderPenaltyList(el.penListAway, state.penalties.away, "away");
    updatePenaltyScores();
  }
 
  function renderPenaltyList(container, shots, side) {
    if (!container) return;
 
    container.innerHTML = "";
 
    shots.forEach((status, index) => {
      const btn = document.createElement("button");
      btn.className = "penBtn";
      btn.dataset.side = side;
      btn.dataset.index = index;
 
      if (status === "goal") {
        btn.classList.add("is-goal");
        btn.innerHTML = '<span class="material-symbols-outlined">check</span>';
      } else if (status === "miss") {
        btn.classList.add("is-miss");
        btn.innerHTML = '<span class="material-symbols-outlined">close</span>';
      } else {
        btn.textContent = String(index + 1);
      }
 
      btn.onclick = () => cyclePenalty(side, index);
      container.appendChild(btn);
    });
  }
 
  async function cyclePenalty(side, index) {
    const shots = state.penalties[side];
    const current = shots[index];
 
    // Cycle: empty -> goal -> miss -> empty
    const next = current === "empty" ? "goal" : current === "goal" ? "miss" : "empty";
    shots[index] = next;
 
    renderPenalties();
    await syncPenalties();
    saveState();
  }
 
  function updatePenaltyScores() {
    const homeScore = state.penalties.home.filter((s) => s === "goal").length;
    const awayScore = state.penalties.away.filter((s) => s === "goal").length;
 
    if (el.penScoreHome) el.penScoreHome.textContent = String(homeScore);
    if (el.penScoreAway) el.penScoreAway.textContent = String(awayScore);
  }
 
  async function resetPenalties() {
    state.penalties.home = createPenalties();
    state.penalties.away = createPenalties();
 
    renderPenalties();
    await syncPenalties();
    saveState();
    log("Penalties reset");
  }
 
  // ===========================================
  // ROSTER
  // ===========================================
  function renderRosterInputs() {
    renderRosterInputsForSide("home", el.rosterInputsHome);
    renderRosterInputsForSide("away", el.rosterInputsAway);
  }
 
  function renderRosterInputsForSide(side, container) {
    if (!container) return;
 
    container.innerHTML = "";
    const team = state.teams[side];
 
    for (let i = 0; i < 11; i++) {
      const player = team.players[i] || createPlayer(i + 1);
 
      const row = document.createElement("div");
      row.className = "rosterInput";
 
      const numInput = document.createElement("input");
      numInput.type = "text";
      numInput.className = "numInput";
      numInput.placeholder = pad2(i + 1);
      numInput.maxLength = 2;
      numInput.value = player.number ? pad2(player.number) : "";
      numInput.dataset.side = side;
      numInput.dataset.slot = i;
      numInput.dataset.field = "number";
 
      const nameInput = document.createElement("input");
      nameInput.type = "text";
      nameInput.className = "nameInput";
      nameInput.placeholder = `Jogador ${i + 1}`;
      nameInput.value = player.name || "";
      nameInput.dataset.side = side;
      nameInput.dataset.slot = i;
      nameInput.dataset.field = "name";
 
      row.appendChild(numInput);
      row.appendChild(nameInput);
      container.appendChild(row);
    }
 
    // Set coach value
    const coachInput = side === "home" ? el.rosterCoachHome : el.rosterCoachAway;
    if (coachInput) {
      coachInput.value = team.coach || "";
    }
  }
 
  async function applyRoster() {
    // Read values from inputs
    for (const side of ["home", "away"]) {
      const container = side === "home" ? el.rosterInputsHome : el.rosterInputsAway;
      const coachInput = side === "home" ? el.rosterCoachHome : el.rosterCoachAway;
 
      if (container) {
        const inputs = container.querySelectorAll("input");
        inputs.forEach((input) => {
          const slot = parseInt(input.dataset.slot, 10);
          const field = input.dataset.field;
          const player = state.teams[side].players[slot];
 
          if (player && field === "number") {
            player.number = parseInt(input.value, 10) || slot + 1;
          } else if (player && field === "name") {
            player.name = input.value || "";
          }
        });
      }
 
      if (coachInput) {
        state.teams[side].coach = coachInput.value || "";
      }
    }
 
    // Refresh player lists
    renderPlayersLists();
 
    // Sync to OBS
    await syncTeams();
    await syncPlayers();
 
    saveState();
    log("Roster applied");
  }
 
  function clearRoster() {
    for (const side of ["home", "away"]) {
      state.teams[side].coach = "";
      state.teams[side].players = Array.from({ length: 11 }, (_, i) => createPlayer(i + 1));
    }
 
    renderRosterInputs();
    renderPlayersLists();
    saveState();
    log("Roster cleared");
  }
 
  // ===========================================
  // PLAYERS IN FIELD
  // ===========================================
  function renderPlayersLists() {
    renderPlayersListForSide("home", el.playersListHome);
    renderPlayersListForSide("away", el.playersListAway);
  }
 
  function renderPlayersListForSide(side, container) {
    if (!container) return;
 
    container.innerHTML = "";
    const team = state.teams[side];
 
    team.players.forEach((player, index) => {
      const item = document.createElement("div");
      item.className = "rosterItem";
      item.dataset.side = side;
      item.dataset.index = index;
 
      if (player.substitutedOut) {
        item.classList.add("substituted");
      }
      if (player.redCard || player.yellowCards >= 2) {
        item.classList.add("expelled");
      }
 
      // Number
      const numSpan = document.createElement("span");
      numSpan.className = "rosterNumber";
      numSpan.textContent = pad2(player.number);
 
      // Name
      const nameSpan = document.createElement("span");
      nameSpan.className = "rosterName";
      nameSpan.textContent = player.name || `Jogador ${index + 1}`;
 
      // Badges
      const badges = document.createElement("div");
      badges.className = "rosterBadges";
 
      if (player.goals > 0) {
        const badge = document.createElement("span");
        badge.className = "badge badge--goal";
        badge.textContent = String(player.goals);
        badges.appendChild(badge);
      }
 
      if (player.yellowCards === 1) {
        const badge = document.createElement("span");
        badge.className = "badge badge--yellow";
        badge.textContent = "1";
        badges.appendChild(badge);
      }
 
      if (player.yellowCards >= 2) {
        const badge = document.createElement("span");
        badge.className = "badge badge--yellow";
        badge.textContent = "2";
        badges.appendChild(badge);
      }
 
      if (player.redCard) {
        const badge = document.createElement("span");
        badge.className = "badge badge--red";
        badge.textContent = "V";
        badges.appendChild(badge);
      }
 
      if (player.substitutedOut) {
        const badge = document.createElement("span");
        badge.className = "badge badge--sub";
        badge.innerHTML = '<span class="material-symbols-outlined" style="font-size:12px">arrow_downward</span>';
        badges.appendChild(badge);
      }
 
      if (player.isEntered) {
        const badge = document.createElement("span");
        badge.className = "badge badge--sub";
        badge.innerHTML = '<span class="material-symbols-outlined" style="font-size:12px">arrow_upward</span>';
        badges.appendChild(badge);
      }
 
      item.appendChild(numSpan);
      item.appendChild(nameSpan);
      item.appendChild(badges);
 
      // Click handler
      if (!player.redCard && player.yellowCards < 2 && !player.substitutedOut) {
        item.onclick = () => openPlayerModal(side, index);
      }
 
      container.appendChild(item);
    });
  }
 
  // ===========================================
  // PLAYER MODAL
  // ===========================================
  function openPlayerModal(side, index) {
    const team = state.teams[side];
    const player = team.players[index];
 
    if (!player) return;
 
    // Block if expelled
    if (player.redCard || player.yellowCards >= 2) {
      log("Cannot perform actions on expelled player");
      return;
    }
 
    state.selectedTeam = side;
    state.selectedPlayer = index;
 
    // Update modal content
    if (el.playerModalNumber) el.playerModalNumber.textContent = pad2(player.number);
    if (el.playerModalName) el.playerModalName.textContent = player.name || "Sem nome";
    if (el.playerModalTeam) el.playerModalTeam.textContent = side === "home" ? "Casa" : "Visitante";
 
    // Stats
    if (el.playerModalStats) {
      el.playerModalStats.innerHTML = "";
 
      if (player.goals > 0) {
        el.playerModalStats.innerHTML += `<span class="badge badge--goal">${player.goals} gol${player.goals > 1 ? "s" : ""}</span>`;
      }
      if (player.yellowCards > 0) {
        el.playerModalStats.innerHTML += `<span class="badge badge--yellow">${player.yellowCards} amarelo${player.yellowCards > 1 ? "s" : ""}</span>`;
      }
    }
 
    // Disable sub button if already substituted
    if (el.btnPlayerSub) {
      el.btnPlayerSub.disabled = player.substitutedOut;
    }
 
    showModal(el.playerModal);
  }
 
  function closePlayerModal() {
    hideModal(el.playerModal);
    state.selectedTeam = null;
    state.selectedPlayer = null;
  }
 
  async function playerGoal() {
    if (state.selectedTeam === null || state.selectedPlayer === null) return;
 
    const team = state.teams[state.selectedTeam];
    const player = team.players[state.selectedPlayer];
 
    if (!player || player.redCard || player.yellowCards >= 2) return;
 
    // Increment player goals
    player.goals++;
 
    // Increment team score
    state.score[state.selectedTeam]++;
 
    // Toggle icon side if needed (when multiple badges)
    if (player.yellowCards > 0 || player.substitutedOut) {
      player.cardIconSide = player.cardIconSide === "left" ? "right" : "left";
    }
 
    // Add history event
    addHistoryEvent("goal", {
      team: state.selectedTeam,
      playerNumber: player.number,
      playerName: player.name,
      minute: formatTime(state.timer.elapsedMs),
      totalGoals: player.goals
    });
 
    // Update UI
    updateScoreUI();
    updateAggregateUI();
    renderPlayersLists();
 
    // Sync
    await syncScore();
    await syncPlayer(state.selectedTeam, state.selectedPlayer);
 
    saveState();
    closePlayerModal();
    log(`Goal: ${player.name} (${player.goals} total)`);
  }
 
  async function playerYellowCard() {
    if (state.selectedTeam === null || state.selectedPlayer === null) return;
 
    const team = state.teams[state.selectedTeam];
    const player = team.players[state.selectedPlayer];
 
    if (!player || player.redCard) return;
 
    player.yellowCards++;
 
    // Add history event
    addHistoryEvent("yellow", {
      team: state.selectedTeam,
      playerNumber: player.number,
      playerName: player.name,
      minute: formatTime(state.timer.elapsedMs),
      totalYellows: player.yellowCards
    });
 
    // Check for second yellow
    if (player.yellowCards >= 2) {
      player.redCard = true;
 
      addHistoryEvent("second_yellow", {
        team: state.selectedTeam,
        playerNumber: player.number,
        playerName: player.name,
        minute: formatTime(state.timer.elapsedMs)
      });
 
      log(`Second yellow -> Red card: ${player.name}`);
    }
 
    renderPlayersLists();
    await syncPlayer(state.selectedTeam, state.selectedPlayer);
 
    saveState();
    closePlayerModal();
    log(`Yellow card: ${player.name} (${player.yellowCards} total)`);
  }
 
  async function playerRedCard() {
    if (state.selectedTeam === null || state.selectedPlayer === null) return;
 
    const team = state.teams[state.selectedTeam];
    const player = team.players[state.selectedPlayer];
 
    if (!player || player.redCard) return;
 
    player.redCard = true;
 
    addHistoryEvent("red", {
      team: state.selectedTeam,
      playerNumber: player.number,
      playerName: player.name,
      minute: formatTime(state.timer.elapsedMs)
    });
 
    renderPlayersLists();
    await syncPlayer(state.selectedTeam, state.selectedPlayer);
 
    saveState();
    closePlayerModal();
    log(`Red card: ${player.name}`);
  }
 
  function openSubModal() {
    if (state.selectedTeam === null || state.selectedPlayer === null) return;
 
    const team = state.teams[state.selectedTeam];
    const player = team.players[state.selectedPlayer];
 
    if (!player || player.redCard || player.yellowCards >= 2 || player.substitutedOut) {
      log("Cannot substitute this player");
      return;
    }
 
    closePlayerModal();
 
    // Update sub modal
    if (el.subModalOutName) {
      el.subModalOutName.textContent = `${pad2(player.number)} - ${player.name || "Sem nome"}`;
    }
 
    // Clear inputs
    if (el.subInNumber) el.subInNumber.value = "";
    if (el.subInName) el.subInName.value = "";
    if (el.btnSubConfirm) el.btnSubConfirm.disabled = true;
 
    showModal(el.subModal);
  }
 
  function closeSubModal() {
    hideModal(el.subModal);
  }
 
  function validateSubInputs() {
    const name = el.subInName?.value?.trim() || "";
    if (el.btnSubConfirm) {
      el.btnSubConfirm.disabled = name.length === 0;
    }
  }
 
  async function confirmSubstitution() {
    if (state.selectedTeam === null || state.selectedPlayer === null) return;
 
    const team = state.teams[state.selectedTeam];
    const playerOut = team.players[state.selectedPlayer];
 
    if (!playerOut) return;
 
    const inNumber = parseInt(el.subInNumber?.value, 10) || team.players.length + 1;
    const inName = el.subInName?.value?.trim() || "";
 
    if (!inName) {
      log("Substitution requires player name");
      return;
    }
 
    // Mark player as substituted out
    playerOut.substitutedOut = true;
 
    // Create new player and add to team
    const newPlayer = createPlayer(team.players.length + 1, inNumber, inName);
    newPlayer.isEntered = true;
    team.players.push(newPlayer);
 
    // Add history event
    addHistoryEvent("substitution", {
      team: state.selectedTeam,
      minute: formatTime(state.timer.elapsedMs),
      outNumber: playerOut.number,
      outName: playerOut.name,
      inNumber: newPlayer.number,
      inName: newPlayer.name
    });
 
    renderPlayersLists();
    await syncPlayers();
 
    saveState();
    closeSubModal();
    log(`Substitution: ${playerOut.name} -> ${newPlayer.name}`);
  }
 
  // ===========================================
  // HISTORY
  // ===========================================
  function addHistoryEvent(type, data) {
    const event = {
      id: uuid(),
      type,
      data,
      timestamp: Date.now()
    };
 
    state.history.unshift(event);
 
    // Limit history size
    const maxEvents = CFG.history?.maxEvents || 50;
    if (state.history.length > maxEvents) {
      state.history = state.history.slice(0, maxEvents);
    }
 
    renderHistory();
    return event;
  }
 
  function renderHistory() {
    if (!el.historyList) return;
 
    if (state.history.length === 0) {
      el.historyList.innerHTML = '<div class="text-center text-muted text-sm">Nenhum evento registrado</div>';
      return;
    }
 
    el.historyList.innerHTML = "";
 
    state.history.forEach((event) => {
      const item = document.createElement("div");
      item.className = "historyItem";
 
      const time = document.createElement("span");
      time.className = "historyTime";
      time.textContent = event.data.minute || "--:--";
 
      const icon = document.createElement("span");
      icon.className = "historyIcon";
 
      const text = document.createElement("span");
      text.className = "historyText";
 
      const teamBadge = document.createElement("span");
      teamBadge.className = "historyTeam";
      teamBadge.textContent = event.data.team === "home" ?
        (state.teams.home.sigla || "CAS") :
        (state.teams.away.sigla || "VIS");
 
      switch (event.type) {
        case "goal":
          icon.classList.add("goal");
          icon.innerHTML = '<span class="material-symbols-outlined">sports_soccer</span>';
          text.textContent = `Gol de ${event.data.playerName} (${event.data.totalGoals})`;
          break;
        case "yellow":
          icon.classList.add("yellow");
          icon.innerHTML = '<span class="material-symbols-outlined">rectangle</span>';
          text.textContent = `Amarelo para ${event.data.playerName}`;
          break;
        case "second_yellow":
          icon.classList.add("red");
          icon.innerHTML = '<span class="material-symbols-outlined">rectangle</span>';
          text.textContent = `2o amarelo = Vermelho: ${event.data.playerName}`;
          break;
        case "red":
          icon.classList.add("red");
          icon.innerHTML = '<span class="material-symbols-outlined">rectangle</span>';
          text.textContent = `Vermelho direto: ${event.data.playerName}`;
          break;
        case "substitution":
          icon.classList.add("sub");
          icon.innerHTML = '<span class="material-symbols-outlined">swap_horiz</span>';
          text.textContent = `${event.data.outName} -> ${event.data.inName}`;
          break;
        default:
          text.textContent = event.type;
      }
 
      item.appendChild(time);
      item.appendChild(icon);
      item.appendChild(text);
      item.appendChild(teamBadge);
 
      el.historyList.appendChild(item);
    });
  }
 
  function clearHistory() {
    state.history = [];
    renderHistory();
    saveState();
    log("History cleared");
  }
 
  // ===========================================
  // RESETS
  // ===========================================
  async function resetPartial() {
    if (!confirm("Zerar placar, cronometro e penaltis?")) return;
 
    // Reset score
    state.score.home = 0;
    state.score.away = 0;
 
    // Reset timer
    pauseTimer();
    state.timer.elapsedMs = 0;
    state.timer.period = "1T";
 
    // Reset penalties
    state.penalties.active = false;
    state.penalties.home = createPenalties();
    state.penalties.away = createPenalties();
 
    // Reset player goals (but keep other stats)
    for (const side of ["home", "away"]) {
      state.teams[side].players.forEach((player) => {
        player.goals = 0;
      });
    }
 
    // Update UI
    updateScoreUI();
    updateTimerUI();
    updateAggregateUI();
    setPeriod("1T");
    renderPenalties();
    renderPlayersLists();
 
    // Sync
    await syncAll();
 
    saveState();
    log("Partial reset complete");
  }
 
  async function resetTotal() {
    if (!confirm("Resetar TUDO (times, placar, escalacao)?")) return;
 
    // Keep current skin
    const currentSkin = state.currentSkin;
 
    // Reset teams
    state.teams.home = createTeam();
    state.teams.away = createTeam();
 
    // Reset score
    state.score.home = 0;
    state.score.away = 0;
 
    // Reset aggregate
    state.aggregate.enabled = false;
    state.aggregate.home = 0;
    state.aggregate.away = 0;
 
    // Reset timer
    pauseTimer();
    state.timer.elapsedMs = 0;
    state.timer.period = "1T";
 
    // Reset penalties
    state.penalties.active = false;
    state.penalties.home = createPenalties();
    state.penalties.away = createPenalties();
 
    // Clear history
    state.history = [];
 
    // Restore skin
    state.currentSkin = currentSkin;
 
    // Update all UI
    updateScoreUI();
    updateTimerUI();
    updateAggregateUI();
    updateScoreboardDisplay();
    setPeriod("1T");
    toggleAggregate(); // Turn off if on
    if (state.aggregate.enabled) toggleAggregate();
    renderRosterInputs();
    renderPlayersLists();
    renderPenalties();
    renderHistory();
 
    // Clear form inputs
    if (el.homeTeamName) el.homeTeamName.value = "";
    if (el.awayTeamName) el.awayTeamName.value = "";
    if (el.homeTeamSigla) el.homeTeamSigla.value = "";
    if (el.awayTeamSigla) el.awayTeamSigla.value = "";
    if (el.homeCoach) el.homeCoach.value = "";
    if (el.awayCoach) el.awayCoach.value = "";
    if (el.homeTeamSelect) el.homeTeamSelect.selectedIndex = 0;
    if (el.awayTeamSelect) el.awayTeamSelect.selectedIndex = 0;
 
    // Sync
    await syncAll();
 
    saveState();
    log("Total reset complete");
  }
 
  // ===========================================
  // STORAGE
  // ===========================================
  let saveTimeout = null;
 
  function saveState() {
    clearTimeout(saveTimeout);
 
    saveTimeout = setTimeout(() => {
      try {
        const data = {
          version: state.version,
          timestamp: Date.now(),
          currentSkin: state.currentSkin,
          teams: state.teams,
          score: state.score,
          aggregate: state.aggregate,
          timer: {
            elapsedMs: state.timer.elapsedMs,
            period: state.timer.period,
            running: state.timer.running,
            startedAt: state.timer.startedAt
          },
          penalties: state.penalties,
          history: state.history
        };
 
        const json = JSON.stringify(data);
        const key = CFG.storage?.key || "spiderkong_state";
 
        localStorage.setItem(key, json);
      } catch (err) {
        log("Error saving state", err.message);
      }
    }, CFG.storage?.autoSaveDebounceMs || 500);
  }
 
  function loadState() {
    try {
      const key = CFG.storage?.key || "spiderkong_state";
      const json = localStorage.getItem(key);
 
      if (!json) {
        log("No saved state found");
        return false;
      }
 
      const data = JSON.parse(json);
 
      // Version check
      if (data.version !== state.version) {
        log(`State version mismatch: ${data.version} vs ${state.version}`);
        return false;
      }
 
      // Restore state
      if (data.currentSkin) state.currentSkin = data.currentSkin;
      if (data.teams) {
        state.teams = data.teams;
      }
      if (data.score) state.score = data.score;
      if (data.aggregate) state.aggregate = data.aggregate;
      if (data.timer) {
        state.timer.elapsedMs = data.timer.elapsedMs || 0;
        state.timer.period = data.timer.period || "1T";
 
        // Resume timer if it was running
        if (data.timer.running && data.timer.startedAt) {
          state.timer.elapsedMs = Date.now() - data.timer.startedAt;
          startTimer();
        }
      }
      if (data.penalties) state.penalties = data.penalties;
      if (data.history) state.history = data.history;
 
      log("State loaded from storage");
      return true;
    } catch (err) {
      log("Error loading state", err.message);
      return false;
    }
  }
 
  // ===========================================
  // UI HELPERS
  // ===========================================
  function showModal(modal) {
    if (modal) modal.setAttribute("aria-hidden", "false");
  }
 
  function hideModal(modal) {
    if (modal) modal.setAttribute("aria-hidden", "true");
  }
 
  function toggleSection(body, button) {
    if (!body) return;
 
    const isHidden = body.classList.toggle("isHidden");
    const icon = button?.querySelector(".material-symbols-outlined");
 
    if (icon) {
      icon.textContent = isHidden ? "expand_more" : "expand_less";
    }
  }
 
  // ===========================================
  // EVENT BINDINGS
  // ===========================================
  function bindEvents() {
    // Scene/Skin selects
    el.sceneSelect?.addEventListener("change", (e) => setScene(e.target.value));
    el.skinSelect?.addEventListener("change", (e) => changeSkin(e.target.value));
 
    // Team selects
    el.homeTeamSelect?.addEventListener("change", () => onTeamSelect("home"));
    el.awayTeamSelect?.addEventListener("change", () => onTeamSelect("away"));
 
    // Team apply buttons
    el.btnApplyHome?.addEventListener("click", () => applyTeam("home"));
    el.btnApplyAway?.addEventListener("click", () => applyTeam("away"));
 
    // Score buttons
    el.btnScoreHomeMinus?.addEventListener("click", () => changeScore("home", -1));
    el.btnScoreHomePlus?.addEventListener("click", () => changeScore("home", 1));
    el.btnScoreAwayMinus?.addEventListener("click", () => changeScore("away", -1));
    el.btnScoreAwayPlus?.addEventListener("click", () => changeScore("away", 1));
    el.btnScoreReset?.addEventListener("click", resetScore);
 
    // Aggregate
    el.btnToggleAgg?.addEventListener("click", toggleAggregate);
    el.btnAggHomeMinus?.addEventListener("click", () => changeAggregate("home", -1));
    el.btnAggHomePlus?.addEventListener("click", () => changeAggregate("home", 1));
    el.btnAggAwayMinus?.addEventListener("click", () => changeAggregate("away", -1));
    el.btnAggAwayPlus?.addEventListener("click", () => changeAggregate("away", 1));
 
    // Timer
    el.btnTimerStart?.addEventListener("click", startTimer);
    el.btnTimerPause?.addEventListener("click", pauseTimer);
    el.btnTimerReset?.addEventListener("click", resetTimer);
    el.btnTimerSet?.addEventListener("click", setTimerFromInput);
 
    // Period buttons
    $$("[data-period]").forEach((btn) => {
      btn.addEventListener("click", () => setPeriod(btn.dataset.period));
    });
 
    // Penalties
    el.btnPenaltyReset?.addEventListener("click", resetPenalties);
 
    // Roster
    el.btnToggleRoster?.addEventListener("click", () => toggleSection(el.rosterBody, el.btnToggleRoster));
    el.btnApplyRoster?.addEventListener("click", applyRoster);
    el.btnClearRoster?.addEventListener("click", clearRoster);
 
    // Players
    el.btnTogglePlayers?.addEventListener("click", () => toggleSection(el.playersBody, el.btnTogglePlayers));
 
    // History
    el.btnToggleHistory?.addEventListener("click", () => toggleSection(el.historyBody, el.btnToggleHistory));
    el.btnClearHistory?.addEventListener("click", clearHistory);
 
    // Actions
    el.btnSyncObs?.addEventListener("click", syncAll);
    el.btnReconnect?.addEventListener("click", () => wsConnect(true));
    el.btnResetPartial?.addEventListener("click", resetPartial);
    el.btnResetTotal?.addEventListener("click", resetTotal);
 
    // Player modal
    el.btnPlayerModalClose?.addEventListener("click", closePlayerModal);
    el.btnPlayerGoal?.addEventListener("click", playerGoal);
    el.btnPlayerYellow?.addEventListener("click", playerYellowCard);
    el.btnPlayerRed?.addEventListener("click", playerRedCard);
    el.btnPlayerSub?.addEventListener("click", openSubModal);
 
    // Sub modal
    el.btnSubModalClose?.addEventListener("click", closeSubModal);
    el.subInName?.addEventListener("input", validateSubInputs);
    el.btnSubConfirm?.addEventListener("click", confirmSubstitution);
 
    // Close modals on backdrop click
    el.playerModal?.addEventListener("click", (e) => {
      if (e.target === el.playerModal) closePlayerModal();
    });
    el.subModal?.addEventListener("click", (e) => {
      if (e.target === el.subModal) closeSubModal();
    });
 
    // Keyboard shortcuts
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closePlayerModal();
        closeSubModal();
      }
    });
  }
 
  // ===========================================
  // INITIALIZATION
  // ===========================================
  function init() {
    log("Initializing SpiderKong Panel...");
 
    // Load saved state first
    const hasState = loadState();
 
    // Initialize UI based on state
    updateScoreUI();
    updateTimerUI();
    updateAggregateUI();
    updateScoreboardDisplay();
 
    // Restore aggregate UI
    if (state.aggregate.enabled) {
      if (el.btnToggleAgg) {
        el.btnToggleAgg.classList.add("active");
        el.btnToggleAgg.innerHTML = `
          <span class="material-symbols-outlined">calculate</span>
          Agregado: ON
        `;
      }
      if (el.aggControls) {
        el.aggControls.classList.remove("isHidden");
      }
    }
 
    // Restore period
    setPeriod(state.timer.period);
 
    // Render roster inputs
    renderRosterInputs();
 
    // Render players lists
    renderPlayersLists();
 
    // Render penalties
    renderPenalties();
 
    // Render history
    renderHistory();
 
    // Bind all events
    bindEvents();
 
    // Connect to OBS
    wsConnect();
 
    log("SpiderKong Panel initialized");
  }
 
  // Start when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
