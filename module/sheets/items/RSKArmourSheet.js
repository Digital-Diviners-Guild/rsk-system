import RSKItemSheet from "./RSKItemSheet.js";

export default class RSKArmourSheet extends RSKItemSheet {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["rsk", "sheet", "item"],
            width: 600,
            height: 420,
            tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }],
        });
    }

    get template() {
        return `systems/rsk/templates/items/armour-sheet.hbs`
    }

    getData() {
        const context = super.getData();
        context.showAwardedFor = context.system.activeSlot === "cape";
        return context;
    }
}