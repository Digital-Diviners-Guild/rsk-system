import { fields } from "./fields.js";

//todo: 
// this needs to detail data about what 
// happens to you and your targets as a result of the action being taken.
export default class RSKAction extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        return {
            description: new fields.HTMLField(),
            range: new fields.SchemaField({
                min: new fields.NumberField(),
                max: new fields.NumberField(),
                // prayer/spell would define its range, while melee/range comes from weapon
                useWeapon: new fields.BooleanField(),
            }),
            cost: new fields.SchemaField({
                // prayer, summoning, magic, ranged, potentially even some melee attacks may have some cost
                // these will be different per type though.
                // prayer, and summoning are point costs
                // magic is rune costs and could require several different types of runes
                // ranged is ammo, and that sometimes is the weapon itself (ie thrown weapons)
                // melee likely doesn't have cost, but a special weapon may, not sure what it would be though.
                // that being said, it should be an option to enable homebrewing.
                type: new fields.StringField(),// rune / ammo / points
                values: new fields.ArrayField(new fields.SchemaField({
                    name: new fields.StringField(), // air rune, steel arrow, prayer points
                    amount: new fields.NumberField()
                }))
            }),
            // could be all friendlies, enemies, all, maybe even more specific like undead
            // could be self, single, multi
            target: new fields.SchemaField({
                type: new fields.StringField(),
                scope: new fields.StringField()
            }),
            // statuses and effects to apply to the user on usage
            // target = self would have its effects here rather than in outcome
            usage: new fields.SchemaField({
                statuses: new fields.SchemaField({}),
                effects: new fields.SchemaField({})
            }),
            // statuses and effects to apply to to the target on usage
            // target != self would have its effects here, to allow effects on both the target/self on usage
            //what if the outcome only applies if the target fails some check?
            //the outcome can be given to the target to apply, and it can have rules on prompting the save?
            outcome: new fields.SchemaField({
                statuses: new fields.ArrayField(new fields.SchemaField({})),
                effects: new fields.ArrayField(new fields.SchemaField({}))
            }),
        };
    }
}

//RSKActionEffect
