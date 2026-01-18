let domCache = null;

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
    homeTeamSelect: document.getElementById('homeTeamSelect'),
    awayTeamSelect: document.getElementById('awayTeamSelect'),
    rosterBody: document.getElementById('rosterBody'),
    btnSyncObs: document.getElementById('btnSyncObs'),
    btnLogCopy: document.getElementById('btnLogCopy'),
    btnLogClear: document.getElementById('btnLogClear'),
    btnLowPower: document.getElementById('btnLowPower'),
    loggerLines: document.getElementById('loggerLines')
  };
  return domCache;
}

export function renderAll() {
  return;
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
