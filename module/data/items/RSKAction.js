import { fields } from "../fields.js";

export default class RSKAction extends foundry.abstract.TypeDataModel {
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
            usageCostLabel: new fields.StringField()
        };
    }

    prepareBaseData() {
        this.usageCostLabel = this.getUsageCostLabel();
    }

    getUsageCostLabel() {
        return this.usageCost
            .map(c => `${c.amount} ${c.type} ${c.itemType}${c.amount > 1 ? 's' : ''}`)
            .join(", ");
    }
}
