import { fields } from "../fields.js";

export default class RSKSpecialEffectType extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        return {
            label: new fields.StringField(),
            description: new fields.StringField(),
        }
    }
}