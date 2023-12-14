export default class RSKBackgroundType extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            description: new fields.StringField(),
            skillImprovements: new fields.SchemaField(Object.keys(CONFIG.RSK.skills).reduce((obj, skill) => {
                obj[skill] = new fields.NumberField({ integer: true, initial: 0, min: 0, max: 9 });
                return obj;
            }, {}))
        }
    };
}