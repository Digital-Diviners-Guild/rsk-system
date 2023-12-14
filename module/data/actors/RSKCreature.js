export default class RSKCreature extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            movement: new fields.NumberField({ required: true, min: 1, initial: 1, max: 3 }),
            size: new fields.StringField(),
            lifePoints: new fields.SchemaField(
                {
                    min: new fields.NumberField(),
                    value: new fields.NumberField(),
                    max: new fields.NumberField()
                }
            )
        };
    }
}
