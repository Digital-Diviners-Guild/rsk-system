import RSKConfirmRollDialog from "../../applications/RSKConfirmRollDialog.js";
import RSKAction from "./RSKAction.js";
import { fields } from "../fields.js";

//todo: refactor - literally the same thing as prayer, sub summoning for prayer
export default class RSKSummonFamiliar extends RSKAction {
    static defineSchema() {
        return {
            ...RSKAction.defineSchema(),
            statuses: new fields.ArrayField(new fields.StringField()),
        }
    }

    prepareBaseData() {
        this.type = "summonFamiliar";
    }

    async use(actor) {
        if (actor.type === "npc") return;

        const cost = this.usageCost[0]?.amount ?? 0;
        if (!this.canSummon(actor, cost)) return;

        const result = await this.summonFamiliar(actor, cost);
        if (!result) return;

        const flavor = await renderTemplate("systems/rsk/templates/applications/item-message.hbs",
            {
                ...this,
                showRollResult: true,
                ...result
            });
        await result.rollResult.toMessage({ flavor: flavor });
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