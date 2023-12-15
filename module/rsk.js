import RSKQualityType from "./data/items/RSKQualityType.js";
import RSKAction from "./data/items/RSKAction.js";
import RSKSpecialFeature from "./data/items/RSKSpecialFeature.js";
import RSKCape from "./data/items/RSKCape.js";
import RSKMaterial from "./data/items/RSKMaterial.js";
import RSKResource from "./data/items/RSKResource.js";
import RSKArmourType from "./data/items/RSKArmourType.js";
import RSKEquipment from "./data/items/RSKEquipment.js";
import RSKBackgroundType from "./data/items/RSKBackgroundType.js";
import RSKSpell from "./data/items/RSKSpell.js";
import RSKPrayer from "./data/items/RSKPrayer.js";

import RSKCharacterType from "./data/actors/RSKCharacterType.js";
import RSKNpc from "./data/actors/RSKNpcType.js";

import RSKItem from "./documents/items/RSKItem.js";
import { RSKItemProxy } from "./documents/items/RSKItemProxy.js";
import RSKActiveEffect from "./documents/items/RSKActiveEffect.js";

import { RSKActorProxy } from "./documents/actors/RSKActorProxy.js";
import RSKActor from "./documents/actors/RSKActor.js";

import RSKItemSheet from "./sheets/items/RSKItemSheet.js";
import RSKQualitySheet from "./sheets/items/RSKQualitySheet.js";

import RSKActorSheet from "./sheets/actors/RSKActorSheet.js";

import RSKConfirmRollDialog from "./applications/RSKConfirmRollDialog.js";

import RSK from "./config.js";
import RSKDice from "./rsk-dice.js";
import RSKMath from "./rsk-math.js";

globalThis.rsk = {
    config: RSK,
};

async function preloadHandlebarsTemplates() {
    const templatePaths = [
        "/systems/rsk/templates/items/parts/edit-damage-entries.hbs",
        "/systems/rsk/templates/items/parts/view-damage-entries.hbs",
        "/systems/rsk/templates/items/parts/edit-range.hbs",
        "/systems/rsk/templates/items/parts/view-range.hbs",
        "/systems/rsk/templates/items/parts/edit-qualities.hbs",
        "/systems/rsk/templates/items/parts/view-qualities.hbs",

        "/systems/rsk/templates/actors/parts/view-items.hbs",
        "/systems/rsk/templates/actors/parts/edit-items.hbs",

        "/systems/rsk/templates/parts/view-effects.hbs",
        "/systems/rsk/templates/parts/edit-effects.hbs"
    ];
    return loadTemplates(templatePaths);
}

Hooks.once("init", function () {
    console.log("initializing...");
    game.rsk = {
        RSKItem,
        RSKActor,
        math: RSKMath
    };

    CONFIG.RSK = RSK;

    CONFIG.Item.documentClass = RSKItemProxy;
    CONFIG.Item.dataModels = {
        quality: RSKQualityType,
        action: RSKAction,
        specialFeature: RSKSpecialFeature,
        cape: RSKCape,
        material: RSKMaterial,
        resource: RSKResource,
        armour: RSKArmourType,
        equipment: RSKEquipment,
        background: RSKBackgroundType,
        spell: RSKSpell,
        prayer: RSKPrayer
    };
    Items.unregisterSheet("core", ItemSheet)
    Items.registerSheet("rsk", RSKItemSheet, { makeDefault: true })
    Items.registerSheet("rsk", RSKQualitySheet, { types: ["quality"], makeDefault: true });

    CONFIG.Actor.documentClass = RSKActorProxy;
    CONFIG.Actor.dataModels = {
        character: RSKCharacterType,
        npc: RSKNpc
    };
    CONFIG.ActiveEffect.documentClass = RSKActiveEffect;
    Actors.unregisterSheet("core", ActorSheet)
    Actors.registerSheet("rsk", RSKActorSheet, { makeDefault: true })

    preloadHandlebarsTemplates()
    console.log("rsk ready");
});

Hooks.once("renderActorSheet", function (sheet, html, data) {
    sheet.activateTab(data.actor.type === "character"
        ? "skills"
        : "description");
});

Hooks.once("ready", function () {
    RSKDice.addClickListener($("i.fa-dice-d20"), async (ev) => {
        const currentCharacter = game.users?.current?.character;
        if (currentCharacter) {
            const rollData = currentCharacter.getRollData();
            const dialog = RSKConfirmRollDialog.create(rollData, options)
            const rollOptions = await dialog();
            RSKDice.handlePlayerRoll(rollOptions);
        } else {
            RSKDice.handleBasicRoll();
        }
    });
});