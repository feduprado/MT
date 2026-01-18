export class SkinManager {
  constructor() {
    this.skins = [];
  }

  discoverSkins() {
    return Promise.resolve([]);
  }

  changeSkin() {
    return Promise.resolve();
  }

  applyFonts() {
    return Promise.resolve();
  }
}
