import RSKItem from "./documents/RSKItem.js";
import RSKActor from "./documents/RSKActor.js";

import RSKItemSheet from "./sheets/RSKItemSheet.js";
import RSKActorSheet from "./sheets/RSKActorSheet.js";

import RSK from "./config.js";

globalThis.rsk = {
    config: RSK,
};

async function preloadHandlebarsTemplates() {
    const templatePaths = [
        "/systems/rsk-system/templates/items/parts/edit-damage-entries.hbs",
        "/systems/rsk-system/templates/items/parts/view-damage-entries.hbs",
        "/systems/rsk-system/templates/items/parts/edit-range.hbs",
        "/systems/rsk-system/templates/items/parts/view-range.hbs",

        "/systems/rsk-system/templates/parts/view-items.hbs",
        "/systems/rsk-system/templates/parts/edit-items.hbs"
    ];
    return loadTemplates(templatePaths);
}

Hooks.once("init", function () {
    console.log("initializing...");
    game.rsk = {
        RSKItem,
        RSKActor
    };

    CONFIG.RSK = RSK;
    CONFIG.Actor.documentClass = RSKActor;
    CONFIG.Item.documentClass = RSKItem;

    Items.unregisterSheet("core", ItemSheet)
    Items.registerSheet("rsk", RSKItemSheet, { makeDefault: true })

    Actors.unregisterSheet("core", ActorSheet)
    Actors.registerSheet("rsk", RSKActorSheet, { makeDefault: true })

    preloadHandlebarsTemplates()
    console.log("rsk ready");
});