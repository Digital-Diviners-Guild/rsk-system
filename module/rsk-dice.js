export default class RSKDice {
    static addButtonListener = (html, handler) => {
        html.find('.roll-dice').click(async (ev) => {
            const rollMode = $(ev.currentTarget).data("rollMode");
            const rollResult = await RSKDice.basicRoll();
            handler(rollResult, rollMode);
        });
    }

    static playerRoll = (tn) => async (rollResult, rollMode) => {
        const success = rollResult.total <= tn;
        const margin = tn - rollResult.total;
        const flavor = `${rollResult.isCritical ? "critical" : ""} ${success ? "success" : "fail"} (${margin})`
        await rollResult.toMessage({ flavor }, { rollMode });
    }

    static npcRoll = () => async (rollResult, rollMode) => {
        const flavor = `${rollResult.isCritical ? "critical" : ""}`
        await rollResult.toMessage({ flavor }, { rollMode });
    }

    static basicRoll = async () => {
        let r = Roll.create(`3d6`);
        const result = await r.evaluate();
        const results = result.terms[0].results;
        const isCritical = results.every(v => v.result === results[0].result);
        return { isCritical, total: result.result, results, toMessage: (opt, cfg) => r.toMessage(opt, cfg) }
    }
}
