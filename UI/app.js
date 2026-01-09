(() => {
  "use strict";
  console.log("[FIX] app.js loaded - Sync Field Repair vFinal");

  try {
    if (window.__TACTICO_APP_LOADED__) return;
    window.__TACTICO_APP_LOADED__ = true;

    

    const PLAYERS_FOLDER_PATH = "Assets/Players";
    const RESERVES_FOLDER_PATH = "Assets/Reservas";
    


    

    const $ = (id) => document.getElementById(id);

    const el = {
      pillWs: $("pillWs"),
      pillScene: $("pillScene"),
      pillSlot: $("pillSlot"),
      actionsHint: $("actionsHint"),
mcScoreboardPanel: $("mcScoreboardPanel"),
      targetSelect: $("targetSelect"),
      sceneSelect: $("sceneSelect"),

      btnReconnect: $("btnReconnect"),
      btnYellow: $("btnYellow"),
      btnRed: $("btnRed"),
      btnRemoveCard: $("btnRemoveCard"),
      btnSwap: $("btnSwap"),

      btnRegisterReserves: $("btnRegisterReserves"),
      btnSubstitute: $("btnSubstitute"),
      btnClearSwaps: $("btnClearSwaps"),

      btnSync: $("btnSync"),
      btnClearAll: $("btnClearAll"),
	  
	  btnPlayerSelect: $("btnPlayerSelect"),
      playerSelectLabel: $("playerSelectLabel"),
      
      slotSelectionModal: $("slotSelectionModal"),
      btnSlotSelectionClose: $("btnSlotSelectionClose"),
      slotSelectionList: $("slotSelectionList"),

      btnAddOpponent: $("btnAddOpponent"),
      opponentSelected: $("opponentSelected"),
      opponentModalMask: $("opponentModalMask"),
      btnOpponentRefreshTimes: $("btnOpponentRefreshTimes"),
      btnOpponentClose: $("btnOpponentClose"),
      teamSearch: $("teamSearch"),
      teamGrid: $("teamGrid"),

      btnManagePlayers: $("btnManagePlayers"),
      btnRefreshRoster: $("btnRefreshRoster"),
      btnScanFolder: $("btnScanFolder"),
      btnGenerateIndex: $("btnGenerateIndex"),

      

      modalMask: $("modalMask"),
      btnModalClose: $("btnModalClose"),
      rosterSearch: $("rosterSearch"),
      rosterList: $("rosterList"),

      

      playersModal: $("playersModal"),
      btnPlayersClose: $("btnPlayersClose"),
      playersList: $("playersList"),
      selectedPlayerInfo: $("selectedPlayerInfo"),
      playerSearch: $("playerSearch"),

      

      goalModal: $("goalModal"),
      goalSearch: $("goalSearch"),
      goalList: $("goalList"),
      btnGoalClose: $("btnGoalClose"),
      btnGoalOwnGoal: $("btnGoalOwnGoal"),
	  
	  

      btnToggleAgg: $("btnToggleAgg"),
      aggControls: $("aggControls"),
      btnAggLeftPlus: $("btnAggLeftPlus"),
      btnAggLeftMinus: $("btnAggLeftMinus"),
      uiAggLeft: $("uiAggLeft"),
      btnAggRightPlus: $("btnAggRightPlus"),
      btnAggRightMinus: $("btnAggRightMinus"),
      uiAggRight: $("uiAggRight"),
      uiAggTotalDisplay: $("uiAggTotalDisplay"),

      

      reservesModal: $("reservesModal"),
      reserveSearch: $("reserveSearch"),
      reserveList: $("reserveList"),
      btnReserveClose: $("btnReserveClose"),
      btnReserveConfirm: $("btnReserveConfirm"),
      reserveCount: $("reserveCount"),

      

      substituteModal: $("substituteModal"),
      substituteSearch: $("substituteSearch"),
      substituteList: $("substituteList"),
      btnSubstituteClose: $("btnSubstituteClose"),
      btnSubstituteConfirm: $("btnSubstituteConfirm"),
	  
	  

      cardModal: $("cardModal"),
      cardModalTitle: $("cardModalTitle"),
      cardPlayerList: $("cardPlayerList"),
      btnCardClose: $("btnCardClose"),

      

      scanStatus: $("scanStatus"),
      scanProgress: $("scanProgress"),

      

      btnRefreshTeams: $("btnRefreshTeams"),
      btnCorMandante: $("btnCorMandante"),
      btnCorVisitante: $("btnCorVisitante"),
      btnGolLeftPlus: $("btnGolLeftPlus"),
      btnGolLeftMinus: $("btnGolLeftMinus"),
      btnGolRightPlus: $("btnGolRightPlus"),
      btnGolRightMinus: $("btnGolRightMinus"),
      btnGolReset: $("btnGolReset"),
      timerPreview: $("timerPreview"),
      timerSetInput: $("timerSetInput"),
      btnTimerStart: $("btnTimerStart"),
      btnTimerPause: $("btnTimerPause"),
      btnTimerResume: $("btnTimerResume"),
      btnTimerReset: $("btnTimerReset"),
      btnTimerStartFrom: $("btnTimerStartFrom"),
      btnStatus1T: $("btnStatus1T"),
      btnStatus2T: $("btnStatus2T"),
      btnStatusIntervalo: $("btnStatusIntervalo"),
      btnStatusProrrogacao: $("btnStatusProrrogacao"),
      btnStatusPenalti: $("btnStatusPenalti"),
	mcPenaltiesPanel: $("mcPenaltiesPanel"), 

      btnPenaltyReset: $("btnPenaltyReset"),
      btnPenaltyAdd: $("btnPenaltyAdd"),       

      pListLeft: $("pListLeft"),               

      pListRight: $("pListRight"),             

      pTagLeft: $("pTagLeft"),
      pTagRight: $("pTagRight"),

      

	  guestNameInput: $("guestNameInput"),
      btnGuestApply: $("btnGuestApply"),
      btnGuestToggle: $("btnGuestToggle"),
      btnGuestClear: $("btnGuestClear"),
      guestStatusText: $("guestStatusText"),
      guestPanel: $("guestPanel"),
    };

const now = () => new Date().toLocaleTimeString("pt-BR", { hour12: false });
const log = (msg, obj) => {
  const line = `[${now()}] ${msg}` + (obj ? ` ${JSON.stringify(obj)}` : "");
  console.log(line);
};

const assertDom = (id) => {
  const ok = !!document.getElementById(id);
  if (!ok) log("DOM MISSING", { id });
  return ok;
};

[
  "btnSwap", "modalMask", "btnModalClose", "rosterSearch", "rosterList",
  "reservesModal", "reserveSearch", "reserveList", "btnReserveClose", "btnReserveConfirm",
  "substituteModal", "substituteSearch", "substituteList", "btnSubstituteClose", "btnSubstituteConfirm",
  "playersModal", "playersList", "selectedPlayerInfo", "playerSearch", "btnPlayersClose",
  "goalModal", "goalSearch", "goalList", "btnGoalClose", "btnGoalOwnGoal",
  "opponentModalMask", "teamSearch", "teamGrid", "btnOpponentClose", "btnOpponentRefreshTimes",
  "guestPanel" 
].forEach(assertDom);

    const assertUniqueId = (id) => {
      const count = document.querySelectorAll(`#${CSS.escape(id)}`).length;
      if (count > 1) log("DOM DUPLICATE ID", { id, count });
    };
    assertUniqueId("guestPanel");

    const setChip = (chipEl, text, cls) => {
      if (!chipEl) return;
      chipEl.textContent = text;
      chipEl.classList.remove("ok", "bad", "warn");
      if (cls) chipEl.classList.add(cls);
    };

    window.addEventListener("error", (ev) => {
      

      log("JS ERROR (window)", { message: String(ev?.message || "script error"), file: ev?.filename || "", line: ev?.lineno || 0 });
    });

    const normalizeSlash = (p) => String(p || "").replace(/\\/g, "/");

    const normalizePathSegments = (p) => {
      const raw = normalizeSlash(p);
      if (!raw) return "";
      const hasDrive = /^[A-Za-z]:\//.test(raw);
      const isAbsolute = hasDrive || raw.startsWith("/");
      const prefix = hasDrive ? raw.slice(0, 2) : "";
      const rest = hasDrive ? raw.slice(2) : raw;
      const parts = rest.split("/").filter((seg) => seg.length);
      const stack = [];
      for (const part of parts) {
        if (part === ".") continue;
        if (part === "..") {
          if (stack.length) stack.pop();
          continue;
        }
        stack.push(part);
      }
      const joined = stack.join("/");
      if (hasDrive) return `${prefix}/${joined}`;
      if (isAbsolute) return `/${joined}`;
      return joined;
    };

    

    const projectRootAbs = (() => {
      try {
        if (location.protocol === "file:") {
          const p = decodeURIComponent(location.pathname || "");
          const win = p.startsWith("/") ? p.slice(1) : p;
          const normalized = normalizeSlash(win);
          const suffix = "/UI/dock.html";
          if (normalized.toLowerCase().endsWith(suffix.toLowerCase())) {
            return normalized.slice(0, -suffix.length);
          }
          if (normalized.toLowerCase().endsWith("/ui")) {
            return normalized.slice(0, -3);
          }
          return normalized.replace(/\/[^/]*$/, "");
        }
        const cfgRoot = window.CONFIG && window.CONFIG.baseFsRoot;
        return cfgRoot ? normalizePathSegments(cfgRoot) : "";
      } catch {
        return "";
      }
    })();

const resolveProjectPath = (inputPath) => {
  if (!inputPath) return "";
  const raw = normalizeSlash(inputPath);

  if (/^[A-Za-z]:[\\/]/.test(raw)) {
    return normalizePathSegments(raw);
  }

  if (raw.startsWith("file://")) {
    return raw;
  }

  if (raw.startsWith("/") || raw.startsWith("//")) {
    return normalizePathSegments(raw);
  }

  if (projectRootAbs) {
    const joined = normalizeSlash(`${projectRootAbs}/${raw.replace(/^\.\//, "")}`);
    return normalizePathSegments(joined);
  }

  return raw;
};

const toRelativeProjectPath = (inputPath) => {
  if (!inputPath) return "";
  let raw = normalizeSlash(inputPath);
  if (!raw) return "";

  if (/^file:\/\//i.test(raw)) {
    try {
      const u = new URL(raw);
      raw = decodeURIComponent(u.pathname || "");
      if (raw.startsWith("/") && /^[A-Za-z]:\//.test(raw.slice(1))) {
        raw = raw.slice(1);
      }
    } catch {
      return inputPath;
    }
  }

  if (!projectRootAbs) return raw;
  const root = normalizeSlash(projectRootAbs).replace(/\/+$/, "");
  const normalized = normalizePathSegments(raw);

  if (normalized.toLowerCase().startsWith(`${root.toLowerCase()}/`)) {
    return normalized.slice(root.length + 1);
  }

  return normalized;
};



const guestHasValidFsRoot = () => location.protocol === "file:" || !!projectRootAbs;

    

    

    const sha256ToUint8 = async (text) => {
      const enc = new TextEncoder();
      const data = enc.encode(String(text));
      if (window.crypto && window.crypto.subtle && typeof window.crypto.subtle.digest === "function") {
        const buf = await window.crypto.subtle.digest("SHA-256", data);
        return new Uint8Array(buf);
      }
      

      const rotr = (n, x) => (x >>> n) | (x << (32 - n));
      const K = new Uint32Array([
        0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
        0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
        0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
        0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
        0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
        0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
        0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
        0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
      ]);
      const H = new Uint32Array([
        0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
        0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
      ]);

      const l = data.length;
      const bitLen = l * 8;
      const withOne = l + 1;
      const padLen = (withOne % 64 <= 56) ? (56 - (withOne % 64)) : (56 + 64 - (withOne % 64));
      const total = withOne + padLen + 8;
      const m = new Uint8Array(total);
      m.set(data, 0);
      m[l] = 0x80;
      

      const dv = new DataView(m.buffer);
      dv.setUint32(total - 8, Math.floor(bitLen / 0x100000000), false);
      dv.setUint32(total - 4, bitLen >>> 0, false);

      const W = new Uint32Array(64);
      for (let i = 0; i < total; i += 64) {
        for (let t = 0; t < 16; t++) W[t] = dv.getUint32(i + t * 4, false);
        for (let t = 16; t < 64; t++) {
          const s0 = rotr(7, W[t - 15]) ^ rotr(18, W[t - 15]) ^ (W[t - 15] >>> 3);
          const s1 = rotr(17, W[t - 2]) ^ rotr(19, W[t - 2]) ^ (W[t - 2] >>> 10);
          W[t] = (W[t - 16] + s0 + W[t - 7] + s1) >>> 0;
        }
        let a = H[0], b = H[1], c = H[2], d = H[3], e = H[4], f = H[5], g = H[6], h = H[7];
        for (let t = 0; t < 64; t++) {
          const S1 = rotr(6, e) ^ rotr(11, e) ^ rotr(25, e);
          const ch = (e & f) ^ (~e & g);
          const temp1 = (h + S1 + ch + K[t] + W[t]) >>> 0;
          const S0 = rotr(2, a) ^ rotr(13, a) ^ rotr(22, a);
          const maj = (a & b) ^ (a & c) ^ (b & c);
          const temp2 = (S0 + maj) >>> 0;
          h = g; g = f; f = e; e = (d + temp1) >>> 0;
          d = c; c = b; b = a; a = (temp1 + temp2) >>> 0;
        }
        H[0] = (H[0] + a) >>> 0;
        H[1] = (H[1] + b) >>> 0;
        H[2] = (H[2] + c) >>> 0;
        H[3] = (H[3] + d) >>> 0;
        H[4] = (H[4] + e) >>> 0;
        H[5] = (H[5] + f) >>> 0;
        H[6] = (H[6] + g) >>> 0;
        H[7] = (H[7] + h) >>> 0;
      }
      const out = new Uint8Array(32);
      const dv2 = new DataView(out.buffer);
      for (let i = 0; i < 8; i++) dv2.setUint32(i * 4, H[i], false);
      return out;
    };

    

    const CFG_RAW = window.CONFIG || window.TATICO_CONFIG || {};

    const GROUP_CARDS_CANDIDATES = [
      CFG_RAW.groupCards,
      "01. Cartões", "Cartões", "01. Cartoes", "Cartoes",
    ].filter(Boolean);

    const GROUP_SLOTS_CANDIDATES = [
      CFG_RAW.groupSlots,
      "02. Cards jogadores", "Cards jogadores", "02. Cards Jogadores",
    ].filter(Boolean);

    const MC_GROUP_SLOTS_CANDIDATES = [
      CFG_RAW.mc && CFG_RAW.mc.groupSlots,
      "02. MC Cards jogadores", "MC Cards jogadores", "02. MC Cards Jogadores",
    ].filter(Boolean);

    const MC_GROUP_CARDS_CANDIDATES = [
      CFG_RAW.mc && CFG_RAW.mc.groupCards,
      "01. MC Cartões", "MC Cartões", "01. MC Cartoes", "MC Cartoes",
    ].filter(Boolean);

    const MC_GROUP_RESERVES_CANDIDATES = [
      CFG_RAW.mc && CFG_RAW.mc.groupReserves,
      "03. MC Reservas", "MC Reservas",
    ].filter(Boolean);

    const MC_GROUP_FX_CANDIDATES = [
      CFG_RAW.mc && CFG_RAW.mc.groupFx,
      "00. MC FX", "MC FX",
    ].filter(Boolean);

    

const CFG = (() => {
  const c = CFG_RAW || {};
  const mc = c.mc || {};

  const slotPrefix = c.slotPrefix || "Slot_";
  const slotCount = Number.isFinite(c.slotCount) ? c.slotCount : 11;
  const cardSuffix = c.cardSuffix || "__card";

  

  const yellow = c.cardsAssets?.yellow || c.cardYellowFile || c.yellowCardFile || c.cardFileYellow || "Assets/Cartões/amarelo.png";
  const red = c.cardsAssets?.red || c.cardRedFile || c.redCardFile || c.cardFileRed || "Assets/Cartões/vermelho.png";
  const swapFx = c.cardsAssets?.swapField || (c.assets && c.assets.swap) || c.swapFile || "Assets/Cartões/swap cardplayer.png";

  const mcYellow = mc.cardYellowFile || c.mcCardYellowFile || yellow;
  const mcRed = mc.cardRedFile || c.mcCardRedFile || red;

  const mcResYellow = mc.reserveCardYellowFile || c.mcReserveCardYellowFile || "Assets/Cartões/amarelo_res.png";
  const mcResRed = mc.reserveCardRedFile || c.mcReserveCardRedFile || "Assets/Cartões/vermelho_res.png";
  const mcBallFile = mc.ballFile || "";
  const mcBallFileRes = mc.ballFileRes || "";
  const guest = c.guest || {};
  const toast = c.toast || {};

  return {
    defaultScene: c.defaultScene || "",
    wsUrl: c.wsUrl || "ws://127.0.0.1:4455",
    password: c.password || "",

    slotPrefix,
    slotCount,
    cardSuffix,

    

    cardFiles: {
      yellow: resolveProjectPath(yellow),
      red: resolveProjectPath(red),
    },
    fxFiles: {
      swap: resolveProjectPath(swapFx),
    },

    mc: {
      slotPrefix: mc.slotPrefix || "MC_Slot_",
      slotCount: Number.isFinite(mc.slotCount) ? mc.slotCount : 11,

      reservePrefix: mc.reservePrefix || "MC_Res_",
      reserveCount: Number.isFinite(mc.reserveCount) ? mc.reserveCount : 12,

      swapSuffix: mc.swapSuffix || "__swap",
      swapDelayMs: Number.isFinite(mc.swapDelayMs) ? mc.swapDelayMs : 160,
      ballFile: resolveProjectPath(mcBallFile),
      ballFileRes: resolveProjectPath(mcBallFileRes),

      

      cardFiles: {
        yellow: resolveProjectPath(mcYellow),
        red: resolveProjectPath(mcRed),
      },
      reserveCardFiles: {
        yellow: resolveProjectPath(mcResYellow),
        red: resolveProjectPath(mcResRed),
      },
    },

    guest: {
      enabled: guest.enabled !== false,
      sceneName: guest.sceneName || "",
      sourceName: guest.sourceName || "",
      htmlPath: resolveProjectPath(guest.htmlPath || ""),
      browserW: Number.isFinite(guest.browserW) ? guest.browserW : 1920,
      browserH: Number.isFinite(guest.browserH) ? guest.browserH : 250,
      bgColor: guest.bgColor || "#E4E2DF",
      textColor: guest.textColor || "#1F1F1F",
      fontFamily: guest.fontFamily || "Nunito, Arial, sans-serif",
      fontSizePx: Number.isFinite(guest.fontSizePx) ? guest.fontSizePx : 56,
      fontWeight: Number.isFinite(guest.fontWeight) ? guest.fontWeight : 800,
      padX: Number.isFinite(guest.padX) ? guest.padX : 48,
      padY: Number.isFinite(guest.padY) ? guest.padY : 24,
      radiusPx: Number.isFinite(guest.radiusPx) ? guest.radiusPx : 28,
      anchor: guest.anchor || "bottom_center",
      bottomMarginPx: Number.isFinite(guest.bottomMarginPx) ? guest.bottomMarginPx : 80,
      safeMaxWidthPct: Number.isFinite(guest.safeMaxWidthPct) ? guest.safeMaxWidthPct : 0.92,
      maxLines: Number.isFinite(guest.maxLines) ? guest.maxLines : 1,
      ellipsis: guest.ellipsis !== false,
    },

    toast: {
      enabled: toast.enabled !== false,
      inputName: toast.inputName || "MC_Toast",
      htmlPath: resolveProjectPath(toast.htmlPath || "Browser/mc_toast.html"),
      w: Number.isFinite(toast.w) ? toast.w : 508,
      h: Number.isFinite(toast.h) ? toast.h : 64,
      padX: Number.isFinite(toast.padX) ? toast.padX : 56,
      ttlGoalMs: Number.isFinite(toast.ttlGoalMs) ? toast.ttlGoalMs : 2000,
      ttlGoalAnnulledMs: Number.isFinite(toast.ttlGoalAnnulledMs) ? toast.ttlGoalAnnulledMs : 2200,
      ttlYellowMs: Number.isFinite(toast.ttlYellowMs) ? toast.ttlYellowMs : 2200,
      ttlRedMs: Number.isFinite(toast.ttlRedMs) ? toast.ttlRedMs : 2600,
      ttlSubMs: Number.isFinite(toast.ttlSubMs) ? toast.ttlSubMs : 3200,
    },

    enableCardAnim: c.enableCardAnim !== false,
    cardAnimMs: Number.isFinite(c.cardAnimMs) ? c.cardAnimMs : 160,

    forceCardsAlwaysOnTop: c.forceCardsAlwaysOnTop !== false,
    topEnforceIntervalMs: Number.isFinite(c.topEnforceIntervalMs) ? c.topEnforceIntervalMs : 2000,

    playersPath: resolveProjectPath(PLAYERS_FOLDER_PATH),
    reservesPath: resolveProjectPath(c.reservesPath || RESERVES_FOLDER_PATH),
  };
})();

    const MC_PENALTY_STATES = ["empty", "goal", "miss"];

    const MC_PENALTY_FILES = (() => {
      const mc = (CFG_RAW && CFG_RAW.mc) || {};
      const penalties = mc.penalties || mc.penaltyFiles || {};
      const cor = penalties.cor || {};
      const adv = penalties.adv || {};

      const defaultsCor = {
        empty: "Assets/Placar/cor_vazio.png",
        goal: "Assets/Placar/cor_gol.png",
        miss: "Assets/Placar/cor_erro.png",
      };
      const defaultsAdv = {
        empty: "Assets/Placar/adv_vazio.png",
        goal: "Assets/Placar/adv_gol.png",
        miss: "Assets/Placar/adv_erro.png",
      };

      return {
        cor: {
          empty: resolveProjectPath(cor.empty || defaultsCor.empty),
          goal: resolveProjectPath(cor.goal || defaultsCor.goal),
          miss: resolveProjectPath(cor.miss || defaultsCor.miss),
        },
        adv: {
          empty: resolveProjectPath(adv.empty || defaultsAdv.empty),
          goal: resolveProjectPath(adv.goal || defaultsAdv.goal),
          miss: resolveProjectPath(adv.miss || defaultsAdv.miss),
        },
      };
    })();

    const MC_PENALTY_ICONS = {
      cor: { empty: "○", goal: "●", miss: "✕" },
      adv: { empty: "◇", goal: "◆", miss: "✕" },
    };

    const pad2 = (n) => String(n).padStart(2, "0");
    const getSlotName = (n) => `${CFG.slotPrefix}${pad2(n)}`;
    const mcSlotName = (n) => `${CFG.mc.slotPrefix}${pad2(n)}`;
    const mcReserveName = (n) => `${CFG.mc.reservePrefix}${pad2(n)}`;
    const MC_BALL_SUFFIX = "__ball";
    const MC_BALL_FALLBACK_SUFFIX = "_ball";
    const MC_GOAL_TYPES = { OG: "OG" };

    const mcBallName = (entityName) => `${entityName}${MC_BALL_SUFFIX}`;
    const mcBallFallbackName = (entityName) => `${entityName}${MC_BALL_FALLBACK_SUFFIX}`;
    const isMcSlotId = (id) => String(id || "").startsWith(CFG.mc.slotPrefix);
    const isMcReserveId = (id) => String(id || "").startsWith(CFG.mc.reservePrefix);
    const isMcSlot = (entityName) => isMcSlotId(entityName);
    const isMcReserve = (entityName) => isMcReserveId(entityName);

    const invalidateMcItemCache = (reason = "") => {
      if (state.mcItemCache) state.mcItemCache.clear();
      if (state.mcBallNameCache) state.mcBallNameCache.clear();
      if (state.mcContainerTypeCache) state.mcContainerTypeCache.clear();
      if (state.mcBallFallbackLogged) state.mcBallFallbackLogged.clear();
      if (state.mcBallObserved) state.mcBallObserved.clear();
      if (reason) log("[BALL] cache inválido", { reason });
    };

    const getObsErrorMessage = (err) => String(err?.status?.comment || err?.message || err || "");

    const detectContainerType = async (containerName) => {
      if (!state.connected || !state.ws || !containerName) return null;
      const cache = state.mcContainerTypeCache || new Map();
      state.mcContainerTypeCache = cache;
      if (cache.has(containerName)) return cache.get(containerName);

      const tryScene = await state.ws.call("GetSceneItemList", { sceneName: containerName }).then(() => true).catch(() => false);
      if (tryScene) {
        cache.set(containerName, "scene");
        return "scene";
      }

      const tryGroup = await state.ws.call("GetGroupSceneItemList", { sceneName: containerName }).then(() => true).catch(() => false);
      if (tryGroup) {
        cache.set(containerName, "group");
        return "group";
      }

      return null;
    };

    const isGroupName = async (name) => {
      if (!name) return false;
      const knownGroups = [
        state.groupSlotsName,
        state.groupCardsName,
        state.mcGroupSlotsName,
        state.mcGroupCardsName,
        state.mcGroupReservesName,
        state.mcGroupFxName,
        state.mcScoreboard?.groupName,
      ].filter(Boolean);
      if (knownGroups.includes(name)) return true;
      const type = await detectContainerType(name);
      return type === "group";
    };

    const listItemsInContainer = async (containerName, { context = "" } = {}) => {
      if (!state.connected || !state.ws || !containerName) return { containerName, items: [], type: null };
      const cache = state.mcContainerTypeCache || new Map();
      state.mcContainerTypeCache = cache;
      const cachedType = cache.get(containerName);
      const tryList = async (type) => {
        if (type === "group") {
          return state.ws.call("GetGroupSceneItemList", { sceneName: containerName });
        }
        return state.ws.call("GetSceneItemList", { sceneName: containerName });
      };

      let response = null;
      let usedType = cachedType || null;

      if (cachedType) {
        response = await tryList(cachedType).catch((err) => {
          cache.delete(containerName);
          log("[OBS] lista falhou", { containerName, type: cachedType, context, err: getObsErrorMessage(err) });
          return null;
        });
      }

      if (!response) {
        const fallbackTypes = cachedType === "group"
          ? ["scene"]
          : cachedType === "scene"
            ? ["group"]
            : ["scene", "group"];
        for (const type of fallbackTypes) {
          response = await tryList(type).catch((err) => {
            if (type === fallbackTypes[fallbackTypes.length - 1]) {
              log("[OBS] lista falhou", { containerName, type, context, err: getObsErrorMessage(err) });
            }
            return null;
          });
          if (response) {
            usedType = type;
            cache.set(containerName, type);
            break;
          }
        }
      }

      const items = response?.sceneItems || [];
      return { containerName, items, type: usedType };
    };

    const resolveSceneItem = async (containerName, sourceName, options = {}) => {
      if (!state.connected || !state.ws || !containerName || !sourceName) return null;
      const forceRefresh = !!options.forceRefresh;
      const cache = state.mcItemCache || new Map();
      state.mcItemCache = cache;
      const cacheKey = `${containerName}::${sourceName}`;
      const cached = cache.get(cacheKey);
      if (cached && !forceRefresh) return cached;
      const list = await listItemsInContainer(containerName, { context: "resolveSceneItem" });
      const items = list.items || [];
      const match = items.find((it) => it.sourceName === sourceName);
      if (!match) {
        cache.delete(cacheKey);
        invalidateMcItemCache("item-missing");
        return null;
      }
      const resolved = {
        containerName,
        sceneItemId: match.sceneItemId,
        sourceName: match.sourceName,
        sceneItemIndex: match.sceneItemIndex,
      };
      cache.set(cacheKey, resolved);
      return resolved;
    };

    const getMcPlayerGroupName = (playerId) => {
      if (isMcReserveId(playerId)) return state.mcGroupReservesName;
      if (isMcSlotId(playerId)) return state.mcGroupSlotsName;
      return "";
    };

    const getMcBallFileForPlayer = (playerId) => {
      if (isMcReserveId(playerId)) return CFG.mc.ballFileRes;
      if (isMcSlotId(playerId)) return CFG.mc.ballFile;
      return "";
    };

    const hasMcGoalBall = (playerId) => (state.mcGoalBallCounts.get(playerId) || 0) > 0;

    const sanitizeBallTransform = (tr) => {
      if (!tr || typeof tr !== "object") return {};
      const out = {};
      const numericKeys = ["positionX", "positionY", "scaleX", "scaleY", "rotation"];
      numericKeys.forEach((key) => {
        const val = Number(tr[key]);
        if (Number.isFinite(val)) out[key] = val;
      });
      ["cropTop", "cropBottom", "cropLeft", "cropRight"].forEach((key) => {
        if (Number.isFinite(tr[key]) && tr[key] !== 0) out[key] = Number(tr[key]);
      });
      if (!Number.isFinite(out.scaleX)) out.scaleX = 1;
      if (!Number.isFinite(out.scaleY)) out.scaleY = 1;
      return out;
    };

    const resolveBallItem = async (entityName, options = {}) => {
      if (!state.mcGroupCardsName) return null;
      const cache = state.mcBallNameCache || new Map();
      state.mcBallNameCache = cache;
      const cachedName = cache.get(entityName);
      const candidates = [cachedName, mcBallName(entityName), mcBallFallbackName(entityName)].filter(Boolean);
      const tried = new Set();
      for (const candidate of candidates) {
        if (tried.has(candidate)) continue;
        tried.add(candidate);
        const item = await resolveSceneItem(state.mcGroupCardsName, candidate, options);
        if (item) {
          cache.set(entityName, candidate);
          if (candidate.endsWith(MC_BALL_FALLBACK_SUFFIX) && !state.mcBallFallbackLogged?.has(entityName)) {
            state.mcBallFallbackLogged = state.mcBallFallbackLogged || new Set();
            state.mcBallFallbackLogged.add(entityName);
            log("[BALL] nome alternativo detectado", { entityName, sourceName: candidate });
          }
          return item;
        }
      }
      cache.delete(entityName);
      return null;
    };

    const readSceneItemTransform = async (containerName, sourceName) => {
      const item = await resolveSceneItem(containerName, sourceName);
      if (!item) return null;
      const tr = await state.ws.call("GetSceneItemTransform", {
        sceneName: item.containerName,
        sceneItemId: item.sceneItemId,
      }).catch(() => null);
      if (!tr?.sceneItemTransform) return null;
      return { item, transform: tr.sceneItemTransform };
    };

    const computeBallOffset = async (playerId) => {
      const playerGroup = getMcPlayerGroupName(playerId);
      if (!playerGroup || !state.mcGroupCardsName) return null;
      const ballItem = await resolveBallItem(playerId);
      if (!ballItem) return null;
      const playerData = await readSceneItemTransform(playerGroup, playerId);
      const ballData = await readSceneItemTransform(state.mcGroupCardsName, ballItem.sourceName);
      if (!playerData || !ballData) return null;
      const p = playerData.transform;
      const b = ballData.transform;
      const scaleX = Number(p.scaleX) || 1;
      const scaleY = Number(p.scaleY) || 1;
      const dx = (Number(b.positionX) || 0) - (Number(p.positionX) || 0);
      const dy = (Number(b.positionY) || 0) - (Number(p.positionY) || 0);
      const rotDelta = (Number(b.rotation) || 0) - (Number(p.rotation) || 0);
      const scaleRatioX = scaleX !== 0 ? (Number(b.scaleX) || 1) / scaleX : 1;
      const scaleRatioY = scaleY !== 0 ? (Number(b.scaleY) || 1) / scaleY : 1;
      const offset = { dx, dy, rotDelta, scaleRatioX, scaleRatioY };
      state.mcBallOffsets.set(playerId, offset);
      return offset;
    };

const ensureBallTransformFollows = async (playerId) => {
      if (!state.connected || !state.ws) return;

      const playerGroup = getMcPlayerGroupName(playerId);
      const ballGroup = state.mcGroupCardsName; 


      if (!playerGroup || !ballGroup) return;

      

      const ballItem = await resolveBallItem(playerId);
      if (!ballItem) return;

      

      const [playerData, ballData] = await Promise.all([
        readSceneItemTransform(playerGroup, playerId),
        readSceneItemTransform(ballGroup, ballItem.sourceName)
      ]);

      if (!playerData || !ballData) return;

      const p = playerData.transform; 


      

      

      let offsetX = 0;
      let offsetY = 0;

      try {
        const sceneName = state.currentScene;
        

        const sceneItemsRes = await state.ws.call("GetSceneItemList", { sceneName });
        const rootItems = sceneItemsRes.sceneItems || [];

        const pGroupItem = rootItems.find(i => i.sourceName === playerGroup);
        const bGroupItem = rootItems.find(i => i.sourceName === ballGroup);

        if (pGroupItem && bGroupItem) {
           

           const [pGroupTr, bGroupTr] = await Promise.all([
             state.ws.call("GetSceneItemTransform", { sceneName, sceneItemId: pGroupItem.sceneItemId }),
             state.ws.call("GetSceneItemTransform", { sceneName, sceneItemId: bGroupItem.sceneItemId })
           ]);

           

           

           offsetX = (pGroupTr.sceneItemTransform.positionX || 0) - (bGroupTr.sceneItemTransform.positionX || 0);
           offsetY = (pGroupTr.sceneItemTransform.positionY || 0) - (bGroupTr.sceneItemTransform.positionY || 0);
        }
      } catch (err) {
        

        

      }

      

      const targetTransform = {
        positionX: (Number(p.positionX) || 0) + offsetX,
        positionY: (Number(p.positionY) || 0) + offsetY,
        
        rotation: 0, 
        scaleX: Number(p.scaleX) || 1,
        scaleY: Number(p.scaleY) || 1,
        alignment: Number(p.alignment) || 5, 

        boundsType: "OBS_BOUNDS_NONE"
      };

      await state.ws.call("SetSceneItemTransform", {
        sceneName: ballData.item.containerName,
        sceneItemId: ballData.item.sceneItemId,
        sceneItemTransform: targetTransform,
      }).catch((err) => {
         log("[BALL] Erro sync transform", { id: playerId, err: err?.message });
      });
      
      await ensureBallOnTopInGroup(ballData.item.containerName, ballData.item.sourceName);
    };

    const ensureBallOnTopInGroup = async (groupName, ballSourceName) => {
      if (!groupName || !ballSourceName || !state.ws) return false;

      

      const list = await listItemsInContainer(groupName, { context: "ensureBallOnTopInGroup" });
      const items = list.items || [];
      if (!items.length) return false;

      const ballItem = items.find((item) => item.sourceName === ballSourceName);
      if (!ballItem) return false;

      

      const { topIsMin } = getSceneOrderPolicy(items);
      const currentIdx = ballItem.sceneItemIndex;
      
      

      

      

      const targetIndex = topIsMin ? 0 : items.length - 1;

      if (currentIdx !== targetIndex) {
        await state.ws.call("SetSceneItemIndex", {
          sceneName: groupName,
          sceneItemId: ballItem.sceneItemId,
          sceneItemIndex: targetIndex,
        }).catch(() => {});
        return true;
      }
      return false;
    };

    const ensureBallAboveSwap = async (entityName) => {
      if (!state.connected || !state.ws || !state.mcGroupCardsName) return;
      const ballItem = await resolveBallItem(entityName);
      if (!ballItem) return;
      const swapName = `${entityName}${CFG.mc.swapSuffix}`;
      const swapInCards = await resolveSceneItem(state.mcGroupCardsName, swapName);
      const swapInFx = state.mcGroupFxName ? await resolveSceneItem(state.mcGroupFxName, swapName) : null;
      const swapItem = swapInCards || swapInFx;
      if (!swapItem) return;

      if (swapItem.containerName === ballItem.containerName) {
        await ensureCardAboveSwapInScene(ballItem.containerName, ballItem.sourceName, swapName);
        return;
      }

      const sceneName = state.currentScene || state.programScene || state.obsProgramScene || state.fieldSceneName;
      if (!sceneName || !state.mcRootCardsGroupId || !state.mcRootFxGroupId) {
        log("[BALL] swap em grupo diferente (sem ordem)", { entityName, ballGroup: ballItem.containerName, swapGroup: swapItem.containerName });
        return;
      }

      const list = await listItemsInContainer(sceneName, { context: "ensureBallAboveSwap" });
      const items = list.items || [];
      const cardsGroupItem = items.find((item) => item.sceneItemId === state.mcRootCardsGroupId);
      const fxGroupItem = items.find((item) => item.sceneItemId === state.mcRootFxGroupId);
      if (!cardsGroupItem || !fxGroupItem) return;
      const { topIsMin } = getSceneOrderPolicy(items);
      const cardsAboveFx = topIsMin
        ? cardsGroupItem.sceneItemIndex < fxGroupItem.sceneItemIndex
        : cardsGroupItem.sceneItemIndex > fxGroupItem.sceneItemIndex;
      if (!cardsAboveFx) {
        const targetIndex = topIsMin ? Math.max(0, fxGroupItem.sceneItemIndex - 1) : Math.min(items.length - 1, fxGroupItem.sceneItemIndex + 1);
        await state.ws.call("SetSceneItemIndex", {
          sceneName,
          sceneItemId: cardsGroupItem.sceneItemId,
          sceneItemIndex: targetIndex,
        }).catch(() => {});
        setTimeout(() => {
          state.ws.call("SetSceneItemIndex", {
            sceneName,
            sceneItemId: cardsGroupItem.sceneItemId,
            sceneItemIndex: cardsGroupItem.sceneItemIndex,
          }).catch(() => {});
        }, Math.max(500, CFG.mc.swapDelayMs || 0));
      }
    };

    const setBallVisible = async (entityName, visible, { reason = "" } = {}) => {
      if (!state.connected || !state.ws || !state.mcGroupCardsName) return;
      const ballItem = await resolveBallItem(entityName, { forceRefresh: true });
      if (!ballItem) {
        invalidateMcItemCache("ball-not-found");
        log("[BALL] item não encontrado", { entityName, reason });
        return;
      }
      if (visible) {
        const file = getMcBallFileForPlayer(entityName);
        if (!file) {
          log("[BALL] arquivo não configurado", { entityName });
        } else {
          await state.ws.call("SetInputSettings", {
            inputName: ballItem.sourceName,
            inputSettings: { file },
            overlay: true,
          }).catch(() => {});
        }
      }
      await state.ws.call("SetSceneItemEnabled", {
        sceneName: ballItem.containerName,
        sceneItemId: ballItem.sceneItemId,
        sceneItemEnabled: visible,
      }).catch(() => {});
      state.mcBallObserved.set(entityName, visible);
      if (visible) {
        await ensureBallOnTopInGroup(ballItem.containerName, ballItem.sourceName);
        await ensureBallAboveSwap(entityName);
        await ensureBallTransformFollows(entityName);
      }
    };

    const waitForMcBallIdle = async (context) => {
      if (!state.mcBallBusy) return true;
      log("[BALL] aguardando lock", { context });
      const deadline = Date.now() + 1500;
      while (state.mcBallBusy && Date.now() < deadline) {
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
      if (state.mcBallBusy) {
        log("[BALL] lock timeout", { context });
        return false;
      }
      return true;
    };

    const withMcBallLock = async (context, fn) => {
      const ok = await waitForMcBallIdle(context);
      if (!ok) return null;
      state.mcBallBusy = true;
      try {
        return await fn();
      } finally {
        state.mcBallBusy = false;
      }
    };

    const recomputeGoalBallCounts = () => {
      const counts = new Map();
      for (const entry of state.mcGoalBallStack) {
        if (!isMcSlot(entry) && !isMcReserve(entry)) continue;
        counts.set(entry, (counts.get(entry) || 0) + 1);
      }
      state.mcGoalBallCounts = counts;
      return counts;
    };

    const addGoalBall = async (entityName) => {
      if (!entityName) return;
      return withMcBallLock("addGoalBall", async () => {
        state.mcGoalBallStack.push(entityName);
        recomputeGoalBallCounts();
        await setBallVisible(entityName, true, { reason: "goal" });
      });
    };

    const addOwnGoalBall = () => {
      state.mcGoalBallStack.push(MC_GOAL_TYPES.OG);
    };

    const undoGoalBall = async () => {
      return withMcBallLock("undoGoalBall", async () => {
        const last = state.mcGoalBallStack.pop();
        if (!last) return null;
        recomputeGoalBallCounts();
        if (isMcSlot(last) || isMcReserve(last)) {
          const remaining = state.mcGoalBallCounts.get(last) || 0;
          if (remaining <= 0) {
            await setBallVisible(last, false, { reason: "undo" });
          } else {
            await ensureBallTransformFollows(last);
          }
        }
        return last;
      });
    };

    const clearAllBalls = async ({ resetState = false } = {}) => {
      if (!state.connected || !state.ws || !state.mcGroupCardsName) return;
      const list = await listItemsInContainer(state.mcGroupCardsName, { context: "clearAllBalls" });
      const items = list.items || [];
      for (const it of items) {
        if (!it?.sourceName) continue;
        if (!it.sourceName.endsWith(MC_BALL_SUFFIX) && !it.sourceName.endsWith(MC_BALL_FALLBACK_SUFFIX)) continue;
        await state.ws.call("SetSceneItemEnabled", {
          sceneName: state.mcGroupCardsName,
          sceneItemId: it.sceneItemId,
          sceneItemEnabled: false,
        }).catch(() => {});
      }
      if (resetState) {
        state.mcGoalBallStack = [];
        state.mcGoalBallCounts = new Map();
        state.mcBallOffsets.clear();
      }
      state.mcBallObserved.clear();
    };

    const readObsEnabledBalls = async () => {
      const list = await listItemsInContainer(state.mcGroupCardsName, { context: "syncGoalBalls" });
      const items = list.items || [];
      const enabled = new Set();
      for (const it of items) {
        if (!it?.sourceName) continue;
        if (!it.sourceName.endsWith(MC_BALL_SUFFIX) && !it.sourceName.endsWith(MC_BALL_FALLBACK_SUFFIX)) continue;
        let isEnabled = typeof it.sceneItemEnabled === "boolean" ? it.sceneItemEnabled : null;
        if (isEnabled === null) {
          const status = await state.ws.call("GetSceneItemEnabled", {
            sceneName: state.mcGroupCardsName,
            sceneItemId: it.sceneItemId,
          }).catch((err) => {
            log("[BALL] erro lendo enabled", { err: getObsErrorMessage(err), sourceName: it.sourceName });
            return null;
          });
          if (!status) return { ok: false, enabled: new Set() };
          isEnabled = !!status.sceneItemEnabled;
        }
        if (!isEnabled) continue;
        const suffix = it.sourceName.endsWith(MC_BALL_SUFFIX) ? MC_BALL_SUFFIX : MC_BALL_FALLBACK_SUFFIX;
        const entityName = it.sourceName.replace(new RegExp(`${suffix}$`), "");
        if (isMcSlot(entityName) || isMcReserve(entityName)) {
          enabled.add(entityName);
        }
      }
      return { ok: true, enabled };
    };

    const syncGoalBalls = async ({ context = "" } = {}) => {
      if (!state.connected || !state.ws || !state.mcGroupCardsName) return;
      return withMcBallLock(`sync:${context}`, async () => {
        recomputeGoalBallCounts();
        const hasState = state.mcGoalBallStack.length > 0 || state.mcGoalBallCounts.size > 0;
        const obsSnapshot = await readObsEnabledBalls();
        if (!obsSnapshot.ok) {
          log("[BALL] sync abortado por erro no OBS", { context });
          return;
        }
        const obsSet = obsSnapshot.enabled;
        let useObsAsSource = !hasState;
        if (!useObsAsSource) {
          const expected = new Set();
          for (const [entityName, count] of state.mcGoalBallCounts.entries()) {
            if (count > 0) expected.add(entityName);
          }
          if (expected.size !== obsSet.size) {
            useObsAsSource = true;
          } else {
            for (const name of expected) {
              if (!obsSet.has(name)) {
                useObsAsSource = true;
                break;
              }
            }
          }
        }

        if (useObsAsSource) {
          state.mcGoalBallStack = Array.from(obsSet);
          recomputeGoalBallCounts();
          for (let i = 1; i <= CFG.mc.slotCount; i++) {
            const id = mcSlotName(i);
            await setBallVisible(id, obsSet.has(id), { reason: `sync:${context}` });
          }
          for (let i = 1; i <= CFG.mc.reserveCount; i++) {
            const id = mcReserveName(i);
            await setBallVisible(id, obsSet.has(id), { reason: `sync:${context}` });
          }
        } else {
          for (let i = 1; i <= CFG.mc.slotCount; i++) {
            const id = mcSlotName(i);
            await setBallVisible(id, (state.mcGoalBallCounts.get(id) || 0) > 0, { reason: `sync:${context}` });
          }
          for (let i = 1; i <= CFG.mc.reserveCount; i++) {
            const id = mcReserveName(i);
            await setBallVisible(id, (state.mcGoalBallCounts.get(id) || 0) > 0, { reason: `sync:${context}` });
          }
        }
      });
    };

    const reconcileBallsAfterSwap = async (pairs = []) => {
      if (!pairs.length) return;
      return withMcBallLock("swap", async () => {
        const mapping = new Map();
        pairs.forEach((pair) => {
          if (pair?.from && pair?.to) mapping.set(pair.from, pair.to);
        });
        if (!mapping.size) return;
        state.mcGoalBallStack = state.mcGoalBallStack.map((entry) => mapping.get(entry) || entry);
        recomputeGoalBallCounts();
        for (const pair of pairs) {
          if (!pair?.from || !pair?.to) continue;
          await setBallVisible(pair.from, (state.mcGoalBallCounts.get(pair.from) || 0) > 0, { reason: "swap" });
          await setBallVisible(pair.to, (state.mcGoalBallCounts.get(pair.to) || 0) > 0, { reason: "swap" });
          await ensureBallTransformFollows(pair.from);
          await ensureBallTransformFollows(pair.to);
        }
        invalidateMcItemCache("swap");
      });
    };

    const delay = (ms) => new Promise((r) => setTimeout(r, ms));

    

    const toastQueue = [];
    let toastIsPlaying = false;

    const isToastBlocked = () => {
      return state && state.mcScoreboard && state.mcScoreboard.status === "penalti";
    };

    const encodeToastPayload = (payload) => {
      const json = JSON.stringify(payload || {});
      const bytes = new TextEncoder().encode(json);
      let binary = "";
      bytes.forEach((b) => { binary += String.fromCharCode(b); });
      return btoa(binary);
    };

    const toastShow = async (payload) => {
      if (!CFG.toast || CFG.toast.enabled === false) return;
      if (!state || !state.ws) throw new Error("WS indisponível");
      const inputName = CFG.toast.inputName;
      const htmlPath = CFG.toast.htmlPath;
      const encoded = encodeToastPayload(payload);
      const url = `${htmlPath}?payload=${encodeURIComponent(encoded)}&t=${Date.now()}`;
      await state.ws.call("SetInputSettings", {
        inputName,
        inputSettings: { url },
        overlay: true,
      });
    };

    const pumpToastQueue = async () => {
      if (toastIsPlaying) return;
      const next = toastQueue.shift();
      if (!next) return;
      toastIsPlaying = true;

      let shown = false;
      try {
        await toastShow(next);
        shown = true;
      } catch (err) {
        log("TOAST ERRO", { err: String(err?.message || err) });
      }

      if (shown) {
        const waitMs = Math.max(0, Number(next.ttlMs) || 0) + 200;
        await delay(waitMs);
      }

      toastIsPlaying = false;
      if (toastQueue.length) pumpToastQueue();
    };

    const enqueueToast = (evt) => {
      if (!CFG.toast || CFG.toast.enabled === false) return;
      if (state && state.target !== "mc") return;
      if (isToastBlocked()) return;
      const ttlMs = Number.isFinite(evt.ttlMs) ? evt.ttlMs : 2000;
      toastQueue.push({ ...evt, ttlMs, ts: Date.now() });
      pumpToastQueue();
    };

    

    class ObsWS5 {
      constructor(url, password) {
        this.url = url;
        this.password = password || "";
        this.ws = null;
        this.req = 1;
        this.pending = new Map();
        this.onEvent = () => {};
      }

      async connect() {
        if (this.ws && (this.ws.readyState === 0 || this.ws.readyState === 1)) return;

        this.ws = new WebSocket(this.url);

        this.ws.onopen = () => log(`Conectando: ${this.url}`);
        this.ws.onerror = () => log("WS error");
        this.ws.onclose = (ev) => log("WS closed", { code: ev && ev.code, reason: ev && ev.reason });

        this.ws.onmessage = async (ev) => {
          let msg;
          try { msg = JSON.parse(ev.data); } catch { return; }
          const op = msg.op;
          const d = msg.d;

          

          if (op === 0) {
            let authentication;
            if (d && d.authentication && this.password) {
              const challenge = d.authentication.challenge;
              const salt = d.authentication.salt;
              const b64 = (u8) => btoa(String.fromCharCode(...u8));
              const secret = b64(await sha256ToUint8(this.password + salt));
              authentication = b64(await sha256ToUint8(secret + challenge));
            } else if (d && d.authentication && !this.password) {
              log("OBS WS requer senha, mas nenhuma senha foi configurada.");
            }

            this.send(1, {
              rpcVersion: 1,
              eventSubscriptions: 2047,
              ...(authentication ? { authentication } : {}),
            });
            return;
          }

          

          if (op === 5) {
            this.onEvent(d || {});
            return;
          }

          

          if (op === 7) {
            const requestId = d && d.requestId;
            const requestStatus = d && d.requestStatus;
            const responseData = d && d.responseData;
            const p = this.pending.get(requestId);
            if (!p) return;
            this.pending.delete(requestId);

            if (requestStatus && requestStatus.result) p.resolve(responseData || {});
            else p.reject({ status: requestStatus, responseData });
          }
        };

        await new Promise((resolve, reject) => {
          const t = setTimeout(() => reject(new Error("Timeout conectando WS")), 5000);
          const i = setInterval(() => {
            if (this.ws && this.ws.readyState === 1) {
              clearTimeout(t);
              clearInterval(i);
              resolve();
            }
          }, 50);
        });
      }

      send(op, d) {
        if (this.ws) this.ws.send(JSON.stringify({ op, d }));
      }

      call(requestType, requestData = {}) {
        const requestId = String(this.req++);
        return new Promise((resolve, reject) => {
          this.pending.set(requestId, { resolve, reject });
          this.send(6, { requestType, requestId, requestData });
        });
      }
    }

    


    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
    const lerp = (a, b, t) => a + (b - a) * t;

    const animateTransform = async (sceneName, sceneItemId, from, to, ms) => {
      const steps = 6;
      const dt = Math.max(16, Math.floor(ms / steps));

      await state.ws.call("SetSceneItemTransform", { sceneName, sceneItemId, sceneItemTransform: from });

      for (let i = 1; i <= steps; i++) {
        const tt = easeOutCubic(i / steps);
        const tr = {
          ...to,
          positionX: lerp(from.positionX, to.positionX, tt),
          positionY: lerp(from.positionY, to.positionY, tt),
          scaleX: lerp(from.scaleX, to.scaleX, tt),
          scaleY: lerp(from.scaleY, to.scaleY, tt),
        };
        setTimeout(() => {
          state.ws.call("SetSceneItemTransform", { sceneName, sceneItemId, sceneItemTransform: tr }).catch(() => {});
        }, i * dt);
      }

      await delay(ms + 20);
      await state.ws.call("SetSceneItemTransform", { sceneName, sceneItemId, sceneItemTransform: to });
    };

    

const state = {
  ws: null,
  wsEventHandlers: [],
  connected: false,
  busy: false,
  
  stoppageAlignmentCache: null,  


  currentScene: "",
  programScene: "",
  currentProgramScene: null,
  obsProgramScene: "",
  fieldSceneName: "",

  target: "field",          

  mcSelectionMode: "slot",  


  selectedSlot: "",
  selectedMcSlot: "",
  selectedMcReserve: "",

  

  slots: {},                

  reserves: {},             


  groupSlotsName: "",
  groupCardsName: "",
  mcGroupSlotsName: "",
  mcGroupCardsName: "",
  mcGroupReservesName: "",
  mcGroupFxName: "",

  slotByName: new Map(),
  slotById: new Map(),
  cardByName: new Map(),

  mcSlotByName: new Map(),
  mcSlotById: new Map(),
  mcCardByName: new Map(),

  mcReserveByName: new Map(),
  mcReserveById: new Map(),
  mcReserveCardByName: new Map(),
  mcReserveSwapByName: new Map(),
  mcSlotSwapByName: new Map(),
  mcBallOffsets: new Map(),
  mcItemCache: new Map(),
  mcGoalBallStack: [],
  mcGoalBallCounts: new Map(),
  mcBallObserved: new Map(),
  mcBallNameCache: new Map(),
  mcContainerTypeCache: new Map(),
  mcBallFallbackLogged: new Set(),
  mcBallBusy: false,

  rootSlotsGroupId: null,
  rootCardsGroupId: null,
  mcRootSlotsGroupId: null,
  mcRootCardsGroupId: null,
  mcRootReservesGroupId: null,
  mcRootFxGroupId: null,
  syncTransformCache: null,

  topLoop: null,

  

  roster: [],               

  reserveOptions: [],       

  selectedPlayer: null,
  reserveSelection: [],
  selectedReserveOption: null,
  lastRosterGeneratedAt: "",
  lastRosterSignature: "",
  refreshInFlight: null,
  rosterPollTimer: null,

  

  isScanning: false,
  lastPlayersSignature: "",
  lastReservesSignature: "",
  lastCardsSignature: "",
  lastBrandSignature: "",



  mcScoreboard: {
    enabled: false,
    groupName: "00. MC Placar",
    teams: [],
    selectedOpponent: null,
    corinthiansFile: "Assets/Times/Corinthians.png",
    corinthiansSigla: "COR",
    corinthiansSide: "left",
    goalsLeft: 0,
    goalsRight: 0,
    status: "1t",
	aggEnabled: false,    

    aggLeft: 0,           

    aggRight: 0,          

    elapsedMs: 0,
    running: false,
    startTimestamp: 0,
    timerHandle: null,
    
    

    stoppageAsked: false,   

    stoppageValue: 0,       

    stoppageVisible: false, 

    


    persist: true,
    
    items: {
        

        stoppageTxtId: null, 

        stoppageBgId: null   

    },
    
    lastTeamsGeneratedAt: "",
    lastTeamsSignature: "",
    lastPersistAt: 0,

    

    escudoBaseline: { left: null, right: null },

    

    penalties: {
      cor: ["empty", "empty", "empty", "empty", "empty"],
      adv: ["empty", "empty", "empty", "empty", "empty"],
    },
    penaltiesVisible: null,
    penaltiesVisibilityToken: 0,
    penaltiesWarnedMissing: false,
    penaltiesLogKey: "",
  },
};


    const SLOT_STATE_KEY = "slotState";
    const RESERVE_STATE_KEY = "reserveState";

    const loadStoredState = (key) => {
      try {
        const raw = localStorage.getItem(key);
        if (!raw) return {};
        const parsed = JSON.parse(raw);
        return parsed && typeof parsed === "object" ? parsed : {};
      } catch {
        return {};
      }
    };

    const persistStoredState = (key, value) => {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch {
        

      }
    };

    const sanitizeStoredEntry = (entry) => {
      if (!entry || typeof entry !== "object") return entry;
      return {
        ...entry,
        file: toRelativeProjectPath(entry.file || ""),
      };
    };

    const sanitizeStoredMap = (map) => {
      const entries = Object.entries(map || {});
      return entries.reduce((acc, [key, value]) => {
        acc[key] = sanitizeStoredEntry(value);
        return acc;
      }, {});
    };

    const restoreUiState = () => {
      state.slots = loadStoredState(SLOT_STATE_KEY);
      state.reserves = loadStoredState(RESERVE_STATE_KEY);
    };

    const persistSlotState = () => persistStoredState(SLOT_STATE_KEY, sanitizeStoredMap(state.slots));
    const persistReserveState = () => persistStoredState(RESERVE_STATE_KEY, sanitizeStoredMap(state.reserves));

    

    const guest = {
      lastText: "",
      lastEnabled: false,
      sceneItemIdCache: new Map(),
    };

    const guestGetSceneName = () => CFG.guest && CFG.guest.sceneName;

    const guestLogError = (msg, payload) => {
      log(msg, payload);
    };

    const guestSetStatus = (message) => {
      if (!el.guestStatusText) return;
      el.guestStatusText.textContent = message || "";
    };

    const guestBuildUrl = (text) => {
      const cfg = CFG.guest || {};
      if (!guestHasValidFsRoot()) {
        guestLogError("Guest dock sem baseFsRoot", {
          protocol: location.protocol,
          baseFsRoot: window.CONFIG && window.CONFIG.baseFsRoot,
        });
        guestSetStatus("Dock precisa rodar em file:// ou baseFsRoot definido.");
        return "";
      }
      const htmlPath = resolveProjectPath(cfg.htmlPath || "");
      if (!htmlPath) return "";

      let absPath = normalizeSlash(htmlPath);
      if (/^file:\/\//i.test(absPath)) {
        const u = new URL(absPath);
        absPath = decodeURIComponent(u.pathname || "");
        if (absPath.startsWith("/") && /^[A-Za-z]:\//.test(absPath.slice(1))) {
          absPath = absPath.slice(1);
        }
      }

      if (location.protocol === "file:" && !/^[A-Za-z]:\//.test(absPath)) {
        guestSetStatus("Caminho do lower third inválido (sem drive).");
        return "";
      }

      const bgColor = cfg.bgColor || "#E4E2DF";
      const textColor = cfg.textColor || "#1F1F1F";
      const name = String(text || "").trim().slice(0, 40);
      const px = Number.isFinite(cfg.padX) ? cfg.padX : 48;
      const py = Number.isFinite(cfg.padY) ? cfg.padY : 24;
      const r = Number.isFinite(cfg.radiusPx) ? cfg.radiusPx : 28;
      const fs = Number.isFinite(cfg.fontSizePx) ? cfg.fontSizePx : 56;
      const fw = cfg.fontWeight || 800;
      const mw = Number.isFinite(cfg.safeMaxWidthPct) ? cfg.safeMaxWidthPct : 0.92;
      const bm = Number.isFinite(cfg.bottomMarginPx) ? cfg.bottomMarginPx : 80;
      const ff = cfg.fontFamily || "Nunito, Arial, sans-serif";
      const parts = [
        `t=${encodeURIComponent(name)}`,
        `bg=${encodeURIComponent(bgColor)}`,
        `tc=${encodeURIComponent(textColor)}`,
        `px=${encodeURIComponent(px)}`,
        `py=${encodeURIComponent(py)}`,
        `r=${encodeURIComponent(r)}`,
        `fs=${encodeURIComponent(fs)}`,
        `fw=${encodeURIComponent(fw)}`,
        `mw=${encodeURIComponent(mw)}`,
        `bm=${encodeURIComponent(bm)}`,
        `ff=${encodeURIComponent(ff)}`,
      ];

      return `file:///${absPath}?v=${Date.now()}#${parts.join("&")}`;
    };

const updateGuestToggleUi = () => {
      if (!el.btnGuestToggle) return;
      // Se lastEnabled for true, o botão deve oferecer a ação "Ocultar"
      if (guest.lastEnabled) {
        el.btnGuestToggle.innerHTML = `<span class="material-symbols-outlined">visibility_off</span><span class="btnLabel">Ocultar</span>`;
        el.btnGuestToggle.classList.add("active"); // Opcional: destaque visual
      } else {
        el.btnGuestToggle.innerHTML = `<span class="material-symbols-outlined">visibility</span><span class="btnLabel">Mostrar</span>`;
        el.btnGuestToggle.classList.remove("active");
      }
    };

    const guestGetSceneItemId = async () => {
      if (!state.connected || !state.ws) return null;
      const sceneName = guestGetSceneName();
      const sourceName = CFG.guest && CFG.guest.sourceName;
      if (!sceneName || !sourceName) return null;

      if (guest.sceneItemIdCache.has(sceneName)) {
        return guest.sceneItemIdCache.get(sceneName);
      }

      try {
        const list = await state.ws.call("GetSceneItemList", { sceneName });
        const items = list && list.sceneItems ? list.sceneItems : [];
        const target = items.find((item) => item.sourceName === sourceName);
        if (!target) {
          guestLogError("Guest source not in scene", {
            request: "GetSceneItemList",
            sceneName,
            sourceName,
          });
          guestSetStatus(`Fonte ${sourceName} não encontrada na cena ${sceneName}`);
          return null;
        }
        guestSetStatus("");
        guest.sceneItemIdCache.set(sceneName, target.sceneItemId);
        return target.sceneItemId;
      } catch (err) {
        guestLogError("Guest scene not found", {
          request: "GetSceneItemList",
          sceneName,
          sourceName,
          error: String(err?.status?.comment || err?.message || err),
        });
        return null;
      }
    };

    const guestEnsureSource = async () => {
      if (!state.connected || !state.ws) return false;
      const sceneName = guestGetSceneName();
      const sourceName = CFG.guest && CFG.guest.sourceName;
      if (!sceneName || !sourceName) {
        guestLogError("Guest config incompleta", {
          sceneName,
          sourceName,
        });
        return false;
      }
      const sceneItemId = await guestGetSceneItemId();
      return Number.isFinite(sceneItemId);
    };

    const guestEnforceOnTop = async () => {
      if (!state.connected || !state.ws) return;
      const sceneName = CFG.guest.sceneName;
      if (!sceneName) return;

      try {
        const list = await state.ws.call("GetSceneItemList", { sceneName });
        const items = list?.sceneItems || [];
        if (!items.length) return;

        const target = items.find((item) => item.sourceName === CFG.guest.sourceName);
        if (!target) return;

        const maxIndex = items.length - 1;

        if (target.sceneItemIndex !== maxIndex) {
          await state.ws.call("SetSceneItemIndex", {
            sceneName,
            sceneItemId: target.sceneItemId,
            sceneItemIndex: maxIndex,
          });
          log("Z-ORDER: Guest lower third -> topo absoluto", { sceneName, index: maxIndex });
        }
      } catch (err) {
        log("ERRO guestEnforceOnTop", { err: String(err?.message || err) });
      }
    };

    const guestApply = async (text) => {
      if (!state.connected || !state.ws || !CFG.guest.enabled) return;
      const sceneName = guestGetSceneName();
      const sourceName = CFG.guest.sourceName;
      if (!sceneName || !sourceName) {
        guestLogError("Guest config incompleta", { sceneName, sourceName });
        return;
      }

      const safeText = String(text || "").trim().slice(0, 40);
      const url = guestBuildUrl(safeText);
      if (!url) {
        guestLogError("Guest htmlPath inválido", { sceneName, sourceName });
        return;
      }

      try {
        await state.ws.call("SetInputSettings", {
          inputName: sourceName,
          inputSettings: {
            url,
            width: CFG.guest.browserW,
            height: CFG.guest.browserH,
          },
          overlay: true,
        });
      } catch (err) {
        guestLogError("ERRO SetInputSettings (guestApply)", {
          request: "SetInputSettings",
          sceneName,
          sourceName,
          error: String(err?.status?.comment || err?.message || err),
        });
        return;
      }

      try {
        await state.ws.call("PressInputPropertiesButton", {
          inputName: sourceName,
          propertyName: "refreshnocache",
        });
      } catch (err) {
        log("INFO refreshnocache indisponível", { sceneName, sourceName });
      }

      const sceneItemId = await guestGetSceneItemId();
      if (!sceneItemId) return;

      try {
        await state.ws.call("SetSceneItemEnabled", {
          sceneName,
          sceneItemId,
          sceneItemEnabled: true,
        });
      } catch (err) {
        guestLogError("ERRO SetSceneItemEnabled (guestApply)", {
          request: "SetSceneItemEnabled",
          sceneName,
          sourceName,
          error: String(err?.status?.comment || err?.message || err),
        });
        return;
      }

      await guestEnforceOnTop();
      guestSetStatus("");
      guest.lastText = safeText;
      guest.lastEnabled = true;
	  updateGuestToggleUi();
      log("Guest apply OK", { sceneName, sourceName, text: String(text || "") });
    };

    const guestShow = async () => {
      if (!state.connected || !state.ws || !CFG.guest.enabled) return;
      if (!(await guestEnsureSource())) return;
      const sceneName = guestGetSceneName();
      const sourceName = CFG.guest.sourceName;
      const sceneItemId = await guestGetSceneItemId();
      if (!sceneItemId) return;

      try {
        await state.ws.call("SetSceneItemEnabled", {
          sceneName,
          sceneItemId,
          sceneItemEnabled: true,
        });
        guest.lastEnabled = true;
        await guestEnforceOnTop();
		updateGuestToggleUi();
      } catch (err) {
        guestLogError("ERRO SetSceneItemEnabled (guestShow)", {
          request: "SetSceneItemEnabled",
          sceneName,
          sourceName,
          error: String(err?.status?.comment || err?.message || err),
        });
      }
    };

    const guestHide = async () => {
      if (!state.connected || !state.ws || !CFG.guest.enabled) return;
      if (!(await guestEnsureSource())) return;
      const sceneName = guestGetSceneName();
      const sourceName = CFG.guest.sourceName;
      const sceneItemId = await guestGetSceneItemId();
      if (!sceneItemId) return;

      try {
        await state.ws.call("SetSceneItemEnabled", {
          sceneName,
          sceneItemId,
          sceneItemEnabled: false,
        });
        guest.lastEnabled = false;
		updateGuestToggleUi();
        await guestEnforceOnTop();
		updateGuestToggleUi();
      } catch (err) {
        guestLogError("ERRO SetSceneItemEnabled (guestHide)", {
          request: "SetSceneItemEnabled",
          sceneName,
          sourceName,
          error: String(err?.status?.comment || err?.message || err),
        });
      }
    };

    const guestClear = async () => {
      if (!state.connected || !state.ws || !CFG.guest.enabled) return;
      const sceneName = guestGetSceneName();
      const sourceName = CFG.guest.sourceName;
      if (!sceneName || !sourceName) {
        guestLogError("Guest config incompleta", { sceneName, sourceName });
        return;
      }

      const url = guestBuildUrl("");
      if (!url) {
        guestLogError("Guest htmlPath inválido", { sceneName, sourceName });
        return;
      }

      try {
        await state.ws.call("SetInputSettings", {
          inputName: sourceName,
          inputSettings: {
            url,
            width: CFG.guest.browserW,
            height: CFG.guest.browserH,
          },
          overlay: true,
        });
      } catch (err) {
        guestLogError("ERRO SetInputSettings (guestClear)", {
          request: "SetInputSettings",
          sceneName,
          sourceName,
          error: String(err?.status?.comment || err?.message || err),
        });
        return;
      }

      const sceneItemId = await guestGetSceneItemId();
      if (!sceneItemId) return;

      try {
        await state.ws.call("SetSceneItemEnabled", {
          sceneName,
          sceneItemId,
          sceneItemEnabled: false,
        });
      } catch (err) {
        guestLogError("ERRO SetSceneItemEnabled (guestClear)", {
          request: "SetSceneItemEnabled",
          sceneName,
          sourceName,
          error: String(err?.status?.comment || err?.message || err),
        });
      }

      guest.lastText = "";
      guest.lastEnabled = false;
	  updateGuestToggleUi();
      guestSetStatus("");
      log("Guest cleared", { sceneName, sourceName });
    };

    const getActiveTargetLabel = () => (state.target === "mc" ? "Match Center" : "Campo");

    const getActiveSelection = () => {
      if (state.target === "mc") {
        if (state.mcSelectionMode === "reserve") return { kind: "reserve", name: state.selectedMcReserve };
        return { kind: "slot", name: state.selectedMcSlot };
      }
      return { kind: "slot", name: state.selectedSlot };
    };

    const getCardContext = () => {
      const selection = getActiveSelection();
      if (!selection || !selection.name) return null;

      if (state.target === "field") {
        return {
          slotName: selection.name,
          cardMap: state.cardByName,
          cardGroupName: state.groupCardsName,
          sourceGroupName: state.groupSlotsName,
          cardFiles: CFG.cardFiles,
        };
      }

      if (selection.kind === "reserve") {
        return {
          slotName: selection.name,
          cardMap: state.mcReserveCardByName,
          cardGroupName: state.mcGroupFxName,
          sourceGroupName: state.mcGroupReservesName,
          cardFiles: CFG.mc.reserveCardFiles,
        };
      }

      return {
        slotName: selection.name,
        cardMap: state.mcCardByName,
        cardGroupName: state.mcGroupCardsName,
        sourceGroupName: state.mcGroupSlotsName,
        cardFiles: CFG.mc.cardFiles,
      };
    };

const updateSelectionIndicators = (origin = "") => {
      const selection = getActiveSelection(); 
      let displayText = "Selecione...";
      let detailText = "";

      if (selection && selection.name) {
          let entry = null;
          if (selection.kind === "reserve") {
              entry = state.reserves[selection.name];
          } else {
              entry = state.slots[selection.name];
          }

          const idNum = selection.name.split("_").pop(); 
          const playerName = entry && entry.playerName ? entry.playerName : "Vazio";
          
          displayText = `${idNum} · ${playerName}`;
          
          const modeLabel = selection.kind === "reserve" ? "RESERVA" : "TITULAR";
          const targetLabel = state.target === "mc" ? "MC" : "CAMPO";
          detailText = `${modeLabel} (${targetLabel})`;
      }

      if (el.playerSelectLabel) {
          el.playerSelectLabel.innerHTML = `
            <div style="display:flex; flex-direction:column; align-items:flex-start; line-height:1.2;">
                <span style="font-size:10px; opacity:0.7;">${detailText}</span>
                <span>${displayText}</span>
            </div>
          `;
      }
      
      if(el.pillSlot) {
          setChip(el.pillSlot, selection ? `Slot: ${selection.name}` : "Slot: -", selection ? "ok" : "warn");
      }
      
      if (el.actionsHint) {
         const ctx = getCardContext();
         const cardName = ctx ? `${ctx.slotName}${CFG.cardSuffix}` : "";
         const cardIt = ctx && ctx.cardMap ? ctx.cardMap.get(cardName) : null;
         const cardState = cardIt ? (cardIt.enabled ? "ON" : "OFF") : "-";
         el.actionsHint.textContent = `Cartão atual: ${cardState}`;
      }
    };



const updateElencoButtons = () => {
  if (!state.connected) return;
  
  

  const canActGlobal = state.connected && !state.busy;
  
  if (el.btnSync) el.btnSync.disabled = !canActGlobal;
  if (el.btnClearAll) el.btnClearAll.disabled = !canActGlobal;
  if (el.btnReconnect) el.btnReconnect.disabled = state.busy;
  
  

  if (el.btnRegisterReserves) el.btnRegisterReserves.disabled = !canActGlobal || state.target !== 'mc';
  if (el.btnClearSwaps) el.btnClearSwaps.disabled = !canActGlobal || state.target !== 'mc';
  if (el.btnSubstitute) {
    el.btnSubstitute.disabled = !(canActGlobal && state.target === 'mc' && state.selectedMcSlot);
  }
};

const setBusy = (v) => {
  state.busy = !!v;
  
  console.log(`[DEBUG] setBusy(${v}) -> connected=${state.connected}, busy=${state.busy}, target=${state.target}`);
  
  

  if (el.btnReconnect) el.btnReconnect.disabled = state.busy;
  if (el.btnManagePlayers) el.btnManagePlayers.disabled = state.busy;
  if (el.btnScanFolder) el.btnScanFolder.disabled = state.isScanning || state.busy;
  if (el.btnGenerateIndex) el.btnGenerateIndex.disabled = state.busy;
  
  

  updateAllButtonStates();
};

    

    const getFieldSlotIds = () => {
      const ids = [];
      for (let i = 1; i <= CFG.slotCount; i++) ids.push(getSlotName(i));
      return ids;
    };

    const getMcSlotIds = () => {
      const ids = [];
      for (let i = 1; i <= CFG.mc.slotCount; i++) ids.push(mcSlotName(i));
      return ids;
    };

    const getMcReserveIds = () => {
      const ids = [];
      for (let i = 1; i <= CFG.mc.reserveCount; i++) ids.push(mcReserveName(i));
      return ids;
    };

    const ensureSlotEntry = (slotId) => {
      if (!Object.prototype.hasOwnProperty.call(state.slots, slotId)) {
        state.slots[slotId] = null;
      }
    };

    const ensureReserveEntry = (reserveId) => {
      if (!Object.prototype.hasOwnProperty.call(state.reserves, reserveId)) {
        state.reserves[reserveId] = null;
      }
    };

    const buildSelectLabel = (id, entry) => {
      const suffix = String(id || "").slice(-2);
      if (entry === null) return `${suffix} · — vazio —`;
      if (entry && entry.playerName) return `${suffix} · ${entry.playerName}`;
      return `${suffix} · ${id}`;
    };

    const renderSlotSelect = () => {
      if (!el.slotSelect) return;
      const ids = state.target === "mc" ? getMcSlotIds() : getFieldSlotIds();
      el.slotSelect.innerHTML = "";
      ids.forEach((slotId) => {
        ensureSlotEntry(slotId);
        const label = buildSelectLabel(slotId, state.slots[slotId]);
        el.slotSelect.append(new Option(label, slotId));
      });

      if (state.target === "mc") {
        if (!state.selectedMcSlot) state.selectedMcSlot = ids[0] || "";
        el.slotSelect.value = state.selectedMcSlot || "";
      } else {
        if (!state.selectedSlot) state.selectedSlot = ids[0] || "";
        el.slotSelect.value = state.selectedSlot || "";
      }
      updateSelectionIndicators("init");
    };

    const renderReserveSelect = () => {
      if (!el.reserveSelect) return;
      const ids = getMcReserveIds();
      el.reserveSelect.innerHTML = "";
      ids.forEach((reserveId) => {
        ensureReserveEntry(reserveId);
        const label = buildSelectLabel(reserveId, state.reserves[reserveId]);
        el.reserveSelect.append(new Option(label, reserveId));
      });
      if (!state.selectedMcReserve) state.selectedMcReserve = ids[0] || "";
      el.reserveSelect.value = state.selectedMcReserve || "";
    };

    const updateSlotState = (slotId, entry) => {
      if (!slotId) return;
      state.slots[slotId] = entry
        ? { playerName: entry.playerName || entry.name || "", file: entry.file || "" }
        : null;
      persistSlotState();
      renderSlotSelect();
      if (state.target === "mc") {
        state.selectedMcSlot = slotId;
      } else {
        state.selectedSlot = slotId;
      }
      if (el.slotSelect) el.slotSelect.value = slotId;
      updateSelectionIndicators("slotUpdate");
      updateAllButtonStates();
    };

    const updateReserveState = (reserveId, entry) => {
      if (!reserveId) return;
      state.reserves[reserveId] = entry
        ? { playerName: entry.playerName || entry.name || "", file: entry.file || "" }
        : null;
      persistReserveState();
      renderReserveSelect();
      state.selectedMcReserve = reserveId;
      if (el.reserveSelect) el.reserveSelect.value = reserveId;
      updateSelectionIndicators("reserveUpdate");
      updateAllButtonStates();
    };

const applyTargetUiState = async () => {
  const isMc = state.target === "mc";

  if (el.targetSelect) el.targetSelect.value = state.target;
  invalidateSyncTransformCache("targetChange");

  

  const setVisible = (element, visible) => {
    if (!element) return;
    const fieldParent = element.closest(".field");
    const target = fieldParent || element;
    target.classList.toggle("isHidden", !visible);
  };

  

  setVisible(el.reserveSelect, isMc);
  
  

  
  setVisible(el.btnRegisterReserves, isMc);
  setVisible(el.btnSubstitute, isMc);
  setVisible(el.btnClearSwaps, isMc);

  

  setVisible(el.mcScoreboardPanel, isMc);

  if (isMc) {
    renderSlotSelect();
    renderReserveSelect();
    if (state.connected) await syncMc();
  } else {
    renderSlotSelect();
    if (state.connected) await syncField();
  }

  updateSelectionIndicators("target");
  updateAllButtonStates();
  updatePanelsVisibility("post-render");
};

const isGuestSceneActive = () => {
  const a = (state.obsProgramScene || "").trim();
  const b = (CFG.guest.sceneName || "").trim();
  return !!a && !!b && a === b;
};

 const updatePanelsVisibility = (origin = "") => {
      const guestActive = isGuestSceneActive();

      const guestPanel = el.guestPanel ||
        document.querySelector('[data-panel="guest"]');
      const mainWrap = document.getElementById("mainPanelsWrap") ||
        document.querySelector('[data-panel="main-wrap"]');

      const mainPanels = Array.from(document.querySelectorAll('[data-panel="main"]'));

      log("UI visibility", {
        origin,
        obsProgramScene: state.obsProgramScene,
        cfgGuestScene: CFG.guest.sceneName,
        guestActive,
        hasGuestPanel: !!guestPanel,
        hasMainWrap: !!mainWrap,
        mainPanelsCount: mainPanels.length,
      });

      

      

      

      if (guestPanel) {
        guestPanel.classList.toggle("isHidden", !guestActive);
      }

      if (mainWrap) {
        

        mainWrap.classList.toggle("isHidden", guestActive);
      } else {
        for (const panel of mainPanels) panel.classList.toggle("isHidden", guestActive);
      }
      


      const disable = !guestActive || !guestHasValidFsRoot();
      if (el.guestNameInput) el.guestNameInput.disabled = disable;
      if (el.btnGuestApply) el.btnGuestApply.disabled = disable;
      if (el.btnGuestShow) el.btnGuestShow.disabled = disable;
      if (el.btnGuestHide) el.btnGuestHide.disabled = disable;
      if (el.btnGuestClear) el.btnGuestClear.disabled = disable;

      if (!guestHasValidFsRoot()) {
        guestSetStatus("Dock precisa rodar em file:// ou baseFsRoot definido.");
      } else if (!guestActive) {
        

        if (el.guestStatusText) guestSetStatus("");
      } else {
         

         if (el.guestStatusText && el.guestStatusText.textContent.startsWith("Aguardando cena")) {
            guestSetStatus("");
         }
      }

      if (guestActive) {
        guestEnforceOnTop();
      }
    };

    const updateGuestDockVisibility = (origin = "") => {
      const guestPanel = el.guestPanel;
      if (!guestPanel) {
        log("DOM MISSING", { id: "guestPanel" });
        return;
      }
      const guestScene = CFG.guest && CFG.guest.sceneName;
      const isGuestScene = !!guestScene && state.obsProgramScene === guestScene;

      

      

      guestPanel.classList.toggle("isHidden", !isGuestScene);
      


      const disable = !isGuestScene || !guestHasValidFsRoot();
      if (el.guestNameInput) el.guestNameInput.disabled = disable;
      if (el.btnGuestApply) el.btnGuestApply.disabled = disable;
      if (el.btnGuestShow) el.btnGuestShow.disabled = disable;
      if (el.btnGuestHide) el.btnGuestHide.disabled = disable;
      if (el.btnGuestClear) el.btnGuestClear.disabled = disable;

      if (!guestHasValidFsRoot()) {
        guestSetStatus("Dock precisa rodar em file:// ou baseFsRoot definido.");
      } else if (!isGuestScene) {
        

      } else if (el.guestStatusText && el.guestStatusText.textContent.startsWith("Aguardando cena")) {
        guestSetStatus("");
      }
    };

const applySelectionFromObs = async (payload) => {
      if (!payload || !payload.name) return;

      const target = payload.target === "mc" ? "mc" : "field";
      const kind = payload.kind === "reserve" ? "reserve" : "slot";

      const targetChanged = state.target !== target;
      const modeChanged = target === "mc" && state.mcSelectionMode !== (kind === "reserve" ? "reserve" : "slot");

      state.target = target;
      if (target === "field") {
        state.selectedSlot = payload.name;
      } else if (kind === "reserve") {
        state.selectedMcReserve = payload.name;
        state.mcSelectionMode = "reserve";
      } else {
        state.selectedMcSlot = payload.name;
        state.mcSelectionMode = "slot";
      }

      if (targetChanged || modeChanged) {
        await applyTargetUiState();
        return;
      }

      if (el.targetSelect) el.targetSelect.value = state.target;
      
      if (el.slotSelect) {
        el.slotSelect.value = state.target === "mc" ? state.selectedMcSlot : state.selectedSlot;
      }
      if (el.reserveSelect) el.reserveSelect.value = state.selectedMcReserve;
      updateSelectionIndicators("obs");
      setBusy(state.busy);
    };

    const handleObsSceneItemSelection = async (eventData) => {
      if (!eventData) return;
      const sceneName = eventData.sceneName;
      const sceneItemId = eventData.sceneItemId;

      if (!sceneName || !Number.isFinite(sceneItemId)) return;

      if (sceneName === state.groupSlotsName) {
        const slotNameValue = state.slotById.get(sceneItemId);
        if (slotNameValue) await applySelectionFromObs({ target: "field", kind: "slot", name: slotNameValue });
        return;
      }

      if (sceneName === state.mcGroupSlotsName) {
        const slotNameValue = state.mcSlotById.get(sceneItemId);
        if (slotNameValue) await applySelectionFromObs({ target: "mc", kind: "slot", name: slotNameValue });
        return;
      }

      if (sceneName === state.mcGroupReservesName) {
        const reserveNameValue = state.mcReserveById.get(sceneItemId);
        if (reserveNameValue) await applySelectionFromObs({ target: "mc", kind: "reserve", name: reserveNameValue });
      }
    };

    const fillScenes = (scenes, current) => {
      if (!el.sceneSelect) return;
      el.sceneSelect.innerHTML = scenes.map((s) => `<option value="${s}">${s}</option>`).join("");
      if (current && scenes.includes(current)) el.sceneSelect.value = current;
    };

    const applySceneSelection = async (sceneName, origin = "") => {
      if (!sceneName) return;
      if (sceneName === state.currentScene && origin !== "event") return;

      state.currentScene = sceneName;
      invalidateSyncTransformCache("sceneChange");
      if (el.sceneSelect) el.sceneSelect.value = sceneName;
      setChip(el.pillScene, `Cena: ${state.currentScene}`, state.currentScene ? "ok" : "warn");

      if (state.connected) {
        await syncAll();
      }

      updateSelectionIndicators(origin || "scene");
      updatePanelsVisibility("post-render");
    };

    const applyObsProgramScene = (sceneName, origin = "") => {
      if (!sceneName) return;
      invalidateMcItemCache("programSceneChange");
      state.obsProgramScene = sceneName;
      state.programScene = sceneName;
      state.currentProgramScene = sceneName;
      if (!state.currentScene || state.currentScene === sceneName || origin === "event") {
        state.currentScene = sceneName;
      }
      if (el.sceneSelect) {
        const hasOption = Array.from(el.sceneSelect.options).some((opt) => opt.value === sceneName);
        if (hasOption) el.sceneSelect.value = sceneName;
      }
      setChip(el.pillScene, `Cena: ${sceneName}`, sceneName ? "ok" : "warn");
      updatePanelsVisibility(origin || "scene");
      updateGuestDockVisibility(origin || "scene");
    };

    const invalidateSyncTransformCache = (reason = "") => {
      if (!state.syncTransformCache) return;
      state.syncTransformCache = null;
      if (reason) log("[SYNC] cache invalidado", { reason });
    };

    

    const tryGetGroupList = async (groupName) => {
      const res = await state.ws.call("GetGroupSceneItemList", { sceneName: groupName });
      return res && res.sceneItems ? res : null;
    };

    const resolveFieldGroupNames = async () => {
      let slotsOk = "";
      for (const name of GROUP_SLOTS_CANDIDATES) {
        try {
          const r = await tryGetGroupList(name);
          if (r) { slotsOk = name; break; }
        } catch {}
      }
      let cardsOk = "";
      for (const name of GROUP_CARDS_CANDIDATES) {
        try {
          const r = await tryGetGroupList(name);
          if (r) { cardsOk = name; break; }
        } catch {}
      }

      state.groupSlotsName = slotsOk;
      state.groupCardsName = cardsOk;

      log("Grupos resolvidos (Campo)", { slots: slotsOk, cards: cardsOk });
      if (!slotsOk) log("ERRO: grupo de slots não encontrado", GROUP_SLOTS_CANDIDATES);
      if (!cardsOk) log("ERRO: grupo de cartões não encontrado", GROUP_CARDS_CANDIDATES);
    };

    const resolveMcGroupNames = async () => {
      let slotsOk = "";
      for (const name of MC_GROUP_SLOTS_CANDIDATES) {
        try {
          const r = await tryGetGroupList(name);
          if (r) { slotsOk = name; break; }
        } catch {}
      }

      let cardsOk = "";
      for (const name of MC_GROUP_CARDS_CANDIDATES) {
        try {
          const r = await tryGetGroupList(name);
          if (r) { cardsOk = name; break; }
        } catch {}
      }

      let reservesOk = "";
      for (const name of MC_GROUP_RESERVES_CANDIDATES) {
        try {
          const r = await tryGetGroupList(name);
          if (r) { reservesOk = name; break; }
        } catch {}
      }

      let fxOk = "";
      for (const name of MC_GROUP_FX_CANDIDATES) {
        try {
          const r = await tryGetGroupList(name);
          if (r) { fxOk = name; break; }
        } catch {}
      }

      state.mcGroupSlotsName = slotsOk;
      state.mcGroupCardsName = cardsOk;
      state.mcGroupReservesName = reservesOk;
      state.mcGroupFxName = fxOk;

      log("Grupos resolvidos (MC)", { slots: slotsOk, cards: cardsOk, reserves: reservesOk, fx: fxOk });
      if (!slotsOk) log("ERRO: grupo MC slots não encontrado", MC_GROUP_SLOTS_CANDIDATES);
      if (!cardsOk) log("ERRO: grupo MC cartões não encontrado", MC_GROUP_CARDS_CANDIDATES);
      if (!reservesOk) log("ERRO: grupo MC reservas não encontrado", MC_GROUP_RESERVES_CANDIDATES);
      if (!fxOk) log("ERRO: grupo MC FX não encontrado", MC_GROUP_FX_CANDIDATES);
    };

    const buildUniqueCandidates = (...lists) => {
      const out = [];
      for (const list of lists) {
        for (const name of list || []) {
          const trimmed = String(name || "").trim();
          if (trimmed && !out.includes(trimmed)) out.push(trimmed);
        }
      }
      return out;
    };



const resolveSyncGroupIds = async ({ sceneName, target }) => {
  if (!sceneName) {
    log("[SYNC] ERRO: cena inválida para resolver grupos", { sceneName });
    return null;
  }

  

  const cacheKey = `${sceneName}_${target}`;
  const cache = state.syncTransformCache;
  
  if (cache && cache.key === cacheKey && Date.now() - cache.timestamp < 5000) {
    log("[SYNC] Usando cache válido", { sceneName, target, cacheKey });
    return cache.data;
  }

  

  let baseGroupName, targetGroupName;
  
  if (target === "mc") {
    baseGroupName = state.mcGroupSlotsName;
    targetGroupName = state.mcGroupCardsName;
    log("[SYNC] Modo MC, procurando grupos", { 
      baseGroup: baseGroupName, 
      targetGroup: targetGroupName 
    });
  } else {
    baseGroupName = state.groupSlotsName;
    targetGroupName = state.groupCardsName;
    log("[SYNC] Modo Campo, procurando grupos", { 
      baseGroup: baseGroupName, 
      targetGroup: targetGroupName 
    });
  }

  if (!baseGroupName || !targetGroupName) {
    log("[SYNC] ERRO: nomes de grupo não definidos", { baseGroupName, targetGroupName });
    return null;
  }

  

  let items = [];
  try {
    const list = await state.ws.call("GetSceneItemList", { sceneName });
    items = list?.sceneItems || [];
    log("[SYNC] Itens na cena", { sceneName, count: items.length });
  } catch (err) {
    log("[SYNC] ERRO: falha ao listar itens da cena", { 
      sceneName, 
      err: String(err?.message || err) 
    });
    return null;
  }

  

  const baseItem = items.find(item => 
    item.sourceName === baseGroupName || 
    item.sceneItemName === baseGroupName
  );
  
  const targetItem = items.find(item => 
    item.sourceName === targetGroupName || 
    item.sceneItemName === targetGroupName
  );

  if (!baseItem) {
    log("[SYNC] ERRO: grupo base não encontrado", { 
      sceneName, 
      baseGroupName,
      availableItems: items.map(i => i.sourceName || i.sceneItemName)
    });
    return null;
  }

  if (!targetItem) {
    log("[SYNC] ERRO: grupo alvo não encontrado", { 
      sceneName, 
      targetGroupName,
      availableItems: items.map(i => i.sourceName || i.sceneItemName)
    });
    return null;
  }

  const resolved = {
    sceneName,
    target,
    baseId: baseItem.sceneItemId,
    targetId: targetItem.sceneItemId,
    baseName: baseItem.sourceName || baseItem.sceneItemName || "",
    targetName: targetItem.sourceName || targetItem.sceneItemName || "",
  };
  
  

  state.syncTransformCache = {
    key: cacheKey,
    data: resolved,
    timestamp: Date.now()
  };
  
  log("[SYNC] Grupos resolvidos com sucesso", resolved);
  return resolved;
};



const debugSyncTransform = async () => {
  log("=== DEBUG SYNC TRANSFORM ===");
  
  const target = (el.targetSelect && el.targetSelect.value) ? el.targetSelect.value : state.target;
  const sceneName = state.currentScene || (el.sceneSelect && el.sceneSelect.value) || state.programScene || state.obsProgramScene;
  
  log("Estado atual:", {
    target,
    sceneName,
    currentScene: state.currentScene,
    programScene: state.programScene,
    obsProgramScene: state.obsProgramScene,
    connected: state.connected
  });
  
  if (target === "mc") {
    log("Grupos MC:", {
      mcGroupSlotsName: state.mcGroupSlotsName,
      mcGroupCardsName: state.mcGroupCardsName
    });
  } else {
    log("Grupos Campo:", {
      groupSlotsName: state.groupSlotsName,
      groupCardsName: state.groupCardsName
    });
  }
  
  if (!sceneName) {
    log("ERRO: Nenhuma cena definida");
    return;
  }
  
  try {
    const list = await state.ws.call("GetSceneList");
    log("Cenas disponíveis:", list.scenes.map(s => s.sceneName));
    
    const sceneItems = await state.ws.call("GetSceneItemList", { sceneName });
    log(`Itens na cena ${sceneName}:`, sceneItems.sceneItems.map(item => ({
      name: item.sourceName || item.sceneItemName,
      id: item.sceneItemId,
      isGroup: item.isGroup
    })));
  } catch (err) {
    log("Erro ao obter informações da cena:", err.message);
  }
  
  log("=== FIM DEBUG ===");
};










    

    const enforceCardsAlwaysOnTop = async () => {
      if (!CFG.forceCardsAlwaysOnTop) return;
      if (!state.currentScene || !state.rootCardsGroupId) return;

      try {
        const list = await state.ws.call("GetSceneItemList", { sceneName: state.currentScene });
        const items = (list && list.sceneItems) || [];
        const cardsIt = items.find((x) => x.sceneItemId === state.rootCardsGroupId);
        if (!cardsIt) return;

        const maxIndex = items.length - 1;
        if (cardsIt.sceneItemIndex !== maxIndex) {
          await state.ws.call("SetSceneItemIndex", {
            sceneName: state.currentScene,
            sceneItemId: state.rootCardsGroupId,
            sceneItemIndex: maxIndex,
          });
          log("Z-ORDER: Cartões -> topo absoluto", { index: maxIndex });
        }
      } catch (err) {
        log("ERRO: enforceCardsAlwaysOnTop", { err: String((err && err.status && err.status.comment) || err && err.message || err) });
      }
    };

const enforceMcOverlaysOnTop = async () => {
  if (!CFG.forceCardsAlwaysOnTop) return;
  if (!state.currentScene) return;

  try {
    

    const list = await state.ws.call("GetSceneItemList", { sceneName: state.currentScene });
    const items = (list && list.sceneItems) || [];
    const maxIndex = items.length - 1;

    

    const groupMap = {};
    for (const item of items) {
      if (item.sceneItemId === state.mcRootReservesGroupId) groupMap.reserves = item;
      if (item.sceneItemId === state.mcRootFxGroupId) groupMap.fx = item;
      if (item.sceneItemId === state.mcRootCardsGroupId) groupMap.cards = item;
      if (item.sceneItemId === state.mcRootSlotsGroupId) groupMap.slots = item;
    }

    

    

    

    

    


    

    let adjustmentsMade = false;

    

    if (groupMap.reserves && groupMap.fx && groupMap.fx.sceneItemIndex <= groupMap.reserves.sceneItemIndex) {
      const targetIndex = Math.min(maxIndex, groupMap.reserves.sceneItemIndex + 1);
      await state.ws.call("SetSceneItemIndex", {
        sceneName: state.currentScene,
        sceneItemId: state.mcRootFxGroupId,
        sceneItemIndex: targetIndex,
      });
      adjustmentsMade = true;
      log("Z-ORDER: MC FX ajustado acima das Reservas", { 
        de: groupMap.fx.sceneItemIndex, 
        para: targetIndex 
      });
    }

    

    if (groupMap.cards && groupMap.fx && groupMap.cards.sceneItemIndex <= groupMap.fx.sceneItemIndex) {
      const targetIndex = Math.min(maxIndex, groupMap.fx.sceneItemIndex + 1);
      await state.ws.call("SetSceneItemIndex", {
        sceneName: state.currentScene,
        sceneItemId: state.mcRootCardsGroupId,
        sceneItemIndex: targetIndex,
      });
      adjustmentsMade = true;
      log("Z-ORDER: MC Cartões ajustado acima do FX", { 
        de: groupMap.cards.sceneItemIndex, 
        para: targetIndex 
      });
    }

    

    if (state.mcGroupFxName) {
      try {
        const fxItems = await state.ws.call("GetGroupSceneItemList", { 
          sceneName: state.mcGroupFxName 
        });
        const fxSceneItems = fxItems?.sceneItems || [];
        
        if (fxSceneItems.length > 0) {
          

          const reserveCards = [];    

          const reserveSwaps = [];    

          
          for (const item of fxSceneItems) {
            const sourceName = item.sourceName || "";
            
            

            if (sourceName.includes(CFG.mc.reservePrefix)) {
              if (sourceName.includes(CFG.cardSuffix)) {
                reserveCards.push(item);
              } else if (sourceName.includes(CFG.mc.swapSuffix)) {  

                reserveSwaps.push(item);
              }
            }
          }
          
          

          const sortByNumber = (a, b) => {
            const aNum = parseInt(a.sourceName?.match(/\d+/)?.[0] || "0");
            const bNum = parseInt(b.sourceName?.match(/\d+/)?.[0] || "0");
            return aNum - bNum;
          };
          
          reserveCards.sort(sortByNumber);
          reserveSwaps.sort(sortByNumber);  

          
          

          

          

          
          let currentIndex = 0;
          
          

          for (const item of reserveSwaps) {
            await state.ws.call("SetSceneItemIndex", {
              sceneName: state.mcGroupFxName,
              sceneItemId: item.sceneItemId,
              sceneItemIndex: currentIndex,
            });
            currentIndex++;
            log(`Z-ORDER FX: ${item.sourceName} posicionado em ${currentIndex-1} (FUNDO)`);
          }

          

          for (const item of reserveCards) {
            await state.ws.call("SetSceneItemIndex", {
              sceneName: state.mcGroupFxName,
              sceneItemId: item.sceneItemId,
              sceneItemIndex: currentIndex,
            });
            currentIndex++;
            log(`Z-ORDER FX: ${item.sourceName} posicionado em ${currentIndex-1} (TOPO)`);
          }
          
          if (reserveCards.length > 0 || reserveSwaps.length > 0) {
            log(`Z-ORDER FX: ${reserveCards.length} cards + ${reserveSwaps.length} swaps reorganizados`);
          }
          
          adjustmentsMade = adjustmentsMade || (reserveCards.length > 0) || (reserveSwaps.length > 0);
        }
      } catch (innerErr) {
        log("ERRO: reorganizar itens dentro do grupo FX", { 
          err: String((innerErr && innerErr.status && innerErr.status.comment) || innerErr?.message || innerErr) 
        });
      }
    }

    

    

    if (adjustmentsMade) {
      

      const updatedList = await state.ws.call("GetSceneItemList", { sceneName: state.currentScene });
      const updatedItems = updatedList?.sceneItems || [];
      
      const indexes = {};
      for (const item of updatedItems) {
        if (item.sceneItemId === state.mcRootReservesGroupId) indexes.reserves = item.sceneItemIndex;
        if (item.sceneItemId === state.mcRootFxGroupId) indexes.fx = item.sceneItemIndex;
        if (item.sceneItemId === state.mcRootCardsGroupId) indexes.cards = item.sceneItemIndex;
      }
      
      

      if (indexes.reserves !== undefined && indexes.fx !== undefined && indexes.fx <= indexes.reserves) {
        log("AVISO: Grupo FX ainda não está acima das Reservas após ajuste");
      }
    }

  } catch (err) {
    log("ERRO em enforceMcOverlaysOnTop:", { 
      err: String((err && err.status && err.status.comment) || err?.message || err) 
    });
  }
};

const getSceneOrderPolicy = (sceneItems) => {
  if (!sceneItems || !sceneItems.length) return { topIsMin: false };
  const indices = sceneItems.map((item) => item.sceneItemIndex);
  const minIndex = Math.min(...indices);
  const maxIndex = Math.max(...indices);
  const minPos = sceneItems.findIndex((item) => item.sceneItemIndex === minIndex);
  const maxPos = sceneItems.findIndex((item) => item.sceneItemIndex === maxIndex);
  return { topIsMin: minPos >= 0 && maxPos >= 0 ? minPos < maxPos : false };
};

const ensureCardAboveSwapInScene = async (sceneName, cardItemName, swapItemName) => {
  if (!sceneName || !cardItemName || !swapItemName || !state.ws) return false;

  const list = await listItemsInContainer(sceneName, { context: "ensureCardAboveSwapInScene" });
  const items = list.items || [];
  if (!items.length) return false;

  const cardItem = items.find((item) => item.sourceName === cardItemName);
  const swapItem = items.find((item) => item.sourceName === swapItemName);

  if (!cardItem || !swapItem) return false;

  const { topIsMin } = getSceneOrderPolicy(items);
  const maxIndex = items.length - 1;
  const cardIndex = cardItem.sceneItemIndex;
  const swapIndex = swapItem.sceneItemIndex;
  const cardShouldBeAbove = topIsMin ? cardIndex < swapIndex : cardIndex > swapIndex;

  if (cardShouldBeAbove) return true;

  if (topIsMin) {
    if (swapIndex === 0) {
      await state.ws.call("SetSceneItemIndex", {
        sceneName,
        sceneItemId: swapItem.sceneItemId,
        sceneItemIndex: Math.min(maxIndex, swapIndex + 1),
      });
      await state.ws.call("SetSceneItemIndex", {
        sceneName,
        sceneItemId: cardItem.sceneItemId,
        sceneItemIndex: 0,
      });
    } else {
      await state.ws.call("SetSceneItemIndex", {
        sceneName,
        sceneItemId: cardItem.sceneItemId,
        sceneItemIndex: Math.max(0, swapIndex - 1),
      });
    }
  } else if (swapIndex === maxIndex) {
    await state.ws.call("SetSceneItemIndex", {
      sceneName,
      sceneItemId: swapItem.sceneItemId,
      sceneItemIndex: Math.max(0, swapIndex - 1),
    });
    await state.ws.call("SetSceneItemIndex", {
      sceneName,
      sceneItemId: cardItem.sceneItemId,
      sceneItemIndex: maxIndex,
    });
  } else {
    await state.ws.call("SetSceneItemIndex", {
      sceneName,
      sceneItemId: cardItem.sceneItemId,
      sceneItemIndex: Math.min(maxIndex, swapIndex + 1),
    });
  }

  log("Z-ORDER: item acima do swap", { sceneName, cardItemName, swapItemName, topIsMin });
  return true;
};

const ensureCardAboveSwap = async (sceneNameHint, cardItemName, swapItemName) => {
  if (!sceneNameHint || !cardItemName || !swapItemName || !state.ws) return;

  const scenesToCheck = [
    sceneNameHint,
    state.mcGroupCardsName,
    state.mcGroupFxName,
    state.groupCardsName,
  ].filter(Boolean);

  const uniqueScenes = [...new Set(scenesToCheck)];
  let cardScene = "";
  let swapScene = "";

  for (const sceneName of uniqueScenes) {
    const list = await listItemsInContainer(sceneName, { context: "ensureCardAboveSwap" });
    const items = list.items || [];
    if (!items.length) continue;

    const hasCard = items.some((item) => item.sourceName === cardItemName);
    const hasSwap = items.some((item) => item.sourceName === swapItemName);

    if (hasCard && hasSwap) {
      await ensureCardAboveSwapInScene(sceneName, cardItemName, swapItemName);
      return;
    }

    if (hasCard) cardScene = sceneName;
    if (hasSwap) swapScene = sceneName;
  }

  if (cardScene && swapScene && cardScene !== swapScene) {
    log("Z-ORDER: card e swap em cenas diferentes", { cardItemName, swapItemName, cardScene, swapScene });
  }
};

const syncMcReserveFxOnTransformChange = async (reserveName, transform) => {
  if (!state.mcGroupFxName || !state.mcGroupCardsName || !reserveName) return;
  
  const cardName = `${reserveName}${CFG.cardSuffix}`;
  const swapName = `${reserveName}${CFG.mc.swapSuffix}`;
  
  const cardIt = state.mcReserveCardByName.get(cardName);
  const swapIt = state.mcReserveSwapByName.get(swapName);
  
  

  if (cardIt) {
    await state.ws.call("SetSceneItemTransform", {
      sceneName: state.mcGroupFxName,
      sceneItemId: cardIt.id,
      sceneItemTransform: copyTransformSafe(transform),
    });
  }
  
  if (swapIt) {
    await state.ws.call("SetSceneItemTransform", {
      sceneName: state.mcGroupCardsName,
      sceneItemId: swapIt.id,
      sceneItemTransform: copyTransformSafe(transform),
    });
  }
};

    

const syncField = async () => {
  log("SYNC: Campo (Completo + Leitura)");
  await resolveFieldGroupNames();
  log("[SYNC] Alinhando grupos pai (Campo)...");
  await syncGroupTransforms();
  
  

  if (!state.groupSlotsName || !state.groupCardsName) {
    log("❌ SYNC ERRO: Grupos do campo não encontrados", {
      slots: state.groupSlotsName,
      cards: state.groupCardsName
    });
    return;
  }

  

  try {
    

    const [slotsRes, cardsRes] = await Promise.all([
      state.ws.call("GetGroupSceneItemList", { sceneName: state.groupSlotsName }).catch(() => ({ sceneItems: [] })),
      state.ws.call("GetGroupSceneItemList", { sceneName: state.groupCardsName }).catch(() => ({ sceneItems: [] }))
    ]);

    const slotsItems = slotsRes.sceneItems || [];
    const cardsItems = cardsRes.sceneItems || [];

    

    state.slotByName.clear();
    state.slotById.clear();
    state.cardByName.clear();

    

    const slotRe = new RegExp(`^${CFG.slotPrefix}\\d{2}$`, 'i'); 

    const cardRe = new RegExp(`^${CFG.slotPrefix}\\d{2}${CFG.cardSuffix}$`, 'i'); 


    

    for (const item of slotsItems) {
      const sourceName = item.sourceName || "";
      if (slotRe.test(sourceName)) {
        state.slotByName.set(sourceName, { 
          id: item.sceneItemId, 
          enabled: !!item.sceneItemEnabled 
        });
        state.slotById.set(item.sceneItemId, sourceName);
        log("[SYNC] Slot mapeado", { sourceName, id: item.sceneItemId });
      }
    }

    

    for (const item of cardsItems) {
      const sourceName = item.sourceName || "";
      if (cardRe.test(sourceName)) {
        state.cardByName.set(sourceName, { 
          id: item.sceneItemId, 
          enabled: !!item.sceneItemEnabled 
        });
        log("[SYNC] Cartão mapeado", { sourceName, id: item.sceneItemId });
      }
    }

    

    const [slotsGroupIdRes, cardsGroupIdRes] = await Promise.all([
      state.ws.call("GetSceneItemId", { 
        sceneName: state.currentScene, 
        sourceName: state.groupSlotsName 
      }).catch(() => ({ sceneItemId: null })),
      state.ws.call("GetSceneItemId", { 
        sceneName: state.currentScene, 
        sourceName: state.groupCardsName 
      }).catch(() => ({ sceneItemId: null }))
    ]);

    state.rootSlotsGroupId = slotsGroupIdRes.sceneItemId || null;
    state.rootCardsGroupId = cardsGroupIdRes.sceneItemId || null;

    log("[SYNC] IDs de grupos obtidos", {
      rootSlotsGroupId: state.rootSlotsGroupId,
      rootCardsGroupId: state.rootCardsGroupId
    });

  } catch (err) {
    log("❌ Erro no mapeamento do Campo", { err: String(err?.message || err) });
  }

  

  const fileRequests = [];
  for (let i = 1; i <= CFG.slotCount; i++) {
    const name = getSlotName(i);
    fileRequests.push(
      state.ws.call("GetInputSettings", { inputName: name })
        .then(res => ({ name, file: res.inputSettings?.file || "" }))
        .catch(() => ({ name, file: "" }))
    );
  }

  const results = await Promise.all(fileRequests);

  results.forEach(res => {
    const cleanName = cleanPlayerName(res.file);
    state.slots[res.name] = res.file ? { playerName: cleanName, file: res.file } : null;
  });

  persistSlotState();
  renderSlotSelect();
  
  

  for (let i = 1; i <= CFG.slotCount; i++) {
    const slotNameValue = getSlotName(i);
    await syncSlotWithOverlays(slotNameValue, false).catch(() => {});
  }
  
  log("✅ SYNC: Campo OK (IDs e Nomes atualizados)");
};

const applySwapFxAssetMC = async () => {
  if (!state.connected) return;
  
  try {
    

    for (let i = 1; i <= CFG.mc.slotCount; i++) {
      const slotName = mcSlotName(i);
      const swapName = `${slotName}${CFG.mc.swapSuffix}`;
      
      

      const exists = state.mcSlotSwapByName.has(swapName);
      
      if (!exists) {
        log(`Criando swap FX para ${slotName}`);
        

      }
    }
    
    

    for (let i = 1; i <= CFG.mc.reserveCount; i++) {
      const reserveName = mcReserveName(i);
      const swapName = `${reserveName}${CFG.mc.swapSuffix}`;
      
      const exists = state.mcReserveSwapByName.has(swapName);
      
      if (!exists) {
        log(`Criando swap FX para ${reserveName}`);
        

      }
    }
  } catch (err) {
    log("ERRO em applySwapFxAssetMC:", err?.message || err);
  }
};

const syncMc = async () => {
  log("🔁 SYNC: MC (Completo + Leitura)...");
  await resolveMcGroupNames();
  log("[SYNC] Alinhando grupos pai (MC)...");
  await syncGroupTransforms();

  if (!state.mcGroupSlotsName || !state.mcGroupCardsName) {
    log("❌ SYNC ERRO: Grupos essenciais do MC não encontrados.");
    return;
  }

  const getStandardKey = (sourceName, prefix) => {
    const match = sourceName.match(/(\d{2})/);
    return match ? `${prefix}${match[1]}` : sourceName;
  };

  

  try {
      

      const slotsList = await state.ws.call("GetGroupSceneItemList", { sceneName: state.mcGroupSlotsName }).catch(()=>({}));
      const cardsList = await state.ws.call("GetGroupSceneItemList", { sceneName: state.mcGroupCardsName }).catch(()=>({}));
      const reservesList = await state.ws.call("GetGroupSceneItemList", { sceneName: state.mcGroupReservesName }).catch(()=>({}));
      const fxList = await state.ws.call("GetGroupSceneItemList", { sceneName: state.mcGroupFxName }).catch(()=>({}));

      

      state.mcSlotByName.clear(); state.mcSlotById.clear();
      state.mcCardByName.clear(); state.mcSlotSwapByName.clear();
      state.mcReserveByName.clear(); state.mcReserveById.clear(); 
      state.mcReserveCardByName.clear(); state.mcReserveSwapByName.clear();

      

      const slotRe = new RegExp(`^${CFG.mc.slotPrefix}\\d{2}$`, 'i');
      const cardRe = new RegExp(`^${CFG.mc.slotPrefix}\\d{2}${CFG.cardSuffix}$`, 'i');
      const slotSwapRe = new RegExp(`^${CFG.mc.slotPrefix}(\\d{2})${CFG.mc.swapSuffix}$`, 'i');
      
      const reserveRe = new RegExp(`^${CFG.mc.reservePrefix}\\d{2}$`, 'i');
      const resCardRe = new RegExp(`^${CFG.mc.reservePrefix}\\d{2}${CFG.cardSuffix}$`, 'i');
      const resSwapRe = new RegExp(`^${CFG.mc.reservePrefix}(\\d{2})${CFG.mc.swapSuffix}$`, 'i');

      

      for (const it of (slotsList.sceneItems || [])) {
        if (slotRe.test(it.sourceName)) {
          const key = getStandardKey(it.sourceName, CFG.mc.slotPrefix);
          state.mcSlotByName.set(key, { id: it.sceneItemId, enabled: !!it.sceneItemEnabled });
          state.mcSlotById.set(it.sceneItemId, key);
        }
      }



for (const it of (cardsList.sceneItems || [])) {
  const sourceName = it.sourceName || "";
  
  if (cardRe.test(sourceName)) {
    const baseKey = getStandardKey(sourceName, CFG.mc.slotPrefix);
    state.mcCardByName.set(`${baseKey}${CFG.cardSuffix}`, { 
      id: it.sceneItemId, 
      enabled: !!it.sceneItemEnabled 
    });
  } 
  

  else if (sourceName.includes(CFG.mc.slotPrefix) && sourceName.includes(CFG.mc.swapSuffix)) {
    const baseKey = getStandardKey(sourceName, CFG.mc.slotPrefix);
    state.mcSlotSwapByName.set(`${baseKey}${CFG.mc.swapSuffix}`, { 
      id: it.sceneItemId, 
      enabled: !!it.sceneItemEnabled 
    });
    log("[SYNC] Mapeado swap de slot", { 
      sourceName, 
      baseKey, 
      id: it.sceneItemId 
    });
  }
}

      

      if (reservesList.sceneItems) {
         for (const it of reservesList.sceneItems) {
            if (reserveRe.test(it.sourceName)) {
               const key = getStandardKey(it.sourceName, CFG.mc.reservePrefix);
               state.mcReserveByName.set(key, { id: it.sceneItemId, enabled: !!it.sceneItemEnabled });
               state.mcReserveById.set(it.sceneItemId, key);
            }
         }
      }

      

      if (fxList.sceneItems) {
        for (const it of fxList.sceneItems) {
           if (resCardRe.test(it.sourceName)) {
              const baseKey = getStandardKey(it.sourceName, CFG.mc.reservePrefix);
              state.mcReserveCardByName.set(`${baseKey}${CFG.cardSuffix}`, { id: it.sceneItemId, enabled: !!it.sceneItemEnabled });
           } else if (resSwapRe.test(it.sourceName)) {
              const baseKey = getStandardKey(it.sourceName, CFG.mc.reservePrefix);
              state.mcReserveSwapByName.set(`${baseKey}${CFG.mc.swapSuffix}`, { id: it.sceneItemId, enabled: !!it.sceneItemEnabled });
           }
        }
      }

  } catch (e) { log("Erro mapeamento IDs MC", e); }

  

  const fileRequests = [];
  for (let i = 1; i <= CFG.mc.slotCount; i++) {
     const name = mcSlotName(i);
     fileRequests.push(state.ws.call("GetInputSettings", { inputName: name }).then(res => ({
         name, type: 'slot', file: res.inputSettings?.file || "" 
     })).catch(() => ({ name, type: 'slot', file: "" })));
  }
  for (let i = 1; i <= CFG.mc.reserveCount; i++) {
     const name = mcReserveName(i);
     fileRequests.push(state.ws.call("GetInputSettings", { inputName: name }).then(res => ({
         name, type: 'reserve', file: res.inputSettings?.file || "" 
     })).catch(() => ({ name, type: 'reserve', file: "" })));
  }

  const results = await Promise.all(fileRequests);
  results.forEach(res => {
      const cleanName = cleanPlayerName(res.file);
      const data = res.file ? { playerName: cleanName, file: res.file } : null;
      if (res.type === 'slot') state.slots[res.name] = data;
      else state.reserves[res.name] = data;
  });

  persistSlotState(); persistReserveState();
  renderSlotSelect(); renderReserveSelect();

  invalidateMcItemCache("syncMc");
  await syncGoalBalls({ context: "syncMc" });

  log(`✅ SYNC MC: OK.`);
};

    const syncAll = async () => {
      if (state.target === "mc") return syncMc();
      return syncField();
    };

const syncGroupTransforms = async () => {
  if (!state.connected || !state.ws) {
    log("[SYNC] ERRO: sem conexão WS");
    if (el.actionsHint) el.actionsHint.textContent = "Sync Transform falhou: sem conexão.";
    return false;
  }
  
  const target = (el.targetSelect && el.targetSelect.value) ? el.targetSelect.value : state.target;
  const sceneName = state.currentScene || (el.sceneSelect && el.sceneSelect.value) || state.programScene || state.obsProgramScene;
  
  if (!sceneName) {
    log("[SYNC] ERRO: cena não definida");
    if (el.actionsHint) el.actionsHint.textContent = "Sync Transform falhou: cena não definida.";
    return;
  }

  log("[SYNC] Iniciando sync", { sceneName, target });

  

  if (target === "mc") {
    await resolveMcGroupNames();
  } else {
    await resolveFieldGroupNames();
  }

  const ids = await resolveSyncGroupIds({ sceneName, target });
  if (!ids) {
    if (el.actionsHint) el.actionsHint.textContent = "Sync Transform falhou: grupos não encontrados.";
    return;
  }

  log("[SYNC] Grupos encontrados", {
    base: ids.baseName,
    baseId: ids.baseId,
    target: ids.targetName,
    targetId: ids.targetId
  });

  let baseTransform;
  try {
    const tr = await state.ws.call("GetSceneItemTransform", {
      sceneName,
      sceneItemId: ids.baseId,
    });
    baseTransform = tr?.sceneItemTransform;
    log("[SYNC] Transformação lida do grupo base", baseTransform);
    
    

    if (baseTransform && baseTransform.boundsType !== undefined) {
      log("[SYNC] Tipo de boundsType:", {
        valor: baseTransform.boundsType,
        tipo: typeof baseTransform.boundsType
      });
    }
  } catch (err) {
    log("[SYNC] ERRO: GetSceneItemTransform", { 
      err: String(err?.status?.comment || err?.message || err),
      sceneName,
      baseId: ids.baseId
    });
    if (el.actionsHint) el.actionsHint.textContent = "Sync Transform falhou ao ler transformação base.";
    return;
  }

  if (!baseTransform) {
    log("[SYNC] ERRO: transform base vazio", { sceneName, baseId: ids.baseId });
    if (el.actionsHint) el.actionsHint.textContent = "Sync Transform falhou: transformação base vazia.";
    return;
  }

  try {
    const safeTr = copyTransformSafe(baseTransform);
    log("[SYNC] Aplicando transformação sanitizada", safeTr);
    
    

    log("[SYNC] Tipo de boundsType após sanitização:", {
      valor: safeTr.boundsType,
      tipo: typeof safeTr.boundsType
    });

    const result = await state.ws.call("SetSceneItemTransform", {
      sceneName,
      sceneItemId: ids.targetId,
      sceneItemTransform: safeTr,
    });
    
    log("[SYNC] Transformação aplicada com sucesso", { result });
    
    

    if (el.actionsHint) {
      el.actionsHint.textContent = `✓ Transform sincronizado (${target === "mc" ? "MC" : "Campo"})`;
      

      setTimeout(() => {
        if (el.actionsHint) el.actionsHint.textContent = "Pronto";
      }, 3000);
    }
    
  } catch (err) {
    log("[SYNC] ERRO: SetSceneItemTransform", { 
      err: String(err?.status?.comment || err?.message || err),
      sceneName,
      targetId: ids.targetId,
      detalhes: err?.status
    });
    
    if (el.actionsHint) {
      el.actionsHint.textContent = `Erro ao aplicar transformação: ${err?.status?.comment || err?.message || 'Erro desconhecido'}`;
    }
  }
};





const syncSlotWithOverlays = async (entityName, isMc = false) => {
  if (!state.connected || !state.ws) return;

  

  let parentGroupName = "";
  let cardGroupName = ""; 
  
  

  const potentialSwapGroups = [];

  if (isMc) {
    if (isMcReserveId(entityName)) {
      parentGroupName = state.mcGroupReservesName;
      cardGroupName = state.mcGroupFxName;
      potentialSwapGroups.push(state.mcGroupCardsName, state.mcGroupFxName);
    } else {
      parentGroupName = state.mcGroupSlotsName;
      cardGroupName = state.mcGroupCardsName;
      potentialSwapGroups.push(state.mcGroupCardsName, state.mcGroupFxName);
    }
  } else {
    parentGroupName = state.groupSlotsName;
    cardGroupName = state.groupCardsName;
    potentialSwapGroups.push(state.groupCardsName);
  }

  if (!parentGroupName || !cardGroupName) return;

  try {
    

    const parentItem = await resolveSceneItem(parentGroupName, entityName);
    if (!parentItem) return;

    const parentRes = await state.ws.call("GetSceneItemTransform", {
      sceneName: parentGroupName,
      sceneItemId: parentItem.sceneItemId,
    }).catch(() => null);

    if (!parentRes?.sceneItemTransform) return;
    const parentTr = parentRes.sceneItemTransform; 


    

    const applySyncToChild = async (childItem, childGroupName) => {
        if (!childItem) return;

        

        

        let offsetX = 0;
        let offsetY = 0;

        if (parentGroupName !== childGroupName && state.currentScene) {
            try {
                

                const [pGroupTr, cGroupTr] = await Promise.all([
                    state.ws.call("GetSceneItemTransform", { sceneName: state.currentScene, sceneItemId: state.mcRootReservesGroupId   }).catch(()=>null),
                    state.ws.call("GetSceneItemTransform", { sceneName: state.currentScene, sceneItemId: state.mcRootCardsGroupId   }).catch(()=>null)
                ]);

                

                

                const sceneItems = await state.ws.call("GetSceneItemList", { sceneName: state.currentScene });
                const rootItems = sceneItems.sceneItems || [];
                
                const pGroup = rootItems.find(i => i.sourceName === parentGroupName);
                const cGroup = rootItems.find(i => i.sourceName === childGroupName);

                if (pGroup && cGroup) {
                    const [pTr, cTr] = await Promise.all([
                        state.ws.call("GetSceneItemTransform", { sceneName: state.currentScene, sceneItemId: pGroup.sceneItemId }),
                        state.ws.call("GetSceneItemTransform", { sceneName: state.currentScene, sceneItemId: cGroup.sceneItemId })
                    ]);
                    
                    

                    

                    

                    offsetX = (pTr.sceneItemTransform.positionX || 0) - (cTr.sceneItemTransform.positionX || 0);
                    offsetY = (pTr.sceneItemTransform.positionY || 0) - (cTr.sceneItemTransform.positionY || 0);
                }
            } catch (err) {
               

               

            }
        }

        

        const targetTransform = copyTransformSafe(parentTr);
        targetTransform.positionX = (Number(parentTr.positionX) || 0) + offsetX;
        targetTransform.positionY = (Number(parentTr.positionY) || 0) + offsetY;

        

        await state.ws.call("SetSceneItemTransform", {
            sceneName: childGroupName,
            sceneItemId: childItem.sceneItemId,
            sceneItemTransform: targetTransform,
        });
    };

    

    const cardName = `${entityName}${CFG.cardSuffix}`;
    const cardItem = await resolveSceneItem(cardGroupName, cardName);
    if (cardItem) {
        await applySyncToChild(cardItem, cardGroupName);
    }

    

    if (isMc) {
      const swapName = `${entityName}${CFG.mc.swapSuffix}`;
      
      

      for (const group of potentialSwapGroups) {
          const swapItem = await resolveSceneItem(group, swapName);
          if (swapItem) {
              

              await applySyncToChild(swapItem, group);
              break; 
          }
      }

      

      if (hasMcGoalBall(entityName)) {
        await ensureBallTransformFollows(entityName);
      }
    }

  } catch (err) {
    log("[SYNC] Erro ao sincronizar item individual", { entityName, err: err.message });
  }
};



const syncIndividualCardPositions = async () => {
  if (!state.connected || !state.ws) {
    log("[SYNC] ERRO: sem conexão WS para sync individual");
    return;
  }

  const isMc = state.target === "mc";
  const slotsGroupName = isMc ? state.mcGroupSlotsName : state.groupSlotsName;
  const cardsGroupName = isMc ? state.mcGroupCardsName : state.groupCardsName;
  const slotPrefix = isMc ? CFG.mc.slotPrefix : CFG.slotPrefix;
  const slotCount = isMc ? CFG.mc.slotCount : CFG.slotCount;
  const cardSuffix = CFG.cardSuffix;

  if (!slotsGroupName || !cardsGroupName) {
    log("[SYNC] ERRO: grupos não definidos para sync individual", {
      isMc,
      slotsGroupName,
      cardsGroupName
    });
    return;
  }

  log("[SYNC] Iniciando sync individual de posições", {
    isMc,
    slotsGroup: slotsGroupName,
    cardsGroup: cardsGroupName,
    slotCount
  });

  setBusy(true);

  try {
    

    const [slotsList, cardsList] = await Promise.all([
      state.ws.call("GetGroupSceneItemList", { sceneName: slotsGroupName }),
      state.ws.call("GetGroupSceneItemList", { sceneName: cardsGroupName })
    ]);

    const slotsItems = slotsList?.sceneItems || [];
    const cardsItems = cardsList?.sceneItems || [];

    log("[SYNC] Itens encontrados", {
      slots: slotsItems.length,
      cards: cardsItems.length
    });

    

    const slotMap = new Map();
    const cardMap = new Map();

    slotsItems.forEach(item => {
      if (item.sourceName) slotMap.set(item.sourceName, item);
    });

    cardsItems.forEach(item => {
      if (item.sourceName) cardMap.set(item.sourceName, item);
    });

    

    for (let i = 1; i <= slotCount; i++) {
      const slotName = `${slotPrefix}${pad2(i)}`;
      const cardName = `${slotName}${cardSuffix}`;

      const slotItem = slotMap.get(slotName);
      const cardItem = cardMap.get(cardName);

      if (!slotItem || !cardItem) {
        log("[SYNC] Item não encontrado", { slotName, hasSlot: !!slotItem, cardName, hasCard: !!cardItem });
        continue;
      }

      try {
        

        const slotTransform = await state.ws.call("GetSceneItemTransform", {
          sceneName: slotsGroupName,
          sceneItemId: slotItem.sceneItemId,
        });

        if (!slotTransform?.sceneItemTransform) {
          log("[SYNC] ERRO: sem transformação para slot", { slotName });
          continue;
        }

        const safeTransform = copyTransformSafe(slotTransform.sceneItemTransform);

        

        await state.ws.call("SetSceneItemTransform", {
          sceneName: cardsGroupName,
          sceneItemId: cardItem.sceneItemId,
          sceneItemTransform: safeTransform,
        });

        log("[SYNC] Cartão sincronizado", { slotName, cardName });

      } catch (err) {
        log("[SYNC] ERRO ao sincronizar item", {
          slotName,
          cardName,
          err: String(err?.message || err)
        });
      }
    }

    log("[SYNC] Sync individual concluído com sucesso");

  } catch (err) {
    log("[SYNC] ERRO fatal no sync individual", {
      err: String(err?.message || err)
    });
  } finally {
    setBusy(false);
  }
};


const syncAllComplete = async () => {
  if (!state.connected || !state.ws) return;

  setBusy(true);
  try {
    

    if (state.target === "mc") {
      await syncMc();
      
      

      for (let i = 1; i <= CFG.mc.slotCount; i++) {
        await syncSlotWithOverlays(mcSlotName(i), true);
      }

      

      

      for (let i = 1; i <= CFG.mc.reserveCount; i++) {
        await syncSlotWithOverlays(mcReserveName(i), true);
      }
      
    } else {
      await syncField();
      
      

      for (let i = 1; i <= CFG.slotCount; i++) {
        await syncSlotWithOverlays(getSlotName(i), false);
      }
    }

    

    if (state.target === "mc") {
      await mcScoreboardEnsureObsBindings();
      await mcScoreboardApplyAll();
    }

    

    setupTransformListeners();

    log("[SYNC] Sync completo concluído");
  } catch (err) {
    log("[SYNC] ERRO no sync completo", { err: String(err?.message || err) });
  } finally {
    setBusy(false);
  }
};



const syncSingleCardPosition = async (slotName) => {
  if (!state.connected || !state.ws || !slotName) return;

  const isMc = state.target === "mc";
  const slotsGroupName = isMc ? state.mcGroupSlotsName : state.groupSlotsName;
  const cardsGroupName = isMc ? state.mcGroupCardsName : state.groupCardsName;
  const cardSuffix = CFG.cardSuffix;
  const cardName = `${slotName}${cardSuffix}`;

  if (!slotsGroupName || !cardsGroupName) {
    log("[SYNC] ERRO: grupos não definidos para sync single");
    return;
  }

  try {
    

    const slotIdResult = await state.ws.call("GetSceneItemId", {
      sceneName: slotsGroupName,
      sourceName: slotName,
    }).catch(() => null);

    if (!slotIdResult?.sceneItemId) {
      log("[SYNC] ERRO: slot não encontrado", { slotName });
      return;
    }

    

    const cardIdResult = await state.ws.call("GetSceneItemId", {
      sceneName: cardsGroupName,
      sourceName: cardName,
    }).catch(() => null);

    if (!cardIdResult?.sceneItemId) {
      log("[SYNC] ERRO: cartão não encontrado", { cardName });
      return;
    }

    

    const slotTransform = await state.ws.call("GetSceneItemTransform", {
      sceneName: slotsGroupName,
      sceneItemId: slotIdResult.sceneItemId,
    });

    if (!slotTransform?.sceneItemTransform) {
      log("[SYNC] ERRO: sem transformação para slot", { slotName });
      return;
    }

    const safeTransform = copyTransformSafe(slotTransform.sceneItemTransform);

    

    await state.ws.call("SetSceneItemTransform", {
      sceneName: cardsGroupName,
      sceneItemId: cardIdResult.sceneItemId,
      sceneItemTransform: safeTransform,
    });

    log("[SYNC] Cartão individual sincronizado", { slotName, cardName });

  } catch (err) {
    log("[SYNC] ERRO ao sincronizar cartão individual", {
      slotName,
      cardName,
      err: String(err?.message || err)
    });
  }
};





const setupTransformListeners = () => {
  if (!state.connected || !state.ws) return;
  
  

  state.wsEventHandlers = state.wsEventHandlers.filter(h => 
    !h.name || (h.name !== 'transformListener' && h.name !== 'selectionListener')
  );
  
  

  const transformListener = (eventData) => {
    try {
      if (!eventData || eventData.eventType !== 'SceneItemTransformChanged') return;
      
      const sceneName = eventData.sceneName;
      const itemId = eventData.sceneItemId;
      
      

      if (sceneName === state.mcGroupSlotsName) {
         const slotName = state.mcSlotById.get(itemId);
         if (slotName) {
            

            setTimeout(() => {
               if (state.connected) {
                  

                  syncSlotWithOverlays(slotName, true).catch(() => {});
               }
            }, 100);
         }
      }
      

      else if (sceneName === state.mcGroupReservesName) {
        const reserveName = state.mcReserveById.get(itemId);
        if (reserveName) {
          setTimeout(() => {
            if (state.connected) {
               syncSlotWithOverlays(reserveName, true).catch(() => {});
            }
          }, 100);
        }
      }
      

      else if (sceneName === state.groupSlotsName) {
        const slotName = state.slotById.get(itemId);
        if (slotName) {
          setTimeout(() => {
            if (state.connected) {
              syncSlotWithOverlays(slotName, false).catch(() => {});
            }
          }, 100);
        }
      }
      
    } catch (err) {
      log("[TRANSFORM LISTENER] ERRO", { err: String(err?.message || err) });
    }
  };
  
  transformListener.name = 'transformListener';
  state.wsEventHandlers.push(transformListener);
  
  

  ensureWsEventMultiplexer();
  
  log("[SYNC] Listeners de transformação configurados com sucesso (FIX SWAP)");
};

const setCard = async (color) => {
  const ctx = getCardContext();
  if (!ctx) throw new Error("Seleção inválida para cartão");

  setBusy(true);

  const selection = getActiveSelection();

  let who = "";

  if (selection && selection.name) {
    const cached = selection.kind === "reserve"
      ? state.reserves[selection.name]
      : state.slots[selection.name];

    if (cached && cached.playerName) {
      who = cached.playerName;
    } else {
      who = resolveToastTargetName(selection);
    }
  }

  if (!who) who = "Jogador";

  const isYellow = color === "yellow";
  const toastPayload = {
    type: isYellow ? "YC" : "RC",
    ttlMs: isYellow ? CFG.toast.ttlYellowMs : CFG.toast.ttlRedMs,
    textLine1: isYellow ? "CARTÃO AMARELO" : "EXPULSÃO",
    textLine2: who,
    who: who,
    slotId: selection ? selection.name : "",
    target: selection ? selection.kind : "",
  };

  try {
    const cardInput = `${ctx.slotName}${CFG.cardSuffix}`;
    const cardIt = ctx.cardMap.get(cardInput);
    if (!cardIt) throw new Error(`Card não encontrado: ${cardInput}`);

    const file = ctx.cardFiles[color];
    if (!file) throw new Error(`Arquivo de cartão não configurado`);

    log("ACTION: add card", { slot: ctx.slotName, color, who });

    const slotItem = await resolveSceneItem(ctx.sourceGroupName, ctx.slotName, { forceRefresh: true });

    if (slotItem) {
      const slotTr = await state.ws.call("GetSceneItemTransform", {
        sceneName: ctx.sourceGroupName,
        sceneItemId: slotItem.sceneItemId
      });

      if (slotTr && slotTr.sceneItemTransform) {
        await state.ws.call("SetSceneItemTransform", {
          sceneName: ctx.cardGroupName,
          sceneItemId: cardIt.id,
          sceneItemTransform: copyTransformSafe(slotTr.sceneItemTransform)
        });
      }
    }

    await state.ws.call("SetInputSettings", {
      inputName: cardInput,
      inputSettings: { file: resolveProjectPath(file) },
      overlay: true,
    });

    await state.ws.call("SetSceneItemEnabled", {
      sceneName: ctx.cardGroupName,
      sceneItemId: cardIt.id,
      sceneItemEnabled: true,
    });

    cardIt.enabled = true;
    ctx.cardMap.set(cardInput, cardIt);

    if (state.target === "mc") {
      const swapName = `${ctx.slotName}${CFG.mc.swapSuffix}`;
      ensureCardAboveSwap(ctx.cardGroupName, cardInput, swapName).catch(() => {});
    }

    updateSelectionIndicators("card");

  } catch (err) {
    log("ERRO ao aplicar cartão:", err.message);
  } finally {
    enqueueToast(toastPayload);
    setBusy(false);
  }
};

    const removeCard = async () => {
      const ctx = getCardContext();
      if (!ctx) throw new Error("Seleção inválida para cartão");

      const cardName = `${ctx.slotName}${CFG.cardSuffix}`;
      const cardIt = ctx.cardMap.get(cardName);
      if (!cardIt) throw new Error(`Card não encontrado: ${cardName}`);

      log("ACTION: remove card", { slot: ctx.slotName });

      await state.ws.call("SetSceneItemEnabled", {
        sceneName: ctx.cardGroupName,
        sceneItemId: cardIt.id,
        sceneItemEnabled: false,
      });

      cardIt.enabled = false;
      ctx.cardMap.set(cardName, cardIt);
      updateSelectionIndicators("remove");
    };

const clearCardsInCurrentMode = async () => {
  log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  log("🧹 CLEAR: INICIANDO LIMPEZA COMPLETA");
  log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  
  if (!state.connected) {
    log("❌ CLEAR ERRO: Não conectado");
    alert("Erro: Não conectado ao OBS.");
    return;
  }

  setBusy(true);
  
  try {
    const disableSceneItem = async ({ primaryGroup, fallbackGroup, itemId, name }) => {
      if (!itemId) return;
      if (!primaryGroup) {
        if (!fallbackGroup) throw new Error(`Grupo não definido para ${name || "item"}`);
        await state.ws.call("SetSceneItemEnabled", {
          sceneName: fallbackGroup,
          sceneItemId: itemId,
          sceneItemEnabled: false
        });
        return;
      }

      try {
        await state.ws.call("SetSceneItemEnabled", {
          sceneName: primaryGroup,
          sceneItemId: itemId,
          sceneItemEnabled: false
        });
      } catch (err) {
        if (!fallbackGroup || fallbackGroup === primaryGroup) throw err;
        log("CLEAR: tentando fallback para", { name, fallbackGroup });
        await state.ws.call("SetSceneItemEnabled", {
          sceneName: fallbackGroup,
          sceneItemId: itemId,
          sceneItemEnabled: false
        });
      }
    };

    if (state.target === "mc") {
      log("CLEAR: Modo Match Center");
      
      

      log(`CLEAR: ${state.mcCardByName.size} cartões de slot...`);
      for (const [name, it] of state.mcCardByName.entries()) {
        if (!it?.id) { log(`CLEAR: Skip ${name} (sem ID)`); continue; }
        await disableSceneItem({
          primaryGroup: state.mcGroupCardsName,
          fallbackGroup: state.mcGroupFxName,
          itemId: it.id,
          name
        });
        it.enabled = false; state.mcCardByName.set(name, it);
        log(`CLEAR: ✓ ${name} desabilitado`);
      }
      
      

      log(`CLEAR: ${state.mcSlotSwapByName.size} swaps de slot...`);
      for (const [name, it] of state.mcSlotSwapByName.entries()) {
        if (!it?.id) { log(`CLEAR: Skip ${name} (sem ID)`); continue; }
        await disableSceneItem({
          primaryGroup: state.mcGroupCardsName,
          fallbackGroup: state.mcGroupFxName,
          itemId: it.id,
          name
        });
        it.enabled = false; state.mcSlotSwapByName.set(name, it);
        log(`CLEAR: ✓ ${name} desabilitado`);
      }
      
      

      log(`CLEAR: ${state.mcReserveCardByName.size} cartões de reserva...`);
      for (const [name, it] of state.mcReserveCardByName.entries()) {
        if (!it?.id) { log(`CLEAR: Skip ${name} (sem ID)`); continue; }
        await disableSceneItem({
          primaryGroup: state.mcGroupFxName,
          fallbackGroup: state.mcGroupCardsName,
          itemId: it.id,
          name
        });
        it.enabled = false; state.mcReserveCardByName.set(name, it);
        log(`CLEAR: ✓ ${name} desabilitado`);
      }
      
      

      log(`CLEAR: ${state.mcReserveSwapByName.size} swaps de reserva...`);
      for (const [name, it] of state.mcReserveSwapByName.entries()) {
        if (!it?.id) { log(`CLEAR: Skip ${name} (sem ID)`); continue; }
        await disableSceneItem({
          primaryGroup: state.mcGroupCardsName,
          fallbackGroup: state.mcGroupFxName,
          itemId: it.id,
          name
        });
        it.enabled = false; state.mcReserveSwapByName.set(name, it);
        log(`CLEAR: ✓ ${name} desabilitado`);
      }

      await clearAllBalls({ resetState: true });
      
      log("CLEAR: ✓ Match Center limpo com sucesso");
    } else {
      log("CLEAR: Modo Campo");
      
      log(`CLEAR: ${state.cardByName.size} cartões...`);
      for (const [name, it] of state.cardByName.entries()) {
        if (!it?.id) { log(`CLEAR: Skip ${name} (sem ID)`); continue; }
        await state.ws.call("SetSceneItemEnabled", { 
          sceneName: state.groupCardsName, 
          sceneItemId: it.id, 
          sceneItemEnabled: false 
        });
        it.enabled = false; state.cardByName.set(name, it);
        log(`CLEAR: ✓ ${name} desabilitado`);
      }
      
      log("CLEAR: ✓ Campo limpo com sucesso");
    }
    
    updateSelectionIndicators("clearAll");
    log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    log("✅ CLEAR: CONCLUÍDO COM SUCESSO");
    log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  } catch (err) {
    log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    log("❌ CLEAR ERRO:", String(err?.message || err));
    log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    alert(`Erro ao limpar: ${err?.message || err}`);
  } finally {
    setBusy(false);
  }
};



const inferCardColor = (filePath, cardFiles) => {
  if (!filePath || !cardFiles) return "";
  const getBase = (p) => String(p || "").split(/[\\/]/).pop().toLowerCase();
  
  const fileName = getBase(filePath);
  

  const yellowName = cardFiles.yellow ? getBase(cardFiles.yellow) : "amarelo";
  const redName = cardFiles.red ? getBase(cardFiles.red) : "vermelho";

  if (fileName === yellowName) return "yellow";
  if (fileName === redName) return "red";
  if (fileName.includes("amarelo")) return "yellow";
  if (fileName.includes("vermelho")) return "red";
  
  return "";
};



const openCardSelectModal = async (color) => {
  if (!el.cardModal) return;

  

  const head = el.cardModal.querySelector(".modalHead");
  if (head) {
    head.classList.remove("head-yellow", "head-red");
    head.classList.add(color === "yellow" ? "head-yellow" : "head-red");
  }
  
  if (el.cardModalTitle) {
    el.cardModalTitle.textContent = color === "yellow" ? "Aplicar Cartão Amarelo" : "Aplicar Cartão Vermelho";
  }

  setBusy(true);

  try {
    const isMc = state.target === "mc";
    
    

    if (el.cardPlayerList) el.cardPlayerList.innerHTML = "";

    

    const createHeader = (text) => {
      const div = document.createElement("div");
      div.className = "list-section-header";
      div.textContent = text;
      return div;
    };

    const createCardItem = (id, entry, typeLabel) => {
      const name = entry && entry.playerName ? entry.playerName : "Vazio / Sem Nome";
      const fileInfo = entry && entry.file ? cleanPlayerName(entry.file) : "";
      
      const item = document.createElement("div");
      item.className = "card-candidate-item";
      item.innerHTML = `
        <div style="display:flex; flex-direction:column;">
            <strong>${name}</strong>
            <small>${typeLabel} ${fileInfo ? `(${fileInfo})` : ""}</small>
        </div>
        <span class="material-symbols-outlined" style="color:${color === 'yellow' ? '#E6B84A' : '#B25F5B'}">
            style
        </span>
      `;
      
      item.onclick = async () => {
          if (isMc) {
              if (isMcReserveId(id)) {
                  state.selectedMcReserve = id;
                  state.mcSelectionMode = "reserve";
              } else {
                  state.selectedMcSlot = id;
                  state.mcSelectionMode = "slot";
              }
          } else {
              state.selectedSlot = id;
          }
          
          applyTargetUiState().catch(()=>{}); 
          closeCardSelectModal();
          
          setBusy(true);
          try {
              await setCard(color);
          } finally {
              setBusy(false);
          }
      };
      return item;
    };

    

    const filterCandidates = async (candidates, cardMap, filesConfig) => {
        const results = [];
        
        

        

        for (const cand of candidates) {
            const cardName = `${cand.id}${CFG.cardSuffix}`;
            const cardIt = cardMap.get(cardName);

            

            if (!cardIt || !cardIt.enabled) {
                results.push(cand);
                continue;
            }

            

            try {
                const settings = await state.ws.call("GetInputSettings", { inputName: cardName });
                const currentFile = settings.inputSettings?.file || "";
                const currentColor = inferCardColor(currentFile, filesConfig);

                

                

                if (currentColor !== color) {
                    results.push(cand);
                }
            } catch (e) {
                

                results.push(cand);
            }
        }
        return results;
    };

    

    const slotCount = isMc ? CFG.mc.slotCount : CFG.slotCount;
    const prefix = isMc ? mcSlotName : getSlotName;
    const slotCardMap = isMc ? state.mcCardByName : state.cardByName;
    const slotFiles = isMc ? CFG.mc.cardFiles : CFG.cardFiles;

    const slotCandidates = [];
    for (let i = 1; i <= slotCount; i++) {
        const id = prefix(i);
        slotCandidates.push({ id, entry: state.slots[id], label: `Titular ${pad2(i)}` });
    }

    const availableSlots = await filterCandidates(slotCandidates, slotCardMap, slotFiles);

    if (availableSlots.length > 0 && el.cardPlayerList) {
        el.cardPlayerList.appendChild(createHeader(isMc ? "TITULARES (MC)" : "TITULARES (CAMPO)"));
        availableSlots.forEach(c => {
            el.cardPlayerList.appendChild(createCardItem(c.id, c.entry, c.label));
        });
    } else if (el.cardPlayerList) {
        const msg = document.createElement("div");
        msg.textContent = "Todos os titulares já possuem este cartão.";
        msg.style.padding = "10px"; msg.style.opacity = "0.5"; msg.style.fontSize = "12px";
        el.cardPlayerList.appendChild(createHeader(isMc ? "TITULARES (MC)" : "TITULARES (CAMPO)"));
        el.cardPlayerList.appendChild(msg);
    }

    

    if (isMc) {
        const resCandidates = [];
        for (let i = 1; i <= CFG.mc.reserveCount; i++) {
            const id = mcReserveName(i);
            resCandidates.push({ id, entry: state.reserves[id], label: `Reserva ${pad2(i)}` });
        }

        const availableReserves = await filterCandidates(resCandidates, state.mcReserveCardByName, CFG.mc.reserveCardFiles);

        if (availableReserves.length > 0 && el.cardPlayerList) {
            el.cardPlayerList.appendChild(createHeader("RESERVAS"));
            availableReserves.forEach(c => {
                el.cardPlayerList.appendChild(createCardItem(c.id, c.entry, c.label));
            });
        }
    }

    

    el.cardModal.classList.add("show");
    el.cardModal.setAttribute("aria-hidden", "false");
    el.cardModal.style.display = "flex";

  } catch(err) {
      log("Erro ao abrir modal de cartões", err);
  } finally {
      setBusy(false);
  }
};

    const closeCardSelectModal = () => {
      if (!el.cardModal) return;
      el.cardModal.classList.remove("show");
      el.cardModal.setAttribute("aria-hidden", "true");
      el.cardModal.style.display = "none";
    };

    

const closeGoalModal = () => {
      if (!el.goalModal) return;
      

      el.goalModal.classList.remove("show");
      el.goalModal.setAttribute("aria-hidden", "true");
      
      

      el.goalModal.style.display = "none"; 
      
      

      if (el.goalSearch) el.goalSearch.value = "";
    };

const renderGoalList = (search = "") => {
  if (!el.goalList) return;
  
  // SEMPRE listar apenas slots titulares do MC
  const count = CFG.mc.slotCount;
  const prefix = CFG.mc.slotPrefix;
  
  const list = [];
  for (let i = 1; i <= count; i++) {
    const id = `${prefix}${pad2(i)}`;
    const entry = state.slots[id]; // Apenas slots, não reservas
    
    const name = entry?.playerName || derivePlayerNameFromFile(entry?.file, id);
    
    list.push({
      id,
      name: name || id,
      goals: state.mcGoalBallCounts.get(id) || 0,
      shortId: i
    });
  }

  const needle = String(search || "").toLowerCase().trim();
  const filtered = needle
    ? list.filter((item) =>
        item.name.toLowerCase().includes(needle) || item.id.toLowerCase().includes(needle)
      )
    : list;

  el.goalList.innerHTML = "";
  
  if (!filtered.length) {
    const empty = document.createElement("div");
    empty.className = "rosterEmpty";
    empty.style.gridColumn = "1 / -1";
    empty.style.textAlign = "center";
    empty.textContent = "Nenhum jogador encontrado.";
    el.goalList.appendChild(empty);
    return;
  }

  filtered.forEach((item) => {
    const row = document.createElement("div");
    row.className = "goal-card-item";
    
    const goalsBadge = item.goals > 0 
        ? `<span class="goal-count-badge">⚽ ${item.goals}</span>` 
        : `<span></span>`;

    row.innerHTML = `
        <div class="goal-player-name" title="${item.name}">${item.name}</div>
        <div class="goal-player-meta">
            <span>#${item.shortId}</span>
            ${goalsBadge}
        </div>
    `;

    row.addEventListener("click", async () => {
      closeGoalModal();
      setBusy(true);
      try {
        await mcScoreboardRegisterCorinthiansGoal({ playerId: item.id });
      } finally {
        setBusy(false);
      }
    });
    
    el.goalList.appendChild(row);
  });
};

    const openGoalModal = () => {
      if (!el.goalModal) return;
      el.goalModal.classList.add("show");
      el.goalModal.setAttribute("aria-hidden", "false");
      el.goalModal.style.display = "flex";
      if (el.goalSearch) el.goalSearch.value = "";
      renderGoalList("");
      setTimeout(() => { if (el.goalSearch) el.goalSearch.focus(); }, 0);
    };

    

    const closeModal = () => {
      if (!el.modalMask) return;
      el.modalMask.classList.remove("show");
      el.modalMask.setAttribute("aria-hidden", "true");
    };

const openModal = async () => {
  log("openModal()", {
    hasModalMask: !!el.modalMask,
    hasRosterList: !!el.rosterList,
    rosterTotal: Array.isArray(state.roster) ? state.roster.length : -1,
  });

  if (!el.modalMask) return;

  await refreshRoster({ force: false, reason: "openModal" });
  el.modalMask.classList.add("show");
  el.modalMask.setAttribute("aria-hidden", "false");
  if (el.rosterSearch) el.rosterSearch.value = "";
  renderRoster("");
  setTimeout(() => { if (el.rosterSearch) el.rosterSearch.focus(); }, 0);
};


const renderRoster = (q) => {
  if (!el.rosterList) {
    log("renderRoster: rosterList não existe no DOM");
    return;
  }

  // 1. Descobrir quem está selecionado no momento
  const sel = getActiveSelection();
  
  // 2. Decidir qual lista usar com base no tipo de seleção
  let sourceList = [];
  let listTypeLabel = "";

  if (sel && sel.kind === "reserve") {
    // Se for reserva, mostramos apenas os arquivos de reserva (_res)
    sourceList = state.reserveOptions || [];
    listTypeLabel = "Reservas Disponíveis";
  } else {
    // Se for titular (ou nada selecionado), mostramos a lista principal
    sourceList = state.roster || [];
    listTypeLabel = "Jogadores Disponíveis";
  }

  log("renderRoster()", {
    q: String(q || ""),
    targetKind: sel ? sel.kind : "none",
    listSize: sourceList.length,
  });

  const filtered = filterAndSortRoster(sourceList, q);

  el.rosterList.innerHTML = "";

  // Adicionar um cabeçalho visual para o usuário saber o que está vendo
  const header = document.createElement("div");
  header.className = "list-section-header";
  header.style.marginTop = "0";
  header.textContent = listTypeLabel;
  el.rosterList.appendChild(header);

  if (!filtered.length) {
    const div = document.createElement("div");
    div.className = "rosterEmpty";
    div.textContent = sourceList.length 
        ? "Nenhum jogador encontrado para este filtro." 
        : "Nenhum jogador cadastrado nesta categoria.";
    el.rosterList.appendChild(div);
    return;
  }

  // Helper para garantir que o caminho do arquivo corresponda ao alvo
  const fixPathForTarget = (originalPath, targetKind) => {
      if (!originalPath) return "";
      const isReserveTarget = targetKind === "reserve";
      
      // Se o alvo é reserva, forçamos o caminho de reserva
      if (isReserveTarget) {
          return buildReserveFilePathFromFile(originalPath);
      }
      
      // Se o alvo é titular, forçamos o caminho principal
      return buildMainFilePathFromReserveFile(originalPath);
  };

  filtered.forEach((p) => {
    const item = document.createElement("div");
    item.className = "rosterItem";
    
    // Ajustar label do arquivo para exibição
    const rawFile = p.file || "";
    const folderName = sel && sel.kind === "reserve" ? "Reservas" : "Players";
    const fileLabel = rawFile.split(/[\\/]/).pop(); 

    const label = buildRosterDisplayLabel(p);
    
    item.innerHTML = `<div><strong>${label}</strong></div>` +
      (p.team ? `<small>${p.team}</small>` : "") +
      (p.position ? `<small>${p.position}</small>` : "") +
      `<small class="filePath">${folderName}/${fileLabel}</small>`;

    item.addEventListener("click", async () => {
      // Recalcular seleção no momento do clique para segurança
      const currentSel = getActiveSelection();
      if (!currentSel || !currentSel.name || !p.file) return;

      setBusy(true);
      try {
        // SEGURANÇA FINAL: Garante que o arquivo enviado é do tipo correto
        // mesmo que a lista esteja misturada
        const correctFile = fixPathForTarget(p.file, currentSel.kind);

        await state.ws.call("SetInputSettings", {
          inputName: currentSel.name,
          inputSettings: { file: resolveProjectPath(correctFile) },
          overlay: true,
        });

        // Lógica de atualização de estado e cartões (mantida do original)
        if (state.target === "field") {
          const cardName = `${currentSel.name}${CFG.cardSuffix}`;
          const cardIt = state.cardByName.get(cardName);
          const slotIt = state.slotByName.get(currentSel.name);
          if (cardIt && cardIt.enabled && slotIt) {
            const tr = await state.ws.call("GetSceneItemTransform", { sceneName: state.groupSlotsName, sceneItemId: slotIt.id });
            await state.ws.call("SetSceneItemTransform", { sceneName: state.groupCardsName, sceneItemId: cardIt.id, sceneItemTransform: copyTransformSafe(tr.sceneItemTransform) });
          }
        }
        
        // Atualiza a memória interna com o nome correto
        if (currentSel.kind === "reserve") {
          updateReserveState(currentSel.name, { playerName: p.name, file: correctFile });
        } else {
          updateSlotState(currentSel.name, { playerName: p.name, file: correctFile });
        }
        
        closeModal();
      } catch (err) {
        log("ERRO: swap", { err: String((err && err.status && err.status.comment) || err && err.message || err) });
      } finally {
        setBusy(false);
      }
    });

    el.rosterList.appendChild(item);
  });
};

    const POSITION_LABELS = {
      GOL: "Goleiro",
      ZAG: "Zagueiro",
      LAT: "Lateral",
      VOL: "Volante",
      MEI: "Meia",
      ATA: "Atacante",
    };

    const normalizeSearchText = (value) => {
      return String(value || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
    };

    const buildRosterSearchKey = ({ name, number, pos, posLabel, isReserve }) => {
      const parts = [];
      if (Number.isFinite(number)) parts.push(String(number));
      if (name) parts.push(name);
      if (pos) parts.push(pos);
      if (posLabel) parts.push(posLabel);
      parts.push(isReserve ? "reserva" : "titular");
      return normalizeSearchText(parts.join(" ")).trim();
    };

    const parseRosterFilename = (baseName) => {
      let clean = String(baseName || "");
      let isReserveSuffix = false;
      if (clean.toLowerCase().endsWith("_res")) {
        isReserveSuffix = true;
        clean = clean.slice(0, -4);
      }
      const match = clean.match(/^(\d{1,2}) - (.+) - ([A-Za-z]{2,4})$/);
      if (!match) {
        return {
          name: clean.trim(),
          number: null,
          pos: null,
          posLabel: null,
          isReserveSuffix,
        };
      }
      const number = Number(match[1]);
      if (!Number.isFinite(number) || number < 1 || number > 99) {
        return {
          name: clean.trim(),
          number: null,
          pos: null,
          posLabel: null,
          isReserveSuffix,
        };
      }
      const pos = String(match[3]).toUpperCase();
      return {
        name: match[2].trim(),
        number,
        pos,
        posLabel: POSITION_LABELS[pos] || pos,
        isReserveSuffix,
      };
    };

    const cleanPlayerName = (filename) => {
      if (!filename) return "";
      let name = decodeURIComponent(String(filename));
      name = name.split(/[\\/]/).pop();
      name = name.replace(/\.png$/i, "");
      name = name.replace(/_res$/i, "");
      name = name.replace(/^MC_(Res|Slot|PK)_\w+\s*/i, "");
      name = name.replace(/^(Slot|Res)_\d+\s*/i, "");
      name = name.replace(/^\d+[\s\-_]+/, "");
      name = name.replace(/[\s\-_]+[A-Z]{2,4}$/, "");
      name = name.replace(/_/g, " ").trim();
      return name.replace(/\b\w/g, (c) => c.toUpperCase());
    };

    const buildRosterDisplayLabel = (entry, { reserveOverride } = {}) => {
      if (!entry) return "";
      const hasNumber = Number.isFinite(entry.number);
      const hasPos = !!entry.pos;
      if (hasNumber && hasPos) {
        const base = `${entry.number} • ${entry.name} • ${entry.pos}`;
        const isReserve = reserveOverride ?? entry.isReserve;
        return isReserve ? `${base} (res)` : base;
      }
      return entry.name || "";
    };

    const filterAndSortRoster = (list, query) => {
      const normalizedQuery = normalizeSearchText(query).trim();
      const tokens = normalizedQuery ? normalizedQuery.split(/\s+/).filter(Boolean) : [];
      if (!tokens.length) return list;

      const scored = [];
      for (const entry of list) {
        const searchKey = entry.searchKey || buildRosterSearchKey(entry);
        const matchesAll = tokens.every((token) => searchKey.includes(token));
        if (!matchesAll) continue;
        const numberText = Number.isFinite(entry.number) ? String(entry.number) : "";
        const posText = entry.pos ? normalizeSearchText(entry.pos) : "";
        const exactNumber = numberText ? tokens.some((t) => t === numberText) : false;
        const exactPos = posText ? tokens.some((t) => t === posText) : false;
        const prefixName = normalizedQuery
          ? normalizeSearchText(entry.name).startsWith(normalizedQuery)
          : false;
        scored.push({ entry, exactNumber, exactPos, prefixName });
      }

      scored.sort((a, b) => {
        if (a.exactNumber !== b.exactNumber) return a.exactNumber ? -1 : 1;
        if (a.exactPos !== b.exactPos) return a.exactPos ? -1 : 1;
        if (a.prefixName !== b.prefixName) return a.prefixName ? -1 : 1;
        return String(a.entry.name || "").localeCompare(String(b.entry.name || ""), "pt-BR");
      });

      return scored.map((item) => item.entry);
    };

    const BASE_PLAYERS_LIST = [
      "Gustavo Henrique.png", "Héctor Hernández.png", "Hugo Souza.png", "Hugo.png",
      "João Pedro.png", "José Martínez.png", "Kayke.png", "Matheus Bidu.png",
      "Matheus Donelli.png", "Matheuzinho.png", "Maycon.png", "Memphis.png",
      "Raniele.png", "Rodrigo Garro.png", "Romero.png", "Ryan.png",
      "Talles Magno.png", "Vitinho.png", "Yuri Alberto.png", "André Carrillo.png",
      "André Ramalho.png", "Breno Bidon.png", "Cacá.png", "Charles.png",
      "Fabrizio Angileri.png", "Felipe Longo.png", "Félix Torres.png"
    ];

    const withCacheBust = (u) => `${u}${u.includes("?") ? "&" : "?"}v=${Date.now()}`;

    const getFilesSignature = (files) => {
      if (!Array.isArray(files)) return "";
      return files
        .map((f) => String(f || "").trim())
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b, "pt-BR"))
        .join("|");
    };

const normalizeRosterEntry = (entry, defaultFolder, isReserveList = false) => {
  if (!entry) return null;
  
  if (typeof entry === "string") {
    const base = entry.split(/[\\/]/).pop() || "";
    const baseName = base.replace(/\.png$/i, "");
    const parsed = parseRosterFilename(baseName);
    const name = parsed.name || baseName.replace(/_res$/i, "").trim();
    const file = entry.includes("/") || entry.includes("\\") 
      ? entry 
      : `${defaultFolder}/${entry}`;
    const isReserve = parsed.isReserveSuffix || isReserveList;
    const searchKey = buildRosterSearchKey({
      name,
      number: parsed.number,
      pos: parsed.pos,
      posLabel: parsed.posLabel,
      isReserve,
    });
    return {
      name: name || entry,
      number: parsed.number,
      pos: parsed.pos,
      posLabel: parsed.posLabel,
      isReserve,
      file,
      team: "",
      position: "",
      searchKey,
    };
  }
  
  if (typeof entry !== "object") return null;
  
  const fileRaw = entry.file || entry.path || "";
  const file = fileRaw
    ? fileRaw
    : entry.name
      ? `${defaultFolder}/${entry.name}.png`
      : "";
      
  const base = String(file || "").split(/[\\/]/).pop() || "";
  const baseName = base.replace(/\.png$/i, "");
  const parsed = parseRosterFilename(baseName);
  const name = entry.name || parsed.name || baseName.replace(/_res$/i, "").trim();
  const number = Number.isFinite(entry.number) ? entry.number : parsed.number;
  const posRaw = entry.pos || parsed.pos || null;
  const pos = posRaw ? String(posRaw).toUpperCase() : null;
  const posLabel = entry.posLabel || (pos ? (POSITION_LABELS[pos] || pos) : parsed.posLabel);
  const isReserve = typeof entry.isReserve === "boolean" ? entry.isReserve : (parsed.isReserveSuffix || isReserveList);
  const searchKeySource = entry.searchKey || buildRosterSearchKey({
    name,
    number,
    pos,
    posLabel,
    isReserve,
  });
  
  return {
    name: name || "",
    number: Number.isFinite(number) ? number : null,
    pos,
    posLabel: posLabel || null,
    isReserve,
    file,
    team: entry.team || "",
    position: entry.position || "",
    searchKey: normalizeSearchText(searchKeySource),
  };
};

    const normalizeRosterPayload = (payload) => {
      if (!payload) return { generatedAt: "", players: [], reserves: [] };
      if (Array.isArray(payload)) {
        return { generatedAt: "", players: payload, reserves: [] };
      }
      if (typeof payload === "object") {
        return {
          generatedAt: payload.generatedAt || payload.generated_at || "",
          players: payload.players || payload.roster || [],
          reserves: payload.reserves || [],
        };
      }
      return { generatedAt: "", players: [], reserves: [] };
    };

    const getFallbackPlayers = () => (BASE_PLAYERS_LIST || [])
      .map((fileName) => normalizeRosterEntry(fileName, CFG.playersPath))
      .filter(Boolean);

    const getStoredGeneratedAt = () => {
      try { return localStorage.getItem("tatico_last_roster_generated_at") || ""; } catch { return ""; }
    };

    const setStoredGeneratedAt = (value) => {
      try {
        if (value) localStorage.setItem("tatico_last_roster_generated_at", value);
      } catch {}
    };

const applyRosterUpdate = (payload, { force = false, source = "SALVEDREW_ROSTER" } = {}) => {
  const normalized = normalizeRosterPayload(payload);

  const players = (normalized.players || [])
    .map((entry) => normalizeRosterEntry(entry, CFG.playersPath, false))
    .filter((p) => p && p.name && p.file);

  const reservesList = (normalized.reserves || [])
    .map((entry) => normalizeRosterEntry(entry, CFG.reservesPath, true))
    .filter((p) => p && p.name && p.file);

  const generatedAt = normalized.generatedAt || "";
  const lastGeneratedAt = state.lastRosterGeneratedAt || getStoredGeneratedAt();

  const signature = getFilesSignature([...players, ...reservesList].map((p) => p.file));

  const shouldApply = force ||
    !state.roster.length ||
    (generatedAt && generatedAt !== lastGeneratedAt) ||
    (!generatedAt && signature && signature !== state.lastRosterSignature);

  if (!shouldApply) return false;

  state.roster = players;

  

  state.reserveOptions = reservesList;

  state.lastRosterGeneratedAt = generatedAt;
  state.lastRosterSignature = signature;
  setStoredGeneratedAt(generatedAt);

  log("Roster atualizado", {
    source,
    generatedAt: generatedAt || "n/a",
    players: players.length,
    reserves: reservesList.length,
    totalSignature: signature ? `${signature.substring(0, 32)}...` : "",
  });

  renderPlayersList(el.playerSearch ? el.playerSearch.value : "");
  if (el.rosterList) renderRoster(el.rosterSearch ? el.rosterSearch.value : "");
  if (el.reserveList) renderReserveRoster(el.reserveSearch ? el.reserveSearch.value : "");
  if (el.substituteList && typeof renderSubstituteList === "function") {
    renderSubstituteList(el.substituteSearch ? el.substituteSearch.value : "");
  }

  return true;
};


    const loadScriptFresh = (url, id, label = "Script") => new Promise((resolve, reject) => {
      const finalUrl = withCacheBust(url);
      if (id) {
        const prev = document.getElementById(id);
        if (prev) prev.remove();
      }
      const s = document.createElement("script");
      if (id) s.id = id;
      s.src = finalUrl;
      s.async = true;
      s.onload = () => resolve(finalUrl);
      s.onerror = () => reject(new Error(`Falha ao carregar script: ${finalUrl}`));
      document.head.appendChild(s);
      log(`${label} script carregando`, { url: finalUrl });
    });

const refreshRoster = async ({ force = false, reason = "" } = {}) => {
  if (state.refreshInFlight) return state.refreshInFlight;

  state.refreshInFlight = (async () => {
    try {
      const scriptUrl = "./roster.data.js";
      await loadScriptFresh(scriptUrl, "rosterDataScript", "Roster");

      if (!window.SALVEDREW_ROSTER) {
        log("FALLBACK ATIVADO: SALVEDREW_ROSTER ausente", { reason });
      }

      const payload = window.SALVEDREW_ROSTER;
      const normalized = normalizeRosterPayload(payload);

      log(`🔍 Roster carregado (${reason}):`, {
        players: (normalized.players || []).length,
        reserves: (normalized.reserves || []).length,
        generatedAt: normalized.generatedAt || "n/a",
      });

      const hasRoster = (normalized.players || []).length || (normalized.reserves || []).length;

      const updated = hasRoster
        ? applyRosterUpdate(payload, { force, source: "SALVEDREW_ROSTER" })
        : applyRosterUpdate({ players: getFallbackPlayers(), reserves: [] }, { force: true, source: "BASE_PLAYERS_LIST" });

      if (!updated) log("Roster sem mudanças", { reason });

      

      if (el.reserveSelect && Array.isArray(state.reserveOptions) && state.reserveOptions.length > 0) {
        log(`🔄 ${state.reserveOptions.length} reservas disponíveis no roster`);
      }

      return updated;
    } catch (err) {
      log("Erro ao atualizar roster", {
        err: String(err?.message || err),
        reason,
      });
      return false;
    }
  })();

  try {
    return await state.refreshInFlight;
  } finally {
    state.refreshInFlight = null;
  }
};


    const loadInitialRoster = async () => {
      log("Carregando roster...");
      const ok = await refreshRoster({ force: true, reason: "boot" });
      if (ok) return;

      log("FALLBACK ATIVADO: usando BASE_PLAYERS_LIST");
      applyRosterUpdate({ players: getFallbackPlayers(), reserves: [] }, { force: true, source: "BASE_PLAYERS_LIST" });
    };

    const hardRefreshRoster = async () => refreshRoster({ force: true, reason: "manual" });

    const runFolderScan = async () => {
      state.isScanning = true;
      setBusy(true);
      try {
        await refreshRoster({ force: true, reason: "scan" });
      } finally {
        state.isScanning = false;
        setBusy(false);
      }
    };

    const startRosterPolling = () => {
      if (state.rosterPollTimer) return;
      const intervalMs = CFG_RAW.rosterPollMs ?? 2000;
      if (intervalMs <= 0) return;
      state.rosterPollTimer = setInterval(() => {
        if (state.busy) return;
        refreshRoster({ force: false, reason: "poll" }).catch(() => {});
      }, intervalMs);
    };

    

	
const MC_ESCUDO_BASELINE_KEY = "MC_ESCUDO_BASELINE_V1";
const MC_ESCUDO_IDS_KEY = "tatico_mc_logo_ids";
const SCALE_FILTER_SETTINGS = {
  "scale_filter": {
    "name": "Redimensionar Corinthians",
    "enabled": true,
    "settings": {
      "scale_type": 1, 

      "resolution": "1920x1080"
    }
  }
};
	
    const MC_SCOREBOARD_REQUIRED = [
      "MC_PlacarCard",
      "MC_EscudoLeft",
      "MC_EscudoRight",
      "MC_SiglaLeft",
      "MC_SiglaRight",
      "MC_GolsLeft",
      "MC_GolsRight",
      "MC_Cronometro",
      "MC_1t_Icon",
      "MC_2t_Icon",
      "MC_intervalo_Icon",
      "MC_prorrogacao_Icon",
      "MC_penalti_Icon",
    ];

    const MC_SCOREBOARD_STATUS_MAP = {
      "1t": "MC_1t_Icon",
      "2t": "MC_2t_Icon",
      intervalo: "MC_intervalo_Icon",
      prorrogacao: "MC_prorrogacao_Icon",
      penalti: "MC_penalti_Icon",
    };




function mcScoreboardBaselineKey(side) {
  return `${MC_ESCUDO_BASELINE_KEY}_${side}`;
}

const copyTransformSafe = (obj) => {
  if (!obj || typeof obj !== 'object') return {};
  
  

  const defaultTransform = {
    positionX: 0,
    positionY: 0,
    rotation: 0,
    scaleX: 1,
    scaleY: 1,
    width: 0,
    height: 0,
    sourceWidth: 0,
    sourceHeight: 0,
    boundsWidth: 0,
    boundsHeight: 0,
    boundsType: "OBS_BOUNDS_NONE",  

    cropTop: 0,
    cropBottom: 0,
    cropLeft: 0,
    cropRight: 0,
    alignment: 5,
    boundsAlignment: 0,
    scaleFilter: "disable",
    cropToBounds: false
  };
  
  

  const result = { ...defaultTransform };
  
  

  for (const key in obj) {
    if (obj[key] !== undefined && obj[key] !== null) {
      

      if (['positionX', 'positionY', 'rotation', 'scaleX', 'scaleY', 
           'width', 'height', 'sourceWidth', 'sourceHeight',
           'boundsWidth', 'boundsHeight', 'boundsAlignment',
           'cropTop', 'cropBottom', 'cropLeft', 'cropRight', 'alignment'].includes(key)) {
        const numericValue = Number(obj[key]);
        result[key] = Number.isFinite(numericValue) ? numericValue : defaultTransform[key];
      } 
      

      else if (key === 'boundsType' || key === 'scaleFilter') {
        result[key] = String(obj[key] || defaultTransform[key]);
      }
      

      else if (key === 'cropToBounds') {
        result[key] = Boolean(obj[key]);
      }
      

      else {
        result[key] = obj[key];
      }
    }
  }
  
  

  if (result.boundsWidth < 1.0) result.boundsWidth = 1.0;
  if (result.boundsHeight < 1.0) result.boundsHeight = 1.0;
  if (!Number.isFinite(result.scaleX)) result.scaleX = 1.0;
  if (!Number.isFinite(result.scaleY)) result.scaleY = 1.0;
  if (!Number.isFinite(result.alignment)) result.alignment = defaultTransform.alignment;
  if (!Number.isFinite(result.boundsAlignment)) result.boundsAlignment = defaultTransform.boundsAlignment;
  
  

  if (typeof result.boundsType !== 'string') {
    

    const boundsTypeMap = {
      0: "OBS_BOUNDS_NONE",
      1: "OBS_BOUNDS_STRETCH",
      2: "OBS_BOUNDS_SCALE_INNER",
      3: "OBS_BOUNDS_SCALE_OUTER",
      4: "OBS_BOUNDS_SCALE_TO_WIDTH",
      5: "OBS_BOUNDS_SCALE_TO_HEIGHT",
      6: "OBS_BOUNDS_MAX_ONLY"
    };
    result.boundsType = boundsTypeMap[result.boundsType] || "OBS_BOUNDS_NONE";
  }
  
  return result;
};



const sanitizeTransform = (tr) => {
  if (!tr || typeof tr !== 'object') return {};
  
  const out = { ...tr };
  
  

  if (typeof out.boundsWidth === 'number' && out.boundsWidth < 1.0) {
    out.boundsWidth = 1.0;
  }
  if (typeof out.boundsHeight === 'number' && out.boundsHeight < 1.0) {
    out.boundsHeight = 1.0;
  }
  if (typeof out.scaleX === 'number' && !Number.isFinite(out.scaleX)) {
    out.scaleX = 1.0;
  }
  if (typeof out.scaleY === 'number' && !Number.isFinite(out.scaleY)) {
    out.scaleY = 1.0;
  }
  
  

  
  return out;
};


    const MC_SCOREBOARD_STATUS_LABELS = {
      "1t": "1T",
      "2t": "2T",
      intervalo: "Intervalo",
      prorrogacao: "Prorrogação",
      penalti: "Pênalti",
    };

const mcPenaltiesEnsureState = () => {
  const ensureArray = (val) => {
    

    let arr = Array.isArray(val) ? val : [];
    

    while (arr.length < 5) arr.push("empty");
    return arr;
  };

  if (!state.mcScoreboard.penalties || typeof state.mcScoreboard.penalties !== "object") {
    state.mcScoreboard.penalties = {};
  }

  state.mcScoreboard.penalties.cor = ensureArray(state.mcScoreboard.penalties.cor);
  state.mcScoreboard.penalties.adv = ensureArray(state.mcScoreboard.penalties.adv);
};

const mcPenaltiesAddRound = () => {
  mcPenaltiesEnsureState();
  

  state.mcScoreboard.penalties.cor.push("empty");
  state.mcScoreboard.penalties.adv.push("empty");
  
  

  mcPenaltiesRenderUi();
  mcScoreboardSchedulePersist();
  log(`Mata-mata: Rodada ${state.mcScoreboard.penalties.cor.length} adicionada.`);
};

const mcPenaltiesRenderUi = () => {
  mcPenaltiesEnsureState();

  

  const renderList = (containerId, team, values) => {
    const container = document.getElementById(containerId);
    if (!container) return;

    

    const currentScroll = container.scrollLeft;

    container.innerHTML = ""; 


    values.forEach((val, index) => {
      const btn = document.createElement("button");
      btn.className = "mc-penalty-btn";
      btn.type = "button";
      
      

      if (val === "empty") btn.classList.add("is-empty");
      else if (val === "goal") btn.classList.add("is-goal");
      else if (val === "miss") btn.classList.add("is-miss");

      const iconChar = MC_PENALTY_ICONS[team]?.[val] || "○";

      btn.innerHTML = `
        <span class="mc-penalty-icon">${iconChar}</span>
        <span class="mc-penalty-index">${index + 1}</span>
      `;

      

      btn.onclick = () => {
        const nextState = val === "empty" ? "goal" : (val === "goal" ? "miss" : "empty");
        mcPenaltiesSet(team, index, nextState);
      };

      container.appendChild(btn);
    });

    

    if (values.length > 5) {
        

        

        const lastItem = values[values.length - 1];
        if (lastItem === "empty") {
             container.scrollLeft = container.scrollWidth;
        } else {
             container.scrollLeft = currentScroll;
        }
    }
  };

  

  renderList("pListLeft", "cor", state.mcScoreboard.penalties.cor);
  renderList("pListRight", "adv", state.mcScoreboard.penalties.adv);
};

const mcPenaltiesSet = (team, index, value) => {
  if (team !== "cor" && team !== "adv") return;
  
  

  if (!Number.isFinite(index) || index < 0) return; 
  
  if (!MC_PENALTY_STATES.includes(value)) return;

  mcPenaltiesEnsureState();
  state.mcScoreboard.penalties[team][index] = value;
  mcPenaltiesRenderUi();
  mcPenaltiesApply().catch(() => {});
  mcScoreboardSchedulePersist();
};

    const mcPenaltiesReset = () => {
      mcPenaltiesEnsureState();
      state.mcScoreboard.penalties.cor = ["empty", "empty", "empty", "empty", "empty"];
      state.mcScoreboard.penalties.adv = ["empty", "empty", "empty", "empty", "empty"];
      mcPenaltiesRenderUi();
      mcPenaltiesApply().catch(() => {});
      mcScoreboardSchedulePersist();
      log("Pênaltis: reset");
    };

const mcPenaltiesResolveFile = (team, value) => {
  const files = MC_PENALTY_FILES[team] || {};
  const fallback = files.empty || "";
  const resolved = files[value] || fallback;
  return resolved || fallback || "";
};

const resolvePenaltyGroupAndItemsIds = async ({ context = "", logDetails = false } = {}) => {
  const rootSceneName = state.mcScoreboard.groupName;
  const fallbackGroupName = (CFG.mc && CFG.mc.penaltiesGroupName) || "MC Pênaltis";
  const cache = state.mcScoreboard.items || {};
  const cachedPkItems = Array.isArray(cache.pkIndividualItems) ? cache.pkIndividualItems : [];

  const penaltyNames = [];
  ["L", "R"].forEach((side) => {
    for (let i = 1; i <= 5; i++) {
      penaltyNames.push(`MC_PK_${side}_${pad2(i)}`);
    }
  });

  const result = {
    rootSceneName,
    penaltiesGroupName: cache.penaltiesGroupName || fallbackGroupName,
    penaltiesGroupId: cache.penaltiesGroupId || null,
    items: [],
    missing: [],
    strategies: [],
  };

  const cachedByName = new Map();
  cachedPkItems.forEach((item) => {
    if (item && item.name) {
      cachedByName.set(item.name, {
        name: item.name,
        sceneName: item.parent || result.penaltiesGroupName || rootSceneName,
        sceneItemId: item.id,
        source: "cache",
      });
    }
  });

  if (!result.penaltiesGroupId && cache.byName && result.penaltiesGroupName) {
    const cachedGroupId = cache.byName.get(result.penaltiesGroupName);
    if (cachedGroupId) {
      result.penaltiesGroupId = cachedGroupId;
      result.strategies.push("cache:groupId-byName");
    }
  }

  const unresolvedNames = penaltyNames.filter((name) => !cachedByName.has(name));

  let rootItems = [];
  let rootByName = new Map();
  let groupItems = [];
  let groupByName = new Map();

  if (unresolvedNames.length && state.connected && state.ws) {
    const listSceneOrGroupItems = async (name, label) => {
      try {
        const info = await state.ws.call("GetSourceInfo", { sourceName: name });
        const sourceType = info?.sourceType || "";
        if (sourceType === "OBS_SOURCE_TYPE_GROUP") {
          const list = await state.ws.call("GetGroupSceneItemList", { sceneName: name });
          return { items: list?.sceneItems || [], strategy: `${label}:group` };
        }
      } catch (err) {
        log("Pênaltis: erro ao consultar tipo de fonte", {
          context,
          sceneName: name,
          err: String(err?.status?.comment || err?.message || err),
        });
      }

      try {
        const list = await state.ws.call("GetSceneItemList", { sceneName: name });
        return { items: list?.sceneItems || [], strategy: `${label}:scene` };
      } catch (err) {
        log("Pênaltis: erro ao listar cena", {
          context,
          sceneName: name,
          err: String(err?.status?.comment || err?.message || err),
        });
      }

      try {
        const list = await state.ws.call("GetGroupSceneItemList", { sceneName: name });
        return { items: list?.sceneItems || [], strategy: `${label}:group-fallback` };
      } catch (err) {
        log("Pênaltis: erro ao listar grupo (fallback)", {
          context,
          sceneName: name,
          err: String(err?.status?.comment || err?.message || err),
        });
      }

      return { items: [], strategy: `${label}:none` };
    };

    try {
      const rootResult = await listSceneOrGroupItems(rootSceneName, "root");
      rootItems = rootResult.items;
      rootByName = new Map(rootItems.map((item) => [item.sourceName, item]));
      result.strategies.push(`obs:${rootResult.strategy}`);
    } catch (err) {
      log("Pênaltis: erro ao listar root", {
        context,
        sceneName: rootSceneName,
        err: String(err?.status?.comment || err?.message || err),
      });
    }

    if (!result.penaltiesGroupId) {
      let groupItem = rootItems.find((item) => item.isGroup && item.sourceName === result.penaltiesGroupName);
      if (!groupItem) {
        groupItem = rootItems.find((item) => {
          const name = (item.sourceName || "").toLowerCase();
          return item.isGroup && name.includes("enalti");
        });
      }
      if (groupItem) {
        result.penaltiesGroupId = groupItem.sceneItemId;
        result.penaltiesGroupName = groupItem.sourceName;
        result.strategies.push("obs:groupId-from-root");
      }
    }

    if (result.penaltiesGroupName) {
      try {
        const groupResult = await listSceneOrGroupItems(result.penaltiesGroupName, "group");
        groupItems = groupResult.items;
        groupByName = new Map(groupItems.map((item) => [item.sourceName, item]));
        result.strategies.push(`obs:${groupResult.strategy}`);
      } catch (err) {
        log("Pênaltis: erro ao listar grupo", {
          context,
          sceneName: result.penaltiesGroupName,
          err: String(err?.status?.comment || err?.message || err),
        });
      }
    }
  }

  penaltyNames.forEach((name) => {
    const cached = cachedByName.get(name);
    if (cached) {
      result.items.push(cached);
      return;
    }
    const fromGroup = groupByName.get(name);
    if (fromGroup) {
      result.items.push({
        name,
        sceneName: result.penaltiesGroupName,
        sceneItemId: fromGroup.sceneItemId,
        source: "obs-group",
      });
      return;
    }
    const fromRoot = rootByName.get(name);
    if (fromRoot) {
      result.items.push({
        name,
        sceneName: rootSceneName,
        sceneItemId: fromRoot.sceneItemId,
        source: "obs-root",
      });
      return;
    }
    result.missing.push(name);
  });

  if (result.items.length) {
    state.mcScoreboard.items = state.mcScoreboard.items || {};
    state.mcScoreboard.items.pkIndividualItems = result.items.map((item) => ({
      id: item.sceneItemId,
      parent: item.sceneName,
      name: item.name,
    }));
  }
  if (result.penaltiesGroupId) {
    state.mcScoreboard.items = state.mcScoreboard.items || {};
    state.mcScoreboard.items.penaltiesGroupId = result.penaltiesGroupId;
    state.mcScoreboard.items.penaltiesGroupName = result.penaltiesGroupName;
  }

  if (logDetails) {
    log("Pênaltis: resolução de IDs", {
      context,
      rootSceneName,
      penaltiesGroupName: result.penaltiesGroupName,
      penaltiesGroupId: result.penaltiesGroupId,
      strategies: result.strategies,
      cachedPkItems: cachedPkItems.length,
      resolvedCount: result.items.length,
    });
    if (result.penaltiesGroupId) {
      log("Pênaltis: grupo encontrado", {
        context,
        sceneName: rootSceneName,
        groupName: result.penaltiesGroupName,
        sceneItemId: result.penaltiesGroupId,
      });
    }
    result.items.forEach((item) => {
      log("Pênaltis: item resolvido", {
        context,
        name: item.name,
        sceneName: item.sceneName,
        sceneItemId: item.sceneItemId,
        source: item.source,
      });
    });
    if (result.missing.length) {
      log("Pênaltis: itens não encontrados", {
        context,
        missing: result.missing,
        strategies: result.strategies,
        cacheKeys: cachedPkItems.map((item) => item.name).filter(Boolean),
      });
    }
  }

  return result;
};

const mcPenaltiesApply = async () => {
  mcPenaltiesEnsureState();
  if (!state.mcScoreboard.enabled || !state.connected) return;

  

  const targetScene = state.mcScoreboard.groupName; 
  const leftTeam = state.mcScoreboard.corinthiansSide === "left" ? "cor" : "adv";
  const rightTeam = leftTeam === "cor" ? "adv" : "cor";

  

  if (state.mcScoreboard.status === "penalti") {
      const countGoals = (arr) => arr.filter(s => s === "goal").length;
      await mcScoreboardCall("SetInputSettings", {
        inputName: "MC_GolsLeft",
        inputSettings: { text: String(countGoals(state.mcScoreboard.penalties[leftTeam])) },
        overlay: true,
      }).catch(()=>{});
      await mcScoreboardCall("SetInputSettings", {
        inputName: "MC_GolsRight",
        inputSettings: { text: String(countGoals(state.mcScoreboard.penalties[rightTeam])) },
        overlay: true,
      }).catch(()=>{});
  }

  

  
  

  const pGroupId = state.mcScoreboard.items.penaltiesGroupId;
  if (pGroupId && state.mcScoreboard.status === "penalti") {
      await mcScoreboardCall("SetSceneItemEnabled", {
          sceneName: targetScene,
          sceneItemId: pGroupId,
          sceneItemEnabled: true
      }).catch(e => console.error("Erro ao ligar grupo de pênaltis:", e));
  }

  

  const findPkId = (name) => {
      

      const item = state.mcScoreboard.items.pkIndividualItems.find(x => x.name === name);
      if (item) return item.id;
      

      return state.mcScoreboard.items.byName.get(name);
  };

  const applySide = async (side, team, values) => {
    

    const totalShots = values.length;
    const currentPage = Math.floor((totalShots - 1) / 5);
    const startIndex = currentPage * 5;

    for (let i = 0; i < 5; i++) {
      const inputName = `MC_PK_${side}_${pad2(i + 1)}`;
      const dataIndex = startIndex + i;
      const status = values[dataIndex] || "empty";
      const file = mcPenaltiesResolveFile(team, status);
      
      

      await mcScoreboardCall("SetInputSettings", {
        inputName: inputName,
        inputSettings: { file: resolveProjectPath(file) },
        overlay: true,
      }).catch(e => console.log(`Erro img ${inputName}`, e));

      

      if (state.mcScoreboard.status === "penalti") {
          const itemId = findPkId(inputName);
          if (itemId) {
              await mcScoreboardCall("SetSceneItemEnabled", {
                  sceneName: targetScene, 

                  sceneItemId: itemId,
                  sceneItemEnabled: true
              }).catch(e => console.error(`Erro visibilidade ${inputName}`, e));
          } else {
              console.warn(`ID não encontrado para ${inputName} em ${targetScene}`);
          }
      }
    }
  };

  await applySide("L", leftTeam, state.mcScoreboard.penalties[leftTeam]);
  await applySide("R", rightTeam, state.mcScoreboard.penalties[rightTeam]);
};

    const mcScoreboardStorageKey = "tatico_mc_scoreboard";
    let mcScoreboardPersistHandle = null;

const mcScoreboardSchedulePersist = () => {
      if (!state.mcScoreboard.persist) return;
      if (mcScoreboardPersistHandle) return;
      mcPenaltiesEnsureState();
      mcScoreboardPersistHandle = setTimeout(() => {
        mcScoreboardPersistHandle = null;
        const payload = {
          goalsLeft: state.mcScoreboard.goalsLeft,
          goalsRight: state.mcScoreboard.goalsRight,
          
          

          prePenaltyGoals: state.mcScoreboard.prePenaltyGoals, 

          status: state.mcScoreboard.status,
          corinthiansSide: state.mcScoreboard.corinthiansSide,
          selectedOpponentFile: state.mcScoreboard.selectedOpponent ? state.mcScoreboard.selectedOpponent.file : "",
          elapsedMs: state.mcScoreboard.elapsedMs,
          running: state.mcScoreboard.running,
          penalties: state.mcScoreboard.penalties,
          mcGoalBallStack: state.mcGoalBallStack,
          lastTick: Date.now(),
        };
        try {
          localStorage.setItem(mcScoreboardStorageKey, JSON.stringify(payload));
          state.mcScoreboard.lastPersistAt = Date.now();
        } catch {}
      }, 500);
    };
	
const mcScoreboardRestoreState = () => {
  try {
    const raw = localStorage.getItem(mcScoreboardStorageKey);
    

    
    const payload = JSON.parse(raw);
    if (!payload) return;

    

    if (payload.status && MC_SCOREBOARD_STATUS_MAP[payload.status]) {
        state.mcScoreboard.status = payload.status;
    }

if (payload.prePenaltyGoals) {
        state.mcScoreboard.prePenaltyGoals = payload.prePenaltyGoals;
    }

    if (Array.isArray(payload.mcGoalBallStack)) {
      state.mcGoalBallStack = payload.mcGoalBallStack.filter((entry) => typeof entry === "string");
      recomputeGoalBallCounts();
    }

    


    

    const uiLeft = document.getElementById("uiScoreLeft");
    const uiRight = document.getElementById("uiScoreRight");
    if (uiLeft) uiLeft.textContent = state.mcScoreboard.goalsLeft || 0;
    if (uiRight) uiRight.textContent = state.mcScoreboard.goalsRight || 0;
    
    

    if (el.mcPenaltiesPanel) {
       el.mcPenaltiesPanel.classList.toggle("isHidden", state.mcScoreboard.status !== "penalti");
    }
    
    

    const currentStatus = state.mcScoreboard.status;
    if (currentStatus === "1t" && el.btnStatus1T) el.btnStatus1T.classList.add("active");
    if (currentStatus === "2t" && el.btnStatus2T) el.btnStatus2T.classList.add("active");
    if (currentStatus === "intervalo" && el.btnStatusIntervalo) el.btnStatusIntervalo.classList.add("active");
    if (currentStatus === "prorrogacao" && el.btnStatusProrrogacao) el.btnStatusProrrogacao.classList.add("active");
    if (currentStatus === "penalti" && el.btnStatusPenalti) el.btnStatusPenalti.classList.add("active");
    


    mcPenaltiesRenderUi();

    syncGoalBalls({ context: "restore" }).catch(() => {});

  } catch (e) {
    log("Erro ao restaurar estado MC", { err: e.message });
  }
};

    const mcScoreboardFormatTime = (ms) => {
      const totalSec = Math.max(0, Math.floor(ms / 1000));
      const mm = Math.floor(totalSec / 60);
      const ss = totalSec % 60;
      return `${pad2(mm)}:${pad2(ss)}`;
    };

    const mcScoreboardGetElapsedMs = () => {
      if (state.mcScoreboard.running && state.mcScoreboard.startTimestamp) {
        return state.mcScoreboard.elapsedMs + (Date.now() - state.mcScoreboard.startTimestamp);
      }
      return state.mcScoreboard.elapsedMs;
    };

    const mcScoreboardSetTimerPreview = (text) => {
      if (el.timerPreview) el.timerPreview.textContent = text;
    };

    const mcScoreboardCall = async (requestType, requestData, context) => {
      if (!state.connected || !state.ws) return;
      try {
        await state.ws.call(requestType, requestData);
      } catch (err) {
        log("MC Placar: erro WS", { context, err: String(err?.status?.comment || err?.message || err) });
      }
    };

    const mcScoreboardApplyChronometerText = async () => {
      const text = mcScoreboardFormatTime(mcScoreboardGetElapsedMs());
      mcScoreboardSetTimerPreview(text);
      if (!state.mcScoreboard.enabled) return;
      await mcScoreboardCall("SetInputSettings", {
        inputName: "MC_Cronometro",
        inputSettings: { text },
        overlay: true,
      }, "cronometro");
    };

    const mcScoreboardStopTimerLoop = () => {
      if (state.mcScoreboard.timerHandle) {
        clearInterval(state.mcScoreboard.timerHandle);
        state.mcScoreboard.timerHandle = null;
      }
    };

const mcScoreboardStartTimerLoop = () => {
    mcScoreboardStopTimerLoop();
    state.mcScoreboard.timerHandle = setInterval(() => {
        const currentMs = mcScoreboardGetElapsedMs();
        
        

        mcScoreboardApplyChronometerText().catch(() => {});
        
        

        checkStoppageTrigger(currentMs);
        

        
        mcScoreboardSchedulePersist();
    }, 1000);
};



const checkStoppageTrigger = (ms) => {
    

    if (!state.mcScoreboard.running) return;

    const status = state.mcScoreboard.status; 

    
    

    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);

    

    let triggerTime = 45; 
    if (status === "prorrogacao") triggerTime = 15;
    
    

    if (!["1t", "2t", "prorrogacao"].includes(status)) return;

    

    if (minutes >= triggerTime) {
        
        

        if (el.btnToggleStoppage && el.btnToggleStoppage.disabled) {
            el.btnToggleStoppage.disabled = false;
            

            log(`[TIMER] Tempo atingido (${triggerTime}min). Botão de acréscimo liberado.`);
        }

        

        if (!state.mcScoreboard.stoppageAsked) {
            state.mcScoreboard.stoppageAsked = true; 

            openStoppageModal();
        }
    }
};

    const mcScoreboardSetRunning = (running) => {
      state.mcScoreboard.running = running;
      if (running) {
        state.mcScoreboard.startTimestamp = Date.now();
        mcScoreboardStartTimerLoop();
      } else {
        mcScoreboardStopTimerLoop();
      }
      mcScoreboardSchedulePersist();
    };

    const mcScoreboardStart = () => {
      state.mcScoreboard.elapsedMs = 0;
      mcScoreboardSetRunning(true);
      mcScoreboardApplyChronometerText().catch(() => {});
      log("Cronômetro: 00:00 (running)");
    };

    const mcScoreboardPause = () => {
      if (!state.mcScoreboard.running) return;
      state.mcScoreboard.elapsedMs = mcScoreboardGetElapsedMs();
      mcScoreboardSetRunning(false);
      mcScoreboardApplyChronometerText().catch(() => {});
      log("Cronômetro: pause", { elapsed: mcScoreboardFormatTime(state.mcScoreboard.elapsedMs) });
    };

    const mcScoreboardResume = () => {
      if (state.mcScoreboard.running) return;
      mcScoreboardSetRunning(true);
      mcScoreboardApplyChronometerText().catch(() => {});
      log("Cronômetro: resume", { elapsed: mcScoreboardFormatTime(state.mcScoreboard.elapsedMs) });
    };

    const mcScoreboardReset = () => {
      mcScoreboardStopTimerLoop();
      state.mcScoreboard.running = false;
      state.mcScoreboard.elapsedMs = 0;
      state.mcScoreboard.startTimestamp = 0;
      mcScoreboardApplyChronometerText().catch(() => {});
      mcScoreboardSchedulePersist();
      log("Cronômetro: 00:00 (paused)");
    };

const mcScoreboardStartFromInput = () => {
      let raw = el.timerSetInput ? String(el.timerSetInput.value || "").trim() : "";
      
      

      const digits = raw.replace(/\D/g, "");
      let mm = 0, ss = 0;

      if (!digits) return;

      

      

      

      

      if (raw.includes(":")) {
         const parts = raw.split(":");
         mm = parseInt(parts[0] || "0", 10);
         ss = parseInt(parts[1] || "0", 10);
      } else if (digits.length <= 2) {
         mm = parseInt(digits, 10);
         ss = 0;
      } else {
         const sPart = digits.slice(-2);
         const mPart = digits.slice(0, -2);
         mm = parseInt(mPart, 10);
         ss = parseInt(sPart, 10);
      }

      

      state.mcScoreboard.elapsedMs = (mm * 60 + ss) * 1000;

      

      mcScoreboardSetRunning(false);
      state.mcScoreboard.startTimestamp = 0; 

      

      mcScoreboardApplyChronometerText().catch(() => {});
      log("Cronômetro: definido para (PAUSE)", { time: mcScoreboardFormatTime(state.mcScoreboard.elapsedMs) });
    };

const mcScoreboardSetGoals = (left, right) => {
  // Atualiza o estado interno (Representação física no OBS)
  state.mcScoreboard.goalsLeft = Math.max(0, left);
  state.mcScoreboard.goalsRight = Math.max(0, right);
  
  // Envia para o OBS (Inputs de Texto)
  mcScoreboardApplyGoals().catch(() => {});
  
  // Salva no cache/storage
  mcScoreboardSchedulePersist();
  
  // Atualiza Agregado se necessário
  applyAggToObs().catch(() => {}); 

  // --- ATUALIZAÇÃO DA UI (CORREÇÃO AQUI) ---
  const uiLeft = document.getElementById("uiScoreLeft");
  const uiRight = document.getElementById("uiScoreRight");
  
  const corSide = state.mcScoreboard.corinthiansSide;
  
  // Lógica de Display:
  // Coluna Esquerda (UI) = Sempre Corinthians
  // Coluna Direita (UI) = Sempre Adversário
  
  let displayCorScore = 0;
  let displayAdvScore = 0;

  if (corSide === "left") {
      // Se Cor é Casa (Left), goalsLeft é do Cor, goalsRight é do Adv
      displayCorScore = state.mcScoreboard.goalsLeft;
      displayAdvScore = state.mcScoreboard.goalsRight;
  } else {
      // Se Cor é Fora (Right), goalsRight é do Cor, goalsLeft é do Adv
      displayCorScore = state.mcScoreboard.goalsRight;
      displayAdvScore = state.mcScoreboard.goalsLeft;
  }

  if (uiLeft) uiLeft.textContent = displayCorScore;
  if (uiRight) uiRight.textContent = displayAdvScore;
  
  log(`Gols (OBS): L=${state.mcScoreboard.goalsLeft} / R=${state.mcScoreboard.goalsRight} | Mando: ${corSide}`);
};

const mcScoreboardGetCorinthiansGoals = () => {
  return state.mcScoreboard.corinthiansSide === "right"
    ? state.mcScoreboard.goalsRight
    : state.mcScoreboard.goalsLeft;
};

const mcScoreboardAdjustCorinthiansGoals = (delta) => {
  const isRight = state.mcScoreboard.corinthiansSide === "right";
  const left = state.mcScoreboard.goalsLeft + (isRight ? 0 : delta);
  const right = state.mcScoreboard.goalsRight + (isRight ? delta : 0);
  mcScoreboardSetGoals(left, right);
};

const mcScoreboardRegisterCorinthiansGoal = async ({ playerId = "", ownGoal = false } = {}) => {
  mcScoreboardAdjustCorinthiansGoals(1);
  
  let toastPayload = {
    ttlMs: CFG.toast.ttlGoalMs,
    textLine1: "GOL DO CORINTHIANS",
  };

  if (ownGoal) {
    

    addOwnGoalBall();
    toastPayload.type = "GOAL_AGAINST"; 

    toastPayload.textLine2 = "GOL CONTRA"; 

  } else if (playerId) {
    

    await addGoalBall(playerId);
    toastPayload.type = "GOAL_COR";
    
    

    let playerName = "";
    
    

    if (isMcSlotId(playerId)) {
       const entry = state.slots[playerId];
       if (entry) playerName = entry.playerName;
    } else if (isMcReserveId(playerId)) {
       const entry = state.reserves[playerId];
       if (entry) playerName = entry.playerName;
    }
    
    

    if (!playerName) {
       

       const fileHint = (state.slots[playerId] || state.reserves[playerId])?.file || "";
       playerName = derivePlayerNameFromFile(fileHint, playerId);
    }

    toastPayload.textLine2 = playerName; 

  } else {
    

    toastPayload.type = "GOAL_COR";
  }

  enqueueToast(toastPayload);
};

const mcScoreboardUndoCorinthiansGoal = async () => {
  const current = mcScoreboardGetCorinthiansGoals();
  if (current <= 0) return false;
  mcScoreboardAdjustCorinthiansGoals(-1);
  if (state.mcGoalBallStack.length > 0) {
    await undoGoalBall();
  }
  return true;
};

const updateStoppageVisibility = async () => {
  if (!state.mcScoreboard.enabled || !state.connected) return;

  const val = state.mcScoreboard.stoppageValue;
  const shouldShow = (val > 0); 


  

  if (el.btnToggleStoppage) {
      el.btnToggleStoppage.classList.toggle("active", shouldShow);
  }

  const groupName = state.mcScoreboard.groupName;
  const txtId = state.mcScoreboard.items.stoppageTxtId;
  const bgId = state.mcScoreboard.items.stoppageBgId;

  

  if (txtId) {
      await mcScoreboardCall("SetSceneItemEnabled", {
          sceneName: groupName, sceneItemId: txtId, sceneItemEnabled: shouldShow
      });
  }
  if (bgId) {
      await mcScoreboardCall("SetSceneItemEnabled", {
          sceneName: groupName, sceneItemId: bgId, sceneItemEnabled: shouldShow
      });
  }
  
  

  if (shouldShow) {
      

      setTimeout(() => {
          alignStoppageAssets().catch(e => 
              log("[ACRESCIMO] Falha no alinhamento:", e.message)
          );
      }, 100);
  }
  
  log(`Acréscimo: ${shouldShow ? "Visível" : "Oculto"} (Valor: ${val})`);
};

const getStoppageItemId = async () => {
    if (state.mcScoreboard.items.stoppageId) return state.mcScoreboard.items.stoppageId;
    try {
        const item = await state.ws.call("GetSceneItemId", {
            sceneName: state.mcScoreboard.groupName,
            sourceName: "MC_Acrescimos"
        });
        state.mcScoreboard.items.stoppageId = item.sceneItemId;
        return item.sceneItemId;
    } catch { return null; }
};

const mcScoreboardSetMando = (side) => {
      if (side !== "left" && side !== "right") return;
      state.mcScoreboard.corinthiansSide = side;
      
      

      mcScoreboardApplyLogosAndSiglas().catch(() => {});
      mcPenaltiesApply().catch(() => {});
      mcScoreboardSchedulePersist();
      
      

      if (el.btnCorMandante) el.btnCorMandante.classList.toggle("active", side === "left");
      if (el.btnCorVisitante) el.btnCorVisitante.classList.toggle("active", side === "right");
	  
	  mcScoreboardSetGoals(state.mcScoreboard.goalsLeft, state.mcScoreboard.goalsRight);
      
      log(`Mando: Corinthians ${side === "left" ? "Mandante" : "Visitante"}`);
    };



const mcScoreboardSetOpponent = (team) => {
  state.mcScoreboard.selectedOpponent = team || null;
  
  

  if (el.opponentSelected) {
    

    el.opponentSelected.textContent = team 
      ? `${team.name} (${team.sigla})`
      : "NENHUM";
    
    

    el.opponentSelected.title = team ? team.name : "Nenhum selecionado";
  }
  
  

  if (el.opponentModalMask) {
    el.opponentModalMask.classList.remove("show");
    el.opponentModalMask.setAttribute("aria-hidden", "true");
    el.opponentModalMask.style.display = "none";
  }
  
  mcScoreboardApplyLogosAndSiglas().catch(() => {});
  mcScoreboardSchedulePersist();
  log(team ? `Opponent: ${team.name} (${team.sigla})` : "Opponent: -");
};

    const mcScoreboardSetControlsDisabled = (disabled) => {
      const items = [
        el.teamSearch,
        el.btnRefreshTeams,
        el.btnCorMandante,
        el.btnCorVisitante,
        el.btnGolLeftPlus,
        el.btnGolLeftMinus,
        el.btnGolRightPlus,
        el.btnGolRightMinus,
        el.btnGolReset,
        el.timerSetInput,
        el.btnTimerStart,
        el.btnTimerPause,
        el.btnTimerResume,
        el.btnTimerReset,
        el.btnTimerStartFrom,
		
        el.btnStatus1T,
        el.btnStatus2T,
        el.btnStatusIntervalo,
        el.btnStatusProrrogacao,
        el.btnStatusPenalti,
      ];
      items.forEach((item) => {
        if (item) item.disabled = !!disabled;
      });
      if (el.teamGrid) el.teamGrid.classList.toggle("is-disabled", !!disabled);
    };

    const normalizeTeamSigla = (sigla, name) => {
      const raw = String(sigla || "").toUpperCase().replace(/\s+/g, "");
      if (/^[A-Z0-9]{3}$/.test(raw)) return raw;
      const fallback = String(name || "").replace(/\s+/g, "").toUpperCase();
      return fallback.slice(0, 3) || raw.slice(0, 3) || "---";
    };

    const normalizeTeamEntry = (entry) => {
      if (!entry) return null;
      if (typeof entry === "string") {
        const base = entry.split(/[\\/]/).pop() || entry;
        const name = base.replace(/\.png$/i, "");
        return {
          name,
          file: entry,
          sigla: normalizeTeamSigla("", name),
        };
      }
      const name = String(entry.name || "");
      const file = String(entry.file || "");
      const sigla = normalizeTeamSigla(entry.sigla, name);
      if (!name || !file) return null;
      return { name, file, sigla };
    };

    const normalizeTeamsPayload = (payload) => {
      if (!payload) return { generatedAt: "", teams: [] };
      if (Array.isArray(payload)) return { generatedAt: "", teams: payload };
      return {
        generatedAt: payload.generatedAt || payload.generated_at || "",
        teams: payload.teams || [],
      };
    };

    const loadTeamsFromGlobal = () => {
      const payload = normalizeTeamsPayload(window.SALVEDREW_TEAMS);
      const teams = (payload.teams || [])
        .map(normalizeTeamEntry)
        .filter(Boolean);
      if (!teams.length) {
        log("Times: fallback Corinthians", {});
        return {
          generatedAt: payload.generatedAt || "",
          teams: [{
            name: "Corinthians",
            file: state.mcScoreboard.corinthiansFile,
            sigla: state.mcScoreboard.corinthiansSigla,
          }],
        };
      }
      return { generatedAt: payload.generatedAt || "", teams };
    };

const renderTeams = (search = "") => {
  if (!el.teamGrid) return;
  
  const needle = String(search || "").toLowerCase().trim();
  const list = needle
    ? state.mcScoreboard.teams.filter((team) =>
        String(team.name || "").toLowerCase().includes(needle) ||
        String(team.sigla || "").toLowerCase().includes(needle)
      )
    : state.mcScoreboard.teams;

  el.teamGrid.innerHTML = "";
  
  if (!list.length) {
    const empty = document.createElement("div");
    empty.className = "teamEmpty";
    empty.textContent = state.mcScoreboard.teams.length 
      ? "Nenhum time encontrado" 
      : "Carregando times...";
    el.teamGrid.appendChild(empty);
    return;
  }

  list.forEach((team) => {
    const item = document.createElement("button");
    item.type = "button";
    const selected = state.mcScoreboard.selectedOpponent && 
                     state.mcScoreboard.selectedOpponent.file === team.file;
    item.className = `teamCard${selected ? " selected" : ""}`;
    item.innerHTML = `<strong>${team.name}</strong><span>${team.sigla}</span>`;
    
    item.addEventListener("click", () => {
      mcScoreboardSetOpponent(team);
      

    });
    
    el.teamGrid.appendChild(item);
  });
};

    const refreshTeams = async ({ force = false, reason = "" } = {}) => {
      try {
        await loadScriptFresh("./teams.data.js", "teamsDataScript", "Times");
      } catch (err) {
        log("Times: erro ao carregar teams.data.js", { err: String(err?.message || err), reason });
      }

      const payload = loadTeamsFromGlobal();
      const normalizedTeams = payload.teams;
      const signature = getFilesSignature(normalizedTeams.map((t) => t.file));
      const shouldApply = force ||
        !state.mcScoreboard.teams.length ||
        (payload.generatedAt && payload.generatedAt !== state.mcScoreboard.lastTeamsGeneratedAt) ||
        (!payload.generatedAt && signature && signature !== state.mcScoreboard.lastTeamsSignature);

      if (!shouldApply) {
        log("Times sem mudanças", { reason });
        return false;
      }

      const prevOpponentFile = state.mcScoreboard.selectedOpponent?.file || state.mcScoreboard._restoreOpponentFile || "";
      state.mcScoreboard.teams = normalizedTeams;
      state.mcScoreboard.lastTeamsGeneratedAt = payload.generatedAt || "";
      state.mcScoreboard.lastTeamsSignature = signature || "";

      const restored = prevOpponentFile
        ? normalizedTeams.find((t) => t.file === prevOpponentFile)
        : null;
      if (restored) {
        state.mcScoreboard.selectedOpponent = restored;
      } else if (!state.mcScoreboard.selectedOpponent) {
        state.mcScoreboard.selectedOpponent = null;
      }
      state.mcScoreboard._restoreOpponentFile = "";

      renderTeams(el.teamSearch ? el.teamSearch.value : "");
      log(`Times carregados: ${normalizedTeams.length}`);
      if (state.mcScoreboard.selectedOpponent) {
        log("Opponent mantido", { name: state.mcScoreboard.selectedOpponent.name });
      } else if (prevOpponentFile) {
        log("Opponent removido (não encontrado)", { file: prevOpponentFile });
      }

      mcScoreboardApplyLogosAndSiglas().catch(() => {});
      return true;
    };

const mcScoreboardEnsureObsBindings = async () => {
  state.mcScoreboard.enabled = false;
  state.mcScoreboard.items = {};

  if (!state.connected || !state.ws) {
    mcScoreboardSetControlsDisabled(true);
    return false;
  }

  

  const targetScene = state.mcScoreboard.groupName; 

  try {
    

    let allItems = [];
    try {
        const groupRes = await state.ws.call("GetGroupSceneItemList", { sceneName: targetScene });
        allItems = groupRes.sceneItems || [];
    } catch (e) {
        const sceneRes = await state.ws.call("GetSceneItemList", { sceneName: targetScene });
        allItems = sceneRes.sceneItems || [];
    }

    const byName = new Map();
    allItems.forEach((it) => byName.set(it.sourceName, it.sceneItemId));

    

    const penaltiesGroupName = (CFG.mc && CFG.mc.penaltiesGroupName) || "MC Penaltis";
    let penaltiesGroupId = null;
    let pkIndividualItems = [];

    const pGroupItem = allItems.find(i => i.sourceName === penaltiesGroupName && i.isGroup);

    if (pGroupItem) {
        penaltiesGroupId = pGroupItem.sceneItemId;
        const pGroupList = await state.ws.call("GetGroupSceneItemList", { sceneName: penaltiesGroupName }).catch(()=>({sceneItems:[]}));
        const pItems = pGroupList.sceneItems || [];
        pItems.forEach(sub => {
            pkIndividualItems.push({ name: sub.sourceName, id: sub.sceneItemId, parent: targetScene });
        });
    } else {
        allItems.forEach(item => {
            if (item.sourceName.startsWith("MC_PK_")) {
                pkIndividualItems.push({ name: item.sourceName, id: item.sceneItemId, parent: targetScene });
            }
        });
    }

    

    const statusIds = {};
    Object.keys(MC_SCOREBOARD_STATUS_MAP).forEach(key => {
        const obsSourceName = MC_SCOREBOARD_STATUS_MAP[key];
        const id = byName.get(obsSourceName);
        if (id) statusIds[obsSourceName] = id;
    });

    state.mcScoreboard.items = {
      groupName: targetScene,
      byName,
      statusIds: statusIds,
      mandoIds: {
        mandante: byName.get("MC_mandante_Icon"),
        visitante: byName.get("MC_visitante_Icon"),
      },
      penaltiesGroupName: penaltiesGroupName,
      penaltiesGroupId: penaltiesGroupId,
      pkIndividualItems: pkIndividualItems,
      
      

      stoppageTxtId: byName.get("MC_Acrescimos"),      

      stoppageBgId: byName.get("MC_Acrescimos_BG"),    

    };

    state.mcScoreboard.enabled = true;
    state.mcScoreboard.penaltiesVisible = null;
    mcScoreboardSetControlsDisabled(false);
    
    

    setTimeout(() => {
        mcScoreboardApplyStatus().catch(() => {});
        mcScoreboardApplyAll().catch(() => {});
        updateStoppageVisibility().catch(() => {}); 

    }, 500);

    return true;
  } catch (err) {
    console.error("MC Placar: Erro fatal nos bindings", err);
    mcScoreboardSetControlsDisabled(true);
    return false;
  }
};

const _obsAlignFactors = (alignment) => {
  const a = Number(alignment);
  

  const map = {
    0:  { ax: 0.0, ay: 0.0 },
    1:  { ax: 0.5, ay: 0.0 },
    2:  { ax: 1.0, ay: 0.0 },
    4:  { ax: 0.0, ay: 0.5 },
    5:  { ax: 0.5, ay: 0.5 },
    6:  { ax: 1.0, ay: 0.5 },
    8:  { ax: 0.0, ay: 1.0 },
    9:  { ax: 0.5, ay: 1.0 },
    10: { ax: 1.0, ay: 1.0 },
  };
  return map[a] || map[5];
};

const _topLeftFromTransform = (tr, w, h) => {
  const px = Number(tr?.positionX) || 0;
  const py = Number(tr?.positionY) || 0;
  const { ax, ay } = _obsAlignFactors(tr?.alignment);
  return { x: px - ax * w, y: py - ay * h };
};

const _obsDisplaySize = (tr, fallbackW = 100, fallbackH = 40) => {
  

  const wFinal = Number(tr?.width) || 0;
  const hFinal = Number(tr?.height) || 0;
  if (wFinal > 0 && hFinal > 0) return { w: wFinal, h: hFinal };

  const scaleX = Number.isFinite(Number(tr?.scaleX)) ? Number(tr.scaleX) : 1;
  const scaleY = Number.isFinite(Number(tr?.scaleY)) ? Number(tr.scaleY) : 1;

  const cropL = Number(tr?.cropLeft) || 0;
  const cropR = Number(tr?.cropRight) || 0;
  const cropT = Number(tr?.cropTop) || 0;
  const cropB = Number(tr?.cropBottom) || 0;

  const srcW = Math.max(0, (Number(tr?.sourceWidth) || 0) - cropL - cropR);
  const srcH = Math.max(0, (Number(tr?.sourceHeight) || 0) - cropT - cropB);

  const baseW = (Number(tr?.boundsWidth) > 0) ? Number(tr.boundsWidth) : (srcW > 0 ? srcW : fallbackW);
  const baseH = (Number(tr?.boundsHeight) > 0) ? Number(tr.boundsHeight) : (srcH > 0 ? srcH : fallbackH);

  

  return { w: baseW * scaleX, h: baseH * scaleY };
};

const enterPenaltiesMode = async () => {
  

  state.match.mode = "penalties";
  state.match.running = false;

  

  state.match.timeMs = 0;
  state.match.addedTime = 0;

  

  

  updateMatchClock(0);

  

  const sceneName = state.mcScoreboard.groupName;
  const txtId = state.mcScoreboard.items.stoppageTxtId;
  const bgId  = state.mcScoreboard.items.stoppageBgId;

  if (sceneName && txtId) {
    await state.ws.call("SetSceneItemEnabled", {
      sceneName,
      sceneItemId: txtId,
      sceneItemEnabled: false,
    });
  }

  if (sceneName && bgId) {
    await state.ws.call("SetSceneItemEnabled", {
      sceneName,
      sceneItemId: bgId,
      sceneItemEnabled: false,
    });
  }

  

  

  if (state.match._tickHandle) {
    clearInterval(state.match._tickHandle);
    state.match._tickHandle = null;
  }
};

const _obsCenterFromTransform = (tr) => {
  const { w, h } = _obsDisplaySize(tr);
  const { ax, ay } = _obsAlignFactors(tr?.alignment);
  const px = Number(tr?.positionX) || 0;
  const py = Number(tr?.positionY) || 0;

  

  const tlX = px - ax * w;
  const tlY = py - ay * h;
  return { cx: tlX + w / 2, cy: tlY + h / 2, w, h };
};


const alignStoppageAssets = async () => {
  if (!state.mcScoreboard?.items?.stoppageTxtId || !state.mcScoreboard?.items?.stoppageBgId) return;

  const sceneName = state.mcScoreboard.groupName;
  const txtId = state.mcScoreboard.items.stoppageTxtId;
  const bgId  = state.mcScoreboard.items.stoppageBgId;

  

  const STOPPAGE_TEXT_SCALE = 3; 

  const PAD_X_RATIO = 0.10;         

  const PAD_Y_RATIO = 0.05;         

  


  try {
    

    const bgData = await state.ws.call("GetSceneItemTransform", {
      sceneName,
      sceneItemId: bgId,
    });
    const bg = bgData?.sceneItemTransform || {};

    const sX = Number.isFinite(bg.scaleX) ? bg.scaleX : 1;
    const sY = Number.isFinite(bg.scaleY) ? bg.scaleY : 1;

    const baseW =
      (Number.isFinite(bg.boundsWidth) && bg.boundsWidth > 0 ? bg.boundsWidth : bg.sourceWidth) || 1;
    const baseH =
      (Number.isFinite(bg.boundsHeight) && bg.boundsHeight > 0 ? bg.boundsHeight : bg.sourceHeight) || 1;

    const bgW = Math.max(1, baseW * sX);
    const bgH = Math.max(1, baseH * sY);

    

    const a = Number.isFinite(bg.alignment) ? bg.alignment : 0;
    const isLeft   = (a & 1) === 1;
    const isRight  = (a & 2) === 2;
    const isTop    = (a & 4) === 4;
    const isBottom = (a & 8) === 8;

    const anchorX = isLeft ? 0 : isRight ? bgW : bgW / 2;
    const anchorY = isTop  ? 0 : isBottom ? bgH : bgH / 2;

    const posX = Number.isFinite(bg.positionX) ? bg.positionX : 0;
    const posY = Number.isFinite(bg.positionY) ? bg.positionY : 0;

    const bgTLX = posX - anchorX;
    const bgTLY = posY - anchorY;
    const centerX = bgTLX + bgW / 2;
    const centerY = bgTLY + bgH / 2;

    

    const padX = Math.max(2, Math.round(bgW * PAD_X_RATIO));
    const padY = Math.max(1, Math.round(bgH * PAD_Y_RATIO));

    const boundsW = Math.max(1, Math.round(bgW - padX * 2));
    const boundsH = Math.max(1, Math.round(bgH - padY * 2));

    

    await state.ws.call("SetSceneItemTransform", {
      sceneName,
      sceneItemId: txtId,
      sceneItemTransform: {
        positionX: centerX,
        positionY: centerY,
        alignment: 0, 

        rotation: 0,

        

        scaleX: STOPPAGE_TEXT_SCALE,
        scaleY: STOPPAGE_TEXT_SCALE,

        

        boundsType: "OBS_BOUNDS_SCALE_INNER",
        boundsAlignment: 0,
        boundsWidth: boundsW,
        boundsHeight: boundsH,
      },
    });

    

    await state.ws.call("SetInputSettings", {
      inputName: "MC_Acrescimos",
      inputSettings: {
        align: "center",
        valign: "center",
        use_extents: true,
        extents_cx: boundsW,
        extents_cy: boundsH,
        extents_wrap: false,
      },
      overlay: true,
    }).catch(() => {});
  } catch (err) {
    console.error("[ACRESCIMO] alignStoppageAssets falhou:", err?.message || err);
  }
};




















let mcEscudoConfig = {
  left: { pos: null, scale: null },  

  right: { pos: null, scale: null }, 

  captured: false
};



async function mcScoreboardCaptureConfig() {
  if (!state.connected || !state.mcScoreboard.enabled) return;
  if (mcEscudoConfig.captured) return; 


  try {
    const groupName = state.mcScoreboard.groupName;
    const leftId = state.mcScoreboard.items.byName.get("MC_EscudoLeft");
    const rightId = state.mcScoreboard.items.byName.get("MC_EscudoRight");

    if (!leftId || !rightId) return;

    

    const [trLeft, trRight] = await Promise.all([
      state.ws.call("GetSceneItemTransform", { sceneName: groupName, sceneItemId: leftId }),
      state.ws.call("GetSceneItemTransform", { sceneName: groupName, sceneItemId: rightId })
    ]);

    const l = trLeft.sceneItemTransform;
    const r = trRight.sceneItemTransform;

    

    mcEscudoConfig.left.pos = { positionX: l.positionX, positionY: l.positionY, alignment: l.alignment };
    mcEscudoConfig.right.pos = { positionX: r.positionX, positionY: r.positionY, alignment: r.alignment };

    

    const extractSize = (t) => ({
      scaleX: t.scaleX, scaleY: t.scaleY,
      boundsWidth: t.boundsWidth, boundsHeight: t.boundsHeight,
      boundsType: t.boundsType,
      cropTop: t.cropTop, cropBottom: t.cropBottom, cropLeft: t.cropLeft, cropRight: t.cropRight
    });

    

    mcEscudoConfig.left.scale = extractSize(l);  
    mcEscudoConfig.right.scale = extractSize(r); 

    mcEscudoConfig.captured = true;
    log("MC Placar: Configuração de escudos capturada com sucesso.");

  } catch (e) {
    log("MC Placar: Erro ao capturar config inicial", e);
  }
}








let mcShieldsCache = {
  leftX: null,  

  rightX: null, 

  corBaseY: null, 

  advBaseY: null, 

  captured: false
};

async function mcScoreboardApplyLogosAndSiglas() {
  if (!state?.mcScoreboard?.enabled) return;

  const groupName = state.mcScoreboard.groupName;
  const idCor = state.mcScoreboard.items.byName.get("MC_EscudoLeft");
  const idAdv = state.mcScoreboard.items.byName.get("MC_EscudoRight");

  if (!idCor || !idAdv) return;

  

  

  if (!mcShieldsCache.captured) {
    try {
      const [t1, t2] = await Promise.all([
        state.ws.call("GetSceneItemTransform", { sceneName: groupName, sceneItemId: idCor }),
        state.ws.call("GetSceneItemTransform", { sceneName: groupName, sceneItemId: idAdv })
      ]);

      const x1 = t1.sceneItemTransform.positionX;
      const x2 = t2.sceneItemTransform.positionX;

      

      mcShieldsCache.leftX = Math.min(x1, x2);
      mcShieldsCache.rightX = Math.max(x1, x2);

      

      

      mcShieldsCache.corBaseY = t1.sceneItemTransform.positionY;
      mcShieldsCache.advBaseY = t2.sceneItemTransform.positionY;
      
      mcShieldsCache.captured = true;
      log("MC Placar: Posições calibradas (X cruzado, Y fixo)");
    } catch (e) {
      log("Erro ao capturar escudos", e);
      return; 
    }
  }

  

  const opponent = state.mcScoreboard.selectedOpponent;
  const corFile = state.mcScoreboard.corinthiansFile;
  const advFile = opponent ? opponent.file : "";

  

  await mcScoreboardCall("SetInputSettings", {
    inputName: "MC_EscudoLeft",
    inputSettings: { file: corFile ? resolveProjectPath(corFile) : "" },
    overlay: true,
  });

  

  await mcScoreboardCall("SetInputSettings", {
    inputName: "MC_EscudoRight",
    inputSettings: { file: advFile ? resolveProjectPath(advFile) : "" },
    overlay: true,
  });

  

  const corSide = state.mcScoreboard.corinthiansSide; 
  const corSigla = state.mcScoreboard.corinthiansSigla;
  const advSigla = opponent ? opponent.sigla : "---";

  

  await mcScoreboardCall("SetInputSettings", { 
    inputName: "MC_SiglaLeft", 
    inputSettings: { text: corSide === "left" ? corSigla : advSigla }, 
    overlay: true 
  });

  

  await mcScoreboardCall("SetInputSettings", { 
    inputName: "MC_SiglaRight", 
    inputSettings: { text: corSide === "left" ? advSigla : corSigla }, 
    overlay: true 
  });

  

  if (mcShieldsCache.captured) {
    

    

    

    const targetXCor = corSide === "left" ? mcShieldsCache.leftX : mcShieldsCache.rightX;
    
    

    

    

    const targetXAdv = corSide === "left" ? mcShieldsCache.rightX : mcShieldsCache.leftX;

    await state.ws.call("SetSceneItemTransform", {
      sceneName: groupName, sceneItemId: idCor,
      sceneItemTransform: { positionX: targetXCor, positionY: mcShieldsCache.corBaseY }
    });

    await state.ws.call("SetSceneItemTransform", {
      sceneName: groupName, sceneItemId: idAdv,
      sceneItemTransform: { positionX: targetXAdv, positionY: mcShieldsCache.advBaseY }
    });
  }

  

  const mandoIds = state.mcScoreboard.items?.mandoIds || {};
  if (mandoIds.mandante) {
    await mcScoreboardCall("SetSceneItemEnabled", { sceneName: groupName, sceneItemId: mandoIds.mandante, sceneItemEnabled: corSide === "left" });
  }
  if (mandoIds.visitante) {
    await mcScoreboardCall("SetSceneItemEnabled", { sceneName: groupName, sceneItemId: mandoIds.visitante, sceneItemEnabled: corSide === "right" });
  }
}

    const mcScoreboardApplyGoals = async () => {
      if (!state.mcScoreboard.enabled) return;
      await mcScoreboardCall("SetInputSettings", {
        inputName: "MC_GolsLeft",
        inputSettings: { text: String(state.mcScoreboard.goalsLeft) },
        overlay: true,
      }, "golsLeft");

      await mcScoreboardCall("SetInputSettings", {
        inputName: "MC_GolsRight",
        inputSettings: { text: String(state.mcScoreboard.goalsRight) },
        overlay: true,
      }, "golsRight");
    };

const mcScoreboardSetPenaltiesVisible = async (isVisible) => {
  if (!state.mcScoreboard.enabled) {
    state.mcScoreboard.penaltiesVisible = isVisible;
    return;
  }

  if (state.mcScoreboard.penaltiesVisible === isVisible) return;
  state.mcScoreboard.penaltiesVisible = isVisible;
  const token = ++state.mcScoreboard.penaltiesVisibilityToken;

  const resolution = await resolvePenaltyGroupAndItemsIds({ context: "mcScoreboardSetPenaltiesVisible" });
  const groupName = resolution.rootSceneName;

  if (resolution.penaltiesGroupId) {
    await mcScoreboardCall("SetSceneItemEnabled", {
      sceneName: groupName,
      sceneItemId: resolution.penaltiesGroupId,
      sceneItemEnabled: isVisible,
    }, "penalties-group");
    if (token !== state.mcScoreboard.penaltiesVisibilityToken) return;
  }

  if (!resolution.items.length) {
    if (!state.mcScoreboard.penaltiesWarnedMissing) {
      log("[WARN] MC Placar: grupo/itens de pênalti não encontrados.", {
        penaltiesGroupName: resolution.penaltiesGroupName,
      });
      state.mcScoreboard.penaltiesWarnedMissing = true;
    }
    return;
  }

  for (const item of resolution.items) {
    if (!item.sceneItemId || !item.sceneName) continue;
    await mcScoreboardCall("SetSceneItemEnabled", {
      sceneName: item.sceneName,
      sceneItemId: item.sceneItemId,
      sceneItemEnabled: isVisible,
    }, `penalties-item:${item.name}`);
    if (token !== state.mcScoreboard.penaltiesVisibilityToken) return;
  }

  if (!isVisible && resolution.penaltiesGroupId) {
    await mcScoreboardCall("SetSceneItemEnabled", {
      sceneName: groupName,
      sceneItemId: resolution.penaltiesGroupId,
      sceneItemEnabled: false,
    }, "penalties-group");
  }
};

const mcScoreboardApplyStatus = async () => {
  if (!state.mcScoreboard.enabled) return;
  
  const statusName = MC_SCOREBOARD_STATUS_MAP[state.mcScoreboard.status];
  const ids = state.mcScoreboard.items.statusIds || {};
  const groupName = state.mcScoreboard.groupName;
  const names = Object.values(MC_SCOREBOARD_STATUS_MAP);

  

  for (const name of names) {
    const sceneItemId = ids[name];
    if (!sceneItemId) continue;
    await mcScoreboardCall("SetSceneItemEnabled", {
      sceneName: groupName,
      sceneItemId,
      sceneItemEnabled: name === statusName,
    }, `status:${name}`);
  }

  

  const isPenalti = state.mcScoreboard.status === "penalti";
  await mcScoreboardSetPenaltiesVisible(isPenalti);
};




    const updateAggUi = () => {
      

      if (el.uiAggLeft) el.uiAggLeft.textContent = state.mcScoreboard.aggLeft;
      if (el.uiAggRight) el.uiAggRight.textContent = state.mcScoreboard.aggRight;

      

      const totalLeft = state.mcScoreboard.goalsLeft + state.mcScoreboard.aggLeft;
      const totalRight = state.mcScoreboard.goalsRight + state.mcScoreboard.aggRight;
      
      

      if (el.uiAggTotalDisplay) el.uiAggTotalDisplay.textContent = `(${totalLeft}) - (${totalRight})`;

      

      if (el.btnToggleAgg) {
        const isOn = state.mcScoreboard.aggEnabled;
        el.btnToggleAgg.classList.toggle("active", isOn);
        el.btnToggleAgg.innerHTML = isOn 
          ? `<span class="material-symbols-outlined">calculate</span> AGREGADO: ON`
          : `<span class="material-symbols-outlined">calculate</span> AGREGADO: OFF`;
      }

      

      if (el.aggControls) {
        el.aggControls.classList.toggle("isHidden", !state.mcScoreboard.aggEnabled);
      }
    };

    const applyAggToObs = async () => {
      if (!state.connected || !state.mcScoreboard.enabled) return;

      const isOn = state.mcScoreboard.aggEnabled;
      const groupName = state.mcScoreboard.groupName;

      

      const inputGroup = "MC_Agregado_Group"; 
      const inputTxtLeft = "MC_Agregado_Txt_Left";
      const inputTxtRight = "MC_Agregado_Txt_Right";

      

      const totalLeft = state.mcScoreboard.goalsLeft + state.mcScoreboard.aggLeft;
      const totalRight = state.mcScoreboard.goalsRight + state.mcScoreboard.aggRight;

      

      

      const textL = `(${totalLeft})`;
      const textR = `(${totalRight})`;

      await mcScoreboardCall("SetInputSettings", { inputName: inputTxtLeft, inputSettings: { text: textL }, overlay: true }).catch(()=>{});
      await mcScoreboardCall("SetInputSettings", { inputName: inputTxtRight, inputSettings: { text: textR }, overlay: true }).catch(()=>{});

      

      try {
          

          await state.ws.call("SetSceneItemEnabled", { sceneName: groupName, sceneItemId: await getSceneItemId(groupName, inputGroup), sceneItemEnabled: isOn });
      } catch {
          

          const idL = await getSceneItemId(groupName, inputTxtLeft);
          const idR = await getSceneItemId(groupName, inputTxtRight);
          if (idL) await state.ws.call("SetSceneItemEnabled", { sceneName: groupName, sceneItemId: idL, sceneItemEnabled: isOn });
          if (idR) await state.ws.call("SetSceneItemEnabled", { sceneName: groupName, sceneItemId: idR, sceneItemEnabled: isOn });
      }
    };

    const getSceneItemId = async (sceneName, sourceName) => {
        try {
            const resp = await state.ws.call("GetSceneItemId", { sceneName, sourceName });
            return resp.sceneItemId;
        } catch { return null; }
    };

    const toggleAggregate = async () => {
        state.mcScoreboard.aggEnabled = !state.mcScoreboard.aggEnabled;
        updateAggUi();
        await applyAggToObs();
        mcScoreboardSchedulePersist();
    };

    const adjustAggGoal = async (side, delta) => {
        if (side === "left") {
            state.mcScoreboard.aggLeft = Math.max(0, state.mcScoreboard.aggLeft + delta);
        } else {
            state.mcScoreboard.aggRight = Math.max(0, state.mcScoreboard.aggRight + delta);
        }
        updateAggUi();
        await applyAggToObs();
        mcScoreboardSchedulePersist();
    };

    const mcScoreboardApplyAll = async () => {
      if (!state.mcScoreboard.enabled) return;
      await mcScoreboardApplyLogosAndSiglas();
      if (typeof mcScoreboardApplyGoals === "function") {
        await mcScoreboardApplyGoals();
      } else {
        console.log("mcScoreboardApplyGoals ausente — ignorando");
      }
      await mcPenaltiesApply();
      await mcScoreboardApplyStatus();
      await mcScoreboardApplyChronometerText();
    };

    

    const openPlayersModal = async () => {
      if (!el.playersModal) return;
      await refreshRoster({ force: false, reason: "openPlayersModal" });
      el.playersModal.classList.add("show");
      renderPlayersList(el.playerSearch ? el.playerSearch.value : "");
      updateSelectedPlayerInfo();
    };

    const closePlayersModal = () => {
      if (!el.playersModal) return;
      el.playersModal.classList.remove("show");
      state.selectedPlayer = null;
      updateSelectedPlayerInfo();
    };

    const renderPlayersList = (search = "") => {
      if (!el.playersList) return;

      const filtered = filterAndSortRoster(state.roster, search);

      const hasSearch = !!String(search || "").trim();
      el.playersList.innerHTML = "";
      if (!filtered.length) {
        const empty = document.createElement("div");
        empty.className = "emptyMessage";
        empty.textContent = hasSearch ? "Nenhum jogador encontrado" : "Nenhum jogador cadastrado";
        el.playersList.appendChild(empty);
        return;
      }

      filtered.forEach((player) => {
        const item = document.createElement("div");
        item.className = `playerItem ${state.selectedPlayer === player ? "selected" : ""}`;
        const firstLetter = String(player.name || "?").charAt(0).toUpperCase();
        const fileName = player.file ? String(player.file).replace(CFG.playersPath + "/", "") : "(sem arquivo)";
        const label = buildRosterDisplayLabel(player);

        item.innerHTML =
          `<div class="playerAvatar">${firstLetter}</div>` +
          `<div class="playerInfo">` +
          `<strong>${label}</strong>` +
          `<small>${player.team || "Sem time"} • ${player.position || "Sem posição"}</small>` +
          `<small class="filePath">${fileName}</small>` +
          `</div>`;

        item.addEventListener("click", () => {
          state.selectedPlayer = player;
          renderPlayersList(search);
          updateSelectedPlayerInfo();
        });

        el.playersList.appendChild(item);
      });
    };

    const updateSelectedPlayerInfo = () => {
      if (!el.selectedPlayerInfo) return;

      if (!state.selectedPlayer) {
        el.selectedPlayerInfo.innerHTML = "<p>Selecione um jogador para ver detalhes</p>";
        return;
      }

      const p = state.selectedPlayer;
      const fileName = p.file ? String(p.file).replace(CFG.playersPath + "/", "") : "(sem arquivo)";

      el.selectedPlayerInfo.innerHTML =
        `<h4>${p.name}</h4>` +
        `<p><strong>Time:</strong> ${p.team || "Não informado"}</p>` +
        `<p><strong>Posição:</strong> ${p.position || "Não informada"}</p>` +
        `<p><strong>Arquivo:</strong> ${fileName}</p>` +
        `<button id="btnUsePlayer" class="btn small">Usar no alvo</button>`;

      setTimeout(() => {
        const btnUse = document.getElementById("btnUsePlayer");
        if (!btnUse) return;
        btnUse.addEventListener("click", async () => {
          const sel = getActiveSelection();
          if (!sel || !sel.name || !p.file) return;
          setBusy(true);
          try {
            await state.ws.call("SetInputSettings", {
              inputName: sel.name,
              inputSettings: { file: resolveProjectPath(p.file) },
              overlay: true,
            });
            if (sel.kind === "reserve") {
              updateReserveState(sel.name, { playerName: p.name, file: p.file });
            } else {
              updateSlotState(sel.name, { playerName: p.name, file: p.file });
            }
          } finally {
            setBusy(false);
            closePlayersModal();
          }
        });
      }, 0);
    };

    

    const updateReserveCount = () => {
      if (el.reserveCount) el.reserveCount.textContent = `${state.reserveSelection.length}/12`;
      if (el.btnReserveConfirm) el.btnReserveConfirm.disabled = state.reserveSelection.length !== 12;
    };

    const openReservesModal = async () => {
      if (!el.reservesModal) return;
      await refreshRoster({ force: false, reason: "openReservesModal" });
      state.reserveSelection = [];
      el.reservesModal.classList.add("show");
      el.reservesModal.setAttribute("aria-hidden", "false");
      if (el.reserveSearch) el.reserveSearch.value = "";
      renderReserveRoster("");
      updateReserveCount();
      setTimeout(() => { if (el.reserveSearch) el.reserveSearch.focus(); }, 0);
    };

    const closeReservesModal = () => {
      if (!el.reservesModal) return;
      el.reservesModal.classList.remove("show");
      el.reservesModal.setAttribute("aria-hidden", "true");
    };

const toggleReserveSelection = (player) => {
      

      const idx = state.reserveSelection.findIndex((p) => p.file === player.file);
      
      if (idx >= 0) {
        state.reserveSelection.splice(idx, 1);
      } else {
        if (state.reserveSelection.length < 12) {
          state.reserveSelection.push(player);
        }
      }
      updateReserveCount();
    };

const renderReserveRoster = (q) => {
  if (!el.reserveList) return;

  

  const previousScroll = el.reserveList.scrollTop;

  const list = Array.isArray(state.reserveOptions) ? state.reserveOptions : [];
  const filtered = filterAndSortRoster(list, q);

  el.reserveList.innerHTML = "";

  if (!filtered.length) {
    const div = document.createElement("div");
    div.className = "rosterEmpty";
    div.textContent = list.length ? "Nenhuma reserva encontrada." : "Nenhuma reserva cadastrada.";
    el.reserveList.appendChild(div);
    return;
  }

  filtered.forEach((p) => {
    const item = document.createElement("div");
    
    const isSelected = state.reserveSelection.some((sel) => sel.file === p.file);
    item.className = `rosterItem${isSelected ? " selected" : ""}`;

    const fileName = p.file ? String(p.file).split(/[\\/]/).pop() : "";
    const displayName = p.name || cleanPlayerName(p.file);

    item.innerHTML =
      `<div><strong>${displayName}</strong></div>` +
      `<small class="filePath" style="opacity:0.6; font-size:10px">${fileName}</small>`;

    item.addEventListener("click", () => {
      if (!p.file) return;
      toggleReserveSelection(p);
      
      const currentSearch = el.reserveSearch ? el.reserveSearch.value : "";
      renderReserveRoster(currentSearch);
      
      

      if(el.reserveSearch) el.reserveSearch.focus({ preventScroll: true });
    });

    el.reserveList.appendChild(item);
  });
  
  updateReserveCount();

  

  el.reserveList.scrollTop = previousScroll;
};

    const buildReserveFilePathFromFile = (filePath) => {
      const normalized = resolveProjectPath(filePath || "");
      const fileName = normalized.split("/").pop() || "";
      if (!fileName) return "";
      if (fileName.toLowerCase().endsWith("_res.png")) return `${CFG.reservesPath}/${fileName}`;
      return `${CFG.reservesPath}/${fileName.replace(/\.png$/i, "_res.png")}`;
    };

    const buildMainFilePathFromReserveFile = (filePath) => {
      const normalized = resolveProjectPath(filePath || "");
      const fileName = normalized.split("/").pop() || "";
      if (!fileName) return "";
      if (!fileName.toLowerCase().endsWith("_res.png")) return normalized;
      return `${CFG.playersPath}/${fileName.replace(/_res\.png$/i, ".png")}`;
    };

    const getBaseFileName = (filePath) => {
      const normalized = resolveProjectPath(filePath || "");
      return normalized.split("/").pop() || "";
    };

    const normalizePlayerBaseName = (fileName) =>
      String(fileName || "")
        .replace(/_res\.png$/i, ".png")
        .replace(/\.png$/i, "")
        .trim()
        .toLowerCase();

const getRosterEntryForFile = (filePath) => {
  const base = cleanPlayerName(filePath).toLowerCase();
  if (!base) return null;
  const reservesList = Array.isArray(state.reserveOptions) ? state.reserveOptions : [];
  const allEntries = [...reservesList, ...state.roster];
  return allEntries.find((p) => cleanPlayerName(p.file).toLowerCase() === base) || null;
};


    const buildReserveLabel = (reserveName, filePath) => {
      if (!filePath) return `${reserveName} (vazio)`;
      const rosterEntry = getRosterEntryForFile(filePath);
      if (rosterEntry) {
        const fileBase = getBaseFileName(filePath);
        const isReserveFile = /_res\.png$/i.test(fileBase);
        return buildRosterDisplayLabel(rosterEntry, { reserveOverride: isReserveFile || rosterEntry.isReserve });
      }
      const base = normalizePlayerBaseName(getBaseFileName(filePath));
      return base ? base.replace(/\b\w/g, (c) => c.toUpperCase()) : reserveName;
    };

const derivePlayerNameFromFile = (filePath, fallbackId = "") => {
  if (!filePath) return fallbackId || "";
  
  const rosterEntry = getRosterEntryForFile(filePath);
  if (rosterEntry && rosterEntry.name) return rosterEntry.name;

  const cleaned = cleanPlayerName(filePath);
  if (cleaned && cleaned.length > 1) return cleaned;

  return fallbackId;
};

const resolveToastTargetName = (selection) => {
  if (!selection || !selection.name) return "";
  
  const isReserve = selection.kind === "reserve";
  const entry = isReserve ? state.reserves[selection.name] : state.slots[selection.name];
  
  if (entry && entry.playerName) return entry.playerName;
  if (entry && entry.file) return derivePlayerNameFromFile(entry.file, selection.name);
  
  return cleanPlayerName(selection.name);
};

    const registerReserves = async () => {
      if (state.reserveSelection.length !== 12) {
        alert("Selecione exatamente 12 reservas.");
        return;
      }
      setBusy(true);
      try {
        let lastReserveName = "";
        for (let i = 0; i < 12; i++) {
          const player = state.reserveSelection[i];
          const reserveName = mcReserveName(i + 1);
          const reserveFile = buildReserveFilePathFromFile(player.file);
          await state.ws.call("SetInputSettings", {
            inputName: reserveName,
            inputSettings: { file: resolveProjectPath(reserveFile) },
            overlay: true,
          });
          state.reserves[reserveName] = { playerName: player.name, file: reserveFile };
          lastReserveName = reserveName;
        }
        persistReserveState();
        renderReserveSelect();
        if (lastReserveName) {
          state.selectedMcReserve = lastReserveName;
          if (el.reserveSelect) el.reserveSelect.value = lastReserveName;
        }
        closeReservesModal();
      } catch (err) {
        log("ERRO: cadastrar reservas", { err: String((err && err.status && err.status.comment) || err && err.message || err) });
      } finally {
        setBusy(false);
      }
    };

const setReserveSwapEnabled = async (reserveName, enabled) => {
  const swapName = `${reserveName}${CFG.mc.swapSuffix}`;
  const swapIt = state.mcReserveSwapByName.get(swapName);
  
  if (!swapIt) {
    log("AVISO: swap de reserva não encontrado", { swapName });
    return;
  }
  
  if (!state.mcGroupFxName) {
    log("ERRO: mcGroupFxName não está definido. Execute sync primeiro.");
    return;
  }
  
  await state.ws.call("SetSceneItemEnabled", {
    sceneName: state.mcGroupFxName,  

    sceneItemId: swapIt.id,
    sceneItemEnabled: enabled
  });
  
  swapIt.enabled = enabled;
  state.mcReserveSwapByName.set(swapName, swapIt);
  log(`Swap reserva ${swapName} ${enabled ? "ativado" : "desativado"}`);
  
  

  if (enabled) {
    await ensureCardAboveSwap(state.mcGroupFxName, `${reserveName}${CFG.cardSuffix}`, swapName);
  }
  await enforceMcOverlaysOnTop();
};

const setSlotSwapEnabled = async (slotNameValue, enabled) => {
  const swapName = `${slotNameValue}${CFG.mc.swapSuffix}`;
  const swapIt = state.mcSlotSwapByName.get(swapName);
  
  if (!swapIt) {
    log("AVISO: swap de campo não encontrado", { swapName });
    return;
  }
  
  

  if (!state.mcGroupCardsName) {
    log("ERRO: mcGroupCardsName não está definido. Execute sync primeiro.");
    return;
  }
  
  await state.ws.call("SetSceneItemEnabled", {
    sceneName: state.mcGroupCardsName,
    sceneItemId: swapIt.id,
    sceneItemEnabled: enabled
  });
  
  swapIt.enabled = enabled;
  state.mcSlotSwapByName.set(swapName, swapIt);
  log(`Swap campo ${swapName} ${enabled ? "ativado" : "desativado"}`);
  if (enabled) {
    await ensureCardAboveSwap(state.mcGroupCardsName, `${slotNameValue}${CFG.cardSuffix}`, swapName);
  }
};

    const setReserveCardState = async (reserveName, enabled, file) => {
      const cardName = `${reserveName}${CFG.cardSuffix}`;
      const cardIt = state.mcReserveCardByName.get(cardName);
      if (!cardIt) return;

      if (enabled && file) {
        await state.ws.call("SetInputSettings", {
          inputName: cardName,
          inputSettings: { file: resolveProjectPath(file) },
          overlay: true,
        });
      }

      await state.ws.call("SetSceneItemEnabled", {
        sceneName: state.mcGroupFxName,
        sceneItemId: cardIt.id,
        sceneItemEnabled: enabled,
      });
      cardIt.enabled = enabled;
      state.mcReserveCardByName.set(cardName, cardIt);
    };

const swapMcCardStates = async (slotNameValue, reserveNameValue) => {
  const slotCardName = `${slotNameValue}${CFG.cardSuffix}`;
  const reserveCardName = `${reserveNameValue}${CFG.cardSuffix}`;
  const slotCardIt = state.mcCardByName.get(slotCardName);
  const reserveCardIt = state.mcReserveCardByName.get(reserveCardName);
  
  if (!slotCardIt || !reserveCardIt) return;

  

  if (!state.mcGroupCardsName || !state.mcGroupFxName) {
    log("ERRO: Grupos não estão definidos. Execute sync primeiro.");
    return;
  }

  const [slotSettings, reserveSettings] = await Promise.all([
    state.ws.call("GetInputSettings", { inputName: slotCardName }).catch(() => ({})),
    state.ws.call("GetInputSettings", { inputName: reserveCardName }).catch(() => ({})),
  ]);
  
  const slotFile = (slotSettings && slotSettings.inputSettings && slotSettings.inputSettings.file) || "";
  const reserveFile = (reserveSettings && reserveSettings.inputSettings && reserveSettings.inputSettings.file) || "";
  const reserveColor = inferCardColor(reserveFile, CFG.mc.reserveCardFiles);
  const slotColor = inferCardColor(slotFile, CFG.mc.cardFiles);
  const slotHadCard = !!slotCardIt.enabled;
  const reserveHadCard = !!reserveCardIt.enabled;

  if (reserveHadCard && reserveColor) {
    await state.ws.call("SetInputSettings", {
      inputName: slotCardName,
      inputSettings: { file: resolveProjectPath(CFG.mc.cardFiles[reserveColor]) },
      overlay: true
    });
  }

  await state.ws.call("SetSceneItemEnabled", {
    sceneName: state.mcGroupCardsName,
    sceneItemId: slotCardIt.id,
    sceneItemEnabled: !!(reserveHadCard && reserveColor),
  });
  slotCardIt.enabled = !!(reserveHadCard && reserveColor);
  state.mcCardByName.set(slotCardName, slotCardIt);

  if (slotHadCard && slotColor) {
    await state.ws.call("SetInputSettings", {
      inputName: reserveCardName,
      inputSettings: { file: resolveProjectPath(CFG.mc.reserveCardFiles[slotColor]) },
      overlay: true
    });
  }

  await state.ws.call("SetSceneItemEnabled", {
    sceneName: state.mcGroupFxName,
    sceneItemId: reserveCardIt.id,
    sceneItemEnabled: !!(slotHadCard && slotColor),
  });
  reserveCardIt.enabled = !!(slotHadCard && slotColor);
  state.mcReserveCardByName.set(reserveCardName, reserveCardIt);

  await ensureCardAboveSwap(state.mcGroupCardsName, slotCardName, `${slotNameValue}${CFG.mc.swapSuffix}`);
  await ensureCardAboveSwap(state.mcGroupFxName, reserveCardName, `${reserveNameValue}${CFG.mc.swapSuffix}`);
};



const isMcSynced = () => {
  return state.connected && 
         state.mcGroupSlotsName && 
         state.mcGroupCardsName && 
         state.mcGroupReservesName && 
         state.mcGroupFxName;
};



const ensureMcSynced = () => {
  if (!isMcSynced()) {
    log("AVISO: MC não está sincronizado. Execute 'Sync' primeiro ou alterne para o MC.");
    return false;
  }
  return true;
};



const swapMcPlayers = async () => {
  

  if (!state.selectedMcSlot || !state.selectedMcReserve) {
    log("ERRO: Selecione um slot e uma reserva primeiro");
    return;
  }

  setBusy(true);
  let swapCommitted = false;

  

  const slotId = state.selectedMcSlot;       

  const reserveId = state.selectedMcReserve; 


  

  const slotEntry = state.slots[slotId];
  const reserveEntry = state.reserves[reserveId];

  let outName = slotEntry && slotEntry.playerName ? slotEntry.playerName : "";
  let inName = reserveEntry && reserveEntry.playerName ? reserveEntry.playerName : "";

  try {
    

    if (!outName || !inName) {
        const [sSet, rSet] = await Promise.all([
             state.ws.call("GetInputSettings", { inputName: slotId }).catch(()=>({})),
             state.ws.call("GetInputSettings", { inputName: reserveId }).catch(()=>({}))
        ]);
        const sFile = sSet.inputSettings?.file || "";
        const rFile = rSet.inputSettings?.file || "";
        
        if (!outName) outName = derivePlayerNameFromFile(sFile, "Jogador");
        if (!inName) inName = derivePlayerNameFromFile(rFile, "Reserva");
    }

    log(`🔁 Iniciando swap: ${outName} (Sai) ↔ ${inName} (Entra)`);

    

    

    

    await Promise.all([
        syncSlotWithOverlays(slotId, true),
        syncSlotWithOverlays(reserveId, true)
    ]);
    


    if (!state.mcGoalBallStack.length) {
      await syncGoalBalls({ context: "swap-prep" });
    }

    

    const currentSlotSettings = await state.ws.call("GetInputSettings", { inputName: slotId }).catch(()=>({}));
    const currentResSettings = await state.ws.call("GetInputSettings", { inputName: reserveId }).catch(()=>({}));
    
    const slotPath = currentSlotSettings.inputSettings?.file || "";
    const resPath = currentResSettings.inputSettings?.file || "";

    const incomingMainFile = buildMainFilePathFromReserveFile(resPath);
    const outgoingReserveFile = buildReserveFilePathFromFile(slotPath);

    

    try { await setSlotSwapEnabled(slotId, true); } catch (e) {}
    try { await setReserveSwapEnabled(reserveId, true); } catch (e) {}

    await delay(CFG.mc.swapDelayMs);

    

    if (incomingMainFile) {
        await state.ws.call("SetInputSettings", { inputName: slotId, inputSettings: { file: resolveProjectPath(incomingMainFile) }, overlay: true });
    }
    if (outgoingReserveFile) {
        await state.ws.call("SetInputSettings", { inputName: reserveId, inputSettings: { file: resolveProjectPath(outgoingReserveFile) }, overlay: true });
    }
    swapCommitted = true;

    

    await swapMcCardStates(slotId, reserveId);

    

    if (incomingMainFile) {
        updateSlotState(slotId, { playerName: inName, file: incomingMainFile });
    } else {
        updateSlotState(slotId, null);
    }
    
    if (outgoingReserveFile) {
        updateReserveState(reserveId, { playerName: outName, file: outgoingReserveFile });
    } else {
        updateReserveState(reserveId, null);
    }

    log(`✅ Swap concluído.`);

  } catch (err) {
    log("ERRO no swap:", err?.message || err);
  } finally {
    if (swapCommitted) {
      try {
        await reconcileBallsAfterSwap([
          { from: slotId, to: reserveId },
          { from: reserveId, to: slotId },
        ]);
      } catch (err) {
        log("[BALL] reconcile swap falhou", { err: String(err?.message || err) });
      }
    }
    
    

    if (outName && inName && outName !== "Jogador" && inName !== "Reserva") {
        enqueueToast({
          type: "SUB",
          ttlMs: CFG.toast.ttlSubMs,
          textLine1: "SUBSTITUIÇÃO",
          outName: outName,
          inName: inName,
          slotId: slotId,
          target: "mc",
        });
    }
    setBusy(false);
  }
};

const verifySwapExists = async (swapName, swapMap) => {
  const swapIt = swapMap.get(swapName);
  if (!swapIt) {
    log(`❌ Swap não encontrado no mapa: ${swapName}`);
    return false;
  }
  
  

  try {
    const itemInfo = await state.ws.call("GetSceneItemId", {
      sceneName: state.mcGroupCardsName,
      sourceName: swapName
    }).catch(() => null);
    
    if (!itemInfo) {
      log(`❌ Swap ${swapName} não existe no OBS (grupo: ${state.mcGroupCardsName})`);
      return false;
    }
    
    log(`✅ Swap ${swapName} verificado: ID=${itemInfo.sceneItemId}`);
    return true;
  } catch (err) {
    log(`❌ Erro ao verificar swap ${swapName}:`, err?.message || err);
    return false;
  }
};


const diagnoseSwapIssue = async () => {
  log("=== DIAGNÓSTICO DE SWAP ===");
  
  

  log("Estado atual:", {
    target: state.target,
    mcSelectionMode: state.mcSelectionMode,
    selectedMcSlot: state.selectedMcSlot,
    selectedMcReserve: state.selectedMcReserve,
    connected: state.connected,
    mcGroupCardsName: state.mcGroupCardsName
  });
  
  if (!state.selectedMcSlot || !state.selectedMcReserve) {
    log("❌ Slot ou reserva não selecionado");
    return;
  }
  
  const slotSwapName = `${state.selectedMcSlot}${CFG.mc.swapSuffix}`;
  const reserveSwapName = `${state.selectedMcReserve}${CFG.mc.swapSuffix}`;
  
  

  log("Mapeamento:", {
    slotSwapInMap: state.mcSlotSwapByName.has(slotSwapName),
    reserveSwapInMap: state.mcReserveSwapByName.has(reserveSwapName),
    slotSwapData: state.mcSlotSwapByName.get(slotSwapName),
    reserveSwapData: state.mcReserveSwapByName.get(reserveSwapName)
  });
  
  

  try {
    const slotSwapId = await state.ws.call("GetSceneItemId", {
      sceneName: state.mcGroupCardsName,
      sourceName: slotSwapName
    }).catch(() => null);
    
    const reserveSwapId = await state.ws.call("GetSceneItemId", {
      sceneName: state.mcGroupCardsName,
      sourceName: reserveSwapName
    }).catch(() => null);
    
    log("IDs no OBS:", {
      slotSwapId: slotSwapId?.sceneItemId || "NÃO ENCONTRADO",
      reserveSwapId: reserveSwapId?.sceneItemId || "NÃO ENCONTRADO"
    });
    
    

    if (slotSwapId) {
      const slotEnabled = await state.ws.call("GetSceneItemEnabled", {
        sceneName: state.mcGroupCardsName,
        sceneItemId: slotSwapId.sceneItemId
      });
      log(`Swap do slot (${slotSwapName}): ${slotEnabled.sceneItemEnabled ? 'ATIVADO' : 'DESATIVADO'}`);
    }
    
    if (reserveSwapId) {
      const reserveEnabled = await state.ws.call("GetSceneItemEnabled", {
        sceneName: state.mcGroupCardsName,
        sceneItemId: reserveSwapId.sceneItemId
      });
      log(`Swap da reserva (${reserveSwapName}): ${reserveEnabled.sceneItemEnabled ? 'ATIVADO' : 'DESATIVADO'}`);
    }
    
  } catch (err) {
    log("Erro no diagnóstico:", err?.message || err);
  }
  
  log("=== FIM DO DIAGNÓSTICO ===");
};


    const getMcIndexFromSelection = (value, prefix) => {
      const raw = String(value || "").trim();
      if (!raw) return "";
      const match = raw.match(new RegExp(`^${prefix}(\\d{1,2})$`));
      if (match) return match[1].padStart(2, "0");
      const numMatch = raw.match(/(\\d{1,2})/);
      return numMatch ? numMatch[1].padStart(2, "0") : "";
    };

const disableSwapByName = async (swapName, swapMap) => {
  const swapIt = swapMap.get(swapName);
  if (!swapIt) {
    log("AVISO: swap não encontrado", { sourceName: swapName });
    return;
  }
  
  log("ACTION: clear swap", { sourceName: swapName });
  
  

  let groupName;
  
  if (swapName.includes(CFG.mc.reservePrefix)) {
    

    groupName = state.mcGroupCardsName;
    log(`Swap de reserva detectado, usando grupo: ${groupName}`);
  } else {
    

    groupName = state.mcGroupCardsName;
  }
  
  

  if (!groupName) {
    log("ERRO: Grupo não está definido. Execute sync primeiro.");
    return;
  }
  
  await state.ws.call("SetSceneItemEnabled", {
    sceneName: groupName,
    sceneItemId: swapIt.id,
    sceneItemEnabled: false
  });
  
  swapIt.enabled = false;
  swapMap.set(swapName, swapIt);
};

    const clearSwapForPair = async ({ slotIndex, resIndex } = {}) => {
      const slotIdx = getMcIndexFromSelection(slotIndex || state.selectedMcSlot, CFG.mc.slotPrefix);
      const resIdx = getMcIndexFromSelection(resIndex || state.selectedMcReserve, CFG.mc.reservePrefix);

      if (!slotIdx || !resIdx) {
        log("AVISO: clear swap sem par selecionado", {
          slot: state.selectedMcSlot || "",
          reserve: state.selectedMcReserve || "",
        });
        return;
      }

      const slotSwapName = `${CFG.mc.slotPrefix}${slotIdx}${CFG.mc.swapSuffix}`;
      const reserveSwapName = `${CFG.mc.reservePrefix}${resIdx}${CFG.mc.swapSuffix}`;

      setBusy(true);
      try {
        await disableSwapByName(slotSwapName, state.mcSlotSwapByName);
        await disableSwapByName(reserveSwapName, state.mcReserveSwapByName);
      } finally {
        setBusy(false);
      }
    };

    

    const closeSubstituteModal = () => {
      if (!el.substituteModal) return;
      el.substituteModal.classList.remove("show");
      el.substituteModal.setAttribute("aria-hidden", "true");
    };

const renderSubstituteList = (q) => {
      if (!el.substituteList) return;

      const normalizedQuery = normalizeSearchText(q).trim();
      
      

      

      const list = Array.isArray(state.substituteCandidates) ? state.substituteCandidates : []; 
      
      const filtered = normalizedQuery 
        ? list.filter(opt => normalizeSearchText(opt.name || cleanPlayerName(opt.file)).includes(normalizedQuery))
        : list;

      el.substituteList.innerHTML = "";

      if (!filtered.length) {
        const div = document.createElement("div");
        div.className = "rosterEmpty";
        div.textContent = "Nenhuma reserva disponível para substituir.";
        el.substituteList.appendChild(div);
        return;
      }

      filtered.forEach((opt) => {
        const item = document.createElement("div");
        const isSelected = state.selectedReserveOption && state.selectedReserveOption.file === opt.file;
        item.className = `rosterItem rosterItem--card${isSelected ? " selected" : ""}`;

        

        const fileBase = String(opt.file).split(/[\\/]/).pop();
        const slotMatch = fileBase.match(/_(Res|Slot)_(\d{2})/i) || fileBase.match(/^(\d{2})/);
        const slotNum = slotMatch ? (slotMatch[2] || slotMatch[1]) : "";
        
        

        const displayName = opt.name && opt.name !== "Sem Nome" ? opt.name : cleanPlayerName(opt.file);

        

        const badgeHtml = slotNum 
            ? `<span class="rosterSlotBadge">${slotNum}</span>` 
            : ``; 

        item.innerHTML = `
          <div class="rosterCardLeft">
            ${badgeHtml}
          </div>
          <div class="rosterCardBody">
            <div class="rosterPlayerName">${displayName}</div>
            <div class="rosterMeta">
              <span class="rosterFile">${fileBase}</span>
            </div>
          </div>
          ${isSelected ? '<div class="rosterCheck"><span class="material-symbols-outlined">check_circle</span></div>' : ''}
        `;

        item.addEventListener("click", () => {
          state.selectedReserveOption = opt;
          if (el.btnSubstituteConfirm) el.btnSubstituteConfirm.disabled = false;
          renderSubstituteList(el.substituteSearch ? el.substituteSearch.value : "");
        });

        el.substituteList.appendChild(item);
      });
    };
	
	// --- NOVA LÓGICA DE SUBSTITUIÇÃO (INLINE) ---

const toggleSubstitutePanel = async () => {
  const panel = document.getElementById("substitutePanel");
  if (!panel) return;

  const isHidden = panel.classList.contains("isHidden");
  
  if (isHidden) {
    // Abrir Painel
    // 1. Garantir dados atualizados
    await refreshRoster({ force: false, reason: "subPanel" });
    
    // 2. Carregar opções do banco (lê do OBS quem está lá de verdade)
    await loadReserveOptions(); 
    
    // 3. Renderizar selects
    renderSubOutSelect();
    renderSubInSelect();
    
    // 4. Mostrar painel
    panel.classList.remove("isHidden");
  } else {
    // Fechar Painel
    panel.classList.add("isHidden");
  }
};

const renderSubOutSelect = () => {
  const select = document.getElementById("subOutSelect");
  if (!select) return;
  select.innerHTML = "";

  // Lista titulares (Slots 01-11)
  for (let i = 1; i <= CFG.mc.slotCount; i++) {
    const slotId = mcSlotName(i);
    const entry = state.slots[slotId];
    
    const opt = document.createElement("option");
    opt.value = slotId;
    
    // Formata nome para o dropdown
    const name = entry && entry.playerName ? entry.playerName : "Vazio";
    opt.textContent = `${pad2(i)} - ${name}`;
    
    // Pré-seleciona se já estiver selecionado na UI principal
    if (state.selectedMcSlot === slotId) {
      opt.selected = true;
    }
    
    select.appendChild(opt);
  }

  // Bind change event para atualizar o card visual
  select.onchange = () => updateSubPreview("out");
  // Trigger inicial
  updateSubPreview("out");
};

const renderSubInSelect = () => {
  const select = document.getElementById("subInSelect");
  if (!select) return;
  select.innerHTML = "";

  // Lista reservas disponíveis (Candidates carregados via loadReserveOptions)
  // Nota: state.substituteCandidates é populado por loadReserveOptions()
  const candidates = state.substituteCandidates || [];
  
  if (candidates.length === 0) {
    const opt = document.createElement("option");
    opt.text = "Nenhum reserva no banco";
    select.appendChild(opt);
  } else {
    candidates.forEach(cand => {
      const opt = document.createElement("option");
      opt.value = cand.reserveName; // Ex: MC_Res_01
      
      // Nome bonito
      const displayName = cand.name || cleanPlayerName(cand.file);
      const resNum = cand.reserveName.split("_").pop();
      opt.textContent = `${resNum} - ${displayName}`;
      
      select.appendChild(opt);
    });
  }

  select.onchange = () => updateSubPreview("in");
  updateSubPreview("in");
};

const updateSubPreview = (side) => {
  const selectId = side === "out" ? "subOutSelect" : "subInSelect";
  const previewId = side === "out" ? "subOutPreview" : "subInPreview";
  const select = document.getElementById(selectId);
  const preview = document.getElementById(previewId);
  
  if (!select || !preview) return;
  
  const id = select.value;
  if (!id) return; // Nada selecionado

  let displayName = "";
  let displayFile = "";
  let metaInfo = "";

  if (side === "out") {
    // TITULAR (SAI)
    const entry = state.slots[id];
    displayName = entry && entry.playerName ? entry.playerName : "Vazio";
    displayFile = entry && entry.file ? entry.file : "";
    metaInfo = `Camisa ${id.split("_").pop()}`;
  } else {
    // RESERVA (ENTRA)
    const candidate = (state.substituteCandidates || []).find(c => c.reserveName === id);
    
    if (candidate) {
      displayName = candidate.name || cleanPlayerName(candidate.file);
      // TRUQUE: Usa a função que converte o arquivo _res.png para o arquivo principal (.png)
      // Assim mostramos a foto oficial do jogador (Assets/Players)
      displayFile = buildMainFilePathFromReserveFile(candidate.file);
      metaInfo = `Banco ${id.split("_").pop()}`;
    } else {
      displayName = "Desconhecido";
    }
  }

  // --- ATUALIZAÇÃO VISUAL ---
  const avatarEl = preview.querySelector(".sub-avatar");
  const nameEl = preview.querySelector(".sub-name");
  const metaEl = preview.querySelector(".sub-meta");

  // 1. Configurar Imagem ou Inicial
  if (avatarEl) {
    // Reseta para padrão (sem imagem, mostra inicial)
    avatarEl.style.backgroundImage = "none";
    avatarEl.textContent = displayName.charAt(0).toUpperCase();

    if (displayFile) {
      // Tenta corrigir o caminho para o navegador exibir a imagem localmente
      let imageUrl = displayFile.replace(/\\/g, "/");

      // Se for caminho absoluto (C:/...), adiciona file:///
      if (imageUrl.match(/^[a-zA-Z]:/)) {
        imageUrl = "file:///" + imageUrl;
      } 
      // Se for relativo (Assets/...), adiciona ../ para sair da pasta UI
      else if (!imageUrl.startsWith("file:") && !imageUrl.startsWith("http") && !imageUrl.startsWith("/")) {
         imageUrl = "../" + imageUrl;
      }

      // Aplica a imagem
      avatarEl.style.backgroundImage = `url('${encodeURI(imageUrl)}')`;
      // Limpa o texto da inicial para não ficar por cima da foto
      avatarEl.textContent = "";
    }
  }
  
  // 2. Nome
  if (nameEl) nameEl.textContent = displayName;
  
  // 3. Meta info (Slot/Banco + Nome do arquivo)
  if (metaEl) {
    const cleanFile = cleanPlayerName(displayFile);
    metaEl.innerHTML = `${metaInfo}<br><span style="opacity:0.5; font-size:9px">${cleanFile}</span>`;
  }
};

const executePanelSubstitution = async () => {
  const outSelect = document.getElementById("subOutSelect");
  const inSelect = document.getElementById("subInSelect");
  
  if (!outSelect || !inSelect) return;
  
  const slotId = outSelect.value;
  const reserveId = inSelect.value;
  
  if (!slotId || !reserveId) {
    alert("Selecione quem sai e quem entra.");
    return;
  }

  // 1. Atualiza o estado global com a seleção feita neste painel
  state.selectedMcSlot = slotId;
  state.selectedMcReserve = reserveId;
  
  // 2. Fecha o painel visualmente
  toggleSubstitutePanel();

  // 3. Chama a função original que já funciona perfeitamente
  setBusy(true);
  try {
    await swapMcPlayers();
  } finally {
    setBusy(false);
  }
};

const loadReserveOptions = async () => {
      const options = [];
      for (let i = 1; i <= CFG.mc.reserveCount; i++) {
        const reserveName = mcReserveName(i);
        let file = "";
        try {
          const settings = await state.ws.call("GetInputSettings", { inputName: reserveName });
          file = (settings && settings.inputSettings && settings.inputSettings.file) || "";
        } catch {
          file = "";
        }
        
        

        const label = buildReserveLabel(reserveName, file);
        const searchKey = normalizeSearchText(`${label} ${reserveName}`);
        
        options.push({
          reserveName,
          file,
          label,
          searchKey,
          name: label 

        });
      }
      
      

      state.substituteCandidates = options.filter((opt) => opt.file);
    };

    const openSubstituteModal = async () => {
      if (!el.substituteModal || !state.connected || state.target !== "mc") return;
      await refreshRoster({ force: false, reason: "openSubstituteModal" });
      if (el.substituteSearch) el.substituteSearch.value = "";
      if (el.btnSubstituteConfirm) el.btnSubstituteConfirm.disabled = true;
      state.selectedReserveOption = null;
      el.substituteModal.classList.add("show");
      el.substituteModal.setAttribute("aria-hidden", "false");

      setBusy(true);
      try {
        await loadReserveOptions();
        renderSubstituteList("");
      } finally {
        setBusy(false);
      }
    };

const updateMcScoreboardControls = () => {
  const disabled = !state.connected || !state.mcScoreboard.enabled || state.busy;
  mcScoreboardSetControlsDisabled(disabled);
};



const updateAllButtonStates = () => {
  

  if (!el.btnSync || !el.btnClearAll) return;
  
  

  const canActGlobal = state.connected && !state.busy;
  
  

  if (state.connected) {
    el.btnSync.disabled = false;
    el.btnClearAll.disabled = false;
    el.btnReconnect.disabled = state.busy; 

  } else {
    

    el.btnSync.disabled = true;
    el.btnClearAll.disabled = true;
    el.btnReconnect.disabled = state.busy; 
  }

  

  if (state.connected) {
    if (el.btnRegisterReserves) {
      

      el.btnRegisterReserves.disabled = state.target !== 'mc' || state.busy;
    }
    if (el.btnClearSwaps) {
      

      el.btnClearSwaps.disabled = state.target !== 'mc' || state.busy;
    }
    if (el.btnSubstitute) {
      

      el.btnSubstitute.disabled = !(state.target === 'mc' && state.selectedMcSlot && !state.busy);
    }
  } else {
    

    if (el.btnRegisterReserves) el.btnRegisterReserves.disabled = true;
    if (el.btnClearSwaps) el.btnClearSwaps.disabled = true;
    if (el.btnSubstitute) el.btnSubstitute.disabled = true;
  }
  
  

  
  

  

  if (el.btnYellow) el.btnYellow.disabled = !canActGlobal;
  if (el.btnRed) el.btnRed.disabled = !canActGlobal;
  
  

  const selection = getActiveSelection();
  const hasSelection = selection && selection.name;

  

  if (el.btnRemoveCard) el.btnRemoveCard.disabled = !(canActGlobal && hasSelection);
  if (el.btnSwap) el.btnSwap.disabled = !(canActGlobal && hasSelection);

  

  updateMcScoreboardControls();
};







const wsEventQueue = [];
let wsEventProcessing = false;

const isWsConnected = () => {
  if (!state.ws || !state.ws.ws) return false;
  return state.ws.ws.readyState === 1;
};

const resetWsEventHandlers = () => {
  state.wsEventHandlers = [];
};

const registerObsEventHandler = (handler) => {
  if (!state.wsEventHandlers) state.wsEventHandlers = [];
  state.wsEventHandlers.push(handler);
};

const ensureWsEventMultiplexer = () => {
  if (!state.ws || state.ws.__hasMultiplexer) return;
  state.ws.__hasMultiplexer = true;
  state.ws.onEvent = (d) => {
    const handlers = state.wsEventHandlers || [];
    for (const handler of handlers) {
      try {
        const result = handler(d);
        if (result && typeof result.then === "function") {
          result.catch((err) => log("OBS EVENT ERROR", { err: String(err?.message || err) }));
        }
      } catch (err) {
        log("OBS EVENT ERROR", { err: String(err?.message || err) });
      }
    }
  };
};

const processWsEventQueue = async () => {
  if (wsEventProcessing) return;
  wsEventProcessing = true;

  while (wsEventQueue.length) {
    const fn = wsEventQueue.shift();
    try {
      await fn();
    } catch (e) {
      log("WS EVENT ERROR", { err: String(e?.message || e) });
    }
  }

  wsEventProcessing = false;
};


const registerObsEventHandlers = () => {
  registerObsEventHandler((d) => {
    try {
      if (!state || !state.ws || !state.connected) return;
      if (!d || !d.eventType) return;

      const eventType = d.eventType;
      const eventData = d.eventData || {};

      switch (eventType) {
        case "CurrentProgramSceneChanged": {
          if (!eventData.sceneName) return;
          state.programScene = eventData.sceneName;
          state.currentProgramScene = eventData.sceneName;
          updateGuestDockVisibility("programSceneChanged");
          applyObsProgramScene(eventData.sceneName, "event");
          setTimeout(() => {
            if (!state.currentScene || state.currentScene === state.programScene) {
              applySceneSelection(state.programScene, "event").catch(() => {});
            }
          }, 0);
          return;
        }

        case "SceneItemSelected":
        case "SceneItemSelectionChanged": {
          setTimeout(async () => {
            if (!state.connected || !isWsConnected()) return;
            try {
              await handleObsSceneItemSelection(eventData);
            } catch (err) {
              log("OBS EVENT ERROR", { err: String(err?.message || err) });
            }
          }, 10);
          return;
        }

        case "SceneItemTransformChanged": {
          if (
            !state.mcGroupReservesName ||
            eventData.sceneName !== state.mcGroupReservesName ||
            !eventData.sceneItemTransform ||
            !state.mcGroupFxName ||
            !state.mcGroupCardsName ||
            !state.mcReserveById ||
            !state.mcReserveCardByName ||
            !state.mcReserveSwapByName ||
            !isWsConnected()
          ) {
            return;
          }

          const reserveName = state.mcReserveById.get(eventData.sceneItemId);
          if (!reserveName) return;

          const cardName = `${reserveName}${CFG.cardSuffix}`;
          const swapName = `${reserveName}${CFG.mc.swapSuffix}`;

          const cardIt = state.mcReserveCardByName.get(cardName);
          const swapIt = state.mcReserveSwapByName.get(swapName);

          const baseTransform = copyTransformSafe(eventData.sceneItemTransform);

          if (cardIt) {
            state.ws.call("SetSceneItemTransform", {
              sceneName: state.mcGroupFxName,
              sceneItemId: cardIt.id,
              sceneItemTransform: baseTransform
            }).catch(() => {});
          }
          if (swapIt) {
            state.ws.call("SetSceneItemTransform", {
              sceneName: state.mcGroupCardsName,
              sceneItemId: swapIt.id,
              sceneItemTransform: baseTransform
            }).catch(() => {});
          }

          ensureCardAboveSwap(state.mcGroupFxName, cardName, swapName).catch(() => {});
          if (hasMcGoalBall(reserveName)) {
            ensureBallTransformFollows(reserveName).catch(() => {});
          }
          return;
        }
        default:
          return;
      }
    } catch (err) {
      log("OBS EVENT ERROR", { err: String(err?.message || err) });
    }
  });
};

    

    const connectAndSync = async () => {
      setBusy(true);
  try {
    state.ws = new ObsWS5(CFG.wsUrl, CFG.password);
    invalidateMcItemCache("reconnect");
    resetWsEventHandlers();
    ensureWsEventMultiplexer();
    registerObsEventHandlers();
	setupTransformListeners();
    await state.ws.connect();

        try {
          const prog = await state.ws.call("GetCurrentProgramScene");
          state.obsProgramScene = prog?.currentProgramSceneName || null;
          updatePanelsVisibility("connected");
        } catch (err) {
          log("ERRO GetCurrentProgramScene", { err: String(err?.message || err) });
        }

        

        const sceneList = await state.ws.call("GetSceneList");
        const scenes = (sceneList && sceneList.scenes || []).map((s) => s.sceneName);
        const current = sceneList && sceneList.currentProgramSceneName;
        const preferred = CFG.defaultScene && scenes.includes(CFG.defaultScene) ? CFG.defaultScene : "";

        state.programScene = current || state.programScene || "";
        state.currentProgramScene = state.programScene || null;
        const obsScene = state.obsProgramScene;
        const selectScene = obsScene && scenes.includes(obsScene)
          ? obsScene
          : (preferred && scenes.includes(preferred) ? preferred : (current || state.currentScene || ""));
        state.currentScene = selectScene || "";
        state.fieldSceneName = CFG.defaultScene || state.fieldSceneName || state.currentScene || "";
        fillScenes(scenes, state.currentScene);

        setChip(el.pillWs, "WS: OK", "ok");
        if (selectScene) applyObsProgramScene(selectScene, "connect");

        state.connected = true;

        await syncAll();
        await mcScoreboardEnsureObsBindings();
        await mcScoreboardApplyAll();

        

        if (state.topLoop) clearInterval(state.topLoop);
        state.topLoop = setInterval(() => {
          if (!state.connected) return;
          if (state.target === "mc") enforceMcOverlaysOnTop().catch(() => {});
          else enforceCardsAlwaysOnTop().catch(() => {});
        }, CFG.topEnforceIntervalMs);

      } catch (err) {
        state.connected = false;
        setChip(el.pillWs, "WS: ERRO", "bad");
        log("ERRO conectar/sync", { err: String(err && err.message || err) });
      } finally {
        setBusy(false);
		return;
      }
    };
	


    const openSlotSelectionModal = () => {
      if (!el.slotSelectionModal || !el.slotSelectionList) return;

      const isMc = state.target === "mc";
      el.slotSelectionList.innerHTML = "";

      

      const createItem = (id, entry, typeLabel, isSelected, onClick) => {
          const item = document.createElement("div");
          item.className = `slot-select-item ${isSelected ? "is-selected" : ""}`;
          
          const name = entry && entry.playerName ? entry.playerName : "Vazio";
          const fileInfo = entry && entry.file ? cleanPlayerName(entry.file) : "";
          
          item.innerHTML = `
            <div class="slot-select-info">
              <strong>${id.split("_").pop()} - ${name}</strong>
              <small>${typeLabel} ${fileInfo ? `(${fileInfo})` : ""}</small>
            </div>
            ${isSelected ? '<span class="material-symbols-outlined" style="color:var(--accentYellow)">check_circle</span>' : ''}
          `;
          item.onclick = onClick;
          return item;
      };

      

      const headerTit = document.createElement("div");
      headerTit.className = "list-section-header";
      headerTit.textContent = isMc ? "Titulares (MC)" : "Titulares (Campo)";
      el.slotSelectionList.appendChild(headerTit);

      const slotCount = isMc ? CFG.mc.slotCount : CFG.slotCount;
      const slotPrefix = isMc ? CFG.mc.slotPrefix : CFG.slotPrefix;

      for (let i = 1; i <= slotCount; i++) {
          const id = `${slotPrefix}${pad2(i)}`;
          const entry = state.slots[id];
          const isSelected = isMc ? (state.selectedMcSlot === id && state.mcSelectionMode === "slot") 
                                  : (state.selectedSlot === id);
          
          el.slotSelectionList.appendChild(createItem(id, entry, "TITULAR", isSelected, () => {
              if (isMc) {
                  state.selectedMcSlot = id;
                  state.mcSelectionMode = "slot";
              } else {
                  state.selectedSlot = id;
              }
              updateSelectionIndicators("modalSelect");
              updateAllButtonStates();
              closeSlotSelectionModal();
          }));
      }

      

      if (isMc) {
          const headerRes = document.createElement("div");
          headerRes.className = "list-section-header";
          headerRes.textContent = "Reservas";
          el.slotSelectionList.appendChild(headerRes);

          for (let i = 1; i <= CFG.mc.reserveCount; i++) {
              const id = `${CFG.mc.reservePrefix}${pad2(i)}`;
              const entry = state.reserves[id];
              const isSelected = (state.selectedMcReserve === id && state.mcSelectionMode === "reserve");

              el.slotSelectionList.appendChild(createItem(id, entry, "RESERVA", isSelected, () => {
                  state.selectedMcReserve = id;
                  state.mcSelectionMode = "reserve";
                  updateSelectionIndicators("modalSelect");
                  updateAllButtonStates();
                  closeSlotSelectionModal();
              }));
          }
      }

      el.slotSelectionModal.classList.add("show");
      el.slotSelectionModal.setAttribute("aria-hidden", "false");
      el.slotSelectionModal.style.display = "flex";
    };

    const closeSlotSelectionModal = () => {
      if (!el.slotSelectionModal) return;
      el.slotSelectionModal.classList.remove("show");
      el.slotSelectionModal.setAttribute("aria-hidden", "true");
      el.slotSelectionModal.style.display = "none";
    };

    

 const bindUi = () => {
  

  if (el.btnReconnect) {
    el.btnReconnect.onclick = () => connectAndSync();
  }
  
if (el.btnSync) {
  el.btnSync.onclick = () => {
    log("[SYNC] clicked (completo)");
    if (!state.connected) {
      if (el.actionsHint) el.actionsHint.textContent = "Sync falhou: sem conexão.";
      return;
    }
    syncAllComplete().catch((err) => {
      log("[SYNC] ERRO inesperado", { err: String(err?.message || err) });
      if (el.actionsHint) el.actionsHint.textContent = "Sync falhou: erro inesperado.";
    });
  };
}
  
  if (el.btnPenaltyAdd) {
  el.btnPenaltyAdd.onclick = () => mcPenaltiesAddRound();
}
  
  if (el.btnClearAll) {
    el.btnClearAll.onclick = () => {
      if (state.connected) {
        setBusy(true);
        clearCardsInCurrentMode().finally(() => setBusy(false));
      }
    };
  }



  
  

  const canOpenCardModal = () => state.connected && !state.busy;

  if (el.btnYellow) {
    el.btnYellow.onclick = () => {
      if (!canOpenCardModal()) return;
      openCardSelectModal("yellow");
    };
    

  }
  
  if (el.btnRed) {
    el.btnRed.onclick = () => {
      if (!canOpenCardModal()) return;
      openCardSelectModal("red");
    };
  }
  
  

  if (el.btnCardClose) {
      el.btnCardClose.onclick = closeCardSelectModal;
  }
  
  

  

  if (el.btnRemoveCard) {
    el.btnRemoveCard.onclick = () => {
      if (!state.connected) return;
      

      const sel = getActiveSelection();
      if (!sel || !sel.name) {
          alert("Selecione um jogador no dropdown para remover o cartão.");
          return;
      }
      setBusy(true);
      removeCard().catch(() => {}).finally(() => setBusy(false));
    };
  }
  
  

  if (el.btnSwap) {
    el.btnSwap.onclick = () => openModal();
  }
  
  if (el.btnModalClose) {
    el.btnModalClose.onclick = () => closeModal();
  }
  
  if (el.modalMask) {
    el.modalMask.addEventListener("click", (ev) => {
      if (ev.target === el.modalMask) closeModal();
    });
  }
  
  if (el.rosterSearch) {
    el.rosterSearch.oninput = () => renderRoster(el.rosterSearch.value);
  }
  
  

  if (el.btnToggleAgg) el.btnToggleAgg.onclick = toggleAggregate;
  
  if (el.btnAggLeftPlus) el.btnAggLeftPlus.onclick = () => adjustAggGoal("left", 1);
  if (el.btnAggLeftMinus) el.btnAggLeftMinus.onclick = () => adjustAggGoal("left", -1);
  
  if (el.btnAggRightPlus) el.btnAggRightPlus.onclick = () => adjustAggGoal("right", 1);
  if (el.btnAggRightMinus) el.btnAggRightMinus.onclick = () => adjustAggGoal("right", -1);

  

  if (el.sceneSelect) {
    el.sceneSelect.onchange = () => {
      const sceneName = el.sceneSelect.value;
      if (!sceneName) return;
      if (state.connected && state.ws) {
        state.ws.call("SetCurrentProgramScene", { sceneName })
          .then(() => {
            applyObsProgramScene(sceneName, "ui");
            applySceneSelection(sceneName, "ui").catch(() => {});
          })
          .catch((err) => {
            log("ERRO SetCurrentProgramScene", { sceneName, err: String(err?.message || err) });
          });
      } else {
        applySceneSelection(sceneName, "ui").catch(() => {});
      }
    };
  }
if (el.btnPlayerSelect) {
      el.btnPlayerSelect.onclick = () => openSlotSelectionModal();
  }
  if (el.btnSlotSelectionClose) {
      el.btnSlotSelectionClose.onclick = () => closeSlotSelectionModal();
  }

  if (el.targetSelect) {
    el.targetSelect.onchange = () => {
      state.target = el.targetSelect.value === "mc" ? "mc" : "field";
      applyTargetUiState().catch(() => {});
    };
  }

if (el.btnPlayerSelect) {
      el.btnPlayerSelect.onclick = () => openSlotSelectionModal();
  }
  if (el.btnSlotSelectionClose) {
      el.btnSlotSelectionClose.onclick = () => closeSlotSelectionModal();
  }


const openStoppageModal = () => {
        const modal = document.getElementById("stoppageModal");
        if(modal) {
            modal.classList.add("show");
            modal.setAttribute("aria-hidden", "false");
            modal.style.display = "flex";
        }
    };

    const closeStoppageModal = () => {
        const modal = document.getElementById("stoppageModal");
        if(modal) {
            modal.classList.remove("show");
            modal.setAttribute("aria-hidden", "true");
            modal.style.display = "none";
        }
    };



const applyStoppage = async (val) => {
    const numVal = parseInt(val);
    state.mcScoreboard.stoppageValue = isNaN(numVal) ? 0 : numVal;

    const textStr = state.mcScoreboard.stoppageValue > 0 
        ? `+${state.mcScoreboard.stoppageValue}` 
        : "";

    

    await mcScoreboardCall("SetInputSettings", {
        inputName: "MC_Acrescimos",
        inputSettings: { 
            text: textStr,
            align: "center", 
            valign: "center"
        },
        overlay: true
    });

    await updateStoppageVisibility();

    log(`Acréscimo definido para: ${textStr}`);
    closeStoppageModal();
};

(function syncTargetToggle(){
    const select = document.getElementById("targetSelect");
    
    

    const container = select ? select.closest(".field") : null;
    
    

    const buttons = container ? container.querySelectorAll(".toggleBtn") : [];

    if (!select || !buttons.length) return;

    function syncFromSelect(){
      buttons.forEach((btn) => {
        btn.classList.toggle("is-active", btn.dataset.value === select.value);
      });
    }

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        if (select.value === btn.dataset.value) return;
        select.value = btn.dataset.value;
        select.dispatchEvent(new Event("change", { bubbles: true }));
        syncFromSelect();
      });
    });

    syncFromSelect();
  })();


  

