import { getTargets } from "./rsk-targetting.js";

//todo: update to new model and move to npc action type probably
export const npcAction = async (npc, npcAction) => {
    const actionData = { ...npcAction.system };
    const targetUuids = getTargets(npc);
    await chatResult(npcAction.name, actionData, actionData.type, targetUuids);
}

const chatResult = async (name, actionData, actionType, targetUuids = [], targetStateChanges = {}) => {
    const content = await renderTemplate("systems/rsk/templates/applications/action-message.hbs",
        {
            name,
            ...actionData,
            hideRollResults: true
        });
    await ChatMessage.create({
        content: content,
        flags: {
            rsk: {
                targetUuids,
                actionType,
                actionData,
                targetStateChanges
            }
        }
    });
}
