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
    rejuvenate: async (outcome, x, y) => {
        const newOutcome = { ...outcome };
        const healing = await Dialog.prompt({
            title: localizeText("RSK.Confirm"),
            content: `
<div>
${localizeText("RSK.Confirm")} ${localizeText("RSK.Rejuvenate")}
</div>`,
            callback: dialog => true
        });
        if (healing) {
            const damageKey = Object.keys(outcome.targetOutcome.damageEntries).find((k) => outcome.targetOutcome.damageEntries[k] > 0);
            if (damageKey) {
                newOutcome.actorOutcome.restoresLifePoints = x;
                newOutcome.targetOutcome.damageEntries[damageKey] = game.rsk.math.clamp_value(newOutcome.targetOutcome.damageEntries[damageKey] -= x, { min: 0 });
            }
        }
        return newOutcome;
    },
    bleed: async (outcome, x, y) => {
        const newOutcome = { ...outcome };
        newOutcome.statusesAdded.push({
            name: "bleeding"
        });
        return newOutcome;
    },
    freeze: async (outcome, x, y) => {
        const newOutcome = { ...outcome };
        newOutcome.statusesAdded.push({
            name: "frozen",
            duration: x
        });
        return newOutcome;
    },
    incendiary: async (outcome, x, y) => {
        const newOutcome = { ...outcome };
        newOutcome.statusesAdded.push({
            name: "burning",
            duration: x
        });
        return newOutcome;
    },
    knockdown: async (outcome, x, y) => {
        const newOutcome = { ...outcome };
        newOutcome.statusesAdded.push({
            name: "prone",
            duration: x
        });
        return newOutcome;
    },
    parry: async (outcome, x, y) => {
        //todo:
    },
    pin: async (outcome, x, y) => {
        const newOutcome = { ...outcome };
        newOutcome.statusesAdded.push({
            name: "pinned",
            duration: x
        });
        return newOutcome;
    },
    poison: async (outcome, x, y) => {
        //todo: damage
        const newOutcome = { ...outcome };
        const durationRoll = await game.rsk.dice.roll("normal", "1d3");
        newOutcome.statusesAdded.push({
            name: "poisoned",
            duration: durationRoll.total
        });
        return newOutcome;
    },
    puncture: async (outcome, x, y) => {
        const newOutcome = { ...outcome };
        //todo: add puncture to damage model
        return newOutcome;
    },
    specialTarget: async (outcome, x, y) => {
        const newOutcome = { ...outcome };
        // todo: either this could enable a double dmg button, or that is just always there?
        return newOutcome;
    },
    spread: async (outcome, x, y) => {
        const newOutcome = { ...outcome };
        // todo: anything to do here other than a message?
        return newOutcome;
    },
    stun: async (outcome, x, y) => {
        const newOutcome = { ...outcome };
        newOutcome.statusesAdded.push({
            name: "stunned",
            duration: x
        });
        return newOutcome;
    },
    swift: async (outcome, x, y) => {
        const newOutcome = { ...outcome };
        // todo: anything to do here other than a message?
        return newOutcome;
    },
    //on equip
    //
    boost: async (outcome, x, y) => {
        //this could be handled through active effect
        // but needs the 'x' in order to set the boost amount
        // and activates on equip
        // so does this handler create an active effect with the x value on equip
        // then delete it on unequip?

        // another option, on create, special effect with non usage can be made into active effects on the item during creation?
    },
    reach: async (outcome, x, y) => {
        //same? but might actually be ok to implement through usage
        // it only matters when you succeed, though it does mean it is possible to succeed and not have reach
        // if it is handled through 'usage' so that is important to figure out.
    },
}

export const getSpecialEffectHandler = (name) => {
    return specialEffects[name] || (async (outcome, x, y) => { })
}