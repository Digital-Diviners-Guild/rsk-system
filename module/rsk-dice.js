import { uiService } from "./rsk-ui-service.js";

export default class RSKDice {
    static addClickListener = (selector, handler) => {
        selector.click(async (ev) => {
            await handler(ev);
        });
    }

    static skillCheck = async (targetNumber, rollType = "normal") => {
        const rollResult = await RSKDice.roll(rollType);
        const rollTotal = rollResult.total;
        const isSuccess = rollTotal <= targetNumber;
        const margin = targetNumber - rollTotal;
        return {
            isSuccess,
            margin,
            ...rollResult
        }
    }

    static handleBasicRoll = async () => {
        const rollResult = await RSKDice.roll();
        const flavor = `${rollResult.isCritical ? "critical" : ""}`
        await rollResult.toMessage({ flavor });
    }

    static roll = async (rollType = "normal", customFormula = "3d6") => {
        if (!Roll.validate(customFormula)) {
            uiService.showNotification("RSK.InvalidRollFormula");
            return;
        }

        let formula = ({
            normal: "3d6",
            advantage: "4d6dh1",
            disadvantage: "4d6kh3"
        })[rollType] || customFormula;

        const r = await Roll.create(formula);
        const result = await r.evaluate();
        const results = result.terms[0].results;
        const isCritical = results.every(v => v.result === results[0].result);
        return { isCritical, total: result.result, results, result: result, toMessage: (opt, cfg) => r.toMessage(opt, cfg) }
    }
}
