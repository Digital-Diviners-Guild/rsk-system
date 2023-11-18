export default class RSKResourceData extends foundry.abstract.DataModel {
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            name: new fields.StringField({ required: true, blank: false, initial: "new resource" }),
            uses: new fields.StringField({}),
            effects: new fields.StringField({}),
            cost: new fields.NumberField({ required: true, nullable: false, integer: true, positive: true, initial: 0 }),
            tags: new fields.ArrayField(new fields.StringField()),
            gatheringRequirements: new fields.SchemaField({
                equipmentRequired: new fields.SchemaField({
                    name: new fields.StringField({ initial: "none" })
                }),
                location: new fields.StringField({ initial: "any" })
            }),
            craftingRequirements: new fields.SchemaField({
                resourcesNeeded: new fields.ArrayField(
                    new fields.SchemaField({
                        name: new fields.StringField({}),
                        quantity: new fields.NumberField({ nullable: false, integer: true, positive: true, initial: 0 })
                    })),
                equipmentRequired: new fields.SchemaField({
                    name: new fields.StringField({ initial: "none" }),
                })
            })
        }
    }
}