if (el.btnGuestApply) {
    el.btnGuestApply.onclick = () => {
      const text = el.guestNameInput ? el.guestNameInput.value.trim() : "";
      guestApply(text);
    };
  }

  if (el.btnGuestShow) {
    el.btnGuestShow.onclick = () => {
      guestShow();
    };
  }

  if (el.btnGuestHide) {
    el.btnGuestHide.onclick = () => {
      guestHide();
    };
  }

if (el.btnGuestToggle) {
    el.btnGuestToggle.onclick = () => {
      if (guest.lastEnabled) {
        guestHide();
      } else {
        guestShow();
      }
    };
  }

  if (el.btnGuestClear) {
    el.btnGuestClear.onclick = () => {
      if (el.guestNameInput) el.guestNameInput.value = "";
      guestClear();
    };
  }

  if (el.btnSubstitute) {
  el.btnSubstitute.onclick = () => {
    if (state.target !== 'mc') {
      alert("Mude para o alvo Match Center para substituir.");
      return;
    }
    toggleSubstitutePanel();
  };
}

// Botão Fechar Painel (o 'X' pequeno)
const btnCloseSub = document.getElementById("btnCloseSubPanel");
if (btnCloseSub) {
  btnCloseSub.onclick = () => {
    const panel = document.getElementById("substitutePanel");
    if (panel) panel.classList.add("isHidden");
  };
}

