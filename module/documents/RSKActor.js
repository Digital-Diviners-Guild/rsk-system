import RSKMath from "../rsk-math.js";

export default class RSKActor extends Actor {
  minCharacterLevel = 1;
  maxCharacterLevel = 10;

  /** @override */
  prepareData() {
    // Prepare data for the actor. Calling the super version of this executes
    // the following, in order: data reset (to clear active effects),
    // prepareBaseData(), prepareEmbeddedDocuments() (including active effects),
    // prepareDerivedData().
    super.prepareData();
    this._clampActorValues();
  }

  _clampActorValues() {
    this.system.lifePoints.value = RSKMath.clamp_value(this.system.lifePoints.value, this.system.lifePoints);
    for (let skill in this.system.skills) {
      this.system.skills[skill].level = RSKMath.clamp_value(
        this.system.skills[skill].level,
        { min: this.minCharacterLevel, max: this.maxCharacterLevel });
    }
  }

  /** @override */
  prepareBaseData() {
    // Data modifications in this step occur before processing embedded
    // documents or derived data.
    this._prepareCharacterBaseData(this);
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
    let remainingLifePoints = { ...this.system.lifePoints };
    remainingLifePoints.value = RSKMath.clamp_value(
      this.system.lifePoints.value - damageAfterSoakAndModifiers,
      { min: 0 });
    this.update({ system: { lifePoints: remainingLifePoints } });
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
    const skills = { ...this.system.skills };
    skills[skill].level = RSKMath.clamp_value(newLevel, { min: this.minCharacterLevel, max: this.maxCharacterLevel });
    this.update({ system: { skills: { ...skills } } });
  }

  useSkill(skill) {
    if (this.system.skills && this.system.skills.hasOwnProperty(skill)) {
      const skills = { ...this.system.skills };
      skills[skill].used = true;
      this.update({ system: { skills: { ...skills } } });
    }
  }

  _applyIncomingDamageModifiers(damage) {
    //todo: apply modifiers
    return damage;
  }

  _applyArmourSoak(damage) {
    let armourValue = this._getArmourSoakValue();
    return RSKMath.clamp_value(damage - armourValue, { min: 0 });
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
    systemData.prayerPoints.value = RSKMath.clamp_value(systemData.prayerPoints.value, systemData.prayerPoints)
    systemData.summoningPoints.max = systemData.skills.summoning.level * 5;
    systemData.summoningPoints.value = RSKMath.clamp_value(systemData.summoningPoints.value, systemData.summoningPoints)
  }
}