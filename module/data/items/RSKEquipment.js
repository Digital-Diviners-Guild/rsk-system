import { costField, fields } from "../fields.js";

// things that cannot be weapons such as a vial
export default class RSKEquipment extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        return {
            description: new fields.StringField(),
            cost: new fields.NumberField({ ...costField }),
            uses: new fields.StringField(),
            maxStackSize: new fields.NumberField({ required: true, initial: 1, min: 1 }),
            bulk: new fields.SchemaField({
                value: new fields.NumberField({ required: true, initial: 1, min: 1 }), 
                modifier: new fields.NumberField()
            }),
            quantity: new fields.NumberField({ initial: 1 })
        }
    };
}