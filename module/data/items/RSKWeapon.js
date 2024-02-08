import { costField, fields, positiveNumberField } from "../fields.js";
import RSKEquippableType from "./RSKEquippableType.js";

//todo: the item type for this won't be "ammunition"
// although a ranged weapon can use a thrown weapon (such as darts) as ammunition.
// how should we allow darts to be used as ammo?
// the ammo properties are present such as "qualities" and increased stack size
export default class RSKWeapon extends RSKEquippableType {
    static defineSchema() {
        return {
            attackTypes: new fields.ArrayField(new fields.StringField()),//attackType: ranged melee thrown ammo
            weaponType: new fields.StringField({
                required: true,
                initial: "simple",
                options: [...Object.keys(CONFIG.RSK.weaponTypes)]
            }),
            // todo: materials
            material: new fields.StringField({
                required: true,
                initial: "bronze",
                options: [
                    ...Object.keys(CONFIG.RSK.ammunitionMaterialType)]
            }),
            ammoType: new fields.StringField({
                initial: "",
                options: ["", ...Object.keys(CONFIG.RSK.ammunitionType)]
            }),
            description: new fields.StringField(),
            range: new fields.StringField({
                required: true,
                initial: "near",
                options: [...Object.keys(CONFIG.RSK.ranges)]
            }),
            cost: new fields.NumberField({ ...costField }),
            damageEntries: new fields.SchemaField(Object.keys(CONFIG.RSK.damageTypes)
                .reduce((obj, damageType) => {
                    obj[damageType] = new fields.NumberField({ ...positiveNumberField, max: 500 });
                    return obj;
                }, {})),
            // todo: array of objects really - also need to rename qualities to specialEffects
            specialEffects: new fields.StringField(),
            // todo: ammo slot
            activeSlot: new fields.StringField({
                required: true,
                initial: "weapon",
                options: ["weapon", "arm"]
            }),
            isEquipped: new fields.BooleanField({ initial: false }),
            maxStackSize: new fields.NumberField({ initial: 1, min: 1 }),
            quantity: new fields.NumberField({ initial: 1 })
        }
    };
}