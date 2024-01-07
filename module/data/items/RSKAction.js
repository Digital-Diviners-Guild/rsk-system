import { fields } from "./fields.js";

//todo: 
// this needs to detail data about what 
// happens to you and your targets as a result of the action being taken.
export default class RSKAction extends foundry.abstract.DataModel {
    static defineSchema() {
        return {
            id: new fields.StringField(),
            type: new fields.StringField(), // melee, spell, prayer, or should this be more like 'combat' 'utility'
            label: new fields.StringField(), // what to display on the button?
            description: new fields.HTMLField(), // what it look like
            effectDescription: new fields.HTMLField(), // what it does
            damageEntries: new fields.ObjectField(),
            requiredEquipment: new fields.ArrayField(new fields.ObjectField()),
            usageCosts: new fields.ArrayField(new fields.SchemaField({
                itemType: new fields.StringField(),// rune / ammo / points
                type: new fields.StringField(), // air / arrow / prayer
                amount: new fields.NumberField()
            })),
            targets: new fields.ArrayField(new fields.SchemaField({
                range: new fields.StringField(),
                type: new fields.StringField(),
                scope: new fields.StringField(),
                number: new fields.NumberField()
            })),
            statuses: new fields.ArrayField(new fields.StringField()),
            effects: new fields.ArrayField(new fields.ObjectField()),
            //todo: I think we can reference the quality type here
            qualities: new fields.ArrayField(new fields.ObjectField()),
        };
    }
}
