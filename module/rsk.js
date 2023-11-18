import RSKResourceSheet from "./sheets/RSKResourceSheet.js";
import RSKResourceData from "./data/RSKResourceData.js";

async function preloadHandlebarsTemplates() {
    const templatePaths = [
        'systems/rsk-system/templates/actors/parts/hello-part.hbs'
    ];

    return loadTemplates(templatePaths);
}

Hooks.once("init", function () {
    console.log("initializing...");

    Items.unregisterSheet("core", ItemSheet)
    Items.registerSheet("rsk", RSKResourceSheet, { makeDefault: true })

    CONFIG.Item.systemDataModels.resource = RSKResourceData;

    preloadHandlebarsTemplates();

    console.log("rsk ready");
});