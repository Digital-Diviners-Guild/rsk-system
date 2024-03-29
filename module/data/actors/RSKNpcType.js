import RSKActorType from "./RSKActorType.js";
import RSKCreature from "./RSKCreature.js";

export default class RSKNpcType extends RSKActorType {
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            ...RSKCreature.defineSchema(),
            description: new fields.HTMLField(),
            drops: new fields.StringField(),
            specialFeatures: new fields.StringField(),
            actions: new fields.ArrayField(new fields.ObjectField()),
            armourValue: new fields.NumberField({ min: 0, initial: 0, max: 20 }),
        };
    }

    getRollData() {
        return {
            armourValue: this.getArmourValue()
        }
    }

    getArmourValue() {
        return this.armourValue;
    }
}