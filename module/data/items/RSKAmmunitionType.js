import { fields } from "./fields.js";
import RSKStowableType from "./RSKStowableType.js";

export default class RSKAmmunitionType extends foundry.abstract.DataModel {
    static defineSchema() {
        return {
            ...RSKStowableType.defineSchema(),
            type: new fields.StringField({ initial: "arrow", options: ["arrow", "bolt", "dart"] }),
            material: new fields.StringField(),
            qualities: new fields.ArrayField(new fields.ObjectField()),
            effects: new fields.ArrayField(new fields.ObjectField()),
            damageEntries: new fields.ObjectField() // some bows override arrow damage and vice versa. how do handle that?
        }
    }
}