import { applyOutcome } from "../rsk-actions.js";

export default class RSKChatLog extends ChatLog {

}

export function onRenderChatMessage(app, html, data) {
    html.find(".apply-outcome")
        .click(async e => {
            //todo apply outcomes: Bonus damage from good rolls?
            const message = data.message;
            if (!(message?.flags?.rsk?.targetUuid && message?.flags?.rsk?.actionType)) return;
            applyOutcome(foundry.utils.deepClone(message.flags.rsk));
        });
}

export async function chatItem(item, options = {}) {
    const data = item.hasOwnProperty("system") ? { name: item.name, ...item.system } : item;
    const content = await renderTemplate("systems/rsk/templates/applications/item-message.hbs",
        {
            ...data,
            showRollResult: false,
            ...options
        });
    await ChatMessage.create({ content });
}