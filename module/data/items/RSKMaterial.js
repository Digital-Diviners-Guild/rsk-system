import { fields, costField } from "./fields.js";

export default class RSKMaterial extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        return {
            description: new fields.HTMLField(),
            cost: new fields.NumberField({ ...costField })
        }
    }
}
