let domCache = null;

export function cacheDom() {
  if (domCache) {
    return domCache;
  }
  domCache = {
    sceneSelect: document.getElementById('sceneSelect'),
    skinSelect: document.getElementById('skinSelect'),
    wsStatusPill: document.getElementById('wsStatusPill'),
    homeTeamSelect: document.getElementById('homeTeamSelect'),
    awayTeamSelect: document.getElementById('awayTeamSelect'),
    rosterBody: document.getElementById('rosterBody')
  };
  return domCache;
}

export function renderAll() {
  return;
}

export function setBusy(isBusy) {
  document.body.classList.toggle('is-busy', Boolean(isBusy));
}

export function setWsStatusPill(status) {
  const dom = cacheDom();
  if (!dom.wsStatusPill) {
    return;
  }
  dom.wsStatusPill.classList.remove('pill-success', 'pill-warning', 'pill-neutral');
  if (status === 'connected') {
    dom.wsStatusPill.textContent = 'Conectado';
    dom.wsStatusPill.classList.add('pill-success');
    return;
  }
  if (status === 'connecting') {
    dom.wsStatusPill.textContent = 'Conectando';
    dom.wsStatusPill.classList.add('pill-warning');
    return;
  }
  dom.wsStatusPill.textContent = 'Desconectado';
  dom.wsStatusPill.classList.add('pill-neutral');
}

export function toggleSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (!section) {
    return;
  }
  section.classList.toggle('hidden');
}
