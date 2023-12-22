import { applyPrayer, pray } from "./rsk-prayer.js";

export function toUsableMessageContent(actionData) {
    return `<p>${actionData.label}</p>
    <p>${actionData.description}</p>
    <p>${actionData.effectDescription}</p>
    ${includeUseButton ? "<button class='test' type='button'>use</button>" : ""}`;
}

// if we were to go this route, what 
// exactly is an 'action'?  and how do we support things like 'block' that comes from a quality?
// does that need to be handled here?
// what about consuming potions an crafting?
//  do we need to revisit RSKAction? and or do we need combat and non combat action systems?
export async function useAction(actor, action) {
    switch (action.type) {
        case "prayer":
            return await pray(actor, action.id);
        case "spell":
        //await cast(actor, action)
        case "ranged":
        //await attack(actor, action)
        case "melee":
        //await shootOrThrow(actor, action)
        default:
            // is there some default handler that could make sense?
            throw `unknown action type: ${action.type}`
    }
}

export async function applyActionOutcome(outcome) {
    switch (outcome.type) {
        case "prayer":
            return await applyPrayer(outcome);
        case "spell":
        //await applySpell(actor, action)
        case "ranged":
        //await applyMeleeAttack(actor, action)
        case "melee":
        //await applyRangedAttack(actor, action)
        default:
            // is there some default handler that could make sense?
            throw `unknown action type: ${action.type}`
    }
}