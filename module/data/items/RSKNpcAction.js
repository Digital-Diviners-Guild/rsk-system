import { fields } from "../fields.js";
export default class RSKNpcAction extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        return {
            type: new fields.StringField({
                required: true,
                initial: "melee",
                options: [...Object.keys(CONFIG.RSK.actionTypes)]
            }),
            description: new fields.StringField(),
            effectDescription: new fields.StringField(),
            damageEntries: new fields.SchemaField(Object.keys(CONFIG.RSK.damageTypes)
                .reduce((obj, damageType) => {
                    obj[damageType] = new fields.NumberField({ ...positiveNumberField, max: 500 });
                    return obj;
                }, {})),
            range: new fields.StringField({ required: true, initial: "near", options: [...Object.keys(CONFIG.RSK.ranges)] }),
        };
    }
}
