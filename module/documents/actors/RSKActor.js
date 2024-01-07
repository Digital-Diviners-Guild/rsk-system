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
    this.system.lifePoints.value = game.rsk.math.clamp_value(this.system.lifePoints.value, this.system.lifePoints);
  }

  async receiveDamage(damage) {
    const remainingLifePoints = game.rsk.math.clamp_value(
      this.system.lifePoints.value - damage,
      { min: 0 });
    if (remainingLifePoints < 1 && !this.statuses.has("dead")) {
      const death = rskStatusEffects.find(x => x.id === "dead");
      await this.createEmbeddedDocuments("ActiveEffect", [statusToEffect(death)]);
    }
    this.update({ "system.lifePoints.value": remainingLifePoints });
  }
}