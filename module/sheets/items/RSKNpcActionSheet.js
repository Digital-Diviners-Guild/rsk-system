import RSKItemSheet from "./RSKItemSheet.js";

export default class RSKNpcActionSheet extends RSKItemSheet {
    get template() {
        return `systems/rsk/templates/items/npc-action-sheet.hbs`
    }

    getData() {
        const context = super.getData();
        context.config = CONFIG.RSK;
        return context;
    }
}