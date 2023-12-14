import RSKEquippable from "./RSKEquippable.js";

export default class RSKEquipment extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            description: new fields.StringField(),
            cost: new fields.NumberField(),
            uses: new fields.StringField(),
            effectDescription: new fields.StringField(),
            range: new fields.StringField(),
            ...RSKEquippable.defineSchema(),
            damageEntries: new fields.SchemaField(Object.keys(CONFIG.RSK.damageTypes).reduce((obj, damageType) => {
                obj[damageType] = new fields.NumberField({ initial: 0, min: 0, max: 100 });
                return obj;
            }, {}))
        }
    };
}