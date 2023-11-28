//todo:
//check for triples
//check for success (need to know the TN)

export default class RSKDice {
    static addButtonListener = (html, getRollMode) => {
        html.find('.roll-dice').click(async (ev) => {
            //for now a simple way to roll 3d6, later - cool stuff
            const tn = 10;
            let r = Roll.create(`3d6`);
            await r.evaluate();
            const success = r.result <= tn;
            const margin = tn - r.result;
            const results = r.terms[0].results;
            const isCritical = results.every(v => v.result === results[0].result);
            const flavor = `${isCritical ? "critical" : ""} ${success ? "success" : "fail"} (${margin})`
            await r.toMessage({ flavor }, { rollMode: getRollMode(ev) });
        });
    }
}
