import { fields } from "../fields.js";

//todo: SpecialEffectType
export default class RSKQualityType extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        return {
            label: new fields.StringField(),
            description: new fields.StringField(),
        }
    }
}