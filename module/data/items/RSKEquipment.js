import { costField, fields } from "../fields.js";

// things that cannot be weapons such as a vial
export default class RSKEquipment extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        return {
            description: new fields.StringField(),
            cost: new fields.NumberField({ ...costField }),
            uses: new fields.StringField(),
            maxStackSize: new fields.NumberField({ initial: 1 }),
            quantity: new fields.NumberField({ initial: 1 })
        }
    };
}