import { uiService } from "../../rsk-ui-service.js";
import RSKItemType from "./RSKItemType.js";

export default class RSKCastable extends RSKItemType {
    async canUse(actor) {
        const canUseHandlers = {
            spell: () => this.usageCost.every(uc =>
                actor.items.find(r => r.system.category === "rune"
                    && r.system.subCategory === uc.type
                    && r.system.quantity >= uc.amount)),
            summoning: () => this.usageCost.every(uc =>
                actor.system.summoningPoints.value >= uc.amount),
            prayer: () => this.usageCost.every(uc =>
                actor.system.prayerPoints.value >= uc.amount)
        }
        return canUseHandlers[this.category]();
    }

    async use(actor) {
        if (!this.canUse(actor)) return;

        const rollData = this._prepareRollData(actor);
        const confirmRollResult = await uiService.showDialog("confirm-roll", rollData);
        if (!confirmRollResult.confirmed) return;

        const skillResult = await actor.system.useSkill(confirmRollResult);
        const actionOutcome = this._prepareOutcomeData();
        const flavor = await renderTemplate("systems/rsk/templates/applications/action-message.hbs",
            {
                ...skillResult,
                ...actionOutcome
            });
        await skillResult.toMessage({
            flavor: flavor,
            flags: {
                rsk: {
                    ...skillResult,
                    ...actionOutcome
                }
            }
        });
        this._handleUsageCost(actor);
    }

    _prepareRollData(actor) {
        return {
            ...actor.system.getRollData(),
            targetNumberModifier: this.targetNumberModifier,
            //todo: localization?
            skill: { "spell": "magic", "prayer": "prayer", "summoning": "summoning" }[this.category],
            ability: "intellect"
        };
    }

    _prepareOutcomeData() {
        return {
            name: this.parent.name,
            description: this.effectDescription,
            actionType: this.category,
            img: this.parent.img,
            outcome: { ...this.targetOutcomes },
            specialEffect: [...this.specialEffect]
        };
    }

    _handleUsageCost(actor) {
        const costHandlers = {
            prayer: (success) => success
                ? actor.system.spendPoints("prayerPoints", this.usageCost[0]?.amount ?? 0)
                : actor.system.spendPoints("prayerPoints", 1),
            summoning: (success) => success
                ? actor.system.spendPoints("summoningPoints", this.usageCost[0]?.amount ?? 0)
                : actor.system.spendPoints("summoningPoints", 1),
            magic: (success) => success
                ? this.usageCost.forEach(uc => actor.system.spendRunes(uc.type, uc.amount))
                : []
        }
        costHandlers[this.category]();
    }
}
