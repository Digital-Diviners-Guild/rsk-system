import RSKItemSheet from "./sheets/RSKItemSheet.js";
import RSKCharacterSheet from "./sheets/RSKCharacterSheet.js";

async function preloadHandlebarsTemplates() {
    const templatePaths = [
        'systems/rsk-system/templates/actors/parts/hello-part.hbs'
    ];

    return loadTemplates(templatePaths);
}

Hooks.once("init", function () {
    console.log("initializing...");

    Items.unregisterSheet("core", ItemSheet)
    Items.registerSheet("rsk", RSKItemSheet, { makeDefault: true })

    Actors.unregisterSheet("core", ActorSheet)
    Actors.registerSheet("rsk", RSKCharacterSheet, { makeDefault: true })

    preloadHandlebarsTemplates();

    console.log("rsk ready");
});