export default class RSKDice {
    static addClickListener = (selector, handler) => {
        selector.click(async (ev) => {
            await handler(ev);
        });
    }

    static handlePlayerRoll = async (options = {}) => {
        const rollResult = await RSKDice.roll(options.isAdvantage, options.isDisadvantage)
        const rollTotal = Number(rollResult.total);
        const testNumber = Number(options.testNumber);
        const isSuccess = rollTotal <= testNumber;
        const margin = testNumber - rollTotal;
        const flavor = `<strong>${options.testName}</strong> TN: ${options.testNumber}
            <p>${rollResult.isCritical ? "<em>critical</em>" : ""} ${isSuccess ? "success" : "fail"} (${margin})</p>`
        await rollResult.toMessage({ flavor }, { rollMode: options.rollMode });
    }

    static handleBasicRoll = async (rollMode, isAdvantage, isDisadvantage) => {
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
