import RSKItemSheet from "./sheets/RSKItemSheet.js";
import RSKActorSheet from "./sheets/RSKActorSheet.js";

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
    Actors.registerSheet("rsk", RSKActorSheet, { makeDefault: true })

    preloadHandlebarsTemplates();

    console.log("rsk ready");
});