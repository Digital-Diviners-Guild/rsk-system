import RSKItemType from "./RSKItemType.js";
import { localizeText } from "../../rsk-localize.js";

// todo: consumables can remove an effect that you get to chose
// we need to pop up a dialog of their current special effects
// so they can pick one to remove

// todo: need to create the effect on the fly so we can input the duration
// like with statuses.  so we need effect changes and duration in consumable model?

export default class RSKConsumable extends RSKItemType {
    async use(actor) {
        const effectsAdded = this.parent.effects.map(e => foundry.utils.deepClone(e.toObject()));
        const content = await renderTemplate("systems/rsk/templates/applications/action-message.hbs",
            {
                name: `${actor.name} ${localizeText("RSK.Uses")} ${this.parent.name}`,
                description: this.description,
                effectDescription: this.effectDescription,
                hideRollResults: true
            });
        const outcome = { ...this.targetOutcome };
        if (outcome.effectsAdded) {
            outcome.effectsAdded = [...outcome.effectsAdded, ...effectsAdded];
        } else {
            outcome.effectsAdded = [...effectsAdded];
        }
        await ChatMessage.create({
            content: content,
            flags: {
                rsk: {
                    actorUuid: actor.uuid,
                    name: this.parent.name,
                    description: this.description,
                    effectDescription: this.effectDescription,
                    actionType: "consume",
                    img: this.parent.img,
                    targetOutcome: { ...outcome },
                    actorOutcome: { ...this.usageOutcome },
                    specialEffect: [...this.specialEffect]
                }
            }
        });
        actor.system.removeItem(this.parent);
    }
}