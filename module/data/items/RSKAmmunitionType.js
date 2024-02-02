import { fields } from "../fields.js";
import RSKEquippableType from "./RSKEquippableType.js";

export default class RSKAmmunitionType extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        return {
            type: new fields.StringField({ initial: "arrow", options: [...Object.keys(CONFIG.RSK.ammunitionType)] }), // how do we want to handle darts?
            material: new fields.StringField(),
            description: new fields.StringField(),
            effectDescription: new fields.StringField(),
            damageEntries: new fields.ObjectField(),
            ...RSKEquippableType.defineSchema()
        }
    }

    prepareBaseData() {
        this.isAmmo = true;
        this.equipped.slot = "weapon";
    }
}