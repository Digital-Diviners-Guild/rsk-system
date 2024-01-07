import RSKAction from "./RSKAction.js";
import { fields } from "./fields.js";

export default class RSKSpell extends RSKAction {
    static defineSchema() {
        return {
            spellType: new fields.StringField(),
            ...RSKAction.defineSchema()
        }
    };

    static fromData(spellData) {
        const spell = new this({ ...spellData });
        spell._id = spellData.id;
        spell.label = spellData.label;
        spell.actor = spellData.actor;
        return spell;
    }
}