export default class RSKChatLog extends ChatLog {

}

export function onRenderChatMessage(app, html, data) {
    html.find(".test")
        .click(e => {
            const actorId = app.flags.rsk.actor;
            const actor = Actor.get(actorId);
            // temp call to test out action from chat.
            actor.apply(app.flags.rsk.prayer);
        });
}