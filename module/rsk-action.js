import { pray } from "./rsk-prayer.js";
import { cast } from "./rsk-magic.js";
import RSKPrayer from "./data/items/RSKPrayer.js";

//todo: most likely this approach is deprecated.  probably going to move
// the functions into the datamodels... for now
export async function useAction(actor, action) {
    switch (action.type) {
        case "prayer":
            return await pray(actor, action.id);
        case "spell":
            return await cast(actor, action.id);
        case "ranged":
        //return await rangedAttack(actor, action);
        case "melee":
        //return await meleeAttack(actor, action);
        default:
            // is there some default handler that could make sense?
            throw `unknown action type: ${action.type}`
    }
}

// applying outcomes needs 100% rework, it is different depending on npc/char and what type it is.
export async function applyActionOutcome(outcome) {
    switch (outcome.type) {
        case "prayer":
            return await RSKPrayer.fromSource(outcome.action).apply(outcome);
        //     case "spell":
        //     //     return await applySpell(outcome)
        //     case "ranged":
        //     //return await applyMeleeAttack(actor, action);
        //     case "melee":
        //     //return await applyRangedAttack(actor, action);
        default:
            // is there some default handler that could make sense?
            throw `unknown action type: ${outcome.type}`
    }
}