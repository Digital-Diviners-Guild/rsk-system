import { costField, fields, positiveNumberField } from "../fields.js";
import RSKEquippableType from "./RSKEquippableType.js";

// things that can use ammo to shoot like a bow, or crossbow
export default class RSKRangedWeapon extends RSKEquippableType {
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
                options: [Object.keys(CONFIG.RSK.weaponMaterials)]
            }),
            ammoType: new fields.StringField({
                required: true,
                initial: "arrow",
                options: [Object.keys(CONFIG.RSK.ammunitionType)]
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

    //todo: on the use not on equip!
    meetsEquipRequirements(actor) {
        return actor.type !== "character" || this.type === "simple"
            ? true
            : actor.system.skills["ranged"] >= 5;
    }
}