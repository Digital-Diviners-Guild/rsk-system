export default class RSKChatLog extends ChatLog {

}

export function onRenderChatMessage(app, html, data) {
    html.find(".test").click(e => console.log(e));
}