import { fields, costField } from "../fields.js";

export default class RSKMaterial extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        return {
            type: new fields.StringField({
                required: true,
                initial: "wood",
                choices: [...Object.keys(CONFIG.RSK.rawMaterialType)]
            }),
            tier: new fields.StringField({
                required: false,
                initial: "wood"
            }),
            description: new fields.StringField(),
            cost: new fields.NumberField({ ...costField }),
            maxStackSize: new fields.NumberField({ required: true, initial: 3, min: 1 }),
            bulk: new fields.SchemaField({
                value: new fields.NumberField({ required: true, initial: 1, min: 1 }),
                modifier: new fields.NumberField()
            }),
            quantity: new fields.NumberField({ initial: 1 }),
        }
    }
}
