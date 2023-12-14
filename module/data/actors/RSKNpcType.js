import RSKCreature from "./RSKCreature.js";

export default class RSKNpcType extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            ...RSKCreature.defineSchema(),
            description: new fields.HTMLField(),
            isQuestGiver: new fields.BooleanField(),
            drops: new fields.ArrayField(new fields.ObjectField()),
            specialFeatures: new fields.ArrayField(new fields.ObjectField()),
            actions: new fields.ArrayField(new fields.ObjectField()),
            armourValue: new fields.NumberField({ min: 0, initial: 0, max: 20 }),
        };
    }
}