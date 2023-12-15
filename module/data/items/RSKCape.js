import { fields } from "./fields.js";
import RSKEquippableType from "./RSKEquippableType.js";

export default class RSKCape extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        return {
            description: new fields.StringField(),
            awardedFor: new fields.StringField(),
            ...RSKEquippableType.defineSchema()
        };
    }
}
