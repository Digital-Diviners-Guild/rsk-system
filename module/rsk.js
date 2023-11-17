import RSKItemSheet from "./sheets/RSKItemSheet.js";
import RSKActorSheet from "./sheets/RSKActorSheet.js";

Hooks.once("init", function () {
    console.log("initializing...");

    Items.unregisterSheet("core", ItemSheet)
    Items.unregisterSheet("core", ActorSheet)
    Items.registerSheet("rsk", RSKItemSheet, { makeDefault: true })
    Items.registerSheet("rsk", RSKActorSheet, { makeDefault: true })

    console.log("rsk ready");
});