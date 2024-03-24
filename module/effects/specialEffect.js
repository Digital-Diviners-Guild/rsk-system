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
    rejuvenate: async (outcome) => {
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
                newOutcome.actorOutcome.restoresLifePoints = outcome.specialEffect.x;
                newOutcome.targetOutcome.damageEntries[damageKey] = game.rsk.math.clamp_value(newOutcome.targetOutcome.damageEntries[damageKey] -= outcome.specialEffect.x, { min: 0 });
            }
        }
        return newOutcome;
    },
    bleed: async (outcome) => {
        const newOutcome = { ...outcome };
        newOutcome.targetOutcome.statusesAdded.push({
            name: "bleeding",
            flags: {
                damageEntries: {
                    typeless: outcome.specialEffect.x
                }
            }
        });
        return newOutcome;
    },
    freeze: async (outcome) => {
        const newOutcome = { ...outcome };
        newOutcome.targetOutcome.statusesAdded.push({
            name: "frozen",
            duration: outcome.specialEffect.x
        });
        return newOutcome;
    },
    incendiary: async (outcome) => {
        const newOutcome = { ...outcome };
        newOutcome.targetOutcome.statusesAdded.push({
            name: "burning",
            duration: outcome.specialEffect.x,
            flags: {
                damageEntries: {
                    fire: 3
                }
            }
        });
        return newOutcome;
    },
    knockdown: async (outcome) => {
        const newOutcome = { ...outcome };
        newOutcome.targetOutcome.statusesAdded.push({
            name: "prone",
            duration: outcome.specialEffect.x
        });
        return newOutcome;
    },
    parry: async (outcome) => {
        //todo:
        // dialog to get amount to 'parry'
        // add soak for next round (probably done through a status 'parry', that can last 1 round and add the soak that way)
        // add status to actorOutcome
    },
    pin: async (outcome) => {
        const newOutcome = { ...outcome };
        newOutcome.targetOutcome.statusesAdded.push({
            name: "pinned",
            duration: outcome.specialEffect.x
        });
        return newOutcome;
    },
    poison: async (outcome) => {
        //todo: actually use this damage in the combat tracker
        const newOutcome = { ...outcome };
        const durationRoll = await game.rsk.dice.roll("normal", "1d3");
        newOutcome.targetOutcome.statusesAdded.push({
            name: "poisoned",
            duration: durationRoll.total,
            flags: {
                damageEntries: {
                    poison: outcome.specialEffect.x
                }
            }
        });
        return newOutcome;
    },
    puncture: async (outcome) => {
        const newOutcome = { ...outcome };
        newOutcome.targetOutcome.damageEntries["puncture"] = outcome.specialEffect.x;
        return newOutcome;
    },
    stun: async (outcome) => {
        const newOutcome = { ...outcome };
        newOutcome.targetOutcome.statusesAdded.push({
            name: "stunned",
            duration: outcome.specialEffect.x
        });
        return newOutcome;
    },
    swift: async (outcome) => {
        const newOutcome = { ...outcome };
        // todo: anything to do here other than a message?
        return newOutcome;
    },
    specialTarget: async (outcome) => {
        const newOutcome = { ...outcome };
        // todo: either this could enable a double dmg button, or that is just always there?
        return newOutcome;
    },
    spread: async (outcome) => {
        const newOutcome = { ...outcome };
        // todo: anything to do here other than a message?
        return newOutcome;
    },
    //on equip
    //
    boost: async (outcome) => {
        //this could be handled through active effect
        // but needs the 'x' in order to set the boost amount
        // and activates on equip
        // so does this handler create an active effect with the x value on equip
        // then delete it on unequip?

        // another option, on create, special effect with non usage can be made into active effects on the item during creation?
    },
    reach: async (outcome) => {
        //same? but might actually be ok to implement through usage
        // it only matters when you succeed, though it does mean it is possible to succeed and not have reach
        // if it is handled through 'usage' so that is important to figure out.
    },
}

export const getSpecialEffectHandler = (name) => {
    return specialEffects[name] || (async (outcome) => { return outcome; })
}