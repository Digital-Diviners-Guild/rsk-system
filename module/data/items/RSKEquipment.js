import { costField, fields, positiveNumberField } from "../fields.js";
import RSKEquippableType from "./RSKEquippableType.js";

export default class RSKEquipment extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        return {
            usageType: new fields.StringField({ initial: "melee" }), // how do we want to id things like bow/melee/staff/etc.
            description: new fields.StringField(),
            cost: new fields.NumberField({ ...costField }),
            uses: new fields.StringField(),
            effectDescription: new fields.StringField(),
            range: new fields.StringField(),
            ...RSKEquippableType.defineSchema(),
            damageEntries: new fields.SchemaField(Object.keys(CONFIG.RSK.damageTypes).reduce((obj, damageType) => {
                obj[damageType] = new fields.NumberField({ ...positiveNumberField, max: 150 });
                return obj;
            }, {}))
        }
    };
}