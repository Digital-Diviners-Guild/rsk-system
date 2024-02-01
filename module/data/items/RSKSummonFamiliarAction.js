import RSKConfirmRollDialog from "../../applications/RSKConfirmRollDialog.js";
import { fields } from "../fields.js";

export default class RSKSummonFamiliarAction extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        return {
            id: new fields.StringField(),
            label: new fields.StringField(),
            actionType: new fields.StringField({ initial: "summoning" }),
            actionData: new fields.ObjectField()
        };
    }

    async use(actor) {
        if (actor.type === "npc") return;

        const cost = this.actionData.usageCost[0]?.amount ?? 0;
        if (!this.canSummon(actor, cost)) return;

        const result = await this.summonFamiliar(actor, cost);
        if (!result) return;

        const flavor = await renderTemplate("systems/rsk/templates/applications/item-message.hbs",
            {
                label: this.label,
                ...this.actionData,
                showRollResult: true,
                ...result
            });
        await result.rollResult.toMessage({
            flavor: flavor,
            flags: {
                // not sure how we want to send this information to be applied yet
                // probably will have a button to apply in the chat, so sending it
                // with the message seems to make sense.
                rsk: {
                    actionType: this.actionType,
                    actionData: { ...this.actionData }
                }
            }
        });
        return result;
    }

    canSummon(actor, summoningPoints) {
        return actor.system.summoningPoints.value >= summoningPoints;
    }

    async summonFamiliar(actor, summoningPoints) {
        const rollData = actor.getRollData();
        const dialog = RSKConfirmRollDialog.create(rollData, { defaultSkill: "summoning", defaultAbility: "intellect" });
        const rollOptions = await dialog();
        if (!rollOptions.rolled) return false;

        const result = await actor.useSkill(rollOptions);
        const cost = result.isSuccess
            ? summoningPoints
            : 1;
        actor.spendPoints("summoning", cost);
        return result;
    }
}