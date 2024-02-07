import { fields, costField, positiveNumberField } from "../fields.js";
import RSKEquippableType from "./RSKEquippableType.js";

export default class RSKArmourType extends RSKEquippableType {
    static defineSchema() {
        return {
            description: new fields.StringField(),
            effectDescription: new fields.StringField(),
            cost: new fields.NumberField({ ...costField }),
            upgrades: new fields.StringField(),
            values: new fields.SchemaField({
                material: new fields.StringField({ initial: "cloth", options: [...Object.keys(CONFIG.RSK.materials)] }),
                soak: new fields.NumberField({ required: true, ...positiveNumberField, max: 100 })
            }),
            qualities: new fields.StringField(),
            isEquipped: new fields.BooleanField(),
            maxStackSize: new fields.NumberField({ initial: 1 }), //todo: is armour stackable except when "heavy"?
            quantity: new fields.NumberField({ initial: 1 }),
            //todo: only armour applicable slots
            activeSlot: new fields.StringField({ required: true, initial: "body", choices: [...Object.keys(CONFIG.RSK.activeSlotType)] })
        }
    }

    getArmourValue = () =>
        typeof this.values?.soak !== "undefined"
            ? this.values.soak
            : 0;
}