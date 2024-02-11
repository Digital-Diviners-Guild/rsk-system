import { fields, costField } from "../fields.js";

export default class RSKRuneType extends foundry.abstract.DataModel {
    static defineSchema() {
        return {
            type: new fields.StringField({ initial: "air", choices: [...Object.keys(CONFIG.RSK.runeType)] }),
            description: new fields.StringField(),
            maxStackSize: new fields.NumberField({ initial: 100000 }),
            quantity: new fields.NumberField({ initial: 1 }),
            cost: new fields.NumberField({ ...costField })
        }
    }
}