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
        context.config = CONFIG.RSK;
        context.dealsDamage = itemData.system.damageEntries
            && Object.values(itemData.system.damageEntries)
                .filter(x => x > 0).length > 0;
        return context;
    }

    activateListeners(html) {
        super.activateListeners(html);
        if (!this.isEditable) return;

        html.find('.quality-delete').click(ev => {
            const li = $(ev.currentTarget).parents(".quality");
            this.item.removeQuality(li.data("qualityId"));
            li.slideUp(200, () => this.render(false));
        });

        // Roll handlers, click handlers, etc. would go here.
    }

    _onDrop(event) {
        const transferString = event.dataTransfer.getData("text/plain");
        const transferObj = JSON.parse(transferString);
        if (!(transferObj.uuid && transferObj.type)) return;
        switch (transferObj.type) {
            case "Item":
                return this._onDropItem(event, transferObj);
        }
    }

    _onDropItem(event, transferObj) {
        const itemId = transferObj.uuid.split(".")[1];
        if (!itemId) return;

        const droppedItem = Item.get(itemId);
        if (!(droppedItem.type === "quality" && this.item.type === "armour")) return;
        if (this.item.hasQuality(transferObj.uuid)) return;
        const qualityData = { sourceUuId: transferObj.uuid, name: droppedItem.name, description: droppedItem.system.description };
        this.item.addQuality(qualityData);
        this.render(true);
    }
}