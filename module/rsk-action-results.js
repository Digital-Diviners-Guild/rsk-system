import { rskPrayerStatusEffects, statusToEffect } from "./effects/statuses.js";
import { uiService } from "./rsk-ui-service.js";

const addLifePoints = (actor, lifePointsAdded) => {
    actor.system.restoreLifePoints(lifePointsAdded);
}

const removeItem = (actor, itemUuid) => {
    const item = fromUuidSync(itemUuid);
    if (item) { actor.system.removeItem(item); }
};

const spendResource = (actor, resourceType, amount) => {
    switch (resourceType) {
        case 'prayer':
        case 'summoning':
            actor.system.spendPoints(resourceType, amount);
            break;
        default:
            actor.system.spendRunes(resourceType, amount);
            break;
    }
};

const addStatuses = async (actor, statuses) => {
    const addedStatusEffects = statuses.map(s => statusToEffect(
        CONFIG.statusEffects.find(se => se.id === s)));
    await addEffects(actor, addedStatusEffects);
}

const addEffects = async (actor, effects) => {
    await actor.createEmbeddedDocuments("ActiveEffect", [...effects]);
};

const removeStatuses = async (actor, statuses) => {
    const effectIds = actor.effects.filter(e =>
        e.statuses.some(s => statuses.includes(s)))
        .map(e => e._id);
    await removeEffects(actor, effectIds);
};

const removeEffects = async (actor, effectIds) => {
    if (actor.effects.some(e => effectIds.includes(e.id))) {
        await actor.deleteEmbeddedDocuments("ActiveEffect", [...effectIds]);
    }
};

const receiveDamage = async (actor, actionData) => {
    await actor.system.receiveDamage(actionData);
};

const operations = {
    removeItem,
    spendResource,
    addLifePoints,
    addEffects,
    addStatuses,
    removeStatuses,
    removeEffects,
    receiveDamage,
};

export const applyStateChanges = async (actor, stateChanges) => {
    for (let stateChange of stateChanges) {
        const operationFunc = operations[stateChange.operation];
        if (operationFunc) {
            await operationFunc(actor, ...stateChange.params);
        } else {
            console.error(`Unknown operation: ${stateChange.operation}`);
        }
    }
};

//POC
const getDefenseRoll = async (target, skill, ability) => {
    if (!game?.rsk?.featureFlags?.characterDefenseTests) return 0;

    let defenseRollMargin = 0;
    if (target.type === "character") {
        const rollData = target.system.getRollData();
        const confirmRollResult = await uiService.showDialog("confirm-roll",
            rollData, { defaultSkill: skill, defaultAbility: ability });
        if (confirmRollResult.confirmed) {
            const skillResult = await target.system.useSkill(confirmRollResult);
            defenseRollMargin = skillResult.margin;
            defenseRollMargin = skillResult.margin;
            await skillResult.toMessage();
        }
    }
    return defenseRollMargin;
}

//todo: (WIP) apply margin so we can skip dialog.
// this will come from outcome margin if a character is attacking
// this will come from a defense roll dictated by the outcome 
// if an npc is attacking a character
const outcomeHandlers = {
    // todo: will we need these handlers moving forward?
    //perhaps... how else could we enforce one prayer with the new direction?
    prayer: async (target, outcome) => {
        const activePrayers = target.effects.filter(e =>
            e.statuses.some(s => rskPrayerStatusEffects.map(se => se.id).includes(s)))
            .map(e => e._id);
        return [{
            operation: "removeEffects", params: [activePrayers]
        }, ...outcome.targetStateChanges]
    },
    summoning: async (target, outcome) => {
        //todo: add summoned token to the board
        return [];
    },
    // const { puncture, damageEntries, attackType, defenseRoll } = { ...damage };
    melee: async (target, outcome) => {
        const defenseRollMargin = await getDefenseRoll(target, "defense", "strength");
        const result = await uiService.showDialog("apply-damage", outcome, { defenseRoll: defenseRollMargin });
        const test = outcome.map(x => x.context.damage)[0];
        return result && result.confirmed
            ? [{
                operation: "receiveDamage", params: [
                    {
                        puncture: result.puncture,
                        damageEntries: test,
                        attackType: "melee",
                        defenseRoll: defenseRollMargin
                    }]
            }]
            : [];
    },
    magic: async (target, outcome) => {
        const defenseRollMargin = await getDefenseRoll(target, "magic", "intellect");
        const result = await uiService.showDialog("apply-damage", outcome, { defenseRoll: defenseRollMargin });
        return result && result.confirmed
            ? [{ operation: "receiveDamage", params: [{ ...result }] }]
            : []
    },
    ranged: async (target, outcome) => {
        const defenseRollMargin = await getDefenseRoll(target, "ranged", "agility");
        const result = await uiService.showDialog("apply-damage", outcome, { defenseRoll: defenseRollMargin });
        return result && result.confirmed
            ? [{ operation: "receiveDamage", params: [{ ...result }] }]
            : []
    }
};
export const applyOutcome = async (targets, actionResult) => {
    const outcomeHandler = outcomeHandlers[actionResult.actionType]
    for (let target of targets) {
        let stateChanges = actionResult.actionData.targetOutcomes;
        if (outcomeHandler) {
            stateChanges = await outcomeHandler(target, actionResult.actionData.targetOutcomes);
        }
        await applyStateChanges(target, stateChanges);
    }
}