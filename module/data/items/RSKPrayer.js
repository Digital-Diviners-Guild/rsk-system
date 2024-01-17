import RSKConfirmRollDialog from "../../applications/RSKConfirmRollDialog.js";
import RSKAction from "./RSKAction.js";
import { fields } from "../fields.js";

//i'm wondering if we just want these datamodels to be their own data types
//and have the use function in another service rather than in the datamodels
// basically, a more functional command pattern, rather than inheritance.
// plus it keeps these models just data and use case specific
export default class RSKPrayer extends RSKAction {
    static defineSchema() {
        return {
            ...RSKAction.defineSchema(),
            statuses: new fields.ArrayField(new fields.StringField()),
        }
    }

    prepareBaseData() {
        this.type = "prayer";
    }

    async use(actor) {
        if (actor.type === "npc") return;

        const cost = this.usageCost[0]?.amount ?? 0;
        if (!this.canPray(actor, cost)) return;

        const result = await this.usePrayer(actor, cost);
        if (!result) return;

        const flavor = await renderTemplate("systems/rsk/templates/applications/item-message.hbs",
            {
                ...this,
                showRollResult: true,
                ...result
            });
        await result.rollResult.toMessage({
            flavor: flavor,
            flags: {
                rsk: {
                    outcome: {
                        actorId: actor._id,
                        type: "prayer",
                        action: this.toObject(),
                        result: result
                    }
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