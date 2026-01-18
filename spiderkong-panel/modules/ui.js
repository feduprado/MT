let domCache = null;

function formatMs(ms = 0) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function getRosterInputs(prefix) {
  return Array.from({ length: 11 }, (_, index) => {
    const id = `${prefix}Player${String(index + 1).padStart(2, '0')}`;
    return document.getElementById(id);
  });
}

function formatPlayerNumber(value) {
  const numeric = Number.parseInt(value, 10);
  if (Number.isNaN(numeric)) {
    return '00';
  }
  return String(Math.max(0, Math.min(99, numeric))).padStart(2, '0');
}

function createBadge(label, className, text) {
  const badge = document.createElement('span');
  badge.className = `player-badge ${className}`;
  badge.setAttribute('aria-label', label);
  if (text) {
    badge.textContent = text;
  }
  return badge;
}

function buildPlayerRow({ team, slotIndex, player, isAway }) {
  const row = document.createElement('div');
  row.className = 'player-row';
  if (player.substitutedOut) {
    row.classList.add('substituted');
  }
  if (player.redCard) {
    row.classList.add('expelled');
  }

  const number = document.createElement('span');
  number.className = 'player-number';
  number.textContent = formatPlayerNumber(player.number);

  const name = document.createElement('span');
  name.className = 'player-name';
  name.textContent = player.name || 'Sem nome';

  const badges = document.createElement('div');
  badges.className = 'player-badges';
  if (player.goals > 0) {
    badges.appendChild(createBadge('Gols', 'badge-goal', String(player.goals)));
  }
  if (player.yellowCards === 1) {
    badges.appendChild(createBadge('Cartao amarelo', 'badge-yellow'));
  }
  if (player.yellowCards >= 2) {
    badges.appendChild(createBadge('Segundo amarelo', 'badge-yellow-red'));
  }
  if (player.redCard) {
    badges.appendChild(createBadge('Cartao vermelho', 'badge-red'));
  }

  const actions = document.createElement('div');
  actions.className = 'player-actions';

  const actionButtons = [
    {
      action: 'goal',
      label: 'Gol',
      className: 'btn-goal',
      icon: './assets/icons/sports_soccer.svg'
    },
    {
      action: 'yellow',
      label: 'Cartao amarelo',
      className: 'btn-yellow-card',
      icon: './assets/icons/crop_portrait.svg'
    },
    {
      action: 'red',
      label: 'Cartao vermelho',
      className: 'btn-red-card',
      icon: './assets/icons/crop_portrait.svg'
    },
    {
      action: 'substitution',
      label: 'Substituicao',
      className: 'btn-substitution',
      icon: './assets/icons/sync_alt.svg'
    }
  ];

  actionButtons.forEach((config) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `btn btn-icon player-action ${config.className}`;
    button.setAttribute('title', config.label);
    button.setAttribute('aria-label', config.label);
    button.dataset.team = team;
    button.dataset.slot = String(slotIndex);
    button.dataset.action = config.action;
    const icon = document.createElement('img');
    icon.src = config.icon;
    icon.alt = '';
    icon.setAttribute('aria-hidden', 'true');
    button.appendChild(icon);
    actions.appendChild(button);
  });

  const info = document.createElement('div');
  info.className = 'player-info';
  const nameRow = document.createElement('div');
  nameRow.className = 'player-name-row';
  if (isAway) {
    nameRow.appendChild(name);
    nameRow.appendChild(number);
  } else {
    nameRow.appendChild(number);
    nameRow.appendChild(name);
  }
  nameRow.appendChild(badges);
  info.appendChild(nameRow);

  if (isAway) {
    row.classList.add('away');
    row.appendChild(actions);
    row.appendChild(info);
  } else {
    row.appendChild(info);
    row.appendChild(actions);
  }

  return row;
}

function buildOutRow(player, isAway) {
  const row = document.createElement('div');
  row.className = 'player-row out-row';

  const number = document.createElement('span');
  number.className = 'player-number';
  number.textContent = formatPlayerNumber(player.number);

  const name = document.createElement('span');
  name.className = 'player-name';
  name.textContent = player.name || 'Sem nome';

  const info = document.createElement('div');
  info.className = 'player-info';
  const nameRow = document.createElement('div');
  nameRow.className = 'player-name-row';
  if (isAway) {
    nameRow.appendChild(name);
    nameRow.appendChild(number);
  } else {
    nameRow.appendChild(number);
    nameRow.appendChild(name);
  }
  info.appendChild(nameRow);

  if (isAway) {
    row.classList.add('away');
  }
  row.appendChild(info);
  return row;
}

