export default class RSKActionCollectionSheet extends ItemSheet {
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
        return `systems/rsk/templates/items/${this.item.type}-sheet.hbs`
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

    getData() {
        const context = super.getData();
        this._prepareActions(context);
        return context;
    }

    _prepareActions(context) {
        context.actionType = this.item.system.actionType;
        context.actions = this.item.system.actions; //todo:
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
        if (item.type !== this.item.system.actionType
            || this.item.system.actions.filter(a => a.itemId === item._id).length > 0) return;

        this.item.update({ "system.actions": [...this.item.system.actions, { itemId: item._id, name: item.name }] })
        this.render(true);
    }
}