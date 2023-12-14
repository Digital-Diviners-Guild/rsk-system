export default class RSKMaterial extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        const fields = foundry.data.fields;
        const numberField = { integer: true, initial: 0, min: 0, max: 10000 };
        return {
            description: new fields.StringField(),
            cost: new fields.NumberField({ ...numberField })
        }
    }
}
