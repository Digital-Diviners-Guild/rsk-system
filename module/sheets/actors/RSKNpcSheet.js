import RSKActorSheet from "./RSKActorSheet.js";
import { dealsDamage } from "../../rsk-actions.js";

export default class RSKNpcSheet extends RSKActorSheet {
    // I don't like that we have like 4 spots we "chat" an item.
    //todo: don't do that lol
    async handleChatItem(itemType, itemId) {
        if (itemType === "action") {
            const item = this.actor.items.find(i => i._id === itemId);
            const content = await renderTemplate("systems/rsk/templates/applications/item-message.hbs",
                {
                    name: item.name,
                    ...item.system,
                    showApplyDamage: dealsDamage(item.system)
                });
            await ChatMessage.create({
                content,
                flags: {
                    rsk: {
                        actionType: item.system.actionType,
                        actionData: { ...item.system }
                    }
                }
            });
        } else {
            await super.handleChatItem(itemType, itemId);
        }
    }
}