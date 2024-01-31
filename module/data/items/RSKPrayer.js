import { fields } from "../fields.js";
import { localizeText } from "../../rsk-localize.js";

//i'm wondering if we just want these datamodels to be their own data types
//and have the use function in another service rather than in the datamodels
// basically, a more functional command pattern, rather than inheritance.
// plus it keeps these models just data and use case specific
export default class RSKPrayer extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        return {
            id: new fields.StringField(),
            label: new fields.StringField(),
            effectDescription: new fields.StringField(),
            range: new fields.StringField(),
            usageCost: new fields.ArrayField(new fields.SchemaField({
                type: new fields.StringField({ choices: [...Object.keys(CONFIG.RSK.usageCostTypes)] }),
                amount: new fields.NumberField()
            })),
            usageCostLabel: new fields.StringField(),
            statuses: new fields.ArrayField(new fields.StringField()),
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