// Botão Confirmar a Troca
const btnConfirm = document.getElementById("btnConfirmSub");
if (btnConfirm) {
  btnConfirm.onclick = () => executePanelSubstitution();
}

  if (el.btnRegisterReserves) {
    el.btnRegisterReserves.onclick = () => openReservesModal();
  }
  
  if (el.btnReserveClose) {
    el.btnReserveClose.onclick = () => closeReservesModal();
  }
  
  if (el.btnReserveConfirm) {
    el.btnReserveConfirm.onclick = () => registerReserves();
  }
  
  if (el.reserveSearch) {
    el.reserveSearch.oninput = () => renderReserveRoster(el.reserveSearch.value);
  }

  el.btnToggleStoppage = document.getElementById("btnToggleStoppage"); 
  if (el.btnToggleStoppage) {
      el.btnToggleStoppage.onclick = async () => {
          

          state.mcScoreboard.stoppageVisible = !state.mcScoreboard.stoppageVisible;
          

          await updateStoppageVisibility();
      };
  }
  
if (el.btnToggleStoppage) {
    el.btnToggleStoppage.onclick = () => {
        

        if (el.btnToggleStoppage.disabled) return;
        
        

        openStoppageModal();
    };
}
  

  if (el.btnManagePlayers) {
    el.btnManagePlayers.onclick = () => openPlayersModal();
  }
  
  if (el.btnPlayersClose) {
    el.btnPlayersClose.onclick = () => closePlayersModal();
  }
  
  if (el.playerSearch) {
    el.playerSearch.oninput = () => renderPlayersList(el.playerSearch.value);
  }

  if (el.btnGoalClose) {
    el.btnGoalClose.onclick = () => closeGoalModal();
  }

  if (el.goalSearch) {
    el.goalSearch.oninput = () => renderGoalList(el.goalSearch.value);
  }

  if (el.btnGoalOwnGoal) {
    el.btnGoalOwnGoal.onclick = async () => {
      closeGoalModal();
      setBusy(true);
      try {
        await mcScoreboardRegisterCorinthiansGoal({ ownGoal: true });
      } finally {
        setBusy(false);
      }
    };
  }

  if (el.btnRefreshRoster) {
    el.btnRefreshRoster.onclick = async () => {
      setBusy(true);
      try {
        await hardRefreshRoster();
        renderPlayersList(el.playerSearch ? el.playerSearch.value : "");
        renderRoster(el.rosterSearch ? el.rosterSearch.value : "");
      } finally {
        setBusy(false);
      }
    };
  }

  if (el.btnScanFolder) {
    el.btnScanFolder.onclick = () => runFolderScan();
  }
  
  if (el.btnGenerateIndex) {
    el.btnGenerateIndex.onclick = () => {
      alert("Use Tools/UpdateRoster.bat para gerar Data/roster.json e UI/roster.data.js.");
    };
  }

  

  if (el.btnAddOpponent) {
    el.btnAddOpponent.onclick = () => {
      if (el.opponentModalMask) {
        el.opponentModalMask.classList.add("show");
        el.opponentModalMask.setAttribute("aria-hidden", "false");
        el.opponentModalMask.style.display = "flex";
        
        

        setTimeout(() => {
          if (el.teamSearch) el.teamSearch.focus();
        }, 100);
      }
    };
  }
  
  if (el.btnOpponentClose) {
    el.btnOpponentClose.onclick = () => {
      if (el.opponentModalMask) {
        el.opponentModalMask.classList.remove("show");
        el.opponentModalMask.setAttribute("aria-hidden", "true");
        el.opponentModalMask.style.display = "none";
      }
    };
  }
  
  if (el.btnOpponentRefreshTimes) {
    el.btnOpponentRefreshTimes.onclick = async () => {
      setBusy(true);
      try {
        await refreshTeams({ force: true, reason: "modal" });
        renderTeams(el.teamSearch ? el.teamSearch.value : "");
      } finally {
        setBusy(false);
      }
    };
  }
  
