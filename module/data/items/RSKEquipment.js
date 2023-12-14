import RSKEquippableType from "./RSKEquippableType.js";

export default class RSKEquipment extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        const fields = foundry.data.fields;
        const numberField = { integer: true, initial: 0, min: 0 };

        return {
            description: new fields.StringField(),
            cost: new fields.NumberField({ ...numberField, max: 10000 }),
            uses: new fields.StringField(),
            effectDescription: new fields.StringField(),
            range: new fields.StringField(),
            ...RSKEquippableType.defineSchema(),
            damageEntries: new fields.SchemaField(Object.keys(CONFIG.RSK.damageTypes).reduce((obj, damageType) => {
                obj[damageType] = new fields.NumberField({ ...numberField, max: 150 });
                return obj;
            }, {}))
        }
    };
}