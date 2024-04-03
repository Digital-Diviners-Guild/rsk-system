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
import { uiService } from "./rsk-ui-service.js";
import RSKDice from "./rsk-dice.js";


const getDefenseRoll = async (target, actionType) => {
    if (!game?.rsk?.featureFlags?.characterDefenseTests) return 0;

    const checks = {
        melee: { defaultSkill: "defense", defaultAbility: "strength" },
        ranged: { defaultSkill: "defense", defaultAbility: "agility" }, // is this ranged skill?
        magic: { defaultSkill: "magic", defaultAbility: "intellect" },
    }
    let defenseRollMargin = 0;
    const rollData = target.system.getRollData();
    const confirmRollResult = await uiService.showDialog("confirm-roll", { ...rollData, ...checks[actionType] });
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

const removeEffects = async (actor, effectIds) => {
    if (actor.effects.some(e => effectIds.includes(e.id))) {
        await actor.deleteEmbeddedDocuments("ActiveEffect", [...effectIds]);
    }
};

const restoreLifePoints = (actor, amount) => {
    actor.system.restoreLifePoints(amount);
}

const receiveDamage = async (actor, damageEntries, attackType, puncture) => {
    let defense = 0;
    if (actor.type === "character") {
        defense = await getDefenseRoll(actor, attackType);
    }
    await actor.system.receiveDamage(damageEntries, attackType, defense, puncture);
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

export const applyOutcome = async (outcomeData) => {
    //todo: when its a player outcome that failed, don't allow apply
    //todo: specifics when player is attacked by npc
    const rollMargin = outcomeData.rollMargin;
    let outcome = foundry.utils.deepClone(outcomeData);
    if (outcome.triggersSpecialEffect) { // doesn't work for npc since we need a def check first.
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

    if (Object.keys(outcome.damageEntries).reduce((total, next) => { total += outcome.damageEntries[next] ?? 0; return total }, 0) > 0) {
        await receiveDamage(target, outcome.damageEntries, outcome.actionType, outcome.puncture);
    }
    if (outcome.restoresLifePoints > 0) {
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


//todo: signaling that an effect can be removed
//rather than which one to remove

class MeleeAttackAction {
    actionType = "melee";
    skillCheck;
    weapon;
}

class RangedAttackAction {
    actionType = "ranged";
    skillCheck;
    weapon;
    ammo;
}

class ThrownAttackAction {
    actionType = "ranged";
    skillCheck;
    weapon;
}

class CastAction {
    actionType = "summon|prayer|magic"
    skillCheck;
    castable;

    async execute(skillCheckResult) {
        //could change message on success/castable type too
        let result = skillCheckResult.isSuccess
            ? new ActionOutcome()
            : new ActionOutcome();

        const flavor = `<strong>${skillCheckResult.skill} | ${skillCheckResult.ability}</strong> TN: ${skillCheckResult.targetNumber}
        <p>${skillCheckResult.isCritical ? "<em>critical</em>" : ""} ${skillCheckResult.isSuccess ? "success" : "fail"} (${skillCheckResult.rollMargin})</p>`;
        //how would this work?
        //feels like this bit would get duplicated a bunch, but maybe thats ok since the flavor and success handling could vary
        await skillCheckResult.roll.toMessage({
            flavor: flavor,
            flags: {
                rsk: {
                    ...skillCheckResult,
                    ...result
                }
            }
        });
    }
}

class ActionOutcome {
    name;
    description;
    attackType; // "magic, ranged, melee"
    damageEntries;
    specialEffect;
    statusesAdded;
    statusesRemoved;
    effectsAdded;
    effectsRemoved;
}
class SkillCheck {
    /*
        would something like this ever be useful?
        
        const myActorsSkillChecks = SkillCheck.useActor(myActor);
        await myActorsSkillChecks('attack', 'strength').execute();
        await myActorsSkillChecks('magic', 'intellect').execute();
    */
    static useActor = (actor) => (skill, ability) => new SkillCheck(actor, skill, ability);

    constructor(actor, skill, ability) {
        this.actor = actor;
        this.skill = skill;
        this.ability = ability;
        this.skillLevel = actor.system.skills[skill].level + actor.system.skills[skill].modifier;
        this.abilityLevel = actor.system.abilities[ability].level + actor.system.abilities[ability].modifier;
        this.targetNumber = this.skillLevel + this.abilityLevel;
    }

    async execute(advantageDisadvantage = "normal", targetNumberModifier = 0) {
        const roll = await RSKDice.createRoll(advantageDisadvantage);
        const rollResult = await roll.evaluate();
        const rollTotal = rollResult.result;
        const targetNumber = this.targetNumber + targetNumberModifier;
        const rollMargin = targetNumber - rollTotal;
        const isSuccess = rollMargin >= 0;
        const isCritical = rollResult.results.every(v => v.result === results[0].result);
        return new SkillCheckResult(
            this.skill,
            this.ability,
            targetNumber,
            roll,
            rollTotal,
            rollMargin,
            isSuccess,
            isCritical);
    }
}

class SkillCheckResult {
    constructor(skill, ability, targetNumber, roll, rollTotal, rollMargin, isSuccess, isCritical) {
        this.skill = skill;
        this.ability = ability;
        this.targetNumber = targetNumber;
        this.roll = roll;
        this.rollTotal = rollTotal;
        this.rollMargin = rollMargin;
        this.isSuccess = isSuccess;
        this.isCritical = isCritical;
    }
}

//this would proabably be a 'datamodel' that users can manage.
class SpecialEffect {
    effectType = "auto|prompt"; //?? do we need something like this? it could be a generic prompt asking for x and y
    // used would be like 'block' and we could show an extra usage button in the inventory for items with usage effects
    // always would be like 'heavy' which forces it to tke an extra slot both in inv and equipped
    appliesWhen = "action|equipped|used|always";
    triggerMargin = 1;
    changes = [{}]; // the changes to make the effect with
    duration = ""; // duration in turns for the effect

    // special effects are mostly 'statuses' that trigger at certain times
    // but not always
    // sometimes they need to trigger the actor to make a decision (like how much damage would you like to convert to soak next turn)
    // do we need any of these properties instead of or in addition to 'changes'?
    // if a special effect is just applying a status, then it would be good to have 'statusesAdded'
    damageEntries;
    statusesAdded;
    statusesRemoved;
    effectsAdded;
    effectsRemoved;
}


//ACTION OUTCOMES - in 'use' and 'applyOutcome'
// when a special effect can be applied through an attack action
// - attack->npc
//  - succeeds by >= 1
//  - adds to the outcome
// - attack->char
//  - defense check fails by >= 1
//    - attacking special effects apply
//      - adds to the outcome
//  - defense check succeeds by >= 1
//    - armour special effects apply
//      - adds to the outcome

// ITEM EFFECTS - ON EQUIP - in 'equip'
// when a special effect can be applied by equipping an item
// - equipped, changes should apply
// - unequipped, changes should be removed

// ITEM EFFECTS - ON USE - in 'use'
// when a special effect can be used as an action
// - on use, changes are applied for duration

// ITEM EFFECTS - ALWAYS - on item update?
// for example 'heavy'
// the effect should always ensure that the bulk is 2 so it takes an extra slot
// both on equip and stowed