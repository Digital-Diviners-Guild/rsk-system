//todo: how are we going to handle defense rolls
// step one) I think we need to define a better action model in the chatlogs
// - this model needs to detail the outcomes
// - if the sender was an npc
// - if the target is a character
//  (some way to know its npc>character and a defense roll is needed)
// - what defense roll to make
// - what outcomes apply when
// (ie. on success defense roll, only damage is applied and its reduced by the defense roll margin)
// step two) make sure our actions are sending that model
// step three/zero) need to thing of the action pipeline from start to finish
// so we know what data we will want. 



// todo: I think we need to backpeddle on the individual operation configuration
// and just have a model for outcome, and it is applied as one thing.
// that will be easier for a lot of things.
const getDefenseRoll = async (target, actionType) => {
    if (!game?.rsk?.featureFlags?.characterDefenseTests) return 0;

    const checks = {
        melee: { skill: "defense", ability: "strength" },
        ranged: { skill: "defense", ability: "agility" }, // is this ranged skill?
        //todo: which of these do we need?
        magic: { skill: "magic", ability: "intellect" },
        spell: { skill: "magic", ability: "intellect" }
    }
    let defenseRollMargin = 0;
    const rollData = target.system.getRollData();
    const confirmRollResult = await uiService.showDialog("confirm-roll", rollData, checks[actionType]);
    if (confirmRollResult.confirmed) {
        const skillResult = await target.system.useSkill(confirmRollResult);
        defenseRollMargin = skillResult.margin;
        await skillResult.toMessage();
    }
    return defenseRollMargin;
}

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

const restoreLifePoints = (actor, context) => {
    actor.system.restoreLifePoints(context.amount);
}

const receiveDamage = async (actor, context) => {
    await actor.system.receiveDamage({ damageEntries: context.damage });
};

const operations = {
    restoreLifePoints,
    receiveDamage,
    addEffects,
    addStatuses,
    removeStatuses
};

export const applyOutcome = async (actionData) => {
    const isGM = game.user?.isGM;
    const targets = isGM
        ? [...game.user.targets.map(t => t.actor)]
        : [game.user.character];
    for (let target of targets) {
        await applyStateChanges(target, actionData.outcomes);
    }
}

export const applyStateChanges = async (actor, stateChanges) => {
    for (let stateChange of stateChanges) {
        const operationFunc = operations[stateChange.operation];
        if (operationFunc) {
            await operationFunc(actor, { ...stateChange.context });
        } else {
            console.error(`Unknown operation: ${stateChange.operation}`);
        }
    }
};