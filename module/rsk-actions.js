import RSKConfirmRollDialog from "./applications/RSKConfirmRollDialog.js";
import RSKCastableSelectionDialog from "./applications/RSKCastableSelectionDialog.js";


export const meleeAttackAction = (actor) => {

}

export const rangedAttackAction = (actor) => {

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

    const selectCastable = RSKCastableSelectionDialog.create({ castables });
    const selectCastableResult = await selectCastable();
    if (!selectCastableResult) return false;

    const castable = actor.items.find(x => x._id === selectCastableResult.id);
    const result = await useAction(actor, castType, "intellect");
    if (!result) return false;
    if (result.isSuccess) {
        for (const cost of castable.system.usageCost) {
            if (castType === "magic") {
                actor.spendRunes(cost.type, cost.amount);
            } else {
                actor.spendPoints(castType, cost.amount);
            }
        }
    } else if (!(result.isSuccess && castType === magic)) {
        actor.spendPoints(castType, 1);
    }
    await sendChat(castable.name, castType, castable.system, result);
    return result;
}

/*
probably need to start splitting 'equipment' out into
rangedWeapon - the current model has no way to indicate we need to spend some arrows/bolts on usage
meleeWeapon - two handed? one handed?
and equipment? - this is misc stuff like fishing rod, woodcutting axe, pickaxe, etc.. 
*/

export class RSKRangedAction {
    static create(id, label, actionData) {
        return new this(id, label, actionData);
    }

    constructor(id, label, actionData) {
        this.id = id;
        this.label = label;
        this.actionData = actionData;
        this.actionType = "ranged";
    }

    async use(actor) {
        const ammoSelection = this.selectAmmo(actor);
        if (ammoSelection.quantity < 1) return;
        //todo: based on actionData pick strength or agility (ie normal ranged is str, martial is agil.  same for melee attack)
        const result = await useAction(actor, "ranged", "strength");
        if (!result) return;

        actor.removeItem(ammoSelection);
        await sendChat(this.label, this.actionType, this.actionData, result);
        return result;
    }

    selectAmmo(actor) {
        // todo: if action is not a throw, dialog for ammo selection.
        if (this.actionData.category === "bow") {
            return actor.items.find(x =>
                x.type === "ammunition"
                && x.system.type === "arrow");
        } else if (this.actionData.category === "crossbow") {
            return actor.items.find(x =>
                x.type === "ammunition"
                && x.system.type === "bolt");
        } else {
            return actor.items.find(x => x.system.equipped?.isEquipped && x.system.isAmmo);
        }
    }
}

// I think it would be better if we look at the actor using the action when executed
// so rather than a command pattern, maybe more of a macro?
// ie, when we melee, grab the current equipped item or make unarmed attack.
// I think actions such as ranged/cast/pray/summon/melee could all work this way
// and be a bit more consistent.  
// ultimately the difference in actions is what skills to roll.
// and then what follows the success. but using the action, and determining the outcome is very similar
// damage/effects etc come from somwhere (prayer, spell, weapon (and ammo when ranged attack), )
export class RSKMeleeAction {
    static create(id, label, actionData) {
        return new this(id, label, actionData);
    }

    constructor(id, label, actionData) {
        this.id = id;
        this.label = label;
        this.actionData = actionData;
        this.actionType = "melee";
    }

    async use(actor) {
        //todo: based on actionData pick strength or agility (ie normal ranged is str, martial is agil.  same for ranged attack)
        const result = await useAction(actor, "attack", "strength");
        if (!result) return;
        await sendChat(this.label, this.actionType, this.actionData, result);
        return result;
    }
}

const useAction = async (actor, skill, ability) => {
    const rollData = actor.getRollData();
    const dialog = RSKConfirmRollDialog.create(rollData, { defaultSkill: skill, defaultAbility: ability });
    const rollResult = await dialog();
    if (!rollResult.rolled) return false;

    const actionResult = await actor.useSkill(rollResult);
    return actionResult;
}

const sendChat = async (label, actionType, actionData, result) => {
    const flavor = await renderTemplate("systems/rsk/templates/applications/item-message.hbs",
        {
            label,
            ...actionData,
            ...result,
            showRollResult: true,
        });
    await result.rollResult.toMessage({
        flavor: flavor,
        flags: {
            rsk: {
                actionType: actionType,
                actionData: { ...actionData }
            }
        }
    });
}
