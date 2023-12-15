import { fields, costField } from "./fields.js"

export default class RSKResource extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        return {
            description: new fields.HTMLField(),
            uses: new fields.HTMLField(),
            cost: new fields.NumberField({ ...costField })
        }
    }
}
