import { fields, costField } from "../fields.js";

export default class RSKResource extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        return {
            type: new fields.StringField({
                required: true,
                initial: "cloth",
                choices: [...Object.keys(CONFIG.RSK.resourceType)]
            }),
            tier: new fields.StringField({
                required: false,
                initial: "",
                choices: [
                    "",
                    ...Object.keys(CONFIG.RSK.leatherType),
                    ...Object.keys(CONFIG.RSK.metalType),
                ]
            }),
            description: new fields.StringField(),
            uses: new fields.StringField(),
            cost: new fields.NumberField({ ...costField }),
            maxStackSize: new fields.NumberField({ initial: 3 }),
            quantity: new fields.NumberField({ initial: 1 }),
        }
    }
}
