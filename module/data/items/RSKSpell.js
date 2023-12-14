export default class RSKSpell extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        const fields = foundry.data.fields;
        const numberField = { integer: true, initial: 0, min: 0 };

        return {
            spellType: new fields.StringField(),
            description: new fields.StringField(),
            cost: new fields.SchemaField(Object.keys(CONFIG.RSK.runeType).reduce((obj, rune) => {
                obj[rune] = new fields.NumberField({ ...numberField, max: 10 });
                return obj;
            }, {})),
            range: new fields.StringField(),
            damageEntries: new fields.SchemaField(Object.keys(CONFIG.RSK.damageTypes).reduce((obj, damageType) => {
                obj[damageType] = new fields.NumberField({ ...numberField, max: 300 });
                return obj;
            }, {})),
            effectDescription: new fields.StringField(),
        }
    };
}