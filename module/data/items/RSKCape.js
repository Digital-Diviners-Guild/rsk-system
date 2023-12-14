import RSKEquippable from "./RSKEquippable.js";

export default class RSKCape extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            description: new fields.StringField(),
            awardedFor: new fields.StringField(),
            ...RSKEquippable.defineSchema()
        };
    }
}
