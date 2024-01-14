export default class RSKChatLog extends ChatLog {

}

export function onRenderChatMessage(app, html, data) {
    html.find(".test")
        .click(async e => {
            //todo apply outcomes?
        });
}

export async function chatItem(item) {
    const content = await renderTemplate("systems/rsk/templates/applications/item-message.hbs",
        {
            ...item,
            showRollResult: false,
        });
    await ChatMessage.create({ content });
}