import { fields } from "../fields.js";

export default class RSKItemType extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        return {
            // is material something more? like magic log, redwood log? skin > green_dragonhide?  like a type and tier values?
            category: new fields.StringField(), // rune | weapon | spell
            subCategory: new fields.StringField(), // air | sword | utility
            material: new fields.StringField(),
            cost: new fields.NumberField({ initial: 0, min: 0 }),
            uses: new fields.StringField(),
            location: new fields.StringField(),
            upgrades: new fields.StringField(), // perhaps an object with details about the upgrade?
            description: new fields.StringField(),
            effectDescription: new fields.StringField(),
            awardedFor: new fields.StringField(),
            requiredMaterials: new fields.StringField(), //eventually this will need to be more
            equipmentNeeded: new fields.StringField(),
            targetNumberModifier: new fields.NumberField(),
            soakValue: new fields.NumberField(),
            usageCost: new fields.ArrayField(
                new fields.SchemaField({
                    type: new fields.StringField(),
                    amount: new fields.NumberField()
                })),
            usageOutcome: new fields.SchemaField({
                damageEntries: new fields.ObjectField(),
                restoresLifePoints: new fields.NumberField({ min: 0 }),
                addsStatuses: new fields.StringField(),
                removesStatuses: new fields.StringField(),
            }),
            targetOutcome: new fields.SchemaField({
                damageEntries: new fields.ObjectField(),
                restoresLifePoints: new fields.NumberField({ min: 0 }),
                addsStatuses: new fields.StringField(),
                removesStatuses: new fields.StringField(),
            }),
            // do we need something like this?
            specialEffect: new fields.SchemaField({
                name: new fields.StringField(),
                type: new fields.StringField(),
                // could be 'success', 'equip', 'usage'
                condition: new fields.StringField(),
                marginThreshold: new fields.NumberField({ initial: 1, min: 0 }),
                addsStatuses: new fields.StringField(), // for things like 'block' we could have a 'blocking' status that uses a flag for the X value?
                removesStatuses: new fields.StringField(),
                addsEffects: new fields.ObjectField(), // could we store effects here too?
                x: new fields.ObjectField(),
                y: new fields.ObjectField(),
                duration: new fields.StringField()
            }),

            //todo: new target model to help with targetting rules
            // target: new fields.SchemaField({
            //     range: new fields.StringField({
            //         initial: "near",
            //         choices: [...Object.keys(CONFIG.RSK.ranges)]
            //     }),
            //     type: new fields.StringField(),
            //     amount: new fields.NumberField()
            // }),

            range: new fields.StringField({
                required: true,
                initial: "near",
                choices: [...Object.keys(CONFIG.RSK.ranges)]
            }),

            // what types of stuff could we utilize flags for?
            // would quantity/bulk/equipped perhaps fit there?
            // or would we want them on the schema?
            maxStackSize: new fields.NumberField({ initial: 3, min: 1 }),
            quantity: new fields.NumberField({ initial: 1 }),
            bulk: new fields.SchemaField({
                value: new fields.NumberField({ initial: 1, min: 1 }),
                modifier: new fields.NumberField()
            }),

            //todo: do these really need to be on the base item
            activeSlot: new fields.StringField({
                required: false,
                choices: [...Object.keys(CONFIG.RSK.activeSlotType)]
            }),
            equippedInSlot: new fields.StringField(),
            isTwoHanded: new fields.BooleanField({ initial: false }),
            isEquipped: new fields.BooleanField({ initial: false }),
        };
    }
}
