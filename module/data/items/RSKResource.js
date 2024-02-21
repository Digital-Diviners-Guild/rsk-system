import { fields, costField } from "../fields.js";

export default class RSKResource extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        return {
            type: new fields.StringField({
                required: true,
                initial: "cloth",
                choices: [...Object.keys(CONFIG.RSK.resource)]
            }),
            tier: new fields.StringField({
                required: false,
            }),
            description: new fields.StringField(),
            uses: new fields.StringField(),
            cost: new fields.NumberField({ ...costField }),
            maxStackSize: new fields.NumberField({ initial: 3 }),
            bulk: new fields.SchemaField({
                value: new fields.NumberField({ required: true, initial: 1, min: 1 }), 
                modifier: new fields.NumberField()
            }),
            quantity: new fields.NumberField({ initial: 1 }),
        }
    }
}
