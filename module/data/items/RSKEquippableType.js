export default class RSKEquippableType extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            equipped: new fields.SchemaField(
                {
                    isEquipped: new fields.BooleanField(),
                    slot: new fields.StringField({ required: true, nullable: false }) // todo: needs to be picked from list of valid values
                }
            )
        };
    }
}
