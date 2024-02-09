import RSKApplyDamageDialog from "./applications/RSKApplyDamageDialog.js";
import RSKConfirmRollDialog from "./applications/RSKConfirmRollDialog.js";
import RSKItemSelectionDialog from "./applications/RSKItemSelectionDialog.js";
import { getTargets } from "./rsk-targetting.js";

export const npcAction = async (actor, action) => {
    const actionData = { ...action.system };
    const content = await renderTemplate("systems/rsk/templates/applications/action-message.hbs",
        {
            name: action.name,
            actionData,
            hideRollResults: true
        });
    const targetUuids = getTargets(actor);
    await ChatMessage.create({
        content: content,
        flags: {
            rsk: {
                targetUuids: targetUuids,
                actionType: actionData.type,
                actionData
            }
        }
    });
}

export const attackAction = async (actor, weapon) => {
    const action = weapon.system.attackType === "melee"
        ? meleeAttackAction(actor, weapon)
        : rangedAttackAction(actor, weapon);
    const result = await action;
    if (!result) return;
    await chatResult(result);
}

const getAbility = (weapon) => weapon.system.type === "martial" ? "agility" : "strength";

const meleeAttackAction = async (actor, weapon) => {
    //todo: message that you can't do that (maybe a toast notification alert thing?)
    if (weapon.system.weaponType !== "simple" && actor.system.skills["attack"] < 5) return false;
    const actionResult = await useAction(actor, "attack", getAbility(weapon));
    if (!actionResult) return false;
    return { name: weapon.name, attackData: weapon.system, actionType: "melee", ...actionResult };
}

const rangedAttackAction = async (actor, weapon) => {
    //todo: message that you can't do that (maybe a toast notification alert thing?)
    const ammo = weapon.system.isThrown
        ? weapon
        : actor.system.getActiveItems().find(i =>
            i.type === "weapon"
            && i.system.isAmmo
            && i.system.ammoType === weapon.system.ammoType);
    if (!ammo || ammo.quantity < 1) return false;

    //todo: message that you can't do that (maybe a toast notification alert thing?)
    if (weapon.system.weaponType !== "simple" && actor.system.skills["ranged"] < 5) return;
    const actionResult = await useAction(actor, "ranged", getAbility(weapon));
    if (!actionResult) return false;

    actor.system.removeItem(ammo);
    //todo: need to improve the output of ranged attacks
    // need to define an actual outcome class really
    const rangedAttackOutcome = weapon.system.isThrown
        ? {
            name: weapon.name,
            attackData: { ...weapon.system }
        }
        : {
            name: `${weapon.name} + ${ammo.name}`,
            attackData: {
                description: `${weapon.system.description}\n${ammo.system.description}`,
                effectDescription: `${weapon.system.effectDescription}\n${ammo.system.effectDescription}`,
                damageEntries: weapon.system.damageEntries,
                specialEffects: ammo.system.specialEffects
            }
        };
    return { ...rangedAttackOutcome, actionType: "ranged", ...actionResult };
}

// todo: explore if this could be a macro handler we drag and drop onto the hotbar
// - it may be a bit much to include spell/summon/prayer together.  but the general usage idea is very similar
// - this might get clarified when handling outcomes
const prayerHandler = {
    getCastables: (actor) => actor.items
        .filter(i => i.type === "prayer"
            && actor.system.prayerPoints.value >= i.system.usageCost[0].amount),
    handleCost: (actor, isSuccess, cost) => actor.system.spendPoints("prayer", isSuccess ? cost[0].amount : 1)
};
const summoningHandler = {
    getCastables: (actor) => actor.items.filter(i => i.type === "summoning" &&
        actor.system.prayerPoints.value >= i.system.usageCost[0].amount),
    handleCost: (actor, isSuccess, cost) => actor.system.spendPoints("summoning", isSuccess ? cost[0].amount : 1)
};
const magicHandler = {
    getCastables: (actor) => actor.items.filter(s => s.type === "spell"
        && s.system.usageCost.every(uc => actor.items.find(r => r.type === "rune"
            && r.system.type === uc.type
            && r.system.quantity >= uc.amount))),
    handleCost: (actor, isSuccess, cost) => {
        if (isSuccess) {
            cost.forEach(c => actor.system.spendRunes(c.type, c.amount));
        }
    }
};
export const castHandlers = {
    magic: magicHandler,
    summoning: summoningHandler,
    prayer: prayerHandler
};
export const castAction = async (actor, castType) => {
    const castHandler = castHandlers[castType];
    const castables = castHandler.getCastables(actor);
    if (castables.length < 1) return false;

    const selectCastable = RSKItemSelectionDialog.create({ items: castables });
    const selectCastableResult = await selectCastable();
    if (!(selectCastableResult && selectCastableResult.confirmed)) return false;

    const castable = actor.items.find(x => x._id === selectCastableResult.id);
    const actionResult = await useAction(actor, castType, "intellect");
    if (!actionResult) return;

    castHandler.handleCost(actor, actionResult.isSuccess, castable.system.usageCost)
    await chatResult({
        name: castable.name, actionType: castType, actionData: castable.system, ...actionResult
    });
    return actionResult;
}

export const dealsDamage = (data) => data.damageEntries
    && Object.values(data.damageEntries)
        .filter(x => x > 0).length > 0

//todo: apply margin so we can skip dialog.
// this will come from outcome margin if a character is attacking
// this will come from a defense roll dictated by the outcome 
// if an npc is attacking a character
// note: this applyOutcome is only for combat - in non combat margin success is a little different.
export const applyOutcome = async (targets, outcome) => {
    for (let target of targets) {
        const dialog = RSKApplyDamageDialog.create(outcome);
        const result = await dialog();
        if (!result?.confirmed) return;
        await target.system.receiveDamage({ ...result });
    }
}

const useAction = async (actor, skill, ability) => {
    const rollData = actor.system.getRollData();
    const dialog = RSKConfirmRollDialog.create(rollData, { defaultSkill: skill, defaultAbility: ability });
    const rollResult = await dialog();
    if (!rollResult.rolled) return false;

    const skillResult = await actor.system.useSkill(rollResult);
    const targetUuids = getTargets(actor);
    return { ...skillResult, targetUuids }
}

const chatResult = async (actionResult) => {
    const flavor = await renderTemplate("systems/rsk/templates/applications/action-message.hbs",
        {
            ...actionResult
        });
    await actionResult.rollResult.toMessage({
        flavor: flavor,
        flags: {
            rsk: {
                ...actionResult
            }
        }
    });
}