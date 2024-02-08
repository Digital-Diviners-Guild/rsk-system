import { costField, fields, positiveNumberField } from "../fields.js";
import RSKEquippableType from "./RSKEquippableType.js";

export default class RSKWeapon extends RSKEquippableType {
    static defineSchema() {
        return {
            //todo: config values for localization like others
            attackTypes: new fields.ArrayField(new fields.StringField(
                // not sure if magic even applies here.  
                // a staff is actually a melee weapon if you don't cast a spell
                // ammo and thrown still need to resolve to 'ranged' during the usage. (which is actionType encapsulated by action logic)
                { initial: "melee", options: ["melee", "ranged", "magic", "thrown", "ammo"] }
            )),
            weaponType: new fields.StringField({
                required: true,
                initial: "simple",
                options: [...Object.keys(CONFIG.RSK.weaponTypes)]
            }),
            material: new fields.StringField({
                required: true,
                initial: "bronze",
                options: [
                    ...Object.keys(CONFIG.RSK.weaponMaterials)]
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
            //todo: array of objects eventually
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