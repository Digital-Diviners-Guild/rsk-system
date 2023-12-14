export default class RSKSpell extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            spellType: new fields.StringField(),
            description: new fields.StringField(),
            cost: new fields.SchemaField(Object.keys(CONFIG.RSK.runeType).reduce((obj, rune) => {
                obj[rune] = new fields.NumberField({ initial: 0, min: 0, max: 30 });
                return obj;
            }, {})),
            range: new fields.StringField(),
            damageEntries: new fields.SchemaField(Object.keys(CONFIG.RSK.damageTypes).reduce((obj, damageType) => {
                obj[damageType] = new fields.NumberField({ initial: 0, min: 0, max: 100 });
                return obj;
            }, {})),
            effectDescription: new fields.StringField(),
        }
    };
}