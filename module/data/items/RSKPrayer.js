import { fields } from "../fields.js";
import { localizeText } from "../../rsk-localize.js";
import { rskPrayerStatusEffects } from "../../effects/statuses.js";

export default class RSKPrayer extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        return {
            effectDescription: new fields.StringField(),
            range: new fields.StringField({ initial: "near", options: ["near"] }),
            usageCost: new fields.ArrayField(new fields.SchemaField({
                type: new fields.StringField({ initial: "prayerPoints", choices: ["prayerPoints"] }),
                amount: new fields.NumberField({ min: 0, max: 30 })
            })),
            usageCostLabel: new fields.StringField(),
            status: new fields.StringField({ initial: "thick_skin", choices: [...rskPrayerStatusEffects.map(se => se.id)] }),
        }
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