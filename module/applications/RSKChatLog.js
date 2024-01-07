import RSKAction from "../data/items/RSKAction.js";
import RSKPrayer from "../data/items/RSKPrayer.js";

export default class RSKChatLog extends ChatLog {

}

export function onRenderChatMessage(app, html, data) {
    html.find(".test")
        .click(async e => {
            const outcome = app.flags.rsk.outcome;
            const action = actionFromOutcome(outcome.type, outcome.action);
            await action.apply(outcome);
        });
}

function actionFromOutcome(type, data) {
    switch (type) {
        case "prayer":
            return RSKPrayer.fromSource(data);
        default:
            return RSKAction.fromSource(data);
    }
}