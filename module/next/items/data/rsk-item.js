export default class RSKItem extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            name: new fields.StringField(),
            // is material something more? like magic log, redwood log? skin > green_dragonhide?  like a type and tier values?
            material: new fields.StringField(),
            cost: new fields.NumberField(),
            uses: new fields.StringField(),
            location: new fields.StringField(),
            description: new fields.StringField(),
            effectDescription: new fields.StringField(),
            awardedFor: new fields.StringField(),
            requiredMaterials: new fields.ArrayField(
                new fields.SchemaField({
                    schema: new fields.SchemaField({
                        material: new fields.StringField(),
                        amountNeeded: new fields.NumberField()
                    })
                })),
            equipmentNeeded: new fields.StringField(),
            damageEntries: new fields.ArrayField(
                new fields.SchemaField({
                    schema: new fields.SchemaField({
                        Type: new fields.StringField(),
                        Amount: new fields.NumberField()
                    })
                })),
            soakValue: new fields.NumberField(),
            qualities: new fields.ArrayField(
                new fields.SchemaField({
                    name: new fields.StringField(),
                    type: new fields.StringField(),
                    x: new fields.StringField(),
                    y: new fields.StringField()
                })
            ),
            usageCost: new fields.ArrayField(
                new fields.SchemaField({
                    schema: new fields.SchemaField({
                        type: new fields.StringField(),
                        amount: new fields.NumberField()
                    })
                })),
            targetNumberModifier: new fields.NumberField(),
            weaponType: new fields.StringField(),
            ammoType: new fields.StringField(),
            targets: new fields.SchemaField({
                range: new fields.StringField(),
                type: new fields.StringField(),
                amount: new fields.NumberField(),
            }),
            targetOutcomes: new fields.ArrayField(new fields.ObjectField()),
            usageOutcomes: new fields.ArrayField(new fields.ObjectField()),
            
            // what types of stuff could we utilize flags for?
            // would quantity/bulk/equipped perhaps fit there?
            // or would we want them on the schema?
            maxStackSize: new fields.NumberField(),
            quantity: new fields.NumberField(),
            activeSlot: new fields.StringField(),
            equippedInSlot: new fields.StringField(),
            bulk: new fields.SchemaField({
                value: new fields.NumberField(),
                modifier: new fields.NumberField()
            }),
            isTwoHanded: new fields.BooleanField(),
        };
    }
}