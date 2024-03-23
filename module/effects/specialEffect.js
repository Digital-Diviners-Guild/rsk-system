// todo: things needed
/*
in our outcome messaging, we need to make sure we 
have the original actor's uuid so we can do things 
like rejuvenate during normal apply from the message
we also need to communicate duration and quality of statuses being applied
*/

import { localizeText } from "../rsk-localize.js";

// then from there we can figure out how to abstract them for custom special effects
// todo: would be good for the message to include special effect data, and only when applicable

const specialEffects = {
    //on use
    // idealy this probably shouldn't apply 
    // until we click apply, and it can be part of that same message
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
                await actor.system.restoreLifePoints(game.rsk.math.clamp_value(healing.amount, { max: newOutcome.damageEntries[damageKey] }));
                newOutcome.damageEntries[damageKey] = game.rsk.math.clamp_value(newOutcome.damageEntries[damageKey] -= healing.amount, { min: 0 });
            }
        }
        return newOutcome;
    },
    bleed: (outcome) => {
        // this bleed status needs more than just 'bleed'
        // we need to set a flag for the 'quality' of it.
        // we don't yet know the target, so we need a way to 
        // communicate this 'quality'
        const newOutcome = { ...outcome };
        newOutcome.statusesAdded.push({
            name: "bleeding",
            x: 1
            //            duration: 4,
        });
        return newOutcome;
    },
    freeze: (outcome) => {
        const newOutcome = { ...outcome };
        newOutcome.statusesAdded.push({ name: "frozen" });
        return newOutcome;
    },
    incendiary: (outcome) => {
        const newOutcome = { ...outcome };
        newOutcome.statusesAdded.push({ name: "burning" });
        return newOutcome;
    },
    knockdown: (outcome) => {
        const newOutcome = { ...outcome };
        newOutcome.statusesAdded.push({ name: "prone" });
        return newOutcome;
    },
    parry: (outcome) => {
        //todo:
    },
    pin: (outcome) => {
        const newOutcome = { ...outcome };
        newOutcome.statusesAdded.push({ name: "pinned" });
        return newOutcome;
    },
    poison: (outcome) => {
        const newOutcome = { ...outcome };
        newOutcome.statusesAdded.push({ name: "poisoned" });
        return newOutcome;
    },
    puncture: (outcome) => {
        const newOutcome = { ...outcome };
        //todo: add puncture to damage model
        return newOutcome;
    },
    specialTarget: (outcome) => {
        const newOutcome = { ...outcome };
        // todo: either this could enable a double dmg button, or that is just always there?
        return newOutcome;
    },
    spread: (outcome) => {
        const newOutcome = { ...outcome };
        // todo: anything to do here other than a message?
        return newOutcome;
    },
    stun: (outcome) => {
        const newOutcome = { ...outcome };
        newOutcome.statusesAdded.push({ name: "stunned" });
        return newOutcome;
    },
    swift: (outcome) => {
        const newOutcome = { ...outcome };
        // todo: anything to do here other than a message?
        return newOutcome;
    },
    //on equip
    //
    boost: (outcome) => {
        //this could be handled through active effect
        // but needs the 'x' in order to set the boost amount
        // and activates on equip
        // so does this handler create an active effect with the x value on equip
        // then delete it on unequip?

        // another option, on create, special effect with non usage can be made into active effects on the item during creation?
    },
    reach: (outcome) => {
        //same? but might actually be ok to implement through usage
        // it only matters when you succeed, though it does mean it is possible to succeed and not have reach
        // if it is handled through 'usage' so that is important to figure out.
    },
}

export const getSpecialEffectHandler = (name) => {
    return specialEffects[name] || ((outcome) => { })
}