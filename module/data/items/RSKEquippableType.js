import { fields } from "./fields.js";

export default class RSKEquippableType extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        return {
            equipped: new fields.SchemaField(
                {
                    isEquipped: new fields.BooleanField(),
                    slot: new fields.StringField({ required: true, initial: "body", choices: [...Object.keys(CONFIG.RSK.armourTypes)] })
                }
            )
        };
    }
}
