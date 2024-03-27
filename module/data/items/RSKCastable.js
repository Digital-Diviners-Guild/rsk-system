import RSKItemType from "./RSKItemType.js";

export default class RSKCastable extends RSKItemType {
    canUse(actor) {
        const canUseHandlers = {
            magic: () => this.usageCost.every(uc =>
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

    _prepareRollData(actor) {
        return {
            ...actor.system.getRollData(),
            //targetNumberModifier: this.targetNumberModifier, //this is only for crafting
            //todo: localization?
            defaultSkill: this.category,
            defaultAbility: "intellect"
        };
    }

    _prepareOutcomeData(actor) {
        return {
            actorUuid: actor.uuid,
            name: this.parent.name,
            description: this.effectDescription,
            actionType: this.category,
            img: this.parent.img,
            targetOutcome: { ...this.targetOutcome },
            actorOutcome: { ...this.usageOutcome },
            specialEffect: [...this.specialEffect]
        };
    }

    _handleItemUsed(actor, skillResult) {
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
        costHandlers[this.category](skillResult.isSuccess);
    }
}
