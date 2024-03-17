import RSKItemType from "./RSKItemType.js";

//todo: add effects
export default class RSKConsumable extends RSKItemType {
    async use(actor) {
        const addedEffects = this.parent.effects.map(e => foundry.utils.deepClone(e.toObject()));
        const content = await renderTemplate("systems/rsk/templates/applications/action-message.hbs",
            {
                name: `${actor.name} ${localizeText("RSK.Uses")} ${this.parent.name}`,
                hideRollResults: true
            });
        await ChatMessage.create({
            content: content,
            flags: {
                rsk: {
                    actionType: "consume",
                    outcomes: [
                        ...this.targetOutcomes,
                        { operation: "addEffects", context: { effects: [...addedEffects] } }
                    ],
                }
            }
        });
        actor.system.removeItem(this);
    }
}