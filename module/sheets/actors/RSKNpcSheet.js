import RSKActorSheet from "./RSKActorSheet.js";

export default class RSKNpcSheet extends RSKActorSheet {
    actions;

    getData() {
        const context = super.getData();
        //this.actions = context.items.filter(i => i.type === "npcAction");
        this.actions = this.actor.testActions;
        context.actions = this.actions;
        return context;
    }

    activateListeners(html) {
        //todo: gm only
        super.activateListeners(html);
        html.find('.use-action').click(async ev => {
            const s = $(ev.currentTarget);
            const actionId = s.data("actionId");
            const action = this.actions.find(i => i.id === actionId);
            await action.use(this.actor)
        });
    }
}