export function cacheDom() {
  if (domCache) {
    return domCache;
  }
  domCache = {
    sceneSelect: document.getElementById('sceneSelect'),
    skinSelect: document.getElementById('skinSelect'),
    wsStatusPill: document.getElementById('wsStatusPill'),
    wsStatusIcon: document.getElementById('wsStatusIcon'),
    wsStatusText: document.getElementById('wsStatusText'),
    btnSyncObs: document.getElementById('btnSyncObs'),
    homeTeamSelect: document.getElementById('homeTeamSelect'),
    awayTeamSelect: document.getElementById('awayTeamSelect'),
    homeTeamName: document.getElementById('homeTeamName'),
    awayTeamName: document.getElementById('awayTeamName'),
    homeTeamSigla: document.getElementById('homeTeamSigla'),
    awayTeamSigla: document.getElementById('awayTeamSigla'),
    homeCoach: document.getElementById('homeCoach'),
    awayCoach: document.getElementById('awayCoach'),
    homeLogoPreview: document.getElementById('homeLogoPreview'),
    awayLogoPreview: document.getElementById('awayLogoPreview'),
    btnApplyHomeTeam: document.getElementById('btnApplyHomeTeam'),
    btnApplyAwayTeam: document.getElementById('btnApplyAwayTeam'),
    scoreHome: document.getElementById('scoreHome'),
    scoreAway: document.getElementById('scoreAway'),
    btnScoreHomeMinus: document.getElementById('btnScoreHomeMinus'),
    btnScoreHomePlus: document.getElementById('btnScoreHomePlus'),
    btnScoreAwayMinus: document.getElementById('btnScoreAwayMinus'),
    btnScoreAwayPlus: document.getElementById('btnScoreAwayPlus'),
    aggHome: document.getElementById('aggHome'),
    aggAway: document.getElementById('aggAway'),
    timerDisplay: document.getElementById('timerDisplay'),
    btnTimerPlay: document.getElementById('btnTimerPlay'),
    btnTimerPause: document.getElementById('btnTimerPause'),
    btnTimerReset: document.getElementById('btnTimerReset'),
    btnTimerSet: document.getElementById('btnTimerSet'),
    periodButtons: Array.from(document.querySelectorAll('#periodButtons [data-period]')),
    sectionPenalties: document.getElementById('sectionPenalties'),
    penaltiesHome: document.getElementById('penaltiesHome'),
    penaltiesAway: document.getElementById('penaltiesAway'),
    penaltiesHomeScore: document.getElementById('penaltiesHomeScore'),
    penaltiesAwayScore: document.getElementById('penaltiesAwayScore'),
    btnPenaltiesClear: document.getElementById('btnPenaltiesClear'),
    rosterToggle: document.getElementById('rosterToggle'),
    rosterBody: document.getElementById('rosterBody'),
    rosterHomeCoach: document.getElementById('rosterHomeCoach'),
    rosterAwayCoach: document.getElementById('rosterAwayCoach'),
    rosterHomePlayers: getRosterInputs('home'),
    rosterAwayPlayers: getRosterInputs('away'),
    btnHomeRosterClear: document.getElementById('btnHomeRosterClear'),
    btnHomeRosterSave: document.getElementById('btnHomeRosterSave'),
    btnAwayRosterClear: document.getElementById('btnAwayRosterClear'),
    btnAwayRosterSave: document.getElementById('btnAwayRosterSave'),
    homePlayersList: document.getElementById('homePlayersList'),
    awayPlayersList: document.getElementById('awayPlayersList'),
    historyList: document.getElementById('historyList'),
    btnHistoryClear: document.getElementById('btnHistoryClear'),
    modalSubstitution: document.getElementById('modalSubstitution'),
    subOutNumber: document.getElementById('subOutNumber'),
    subOutName: document.getElementById('subOutName'),
    subInNumber: document.getElementById('subInNumber'),
    subInName: document.getElementById('subInName'),
    btnSubCancel: document.getElementById('btnSubCancel'),
    btnSubConfirm: document.getElementById('btnSubConfirm'),
    modalMask: document.getElementById('modalMask'),
    modalTimerSet: document.getElementById('modalTimerSet'),
    timerSetMinutes: document.getElementById('timerSetMinutes'),
    timerSetSeconds: document.getElementById('timerSetSeconds'),
    btnTimerSetCancel: document.getElementById('btnTimerSetCancel'),
    btnTimerSetConfirm: document.getElementById('btnTimerSetConfirm'),
    btnResetScoreTimer: document.getElementById('btnResetScoreTimer'),
    btnResetAll: document.getElementById('btnResetAll'),
    btnLogCopy: document.getElementById('btnLogCopy'),
    btnLogClear: document.getElementById('btnLogClear'),
    btnLowPower: document.getElementById('btnLowPower'),
    loggerLines: document.getElementById('loggerLines')
  };
  return domCache;
}

