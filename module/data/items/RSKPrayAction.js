import RSKConfirmRollDialog from "../../applications/RSKConfirmRollDialog.js";
import { fields } from "../fields.js";

// we could utilize datamodels so we can benefit from foundry life cycles
//  but not include in our systems types that users can create an manage by excluding it from the manifest.
export default class RSKPrayAction extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        return {
            id: new fields.StringField(),
            label: new fields.StringField(),
            actionType: new fields.StringField({ initial: "prayer" }),
            actionData: new fields.ObjectField()
        };
    }

    async use(actor) {
        if (actor.type === "npc") return;

        const cost = this.actionData.usageCost[0]?.amount ?? 0;
        if (!this.canPray(actor, cost)) return;

        const result = await this.usePrayer(actor, cost);
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

    canPray(actor, prayerPoints) {
        return actor.system.prayerPoints.value >= prayerPoints;
    }

    async usePrayer(actor, prayerPoints) {
        const rollData = actor.getRollData();
        const dialog = RSKConfirmRollDialog.create(rollData, { defaultSkill: "prayer", defaultAbility: "intellect" });
        const rollOptions = await dialog();
        if (!rollOptions.rolled) return false;

        const result = await actor.useSkill(rollOptions);
        const cost = result.isSuccess
            ? prayerPoints
            : 1;
        actor.spendPoints("prayer", cost);
        return result;
    }
}
