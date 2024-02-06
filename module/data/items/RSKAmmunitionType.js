import { costField, fields } from "../fields.js";

export default class RSKAmmunitionType extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        return {
            //todo: darts
            type: new fields.StringField({ initial: "arrow", options: [...Object.keys(CONFIG.RSK.ammunitionType)] }), // how do we want to handle darts?
            material: new fields.StringField(),
            description: new fields.StringField(),
            effectDescription: new fields.StringField(),
            qualities: new fields.StringField(),
            maxStackSize: new fields.NumberField({ initial: 100000 }),
            quantity: new fields.NumberField({ initial: 1 }),
            cost: new fields.NumberField({ ...costField })
        }
    }
}