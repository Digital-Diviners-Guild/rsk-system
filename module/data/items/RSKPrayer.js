import { fields, positiveNumberField } from "./fields.js";

export default class RSKPrayer extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        return {
            description: new fields.StringField(),
            cost: new fields.NumberField({ required: true, ...positiveNumberField, max: 30 }),
            range: new fields.StringField()
        }
    }
}