export function renderAll(state) {
  const dom = cacheDom();
  if (!state || !dom) {
    return;
  }

  if (dom.homeTeamName) {
    dom.homeTeamName.value = state.teams.home.name || '';
  }
  if (dom.awayTeamName) {
    dom.awayTeamName.value = state.teams.away.name || '';
  }
  if (dom.homeTeamSigla) {
    dom.homeTeamSigla.value = state.teams.home.sigla || '';
  }
  if (dom.awayTeamSigla) {
    dom.awayTeamSigla.value = state.teams.away.sigla || '';
  }
  if (dom.homeCoach) {
    dom.homeCoach.value = state.teams.home.coach || '';
  }
  if (dom.awayCoach) {
    dom.awayCoach.value = state.teams.away.coach || '';
  }

  const fallbackLogo =
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"><rect width="80" height="80" fill="%232a2f3a"/><circle cx="40" cy="40" r="26" fill="%23171a22" stroke="%2397a1b0" stroke-width="3"/></svg>';
  if (dom.homeLogoPreview) {
    dom.homeLogoPreview.src = state.teams.home.logo || fallbackLogo;
  }
  if (dom.awayLogoPreview) {
    dom.awayLogoPreview.src = state.teams.away.logo || fallbackLogo;
  }

  if (dom.scoreHome) {
    dom.scoreHome.textContent = String(state.score.home ?? 0);
  }
  if (dom.scoreAway) {
    dom.scoreAway.textContent = String(state.score.away ?? 0);
  }
  if (dom.aggHome) {
    dom.aggHome.value = String(state.score.aggregateHome ?? 0);
  }
  if (dom.aggAway) {
    dom.aggAway.value = String(state.score.aggregateAway ?? 0);
  }
  if (dom.penaltiesHomeScore) {
    dom.penaltiesHomeScore.textContent = String(state.score.penaltiesHome ?? 0);
  }
  if (dom.penaltiesAwayScore) {
    dom.penaltiesAwayScore.textContent = String(state.score.penaltiesAway ?? 0);
  }

  if (dom.timerDisplay) {
    dom.timerDisplay.textContent = formatMs(state.timer.elapsedMs || 0);
  }

  if (dom.periodButtons.length > 0) {
    dom.periodButtons.forEach((button) => {
      const isActive = button.dataset.period === state.timer.period;
      button.classList.toggle('active', isActive);
    });
  }

  if (dom.sectionPenalties) {
    dom.sectionPenalties.classList.toggle('is-visible', state.timer.period === 'PEN');
  }
  if (state.timer.period === 'PEN') {
    renderPenalties(state);
  }

  if (dom.rosterHomeCoach) {
    dom.rosterHomeCoach.value = state.teams.home.coach || '';
  }
  if (dom.rosterAwayCoach) {
    dom.rosterAwayCoach.value = state.teams.away.coach || '';
  }

  if (dom.rosterHomePlayers.length) {
    dom.rosterHomePlayers.forEach((input, index) => {
      if (!input) {
        return;
      }
      input.value = state.teams.home.slots[index]?.name || '';
    });
  }

  if (dom.rosterAwayPlayers.length) {
    dom.rosterAwayPlayers.forEach((input, index) => {
      if (!input) {
        return;
      }
      input.value = state.teams.away.slots[index]?.name || '';
    });
  }

  renderPlayersActions(state);
  renderHistory(state);
}

