import RSKApplyDamageDialog from "./RSKApplyDamageDialog.js";


export default class RSKChatLog extends ChatLog {

}

const getTarget = (actor = {}) => {
    const targets = game.users.current.targets;
    let target = actor;
    for (const t of targets) {
        target = t.actor;
    }
    return target;
}

export function onRenderChatMessage(app, html, data) {
    html.find(".apply-outcome")
        .click(async e => {
            //todo apply outcomes: Bonus damage from good rolls?
            const currentCharacter = game.users?.current?.character;
            const target = getTarget(currentCharacter);
            const message = data.message;
            if (target && message?.flags?.rsk?.actionType) {
                const dialog = RSKApplyDamageDialog.create(foundry.utils.deepClone(message.flags.rsk));
                const result = await dialog();
                if (!(result && result.confirmed)) return;
                target.receiveDamage({ ...result });
            }
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