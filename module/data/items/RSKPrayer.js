export default class RSKPrayer extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            description: new fields.StringField(),
            cost: new fields.NumberField({ required: true, nullable: false, integer: true, initial: 0, min: 0, max: 30 }),
            range: new fields.StringField()
        }
    }
}