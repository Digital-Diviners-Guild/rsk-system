import RSKItemSheet from "./RSKItemSheet.js";

export default class RSKConsumableSheet extends RSKItemSheet {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["rsk", "sheet", "item"],
            width: 600,
            height: 420,
            tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }],
        });
    }

    get template() {
        return `systems/rsk/templates/items/consumable-sheet.hbs`
    }
}