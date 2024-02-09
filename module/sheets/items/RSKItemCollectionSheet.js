import RSKItemSheet from "./RSKItemSheet.js";
import { canAddItem } from "../../rsk-inventory.js";

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
        this.addItem(item);
    }

    async handleDecreaseItemQuantity(itemId) {
        const item = this.item.system.items.find(i => i.itemId === itemId);
        item.system.quantity--;
        if (item.system.quantity < 1) {
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

    //todo: a little better, we can use some of the inventory logic 
    // to enforce an item collection doesn't exceed an inventory
    // though there is still a lot in this sheet that is 'inventory' like
    // I wonder what else we can move out that is similiar with character inventory.
    // both 'add/remove/stack' based on 'items'.  
    // both need to modify the system quantity
    async _onDropItem(event, data) {
        const item = await Item.fromDropData(data);
        if (this.invalidTypes.includes(item.type)) return;
        this.addItem(item);
    }

    addItem(item) {
        const canAddResult = canAddItem(this.item.system.items, item);
        if (canAddResult.canAdd && canAddResult.usesExistingSlot) {
            canAddResult.existingItem.system.quantity++;
            this.item.update({
                "system.items": this.item.system.items
            });
        } else if (canAddResult.canAdd) {
            this.item.update({
                "system.items": [...this.item.system.items, {
                    itemId: item._id || item.itemId,
                    name: item.name,
                    type: item.type,
                    system: {
                        quantity: item.system.quantity,
                        maxStackSize: item.system.maxStackSize
                    },
                    sourceId: item.flags?.core?.sourceId ?? item.uuid
                }]
            });
        }
    }
}