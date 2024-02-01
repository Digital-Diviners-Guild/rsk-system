import RSKItemSheet from "./RSKItemSheet.js";

//this is very similar to inventory. I wonder if a 'container' abstraction is hiding somewhere
// in this and the inventory
//currently this allows you to cheese the stack limit of 3 on non ammo
// but fixing it doesn't seem worth it, better to rework the inventory rules
// into something that can be reused here. 
//todo: refac to use inventory logic
export default class RSKItemCollectionSheet extends RSKItemSheet {
    invalidTypes = ["action", "spell", "prayer", "summoning"];

    activateListeners(html) {
        super.activateListeners(html);
        html.find('.increase-item-quantity').click(async ev => {
            const s = $(ev.currentTarget);
            const itemId = s.data("itemId");
            await this.handleIncreaseItemQuantity(itemId);
        });
        html.find('.decrease-item-quantity').click(async ev => {
            const s = $(ev.currentTarget);
            const itemId = s.data("itemId");
            await this.handleDecreaseItemQuantity(itemId);
        });
        html.find('.item-delete').click(ev => {
            const li = $(ev.currentTarget).parents(".item");
            const itemId = li.data("itemId");
            this.item.update({
                "system.items": this.item.system.items.filter(i => i.itemId !== itemId)
            });
        });
    }

    async handleIncreaseItemQuantity(itemId) {
        const item = this.item.system.items.find(i => i.itemId === itemId);
        item.quantity++;
        this.item.update({ "system.items": this.item.system.items });
    }

    async handleDecreaseItemQuantity(itemId) {
        const item = this.item.system.items.find(i => i.itemId === itemId);
        item.quantity--;
        if (item.quantity < 1) {
            this.item.update({ "system.items": this.item.system.items.filter(i => i.itemId !== itemId) });
        } else {
            this.item.update({ "system.items": this.item.system.items });
        }
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

        const existingItem = this.item.system.items.find(i => i.sourceId === item.flags.core.sourceId);
        if (existingItem) {
            existingItem.quantity++;
            this.item.update({
                "system.items": this.item.system.items
            });
        } else {
            this.item.update({
                "system.items": [...this.item.system.items, {
                    itemId: item._id,
                    name: item.name,
                    quantity: item.system.quantity,
                    sourceId: item.flags?.core?.sourceId ?? item.uuid
                }]
            });
        }
    }
}