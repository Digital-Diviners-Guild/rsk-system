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
        if (actor.type === "npc") return;
        if (!this.canCast(actor)) return;

        const result = await this.useSpell(actor);
        if (!result) return;
        // do we want an action template where the action can add to the label and description
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
    }

    canCast(actor) {
        if (this.actionData.usageCost.length < 1) return true;
        for (const cost of this.actionData.usageCost) {
            const runes = actor.items.find(i => i.type === "rune" && i.system.type === cost.type);
            if (!runes || runes.system.quantity < cost.amount) return false;
        }
        return true;
    }

    async useSpell(actor) {
        const rollData = actor.getRollData();
        const dialog = RSKConfirmRollDialog.create(rollData, { defaultSkill: "magic", defaultAbility: "intellect" });
        const rollOptions = await dialog();
        if (!rollOptions.rolled) return false;

        const result = await actor.useSkill(rollOptions);
        if (result.isSuccess) {
            for (const cost of this.actionData.usageCost) {
                actor.spendRunes(cost.type, cost.amount);
            }
        }
        return result;
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

// async function useAction(actor, action) {
//     switch (action.type) {
//         case "prayer":
//             return await pray(actor, action);
//         case "magic":
//             return await cast(actor, action);
//         case "ranged":
//             return await rangedAttack(actor, action);
//         case "melee":
//             return await meleeAttack(actor, action);
//         default:
//             throw `Unknown action type: ${action.type}`;
//     }
// }

// async function pray(actor, action) {
// }

// async function cast(actor, action) {
// }

// async function meleeAttack(actor, action) {
// }

// async function rangedAttack(actor, action) {
// }
