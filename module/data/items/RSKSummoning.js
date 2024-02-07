import { fields } from "../fields.js";
import { localizeText } from "../../rsk-localize.js";

export default class RSKSummoning extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        return {
            description: new fields.StringField(),
            targetNumberModifier: new fields.NumberField({ initial: 0 }),
            usageCost: new fields.ArrayField(new fields.SchemaField({
                type: new fields.StringField({ choices: "summoningPoints" }),
                amount: new fields.NumberField({ min: 0, max: 50 })
            })),
            usageCostLabel: new fields.StringField(),
        };
    }

    // the usage cost label might be something that can live somewhere else, its the same everywhere.
    // maybe in the sheet?
    prepareBaseData() {
        this.usageCostLabel = this.getUsageCostLabel();
    }

    getUsageCostLabel() {
        return this.usageCost
            .map(c => `${c.amount} ${localizeText(CONFIG.RSK.usageCostTypes[c.type])}`)
            .join(", ");
    }
}