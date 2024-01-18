import { fields } from "../fields.js";

export default class RSKActionCollection extends foundry.abstract.DataModel {
    static defineSchema() {
        return {
            actionType: new fields.StringField({ initial: "spell", options: [...Object.keys(CONFIG.RSK.actionTypes)] }),
            actions: new fields.ArrayField(new fields.ObjectField())
        };
    }

    importActions(actor) {
        const items = this.actions
            .map(a => {
                const item = Item.get(a.itemId);
                let newItem = foundry.utils.deepClone(item.toObject());
                newItem.flags = { rsk: { actionCollectionId: this.parent._id } };
                return newItem;
            })
            .filter(a => actor.items.filter(ai => ai.type === a.type && ai.name === a.name).length < 1);
        if (items.length < 1) return;

        actor.createEmbeddedDocuments("Item", items);
        if (actor.flags?.rsk?.actionCollectionIds) {
            actor.update({ "flags.rsk.actionCollectionIds": [...actor.flags.rsk.actionCollectionIds, this.parent._id] });
        } else {
            actor.update({ "flags.rsk.actionCollectionIds": [this.parent._id] });
        }
    }

    removeActions(actor) {
        const items = actor.items
            .filter(ai => ai.flags?.rsk?.actionCollectionId === this.parent._id)
            .map(i => i._id);
        if (items.length > 0) {
            actor.deleteEmbeddedDocuments("Item", items);
        }
        if (actor.flags?.rsk?.actionCollectionIds) {
            actor.update({ "flags.rsk.actionCollectionIds": actor.flags.rsk.actionCollectionIds.filter(i => i !== this.parent._id) });
        }
    }
}