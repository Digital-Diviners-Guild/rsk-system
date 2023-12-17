import RSKAction from "./RSKAction.js";
import { fields, positiveNumberField } from "./fields.js";

//is this and rskprayer a sub type of rskaction?
// or are these more so spelldata and prayerdata that
// rskaction would use to create the 'cast,pray,summon' actions?
// we probably just need those three actions to cover all of magic, prayer, and summoning.
// then an action for melee and another for range
export default class RSKSpell extends RSKAction {
    // static defineSchema() {
    //     return {
    //         spellType: new fields.StringField(),
    //         description: new fields.HTMLField(),
    //         cost: new fields.SchemaField(Object.keys(CONFIG.RSK.runeType).reduce((obj, rune) => {
    //             obj[rune] = new fields.NumberField({ ...positiveNumberField, max: 30 });
    //             return obj;
    //         }, {})),
    //         range: new fields.StringField(),
    //         damageEntries: new fields.SchemaField(Object.keys(CONFIG.RSK.damageTypes).reduce((obj, damageType) => {
    //             obj[damageType] = new fields.NumberField({ ...positiveNumberField, max: 150 });
    //             return obj;
    //         }, {})),
    //         effectdescription: new fields.HTMLField(),
    //     }
    // };
}