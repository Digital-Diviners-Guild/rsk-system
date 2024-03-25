import { fields } from "../fields.js";
//todo: should we have an action model for things like
// attack, cast, block, etc?

export default class RSKNpcAction extends foundry.abstract.TypeDataModel {
    //todo: need to update sheet to use outcomes
    static defineSchema() {
        return {
            type: new fields.StringField({
                required: true,
                initial: "melee",
                choices: [...Object.keys(CONFIG.RSK.attackType)]
            }),
            defenseCheck: new fields.StringField(),
            description: new fields.StringField(),
            effectDescription: new fields.StringField(),
            usageOutcome: new fields.SchemaField({
                damageEntries: new fields.ObjectField(),
                restoresLifePoints: new fields.NumberField({ min: 0 }),
                statusesAdded: new fields.ArrayField(new fields.ObjectField()),
                effectsAdded: new fields.ArrayField(new fields.ObjectField()),
                statusesRemoved: new fields.ArrayField(new fields.StringField()),
            }),
            targetOutcome: new fields.SchemaField({
                damageEntries: new fields.ObjectField(),
                restoresLifePoints: new fields.NumberField({ min: 0 }),
                statusesAdded: new fields.ArrayField(new fields.ObjectField()),
                effectsAdded: new fields.ArrayField(new fields.ObjectField()),
                statusesRemoved: new fields.ArrayField(new fields.StringField()),
            }),
            specialEffect: new fields.ArrayField(new fields.SchemaField({
                name: new fields.StringField(),
                x: new fields.StringField(),
                y: new fields.StringField(),
            })),
            range: new fields.StringField({ required: true, initial: "near", choices: [...Object.keys(CONFIG.RSK.ranges)] }),
        };
    }

    //todo: when attacking player, need def check
    // when familiar, need skill check
    async use(actor) {
        const content = await renderTemplate("systems/rsk/templates/applications/action-message.hbs",
            {
                name: this.parent.name,
                description: this.description,
                effectDescription: this.effectDescription,
                hideRollResults: true
            });
        await ChatMessage.create({
            content: content,
            flags: {
                rsk: {
                    actorUuid: actor.uuid,
                    name: this.parent.name,
                    description: this.description,
                    effectDescription: this.effectDescription,
                    actionType: "npcAction",
                    img: this.parent.img,
                    targetOutcome: { ...this.targetOutcome },
                    actorOutcome: { ...this.usageOutcome },
                    specialEffect: [...this.specialEffect]
                }
            }
        });
    }
}
