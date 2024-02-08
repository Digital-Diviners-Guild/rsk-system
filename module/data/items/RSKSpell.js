import { fields, positiveNumberField } from "../fields.js";
import { localizeText } from "../../rsk-localize.js";

export default class RSKSpell extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        return {
            // what should this block be referred to as? it is common across things that can be used with an action
            description: new fields.StringField(),
            effectDescription: new fields.StringField(),
            damageEntries: new fields.SchemaField(Object.keys(CONFIG.RSK.damageTypes)
                .reduce((obj, damageType) => {
                    obj[damageType] = new fields.NumberField({ ...positiveNumberField, max: 500 });
                    return obj;
                }, {})),
            range: new fields.StringField({
                required: true,
                initial: "far",
                options: [...Object.keys(CONFIG.RSK.ranges)]
            }),
            //todo: what is the diff between choices and options?
            usageCost: new fields.ArrayField(new fields.SchemaField({
                type: new fields.StringField({ choices: [...Object.keys(CONFIG.RSK.runeType)] }),
                amount: new fields.NumberField()
            })),
            usageCostLabel: new fields.StringField(),
            spellType: new fields.StringField({
                required: true,
                initial: "utility",
                options: [...Object.keys(CONFIG.RSK.spellTypes)]
            }),
            statuses: new fields.ArrayField(new fields.StringField()),
            qualities: new fields.StringField(),
            requiredEquipment: new fields.StringField(),
        }
    };

    prepareBaseData() {
        this.usageCostLabel = this.getUsageCostLabel();
    }

    getUsageCostLabel() {
        return this.usageCost
            .map(c => `${c.amount} ${localizeText(CONFIG.RSK.usageCostTypes[c.type])}`)
            .join(", ");
    }
}