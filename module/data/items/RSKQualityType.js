import { fields } from "./fields.js";

//not all qualities will have effects per say
// so maybe there should be an apply method here
// that creates any effects if needed, but other
// wise can do its non status/effect thing. 

// todo: trim further for mvp
export default class RSKQualityType extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        return {
            description: new fields.HTMLField(),
            // on equip, passive, on successes
            condition: new fields.StringField(),
            // effects to apply
            effects: new fields.ArrayField(new fields.ObjectField()),
            statuses: new fields.ArrayField(new fields.StringField()),
            // actions the quality provides to the owner, such as block?
            actions: new fields.ArrayField(new fields.ObjectField()),
        }
    }
}