import { fields } from "./fields.js";

export default class RSKAction extends foundry.abstract.DataModel {
    static defineSchema() {
        return {
            id: new fields.StringField(),
            type: new fields.StringField(), // melee, magic, prayer
            label: new fields.StringField(), // what to display on the button?
            description: new fields.StringField(), // what it look like
            effectDescription: new fields.StringField(), // what it does
            damageEntries: new fields.ObjectField(),
        };
    }
}
