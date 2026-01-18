const REQUEST_TIMEOUT = 3000;
const QUEUE_LIMIT = 200;
const SKIN_PLACEHOLDER = '<skin>';

function pad2(value) {
  return String(value).padStart(2, '0');
}

function clampScore(value) {
  return Math.max(0, Math.min(99, value));
}

function safeText(value) {
  return String(value ?? '').trim();
}

function formatAggregate(value) {
  return `(${clampScore(value)})`;
}

function formatTimer(ms) {
  const totalSeconds = Math.floor((Number(ms) || 0) / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${pad2(minutes)}:${pad2(seconds)}`;
}

export class SyncEngine {
  constructor(obsClient, logger, getRuntimeState) {
    this.obsClient = obsClient;
    this.logger = logger;
    this.getRuntimeState = getRuntimeState;
    this.queue = [];
    this.processing = false;
    this.sceneItemIdCache = new Map();
    this.inputFileCache = new Map();
    this.transformOffsetCache = new Map();
    this.offlineNotified = false;
  }

  isIdentified() {
    const identified = this.obsClient?.state === 'IDENTIFIED';
    if (identified) {
      this.offlineNotified = false;
    }
    return identified;
  }

  logOffline() {
    if (this.offlineNotified) {
      return;
    }
    this.logger?.info('offline: changes pending');
    this.offlineNotified = true;
  }

  logWithLevel(level, message, meta) {
    if (!this.logger) {
      return;
    }
    const handler = this.logger[level] || this.logger.info;
    handler.call(this.logger, message, meta);
  }

  enqueue(task) {
    if (this.queue.length >= QUEUE_LIMIT) {
      this.logger?.warn('sync queue overflow');
      return Promise.resolve(false);
    }
    return new Promise((resolve) => {
      this.queue.push({ task, resolve });
      if (!this.processing) {
        this.processQueue();
      }
    });
  }

  async processQueue() {
    this.processing = true;
    while (this.queue.length > 0) {
      const item = this.queue.shift();
      if (!item) {
        continue;
      }
      try {
        await item.task();
        item.resolve(true);
      } catch (error) {
        this.logger?.warn('sync task failed', { error: error?.message || 'unknown' });
        item.resolve(false);
      }
    }
    this.processing = false;
  }

  async callObs(requestType, requestData) {
    if (!this.obsClient) {
      throw new Error('obs client missing');
    }
    return this.obsClient.call(requestType, requestData, REQUEST_TIMEOUT);
  }

  getSceneName(state) {
    return state?.meta?.sceneName || 'Match Center';
  }

  getSkinName(state) {
    return state?.meta?.skin || 'generico';
  }

  withSkin(sourceName, skin) {
    if (!sourceName || !skin) {
      return sourceName;
    }
    if (!sourceName.includes(SKIN_PLACEHOLDER)) {
      return sourceName;
    }
    return sourceName.split(SKIN_PLACEHOLDER).join(skin);
  }

  resolveSourceName(sourceName, state) {
    return this.withSkin(sourceName, this.getSkinName(state));
  }

  async getSceneItemId(sceneName, sourceName) {
    const key = `${sceneName}|${sourceName}`;
    if (this.sceneItemIdCache.has(key)) {
      return this.sceneItemIdCache.get(key);
    }
    const response = await this.callObs('GetSceneItemId', { sceneName, sourceName });
    const sceneItemId = response.sceneItemId;
    this.sceneItemIdCache.set(key, sceneItemId);
    return sceneItemId;
  }

  async setSceneItemEnabled(sceneName, sourceName, enabled) {
    const sceneItemId = await this.getSceneItemId(sceneName, sourceName);
    await this.callObs('SetSceneItemEnabled', {
      sceneName,
      sceneItemId,
      sceneItemEnabled: Boolean(enabled)
    });
  }

  async safeSetSceneItemEnabled(sceneName, sourceName, enabled) {
    try {
      await this.setSceneItemEnabled(sceneName, sourceName, enabled);
      return true;
    } catch (error) {
      this.logWithLevel('debug', 'scene item toggle skipped', {
        sceneName,
        sourceName,
        error: error?.message || 'unknown'
      });
      return false;
    }
  }

  async setInputSettings(inputName, inputSettings, overlay = false) {
    await this.callObs('SetInputSettings', {
      inputName,
      inputSettings,
      overlay
    });
  }

  async safeSetInputSettings(inputName, inputSettings, options = {}) {
    const { overlay = false, logLevel = 'warn', context = 'input settings' } = options;
    try {
      await this.setInputSettings(inputName, inputSettings, overlay);
      return true;
    } catch (error) {
      this.logWithLevel(logLevel, `${context} failed`, {
        inputName,
        error: error?.message || 'unknown'
      });
      return false;
    }
  }

  async setInputText(sourceName, text, logLevel = 'warn') {
    await this.safeSetInputSettings(
      sourceName,
      {
        text
      },
      { logLevel, context: 'text update' }
    );
  }

  async setScoreInput(sourceName, value) {
    await this.safeSetInputSettings(
      sourceName,
      {
        text: String(clampScore(value))
      },
      { context: 'score update' }
    );
  }

  async setInputFontFace(sourceName, fontFace) {
    if (!fontFace) {
      return false;
    }
    return this.safeSetInputSettings(
      sourceName,
      {
        font: {
          face: fontFace
        }
      },
      { overlay: true, logLevel: 'debug', context: 'font update' }
    );
  }

  async updateInputFile(sceneName, sourceName, fileName, options = {}) {
    const { logLevel = 'warn', context = 'input file update' } = options;
    const cacheKey = `${sceneName}|${sourceName}`;
    let basePath = this.inputFileCache.get(cacheKey);
    if (!basePath) {
      const response = await this.callObs('GetInputSettings', { inputName: sourceName });
      const filePath = response?.inputSettings?.file;
      if (!filePath || typeof filePath !== 'string') {
        this.logWithLevel(logLevel, 'input file path not found', { sourceName });
        return false;
      }
      const lastSlash = Math.max(filePath.lastIndexOf('/'), filePath.lastIndexOf('\\'));
      if (lastSlash === -1) {
        this.logWithLevel(logLevel, 'input file path invalid', { sourceName });
        return false;
      }
      basePath = filePath.slice(0, lastSlash + 1);
      this.inputFileCache.set(cacheKey, basePath);
    }
    await this.safeSetInputSettings(
      sourceName,
      {
        file: `${basePath}${fileName}`
      },
      { logLevel, context }
    );
    return true;
  }

  async updateCardFile(sceneName, sourceName, fileName) {
    return this.updateInputFile(sceneName, sourceName, fileName, { context: 'card update' });
  }

  async updateIconSide(sceneName, iconSource, nameSource, isSwapped) {
    try {
      const cacheKey = `${sceneName}|${iconSource}`;
      let offset = this.transformOffsetCache.get(cacheKey);
      if (offset === undefined) {
        const [iconId, nameId] = await Promise.all([
          this.getSceneItemId(sceneName, iconSource),
          this.getSceneItemId(sceneName, nameSource)
        ]);
        const [iconTransform, nameTransform] = await Promise.all([
          this.callObs('GetSceneItemTransform', { sceneName, sceneItemId: iconId }),
          this.callObs('GetSceneItemTransform', { sceneName, sceneItemId: nameId })
        ]);
        const iconX = iconTransform?.sceneItemTransform?.positionX;
        const nameX = nameTransform?.sceneItemTransform?.positionX;
        if (typeof iconX !== 'number' || typeof nameX !== 'number') {
          return;
        }
        offset = iconX - nameX;
        this.transformOffsetCache.set(cacheKey, offset);
      }
      if (typeof offset !== 'number') {
        return;
      }
      const nameId = await this.getSceneItemId(sceneName, nameSource);
      const nameTransform = await this.callObs('GetSceneItemTransform', { sceneName, sceneItemId: nameId });
      const nameX = nameTransform?.sceneItemTransform?.positionX;
      if (typeof nameX !== 'number') {
        return;
      }
      const iconId = await this.getSceneItemId(sceneName, iconSource);
      const iconX = isSwapped ? nameX - offset : nameX + offset;
      await this.callObs('SetSceneItemTransform', {
        sceneName,
        sceneItemId: iconId,
        sceneItemTransform: {
          positionX: iconX
        }
      });
    } catch (error) {
      this.logWithLevel('debug', 'icon swap skipped', { sourceName: iconSource });
    }
  }

  async applyTeams(state) {
    const sceneName = this.getSceneName(state);
    const skin = this.getSkinName(state);
    await this.setInputText(
      this.withSkin('esq_escalacao_time_<skin>', skin),
      safeText(state.teams?.home?.name)
    );
    await this.setInputText(
      this.withSkin('dir_escalacao_time_<skin>', skin),
      safeText(state.teams?.away?.name)
    );
    await this.setInputText(
      this.withSkin('esq_escalacao_tecnico_<skin>', skin),
      safeText(state.teams?.home?.coach)
    );
    await this.setInputText(
      this.withSkin('dir_escalacao_tecnico_<skin>', skin),
      safeText(state.teams?.away?.coach)
    );
    await this.setInputText(
      this.withSkin('placar_siglatime_esq_<skin>', skin),
      safeText(state.teams?.home?.sigla)
    );
    await this.setInputText(
      this.withSkin('placar_siglatime_dir_<skin>', skin),
      safeText(state.teams?.away?.sigla)
    );
    const homeLogo = safeText(state.teams?.home?.logo);
    const awayLogo = safeText(state.teams?.away?.logo);
    await this.safeSetInputSettings(
      'esq_team.png',
      { file: homeLogo },
      { logLevel: 'warn', context: 'team logo update' }
    );
    await this.safeSetInputSettings(
      'dir_team.png',
      { file: awayLogo },
      { logLevel: 'warn', context: 'team logo update' }
    );
    this.logger?.info('sync teams', { sceneName });
  }

  syncTeams(state) {
    if (!this.isIdentified()) {
      this.logOffline();
      return Promise.resolve(false);
    }
    return this.enqueue(async () => {
      await this.applyTeams(state);
    });
  }

  async applyScore(state) {
    const skin = this.getSkinName(state);
    await this.setScoreInput(this.withSkin('placar_gols_esq_<skin>', skin), state.score.home);
    await this.setScoreInput(this.withSkin('placar_gols_dir_<skin>', skin), state.score.away);
    await this.setInputText(
      this.withSkin('placar_agregado_esq_<skin>', skin),
      formatAggregate(state.score.aggregateHome)
    );
    await this.setInputText(
      this.withSkin('placar_agregado_dir_<skin>', skin),
      formatAggregate(state.score.aggregateAway)
    );
    await this.setInputText(
      this.withSkin('placar_penaltis_esq_<skin>', skin),
      String(clampScore(state.score.penaltiesHome)),
      'debug'
    );
    await this.setInputText(
      this.withSkin('placar_penaltis_dir_<skin>', skin),
      String(clampScore(state.score.penaltiesAway)),
      'debug'
    );
  }

  syncScore(state) {
    if (!this.isIdentified()) {
      this.logOffline();
      return Promise.resolve(false);
    }
    return this.enqueue(async () => {
      const sceneName = this.getSceneName(state);
      await this.applyScore(state);
      this.logger?.info('sync score', { sceneName });
    });
  }

  async applyTimer(state) {
    const skin = this.getSkinName(state);
    await this.setInputText(this.withSkin('cronometro_tempo_<skin>', skin), formatTimer(state.timer?.elapsedMs));
    await this.setInputText(
      this.withSkin('cronometro_etapa_<skin>', skin),
      safeText(state.timer?.period)
    );
  }

  syncTimer(state) {
    if (!this.isIdentified()) {
      this.logOffline();
      return Promise.resolve(false);
    }
    return this.enqueue(async () => {
      await this.applyTimer(state);
    });
  }

  async applyPlayer(team, slot1to11, state) {
    const slotIndex = slot1to11 - 1;
    const teamState = state.teams?.[team];
    const player = teamState?.slots?.[slotIndex];
    if (!player) {
      return;
    }
    const side = team === 'home' ? 'esq' : 'dir';
    const slot = pad2(slot1to11);
    const skin = this.getSkinName(state);
    const nameSource = this.withSkin(`${side}_jogador_${slot}_<skin>`, skin);
    const goalballSource = this.withSkin(`${side}_goalball_${slot}_<skin>`, skin);
    const moreGoalSource = this.withSkin(`${side}_moregoalball_${slot}_<skin>`, skin);
    const moreGoalTextSource = this.withSkin(`${side}_moregoalball_text_${slot}_<skin>`, skin);
    const cardSource = this.withSkin(`${side}_card_${slot}_<skin>`, skin);
    const swapSource = this.withSkin(`${side}_swap_${slot}_<skin>`, skin);
    const number = pad2(player.number);
    const formattedName = team === 'home' ? `${number} ${safeText(player.name)}` : `${safeText(player.name)} ${number}`;
    const goalVisible = player.goals === 1;
    const moreGoalVisible = player.goals >= 2;
    const cardVisible = player.yellowCards > 0 || player.redCard;
    const swapVisible = Boolean(player.isSubstitute || teamState.substitutionSlots?.[slotIndex]);
    const cardFile = player.redCard || player.yellowCards >= 2 ? 'redcard.png' : 'yellowcard.png';
    const sceneName = this.getSceneName(state);

    await this.setInputText(nameSource, formattedName);
    await this.safeSetSceneItemEnabled(sceneName, goalballSource, goalVisible);
    await this.safeSetSceneItemEnabled(sceneName, moreGoalSource, moreGoalVisible);
    if (moreGoalVisible) {
      await this.setInputText(moreGoalTextSource, String(player.goals));
    }
    await this.safeSetSceneItemEnabled(sceneName, cardSource, cardVisible);
    if (cardVisible) {
      await this.updateCardFile(sceneName, cardSource, cardFile);
    }
    await this.safeSetSceneItemEnabled(sceneName, swapSource, swapVisible);
    if (player.cardIconSide) {
      await this.updateIconSide(sceneName, cardSource, nameSource, player.cardIconSide === 'swapped');
    }
    if (player.swapIconSide) {
      await this.updateIconSide(sceneName, swapSource, nameSource, player.swapIconSide === 'swapped');
    }
  }

  syncPlayer(team, slot1to11, state) {
    if (!this.isIdentified()) {
      this.logOffline();
      return Promise.resolve(false);
    }
    return this.enqueue(async () => {
      await this.applyPlayer(team, slot1to11, state);
    });
  }

  async applyAllPlayers(state) {
    for (let slot = 1; slot <= 11; slot += 1) {
      await this.applyPlayer('home', slot, state);
      await this.applyPlayer('away', slot, state);
    }
  }

  syncAllPlayers(state) {
    if (!this.isIdentified()) {
      this.logOffline();
      return Promise.resolve(false);
    }
    return this.enqueue(async () => {
      await this.applyAllPlayers(state);
    });
  }

  async applyPenalties(state) {
    const sceneName = this.getSceneName(state);
    const skin = this.getSkinName(state);
    const showPenaltyPlace = state.timer?.period === 'PEN';
    await this.safeSetSceneItemEnabled(sceneName, `penalti_place_${skin}.png`, showPenaltyPlace);

    const sides = [
      { key: 'home', prefix: 'esq' },
      { key: 'away', prefix: 'dir' }
    ];
    for (const side of sides) {
      const list = state.penalties?.[side.key] || [];
      for (let i = 0; i < 5; i += 1) {
        const markerSource = `${side.prefix}_penalti${i + 1}_${skin}.png`;
        const value = list[i];
        const enabled = value !== null && value !== undefined;
        await this.safeSetSceneItemEnabled(sceneName, markerSource, enabled);
        if (value === true) {
          await this.updateInputFile(sceneName, markerSource, 'goalball.png', {
            logLevel: 'debug',
            context: 'penalty marker update'
          });
        } else if (value === false) {
          await this.updateInputFile(sceneName, markerSource, 'xgoal.png', {
            logLevel: 'debug',
            context: 'penalty marker update'
          });
        }
      }
    }
  }

  syncPenalties(state) {
    if (!this.isIdentified()) {
      this.logOffline();
      return Promise.resolve(false);
    }
    return this.enqueue(async () => {
      await this.applyPenalties(state);
    });
  }

  syncAll(state) {
    if (!this.isIdentified()) {
      this.logOffline();
      return Promise.resolve(false);
    }
    return this.enqueue(async () => {
      const sceneName = this.getSceneName(state);
      await this.applyTeams(state);
      await this.applyScore(state);
      await this.applyTimer(state);
      await this.applyAllPlayers(state);
      await this.applyPenalties(state);
      this.logger?.info('sync all', { sceneName });
    });
  }
}