function createPenaltyMarker({ team, index, status }) {
  const marker = document.createElement('button');
  marker.type = 'button';
  marker.className = 'penalty-marker';
  marker.dataset.team = team;
  marker.dataset.index = String(index);
  marker.setAttribute('aria-label', `Penalti ${index + 1}`);
  if (status === true) {
    marker.classList.add('converted');
  } else if (status === false) {
    marker.classList.add('missed');
  }
  return marker;
}

function getPenaltyContainer(card) {
  if (!card) {
    return null;
  }
  const existing = card.querySelector('.penalty-markers');
  if (existing) {
    return existing;
  }
  const container = document.createElement('div');
  container.className = 'penalty-markers';
  card.appendChild(container);
  return container;
}

export function renderPenalties(state) {
  const dom = cacheDom();
  if (!dom.penaltiesHome || !dom.penaltiesAway) {
    return;
  }
  if (dom.penaltiesHomeScore) {
    dom.penaltiesHomeScore.textContent = String(state.score.penaltiesHome ?? 0);
  }
  if (dom.penaltiesAwayScore) {
    dom.penaltiesAwayScore.textContent = String(state.score.penaltiesAway ?? 0);
  }

  const homeContainer = getPenaltyContainer(dom.penaltiesHome);
  const awayContainer = getPenaltyContainer(dom.penaltiesAway);
  if (!homeContainer || !awayContainer) {
    return;
  }

  const homeFragment = document.createDocumentFragment();
  const awayFragment = document.createDocumentFragment();
  const homeMarkers = state.penalties?.home || [];
  const awayMarkers = state.penalties?.away || [];

  for (let i = 0; i < 5; i += 1) {
    homeFragment.appendChild(
      createPenaltyMarker({
        team: 'home',
        index: i,
        status: homeMarkers[i] ?? null
      })
    );
    awayFragment.appendChild(
      createPenaltyMarker({
        team: 'away',
        index: i,
        status: awayMarkers[i] ?? null
      })
    );
  }

  homeContainer.replaceChildren(homeFragment);
  awayContainer.replaceChildren(awayFragment);
}

export function renderPlayersActions(state) {
  const dom = cacheDom();
  if (!dom.homePlayersList || !dom.awayPlayersList) {
    return;
  }

  const homeFragment = document.createDocumentFragment();
  state.teams.home.slots.forEach((player, index) => {
    homeFragment.appendChild(buildPlayerRow({ team: 'home', slotIndex: index, player, isAway: false }));
  });
  if (state.teams.home.out.length) {
    const outTitle = document.createElement('div');
    outTitle.className = 'player-subtitle';
    outTitle.textContent = 'Sairam';
    homeFragment.appendChild(outTitle);
    state.teams.home.out.forEach((player) => {
      homeFragment.appendChild(buildOutRow(player, false));
    });
  }
  dom.homePlayersList.replaceChildren(homeFragment);

  const awayFragment = document.createDocumentFragment();
  state.teams.away.slots.forEach((player, index) => {
    awayFragment.appendChild(buildPlayerRow({ team: 'away', slotIndex: index, player, isAway: true }));
  });
  if (state.teams.away.out.length) {
    const outTitle = document.createElement('div');
    outTitle.className = 'player-subtitle';
    outTitle.textContent = 'Sairam';
    awayFragment.appendChild(outTitle);
    state.teams.away.out.forEach((player) => {
      awayFragment.appendChild(buildOutRow(player, true));
    });
  }
  dom.awayPlayersList.replaceChildren(awayFragment);
}

export function renderHistory(state) {
  const dom = cacheDom();
  if (!dom.historyList) {
    return;
  }
  const fragment = document.createDocumentFragment();
  const items = state.history.slice(0, 20);
  items.forEach((entry) => {
    const row = document.createElement('div');
    row.className = `history-row history-${entry.type}`;
    const minute = document.createElement('span');
    minute.className = 'history-minute';
    minute.textContent = entry.minute ?? '—';
    const text = document.createElement('span');
    text.className = 'history-text';
    text.textContent = entry.label || '';
    row.appendChild(minute);
    row.appendChild(text);
    fragment.appendChild(row);
  });
  dom.historyList.replaceChildren(fragment);
}

export function setBusy(isBusy) {
  document.body.classList.toggle('is-busy', Boolean(isBusy));
}

