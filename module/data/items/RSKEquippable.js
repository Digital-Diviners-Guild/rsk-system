export default class RSKEquippable extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            equipped: new fields.SchemaField(
                {
                    isEquipped: new fields.BooleanField(),
                    slot: new fields.StringField()
                }
            )
        };
    }
}
