import { fields } from "../fields.js";

export default class RSKItemCollection extends foundry.abstract.DataModel {
    static defineSchema() {
        return {
            items: new fields.ArrayField(new fields.ObjectField())
        };
    }

    import(actor) {
        const items = this.items
            .map(i => {
                const item = Item.get(i.itemId);
                return foundry.utils.deepClone(item.toObject());
            });
        if (items.length < 1) return;

        actor.createEmbeddedDocuments("Item", items);
    }
}