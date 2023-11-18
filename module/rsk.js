import RSKResourceSheet from "./sheets/RSKResourceSheet.js";
import RSKCharacterSheet from "./sheets/RSKCharacterSheet.js";
import RSKNpcSheet from "./sheets/RSKNpcSheet.js";
import RSKResourceData from "./data/RSKResourceData.js";

async function preloadHandlebarsTemplates() {
    const templatePaths = [];
    return loadTemplates(templatePaths);
}

Hooks.once("init", function () {
    console.log("initializing...");

    Items.unregisterSheet("core", ItemSheet)
    Items.registerSheet("rsk", RSKResourceSheet, { makeDefault: true })
    
    Actors.unregisterSheet("core", ActorSheet)
    Actors.registerSheet("rsk", RSKCharacterSheet, { makeDefault: true })
    Actors.registerSheet("rsk", RSKNpcSheet)

    CONFIG.Item.dataModels.resource = RSKResourceData;

    console.log("rsk ready");
});