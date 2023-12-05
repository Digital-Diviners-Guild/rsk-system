export default class RSKDice {
    static addClickListener = (selector, handler) => {
        selector.click(async (ev) => {
            await handler(ev);
        });
    }

    static handlePlayerRoll = async (options = {}) => {
        const rollResult = await RSKDice.roll(options.rollType)
        const rollTotal = Number(rollResult.total);
        const testNumber = Number(options.testNumber);
        const isSuccess = rollTotal <= testNumber;
        const margin = testNumber - rollTotal;
        const flavor = `<strong>${options.testName}</strong> TN: ${options.testNumber}
            <p>${rollResult.isCritical ? "<em>critical</em>" : ""} ${isSuccess ? "success" : "fail"} (${margin})</p>`
        await rollResult.toMessage({ flavor }, { rollMode: options.rollMode });
    }

    static handleBasicRoll = async () => {
        const rollResult = await RSKDice.roll();
        const flavor = `${rollResult.isCritical ? "critical" : ""}`
        await rollResult.toMessage({ flavor });
    }

    static roll = async (rollType = "normal") => {
        let formula = ({
            advantage: "4d6dh1",
            disadvantage: "4d6kh3"
        })[rollType] || "3d6";
        const r = await Roll.create(formula);
        const result = await r.evaluate();
        const results = result.terms[0].results;
        const isCritical = results.every(v => v.result === results[0].result);
        return { isCritical, total: result.result, results, toMessage: (opt, cfg) => r.toMessage(opt, cfg) }
    }
}
