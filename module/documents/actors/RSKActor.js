export default class RSKActor extends Actor {
  get isDead() {
    return this.system.lifePoints.value < 1;
  }

  get isAlive() {
    return this.system.lifePoints.value > 0;
  }

  _applyDefaultTokenSettings(data, options) {
    const defaults = foundry.utils.deepClone(game.settings.get("core", DefaultTokenConfig.SETTING));
    defaults.bar1 = { attribute: "lifePoints" };
    switch (data.type) {
      case "character":
        defaults.bar2 = { attribute: "prayerPoints" };
        Object.assign(defaults, { vision: true, actorLink: true, disposition: 1 });
        break;
      case "npc":
        Object.assign(defaults, { vision: false, actorLink: false, disposition: -1 });
        break;
    }
    return this.updateSource({ prototypeToken: defaults });
  }

  prepareData() {
    // prepareBaseData(), prepareEmbeddedDocuments() (including active effects),
    // prepareDerivedData().
    super.prepareData();
    this._clampActorValues();
  }

  _clampActorValues() {
    if (this.type === "death") return;
    this.system.lifePoints.value = game.rsk.math.clamp_value(this.system.lifePoints.value, this.system.lifePoints);
  }
}