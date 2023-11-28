export default class RSKDice {
    static addButtonListener = (html, handler) => {
        html.find('.roll-dice').click(async (ev) => {
            const rollMode = $(ev.currentTarget).data("rollMode");
            const rollResult = await RSKDice.basicRoll();
            handler(rollResult, rollMode);
        });
    }

    static addClickListener = (selector, handler) => {
        selector.click(async (ev) => {
            const rollResult = await RSKDice.basicRoll();
            handler(rollResult);
        });
    }

    static handlePlayerRoll = (tn) => async (rollResult, rollMode) => {
        const success = rollResult.total <= tn;
        const margin = tn - rollResult.total;
        const flavor = `${rollResult.isCritical ? "critical" : ""} ${success ? "success" : "fail"} (${margin})`
        const cfg = rollMode ? { rollMode } : {};
        await rollResult.toMessage({ flavor }, cfg);
    }

    static handleBasicRoll = () => async (rollResult, rollMode) => {
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