if (el.btnSyncIndividual) {
  el.btnSyncIndividual.onclick = async () => {
    log("[SYNC] Botão sync individual clicado");
    if (!state.connected) {
      if (el.actionsHint) el.actionsHint.textContent = "Sync Individual falhou: sem conexão.";
      return;
    }
    
    const selection = getActiveSelection();
    if (selection && selection.name) {
      

      const isMc = state.target === "mc";
      await syncSlotWithOverlays(selection.name, isMc);
    } else {
      

      if (state.target === "mc") {
        for (let i = 1; i <= CFG.mc.slotCount; i++) {
          await syncSlotWithOverlays(mcSlotName(i), true);
        }
      } else {
        for (let i = 1; i <= CFG.slotCount; i++) {
          await syncSlotWithOverlays(getSlotName(i), false);
        }
      }
    }
  };
}

  

  if (el.btnRefreshTeams) {
    el.btnRefreshTeams.onclick = async () => {
      setBusy(true);
      try {
        await refreshTeams({ force: true, reason: "manual" });
        await mcScoreboardApplyLogosAndSiglas();
      } finally {
        setBusy(false);
      }
    };
  }

  if (el.teamSearch) {
    el.teamSearch.oninput = () => renderTeams(el.teamSearch.value);
  }

  

  

  if (el.btnCorMandante) {
    el.btnCorMandante.onclick = () => mcScoreboardSetMando("left");
  }
  
  if (el.btnCorVisitante) {
    el.btnCorVisitante.onclick = () => mcScoreboardSetMando("right");
  }

  

