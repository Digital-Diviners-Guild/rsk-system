import { fields } from "../fields.js";
//todo: should we have an action model for things like
// attack, cast, block, etc?

export default class RSKNpcAction extends foundry.abstract.TypeDataModel {
    //todo: need to update sheet to use outcomes
    //todo: in general we need melee, ranged, magic closer to the 'damage' model
    // in fact, we don't really have a damage model yet, we need one.
    // damage.melee({stab: 1})? damage.magic({fire: 2})? that might be nice!
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
                damage: new fields.ObjectField(),
                restoresLifePoints: new fields.NumberField({ min: 0 }),
                statusesAdded: new fields.StringField(),
                statusesRemoved: new fields.StringField(),
            }),
            //todo: idea(quality stuff defined here? - may not work ie block)
            targetOutcome: new fields.SchemaField({
                damage: new fields.ObjectField(),
                restoresLifePoints: new fields.NumberField({ min: 0 }),
                statusesAdded: new fields.StringField(),
                statusesRemoved: new fields.StringField(),
            }),
            range: new fields.StringField({ required: true, initial: "near", choices: [...Object.keys(CONFIG.RSK.ranges)] }),
        };
    }

    //todo: if we had a familiar action type we could have it make the skill check
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
                    actionType: this.type, //needs to move into damage model?
                    ...this,
                    outcomes: [...this.targetOutcomes]
                }
            }
        });
    }
}
