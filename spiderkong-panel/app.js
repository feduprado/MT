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
  // SKIN MANAGEMENT - Sistema Robusto de Troca de Skin
  // ===========================================

  // Constantes de configuração para troca de skin
  const SKIN_SWAP_DEBOUNCE_MS = 300;
  const SKIN_SWAP_ITEM_DELAY_MS = 50; // Delay entre itens para transição suave

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
    if (!state.currentScene) {
      log("[SkinSwap] ABORTADO: Cena atual não está definida");
      return false;
    }
    const targetScene = CFG.defaultScene || "Match Center";
    if (state.currentScene !== targetScene) {
      log(`[SkinSwap] AVISO: Cena atual "${state.currentScene}" não é "${targetScene}" - continuando mesmo assim`);
    }
    return true;
  }

  /**
   * Obtém a lista de itens visuais para uma skin específica
   * @param {string} skinKey - chave da skin (generico, champions, etc.)
   * @returns {Array<{groupName: string, itemName: string, fullPath: string}>} lista de itens
   */
  function getSkinVisualItems(skinKey) {
    const visualItems = CFG.skinVisualItems || {};
    const commonItems = visualItems.commonItems || [];
    const skinGroups = visualItems.skinGroups || {};
    const groupName = skinGroups[skinKey] || skinKey;

    return commonItems.map(item => ({
      groupName: groupName,
      itemName: item,
      fullPath: `${groupName}/${item}`
    }));
  }

  /**
   * Tenta obter sceneItemId de um item usando múltiplas estratégias
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
   * Define visibilidade de um item de skin
   * @param {string} sceneName - nome da cena
   * @param {string} groupName - nome do grupo de skin
   * @param {string} itemName - nome do item
   * @param {boolean} enabled - visibilidade desejada
   * @returns {Promise<boolean>} true se sucesso
   */
  async function setSkinItemEnabled(sceneName, groupName, itemName, enabled) {
    const namesToTry = [
      itemName,
      itemName.replace('.png', ''),
      `${groupName.toLowerCase()}_${itemName.replace('.png', '')}`,
      `skin_${itemName.replace('.png', '')}`
    ];

    // Tenta encontrar o item DENTRO do grupo (grupo como cena)
    try {
      for (const name of namesToTry) {
        const sceneItemId = await tryGetSceneItemId(groupName, name);
        if (sceneItemId) {
          await call("SetSceneItemEnabled", {
            sceneName: groupName,
            sceneItemId: sceneItemId,
            sceneItemEnabled: enabled
          });
          return true;
        }
      }
    } catch (e) {
      // Grupo pode não ser uma cena válida
    }

    // Tenta encontrar na cena principal
    try {
      for (const name of namesToTry) {
        const sceneItemId = await tryGetSceneItemId(sceneName, name);
        if (sceneItemId) {
          await call("SetSceneItemEnabled", {
            sceneName: sceneName,
            sceneItemId: sceneItemId,
            sceneItemEnabled: enabled
          });
          return true;
        }
      }
    } catch (e) {
      // Não encontrado
    }

    // Tenta com nome composto grupo/item
    try {
      const compositeName = `${groupName}/${itemName}`;
      const sceneItemId = await tryGetSceneItemId(sceneName, compositeName);
      if (sceneItemId) {
        await call("SetSceneItemEnabled", {
          sceneName: sceneName,
          sceneItemId: sceneItemId,
          sceneItemEnabled: enabled
        });
        return true;
      }
    } catch (e) {
      // Não encontrado
    }

    log(`[SkinSwap] Item não encontrado: ${groupName}/${itemName} (falha parcial)`);
    return false;
  }

  /**
   * Oculta todos os itens visuais de uma skin
   * @param {string} skinKey - chave da skin
   */
  async function hideSkinItems(skinKey) {
    log(`[SkinSwap] FASE 1: Ocultando itens da skin "${skinKey}"...`);
    const items = getSkinVisualItems(skinKey);
    let success = 0;
    let failed = 0;

    for (const item of items) {
      const result = await setSkinItemEnabled(state.currentScene, item.groupName, item.itemName, false);
      if (result) success++;
      else failed++;
      if (SKIN_SWAP_ITEM_DELAY_MS > 0) {
        await new Promise(r => setTimeout(r, SKIN_SWAP_ITEM_DELAY_MS));
      }
    }

    log(`[SkinSwap] FASE 1 completa: ${success} ocultos, ${failed} falharam`);
    return { success, failed };
  }

  /**
   * Mostra todos os itens visuais de uma skin
   * @param {string} skinKey - chave da skin
   */
  async function showSkinItems(skinKey) {
    log(`[SkinSwap] FASE 5: Mostrando itens da skin "${skinKey}"...`);
    const items = getSkinVisualItems(skinKey);
    let success = 0;
    let failed = 0;

    for (const item of items) {
      const result = await setSkinItemEnabled(state.currentScene, item.groupName, item.itemName, true);
      if (result) success++;
      else failed++;
      if (SKIN_SWAP_ITEM_DELAY_MS > 0) {
        await new Promise(r => setTimeout(r, SKIN_SWAP_ITEM_DELAY_MS));
      }
    }

    log(`[SkinSwap] FASE 5 completa: ${success} mostrados, ${failed} falharam`);
    return { success, failed };
  }

  /**
   * Oculta itens do grupo SKIN Assets
   */
  async function hideSkinAssets() {
    log("[SkinSwap] FASE 2: Ocultando SKIN Assets...");
    const assetsItems = CFG.skinAssetsItems || [];
    let done = 0;

    for (const itemName of assetsItems) {
      try {
        await setSceneItemEnabled(state.currentScene, itemName, false);
        done++;
      } catch (e) {
        log(`[SkinSwap] SKIN Asset "${itemName}" não encontrado (ignorando)`);
      }
    }
    log(`[SkinSwap] FASE 2 completa: ${done} assets ocultos`);
  }

  /**
   * Mostra itens do grupo SKIN Assets
   */
  async function showSkinAssets() {
    log("[SkinSwap] FASE 4: Mostrando SKIN Assets...");
    const assetsItems = CFG.skinAssetsItems || [];
    let done = 0;

    for (const itemName of assetsItems) {
      try {
        await setSceneItemEnabled(state.currentScene, itemName, true);
        done++;
      } catch (e) {
        log(`[SkinSwap] SKIN Asset "${itemName}" não encontrado (ignorando)`);
      }
    }
    log(`[SkinSwap] FASE 4 completa: ${done} assets mostrados`);
  }

  /**
   * Atualiza fontes de todos os textos dinâmicos para a nova skin
   * @param {string} skinKey - chave da nova skin
   */
  async function updateSkinFonts(skinKey) {
    log(`[SkinSwap] FASE 3: Atualizando fontes para skin "${skinKey}"...`);

    const targetFace = getSkinFontFace(skinKey);
    log(`[SkinSwap] Fonte alvo: ${targetFace}`);

    refreshManagedTextItems();

    let updated = 0;
    let skipped = 0;
    let failed = 0;

    for (const inputName of state.managedTextItems) {
      try {
        let settings;
        try {
          settings = await getInputSettingsCached(inputName);
        } catch (e) {
          failed++;
          continue;
        }

        const font = settings.font;
        if (!font) {
          skipped++;
          continue;
        }

        if (font.face === targetFace) {
          skipped++;
          continue;
        }

        const resolvedStyle = resolveFontStyle(targetFace, font.style);
        const nextFont = {
          face: targetFace,
          style: resolvedStyle,
          size: font.size,
          flags: font.flags
        };

        await call("SetInputSettings", {
          inputName,
          inputSettings: { font: nextFont }
        });

        state.inputSettingsCache.set(inputName, { ...settings, font: nextFont });
        updated++;
      } catch (err) {
        log(`[SkinSwap] Erro fonte "${inputName}": ${err.message}`);
        failed++;
      }
    }

    log(`[SkinSwap] FASE 3 completa: ${updated} atualizados, ${skipped} pulados, ${failed} falharam`);
  }

  /**
   * Executa a troca de skin de forma atômica e ordenada
   */
  async function executeSkinSwap(oldSkin, newSkin) {
    log(`[SkinSwap] ========================================`);
    log(`[SkinSwap] INICIANDO TROCA: ${oldSkin} -> ${newSkin}`);
    log(`[SkinSwap] ========================================`);

    const startTime = Date.now();

    try {
      // FASE 1: Ocultar itens da skin antiga
      if (oldSkin && oldSkin !== newSkin) {
        await hideSkinItems(oldSkin);
      }

      // FASE 2: Ocultar SKIN Assets
      await hideSkinAssets();

      // FASE 3: Atualizar fontes para nova skin
      await updateSkinFonts(newSkin);

      // FASE 4: Mostrar SKIN Assets
      await showSkinAssets();

      // FASE 5: Mostrar itens da nova skin
      await showSkinItems(newSkin);

      // FASE 6: Re-sincronizar dados
      log("[SkinSwap] FASE 6: Re-sincronizando dados...");
      await syncAllAfterSkinSwap();
      log("[SkinSwap] FASE 6 completa");

      const elapsed = Date.now() - startTime;
      log(`[SkinSwap] ========================================`);
      log(`[SkinSwap] TROCA COMPLETA em ${elapsed}ms`);
      log(`[SkinSwap] ========================================`);

    } catch (err) {
      log(`[SkinSwap] ERRO DURANTE TROCA: ${err.message}`);
      try {
        await showSkinItems(newSkin);
      } catch (e) {
        log(`[SkinSwap] Falha na recuperação: ${e.message}`);
      }
    }
  }

  /**
   * Re-sincroniza todos os dados após troca de skin
   */
  async function syncAllAfterSkinSwap() {
    await Promise.all([
      syncScore(),
      syncTeams(),
      syncTimer(),
      syncAggregate(),
      syncPlayers()
    ]);

    if (state.penalties.active) {
      await syncPenalties();
    }
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
 
    // Sync individual markers would go here
  }
 
  async function syncPlayers() {
    // Usa nomes literais com <skin> conforme dynamicPatterns
    for (const side of ["home", "away"]) {
      const team = state.teams[side];
      const prefix = side === "home" ? "esq" : "dir";

      for (let i = 0; i < team.players.length && i < 11; i++) {
        const player = team.players[i];
        const slot = pad2(i + 1);

        // Nome literal: {side}_jogador_{slot}_<skin>
        const inputName = `${prefix}_jogador_${slot}_<skin>`;
        await setInputText(inputName, player.name);
      }
    }
  }
 
  async function syncPlayer(side, playerIndex) {
    const team = state.teams[side];
    const player = team.players[playerIndex];
    if (!player) return;

    const prefix = side === "home" ? "esq" : "dir";
    const slot = pad2(playerIndex + 1);

    // Nome literal: {side}_jogador_{slot}_<skin>
    const inputName = `${prefix}_jogador_${slot}_<skin>`;
    await setInputText(inputName, player.name);

    // TODO: Sync goal indicator, card indicator, sub indicator
    // Usa CFG.dynamicPatterns para gerar nomes dos icones
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
