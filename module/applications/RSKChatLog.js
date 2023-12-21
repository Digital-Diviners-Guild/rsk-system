import { applyPrayer } from "../rsk-prayer.js";

export default class RSKChatLog extends ChatLog {

}

export function onRenderChatMessage(app, html, data) {
    html.find(".test")
        .click(e => {
            // const actorId = app.flags.rsk.actor;
            // const prayerId = app.flags.rsk.prayerId;
            // const actor = Actor.get(actorId);
            // temp call to test out action from chat.
            applyPrayer(app.flags.rsk.actionData);
        });
}