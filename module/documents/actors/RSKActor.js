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

  //todo: do we need this type of validation here anymore if its in the datamodel?
  _clampActorValues() {
    this.system.lifePoints.value = game.rsk.math.clamp_value(this.system.lifePoints.value, this.system.lifePoints);
  }

  // todo: damage by type: slash, stab, crush, air, fire, poison, etc...
  async applyOutcome(outcome) {
    if (outcome.damageEntries) {
      const totalDamageTaken = this._calculateDamageTaken(outcome.damageEntries, outcome.puncture);
      let remainingLifePoints = { ...this.system.lifePoints };
      remainingLifePoints.value = game.rsk.math.clamp_value(
        this.system.lifePoints.value - totalDamageTaken,
        { min: 0 });
      if (remainingLifePoints.value < 1 && !this.statuses.has("dead")) {
        const death = rskStatusEffects.find(x => x.id === "dead");
        await this.createEmbeddedDocuments("ActiveEffect", [statusToEffect(death)]);
      }
      this.update({ "system.lifePoints": remainingLifePoints });
    }
    if (this.isDead) { return; }

    await this.createEmbeddedDocuments("ActiveEffect", outcome.addedEffects);
    await this.deleteEmbeddedDocuments("ActiveEffect", outcome.removedEffects);
    if (Object.keys(outcome.actorUpdates).length > 0) {
      this.update(outcome.actorUpdates);
    }
  }

  _calculateDamageTaken(damageEntries, puncture = 0) {
    let totalDamage = 0;
    for (const type in Object.keys(damageEntries)) {
      const damage = this._applyArmourSoak(damageEntries[type], type, puncture);
      totalDamage += damage;
    }
    return totalDamage;
  }

  _applyArmourSoak(damage, damageType, puncture = 0) {
    let armourValue = this._getArmourSoakValue(damageType);
    const applicablePuncture = game.rsk.math.clamp_value(puncture, { min: 0, max: armourValue });
    const applicableArmourSoak = armourValue - applicablePuncture;
    return game.rsk.math.clamp_value(damage - applicableArmourSoak, { min: 0 });
  }

  // todo: these two methods for calculating armour soak may be good to put in 
  // one of the prepare data methods and displayed somewhere on the char
  // sheet, to give feedback about the current soak values based on 
  // the current character/equipment.
  _getArmourSoakValue = (damageType) => 0;
}