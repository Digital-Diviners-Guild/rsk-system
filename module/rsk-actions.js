import RSKApplyDamageDialog from "./applications/RSKApplyDamageDialog.js";
import RSKConfirmRollDialog from "./applications/RSKConfirmRollDialog.js";
import RSKItemSelectionDialog from "./applications/RSKItemSelectionDialog.js";
import { getTarget } from "./rsk-targetting.js";

/*
equipment model needs rework, and maybe needs to be split into ranged weapons/melee weapons
tools and such that can be used as melee weapons would be modeled as melee weapons,
then darts could be a ranged weapon instead of an ammo hack? though we still would need to 
handle stacking? which needs a rework anyways (all of inventory/item collects needs one)
*/

// TODO: new action functions need refactoring.

const getAbility = (weapon) => weapon.system.type === "martial" ? "agility" : "strength";

export const meleeAttackAction = async (actor) => {
    //todo: better way to select equipped weapon from actor from within actor
    //todo: dual wielding? if there are 2 weapons, maybe a dialog to select which one and if it is the second attack to add disadvantage?
    const weapons = actor.system.getActiveItems().filter(i => i.type === "meleeWeapon");
    const weapon = weapons.length > 0 ? weapons[0] : { name: "unarmed", system: { type: "simple", damageEntries: { crush: 1 } } } //todo: unarmed damage?
    const result = await useAction(actor, "attack", getAbility(weapon));
    if (!result) return;

    await sendChat(weapon.name, "melee", weapon.system, result);
    return result;
}

export const rangedAttackAction = async (actor) => {
    const selectAmmo = async (actor, weapon) => {
        const ammoType = weapon.system.ammoType;
        if (ammoType) {
            const ammos = actor.items.filter(x =>
                x.type === "ammunition"
                && x.system.type === ammoType);
            if (ammos.length > 1) {
                const ammoSelectionDialog = RSKItemSelectionDialog.create({ items: ammos });
                const selectResult = await ammoSelectionDialog();
                if (!(selectResult && selectResult.confirmed)) return false;

                return actor.items.find(x => x._id === selectResult.id);
            } else {
                return ammos[0];
            }
        } else {
            //return actor.items.find(x => x.system.isEquipped);
            return { quantity: 0 }; //todo: darts?
        }
    }

    const weapons = actor.system.getActiveItems().filter(i => i.type === "rangedWeapon");
    if (weapons.length < 1) return false;

    const weapon = weapons[0];//todo: off hand darts? or dual wield crossbows?
    const ammoSelection = await selectAmmo(actor, weapon);
    if (!ammoSelection || ammoSelection.quantity < 1) return;

    const result = await useAction(actor, "ranged", getAbility(weapon));
    if (!result) return;

    actor.system.removeItem(ammoSelection);
    //todo: ranged attacks are a combo of the weapon and ammo used.
    // weapon give damage, ammo gives qualities
    // this needs to be reflected in the outcome and messaging
    await sendChat(weapon.name, "ranged", weapon.system, result);
    return result;
}

// todo: explore if this could be a macro handler we drag and drop onto the hotbar
// - it may be a bit much to include spell/summon/prayer together.  but the general usage idea is very similar
// - this might get clarified when handling outcomes
export const castAction = async (actor, castType) => {
    const canCast = (usageCost) => {
        if (usageCost.length < 1) return true;
        for (const cost of usageCost) {
            if (castType === "magic") {
                const runes = actor.items.find(i => i.type === "rune" && i.system.type === cost.type);
                if (!runes || runes.system.quantity < cost.amount) return false;
            } else {
                const points = actor.system[cost.type];
                if (!points || points.value < cost.amount) return false;
            }
        }
        return true;
    }
    const castableType = castType === "magic" ? "spell" : castType; //bleh
    const castables = actor.items
        .filter(i => i.type === castableType)
        .filter(s => canCast(s.system.usageCost));
    if (castables.length < 1) return false;

    const selectCastable = RSKItemSelectionDialog.create({ items: castables });
    const selectCastableResult = await selectCastable();
    if (!(selectCastableResult && selectCastableResult.confirmed)) return false;

    const castable = actor.items.find(x => x._id === selectCastableResult.id);
    const result = await useAction(actor, castType, "intellect");
    if (!result) return false;
    if (result.isSuccess) {
        for (const cost of castable.system.usageCost) {
            if (castType === "magic") {
                actor.system.spendRunes(cost.type, cost.amount);
            } else {
                actor.system.spendPoints(castType, cost.amount);
            }
        }
    } else if (!(result.isSuccess && castType === magic)) {
        actor.system.spendPoints(castType, 1);
    }
    await sendChat(castable.name, castType, castable.system, result);
    return result;
}

export const dealsDamage = (data) => data.damageEntries
    && Object.values(data.damageEntries)
        .filter(x => x > 0).length > 0

export const applyOutcome = async (outcome) => {
    const target = fromUuidSync(outcome.targetUuid)
    if (target) {
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

    const actionResult = await actor.system.useSkill(rollResult);
    //todo: improve targetting communication?
    // it isn't really part of the result. just here to help with transition away from proxy
    const targetUuid = getTarget(actor);
    return { ...actionResult, targetUuid }
}

const sendChat = async (label, actionType, actionData, result) => {
    const flavor = await renderTemplate("systems/rsk/templates/applications/item-message.hbs",
        {
            label,
            ...actionData,
            ...result,
            showRollResult: true,
            showApplyDamage: result.isSuccess && dealsDamage(actionData)
        });
    await result.rollResult.toMessage({
        flavor: flavor,
        flags: {
            rsk: {
                targetUuid: result.targetUuid,
                actionType: actionType,
                actionData: { ...actionData }
            }
        }
    });
}