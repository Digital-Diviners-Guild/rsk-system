export default class RSKMaterial extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            description: new fields.StringField(),
            cost: new fields.NumberField()
        }
    }
}
