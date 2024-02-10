import { uiService } from "./rsk-ui-service.js";

const removeItem = (actor, item) => actor.system.removeItem(item);

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

const addEffects = async (actor, effects) => {
    await actor.createEmbeddedDocuments("ActiveEffect", [...effects]);
};

const removeEffects = async (actor, effectIds) => {
    await actor.deleteEmbeddedDocuments("ActiveEffect", [...effectIds]);
};

const receiveDamage = async (actor, attackData) => {
    await actor.system.receiveDamage(attackData);
};

const operations = {
    removeItem,
    spendResource,
    addEffects,
    removeEffects,
    receiveDamage
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

//todo: apply margin so we can skip dialog.
// this will come from outcome margin if a character is attacking
// this will come from a defense roll dictated by the outcome 
// if an npc is attacking a character
const outcomeHandlers = {
    prayer: async (target, outcome) => {
        const activePrayers = target.effects
            .filter(e => e.statuses
                .filter(s => rskPrayerStatusEffects.map(se => se.id)
                    .includes(s)))
            .map(ap => ap._id);
        return [{
            operation: "removeEffects", params: [activePrayers]
        }, ...outcome.targetStateChanges]
    },
    //these will probably start to differ
    melee: async (target, outcome) => {
        const result = await uiService.showDialog("apply-damage", { context: outcome });
        return result && result.confirmed
            ? [{ operation: "receiveDamage", params: [{ ...result }] }]
            : []
    },
    magic: async (target, outcome) => {
        const result = await uiService.showDialog("apply-damage", { context: outcome });
        return result && result.confirmed
            ? [{ operation: "receiveDamage", params: [{ ...result }] }]
            : []
    },
    ranged: async (target, outcome) => {
        const result = await uiService.showDialog("apply-damage", { context: outcome });
        return result && result.confirmed
            ? [{ operation: "receiveDamage", params: [{ ...result }] }]
            : []
    }
};
export const applyOutcome = async (targets, actionResult) => {
    const outcomeHandler = outcomeHandlers[actionResult.actionType]
    for (let target of targets) {
        let stateChanges = await outcomeHandler(target, actionResult);
        await applyStateChanges(target, stateChanges);
    }
}