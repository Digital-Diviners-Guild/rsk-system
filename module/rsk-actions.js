import { rskPrayerStatusEffects, statusToEffect } from "./effects/statuses.js";
import { localizeText } from "./rsk-localize.js";
import { getTargets } from "./rsk-targetting.js";
import { uiService } from "./rsk-ui-service.js";
import { applyStateChanges } from "./rsk-action-results.js";

export const npcAction = async (npc, npcAction) => {
    const actionData = { ...npcAction.system };
    const content = await renderTemplate("systems/rsk/templates/applications/action-message.hbs",
        {
            name: npcAction.name,
            actionData,
            hideRollResults: true
        });
    const targetUuids = getTargets(npc);
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
    if (result.usage) {
        await applyStateChanges(actor, result.usage);
    }
    await chatResult(result);
}

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

const getAbility = (weapon) => weapon.system.type === "martial" ? "agility" : "strength";

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
        usage: [{ operation: 'removeItem', params: [ammo] }], //todo: probably use uuids
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
        handleCast: (rollResult, castable) => {
            if (rollResult.isSuccess) {
                const appliedEffects = rskPrayerStatusEffects
                    .filter(x => x.id === castable.status)
                    .map(s => statusToEffect(s));
                return {
                    usage: [{ operation: 'spendResource', params: ['prayer', castable.usageCost[0].amount] }],
                    targetStateChanges: [{ operation: 'addEffects', params: [appliedEffects] }]
                };
            }
            return {
                usage: [{ operation: 'spendResource', params: ['prayer', 1] }]
            };
        }
    },
    summoning: {
        getCastables: (actor) => actor.items.filter(i => i.type === "summoning"
            && actor.system.prayerPoints.value >= i.system.usageCost[0].amount),
        handleCast: (rollResult, castable) => {
            if (rollResult.isSuccess) {
                return {
                    usage: [{ operation: 'spendResource', params: ['summoning', castable.usageCost[0].amount] }]
                };
            }
            return {
                usage: [{ operation: 'spendResource', params: ['summoning', 1] }]
            };
        }
    },
    magic: {
        getCastables: (actor) => actor.items.filter(s => s.type === "spell"
            && s.system.usageCost.every(uc =>
                actor.items.find(r => r.type === "rune"
                    && r.system.type === uc.type
                    && r.system.quantity >= uc.amount))),
        handleCast: (rollResult, castable) => rollResult.isSuccess
            ? {
                usage: castable.usageCost.map(runeCost => ({
                    operation: 'spendResource',
                    params: [runeCost.type, runeCost.amount]
                }))
            }
            : { usage: [] }
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

    const stateChanges = castHandler.handleCast(actionResult.rollResult, castable.system);
    const result = {
        name: castable.name,
        actionType: castType,
        actionData: castable.system,
        ...actionResult,
        ...stateChanges
    };
    //todo: just return and do these things elsewhere?
    // but maybe we can't, we need to make a macro and see how this changes things
    if (stateChanges.usage) {
        await applyStateChanges(actor, result.usage);
    }
    await chatResult(result);
    return result;
}

const useAction = async (actor, skill, ability) => {
    const rollData = actor.system.getRollData();
    const confirmRollResult = await uiService.showDialog("confirm-roll", { context: rollData, options: { defaultSkill: skill, defaultAbility: ability } });
    if (!confirmRollResult.rolled) return false;

    const skillResult = await actor.system.useSkill(confirmRollResult);
    //todo: not all actions will need a target (some only target self, others don't need a target per say)
    const targetUuids = getTargets(actor);
    return { rollResult: { ...skillResult }, targetUuids }
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