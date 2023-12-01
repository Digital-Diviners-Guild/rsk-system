/**
 * Extend the base Actor document by defining a custom roll data structure which is ideal for the rsk system.
 * @extends {Actor}
 */
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

    // Make separate methods for each Actor type (character, npc, etc.) to keep
    // things organized.
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
    //todo: calculate actual damage after soak and modifiers
    let remainingLifepoints = this.system.lifepoints - amount
    remainingLifepoints = remainingLifepoints < 0 ? 0 : remainingLifepoints;
    this.update({ system: { lifepoints: remainingLifepoints } });
  }

  /**
   * Prepare Character type specific data
   */
  _prepareCharacterData(actorData) {
    if (actorData.type !== 'character') return;

    // Make modifications to data here. For example:
    const systemData = actorData.system;

    // Need to Loop through skills and calculate the totalskill based on backgrounds.
  }
}