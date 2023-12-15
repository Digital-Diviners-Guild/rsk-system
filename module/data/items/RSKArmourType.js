import { fields, costField, positiveNumberField } from "./fields.js";
import RSKEquippableType from "./RSKEquippableType.js";

export default class RSKArmourType extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        return {
            description: new fields.StringField(),
            cost: new fields.NumberField({ ...costField }),
            armourType: new fields.StringField(), //todo: I think we can put the options here?
            upgrades: new fields.ArrayField(new fields.ObjectField()),
            values: new fields.SchemaField({
                material: new fields.StringField(),
                qualities: new fields.ArrayField(new fields.ObjectField()),
                soak: new fields.NumberField({ required: true, ...positiveNumberField, max: 100 })
            }),
            ...RSKEquippableType.defineSchema()
        }
    }
}