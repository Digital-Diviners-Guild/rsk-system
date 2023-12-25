import RSKAction from "./RSKAction.js";
import { fields } from "./fields.js";

//is this and rskprayer a sub type of rskaction?
// or are these more so spelldata and prayerdata that
// rskaction would use to create the 'cast,pray,summon' actions?
// we probably just need those three actions to cover all of magic, prayer, and summoning.
// then an action for melee and another for range
export default class RSKSpell extends RSKAction {
    static defineSchema() {
        return {
            spellType: new fields.StringField(),
            ...RSKAction.defineSchema()
        }
    };

    static fromData(spellData) {
        const spell = new this({ ...spellData });
        spell._id = spellData.id;
        spell.label = spellData.label;
        spell.actor = spellData.actor;
        return spell;
    }
}