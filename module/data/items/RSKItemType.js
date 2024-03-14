import { fields, positiveNumberField } from "../fields.js";

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
            description: new fields.StringField(),
            effectDescription: new fields.StringField(),
            awardedFor: new fields.StringField(),
            requiredMaterials: new fields.ArrayField(
                new fields.SchemaField({
                    material: new fields.StringField(),
                    amountNeeded: new fields.NumberField()
                })),
            equipmentNeeded: new fields.StringField(),
            targetNumberModifier: new fields.NumberField(),
            qualities: new fields.ArrayField(
                new fields.SchemaField({
                    name: new fields.StringField(),
                    type: new fields.StringField(),
                    x: new fields.StringField(),
                    y: new fields.StringField()
                })
            ),
            soakValue: new fields.NumberField(),
            usageCost: new fields.ArrayField(
                new fields.SchemaField({
                    schema: new fields.SchemaField({
                        type: new fields.StringField(),
                        amount: new fields.NumberField()
                    })
                })),
            //todo: do we want 'damage entries' or should we render that out of the targetOutcomes with 'recieve dmage'
            targetOutcomes: new fields.ArrayField(new fields.ObjectField()),
            usageOutcomes: new fields.ArrayField(new fields.ObjectField()),
            target: new fields.SchemaField({
                range: new fields.StringField({
                    initial: "near",
                    choices: [...Object.keys(CONFIG.RSK.ranges)]
                }),
                type: new fields.StringField(),
                amount: new fields.NumberField()
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