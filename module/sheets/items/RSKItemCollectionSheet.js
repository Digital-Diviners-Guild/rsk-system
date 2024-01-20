import RSKItemSheet from "./RSKItemSheet.js";

export default class RSKItemCollectionSheet extends RSKItemSheet {
    invalidTypes = ["action", "spell", "prayer", "summonFamiliar"];

    activateListeners(html) {
        super.activateListeners(html);
        html.find('.item-delete').click(ev => {
            const li = $(ev.currentTarget).parents(".item");
            const itemId = li.data("itemId");
            this.item.update({
                "system.items": this.item.system.items.filter(i => i.itemId !== itemId)
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
        if (this.invalidTypes.includes(item.type)) return;

        this.item.update({ "system.items": [...this.item.system.items, { itemId: item._id, name: item.name }] })
        this.render(true);
    }
}