import { fields } from "./fields.js";
import RSKStowableType from "./RSKStowableType.js";

export default class RSKRuneType extends foundry.abstract.DataModel {
    constructor(data = {}, ...args) {
        super({ ...data, isAmmo: true }, ...args)
    }
    static defineSchema() {
        return {
            type: new fields.StringField({ initial: "air", options: [...Object.keys(CONFIG.RSK.runeType)] }),
            ...RSKStowableType.defineSchema()
        }
    }
}