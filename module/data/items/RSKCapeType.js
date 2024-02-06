import { fields } from "../fields.js";
import RSKEquippableType from "./RSKEquippableType.js";

export default class RSKCapeType extends RSKEquippableType {
    static defineSchema() {
        return {
            description: new fields.StringField(),
            awardedFor: new fields.StringField(),
            qualities: new fields.StringField(),
            isEquipped: new fields.BooleanField(),
            activeSlot: new fields.StringField({ required: true, initial: "cape", choices: ["cape"] }),
            maxStackSize: new fields.NumberField({ initial: 1 }),
            quantity: new fields.NumberField({ initial: 1 }),
        };
    }
}
