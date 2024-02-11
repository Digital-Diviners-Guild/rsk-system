import { costField, fields, positiveNumberField, AttackMethodField } from "../fields.js";
import RSKEquippableType from "./RSKEquippableType.js";

export default class RSKWeapon extends RSKEquippableType {
    static defineSchema() {
        return {
            attackMethods: new fields.SetField(new fields.StringField({ choices: [...Object.keys(CONFIG.RSK.attackMethods)] }), {
                required: true,
                initial: ["melee"],
                choices: [...Object.keys(CONFIG.RSK.attackMethods)]
            }),
            weaponType: new fields.StringField({
                required: true,
                initial: "simple",
                choices: [...Object.keys(CONFIG.RSK.weaponTypes)]
            }),
            material: new fields.StringField({
                required: true,
                initial: "bronze",
                choices: [
                    ...Object.keys(CONFIG.RSK.weaponMaterials)]
            }),
            ammoType: new fields.StringField({
                initial: "",
                choices: ["", ...Object.keys(CONFIG.RSK.ammunitionType)]
            }),
            description: new fields.StringField(),
            effectDescription: new fields.StringField(),
            range: new fields.StringField({
                required: true,
                initial: "near",
                choices: [...Object.keys(CONFIG.RSK.ranges)]
            }),
            cost: new fields.NumberField({ ...costField }),
            damageEntries: new fields.SchemaField(Object.keys(CONFIG.RSK.damageTypes)
                .reduce((obj, damageType) => {
                    obj[damageType] = new fields.NumberField({ ...positiveNumberField, max: 500 });
                    return obj;
                }, {})),
            //todo: array of objects eventually
            specialEffects: new fields.StringField(),
            activeSlot: new fields.StringField({
                required: true,
                initial: "weapon",
                choices: ["weapon", "arm", "ammo"]
            }),
            isEquipped: new fields.BooleanField({ initial: false }),
            maxStackSize: new fields.NumberField({ initial: 1, min: 1 }),
            quantity: new fields.NumberField({ initial: 1 }),
            //todo: feels like maybe we don't need this?
            // but if we want to 'equip' ammo, this is needed for now
            // since darts may end up in 1 of 3 slots and we need to know
            // where it ended up.
            equippedInSlot: new fields.StringField()
        }
    };
}