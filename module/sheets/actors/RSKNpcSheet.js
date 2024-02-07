import { npcAction } from "../../rsk-actions.js";
import RSKActorSheet from "./RSKActorSheet.js";

export default class RSKNpcSheet extends RSKActorSheet {
    activateListeners(html) {
        html.find('.use-action').click(async (ev) => {
            const target = $(ev.currentTarget);
            const actionId = target.data("itemId");
            const action = this.actor.items.find(i => i._id === actionId);
            if (!action) return;
            await this.useAction(action);
        });
        super.activateListeners(html);
    }

    async useAction(action) {
        await npcAction(this.actor, action);
    }
}