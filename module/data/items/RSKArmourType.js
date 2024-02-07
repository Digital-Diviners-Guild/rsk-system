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
                material: new fields.StringField({
                    required: true,
                    initial: "cloth",
                    options: [...Object.keys(CONFIG.RSK.armourMaterials)]
                }),
                soak: new fields.NumberField({ required: true, ...positiveNumberField, max: 100 })
            }),
            qualities: new fields.StringField(),
            isEquipped: new fields.BooleanField(),
            //todo: is armour stackable except when "heavy"?
            maxStackSize: new fields.NumberField({ required: true, initial: 1, min: 1 }),
            quantity: new fields.NumberField({ initial: 1 }),
            activeSlot: new fields.StringField({
                required: true,
                initial:
                    "body", choices: [...Object.keys(CONFIG.RSK.armourActiveSlotType)]
            })
        }
    }

    getArmourValue = () =>
        typeof this.values?.soak !== "undefined"
            ? this.values.soak
            : 0;
}