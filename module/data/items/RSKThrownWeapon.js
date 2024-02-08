import { costField, fields, positiveNumberField } from "../fields.js";
import RSKRangedWeapon from "./RSKRangedWeapon.js";

//todo: the item type for this won't be "ammunition"
// although a ranged weapon can use a thrown weapon (such as darts) as ammunition.
// how should we allow darts to be used as ammo?
// the ammo properties are present such as "qualities" and increased stack size
export default class RSKThrownWeapon extends RSKRangedWeapon {
    static defineSchema() {
        return {
            type: new fields.StringField({
                required: true,
                initial: "simple",
                options: [Object.keys(CONFIG.RSK.weaponTypes)]
            }),
            material: new fields.StringField({
                required: true,
                initial: "bronze",
                options: [...Object.keys(CONFIG.RSK.ammunitionMaterialType)]
            }),
            description: new fields.StringField(),
            range: new fields.StringField({
                required: true,
                initial: "far",
                options: [...Object.keys(CONFIG.RSK.ranges)]
            }),
            uses: new fields.StringField(),
            effectDescription: new fields.StringField(),
            cost: new fields.NumberField({ ...costField }),
            damageEntries: new fields.SchemaField(Object.keys(CONFIG.RSK.damageTypes)
                .reduce((obj, damageType) => {
                    obj[damageType] = new fields.NumberField({ ...positiveNumberField, max: 500 });
                    return obj;
                }, {})),
            qualities: new fields.StringField(),
            activeSlot: new fields.StringField({
                required: true,
                initial: "weapon",
                options: ["weapon", "arm"]
            }),
            isEquipped: new fields.BooleanField({ initial: false }),
            maxStackSize: new fields.NumberField({ initial: 100000, min: 1 }),
            quantity: new fields.NumberField({ initial: 1 })
        }
    };
}