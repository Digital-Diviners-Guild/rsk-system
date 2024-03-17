import { fields } from "../fields.js";
export default class RSKNpcAction extends foundry.abstract.TypeDataModel {
    //todo: need to update sheet to use outcomes
    static defineSchema() {
        return {
            type: new fields.StringField({
                required: true,
                initial: "melee",
                choices: [...Object.keys(CONFIG.RSK.attackType)]
            }),
            description: new fields.StringField(),
            effectDescription: new fields.StringField(),
            targetOutcomes: new fields.ArrayField(new fields.ObjectField()),
            usageOutcomes: new fields.ArrayField(new fields.ObjectField()),
            range: new fields.StringField({ required: true, initial: "near", choices: [...Object.keys(CONFIG.RSK.ranges)] }),
        };
    }

    async use(actor) {
        const content = await renderTemplate("systems/rsk/templates/applications/action-message.hbs",
            {
                name: this.parent.name,
                ...this,
                hideRollResults: true
            });

        await ChatMessage.create({
            content: content,
            flags: {
                rsk: {
                    actionType: this.type,
                    ...this,
                    outcomes: [...this.targetOutcomes]
                }
            }
        });
    }
}
