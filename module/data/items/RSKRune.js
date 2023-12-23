import RSKStowableType from "./RSKStowableType.js";

export default class RSKRuneType extends foundry.abstract.DataModel {
    static defineSchema() {
        return {
            type: new fields.StringField({ initial: "air", options: [...Object.keys(CONFIG.RSK.runeType)] }),
            ...RSKStowableType.defineSchema()
        }
    }
}