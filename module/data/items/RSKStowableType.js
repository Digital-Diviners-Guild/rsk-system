import { fields } from "./fields.js";

export default class RSKStowableType extends foundry.abstract.DataModel {
    static defineSchema() {
        return {
            isStackable: new fields.BooleanField(),
            isAmmo: new fields.BooleanField(),
            quantity: new fields.NumberField()
        }
    }
}