const handleGoalPlus = (uiSide) => {
  // uiSide = "left" significa que o usuário clicou na coluna da Esquerda (Corinthians)
  // uiSide = "right" significa que o usuário clicou na coluna da Direita (Adversário)

  const corSide = state.mcScoreboard.corinthiansSide; // "left" (Casa) ou "right" (Fora)

  // 1. Ação na coluna do Corinthians (Esquerda da UI)
  if (uiSide === "left") {
    // Isso SEMPRE é gol do Corinthians, independente do mando.
    // A função openGoalModal já chama internamente a lógica que sabe onde somar (mcScoreboardRegisterCorinthiansGoal)
    openGoalModal(); 
    return;
  }

  // 2. Ação na coluna do Adversário (Direita da UI)
  if (uiSide === "right") {
    // Precisamos descobrir qual variável do OBS representa o adversário agora
    if (corSide === "left") {
      // Cor está na Esquerda (Casa), então Adversário está na Direita.
      mcScoreboardSetGoals(
        state.mcScoreboard.goalsLeft,
        state.mcScoreboard.goalsRight + 1
      );
    } else {
      // Cor está na Direita (Fora), então Adversário está na Esquerda.
      mcScoreboardSetGoals(
        state.mcScoreboard.goalsLeft + 1,
        state.mcScoreboard.goalsRight
      );
    }
  }
};

