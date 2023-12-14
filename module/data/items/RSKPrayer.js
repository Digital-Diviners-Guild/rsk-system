export default class RSKPrayer extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        const fields = foundry.data.fields;
        const numberField = { required: true, nullable: false, integer: true, initial: 0, min: 0, max: 30 };
        return {
            description: new fields.StringField(),
            cost: new fields.NumberField({ ...numberField }),
            range: new fields.StringField()
        }
    }
}