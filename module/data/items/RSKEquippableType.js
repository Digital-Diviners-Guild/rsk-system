import RSKAction from "./RSKAction.js";
import RSKStowableType from "./RSKStowableType.js"
import { fields } from "./fields.js";

export default class RSKEquippableType extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        return {
            actions: new fields.ArrayField(new fields.EmbeddedDataField(RSKAction)),
            qualities: new fields.ArrayField(new fields.ObjectField()),
            equipped: new fields.SchemaField(
                {
                    isEquipped: new fields.BooleanField(),
                    // slot choices needs should be renamed to activeSlots, and use activeSlotTypes.
                    slot: new fields.StringField({ required: true, initial: "body", choices: [...Object.keys(CONFIG.RSK.armourTypes)] })
                }
            ),
            ...RSKStowableType.defineSchema()
        };
    }
}
