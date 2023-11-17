import RSKItemSheet from "./sheets/RSKItemSheet.js";
import RSKActorSheet from "./sheets/RSKActorSheet.js";

Hooks.once("init", function () {
    console.log("initializing...");

    Items.unregisterSheet("core", ItemSheet)
    Items.registerSheet("rsk", RSKItemSheet, { makeDefault: true })

    Actors.unregisterSheet("core", ActorSheet)
    Actors.registerSheet("rsk", RSKActorSheet, { makeDefault: true })

    console.log("rsk ready");
});