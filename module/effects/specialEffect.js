//todo: implement special effects in the system

import { localizeText } from "../rsk-localize.js";

// then from there we can figure out how to abstract them for custom special effects
const specialEffects = {
    //on use
    rejuvenate: async (actor, outcome) => {
        const newOutcome = { ...outcome };
        const healing = await Dialog.prompt({
            title: localizeText("RSK.Rejuvenate"),
            content: `
<div>
    <label>Healing: <input class="amount" type="number"></label>
</div>`,
            callback: dialog => {
                return {
                    amount: Number(dialog.find("input.amount")[0].value),
                }
            }
        });
        if (healing) {
            const damageKey = Object.keys(outcome.damageEntries).find((k) => outcome.damageEntries[k] > 0);
            if (damageKey) {
                debugger;
                await actor.system.restoreLifePoints(game.rsk.math.clamp_value(healing.amount, { max: newOutcome.damageEntries[damageKey] }));
                newOutcome.damageEntries[damageKey] = game.rsk.math.clamp_value(newOutcome.damageEntries[damageKey] -= healing.amount, { min: 0 });
            }
        }
        return newOutcome;
    },
    bleed: () => {
        // this bleed status needs more than just 'bleed'
        // we need to set a flag for the 'quality' of it.
        // we don't yet know the target, so we need a way to 
        // communicate this 'quality'
        const newOutcome = { ...outcome };
        newOutcome.addsStatuses.push("bleed");
        return newOutcome;
    },
    freeze: () => {

    },
    incendiary: () => {

    },
    knockdown: () => {

    },
    parry: () => {

    },
    pin: () => {

    },
    poison: () => {

    },
    puncture: () => {

    },
    specialTarget: () => {

    },
    spread: () => {

    },
    stun: () => {

    },
    swift: () => {

    },
    //on equip
    //
    boost: () => {
        //this could be handled through active effect
        // but needs the 'x' in order to set the boost amount
        // and activates on equip
        // so does this handler create an active effect with the x value on equip
        // then delete it on unequip?

        // another option, on create, special effect with non usage can be made into active effects on the item during creation?
    },
    reach: () => {
        //same? but might actually be ok to implement through usage
        // it only matters when you succeed, though it does mean it is possible to succeed and not have reach
        // if it is handled through 'usage' so that is important to figure out.
    },
}

export const getSpecialEffectHandler = (name) => {
    return specialEffects[name] || (() => { })
}