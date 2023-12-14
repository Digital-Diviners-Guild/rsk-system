import RSKEquippable from "./RSKEquippable.js";

export default class RSKMaterial extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        const fields = foundry.data.fields;
        const numberField = { required: true, nullable: false, integer: true, initial: 0, min: 0, max: 10000 };
        return {
            description: new fields.StringField(),
            cost: new fields.NumberField({...numberField}),
            armourType: new fields.StringField(), //todo: I think we can put the options here?
            upgrades: new fields.ArrayField(new fields.ObjectField()),
            values: new fields.SchemaField({
                material: new fields.StringField(),
                qualities: new fields.ArrayField(new fields.ObjectField()),
                soak: new fields.NumberField({...numberField})
            }),
            ...RSKEquippable.defineSchema()
        }
    }
}