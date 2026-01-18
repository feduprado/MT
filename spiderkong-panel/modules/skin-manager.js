const KNOWN_SKINS = ['champions', 'libertadores', 'brasileiraocopa', 'generico'];
const SHARED_ASSETS = ['esq_team.png', 'dir_team.png', 'socialmedia.png', 'qrcodes_text.png', 'LOGO-SPIDER.png'];
const SKIN_GROUP_BASES = ['background', 'placar', 'cronometro', 'penalti_place'];

function buildPenaltySources(skin) {
  const sources = [];
  for (let i = 1; i <= 5; i += 1) {
    sources.push(`esq_penalti${i}_${skin}.png`);
    sources.push(`dir_penalti${i}_${skin}.png`);
  }
  return sources;
}

function withSkin(sourceName, skin) {
  if (!sourceName || !skin) {
    return sourceName;
  }
  return sourceName.split('<skin>').join(skin);
}

function buildPlayerSources(side, skin) {
  const sources = [];
  for (let slot = 1; slot <= 11; slot += 1) {
    const pad = String(slot).padStart(2, '0');
    sources.push(withSkin(`${side}_jogador_${pad}_<skin>`, skin));
    sources.push(withSkin(`${side}_goalball_${pad}_<skin>`, skin));
    sources.push(withSkin(`${side}_moregoalball_${pad}_<skin>`, skin));
    sources.push(withSkin(`${side}_moregoalball_text_${pad}_<skin>`, skin));
    sources.push(withSkin(`${side}_card_${pad}_<skin>`, skin));
    sources.push(withSkin(`${side}_swap_${pad}_<skin>`, skin));
  }
  return sources;
}

function buildPlayerTextSources(side, skin) {
  const sources = [];
  for (let slot = 1; slot <= 11; slot += 1) {
    const pad = String(slot).padStart(2, '0');
    sources.push(withSkin(`${side}_jogador_${pad}_<skin>`, skin));
    sources.push(withSkin(`${side}_moregoalball_text_${pad}_<skin>`, skin));
  }
  return sources;
}

export class SkinManager {
  constructor({ obsClient, logger, syncEngine } = {}) {
    this.obsClient = obsClient;
    this.logger = logger;
    this.syncEngine = syncEngine;
    this.skins = [];
    this.scenes = [];
  }

  getKnownSkins() {
    return [...KNOWN_SKINS];
  }

  getSharedAssets() {
    return [...SHARED_ASSETS];
  }

  async discoverScenes() {
    if (!this.obsClient || this.obsClient.state !== 'IDENTIFIED') {
      return { scenes: [], currentProgramSceneName: '' };
    }
    try {
      const response = await this.obsClient.call('GetSceneList', {}, 3000);
      const scenes = Array.isArray(response.scenes) ? response.scenes.map((scene) => scene.sceneName) : [];
      this.scenes = scenes;
      return { scenes, currentProgramSceneName: response.currentProgramSceneName || '' };
    } catch (error) {
      this.logger?.warn('scene discovery failed', { error: error?.message || 'unknown' });
      return { scenes: [], currentProgramSceneName: '' };
    }
  }

  async discoverSkins(sceneName) {
    if (!this.obsClient || this.obsClient.state !== 'IDENTIFIED') {
      return [];
    }
    if (!sceneName) {
      return [];
    }
    const skins = [];
    for (const skin of KNOWN_SKINS) {
      try {
        await this.obsClient.call('GetSceneItemId', { sceneName, sourceName: `background_${skin}.png` }, 2000);
        skins.push(skin);
      } catch (error) {
        this.logger?.debug('skin background not found', { sceneName, skin });
      }
    }
    this.skins = skins;
    return skins;
  }

  buildSkinGroupSources(skin) {
    const sources = SKIN_GROUP_BASES.map((base) => `${base}_${skin}.png`);
    return sources.concat(buildPenaltySources(skin));
  }

  buildSkinAssetSources(skin) {
    const sources = [
      withSkin('esq_escalacao_time_<skin>', skin),
      withSkin('dir_escalacao_time_<skin>', skin),
      withSkin('esq_escalacao_tecnico_<skin>', skin),
      withSkin('dir_escalacao_tecnico_<skin>', skin),
      withSkin('placar_siglatime_esq_<skin>', skin),
      withSkin('placar_siglatime_dir_<skin>', skin),
      withSkin('placar_gols_esq_<skin>', skin),
      withSkin('placar_gols_dir_<skin>', skin),
      withSkin('placar_agregado_esq_<skin>', skin),
      withSkin('placar_agregado_dir_<skin>', skin),
      withSkin('placar_penaltis_esq_<skin>', skin),
      withSkin('placar_penaltis_dir_<skin>', skin),
      withSkin('cronometro_tempo_<skin>', skin),
      withSkin('cronometro_etapa_<skin>', skin)
    ];
    sources.push(...buildPlayerSources('esq', skin));
    sources.push(...buildPlayerSources('dir', skin));
    return sources;
  }

