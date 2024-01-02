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

  // rename this to apply outcome?
  // - damage by type: slash, stab, crush, air, fire, poison, etc...
  async receiveDamage(damageEntry) {
    const damageAfterSoak = this._applyArmourSoak(damageEntry.amount);
    const damageAfterSoakAndModifiers = this._applyIncomingDamageModifiers(damageAfterSoak);
    let remainingLifePoints = { ...this.system.lifePoints };
    remainingLifePoints.value = game.rsk.math.clamp_value(
      this.system.lifePoints.value - damageAfterSoakAndModifiers,
      { min: 0 });
    if (remainingLifePoints.value < 1 && !this.statuses.has("dead")) {
      const death = rskStatusEffects.find(x => x.id === "dead");
      await this.createEmbeddedDocuments("ActiveEffect", [statusToEffect(death)]);
    }
    this.update({ "system.lifePoints": remainingLifePoints });
  }

  _applyIncomingDamageModifiers(damage) {
    //todo: apply modifiers
    return damage;
  }

  _applyArmourSoak(damage) {
    let armourValue = this._getArmourSoakValue();
    return game.rsk.math.clamp_value(damage - armourValue, { min: 0 });
  }

  // todo: these two methods for calculating armour soak may be good to put in 
  // one of the prepare data methods and displayed somewhere on the char
  // sheet, to give feedback about the current soak values based on 
  // the current character/equipment.
  _getArmourSoakValue = () => 0;
}