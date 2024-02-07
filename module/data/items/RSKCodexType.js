import { fields } from "../fields.js";

export default class RSKCodexType extends foundry.abstract.DataModel {
    static defineSchema() {
        return {
            actionType: new fields.StringField({ initial: "spell", options: [...Object.keys(CONFIG.RSK.codexTypes)] }),
            actions: new fields.ArrayField(new fields.ObjectField())
        };
    }

    importActions(actor) {
        const items = this.actions
            .map(a => {
                const item = Item.get(a.itemId);
                let newItem = foundry.utils.deepClone(item.toObject());
                newItem.flags = { rsk: { codexId: this.parent._id } };
                return newItem;
            })
            .filter(a => actor.items.filter(ai => ai.type === a.type && ai.name === a.name).length < 1);
        if (items.length < 1) return;

        actor.createEmbeddedDocuments("Item", items);
        if (actor.flags?.rsk?.codexIds) {
            actor.update({ "flags.rsk.codexIds": [...actor.flags.rsk.codexIds, this.parent._id] });
        } else {
            actor.update({ "flags.rsk.codexIds": [this.parent._id] });
        }
    }

    removeActions(actor) {
        const items = actor.items
            .filter(ai => ai.flags?.rsk?.codexId === this.parent._id)
            .map(i => i._id);
        if (items.length > 0) {
            actor.deleteEmbeddedDocuments("Item", items);
        }
        if (actor.flags?.rsk?.codexIds) {
            actor.update({ "flags.rsk.codexIds": actor.flags.rsk.codexIds.filter(i => i !== this.parent._id) });
        }
    }
}