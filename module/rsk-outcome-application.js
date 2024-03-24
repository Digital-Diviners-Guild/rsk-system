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

import { statusToEffect } from "./effects/statuses.js";
import { getSpecialEffectHandler } from "./effects/specialEffect.js";



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
        CONFIG.statusEffects.find(se => se.id === s.name), s.duration, s.flags));
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

const restoreLifePoints = (actor, amount) => {
    actor.system.restoreLifePoints(amount);
}

const receiveDamage = async (actor, damageEntries) => {
    await actor.system.receiveDamage({ damageEntries });
};

const operations = {
    restoreLifePoints,
    receiveDamage,
    addEffects,
    addStatuses,
    removeStatuses
};

//todo: things we need to know:
// is an npc attacking a character? (or in otherwords: do we need  def check?)
// - did the fail check and there are npc special effects to apply? - augment outcome with special effects
// is the players action triggering a special effect? (had one and margin > threshold)
// - is the special effect something that needs input? ie rejuvination?
// - augment outcome with special effects
// what about usage special effects, like block?
//types of effects? - on usage, on equip, on success

export const applyOutcome = async (actionData) => {
    const isGM = game.user?.isGM;
    const targets = isGM
        ? [...game.user.targets.map(t => t.actor)]
        : [game.user.character];
    for (let target of targets) {
        if (actionData.outcome.damageEntries) {
            await receiveDamage(target, actionData.outcome.damageEntries);
        }
        if (actionData.outcome.restoresLifePoints) {
            await restoreLifePoints(target, actionData.outcome.restoresLifePoints);
        }
        if (actionData.outcome.effectsAdded?.length > 0) {
            await addEffects(target, actionData.outcome.effectsAdded);
        }
        if (actionData.outcome.statusesAdded?.length > 0) {
            await addStatuses(target, actionData.outcome.statusesAdded);
        }
        if (actionData.outcome.statusesRemoved?.length > 0) {
            await removeStatuses(target, actionData.outcome.statusesRemoved);
        }
    }
}

export const applyOutcome2 = async (outcomeData) => {
    const rollMargin = outcomeData.rollMargin;
    let outcome = foundry.utils.deepClone(outcomeData);
    if (rollMargin > 0) {
        for (let spfx of outcome.specialEffect) {
            const handler = getSpecialEffectHandler(spfx.name);
            outcome = await handler(outcome, spfx.x, spfx.y);
        }
    }
    if (rollMargin > 1) {
        const bonusDamage = rollMargin - 1;
        const damageKey = Object.keys(outcome.targetOutcome.damageEntries).find((k) => outcome.targetOutcome.damageEntries[k] > 0);
        if (damageKey) {
            outcome.targetOutcome.damageEntries[damageKey] += bonusDamage;
        }
    }

    const isGM = game.user?.isGM;
    const targets = isGM
        ? [...game.user.targets.map(t => t.actor)]
        : [game.user.character];
    for (let target of targets) {
        await apply(target, outcome.targetOutcome);
    }

    const actor = fromUuidSync(outcome.actorUuid);
    await apply(actor, outcome.actorOutcome);
}

const apply = async (target, outcome) => {
    if (!target) return;

    if (outcome.damageEntries) {
        await receiveDamage(target, outcome.damageEntries);
    }
    if (outcome.restoresLifePoints) {
        await restoreLifePoints(target, outcome.restoresLifePoints);
    }
    if (outcome.effectsAdded?.length > 0) {
        await addEffects(target, outcome.effectsAdded);
    }
    if (outcome.statusesAdded?.length > 0) {
        await addStatuses(target, outcome.statusesAdded);
    }
    if (outcome.statusesRemoved?.length > 0) {
        await removeStatuses(target, outcome.statusesRemoved);
    }
}