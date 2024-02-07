import { costField, fields, positiveNumberField } from "../fields.js";
import RSKEquippableType from "./RSKEquippableType.js";

//things that can be used in a melee attack action, such as an axe, or pitchfork, or sword
export default class RSKMeleeWeapon extends RSKEquippableType {
    static defineSchema() {
        return {
            type: new fields.StringField({ initial: "simple", options: [Object.keys(CONFIG.RSK.weaponTypes)] }),
            material: new fields.StringField({ initial: "bronze", options: [Object.keys(CONFIG.RSK.weaponMaterials)] }),
            description: new fields.StringField(),
            uses: new fields.StringField(),
            effectDescription: new fields.StringField(),
            cost: new fields.NumberField({ ...costField }),
            damageEntries: new fields.SchemaField(Object.keys(CONFIG.RSK.damageTypes).reduce((obj, damageType) => {
                obj[damageType] = new fields.NumberField({ ...positiveNumberField, max: 150 });
                return obj;
            }, {})),
            activeSlot: new fields.StringField({ initial: "weapon", options: ["weapon", "arm"] }),
            isEquipped: new fields.BooleanField({ initial: false }),
            maxStackSize: new fields.NumberField({ initial: 1 }),
            quantity: new fields.NumberField({ initial: 1 })
        }
    };
}