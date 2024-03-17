//POC: todo: integrate in new model when we update npc attack.  that is really the 
// only time it is needed, when a character is receving an outcome from an npc
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

const spendResource = async (actor, context) => {
    switch (context.type) {
        case 'prayerPoints':
        case 'summoningPoints':
            actor.system.spendPoints(context.type, context.amount);
            break;
        default:
            actor.system.spendRunes(context.type, context.amount);
            break;
    }
};

const operations = {
    restoreLifePoints,
    receiveDamage,
    spendResource, // is this and receiveDamage the same? we want to split out the calculate damage and if so, then lifePoints is just a resource
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