import { costField, fields, positiveNumberField } from "../fields.js";

// things that can use ammo to shoot like a bow, or crossbow
//todo: darts? they can be ammo and weapon
export default class RSKRangedWeapon extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        return {
            type: new fields.StringField({ initial: "simple", options: ["simple", "martial", "unique"] }),
            //todo: maybe want to split out materials into a few lists... a dragonhide melee weapon isn't a thing.
            material: new fields.StringField({ initial: "bronze", options: [Object.keys(CONFIG.RSK.materials)] }),
            ammoType: new fields.StringField({ initial: "arrow", options: ["bolt", "arrow", "dart"] }),
            description: new fields.StringField(),
            range: new fields.StringField(),
            uses: new fields.StringField(),
            effects: new fields.StringField(),
            cost: new fields.NumberField({ ...costField }),
            damageEntries: new fields.SchemaField(Object.keys(CONFIG.RSK.damageTypes).reduce((obj, damageType) => {
                obj[damageType] = new fields.NumberField({ ...positiveNumberField, max: 150 });
                return obj;
            }, {})),

            // todo: this is all very much still experimental.  
            // how do we want to handle 'is equipable, and is stowable'
            activeSlot: new fields.StringField({ initial: "weapon", options: ["weapon", "arm"] }),
            isEquipped: new fields.BooleanField({ initial: false }),
            maxStackSize: new fields.NumberField({ initial: 1 }),
            quantity: new fields.NumberField({ initial: 1 })
        }
    };
}