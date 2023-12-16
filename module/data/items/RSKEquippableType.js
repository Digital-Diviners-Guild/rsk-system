import RSKAction from "./RSKAction.js";
import { fields } from "./fields.js";

export default class RSKEquippableType extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        return {
            //probably need dragdrop handling for this.
            // this might be how we have weapons receive the 'attack' action
            // the item should be linked to the action so the action can check
            // canUsage, effects, and damageEntries provided by the equipment.
            // this may also be how we can have the block effect from a fancy
            // shield provide you with the block action?
            actions: new fields.ArrayField(new fields.EmbeddedDataField(RSKAction)),
            qualities: new fields.ArrayField(new fields.ObjectField()),
            equipped: new fields.SchemaField(
                {
                    isEquipped: new fields.BooleanField(),
                    slot: new fields.StringField({ required: true, initial: "body", choices: [...Object.keys(CONFIG.RSK.armourTypes)] })
                }
            )
        };
    }
}
