import { fields, costField } from "./fields.js";
import RSKStowableType from "./RSKStowableType.js";

export default class RSKResource extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        return {
            ...RSKStowableType.defineSchema,
            description: new fields.HTMLField(),
            uses: new fields.HTMLField(),
            cost: new fields.NumberField({ ...costField })
        }
    }
}
