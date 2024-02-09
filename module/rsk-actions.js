import RSKApplyDamageDialog from "./applications/RSKApplyDamageDialog.js";
import RSKConfirmRollDialog from "./applications/RSKConfirmRollDialog.js";
import RSKItemSelectionDialog from "./applications/RSKItemSelectionDialog.js";
import { getTargets } from "./rsk-targetting.js";

// TODO: new action functions need refactoring.
// probably strategy pattern? pass in the correct operation for the situation?

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

const hasPoints = (actor, cost) => {
    const points = actor.system[cost.type];
    return points && points.value >= cost.amount;
}
const hasRunes = (actor, cost) => {
    const runes = actor.items.find(i => i.type === "rune" && i.system.type === cost.type);
    return runes || runes.system.quantity < cost.amount
}
const canCast = (usageCost) => {
    return usageCost.every(uc => castType === "magic"
        ? hasRunes(actor, uc)
        : hasPoints(actor, uc));
}
export const castAction = async (actor, castType) => {
    const castableType = castType === "magic" ? "spell" : castType; //bleh
    const castables = actor.items
        .filter(i => i.type === castableType)
        .filter(s => canCast(s.system.usageCost));
    if (castables.length < 1) return false;

    const selectCastable = RSKItemSelectionDialog.create({ items: castables });
    const selectCastableResult = await selectCastable();
    if (!(selectCastableResult && selectCastableResult.confirmed)) return false;

    const castable = actor.items.find(x => x._id === selectCastableResult.id);
    const actionResult = await useAction(actor, castType, "intellect");
    if (actionResult.isSuccess) {
        for (const cost of castable.system.usageCost) {
            if (castType === "magic") {
                actor.system.spendRunes(cost.type, cost.amount);
            } else {
                actor.system.spendPoints(castType, cost.amount);
            }
        }
    } else if (castType !== "magic" && !actionResult.isSuccess) {
        actor.system.spendPoints(castType, 1);
    }
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