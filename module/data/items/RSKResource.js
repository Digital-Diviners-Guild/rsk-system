import { fields, costField } from "./fields.js";
import RSKStowableType from "./RSKStowableType.js";

export default class RSKResource extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        return {
            ...RSKStowableType.defineSchema(),
            description: new fields.StringField(),
            uses: new fields.StringField(),
            cost: new fields.NumberField({ ...costField })
        }
    }
}
