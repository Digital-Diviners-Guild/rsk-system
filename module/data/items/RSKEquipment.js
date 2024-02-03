import { costField, fields, positiveNumberField } from "../fields.js";
import RSKEquippableType from "./RSKEquippableType.js";

export default class RSKEquipment extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        return {
            // not sure we need category and usage type. still figuring out what we need for actions
            usageType: new fields.StringField({ initial: "melee" }), // melee, ranged, magic?
            category: new fields.StringField({ initial: "equipment", options: ["equipment", "staff", "bow", "crossbow", "sword"] }),
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