// Substitua a função handleGoalMinus existente por esta:
const handleGoalMinus = async (uiSide) => {
  const corSide = state.mcScoreboard.corinthiansSide;

  // 1. Ação na coluna do Corinthians (Esquerda da UI)
  if (uiSide === "left") {
    // Tenta desfazer gol do Corinthians
    const hadGoal = mcScoreboardGetCorinthiansGoals() > 0;
    const undone = await mcScoreboardUndoCorinthiansGoal();
    
    if (undone && hadGoal) {
      enqueueToast({
        type: "GOAL_ANNULLED",
        ttlMs: CFG.toast.ttlGoalAnnulledMs,
        textLine1: "GOL ANULADO",
      });
    }
    return;
  }

  // 2. Ação na coluna do Adversário (Direita da UI)
  if (uiSide === "right") {
    if (corSide === "left") {
      // Adversário é Right
      mcScoreboardSetGoals(
        state.mcScoreboard.goalsLeft,
        state.mcScoreboard.goalsRight - 1
      );
    } else {
      // Adversário é Left
      mcScoreboardSetGoals(
        state.mcScoreboard.goalsLeft - 1,
        state.mcScoreboard.goalsRight
      );
    }
  }
};

  if (el.btnGolLeftPlus) {
    el.btnGolLeftPlus.onclick = () => {
      handleGoalPlus("left");
    };
  }

  if (el.btnGolLeftMinus) {
    el.btnGolLeftMinus.onclick = () => handleGoalMinus("left");
  }

  if (el.btnGolRightPlus) {
    el.btnGolRightPlus.onclick = () => {
      handleGoalPlus("right");
    };
  }

  if (el.btnGolRightMinus) {
    el.btnGolRightMinus.onclick = () => handleGoalMinus("right");
  }
  
  if (el.btnGolReset) {
    el.btnGolReset.onclick = () => mcScoreboardSetGoals(0, 0);
  }

  

  if (el.btnTimerStart) {
    el.btnTimerStart.onclick = () => mcScoreboardStart();
  }
  
  if (el.btnTimerPause) {
    el.btnTimerPause.onclick = () => mcScoreboardPause();
  }
  
  if (el.btnTimerResume) {
    el.btnTimerResume.onclick = () => mcScoreboardResume();
  }
  
  if (el.btnTimerReset) {
    el.btnTimerReset.onclick = () => mcScoreboardReset();
  }
  
  if (el.btnTimerStartFrom) {
    el.btnTimerStartFrom.onclick = () => mcScoreboardStartFromInput();
  }

  if (el.btnTimerStartFrom) {
    el.btnTimerStartFrom.onclick = () => mcScoreboardStartFromInput();
  }

  

  if (el.timerSetInput) {
    el.timerSetInput.addEventListener("input", (e) => {
      

      let v = e.target.value.replace(/\D/g, "").substring(0, 4);
      
      

      

      if (v.length >= 3) {
        v = v.slice(0, v.length - 2) + ":" + v.slice(v.length - 2);
      }
      e.target.value = v;
    });
    
    

    el.timerSetInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        mcScoreboardStartFromInput();
        el.timerSetInput.blur(); 

      }
    });
  }
  


  

  if (el.btnStatus1T) {
    el.btnStatus1T.onclick = () => mcScoreboardSetStatus("1t");
  }
  
  if (el.btnStatus2T) {
    el.btnStatus2T.onclick = () => mcScoreboardSetStatus("2t");
  }
  
  if (el.btnStatusIntervalo) {
    el.btnStatusIntervalo.onclick = () => mcScoreboardSetStatus("intervalo");
  }
  
  if (el.btnStatusProrrogacao) {
    el.btnStatusProrrogacao.onclick = () => mcScoreboardSetStatus("prorrogacao");
  }
  
  if (el.btnStatusPenalti) {
    el.btnStatusPenalti.onclick = () => mcScoreboardSetStatus("penalti");
  }

  

  const penaltyButtons = document.querySelectorAll(".mc-penalty-btn");
  penaltyButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const team = btn.getAttribute("data-team");
      const index = Number(btn.getAttribute("data-index"));
      if (team !== "cor" && team !== "adv") return;
      if (!Number.isFinite(index) || index < 0 || index > 4) return;
      const current = state.mcScoreboard.penalties?.[team]?.[index] || "empty";
      const currentIndex = MC_PENALTY_STATES.indexOf(current);
      const next = MC_PENALTY_STATES[(currentIndex + 1) % MC_PENALTY_STATES.length];
      mcPenaltiesSet(team, index, next);
    });
  });

  if (el.btnPenaltyReset) {
    el.btnPenaltyReset.onclick = () => mcPenaltiesReset();
  }

  const btnStopClose = document.getElementById("btnStoppageClose");
  if(btnStopClose) btnStopClose.onclick = closeStoppageModal;

  const stopButtons = document.querySelectorAll(".btn-stop");
  stopButtons.forEach(btn => {
      btn.onclick = () => applyStoppage(btn.dataset.val);
  });

  const btnStopApply = document.getElementById("btnStoppageApply");
  const inputStop = document.getElementById("stoppageInput");
  if(btnStopApply && inputStop) {
      btnStopApply.onclick = () => applyStoppage(inputStop.value);
  }
  