export function setWsStatusPill({ text, icon, tone }) {
  const dom = cacheDom();
  if (!dom.wsStatusPill) {
    return;
  }
  const toneClass = tone ? `pill-${tone}` : 'pill-neutral';
  dom.wsStatusPill.classList.remove('pill-success', 'pill-warning', 'pill-neutral', 'pill-info', 'pill-danger');
  dom.wsStatusPill.classList.add(toneClass);
  if (dom.wsStatusText) {
    dom.wsStatusText.textContent = text;
  }
  if (dom.wsStatusIcon) {
    dom.wsStatusIcon.src = icon;
  }
}

export function renderLoggerLines(lines) {
  const dom = cacheDom();
  if (!dom.loggerLines) {
    return;
  }
  dom.loggerLines.textContent = '';
  lines.forEach((line) => {
    const entry = document.createElement('div');
    entry.textContent = line;
    dom.loggerLines.appendChild(entry);
  });
  dom.loggerLines.scrollTop = dom.loggerLines.scrollHeight;
}

export function setLowPowerState(isEnabled) {
  const dom = cacheDom();
  if (!dom.btnLowPower) {
    return;
  }
  dom.btnLowPower.classList.toggle('is-active', isEnabled);
}

export function bindMainActions(handlers = {}) {
  const dom = cacheDom();
  if (dom.btnApplyHomeTeam && handlers.onApplyHomeTeam) {
    dom.btnApplyHomeTeam.addEventListener('click', handlers.onApplyHomeTeam);
  }
  if (dom.btnApplyAwayTeam && handlers.onApplyAwayTeam) {
    dom.btnApplyAwayTeam.addEventListener('click', handlers.onApplyAwayTeam);
  }
  if (dom.btnScoreHomeMinus && handlers.onScoreHomeMinus) {
    dom.btnScoreHomeMinus.addEventListener('click', handlers.onScoreHomeMinus);
  }
  if (dom.btnScoreHomePlus && handlers.onScoreHomePlus) {
    dom.btnScoreHomePlus.addEventListener('click', handlers.onScoreHomePlus);
  }
  if (dom.btnScoreAwayMinus && handlers.onScoreAwayMinus) {
    dom.btnScoreAwayMinus.addEventListener('click', handlers.onScoreAwayMinus);
  }
  if (dom.btnScoreAwayPlus && handlers.onScoreAwayPlus) {
    dom.btnScoreAwayPlus.addEventListener('click', handlers.onScoreAwayPlus);
  }
  if (dom.aggHome && handlers.onAggHomeChange) {
    dom.aggHome.addEventListener('input', handlers.onAggHomeChange);
  }
  if (dom.aggAway && handlers.onAggAwayChange) {
    dom.aggAway.addEventListener('input', handlers.onAggAwayChange);
  }
  if (dom.btnTimerPlay && handlers.onTimerPlay) {
    dom.btnTimerPlay.addEventListener('click', handlers.onTimerPlay);
  }
  if (dom.btnTimerPause && handlers.onTimerPause) {
    dom.btnTimerPause.addEventListener('click', handlers.onTimerPause);
  }
  if (dom.btnTimerReset && handlers.onTimerReset) {
    dom.btnTimerReset.addEventListener('click', handlers.onTimerReset);
  }
  if (dom.btnTimerSet && handlers.onTimerSet) {
    dom.btnTimerSet.addEventListener('click', handlers.onTimerSet);
  }
  if (dom.btnTimerSetCancel && handlers.onTimerSetCancel) {
    dom.btnTimerSetCancel.addEventListener('click', handlers.onTimerSetCancel);
  }
  if (dom.btnTimerSetConfirm && handlers.onTimerSetConfirm) {
    dom.btnTimerSetConfirm.addEventListener('click', handlers.onTimerSetConfirm);
  }
  if (dom.modalMask && handlers.onModalMaskClick) {
    dom.modalMask.addEventListener('click', handlers.onModalMaskClick);
  }
  if (dom.periodButtons.length && handlers.onPeriodSelect) {
    dom.periodButtons.forEach((button) => {
      button.addEventListener('click', () => handlers.onPeriodSelect(button.dataset.period));
    });
  }
  if (dom.rosterToggle && handlers.onRosterToggle) {
    dom.rosterToggle.addEventListener('click', handlers.onRosterToggle);
  }
  if (dom.btnHomeRosterClear && handlers.onHomeRosterClear) {
    dom.btnHomeRosterClear.addEventListener('click', handlers.onHomeRosterClear);
  }
  if (dom.btnHomeRosterSave && handlers.onHomeRosterSave) {
    dom.btnHomeRosterSave.addEventListener('click', handlers.onHomeRosterSave);
  }
  if (dom.btnAwayRosterClear && handlers.onAwayRosterClear) {
    dom.btnAwayRosterClear.addEventListener('click', handlers.onAwayRosterClear);
  }
  if (dom.btnAwayRosterSave && handlers.onAwayRosterSave) {
    dom.btnAwayRosterSave.addEventListener('click', handlers.onAwayRosterSave);
  }
  if (dom.btnHistoryClear && handlers.onHistoryClear) {
    dom.btnHistoryClear.addEventListener('click', handlers.onHistoryClear);
  }
  if (dom.btnPenaltiesClear && handlers.onPenaltiesClear) {
    dom.btnPenaltiesClear.addEventListener('click', handlers.onPenaltiesClear);
  }
  if (dom.penaltiesHome && handlers.onPenaltyCycle) {
    dom.penaltiesHome.addEventListener('click', (event) => {
      const target = event.target.closest('.penalty-marker');
      if (!target) {
        return;
      }
      handlers.onPenaltyCycle(target.dataset.team, target.dataset.index);
    });
  }
  if (dom.penaltiesAway && handlers.onPenaltyCycle) {
    dom.penaltiesAway.addEventListener('click', (event) => {
      const target = event.target.closest('.penalty-marker');
      if (!target) {
        return;
      }
      handlers.onPenaltyCycle(target.dataset.team, target.dataset.index);
    });
  }
  if (dom.btnResetScoreTimer && handlers.onResetPartial) {
    dom.btnResetScoreTimer.addEventListener('click', handlers.onResetPartial);
  }
  if (dom.btnResetAll && handlers.onResetTotal) {
    dom.btnResetAll.addEventListener('click', handlers.onResetTotal);
  }
  if (dom.btnSubCancel && handlers.onSubCancel) {
    dom.btnSubCancel.addEventListener('click', handlers.onSubCancel);
  }
  if (dom.btnSubConfirm && handlers.onSubConfirm) {
    dom.btnSubConfirm.addEventListener('click', handlers.onSubConfirm);
  }
  if (dom.homePlayersList && handlers.onPlayerAction) {
    dom.homePlayersList.addEventListener('click', (event) => {
      const target = event.target.closest('button[data-action]');
      if (!target) {
        return;
      }
      handlers.onPlayerAction(target.dataset);
    });
  }
  if (dom.awayPlayersList && handlers.onPlayerAction) {
    dom.awayPlayersList.addEventListener('click', (event) => {
      const target = event.target.closest('button[data-action]');
      if (!target) {
        return;
      }
      handlers.onPlayerAction(target.dataset);
    });
  }
}

