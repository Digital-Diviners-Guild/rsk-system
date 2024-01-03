import { fields } from "./fields.js";

//todo: 
// this needs to detail data about what 
// happens to you and your targets as a result of the action being taken.
export default class RSKAction extends foundry.abstract.DataModel {
    static defineSchema() {
        return {
            id: new fields.StringField(),
            type: new fields.StringField(), // melee, spell, prayer
            label: new fields.StringField(), // what to display on the button?
            description: new fields.HTMLField(),
            effectDescription: new fields.HTMLField(),
            damageEntries: new fields.ArrayField(new fields.ObjectField()),
            requiredEquipment: new fields.ArrayField(new fields.ObjectField()),
            usageCosts: new fields.ArrayField(new fields.SchemaField({
                // prayer, summoning, magic, ranged, potentially even some melee attacks may have some cost
                // these will be different per type though.
                // prayer, and summoning are point costs
                // magic is rune costs and could require several different types of runes
                // ranged is ammo, and that sometimes is the weapon itself (ie thrown weapons)
                // melee likely doesn't have cost, but a special weapon may, not sure what it would be though.
                // that being said, it should be an option to enable homebrewing.
                type: new fields.StringField(),// rune / ammo / points
                amount: new fields.NumberField()
            })),
            // could be all friendlies, enemies, all, maybe even more specific like undead
            // could be self, single, multi
            targets: new fields.ArrayField(new fields.SchemaField({
                range: new fields.StringField(),
                type: new fields.StringField(),
                scope: new fields.StringField(),
                number: new fields.NumberField()
            })),
            // what happens to the target, 
            // statuses, damage, healing, etc...
            statuses: new fields.ArrayField(new fields.StringField()),
            effects: new fields.ArrayField(new fields.ObjectField()),
        };
    }
}
