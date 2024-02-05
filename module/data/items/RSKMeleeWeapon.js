import { costField, fields, positiveNumberField } from "../fields.js";

//things that can be used in a melee attack action, such as an axe, or pitchfork, or sword
export default class RSKMeleeWeapon extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        return {
            type: new fields.StringField({ initial: "simple", options: ["simple", "martial", "unique"] }),
            //todo: maybe want to split out materials into a few lists... a dragonhide melee weapon isn't a thing.
            material: new fields.StringField({ initial: "bronze", options: [Object.keys(CONFIG.RSK.materials)] }),
            description: new fields.StringField(),
            uses: new fields.StringField(),
            effects: new fields.StringField(),
            cost: new fields.NumberField({ ...costField }),
            damageEntries: new fields.SchemaField(Object.keys(CONFIG.RSK.damageTypes).reduce((obj, damageType) => {
                obj[damageType] = new fields.NumberField({ ...positiveNumberField, max: 150 });
                return obj;
            }, {})),
            activeSlot: new fields.SchemaField({ initial: "weapon", options: ["weapon", "arm"] }),
            isEquipped: new fields.BooleanField({ initial: false }),
            maxStackSize: new fields.NumberField({ initial: 1 }),
            quantity: new fields.NumberField({ initial: 1 })
        }
    };
}