import { costField, fields } from "../fields.js";

// this whole class probably goes away, and becomes ammoType in the weapon
export default class RSKAmmunitionType extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        return {
            //todo: category? style, classification - not type
            type: new fields.StringField({ required: true, initial: "arrow", options: [...Object.keys(CONFIG.RSK.ammunitionType)] }),
            material: new fields.StringField({
                required: true,
                initial: "bronze",
                options: [...Object.keys(CONFIG.RSK.ammunitionMaterialType)]
            }),
            description: new fields.StringField(),
            effectDescription: new fields.StringField(),
            qualities: new fields.StringField(),
            maxStackSize: new fields.NumberField({ required: true, initial: 100000, min: 1 }),
            quantity: new fields.NumberField({ initial: 1 }),
            cost: new fields.NumberField({ ...costField })
        }
    }
}