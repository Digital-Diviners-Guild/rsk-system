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
            specialEffects: new fields.StringField(),
            isEquipped: new fields.BooleanField(),
            //todo: is armour stackable except when "heavy"?
            // if so, then 'heavy' can be implemented as an active effect when creating the item in foundry
            // it can OVERRIDE the system.maxStackSize = 1, allowing it to default to 3 for items that are not heavy
            maxStackSize: new fields.NumberField({ required: true, initial: 1, min: 1 }),
            quantity: new fields.NumberField({ initial: 1 }),
            activeSlot: new fields.StringField({
                required: true,
                initial:
                    "body", choices: [...Object.keys(CONFIG.RSK.armourActiveSlotType)]
            }),
            //todo: feels like maybe we don't need this?
            // but if we want to 'equip' ammo, this is needed for now
            // since darts may end up in 1 of 3 slots and we need to know
            // where it ended up.
            equippedInSlot: new fields.StringField()
        }
    }

    getArmourValue = () =>
        typeof this.values?.soak !== "undefined"
            ? this.values.soak
            : 0;
}