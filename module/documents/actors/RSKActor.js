export default class RSKActor extends Actor {
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

  applyActiveEffects() {
    if (this.system?.prepareEmbeddedDocuments instanceof Function) this.system.prepareEmbeddedDocuments();
    // not sure why, but if we do this step in the effects prepare data, it doesn't work
    // doing it here seems to
    this.effects.forEach(e => e.determineSuppression());
    return super.applyActiveEffects();
  }

  receiveDamage(amount) {
    const damageAfterSoak = this._applyArmourSoak(amount);
    const damageAfterSoakAndModifiers = this._applyIncomingDamageModifiers(damageAfterSoak);
    let remainingLifePoints = { ...this.system.lifePoints };
    remainingLifePoints.value = game.rsk.math.clamp_value(
      this.system.lifePoints.value - damageAfterSoakAndModifiers,
      { min: 0 });
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