export default class RSKCodexSheet extends ItemSheet {
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
        return 'systems/rsk/templates/items/codex-sheet.hbs';
    }

    getData() {
        const context = super.getData();
        const itemData = context.item;
        context.system = itemData.system;
        context.flags = itemData.flags;
        context.config = CONFIG.RSK;
        return context;
    }

    activateListeners(html) {
        super.activateListeners(html);
        html.find('.item-delete').click(ev => {
            const li = $(ev.currentTarget).parents(".item");
            const itemId = li.data("itemId");
            this.item.update({
                "system.actions": this.item.system.actions.filter(i => i.itemId !== itemId)
            });
        });
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

    async _onDropItem(event, data) {
        const item = await Item.fromDropData(data);
        if (item.system.category !== this.item.system.actionType
            || this.item.system.actions.filter(a => a.itemId === item._id).length > 0) return;

        this.item.update({ "system.actions": [...this.item.system.actions, { itemId: item._id, name: item.name }] })
        this.render(true);
    }
}