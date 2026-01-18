const REQUEST_TIMEOUT = 3000;
const QUEUE_LIMIT = 200;

function pad2(value) {
  return String(value).padStart(2, '0');
}

function clampScore(value) {
  return Math.max(0, Math.min(99, value));
}

function safeText(value) {
  return String(value ?? '').trim();
}

export class SyncEngine {
  constructor(obsClient, logger, getRuntimeState) {
    this.obsClient = obsClient;
    this.logger = logger;
    this.getRuntimeState = getRuntimeState;
    this.queue = [];
    this.processing = false;
    this.sceneItemIdCache = new Map();
    this.cardFileCache = new Map();
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

  enqueue(task) {
    if (this.queue.length >= QUEUE_LIMIT) {
      this.logger?.warn('sync queue overflow');
      return;
    }
    this.queue.push(task);
    if (!this.processing) {
      this.processQueue();
    }
  }

  async processQueue() {
    this.processing = true;
    while (this.queue.length > 0) {
      const task = this.queue.shift();
      if (!task) {
        continue;
      }
      try {
        await task();
      } catch (error) {
        this.logger?.warn('sync task failed', { error: error?.message || 'unknown' });
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
    await this.callObs('SetSceneItemEnabled', { sceneName, sceneItemId, sceneItemEnabled: Boolean(enabled) });
  }

  async setInputText(sourceName, text) {
    await this.callObs('SetInputSettings', {
      inputName: sourceName,
      inputSettings: {
        text
      }
    });
  }

  async setScoreInput(sourceName, value) {
    await this.callObs('SetInputSettings', {
      inputName: sourceName,
      inputSettings: {
        text: String(clampScore(value))
      }
    });
  }

  async updateCardFile(sceneName, sourceName, fileName) {
    const cacheKey = `${sceneName}|${sourceName}`;
    let basePath = this.cardFileCache.get(cacheKey);
    if (!basePath) {
      const response = await this.callObs('GetInputSettings', { inputName: sourceName });
      const filePath = response?.inputSettings?.file;
      if (!filePath || typeof filePath !== 'string') {
        this.logger?.warn('card file path not found', { sourceName });
        return;
      }
      const lastSlash = Math.max(filePath.lastIndexOf('/'), filePath.lastIndexOf('\\'));
      if (lastSlash === -1) {
        this.logger?.warn('card file path invalid', { sourceName });
        return;
      }
      basePath = filePath.slice(0, lastSlash + 1);
      this.cardFileCache.set(cacheKey, basePath);
    }
    await this.callObs('SetInputSettings', {
      inputName: sourceName,
      inputSettings: {
        file: `${basePath}${fileName}`
      }
    });
  }

  async updateIconSide(sceneName, iconSource, nameSource, isSwapped) {
    const cacheKey = `${sceneName}|${iconSource}`;
    let offset = this.transformOffsetCache.get(cacheKey);
    if (offset === undefined) {
      try {
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
      } catch (error) {
        this.logger?.info('icon transform unavailable', { sourceName: iconSource });
        return;
      }
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
  }

  syncScore(state) {
    if (!this.isIdentified()) {
      this.logOffline();
      return;
    }
    this.enqueue(async () => {
      const sceneName = this.getSceneName(state);
      await this.setScoreInput('placar_gols_esq_<skin>', state.score.home);
      await this.setScoreInput('placar_gols_dir_<skin>', state.score.away);
      await this.setScoreInput('placar_agregado_esq_<skin>', state.score.aggregateHome);
      await this.setScoreInput('placar_agregado_dir_<skin>', state.score.aggregateAway);
      this.logger?.info('sync score', { sceneName });
    });
  }

  syncPlayer(team, slot1to11, state) {
    if (!this.isIdentified()) {
      this.logOffline();
      return;
    }
    const slotIndex = slot1to11 - 1;
    const teamState = state.teams[team];
    const player = teamState?.slots?.[slotIndex];
    if (!player) {
      return;
    }
    const side = team === 'home' ? 'esq' : 'dir';
    const slot = pad2(slot1to11);
    const nameSource = `${side}_jogador_${slot}_<skin>`;
    const goalballSource = `${side}_goalball_${slot}_<skin>`;
    const moreGoalSource = `${side}_moregoalball_${slot}_<skin>`;
    const moreGoalTextSource = `${side}_moregoalball_text_${slot}_<skin>`;
    const cardSource = `${side}_card_${slot}_<skin>`;
    const swapSource = `${side}_swap_${slot}_<skin>`;
    const number = pad2(player.number);
    const formattedName = team === 'home' ? `${number} ${safeText(player.name)}` : `${safeText(player.name)} ${number}`;
    const goalVisible = player.goals === 1;
    const moreGoalVisible = player.goals >= 2;
    const cardVisible = player.yellowCards > 0 || player.redCard;
    const swapVisible = Boolean(player.isSubstitute || teamState.substitutionSlots?.[slotIndex]);
    const cardFile = player.redCard || player.yellowCards >= 2 ? 'redcard.png' : 'yellowcard.png';

    this.enqueue(async () => {
      const sceneName = this.getSceneName(state);
      await this.setInputText(nameSource, formattedName);
      await this.setSceneItemEnabled(sceneName, goalballSource, goalVisible);
      await this.setSceneItemEnabled(sceneName, moreGoalSource, moreGoalVisible);
      if (moreGoalVisible) {
        await this.setInputText(moreGoalTextSource, String(player.goals));
      }
      await this.setSceneItemEnabled(sceneName, cardSource, cardVisible);
      if (cardVisible) {
        try {
          await this.updateCardFile(sceneName, cardSource, cardFile);
        } catch (error) {
          this.logger?.warn('card file update failed', { sourceName: cardSource });
        }
      }
      await this.setSceneItemEnabled(sceneName, swapSource, swapVisible);
      if (player.cardIconSide) {
        await this.updateIconSide(sceneName, cardSource, nameSource, player.cardIconSide === 'swapped');
      }
      if (player.swapIconSide) {
        await this.updateIconSide(sceneName, swapSource, nameSource, player.swapIconSide === 'swapped');
      }
    });
  }

  syncAllPlayers(state) {
    if (!this.isIdentified()) {
      this.logOffline();
      return;
    }
    for (let slot = 1; slot <= 11; slot += 1) {
      this.syncPlayer('home', slot, state);
      this.syncPlayer('away', slot, state);
    }
  }
}
