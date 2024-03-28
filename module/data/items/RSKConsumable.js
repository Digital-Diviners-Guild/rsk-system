import RSKItemType from "./RSKItemType.js";
import { localizeText } from "../../rsk-localize.js";

// todo: consumables can remove an effect that you get to chose
// we need to pop up a dialog of their current special effects
// so they can pick one to remove

// todo: need to create the effect on the fly so we can input the duration
// like with statuses.  so we need effect changes and duration in consumable model?

export default class RSKConsumable extends RSKItemType {
    async use(actor) {
        const effectsAdded = [];
        const formula = this.parent.getFlag("rsk", "effectsDuration") || "1d6+1";
        const durationRoll = (await game.rsk.dice.roll("custom", formula)).result.total;
        for (let e of this.parent.effects) {
            const eff = foundry.utils.deepClone(e.toObject());
            eff.duration = { type: "turns", turns: durationRoll };
            effectsAdded.push(eff);
        }
        const content = await renderTemplate("systems/rsk/templates/applications/action-message.hbs",
            {
                name: `${actor.name} ${localizeText("RSK.Uses")} ${this.parent.name}`,
                description: this.description,
                effectDescription: effectsAdded.length > 0
                    ? `${this.effectDescription} (${durationRoll} turns)`
                    : this.effectDescription,
                hideRollResults: true
            });
        this.targetOutcome.effectsAdded = [...effectsAdded];
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
                    targetOutcome: { ...this.targetOutcome },
                    actorOutcome: { ...this.usageOutcome },
                    specialEffect: [...this.specialEffect]
                }
            }
        });
        actor.system.removeItem(this.parent);
    }
}