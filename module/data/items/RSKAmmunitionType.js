import { fields } from "./fields.js";
import RSKStowableType from "./RSKStowableType.js";

export default class RSKAmmunitionType extends foundry.abstract.DataModel {
    static defineSchema() {
        return {
            ...RSKStowableType.defineSchema(),
            type: new fields.StringField({ initial: "arrow", options: ["arrow", "bolt", "dart"] }), // how do we want to handle darts?
            material: new fields.StringField(),
            effectDescription: new fields.StringField(),
            qualities: new fields.StringField(),
            damageEntries: new fields.ObjectField()
        }
    }
}