  buildSkinTextSources(skin) {
    const sources = [
      withSkin('esq_escalacao_time_<skin>', skin),
      withSkin('dir_escalacao_time_<skin>', skin),
      withSkin('esq_escalacao_tecnico_<skin>', skin),
      withSkin('dir_escalacao_tecnico_<skin>', skin),
      withSkin('placar_siglatime_esq_<skin>', skin),
      withSkin('placar_siglatime_dir_<skin>', skin),
      withSkin('placar_gols_esq_<skin>', skin),
      withSkin('placar_gols_dir_<skin>', skin),
      withSkin('placar_agregado_esq_<skin>', skin),
      withSkin('placar_agregado_dir_<skin>', skin),
      withSkin('placar_penaltis_esq_<skin>', skin),
      withSkin('placar_penaltis_dir_<skin>', skin),
      withSkin('cronometro_tempo_<skin>', skin),
      withSkin('cronometro_etapa_<skin>', skin)
    ];
    sources.push(...buildPlayerTextSources('esq', skin));
    sources.push(...buildPlayerTextSources('dir', skin));
    return sources;
  }

  getFontForSkin(skin) {
    switch (skin) {
      case 'champions':
        return 'CHAMPIONS';
      case 'libertadores':
        return 'BRANDING';
      case 'brasileiraocopa':
        return 'NUNITO';
      case 'generico':
      default:
        return 'NUNITO';
    }
  }

  async applyFontsForSkin(skin) {
    if (!this.syncEngine) {
      return;
    }
    const fontFace = this.getFontForSkin(skin);
    const sources = this.buildSkinTextSources(skin);
    for (const source of sources) {
      await this.syncEngine.setInputFontFace(source, fontFace);
    }
  }

  async changeSkin(newSkin, state) {
    if (!this.syncEngine || !this.syncEngine.isIdentified()) {
      this.syncEngine?.logOffline();
      return false;
    }
    if (!newSkin || !state) {
      return false;
    }
    const oldSkin = state.meta?.skin || newSkin;
    if (newSkin === oldSkin) {
      return true;
    }
    const sceneName = state.meta?.sceneName || 'Match Center';
    const oldGroup = this.buildSkinGroupSources(oldSkin);
    const newGroup = this.buildSkinGroupSources(newSkin);
    const oldAssets = this.buildSkinAssetSources(oldSkin);
    const newAssets = this.buildSkinAssetSources(newSkin);
    const sharedAssets = this.getSharedAssets();

    return this.syncEngine.enqueue(async () => {
      try {
        for (const source of oldGroup) {
          await this.syncEngine.safeSetSceneItemEnabled(sceneName, source, false);
        }
        for (const source of oldAssets) {
          await this.syncEngine.safeSetSceneItemEnabled(sceneName, source, false);
        }
        for (const source of sharedAssets) {
          await this.syncEngine.safeSetSceneItemEnabled(sceneName, source, false);
        }
        await this.applyFontsForSkin(newSkin);
        for (const source of sharedAssets) {
          await this.syncEngine.safeSetSceneItemEnabled(sceneName, source, true);
        }
        for (const source of newAssets) {
          await this.syncEngine.safeSetSceneItemEnabled(sceneName, source, true);
        }
        for (const source of newGroup) {
          await this.syncEngine.safeSetSceneItemEnabled(sceneName, source, true);
        }
        state.meta.skin = newSkin;
        this.logger?.info('skin changed', { skin: newSkin });
        this.syncEngine.syncAll(state);
      } catch (error) {
        this.logger?.warn('skin change failed', { skin: newSkin, error: error?.message || 'unknown' });
        await this.applyFontsForSkin(oldSkin);
        for (const source of sharedAssets) {
          await this.syncEngine.safeSetSceneItemEnabled(sceneName, source, true);
        }
        for (const source of oldAssets) {
          await this.syncEngine.safeSetSceneItemEnabled(sceneName, source, true);
        }
        for (const source of oldGroup) {
          await this.syncEngine.safeSetSceneItemEnabled(sceneName, source, true);
        }
        state.meta.skin = oldSkin;
        this.syncEngine.syncAll(state);
        throw error;
      }
    });
  }
}
