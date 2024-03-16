export default class RSKCodexSheet extends ItemSheet {
    get template() {
        return 'systems/rsk/templates/items/codex-sheet.hbs';
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
        if (item.type !== this.item.system.actionType
            || this.item.system.actions.filter(a => a.itemId === item._id).length > 0) return;

        this.item.update({ "system.actions": [...this.item.system.actions, { itemId: item._id, name: item.name }] })
        this.render(true);
    }
}