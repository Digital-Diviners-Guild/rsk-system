import { rskStatusEffects, statusToEffect } from "../../effects/statuses.js";

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

  async receiveDamage(damage) {
    const { puncture, damageEntries, attackType, defenseRoll } = { ...damage };
    const damageTaken = this.calculateDamageTaken(damageEntries, attackType, puncture, defenseRoll);
    const remainingLifePoints = game.rsk.math.clamp_value(
      this.system.lifePoints.value - damageTaken,
      { min: 0 });
    if (remainingLifePoints < 1 && !this.statuses.has("dead")) {
      const death = rskStatusEffects.find(x => x.id === "dead");
      await this.createEmbeddedDocuments("ActiveEffect", [statusToEffect(death)]);
    }
    this.update({ "system.lifePoints.value": remainingLifePoints });
  }

  //todo: success margin?
  calculateDamageTaken(damageEntries, attackType = "melee", puncture = 0, defenseRoll = 0) {
    const armour = this.getArmourValue();
    const applicablePuncture = game.rsk.math.clamp_value(puncture, { min: 0, max: armour });
    const remainingArmourSoak = armour - applicablePuncture;
    const { totalDamage, damageResistance } = Object.keys(damageEntries).reduce((acc, type, i) => {
      acc.totalDamage += damageEntries[type];
      acc.damageResistance += this.getBonusArmourValue(type);
      return acc;
    }, { totalDamage: 0, damageResistance: 0 });
    const attackTypeResistance = this.getBonusArmourValue(attackType);
    const defenseValue = remainingArmourSoak + damageResistance + attackTypeResistance + defenseRoll;
    return game.rsk.math.clamp_value(totalDamage - defenseValue, { min: 0 });
  }

  getArmourValue() { return 0; }
  //todo: check for 'strengths' and 'weaknesses' to damageType/attackType
  getBonusArmourValue(type) { return 0; }
}