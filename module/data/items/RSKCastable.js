import { uiService } from "../../rsk-ui-service.js";
import RSKItemType from "./RSKItemType.js";

export default class RSKCastable extends RSKItemType {
    async canUse() {
        const canUseHandlers = {
            spell: () => this.usageCost.every(uc =>
                this.parent.actor.items.find(r => r.system.category === "rune"
                    && r.system.subCategory === uc.type
                    && r.system.quantity >= uc.amount)),
            summoning: () => this.usageCost.every(uc =>
                this.parent.actor.system.summoningPoints.value >= uc.amount),
            prayer: () => this.usageCost.every(uc =>
                this.parent.actor.system.prayerPoints.value >= uc.amount)
        }
        const can = canUseHandlers[this.category]();
        if (!can) {
            uiService.showNotification("RSK.NoCastablesAvailable");
        }
        return can;
    }

    async use() {
        if (!this.canUse()) return;

        const rollData = this._prepareRollData();
        const confirmRollResult = await uiService.showDialog("confirm-roll", rollData);
        if (!confirmRollResult.confirmed) return;

        const skillResult = await this.parent.actor.system.useSkill(confirmRollResult);
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
        this._handleUsageCost();
    }

    _prepareRollData() {
        return {
            ...this.parent.actor.system.getRollData(),
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
            outcomes: [...this.targetOutcomes],
            qualities: [...this.qualities]
        };
    }

    _handleUsageCost() {
        const costHandlers = {
            prayer: (success) => success
                ? this.parent.actor.system.spendPoints("prayerPoints", this.usageCost[0]?.amount ?? 0)
                : this.parent.actor.system.spendPoints("prayerPoints", 1),
            summoning: (success) => success
                ? this.parent.actor.system.spendPoints("summoningPoints", this.usageCost[0]?.amount ?? 0)
                : this.parent.actor.system.spendPoints("summoningPoints", 1),
            magic: (success) => success
                ? this.usageCost.forEach(uc => this.parent.actor.system.spendRunes(uc.type, uc.amount))
                : []
        }
        costHandlers[this.category]();
    }
}
