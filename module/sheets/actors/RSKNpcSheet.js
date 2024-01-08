import RSKActorSheet from "./RSKActorSheet.js";
import RSKNpcAction from "../../data/items/RSKNpcAction.js";

export default class RSKNpcSheet extends RSKActorSheet {
    actions;

    getData() {
        const context = super.getData();
        this.actions = context.items.filter(i => i.type === "npcAction");
        context.actions = this.actions;
        return context;
    }

    activateListeners(html) {
        //todo: gm only
        super.activateListeners(html);
        html.find('.use-action').click(async ev => {
            const s = $(ev.currentTarget);
            const actionId = s.data("actionId");
            const action = this.actions.find(i => i._id === actionId);
            await RSKNpcAction.fromSource(action.system).use(this.actor)
        });
    }
}