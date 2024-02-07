import { fields } from "../fields.js";
import { localizeText } from "../../rsk-localize.js";

export default class RSKSpell extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        return {
            // what should this block be referred to as? it is common across things that can be used with an action
            description: new fields.StringField(),
            effectDescription: new fields.StringField(),
            damageEntries: new fields.ObjectField(),
            range: new fields.StringField(),
            //todo: what is the diff between choices and options?
            usageCost: new fields.ArrayField(new fields.SchemaField({
                type: new fields.StringField({ choices: [...Object.keys(CONFIG.RSK.runeType)] }),
                amount: new fields.NumberField()
            })),
            usageCostLabel: new fields.StringField(),
            spellType: new fields.StringField({ initial: "utility", options: [...Object.keys(CONFIG.RSK.spellTypes)] }),
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