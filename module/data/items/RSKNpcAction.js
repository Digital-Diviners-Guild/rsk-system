import { fields } from "../fields.js";
export default class RSKNpcAction extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        return {
            type: new fields.StringField({ initial: "melee", options: [...Object.keys(CONFIG.RSK.actionTypes)] }),
            label: new fields.StringField(),
            description: new fields.StringField(),
            effectDescription: new fields.StringField(),
            damageEntries: new fields.ObjectField(),
            range: new fields.StringField({ initial: "near", options: [...Object.keys(CONFIG.RSK.ranges)] }),
        };
    }
}
