import RSKItemSheet from "./sheets/RSKItemSheet";

Hooks.once("init", function () {
    console.log("initializing...");

    Items.unregisterSheet("core", ItemSheet)
    Items.registerSheet("rsk", RSKItemSheet, { makeDefault: true })

    console.log("rsk ready");
});