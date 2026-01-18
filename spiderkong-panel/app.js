(() => {
  "use strict";
  console.log("[SpiderKong] app.js loaded");

  // Prevent double load
  if (window.__SPIDERKONG_LOADED__) return;
  window.__SPIDERKONG_LOADED__ = true;

  // ============================================================
  // DOM HELPER
  // ============================================================
  const $ = (id) => document.getElementById(id);

  const el = {
    // Header
    sceneSelect: $("sceneSelect"),
    skinSelect: $("skinSelect"),
    pillWs: $("pillWs"),

    // Teams
    homeTeamSelect: $("homeTeamSelect"),
    awayTeamSelect: $("awayTeamSelect"),
    homeTeamName: $("homeTeamName"),
    awayTeamName: $("awayTeamName"),
    homeTeamSigla: $("homeTeamSigla"),
    awayTeamSigla: $("awayTeamSigla"),
    homeCoach: $("homeCoach"),
    awayCoach: $("awayCoach"),
    btnApplyHome: $("btnApplyHome"),
    btnApplyAway: $("btnApplyAway"),

    // Score
    scoreHome: $("scoreHome"),
    scoreAway: $("scoreAway"),
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
    btnTimerResume: $("btnTimerResume"),
    btnTimerReset: $("btnTimerReset"),
    btnStatus1T: $("btnStatus1T"),
    btnStatus2T: $("btnStatus2T"),
    btnStatusInt: $("btnStatusInt"),
    btnStatusPro: $("btnStatusPro"),
    btnStatusPen: $("btnStatusPen"),

    // Penalties
    penaltiesPanel: $("penaltiesPanel"),
    penTagHome: $("penTagHome"),
    penTagAway: $("penTagAway"),
    penListHome: $("penListHome"),
    penListAway: $("penListAway"),
    btnPenaltyAdd: $("btnPenaltyAdd"),
    btnPenaltyReset: $("btnPenaltyReset"),

    // Roster
    btnToggleRoster: $("btnToggleRoster"),
    rosterBody: $("rosterBody"),
    rosterHomeList: $("rosterHomeList"),
    rosterAwayList: $("rosterAwayList"),
    btnApplyRoster: $("btnApplyRoster"),

    // Actions
    btnSyncObs: $("btnSyncObs"),
    btnReconnect: $("btnReconnect"),

    // Player Modal
    playerModal: $("playerModal"),
    btnPlayerModalClose: $("btnPlayerModalClose"),
    playerModalInfo: $("playerModalInfo"),
    btnPlayerGoal: $("btnPlayerGoal"),
    btnPlayerYellow: $("btnPlayerYellow"),
    btnPlayerRed: $("btnPlayerRed"),
    btnPlayerSub: $("btnPlayerSub"),

    // Sub Modal
    subModal: $("subModal"),
    btnSubModalClose: $("btnSubModalClose"),
    subSearch: $("subSearch"),
    subList: $("subList"),
    btnSubConfirm: $("btnSubConfirm")
  };

  // ============================================================
  // LOGGING
  // ============================================================
  const now = () => new Date().toLocaleTimeString("pt-BR", { hour12: false });
  const log = (msg, obj) => {
    const line = `[${now()}] ${msg}` + (obj ? ` ${JSON.stringify(obj)}` : "");
    console.log(line);
  };

  // ============================================================
  // CONFIG
  // ============================================================
  const CFG = window.CONFIG || {};

  // ============================================================
  // STATE
  // ============================================================
  const state = {
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

    // Teams
    teams: {
      home: { name: "", sigla: "", coach: "", logo: "" },
      away: { name: "", sigla: "", coach: "", logo: "" }
    },

    // Score
    score: { home: 0, away: 0 },

    // Aggregate
    aggregate: { enabled: false, home: 0, away: 0 },

    // Timer
    timer: {
      running: false,
      elapsedMs: 0,
      period: "1T",
      handle: null,
      startedAt: null
    },

    // Penalties
    penalties: {
      active: false,
      home: [],
      away: []
    },

    // Roster
    roster: {
      home: Array.from({ length: 11 }, (_, i) => createPlayer(i + 1)),
      away: Array.from({ length: 11 }, (_, i) => createPlayer(i + 1))
    },

    // Selected player for modal
    selectedPlayer: null,
    selectedTeam: null
  };

  function createPlayer(slot) {
    return {
      slot,
      number: slot,
      name: "",
      goals: 0,
      yellowCards: 0,
      redCard: false,
      substitutedOut: false
    };
  }

  // ============================================================
  // WEBSOCKET (OBS-WebSocket v5)
  // ============================================================
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
    log("WS connecting", { url });
    updateWsPill("connecting");

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
      updateWsPill("off");
      log("WS closed", { code: ev.code });

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
    log("WS hello", { authRequired: !!data?.authentication });

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

  function handleIdentified() {
    state.connected = true;
    state.retryIndex = 0;
    updateWsPill("on");
    log("WS identified");

    // Load scenes
    loadScenes();
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
    log("WS reconnect scheduled", { delayMs: delay + jitter });

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

  function updateWsPill(status) {
    if (!el.pillWs) return;

    el.pillWs.classList.remove("pill--on", "pill--off");

    if (status === "on") {
      el.pillWs.classList.add("pill--on");
      el.pillWs.textContent = "WS ON";
    } else if (status === "connecting") {
      el.pillWs.textContent = "WS...";
    } else {
      el.pillWs.classList.add("pill--off");
      el.pillWs.textContent = "WS OFF";
    }
  }

  // ============================================================
  // OBS OPERATIONS
  // ============================================================
  async function loadScenes() {
    try {
      const res = await call("GetSceneList");
      state.availableScenes = (res.scenes || []).map((s) => s.sceneName);
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

      log("Scenes loaded", { count: state.availableScenes.length });
    } catch (err) {
      log("Error loading scenes", { error: err.message });
    }
  }

  async function setScene(sceneName) {
    try {
      await call("SetCurrentProgramScene", { sceneName });
      state.currentScene = sceneName;
      log("Scene changed", { scene: sceneName });
    } catch (err) {
      log("Error changing scene", { error: err.message });
    }
  }

  async function setInputText(inputName, text) {
    try {
      await call("SetInputSettings", {
        inputName,
        inputSettings: { text: String(text) }
      });
    } catch (err) {
      log("Error setting text", { input: inputName, error: err.message });
    }
  }

  async function setInputFile(inputName, file) {
    try {
      await call("SetInputSettings", {
        inputName,
        inputSettings: { file }
      });
    } catch (err) {
      log("Error setting file", { input: inputName, error: err.message });
    }
  }

  function getSourceName(pattern) {
    return pattern.replace("<skin>", state.currentSkin);
  }

  // ============================================================
  // SYNC TO OBS
  // ============================================================
  async function syncScore() {
    const homeSource = getSourceName(CFG.sourcePatterns?.scoreHome || "<skin>_score_home");
    const awaySource = getSourceName(CFG.sourcePatterns?.scoreAway || "<skin>_score_away");

    await Promise.all([
      setInputText(homeSource, String(state.score.home)),
      setInputText(awaySource, String(state.score.away))
    ]);

    log("Score synced", state.score);
  }

  async function syncTeams() {
    const patterns = CFG.sourcePatterns || {};

    const tasks = [];

    // Home team
    if (patterns.teamNameHome) {
      tasks.push(setInputText(getSourceName(patterns.teamNameHome), state.teams.home.name));
    }
    if (patterns.teamSiglaHome) {
      tasks.push(setInputText(getSourceName(patterns.teamSiglaHome), state.teams.home.sigla));
    }
    if (patterns.coachHome) {
      tasks.push(setInputText(getSourceName(patterns.coachHome), state.teams.home.coach));
    }
    if (patterns.teamLogoHome && state.teams.home.logo) {
      tasks.push(setInputFile(getSourceName(patterns.teamLogoHome), state.teams.home.logo));
    }

    // Away team
    if (patterns.teamNameAway) {
      tasks.push(setInputText(getSourceName(patterns.teamNameAway), state.teams.away.name));
    }
    if (patterns.teamSiglaAway) {
      tasks.push(setInputText(getSourceName(patterns.teamSiglaAway), state.teams.away.sigla));
    }
    if (patterns.coachAway) {
      tasks.push(setInputText(getSourceName(patterns.coachAway), state.teams.away.coach));
    }
    if (patterns.teamLogoAway && state.teams.away.logo) {
      tasks.push(setInputFile(getSourceName(patterns.teamLogoAway), state.teams.away.logo));
    }

    await Promise.all(tasks);
    log("Teams synced");
  }

  async function syncTimer() {
    const timerSource = getSourceName(CFG.sourcePatterns?.timer || "<skin>_timer");
    const periodSource = getSourceName(CFG.sourcePatterns?.period || "<skin>_period");

    const formatted = formatTime(state.timer.elapsedMs);

    await Promise.all([
      setInputText(timerSource, formatted),
      setInputText(periodSource, state.timer.period)
    ]);
  }

  async function syncAggregate() {
    if (!state.aggregate.enabled) return;

    const patterns = CFG.sourcePatterns || {};
    const tasks = [];

    if (patterns.aggHome) {
      tasks.push(setInputText(getSourceName(patterns.aggHome), String(state.aggregate.home)));
    }
    if (patterns.aggAway) {
      tasks.push(setInputText(getSourceName(patterns.aggAway), String(state.aggregate.away)));
    }

    await Promise.all(tasks);
  }

  async function syncAll() {
    log("Full sync started");
    await Promise.all([
      syncScore(),
      syncTeams(),
      syncTimer(),
      syncAggregate()
    ]);
    log("Full sync completed");
  }

  // ============================================================
  // TIMER
  // ============================================================
  function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  function parseTime(str) {
    const parts = (str || "").split(":");
    if (parts.length !== 2) return 0;
    const m = parseInt(parts[0], 10) || 0;
    const s = parseInt(parts[1], 10) || 0;
    return (m * 60 + s) * 1000;
  }

  function startTimer() {
    if (state.timer.running) return;

    state.timer.running = true;
    state.timer.startedAt = Date.now() - state.timer.elapsedMs;

    state.timer.handle = setInterval(() => {
      state.timer.elapsedMs = Date.now() - state.timer.startedAt;
      updateTimerUI();

      // Sync every 1 second
      syncTimer();
    }, 1000);

    log("Timer started");
  }

  function pauseTimer() {
    if (!state.timer.running) return;

    state.timer.running = false;
    clearInterval(state.timer.handle);
    state.timer.handle = null;
    state.timer.elapsedMs = Date.now() - state.timer.startedAt;

    log("Timer paused", { elapsed: formatTime(state.timer.elapsedMs) });
  }

  function resetTimer() {
    pauseTimer();
    state.timer.elapsedMs = 0;
    state.timer.startedAt = null;
    updateTimerUI();
    syncTimer();
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
    log("Timer set", { value: formatTime(ms) });
  }

  function updateTimerUI() {
    if (el.timerDisplay) {
      el.timerDisplay.textContent = formatTime(state.timer.elapsedMs);
    }
  }

  function setPeriod(period) {
    state.timer.period = period;

    // Update UI
    [el.btnStatus1T, el.btnStatus2T, el.btnStatusInt, el.btnStatusPro, el.btnStatusPen].forEach((btn) => {
      if (btn) btn.classList.remove("active");
    });

    const btnMap = {
      "1T": el.btnStatus1T,
      "2T": el.btnStatus2T,
      "INT": el.btnStatusInt,
      "PRO": el.btnStatusPro,
      "PEN": el.btnStatusPen
    };

    if (btnMap[period]) {
      btnMap[period].classList.add("active");
    }

    // Show/hide penalties panel
    if (period === "PEN") {
      state.penalties.active = true;
      if (el.penaltiesPanel) {
        el.penaltiesPanel.classList.remove("isHidden");
      }
    } else {
      state.penalties.active = false;
      if (el.penaltiesPanel) {
        el.penaltiesPanel.classList.add("isHidden");
      }
    }

    syncTimer();
    log("Period set", { period });
  }

  // ============================================================
  // SCORE
  // ============================================================
  function updateScoreUI() {
    if (el.scoreHome) el.scoreHome.textContent = String(state.score.home);
    if (el.scoreAway) el.scoreAway.textContent = String(state.score.away);
  }

  function changeScore(team, delta) {
    const current = state.score[team];
    state.score[team] = Math.max(0, Math.min(99, current + delta));
    updateScoreUI();
    updateAggregateUI();
    syncScore();
    saveState();
  }

  function resetScore() {
    state.score.home = 0;
    state.score.away = 0;
    updateScoreUI();
    updateAggregateUI();
    syncScore();
    saveState();
    log("Score reset");
  }

  // ============================================================
  // AGGREGATE
  // ============================================================
  function toggleAggregate() {
    state.aggregate.enabled = !state.aggregate.enabled;

    if (el.btnToggleAgg) {
      el.btnToggleAgg.classList.toggle("active", state.aggregate.enabled);
      el.btnToggleAgg.innerHTML = `<span class="material-symbols-outlined">calculate</span> AGREGADO: ${state.aggregate.enabled ? "ON" : "OFF"}`;
    }

    if (el.aggControls) {
      el.aggControls.classList.toggle("isHidden", !state.aggregate.enabled);
    }

    updateAggregateUI();
    saveState();
  }

  function changeAggregate(team, delta) {
    const current = state.aggregate[team];
    state.aggregate[team] = Math.max(0, Math.min(99, current + delta));
    updateAggregateUI();
    syncAggregate();
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

  // ============================================================
  // PENALTIES
  // ============================================================
  function addPenalty() {
    // Alternate between teams
    const homeCount = state.penalties.home.length;
    const awayCount = state.penalties.away.length;

    if (homeCount <= awayCount) {
      state.penalties.home.push("empty");
    } else {
      state.penalties.away.push("empty");
    }

    renderPenalties();
    saveState();
  }

  function resetPenalties() {
    state.penalties.home = [];
    state.penalties.away = [];
    renderPenalties();
    saveState();
    log("Penalties reset");
  }

  function cyclePenalty(team, index) {
    const arr = state.penalties[team];
    if (index >= arr.length) return;

    const current = arr[index];
    const next = current === "empty" ? "goal" : current === "goal" ? "miss" : "empty";
    arr[index] = next;

    renderPenalties();
    saveState();
  }

  function renderPenalties() {
    renderPenaltyList(el.penListHome, state.penalties.home, "home");
    renderPenaltyList(el.penListAway, state.penalties.away, "away");
  }

  function renderPenaltyList(container, arr, team) {
    if (!container) return;
    container.innerHTML = "";

    arr.forEach((val, i) => {
      const btn = document.createElement("button");
      btn.className = `penBtn ${val === "goal" ? "is-goal" : val === "miss" ? "is-miss" : ""}`;
      btn.innerHTML = val === "goal" ? "O" : val === "miss" ? "X" : "-";
      btn.onclick = () => cyclePenalty(team, i);
      container.appendChild(btn);
    });
  }

  // ============================================================
  // TEAMS
  // ============================================================
  function loadTeamsData() {
    const teamsData = window.SPIDERKONG_TEAMS?.teams || [];

    [el.homeTeamSelect, el.awayTeamSelect].forEach((select) => {
      if (!select) return;
      select.innerHTML = '<option value="">-- Selecionar --</option>';
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

  function applyTeamFromSelect(team) {
    const select = team === "home" ? el.homeTeamSelect : el.awayTeamSelect;
    const nameInput = team === "home" ? el.homeTeamName : el.awayTeamName;
    const siglaInput = team === "home" ? el.homeTeamSigla : el.awayTeamSigla;

    if (!select) return;

    const opt = select.options[select.selectedIndex];
    if (!opt || !opt.value) return;

    state.teams[team].name = opt.value;
    state.teams[team].sigla = opt.dataset.sigla || "";
    state.teams[team].logo = opt.dataset.file || "";

    if (nameInput) nameInput.value = opt.value;
    if (siglaInput) siglaInput.value = opt.dataset.sigla || "";

    saveState();
  }

  function applyTeamFromInputs(team) {
    const nameInput = team === "home" ? el.homeTeamName : el.awayTeamName;
    const siglaInput = team === "home" ? el.homeTeamSigla : el.awayTeamSigla;
    const coachInput = team === "home" ? el.homeCoach : el.awayCoach;

    state.teams[team].name = nameInput?.value || "";
    state.teams[team].sigla = siglaInput?.value || "";
    state.teams[team].coach = coachInput?.value || "";

    syncTeams();
    saveState();
    log("Team applied", { team, data: state.teams[team] });
  }

  // ============================================================
  // ROSTER
  // ============================================================
  function toggleRoster() {
    if (el.rosterBody) {
      el.rosterBody.classList.toggle("isHidden");
    }
    if (el.btnToggleRoster) {
      const icon = el.btnToggleRoster.querySelector(".material-symbols-outlined");
      if (icon) {
        icon.textContent = el.rosterBody?.classList.contains("isHidden") ? "expand_more" : "expand_less";
      }
    }
  }

  function renderRoster() {
    renderRosterList(el.rosterHomeList, state.roster.home, "home");
    renderRosterList(el.rosterAwayList, state.roster.away, "away");
  }

  function renderRosterList(container, players, team) {
    if (!container) return;
    container.innerHTML = "";

    players.forEach((player, i) => {
      const item = document.createElement("div");
      item.className = "rosterItem";
      if (player.substitutedOut) item.classList.add("substituted");

      const numSpan = document.createElement("span");
      numSpan.className = "rosterNumber";
      numSpan.textContent = String(player.number).padStart(2, "0");

      const nameSpan = document.createElement("span");
      nameSpan.className = "rosterName";
      nameSpan.textContent = player.name || `Jogador ${i + 1}`;

      const badges = document.createElement("div");
      badges.className = "rosterBadges";

      if (player.goals > 0) {
        const badge = document.createElement("span");
        badge.className = "badge badge--goal";
        badge.textContent = String(player.goals);
        badges.appendChild(badge);
      }

      if (player.yellowCards > 0) {
        const badge = document.createElement("span");
        badge.className = "badge badge--yellow";
        badge.textContent = String(player.yellowCards);
        badges.appendChild(badge);
      }

      if (player.redCard) {
        const badge = document.createElement("span");
        badge.className = "badge badge--red";
        badge.textContent = "R";
        badges.appendChild(badge);
      }

      item.appendChild(numSpan);
      item.appendChild(nameSpan);
      item.appendChild(badges);

      item.onclick = () => openPlayerModal(team, i);

      container.appendChild(item);
    });
  }

  // ============================================================
  // PLAYER MODAL
  // ============================================================
  function openPlayerModal(team, index) {
    state.selectedTeam = team;
    state.selectedPlayer = index;

    const player = state.roster[team][index];

    if (el.playerModalInfo) {
      el.playerModalInfo.innerHTML = `
        <div style="font-size: 24px; font-weight: 800;">${String(player.number).padStart(2, "0")}</div>
        <div style="font-size: 16px;">${player.name || "Sem nome"}</div>
        <div style="font-size: 12px; color: #888;">${team === "home" ? "Casa" : "Visitante"}</div>
      `;
    }

    showModal(el.playerModal);
  }

  function closePlayerModal() {
    hideModal(el.playerModal);
    state.selectedTeam = null;
    state.selectedPlayer = null;
  }

  function playerAction(action) {
    if (state.selectedTeam === null || state.selectedPlayer === null) return;

    const player = state.roster[state.selectedTeam][state.selectedPlayer];

    switch (action) {
      case "goal":
        player.goals++;
        changeScore(state.selectedTeam, 1);
        break;
      case "yellow":
        player.yellowCards++;
        if (player.yellowCards >= 2) {
          player.redCard = true;
        }
        break;
      case "red":
        player.redCard = true;
        break;
      case "sub":
        openSubModal();
        return;
    }

    renderRoster();
    saveState();
    closePlayerModal();
    log("Player action", { action, player: player.name });
  }

  // ============================================================
  // SUBSTITUTION MODAL
  // ============================================================
  function openSubModal() {
    hideModal(el.playerModal);

    // Load available players from roster data
    const rosterData = window.SPIDERKONG_ROSTER?.players || [];

    if (el.subList) {
      el.subList.innerHTML = "";
      rosterData.forEach((p, i) => {
        const item = document.createElement("div");
        item.className = "rosterItem";
        item.innerHTML = `<span class="rosterName">${p.name}</span>`;
        item.onclick = () => selectSubstitute(i, p);
        el.subList.appendChild(item);
      });
    }

    showModal(el.subModal);
  }

  function closeSubModal() {
    hideModal(el.subModal);
  }

  function selectSubstitute(index, playerData) {
    // Mark all as not selected
    el.subList?.querySelectorAll(".rosterItem").forEach((item) => {
      item.classList.remove("selected");
    });

    // Mark selected
    el.subList?.querySelectorAll(".rosterItem")[index]?.classList.add("selected");

    // Enable confirm button
    if (el.btnSubConfirm) {
      el.btnSubConfirm.disabled = false;
      el.btnSubConfirm.onclick = () => confirmSubstitution(playerData);
    }
  }

  function confirmSubstitution(newPlayer) {
    if (state.selectedTeam === null || state.selectedPlayer === null) return;

    const oldPlayer = state.roster[state.selectedTeam][state.selectedPlayer];
    oldPlayer.substitutedOut = true;

    // Create new player in the slot
    state.roster[state.selectedTeam][state.selectedPlayer] = {
      ...createPlayer(oldPlayer.slot),
      name: newPlayer.name,
      number: newPlayer.number || oldPlayer.slot
    };

    renderRoster();
    saveState();
    closeSubModal();
    log("Substitution", { out: oldPlayer.name, in: newPlayer.name });
  }

  // ============================================================
  // MODAL HELPERS
  // ============================================================
  function showModal(modal) {
    if (modal) {
      modal.setAttribute("aria-hidden", "false");
    }
  }

  function hideModal(modal) {
    if (modal) {
      modal.setAttribute("aria-hidden", "true");
    }
  }

  // ============================================================
  // SKINS
  // ============================================================
  function loadSkins() {
    const skins = CFG.skins || ["generico"];

    if (el.skinSelect) {
      el.skinSelect.innerHTML = "";
      skins.forEach((skin) => {
        const opt = document.createElement("option");
        opt.value = skin;
        opt.textContent = skin.charAt(0).toUpperCase() + skin.slice(1);
        el.skinSelect.appendChild(opt);
      });
      el.skinSelect.value = state.currentSkin;
    }
  }

  function changeSkin(skin) {
    state.currentSkin = skin;
    saveState();
    log("Skin changed", { skin });

    // Re-sync with new skin
    syncAll();
  }

  // ============================================================
  // STORAGE
  // ============================================================
  function saveState() {
    try {
      const data = {
        teams: state.teams,
        score: state.score,
        aggregate: state.aggregate,
        timer: {
          elapsedMs: state.timer.elapsedMs,
          period: state.timer.period
        },
        penalties: state.penalties,
        roster: state.roster,
        currentSkin: state.currentSkin
      };

      localStorage.setItem(CFG.storageKey || "spiderkong_state", JSON.stringify(data));
    } catch (err) {
      log("Error saving state", { error: err.message });
    }
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(CFG.storageKey || "spiderkong_state");
      if (!raw) return;

      const data = JSON.parse(raw);

      if (data.teams) {
        state.teams = data.teams;
        if (el.homeTeamName) el.homeTeamName.value = data.teams.home?.name || "";
        if (el.homeTeamSigla) el.homeTeamSigla.value = data.teams.home?.sigla || "";
        if (el.homeCoach) el.homeCoach.value = data.teams.home?.coach || "";
        if (el.awayTeamName) el.awayTeamName.value = data.teams.away?.name || "";
        if (el.awayTeamSigla) el.awayTeamSigla.value = data.teams.away?.sigla || "";
        if (el.awayCoach) el.awayCoach.value = data.teams.away?.coach || "";
      }

      if (data.score) {
        state.score = data.score;
        updateScoreUI();
      }

      if (data.aggregate) {
        state.aggregate = data.aggregate;
        if (state.aggregate.enabled) {
          toggleAggregate();
        }
        updateAggregateUI();
      }

      if (data.timer) {
        state.timer.elapsedMs = data.timer.elapsedMs || 0;
        state.timer.period = data.timer.period || "1T";
        updateTimerUI();
        setPeriod(state.timer.period);
      }

      if (data.penalties) {
        state.penalties = data.penalties;
        renderPenalties();
      }

      if (data.roster) {
        state.roster = data.roster;
        renderRoster();
      }

      if (data.currentSkin) {
        state.currentSkin = data.currentSkin;
        if (el.skinSelect) el.skinSelect.value = data.currentSkin;
      }

      log("State loaded from storage");
    } catch (err) {
      log("Error loading state", { error: err.message });
    }
  }

  // ============================================================
  // EVENT BINDINGS
  // ============================================================
  function bindEvents() {
    // Scene select
    el.sceneSelect?.addEventListener("change", (e) => setScene(e.target.value));

    // Skin select
    el.skinSelect?.addEventListener("change", (e) => changeSkin(e.target.value));

    // Team selects
    el.homeTeamSelect?.addEventListener("change", () => applyTeamFromSelect("home"));
    el.awayTeamSelect?.addEventListener("change", () => applyTeamFromSelect("away"));

    // Team apply buttons
    el.btnApplyHome?.addEventListener("click", () => applyTeamFromInputs("home"));
    el.btnApplyAway?.addEventListener("click", () => applyTeamFromInputs("away"));

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
    el.btnTimerResume?.addEventListener("click", startTimer);
    el.btnTimerReset?.addEventListener("click", resetTimer);
    el.btnTimerSet?.addEventListener("click", setTimerFromInput);

    // Period buttons
    el.btnStatus1T?.addEventListener("click", () => setPeriod("1T"));
    el.btnStatus2T?.addEventListener("click", () => setPeriod("2T"));
    el.btnStatusInt?.addEventListener("click", () => setPeriod("INT"));
    el.btnStatusPro?.addEventListener("click", () => setPeriod("PRO"));
    el.btnStatusPen?.addEventListener("click", () => setPeriod("PEN"));

    // Penalties
    el.btnPenaltyAdd?.addEventListener("click", addPenalty);
    el.btnPenaltyReset?.addEventListener("click", resetPenalties);

    // Roster toggle
    el.btnToggleRoster?.addEventListener("click", toggleRoster);
    el.btnApplyRoster?.addEventListener("click", () => {
      syncAll();
      log("Roster applied");
    });

    // Actions
    el.btnSyncObs?.addEventListener("click", syncAll);
    el.btnReconnect?.addEventListener("click", () => wsConnect(true));

    // Player modal
    el.btnPlayerModalClose?.addEventListener("click", closePlayerModal);
    el.btnPlayerGoal?.addEventListener("click", () => playerAction("goal"));
    el.btnPlayerYellow?.addEventListener("click", () => playerAction("yellow"));
    el.btnPlayerRed?.addEventListener("click", () => playerAction("red"));
    el.btnPlayerSub?.addEventListener("click", () => playerAction("sub"));

    // Sub modal
    el.btnSubModalClose?.addEventListener("click", closeSubModal);

    // Sub search
    el.subSearch?.addEventListener("input", (e) => {
      const term = e.target.value.toLowerCase();
      el.subList?.querySelectorAll(".rosterItem").forEach((item) => {
        const name = item.textContent.toLowerCase();
        item.style.display = name.includes(term) ? "" : "none";
      });
    });
  }

  // ============================================================
  // INITIALIZATION
  // ============================================================
  function init() {
    log("Initializing SpiderKong Panel");

    // Load data
    loadTeamsData();
    loadSkins();
    loadState();

    // Render initial UI
    renderRoster();
    renderPenalties();
    updateTimerUI();
    updateScoreUI();
    updateAggregateUI();

    // Bind events
    bindEvents();

    // Connect to OBS
    wsConnect();

    log("SpiderKong Panel initialized");
  }

  // Start
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
