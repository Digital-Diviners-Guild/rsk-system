import RSKCreature from "./RSKCreature.js";

export default class RSKCharacterType extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            ...RSKCreature.defineSchema(),
            catalyst: new fields.StringField(),
            motivation: new fields.StringField(),
            backgrounds: new fields.ArrayField(new fields.ObjectField()),
            summoningPoints: new fields.SchemaField({
                min: new fields.NumberField({ min: 0, initial: 0 }),
                value: new fields.NumberField({ initial: 5 }),
                max: new fields.NumberField({ initial: 5 })
            }),
            prayerPoints: new fields.SchemaField({
                min: new fields.NumberField({ min: 0, initial: 0 }),
                value: new fields.NumberField({ initial: 3 }),
                max: new fields.NumberField({ initial: 3 })
            }),
            abilities: new fields.SchemaField(Object.keys(CONFIG.RSK.abilities).reduce((obj, ability) => {
                obj[ability] = new fields.NumberField({ min: 1, initial: 1, max: 8 });
                return obj;
            }, {})),
            prayers: new fields.ArrayField(new fields.ObjectField()),
            spells: new fields.ArrayField(new fields.ObjectField()),
            skills: new fields.SchemaField(Object.keys(CONFIG.RSK.skills).reduce((obj, skill) => {
                obj[skill] = new fields.SchemaField({
                    level: new fields.NumberField({ min: 1, initial: 1, max: 10 }),
                    used: new fields.BooleanField(),
                    modifier: new fields.NumberField({ min: -80, initial: 0, max: 80 }), // todo: what are the min maxes for these?
                });
                return obj;
            }, {})),
        };
    }
}