const mcScoreboardSetStatus = async (status) => {
  if (!MC_SCOREBOARD_STATUS_MAP[status]) return;
  
  const oldStatus = state.mcScoreboard.status; 


  

  
  

  if (oldStatus === "penalti" && status !== "penalti") {
      if (state.mcScoreboard.prePenaltyGoals) {
          

          state.mcScoreboard.goalsLeft = state.mcScoreboard.prePenaltyGoals.left;
          state.mcScoreboard.goalsRight = state.mcScoreboard.prePenaltyGoals.right;
          
          

          state.mcScoreboard.prePenaltyGoals = null; 
          
          log("Saindo de Pênaltis: Placar original restaurado.");
      }
  }

  

  if (status === "penalti" && oldStatus !== "penalti") {
      

      state.mcScoreboard.prePenaltyGoals = {
          left: state.mcScoreboard.goalsLeft,
          right: state.mcScoreboard.goalsRight
      };

      

      state.mcScoreboard.goalsLeft = 0;
      state.mcScoreboard.goalsRight = 0;
      
      log("Entrando em Pênaltis: Placar salvo e zerado.");
  }

  

  state.mcScoreboard.status = status;

  

  mcScoreboardApplyGoals().catch(() => {});
  
  

  const uiLeft = document.getElementById("uiScoreLeft");
  const uiRight = document.getElementById("uiScoreRight");
  if (uiLeft) uiLeft.textContent = state.mcScoreboard.goalsLeft;
  if (uiRight) uiRight.textContent = state.mcScoreboard.goalsRight;


  

  
  

  state.mcScoreboard.elapsedMs = 0;
  
  

  if (status === "intervalo" || status === "penalti") {
      mcScoreboardSetRunning(false);
  } else {
      if (state.mcScoreboard.running) {
          state.mcScoreboard.startTimestamp = Date.now();
      }
  }

  

  mcScoreboardApplyChronometerText().catch(() => {});

  

  state.mcScoreboard.stoppageAsked = false;
  state.mcScoreboard.stoppageValue = 0;
  
  if (el.btnToggleStoppage) {
      el.btnToggleStoppage.disabled = true;
      el.btnToggleStoppage.classList.remove("active");
  }

  await mcScoreboardCall("SetInputSettings", {
      inputName: "MC_Acrescimos",
      inputSettings: { text: "" },
      overlay: true
  }).catch(()=>{});
  
  await updateStoppageVisibility(); 

  


  

  mcScoreboardApplyStatus().catch(() => {});
  mcScoreboardSchedulePersist();
  
  

  [el.btnStatus1T, el.btnStatus2T, el.btnStatusIntervalo, el.btnStatusProrrogacao, el.btnStatusPenalti]
    .forEach(btn => { if(btn) btn.classList.remove("active"); });

  if (status === "1t" && el.btnStatus1T) el.btnStatus1T.classList.add("active");
  if (status === "2t" && el.btnStatus2T) el.btnStatus2T.classList.add("active");
  if (status === "intervalo" && el.btnStatusIntervalo) el.btnStatusIntervalo.classList.add("active");
  if (status === "prorrogacao" && el.btnStatusProrrogacao) el.btnStatusProrrogacao.classList.add("active");
  if (status === "penalti" && el.btnStatusPenalti) el.btnStatusPenalti.classList.add("active");

  if (el.mcPenaltiesPanel) {
    el.mcPenaltiesPanel.classList.toggle("isHidden", status !== "penalti");
  }
};

  

