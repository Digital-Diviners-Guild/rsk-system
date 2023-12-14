import RSKEquippableType from "./RSKEquippableType.js";

export default class RSKArmourType extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        const fields = foundry.data.fields;
        const numberField = { integer: true, initial: 0, min: 0 };
        return {
            description: new fields.StringField(),
            cost: new fields.NumberField({ ...numberField, max: 10000 }),
            armourType: new fields.StringField(), //todo: I think we can put the options here?
            upgrades: new fields.ArrayField(new fields.ObjectField()),
            values: new fields.SchemaField({
                material: new fields.StringField(),
                qualities: new fields.ArrayField(new fields.ObjectField()),
                soak: new fields.NumberField({ ...numberField, max: 100 })
            }),
            ...RSKEquippableType.defineSchema()
        }
    }
}