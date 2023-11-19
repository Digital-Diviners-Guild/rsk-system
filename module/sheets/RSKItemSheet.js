export default class RSKItemSheet extends ItemSheet {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["rsk", "sheet", "item"],
            width: 600,
            height: 600,
            tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }]
        });
    }

    get template() {
        return `systems/rsk-system/templates/items/${this.item.type}-sheet.hbs`
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