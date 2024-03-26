import RSKItemType from "./RSKItemType.js";
import { localizeText } from "../../rsk-localize.js";

export default class RSKConsumable extends RSKItemType {
    async use(actor) {
        const effectsAdded = this.parent.effects.map(e => foundry.utils.deepClone(e.toObject()));
        const content = await renderTemplate("systems/rsk/templates/applications/action-message.hbs",
            {
                name: `${actor.name} ${localizeText("RSK.Uses")} ${this.parent.name}`,
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