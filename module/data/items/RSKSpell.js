import { fields, positiveNumberField } from "./fields.js";

export default class RSKSpell extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        return {
            spellType: new fields.StringField(),
            description: new fields.StringField(),
            cost: new fields.SchemaField(Object.keys(CONFIG.RSK.runeType).reduce((obj, rune) => {
                obj[rune] = new fields.NumberField({ ...positiveNumberField, max: 30 });
                return obj;
            }, {})),
            range: new fields.StringField(),
            damageEntries: new fields.SchemaField(Object.keys(CONFIG.RSK.damageTypes).reduce((obj, damageType) => {
                obj[damageType] = new fields.NumberField({ ...positiveNumberField, max: 150 });
                return obj;
            }, {})),
            effectDescription: new fields.StringField(),
        }
    };
}