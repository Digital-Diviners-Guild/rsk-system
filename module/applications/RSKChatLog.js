import { applyActionOutcome } from "../rsk-action.js";

export default class RSKChatLog extends ChatLog {

}

export function onRenderChatMessage(app, html, data) {
    html.find(".test")
        .click(async e => {
            // const actorId = app.flags.rsk.actor;
            // const prayerId = app.flags.rsk.prayerId;
            // const actor = Actor.get(actorId);
            // temp call to test out action from chat.
            await applyActionOutcome(app.flags.rsk.outcome);
        });
}