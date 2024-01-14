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
            range: new fields.StringField(),
            usageCost: new fields.ArrayField(new fields.SchemaField({
                itemType: new fields.StringField(),// rune / ammo / points
                type: new fields.StringField(), // air / arrow / prayer
                amount: new fields.NumberField()
            })),
        };
    }
}
