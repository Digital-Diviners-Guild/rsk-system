import { costField, fields, positiveNumberField } from "./fields.js";
import RSKAction from "./RSKAction.js";
import RSKEquippableType from "./RSKEquippableType.js";

export default class RSKEquipment extends RSKEquippableType {
    static defineSchema() {
        return {
            description: new fields.HTMLField(),
            cost: new fields.NumberField({ ...costField }),
            uses: new fields.HTMLField(),
            effectDescription: new fields.HTMLField(),
            range: new fields.StringField(),
            ...RSKEquippableType.defineSchema(),
            damageEntries: new fields.SchemaField(Object.keys(CONFIG.RSK.damageTypes).reduce((obj, damageType) => {
                obj[damageType] = new fields.NumberField({ ...positiveNumberField, max: 150 });
                return obj;
            }, {}))
        }
    };
}