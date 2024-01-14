import { fields } from "./fields.js";

export default class RSKNpcAction extends foundry.abstract.DataModel {
    static defineSchema() {
        return {
            id: new fields.StringField(),
            label: new fields.StringField(), // what to display on the button?
            description: new fields.StringField(), // what it look like
            effectDescription: new fields.StringField(), // what it does
            damageEntries: new fields.ObjectField(),
        };
    }
}
