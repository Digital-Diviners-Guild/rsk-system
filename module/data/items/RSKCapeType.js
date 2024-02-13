import { fields } from "../fields.js";
import RSKEquippableType from "./RSKEquippableType.js";

export default class RSKCapeType extends RSKEquippableType {
    static defineSchema() {
        return {
            description: new fields.StringField(),
            awardedFor: new fields.StringField(),
            specialEffects: new fields.StringField(),
            isEquipped: new fields.BooleanField(),
            activeSlot: new fields.StringField({ required: true, initial: "cape", choices: ["cape"] }),
            maxStackSize: new fields.NumberField({ required: true, initial: 1, min: 1 }),
            bulk: new fields.NumberField({ required: true, initial: 1, min: 1 }),
            quantity: new fields.NumberField({ initial: 1 }),
        };
    }
}
