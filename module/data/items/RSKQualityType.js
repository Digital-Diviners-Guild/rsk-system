import { fields } from "./fields.js";

//not all qualities will have effects per say
// so maybe there should be an apply method here
// that creates any effects if needed, but other
// wise can do its non status/effect thing. 

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

            // these fields feel very implementation specific.
            // though they are build in concepts to the game world
            // and are still configurable for homebrew... 
            // perhaps it is what we need for now though.
            punctureDamage: new fields.ObjectField(),

            // how do we account for resilience and retaliate???
            damageReflection: new fields.ObjectField(),
            damageResilience: new fields.ObjectField(),

            // immunities?
            immuneToStatuses: new fields.ArrayField(new fields.StringField()),

            // what else can qualities do?

            // rejuvination - when this quality applies 
            // it allows you to convert damage done healing applied
            // how the eff do we want to manage that?
        }
    }
}