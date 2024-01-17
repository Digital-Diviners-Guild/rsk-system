import { fields } from "./fields.js";

export default class RSKActionCollection extends foundry.abstract.DataModel {
    static defineSchema() {
        return {
            //todo: drop down
            actionType: new fields.StringField({ initial: "spell", options: ["prayer", "spell", "summonFamiliar"] }),
            actions: new fields.ArrayField(new fields.ObjectField())
        };
    }

    //todo: block dupe imports
    //todo: remove imports
    importActions(actor) {
        const items = this.actions.map(a => Item.get(a.itemId));
        actor.createEmbeddedDocuments("Item", items);
    }
}