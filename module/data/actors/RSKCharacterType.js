import RSKCreature from "./RSKCreature.js";
import { fields, costField } from "../fields.js";

export default class RSKCharacterType extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        return {
            ...RSKCreature.defineSchema(),
            gold: new fields.NumberField({ ...costField }),
            catalyst: new fields.StringField(),
            motivation: new fields.StringField(),
            description: new fields.HTMLField(),
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
                obj[ability] = new fields.SchemaField({
                    level: new fields.NumberField({ min: 1, initial: 1, max: 8 }),
                    modifier: new fields.NumberField({ min: -100, initial: 0, max: 100 })
                });
                return obj;
            }, {})),
            skills: new fields.SchemaField(Object.keys(CONFIG.RSK.skills).reduce((obj, skill) => {
                obj[skill] = new fields.SchemaField({
                    level: new fields.NumberField({ min: 1, initial: 1, max: 10 }),
                    used: new fields.BooleanField(),
                    modifier: new fields.NumberField({ min: -100, initial: 0, max: 100 }),
                });
                return obj;
            }, {}))
        };
    }
}