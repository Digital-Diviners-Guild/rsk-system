import { rskStatusEffects, statusToEffect } from "../../effects/statuses.js";

export default class RSKActor extends Actor {
  get isDead() {
    return this.system.lifePoints.value < 1;
  }

  get isAlive() {
    return this.system.lifePoints.value > 0;
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
    const damageTaken = this.calculateDamageTaken({ typeless: damage });
    const remainingLifePoints = game.rsk.math.clamp_value(
      this.system.lifePoints.value - damageTaken,
      { min: 0 });
    if (remainingLifePoints < 1 && !this.statuses.has("dead")) {
      const death = rskStatusEffects.find(x => x.id === "dead");
      await this.createEmbeddedDocuments("ActiveEffect", [statusToEffect(death)]);
    }
    this.update({ "system.lifePoints.value": remainingLifePoints });
  }

  calculateDamageTaken(damageEntries, puncture = 0) {
    const armour = this.getArmourValue();
    const applicablePuncture = game.rsk.math.clamp_value(puncture, { min: 0, max: armour });
    const remainingArmourSoak = armour - applicablePuncture;
    const { totalDamage, bonusArmour } = Object.keys(damageEntries).reduce((acc, type, i) => {
      acc.totalDamage += damageEntries[type];
      acc.bonusArmour += this.getBonusArmourValue(type);
      return acc;
    }, { totalDamage: 0, bonusArmour: 0 });
    const totalArmourSoak = remainingArmourSoak + bonusArmour;
    return game.rsk.math.clamp_value(totalDamage - totalArmourSoak, { min: 0 });
  }

  getArmourValue() { return 0; }
  getBonusArmourValue(damageType) { return 0; } //todo: check for 'strengths' and 'weaknesses' to damageType
}