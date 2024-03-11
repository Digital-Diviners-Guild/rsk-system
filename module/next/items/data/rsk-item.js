export default class RSKItem extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            // is material something more? like magic log, redwood log? skin > green_dragonhide?  like a type and tier values?
            material: new fields.StringField(),
            cost: new fields.NumberField({ initial: 0, min: 0 }),
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
            damageEntries: new fields.SchemaField(Object.keys(CONFIG.RSK.damageTypes)
                .reduce((obj, damageType) => {
                    obj[damageType] = new fields.NumberField({ ...positiveNumberField, max: 500 });
                    return obj;
                }, {})),
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
            category: new fields.StringField(),
            ammoType: new fields.StringField({
                choices: [...Object.keys(CONFIG.RSK.ammunitionType)]
            }),
            target: new fields.SchemaField({
                range: new fields.StringField({
                    initial: "near",
                    choices: [...Object.keys(CONFIG.RSK.ranges)]
                }),
                type: new fields.StringField(),
                amount: new fields.NumberField()
            }),
            targetOutcomes: new fields.ArrayField(new fields.ObjectField()),
            usageOutcomes: new fields.ArrayField(new fields.ObjectField()),

            // what types of stuff could we utilize flags for?
            // would quantity/bulk/equipped perhaps fit there?
            // or would we want them on the schema?
            maxStackSize: new fields.NumberField({ initial: 3, min: 1 }),
            quantity: new fields.NumberField({ initial: 1 }),
            activeSlot: new fields.StringField({
                required: false,
                initial: "",
                choices: ["", ...Object.keys(CONFIG.RSK.activeSlotType)]
            }),
            equippedInSlot: new fields.StringField(),
            bulk: new fields.SchemaField({
                value: new fields.NumberField({ initial: 1, min: 1 }),
                modifier: new fields.NumberField()
            }),
            isTwoHanded: new fields.BooleanField({ initial: false }),
            isEquipped: new fields.BooleanField({ initial: false }),
        };
    }
}