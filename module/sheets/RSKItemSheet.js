export default class RSKItemSheet extends ItemSheet {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["rsk", "sheet", "item"],
            width: 600,
            height: 600,
            tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }],
            dragDrop: [{ dropSelector: "[data-can-drop=true]" }],
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

    _onDrop(event) {
        const transferString = event.dataTransfer.getData("text/plain");
        const transferObj = JSON.parse(transferString);
        if (!transferObj.uuid) return;

        const itemId = transferObj.uuid.split(".")[1];
        if (!itemId) return;

        switch (transferObj.type) {
            case "Item":
                return this._onDropSpecialEffect(event, itemId);
        }
    }

    _onDropSpecialEffect(event, itemId) {
        const droppedItem = Item.get(itemId);
        //todo: only some items can accept special effects
        if (droppedItem.type !== "specialEffect") return;

        const specialEffectData = { name: droppedItem.name, type: droppedItem.type, sourceId: droppedItem._id, ...droppedItem.system };
        const itemSpecialEffects = [...this.item.system.specialEffects, specialEffectData];
        this.item.update({ system: { specialEffects: itemSpecialEffects } });
        this.render(true);
    }
}