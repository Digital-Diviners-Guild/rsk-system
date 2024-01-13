import { fields, costField, positiveNumberField } from "./fields.js";
import RSKEquippableType from "./RSKEquippableType.js";

export default class RSKArmourType extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        return {
            description: new fields.HTMLField(),
            cost: new fields.NumberField({ ...costField }),
            upgrades: new fields.HTMLField(),
            values: new fields.SchemaField({
                material: new fields.StringField({ initial: "cloth", options: [...Object.keys(CONFIG.RSK.materials)] }),
                soak: new fields.NumberField({ required: true, ...positiveNumberField, max: 100 })
            }),
            ...RSKEquippableType.defineSchema()
        }
    }
}