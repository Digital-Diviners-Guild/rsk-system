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
                return { source: Item.get(i.itemId), quantity: i.system.quantity }
            });
        if (items.length < 1) return;

        for (const i of items) {
            actor.addItem(i.source, i.quantity);
        }
    }
}