import RSKStowableType from "./RSKStowableType.js"
import { fields } from "../fields.js";

export default class RSKEquippableType extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        return {
            qualities: new fields.StringField(),
            equipped: new fields.SchemaField(
                {
                    isEquipped: new fields.BooleanField(),
                    slot: new fields.StringField({ required: true, initial: "body", choices: [...Object.keys(CONFIG.RSK.activeSlotType)] })
                }
            ),
            ...RSKStowableType.defineSchema()
        };
    }
}
