import RSKConfirmRollDialog from "./applications/RSKConfirmRollDialog.js";

export class RSKCastSpellAction {
    static create(id, label, actionData) {
        return new this(id, label, actionData);
    }

    constructor(id, label, actionData) {
        this.id = id;
        this.label = label;
        this.actionData = actionData;
        this.actionType = "magic";
    }

    async use(actor) {
        if (!this.canCast(actor)) return;

        const result = await useAction(actor, "magic", "intellect");
        if (!result) return;

        for (const cost of this.actionData.usageCost) {
            actor.spendRunes(cost.type, cost.amount);
        }
        await sendChat(this.label, this.actionType, this.actionData, result);
        return result;
    }

    canCast(actor) {
        if (this.actionData.usageCost.length < 1) return true;
        for (const cost of this.actionData.usageCost) {
            const runes = actor.items.find(i => i.type === "rune" && i.system.type === cost.type);
            if (!runes || runes.system.quantity < cost.amount) return false;
        }
        return true;
    }
}

export class RSKSummonFamiliarAction {
    static create(id, label, actionData) {
        return new this(id, label, actionData);
    }

    constructor(id, label, actionData) {
        this.id = id;
        this.label = label;
        this.actionData = actionData;
        this.actionType = "summoning";
    }

    async use(actor) {
        const cost = this.actionData.usageCost[0]?.amount ?? 0;
        if (!this.canSummon(actor, cost)) return;

        const result = await useAction(actor, "summoning", "intellect");
        if (!result) return;

        const summoningPointsUsed = result.isSuccess
            ? cost
            : 1;
        actor.spendPoints("summoning", summoningPointsUsed);
        await sendChat(this.label, this.actionType, this.actionData, result);
        return result;
    }

    canSummon(actor, summoningPoints) {
        return actor.system.summoningPoints.value >= summoningPoints;
    }
}

export class RSKPrayAction {
    static create(id, label, actionData) {
        return new this(id, label, actionData);
    }

    constructor(id, label, actionData) {
        this.id = id;
        this.label = label;
        this.actionData = actionData;
        this.actionType = "prayer";
    }

    async use(actor) {
        const cost = this.actionData.usageCost[0]?.amount ?? 0;
        if (!this.canPray(actor, cost)) return;

        const result = await useAction(actor, "prayer", "intellect");
        if (!result) return;

        const prayerPointsUsed = result.isSuccess
            ? cost
            : 1;
        actor.spendPoints("prayer", prayerPointsUsed);
        await sendChat(this.label, this.actionType, this.actionData, result);
        return result;
    }

    canPray(actor, prayerPoints) {
        return actor.system.prayerPoints.value >= prayerPoints;
    }
}

const useAction = async (actor, skill, ability) => {
    const rollData = actor.getRollData();
    const dialog = RSKConfirmRollDialog.create(rollData, { defaultSkill: skill, defaultAbility: ability });
    const rollResult = await dialog();
    if (!rollResult.rolled) return false;

    const actionResult = await actor.useSkill(rollResult);
    return actionResult;
}

const sendChat = async (label, actionType, actionData, result) => {
    const flavor = await renderTemplate("systems/rsk/templates/applications/item-message.hbs",
        {
            label,
            ...actionData,
            ...result,
            showRollResult: true,
        });
    await result.rollResult.toMessage({
        flavor: flavor,
        flags: {
            rsk: {
                actionType: actionType,
                actionData: { ...actionData }
            }
        }
    });
}
