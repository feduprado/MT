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
    penaltiesHomeScore: document.getElementById('penaltiesHomeScore'),
    penaltiesAwayScore: document.getElementById('penaltiesAwayScore'),
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
    modalMask: document.getElementById('modalMask'),
    modalTimerSet: document.getElementById('modalTimerSet'),
    timerSetMinutes: document.getElementById('timerSetMinutes'),
    timerSetSeconds: document.getElementById('timerSetSeconds'),
    btnTimerSetCancel: document.getElementById('btnTimerSetCancel'),
    btnTimerSetConfirm: document.getElementById('btnTimerSetConfirm'),
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
      input.value = state.teams.home.players[index]?.name || '';
    });
  }

  if (dom.rosterAwayPlayers.length) {
    dom.rosterAwayPlayers.forEach((input, index) => {
      if (!input) {
        return;
      }
      input.value = state.teams.away.players[index]?.name || '';
    });
  }
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
