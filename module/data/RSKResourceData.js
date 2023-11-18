class RSKResourceData extends foundry.abstract.DataModel {
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            name: new fields.StringField({ required: true, blank: false }),
            uses: new fields.StringField({ required: true, blank: false }),
            effects: new fields.StringField({ required: true, blank: false }),
            cost: new fields.NumberField({ required: true, nullable: false, integer: true, positive: true }),
            tags: new fields.ArrayField(new fields.StringField()),
            gatheringRequirements: new fields.SchemaField({
                equipmentRequired: new fields.SchemaField({
                    name: new fields.StringField({ required: true, blank: false })
                }),
                location: new fields.SetField(new fields.NumberField({ nullable: false, min: 0, max: 1 }))
            }),
            craftingRequirements: new fields.SchemaField({
                resourcesNeeded: new fields.ArrayField(
                    new fields.SchemaField({
                        name: new fields.StringField({ required: true, blank: false }),
                        quantity: new fields.NumberField({ required: true, nullable: false, integer: true, positive: true })
                    })),
                equipmentRequired: new fields.SchemaField({
                    name: new fields.StringField({ required: true, blank: false }),
                })
            })
        }
    }
}