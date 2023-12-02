export default class RSKActor extends Actor {

  /** @override */
  prepareData() {
    // Prepare data for the actor. Calling the super version of this executes
    // the following, in order: data reset (to clear active effects),
    // prepareBaseData(), prepareEmbeddedDocuments() (including active effects),
    // prepareDerivedData().
    super.prepareData();
  }

  /** @override */
  prepareBaseData() {
    // Data modifications in this step occur before processing embedded
    // documents or derived data.
  }

  /**
   * @override
   * Augment the basic actor data with additional dynamic data. Typically,
   * you'll want to handle most of your calculated/derived data in this step.
   * Data calculated in this step should generally not exist in template.json
   * (such as ability modifiers rather than ability scores) and should be
   * available both inside and outside of character sheets (such as if an actor
   * is queried and has a roll executed directly from it).
   */
  prepareDerivedData() {
    const actorData = this;
    const systemData = actorData.system;
    const flags = actorData.flags.boilerplate || {};

    this._prepareCharacterData(actorData);
  }

  getRollData() {
    const actorData = this;
    const systemData = actorData.system;
    return actorData.type === 'character'
      ? {
        skills: { ...systemData.skills },
        abilities: { ...systemData.abilities }
      }
      : {}
  }

  receiveDamage(amount) {
    const damageAfterSoak = this._applyArmourSoak(amount);
    const damageAfterSoakAndModifiers = this._applyIncomingDamageModifiers(damageAfterSoak);
    let remainingLifePoints = this.system.lifePoints - damageAfterSoakAndModifiers
    remainingLifePoints = remainingLifePoints < 0 ? 0 : remainingLifePoints;
    this.update({ system: { lifePoints: remainingLifePoints } });
  }

  _applyIncomingDamageModifiers(damage) {
    //todo: apply modifiers
    return damage;
  }

  _applyArmourSoak(damage) {
    let armourValue = this._getArmourSoakValue();
    return armourValue >= damage ? 0 : damage - armourValue;
  }

  // todo: these two methods for calculating armour soak may be good to put in 
  // one of the prepare data methods and displayed somewhere on the char
  // sheet, to give feedback about the current soak values based on 
  // the current character/equipment.
  _getArmourSoakValue() {
    return this.type === "npc"
      ? this.system.armourValue
      : this._calculateEquippedArmourSoakValue();
  }

  _calculateEquippedArmourSoakValue() {
    return this.type === "character"
      ? Object.keys(this.system.worn)
        .map((x) => this.system.worn[x])
        .reduce((acc, w, i) => acc +=
          typeof w.getArmourValue === "function" ? w.getArmourValue() : 0, 0)
      : this._getArmourSoakValue();
  }

  _prepareCharacterData(actorData) {
    if (actorData.type !== 'character') return;

    const systemData = actorData.system;
  }
}