export default class RSKCreature extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            movement: new fields.NumberField({ required: true, min: 1, initial: 1, max: 3 }),
            size: new fields.StringField({
                initial: "medium",
                options: [...Object.keys(CONFIG.RSK.size)]
            }),
            lifePoints: new fields.SchemaField(
                {
                    min: new fields.NumberField({ initial: 0 }),
                    value: new fields.NumberField({ initial: 1 }),
                    max: new fields.NumberField({ initial: 1 })
                }
            ),
            resistance: new fields.SchemaField([...Object.keys(CONFIG.RSK.damageTypes), ...Object.keys(CONFIG.RSK.attackType)]
                .reduce((obj, type) => {
                    obj[type] = new fields.NumberField({ initial: 0, min: -500, max: 500 });
                    return obj;
                }, {}))
        };
    }
}
