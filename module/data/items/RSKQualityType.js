import { fields } from "./fields.js";

export default class RSKQualityType extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        return {
            description: new fields.HTMLField(),
            // on equip, passive, on successes
            conditions: new fields.ArrayField(new fields.ObjectField()),
            // effects to apply
            effects: new fields.ArrayField(new fields.ObjectField()),
            statuses: new fields.ArrayField(new fields.ObjectField()),
            // actions the quality provides to the owner, such as block?
            actions: new fields.ArrayField(new fields.ObjectField())
        }
    }
}