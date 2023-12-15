import { fields } from "./fields.js";

export default class RSKAction extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        return {
            description: new fields.HTMLField(),
        };
    }
}
