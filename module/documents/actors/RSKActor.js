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
  // I think the type of damage only matters when determining the armour value
  // - weakness may add puncture, for example, if something is weak to air, then air attacks get free puncture of some amount.
  async applyOutcome(outcome) {
    //todo: how to communicate damage by type, and any puncture associated with the outcome
    // potentially a weakness to x could be implemented by adding puncture to x attacks?
    if (outcome.damageEntries) {
      const puncture = Object.keys(outcome.damageEntries).reduce((punctureAmount, damageType) =>
        damageType === "something were weak too"
          ? punctureAmount + 0 // + amount were weak to it
          : punctureAmount, Number(outcome.puncture));
      const damageAfterSoak = this._applyArmourSoak(damageAmount, puncture);
      let remainingLifePoints = { ...this.system.lifePoints };
      remainingLifePoints.value = game.rsk.math.clamp_value(
        this.system.lifePoints.value - damageAfterSoak,
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

  _applyArmourSoak(damage, puncture = 0) {
    let armourValue = this._getArmourSoakValue();
    const applicablePuncture = game.rsk.math.clamp_value(puncture, { min: 0, max: armourValue });
    return game.rsk.math.clamp_value(damage - applicablePuncture, { min: 0 });
  }

  // todo: these two methods for calculating armour soak may be good to put in 
  // one of the prepare data methods and displayed somewhere on the char
  // sheet, to give feedback about the current soak values based on 
  // the current character/equipment.
  _getArmourSoakValue = () => 0;
}