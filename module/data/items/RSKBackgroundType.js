import { fields, positiveNumberField } from "./fields.js";

export default class RSKBackgroundType extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        return {
            description: new fields.StringField(),
            skillImprovements: new fields.SchemaField(Object.keys(CONFIG.RSK.skills).reduce((obj, skill) => {
                obj[skill] = new fields.NumberField({ ...positiveNumberField, max: 9 });
                return obj;
            }, {}))
        }
    };
}