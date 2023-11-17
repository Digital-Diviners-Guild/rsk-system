import RSKItemSheet from "./sheets/RSKItemSheet.js";
import RSKPlayerSheet from "./sheets/RSKPlayerSheet.js";

async function preloadHandlebarsTemplates() {
    const templatePaths = [
        'systems/rsk-system/templates/actors/parts/player-part.hbs'
    ];

    return loadTemplates(templatePaths);
}

Hooks.once("init", function () {
    console.log("initializing...");

    Items.unregisterSheet("core", ItemSheet)
    Items.registerSheet("rsk", RSKItemSheet, { makeDefault: true })

    Actors.unregisterSheet("core", ActorSheet)
    Actors.registerSheet("rsk", RSKPlayerSheet, { makeDefault: true })

    preloadHandlebarsTemplates();

    console.log("rsk ready");
});