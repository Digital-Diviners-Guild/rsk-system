import { fields } from "./fields.js";

export default class RSKQualityType extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        return {
            description: new fields.StringField()
        }
    }
}