export function setControlsEnabled(isEnabled) {
  const dom = cacheDom();
  const syncControls = [
    dom.btnApplyHomeTeam,
    dom.btnApplyAwayTeam,
    dom.btnScoreHomeMinus,
    dom.btnScoreHomePlus,
    dom.btnScoreAwayMinus,
    dom.btnScoreAwayPlus,
    dom.btnTimerPlay,
    dom.btnTimerPause,
    dom.btnTimerReset,
    dom.btnTimerSet
  ].filter(Boolean);

  syncControls.forEach((button) => {
    button.disabled = !isEnabled;
  });
}

export function bindActions({
  onSyncObs,
  onLogCopy,
  onLogClear,
  onLowPowerToggle
} = {}) {
  const dom = cacheDom();
  if (dom.btnSyncObs && onSyncObs) {
    dom.btnSyncObs.addEventListener('click', onSyncObs);
  }
  if (dom.btnLogCopy && onLogCopy) {
    dom.btnLogCopy.addEventListener('click', onLogCopy);
  }
  if (dom.btnLogClear && onLogClear) {
    dom.btnLogClear.addEventListener('click', onLogClear);
  }
  if (dom.btnLowPower && onLowPowerToggle) {
    dom.btnLowPower.addEventListener('click', onLowPowerToggle);
  }
}

export function toggleSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (!section) {
    return;
  }
  section.classList.toggle('hidden');
}
