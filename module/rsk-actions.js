import { localizeText } from "./rsk-localize.js";
import { getTargets } from "./rsk-targetting.js";
import { uiService } from "./rsk-ui-service.js";


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

//todo: 
const applyStateChanges = (actor, stateChanges) => {
    if (stateChanges.removeItem) {
        actor.system.removeItem(stateChanges.removeItem);
    }
}
export const attackAction = async (actor, weapon) => {
    let result;
    if (weapon.system.isMelee) {
        result = await meleeAttackAction(actor, weapon)
    } else {
        result = await rangedAttackAction(actor, weapon)
    }
    if (!result) return;

    if (result.error) {
        ui.notifications.warn(localizeText(result.error));
        return;
    }
    if (result.stateChanges) {
        applyStateChanges(actor, result.stateChanges);
    }
    await chatResult(result);
}

const getAbility = (weapon) => weapon.system.type === "martial" ? "agility" : "strength";

const meleeAttackAction = async (actor, weapon) => {
    if (weapon.system.weaponType !== "simple" && actor.system.skills["attack"].level < 5) {
        return { error: "RSK.AttackLevelTooLow" };
    };
    const actionResult = await useAction(actor, "attack", getAbility(weapon));
    if (!actionResult) return false;
    return {
        name: weapon.name,
        actionType: "melee",
        ...actionResult,
        attackData: weapon.system,
    };
}

const rangedAttackAction = async (actor, weapon) => {
    const ammo = weapon.system.isThrown
        ? weapon
        : actor.system.getActiveItems().find(i =>
            i.type === "weapon"
            && i.system.isAmmo
            && i.system.ammoType === weapon.system.ammoType);
    if (!ammo || ammo.quantity < 1) {
        return { error: "RSK.NoAmmoAvailable" };
    };
    if (weapon.system.weaponType !== "simple" && actor.system.skills["ranged"].level < 5) {
        return { error: "RSK.RangedLevelTooLow" };
    }

    const actionResult = await useAction(actor, "ranged", getAbility(weapon));
    if (!actionResult) return false;
    return {
        actionType: "ranged",
        ...actionResult,
        stateChanges: {
            removeItem: ammo, // maybe just pass the id?
        },
        name: weapon.system.isThrown ? weapon.name : `${weapon.name} + ${ammo.name}`,
        attackData: weapon.system.isThrown
            ? weapon.system
            : {
                description: `${weapon.system.description}\n${ammo.system.description}`,
                effectDescription: `${weapon.system.effectDescription}\n${ammo.system.effectDescription}`,
                damageEntries: weapon.system.damageEntries,
                specialEffects: ammo.system.specialEffects
            }
    };
}

// todo: explore if this could be a macro handler we drag and drop onto the hotbar
// - it may be a bit much to include spell/summon/prayer together.  but the general usage idea is very similar
// - this might get clarified when handling outcomes
// Assuming we have a uiService as defined in the previous example
const castingHandlers = {
    prayer: {
        getCastables: (actor) => actor.items.filter(i => i.type === "prayer"
            && actor.system.prayerPoints.value >= i.system.usageCost[0].amount),
        handleCost: (actor, isSuccess, cost) => actor.system.spendPoints("prayer", isSuccess ? cost[0].amount : 1)
    },
    summoning: {
        getCastables: (actor) => actor.items.filter(i => i.type === "summoning"
            && actor.system.prayerPoints.value >= i.system.usageCost[0].amount),
        handleCost: (actor, isSuccess, cost) => actor.system.spendPoints("summoning", isSuccess ? cost[0].amount : 1)
    },
    magic: {
        getCastables: (actor) => actor.items.filter(s => s.type === "spell"
            && s.system.usageCost.every(uc =>
                actor.items.find(r => r.type === "rune"
                    && r.system.type === uc.type
                    && r.system.quantity >= uc.amount))),
        handleCost: (actor, isSuccess, cost) => {
            if (isSuccess) {
                cost.forEach(c => actor.system.spendRunes(c.type, c.amount));
            }
        }
    }
};

export const castAction = async (actor, castType) => {
    const castHandler = castingHandlers[castType];
    const castables = castHandler.getCastables(actor);
    if (castables.length < 1) {
        uiService.showNotification("RSK.NoCastablesAvailable");
        return false;
    }

    const selectCastableResult = await uiService.showDialog('select-item', { context: { items: castables } });
    if (!selectCastableResult || !selectCastableResult.confirmed) return false;

    const castable = actor.items.find(x => x._id === selectCastableResult.id);
    const actionResult = await useAction(actor, castType, "intellect");
    if (!actionResult) return;

    castHandler.handleCost(actor, actionResult.isSuccess, castable.system.usageCost);
    await chatResult({
        name: castable.name,
        actionType: castType,
        actionData: castable.system,
        ...actionResult
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
        const result = await uiService.showDialog("apply-damage", { context: outcome });
        if (!result?.confirmed) return;
        await target.system.receiveDamage({ ...result });
    }
}

const useAction = async (actor, skill, ability) => {
    const rollData = actor.system.getRollData();
    const rollResult = await uiService.showDialog("confirm-roll", { context: rollData, options: { defaultSkill: skill, defaultAbility: ability } });
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