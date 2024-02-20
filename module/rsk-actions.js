import { rskPrayerStatusEffects, statusToEffect } from "./effects/statuses.js";
import { localizeText } from "./rsk-localize.js";
import { getTargets } from "./rsk-targetting.js";
import { uiService } from "./rsk-ui-service.js";
import { applyStateChanges } from "./rsk-action-results.js";

export const npcAction = async (npc, npcAction) => {
    const actionData = { ...npcAction.system };
    const targetUuids = getTargets(npc);
    await chatResult(npcAction.name, actionData, actionData.type, targetUuids);
}

//todo: (applicable to all actions and chatted things)
// it would be nice to have an img of the chatted item/action
// for now passing it through actiondata.img, though this will not add 
// the img to 'chat' with the chat button, and feels meh.
// wonder what we could do (maybe through on chat render)
// to look up the item and insert the img?
export const consumeAction = async (actor, consumable) => {
    const addedEffects = consumable.effects.map(e => foundry.utils.deepClone(e.toObject()));
    const targetStateChanges = [
        {
            operation: 'addLifePoints',
            params: [consumable.system.lifePointsRestored]
        }, {
            operation: 'addStatuses',
            params: [consumable.system.statusesAdded]
        }, {
            operation: 'addEffects',
            params: [addedEffects]
        }, {
            operation: 'removeStatuses',
            params: [consumable.system.statusesRemoved]
        },
    ];
    await applyStateChanges(actor, [{ operation: 'removeItem', params: [consumable.uuid] }]);
    const targetUuids = getTargets(actor);
    const actionData = { img: consumable.img, ...consumable.system };
    await chatResult(`${actor.name} ${localizeText("RSK.Uses")} ${consumable.name}`,
        actionData,
        "consume",
        targetUuids,
        targetStateChanges);
}

const chatResult = async (name, actionData, actionType, targetUuids = [], targetStateChanges = {}) => {
    const content = await renderTemplate("systems/rsk/templates/applications/action-message.hbs",
        {
            name,
            ...actionData,
            hideRollResults: true
        });
    await ChatMessage.create({
        content: content,
        flags: {
            rsk: {
                targetUuids,
                actionType,
                actionData,
                targetStateChanges
            }
        }
    });
}

export const attackAction = async (actor, weapon) => {
    let result;
    if (weapon.isMeleeWeapon()) {
        result = await meleeAttackAction(actor, weapon)
    } else {
        result = await rangedAttackAction(actor, weapon)
    }
    if (!result) return;

    if (result.error) {
        uiService.showNotification(localizeText(result.error));
        return;
    }
    if (result.usage) {
        await applyStateChanges(actor, result.usage);
    }
    await chatRollResult(result);
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
        actionData: { img: weapon.img, ...weapon.system }
    };
}

const rangedAttackAction = async (actor, weapon) => {
    const ammo = weapon.isThrownWeapon() ? weapon
        : actor.system.getActiveItems().find(i => weapon.usesItemAsAmmo(i));
    if (!ammo || ammo.quantity < 1) {
        return { error: "RSK.NoAmmoAvailable" };
    }
    if (weapon.system.weaponType !== "simple" && actor.system.skills["ranged"].level < 5) {
        return { error: "RSK.RangedLevelTooLow" };
    }

    const actionResult = await useAction(actor, "ranged", getAbility(weapon));
    if (!actionResult) return false;
    return {
        actionType: "ranged",
        ...actionResult,
        usage: [{ operation: 'removeItem', params: [ammo.uuid] }],
        name: weapon.isThrownWeapon() ? weapon.name : `${weapon.name} + ${ammo.name}`,
        actionData: weapon.isThrownWeapon()
            ? { img: weapon.img, ...weapon.system }
            //todo: this message could probably use some work
            : {
                img: weapon.img,
                description: `${weapon.system.description}\n${ammo.system.description}`,
                effectDescription: `${weapon.system.effectDescription}\n${ammo.system.effectDescription}`,
                damageEntries: combineDamage(weapon.system.damageEntries, ammo.system.damageEntries),
                specialEffects: ammo.system.specialEffects
            }
    };
}

const combineDamage = (damageEntries1, damageEntries2) => {
    const result = { ...damageEntries1 };

    Object.keys(damageEntries2).forEach(key => {
        if (result[key]) {
            result[key] += damageEntries2[key];
        } else {
            result[key] = damageEntries2[key];
        }
        if (result[key] === 0) {
            delete result[key];
        }
    });

    return result;
}

const castingHandlers = {
    prayer: {
        getCastables: (actor) => actor.items.filter(i => i.type === "prayer"
            && actor.system.prayerPoints.value >= (i.system.usageCost[0]?.amount ?? 0)),
        handleCast: (rollResult, castable) => {
            if (rollResult.isSuccess) {
                const appliedEffects = rskPrayerStatusEffects
                    .filter(x => x.id === castable.status)
                    .map(s => statusToEffect(s));
                return {
                    usage: [{ operation: 'spendResource', params: ['prayer', castable.usageCost[0]?.amount ?? 0] }],
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
            && actor.system.prayerPoints.value >= (i.system.usageCost[0]?.amount ?? 0)),
        handleCast: (rollResult, castable) => {
            if (rollResult.isSuccess) {
                return {
                    usage: [{ operation: 'spendResource', params: ['summoning', castable.usageCost[0]?.amount ?? 0] }]
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

// todo: explore if this could be a macro handler we drag and drop onto the hotbar
export const castAction = async (actor, castType) => {
    const castHandler = castingHandlers[castType];
    const castables = castHandler.getCastables(actor);
    if (castables.length < 1) {
        uiService.showNotification("RSK.NoCastablesAvailable");
        return false;
    }

    const selectCastableResult = await uiService.showDialog('select-item', { items: castables });
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
    await chatRollResult(result);
    return result;
}

const useAction = async (actor, skill, ability) => {
    const rollData = actor.system.getRollData();
    const confirmRollResult = await uiService.showDialog("confirm-roll", rollData, { defaultSkill: skill, defaultAbility: ability });
    if (!confirmRollResult.confirmed) return false;

    const skillResult = await actor.system.useSkill(confirmRollResult);
    //todo: not all actions will need a target (some only target self, others don't need a target per say)
    // we should skip this when an action can only target 'self'
    const targetUuids = getTargets(actor);
    return { rollResult: { ...skillResult }, targetUuids: [...targetUuids] }
}

const chatRollResult = async (actionResult) => {
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