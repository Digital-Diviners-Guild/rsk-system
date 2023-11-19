export default class RSKItemSheet extends ItemSheet {
    get template() {
        return `systems/rsk-system/templates/items/${this.item.type}-sheet.hbs`;
    }

    getData() {
        const context = super.getData();
        const itemData = context.item;
        // context.rollData = {};
        // let actor = this.object?.parent ?? null;
        // if (actor) {
        //     context.rollData = actor.getRollData();
        // }
        context.system = itemData.system;
        context.flags = itemData.flags;
        return context;
    }

    activateListeners(html) {
        super.activateListeners(html);
        if (!this.isEditable) return;

        // Roll handlers, click handlers, etc. would go here.
    }
}