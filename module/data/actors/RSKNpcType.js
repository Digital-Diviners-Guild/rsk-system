import RSKCreature from "./RSKCreature.js";

export default class RSKNpcType extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            ...RSKCreature.defineSchema(),
            description: new fields.HTMLField(),
            drops: new fields.StringField(),
            specialFeatures: new fields.StringField(),
            actions: new fields.ArrayField(new fields.SchemaField({
                label: new fields.StringField(),
                description: new fields.StringField()
            })),
            armourValue: new fields.NumberField({ min: 0, initial: 0, max: 20 }),
        };
    }
}