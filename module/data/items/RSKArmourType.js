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
                    choices: [...Object.keys(CONFIG.RSK.armourMaterials)]
                }),
                soak: new fields.NumberField({ required: true, ...positiveNumberField, max: 100 })
            }),
            specialEffects: new fields.StringField(),
            isEquipped: new fields.BooleanField(),
            maxStackSize: new fields.NumberField({ required: true, initial: 3, min: 1 }),
            //todo: use this in inventory logic instead to control how many slots are used
            // when stowed and equipped.
            // when bulk > 1 an equipping we need dialog to chose slots to disable.
            bulk: new fields.NumberField({ required: true, initial: 1, min: 1 }),
            quantity: new fields.NumberField({ initial: 1 }),
            activeSlot: new fields.StringField({
                required: true,
                initial: "body",
                choices: [...Object.keys(CONFIG.RSK.armourActiveSlotType.values)]
            }),
            equippedInSlot: new fields.StringField()
        }
    }

    getArmourValue = () =>
        typeof this.values?.soak !== "undefined"
            ? this.values.soak
            : 0;
}