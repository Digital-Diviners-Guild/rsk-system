import { fields } from "./fields.js";
import RSKEquippableType from "./RSKEquippableType.js";

export default class RSKCapeType extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        return {
            description: new fields.StringField(),
            awardedFor: new fields.StringField(),
            ...RSKEquippableType.defineSchema(),
        };
    }

    prepareBaseData() {
        this.equipped.slot = "cape";
    }
}
