export default class RSKDeathType extends foundry.abstract.DataModel {
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            description: new fields.HTMLField(),
            rollTableId: new fields.StringField()
        };
    }
}