const modals = ['modalMask', 'reservesModal', 'substituteModal', 'playersModal', 'goalModal', 'opponentModalMask', 'cardModal', 'stoppageModal'];
  modals.forEach(modalId => {
    const modal = $(modalId);
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('show');
          modal.setAttribute('aria-hidden', 'true');
          modal.style.display = 'none';
        }
      });
    }
  });

  

  if (el.btnClearSwaps) {
    el.btnClearSwaps.onclick = () => {
      if (!state.connected) return;
      setBusy(true);
      clearCardsInCurrentMode().catch(() => {}).finally(() => setBusy(false));
    };
  }
  
  
  
};

    

    const boot = async () => {
      setChip(el.pillWs, "WS: -", "warn");
      setChip(el.pillScene, "Cena: -", "warn");
      setChip(el.pillSlot, "Seleção: -", "warn");

      bindUi();
      updatePanelsVisibility("domready");

      restoreUiState();

      mcScoreboardRestoreState();
      mcScoreboardSetTimerPreview(mcScoreboardFormatTime(mcScoreboardGetElapsedMs()));
      if (state.mcScoreboard.running) mcScoreboardStartTimerLoop();

      await loadInitialRoster();
      await refreshTeams({ force: true, reason: "boot" });
      startRosterPolling();

      

      state.selectedSlot = getSlotName(1);
      state.selectedMcSlot = mcSlotName(1);
      state.selectedMcReserve = mcReserveName(1);

      renderSlotSelect();
      if (el.targetSelect) state.target = el.targetSelect.value === "mc" ? "mc" : "field";
      await applyTargetUiState();

      

      await connectAndSync();
    };

    boot().catch((e) => log("BOOT ERROR", { err: String(e && e.message || e) }));

  } catch (e) {
    

    

    console.error(e);
  }
})();
