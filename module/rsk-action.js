import RSKPrayer from "./data/items/RSKPrayer.js";

//todo:
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