import { localizeText } from "../../rsk-localize.js";
import { fields } from "../fields.js";

export default class RSKAction extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        return {
            actionType: new fields.StringField({ initial: "melee" }), // melee, magic, ranged, etc...?
            id: new fields.StringField(),
            label: new fields.StringField(),
            description: new fields.StringField(),
            effectDescription: new fields.StringField(),
            damageEntries: new fields.ObjectField(),
            range: new fields.StringField(),
            usageCost: new fields.ArrayField(new fields.SchemaField({
                type: new fields.StringField({ choices: [...Object.keys(CONFIG.RSK.usageCostTypes)] }),
                amount: new fields.NumberField()
            })),
            usageCostLabel: new fields.StringField()
        };
    }

    prepareBaseData() {
        this.usageCostLabel = this.getUsageCostLabel();
    }

    getUsageCostLabel() {
        return this.usageCost
            .map(c => `${c.amount} ${localizeText(CONFIG.RSK.usageCostTypes[c.type])}`)
            .join(", ");
    }
}
