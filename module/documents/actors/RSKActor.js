export default class RSKActor extends Actor {
  minSkillLevel = 1;
  maxSkillLevel = 10;

  prepareData() {
    // prepareBaseData(), prepareEmbeddedDocuments() (including active effects),
    // prepareDerivedData().
    super.prepareData();
    this._clampActorValues();
  }

  _clampActorValues() {
    this.system.lifePoints.value = game.rsk.math.clamp_value(this.system.lifePoints.value, this.system.lifePoints);
    for (let skill in this.system.skills) {
      this.system.skills[skill].level = game.rsk.math.clamp_value(
        this.system.skills[skill].level,
        { min: this.minSkillLevel, max: this.maxSkillLevel });
    }
  }

  prepareBaseData() {
    super.prepareBaseData();
    this._prepareCharacterBaseData(this);
  }

  prepareDerivedData() {
    const actorData = this;
    const systemData = actorData.system;
    const flags = actorData.flags.boilerplate || {};

    this._prepareCharacterData(actorData);
  }

  applyActiveEffects() {
    if (this.system?.prepareEmbeddedDocuments instanceof Function) this.system.prepareEmbeddedDocuments();
    // not sure why, but if we do this step in the effects prepare data, it doesn't work
    // doing it here seems to
    this.effects.forEach(e => e.determineSuppression());
    return super.applyActiveEffects();
  }

  getRollData() {
    const actorData = this;
    const systemData = actorData.system;
    return actorData.type === 'character'
      ? {
        skills: { ...systemData.skills },
        abilities: { ...systemData.abilities },
        calculateTestNumber: (skill, ability) => this.calculateTestNumber(skill, ability)
      }
      : {}
  }

  calculateTestNumber(skill, ability) {
    return this.system.skills[skill].level
      + (this.system.skills[skill].modifier ?? 0)
      + this.system.abilities[ability];
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

  increaseSkillLevel(skill, amount) {
    if (this.type !== "character") return;
    //todo: if this is now >= 5 award ability level
    this.updateSkillLevel(skill, this.system.skills[skill].level + amount);
  }

  decreaseSkillLevel(skill, amount) {
    if (this.type !== "character") return;
    this.updateSkillLevel(skill, this.system.skills[skill].level - amount);
  }

  updateSkillLevel(skill, newLevel) {
    const newSkillLevel = game.rsk.math.clamp_value(newLevel, { min: this.minSkillLevel, max: this.maxSkillLevel });
    this.update({ [`system.skills.${skill}.level`]: newSkillLevel });
  }

  useSkill(skill) {
    if (this.system.skills && this.system.skills.hasOwnProperty(skill)) {
      this.update({ [`system.skills.${skill}.used`]: true });
    }
  }

  //temp: will change when tanner is done with inventory
  equip(item) {
    const currentEquipped = this.items.filter(i => i.isEquipped
      && i.inSlot === item.inSlot);
    if (currentEquipped.length > 0 && currentEquipped[0] !== item) {
      currentEquipped[0].equip();
    }
    item.equip();
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
  _getArmourSoakValue() {
    return this.type === "npc"
      ? this.system.armourValue
      : this._calculateEquippedArmourSoakValue();
  }

  _calculateEquippedArmourSoakValue() {
    return this.type === "character"
      ? this.items
        .filter(i => i.isEquipped)
        .reduce((acc, w, i) => acc +=
          typeof w.getArmourValue === "function" ? w.getArmourValue() : 0, 0)
      : this._getArmourSoakValue();
  }

  _prepareCharacterData(actorData) {

  }

  applyBackgrounds() {
    if (this.type !== 'character') return;
    this.items.filter(i => i.type === "background")
      .map(b => b.applyBackgroundSkillImprovements(this))
  }

  _prepareCharacterBaseData(actorData) {
    if (actorData.type !== 'character') return;

    const systemData = actorData.system;
    systemData.lifePoints.max =
      Object.keys(systemData.abilities).map(i => systemData.abilities[i]).reduce((acc, a, i) => acc += Number(a), 0)
      + Object.keys(systemData.skills).map(i => systemData.skills[i]).reduce((acc, s, i) => acc += Number(s.level), 0);

    systemData.prayerPoints.max = systemData.skills.prayer.level * 3;
    systemData.prayerPoints.value = game.rsk.math.clamp_value(systemData.prayerPoints.value, systemData.prayerPoints)
    systemData.summoningPoints.max = systemData.skills.summoning.level * 5;
    systemData.summoningPoints.value = game.rsk.math.clamp_value(systemData.summoningPoints.value, systemData.summoningPoints)
  }
}