import RSKConfirmRollDialog from "./applications/RSKConfirmRollDialog.js";

export default class RSKDice {
    static addClickListener = (selector, handler) => {
        selector.click(async (ev) => {
            await handler(ev);
        });
    }

    static handlePlayerRoll = (actor) => async (ev) => {
        // is this even the right spot to set up the dialog?
        // I feel like we should pass the result of the dialog to the roll system,
        // not prompt the dialog from the roll system?
        const rollData = actor.getRollData();
        const dialog = RSKConfirmRollDialog.create(rollData)
        const result = await dialog();

        if (result.rolled) {
            const rollResult = await RSKDice.roll(result.isAdvantage, result.isDisadvantage)
            const rollTotal = Number(rollResult.total);
            const testNumber = Number(result.testNumber);
            const isSuccess = rollTotal <= testNumber;
            const margin = testNumber - rollTotal;
            const flavor = `${result.testName} TN: ${result.testNumber}
            ${rollResult.isCritical ? "critical" : ""} ${isSuccess ? "success" : "fail"} (${margin})`
            await rollResult.toMessage({ flavor }, { rollMode: result.rollMode });
        }
    }

    static handleBasicRoll = (rollMode, isAdvantage, isDisadvantage) => async (ev) => {
        const rollResult = await RSKDice.roll(isAdvantage, isDisadvantage);
        const flavor = `${rollResult.isCritical ? "critical" : ""}`
        const cfg = rollMode ? { rollMode } : {};
        await rollResult.toMessage({ flavor }, cfg);
    }

    static roll = async (isAdvantage = false, isDisadvantage = false) => {
        let formula = isAdvantage || isDisadvantage ? "4d6" : "3d6";
        formula = isAdvantage
            ? `${formula}dh1`
            : isDisadvantage
                ? `${formula}kh3`
                : formula;
        const r = await Roll.create(formula);
        const result = await r.evaluate();
        const results = result.terms[0].results;
        const isCritical = results.every(v => v.result === results[0].result);
        return { isCritical, total: result.result, results, toMessage: (opt, cfg) => r.toMessage(opt, cfg) }
    }
}
