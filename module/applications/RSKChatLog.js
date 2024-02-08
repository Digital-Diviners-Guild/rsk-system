import { applyOutcome } from "../rsk-actions.js";
import { localizeText } from "../rsk-localize.js";

export default class RSKChatLog extends ChatLog {

}

export function onRenderChatMessage(app, html, data) {
    const message = data.message;
    const isActionMessage = message?.flags?.rsk?.actionType;
    const currentCharacterUuid = game.user?.character?.uuid;
    const isGM = game.user?.isGM;
    if (!(isActionMessage && (currentCharacterUuid || isGM))) return;

    const possibleTargets = message.flags.rsk.targetUuids;
    const canClickButton = isGM || possibleTargets?.includes(currentCharacterUuid)
    if (!canClickButton) return;
    const targets = isGM
        ? [...game.user.targets.map(t => t.actor)]
        : [game.user.character];
    const outcomeData = message.flags.rsk;
    addApplyOutcomeButton(html, () => applyOutcome(targets, outcomeData));
}

const addApplyOutcomeButton = (html, handler) => {
    html.find(".message-controls")
        .html(`<button class="apply-outcome">${localizeText("RSK.ApplyDamage")}</button>`)
    html.find(".apply-outcome")
        .click(async e => await handler());
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