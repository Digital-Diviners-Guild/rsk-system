import RSKConfirmRollDialog from "./applications/RSKConfirmRollDialog.js";

export default class RSKDice {
    // not sure how I feel about this part
    static addButtonListener = (html, handler) => {
        html.find('.roll-dice').click(async (ev) => {
            const rollResult = await RSKDice.basicRoll();
            await handler(rollResult);
        });
    }

    static addClickListener = (selector, handler) => {
        selector.click(async (ev) => {
            const rollResult = await RSKDice.basicRoll();
            await handler(rollResult);
        });
    }

    static handlePlayerRoll = (actor) => async (rollResult) => {
        // is this even the right spot to set up the dialog?
        const rollData = actor.getRollData();
        const dialog = RSKConfirmRollDialog.create(rollData)
        const result = await dialog();
        
        if (result.rolled) {
            const rollTotal = Number(rollResult.total);
            const testNumber = Number(result.testNumber);
            const isSuccess = rollTotal <= testNumber;
            const margin = testNumber - rollTotal;
            const flavor = `${rollResult.isCritical ? "critical" : ""} ${isSuccess ? "success" : "fail"} (${margin})`
            await rollResult.toMessage({ flavor }, { rollMode: result.rollMode });
        }
    }

    static handleBasicRoll = (rollMode) => async (rollResult) => {
        const flavor = `${rollResult.isCritical ? "critical" : ""}`
        const cfg = rollMode ? { rollMode } : {};
        await rollResult.toMessage({ flavor }, cfg);
    }

    static basicRoll = async () => {
        let r = Roll.create(`3d6`);
        const result = await r.evaluate();
        const results = result.terms[0].results;
        const isCritical = results.every(v => v.result === results[0].result);
        return { isCritical, total: result.result, results, toMessage: (opt, cfg) => r.toMessage(opt, cfg) }
    }
}
