import { fields } from "./fields.js";

export default class RSKStowableType extends foundry.abstract.DataModel {
    static defineSchema() {
        return {
            //todo: not sure how we really want to do this, maybe not via slotId?
            slotId: new fields.NumberField({ initial: -1 }),
            isStackable: new fields.BooleanField({ initial: true }),
            isAmmo: new fields.BooleanField(),
            quantity: new fields.NumberField({ initial: 1 })
        }
    }
}