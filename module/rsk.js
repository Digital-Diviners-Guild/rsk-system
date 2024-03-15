import RSKArmourType from "./data/items/RSKArmourType.js";
import RSKBackgroundType from "./data/items/RSKBackgroundType.js";
import RSKConsumable from "./data/items/RSKConsumable.js"
import RSKConsumableSheet from "./sheets/items/RSKConsumableSheet.js"

import RSKCharacterType from "./data/actors/RSKCharacterType.js";
import RSKNpc from "./data/actors/RSKNpcType.js";
import RSKDeath from "./data/actors/RSKDeath.js";

import RSKActiveEffect from "./documents/effects/RSKActiveEffect.js";

import RSKActor from "./documents/actors/RSKActor.js";
import RSKActorSheet from "./sheets/actors/RSKActorSheet.js";
import RSKItem from "./documents/items/RSKItem.js";
import RSKItemSheet from "./sheets/items/RSKItemSheet.js";
import RSKChatLog, { onRenderChatMessage, registerActorEventHandlers } from "./applications/RSKChatLog.js";
import RSK from "./config.js";
import { customizeStatusEffects } from "./effects/statuses.js";
import RSKDice from "./rsk-dice.js";
import RSKMath from "./rsk-math.js";
import RSKCharacterSheet from "./sheets/actors/RSKCharacterSheet.js";
import RSKDeathSheet from "./sheets/actors/RSKDeathSheet.js";
import RSKNpcActionSheet from "./sheets/items/RSKNpcActionSheet.js";
import RSKCodexType from "./data/items/RSKCodexType.js";
import RSKCodexSheet from "./sheets/items/RSKCodexSheet.js";
import RSKItemCollectionSheet from "./sheets/items/RSKItemCollectionSheet.js";
import RSKItemCollection from "./data/items/RSKItemCollectionType.js";
import RSKWeapon from "./data/items/RSKWeapon.js";
import RSKNpcAction from "./data/items/RSKNpcAction.js";
import RSKNpcSheet from "./sheets/actors/RSKNpcSheet.js";
import RSKWeaponSheet from "./sheets/items/RSKWeaponSheet.js";
import { setBoxes } from "../templates/helpers/rsk-helpers.js";
import { localizeText } from "./rsk-localize.js";
import RSKCastable from "./data/items/RSKCastable.js";
import RSKItemType from "./data/items/RSKItemType.js";
import RSKItemSheet2 from "./sheets/items/RSKItemSheet2.js";

globalThis.rsk = {
    config: RSK,
};

async function preloadHandlebarsTemplates() {
    const templatePaths = [
        "/systems/rsk/templates/items/parts/edit-damage-entries.hbs",
        "/systems/rsk/templates/items/parts/view-damage-entries.hbs",
        "/systems/rsk/templates/items/parts/edit-range.hbs",
        "/systems/rsk/templates/items/parts/view-range.hbs",
        "/systems/rsk/templates/items/parts/outcome.hbs",

        "/systems/rsk/templates/actors/parts/view-items.hbs",
        "/systems/rsk/templates/actors/parts/view-inventory.hbs",
        "/systems/rsk/templates/actors/parts/edit-items.hbs",
        "/systems/rsk/templates/actors/parts/character-main-content.hbs",
        "/systems/rsk/templates/actors/parts/character-sidebar-details.hbs",
        "/systems/rsk/templates/actors/parts/character-applications.hbs",
        "/systems/rsk/templates/actors/parts/npc-main-content.hbs",
        "/systems/rsk/templates/actors/parts/npc-applications.hbs",
        "/systems/rsk/templates/actors/parts/npc-sidebar-details.hbs",

        "/systems/rsk/templates/parts/view-effects.hbs",
        "/systems/rsk/templates/parts/edit-effects.hbs"
    ];
    return loadTemplates(templatePaths);
}

Hooks.once("init", function () {
    console.log("initializing...");
    // todo: map all of our api
    game.rsk = {
        item: RSKItem,
        actor: RSKActor,
        math: RSKMath,
        dice: RSKDice,
        featureFlags: {
            characterDefenseTests: true
        }
    };

    CONFIG.Combat.initiative = {
        formula: '2d6 + @armourValue'
    };

    CONFIG.RSK = RSK;
    CONFIG.Item.documentClass = RSKItem;
    CONFIG.Item.dataModels = {
        item: RSKItemType,
        consumable: RSKConsumable,
        castable: RSKCastable,
        weapon: RSKWeapon,
        armour: RSKArmourType,
        npcAction: RSKNpcAction,
        background: RSKBackgroundType,
        codex: RSKCodexType,
        itemCollection: RSKItemCollection,
    };
    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("rsk", RSKItemSheet, { makeDefault: true });
    Items.registerSheet("rsk", RSKItemSheet2, { types: ["item"], makeDefault: true });
    Items.registerSheet("rsk", RSKConsumableSheet, { types: ["consumable"], makeDefault: true });
    Items.registerSheet("rsk", RSKWeaponSheet, { types: ["weapon"], makeDefault: true });
    Items.registerSheet("rsk", RSKNpcActionSheet, { types: ["npcAction"], makeDefault: true });
    //todo: Items.registerSheet("rsk", RSKCastableSheet, { types: ["castable"], makeDefault: true });
    Items.registerSheet("rsk", RSKCodexSheet, { types: ["codex"], makeDefault: true });
    Items.registerSheet("rsk", RSKItemCollectionSheet, { types: ["itemCollection"], makeDefault: true });

    CONFIG.Actor.documentClass = RSKActor;
    CONFIG.Actor.dataModels = {
        character: RSKCharacterType,
        npc: RSKNpc,
        death: RSKDeath
    };
    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("rsk", RSKActorSheet, { makeDefault: true });
    Actors.registerSheet("rsk", RSKCharacterSheet, { types: ["character"], makeDefault: true });
    Actors.registerSheet("rsk", RSKNpcSheet, { types: ["npc"], makeDefault: true });
    Actors.registerSheet("rsk", RSKDeathSheet, { types: ["death"], makeDefault: true });

    CONFIG.ActiveEffect.legacyTransferral = false;
    CONFIG.ActiveEffect.documentClass = RSKActiveEffect;
    CONFIG.ui.chat = RSKChatLog;

    Hooks.on("renderChatMessage", onRenderChatMessage);

    preloadHandlebarsTemplates();
    Handlebars.registerHelper({ setBoxes });
    customizeStatusEffects();
    registerActorEventHandlers();

    console.log("rsk ready");
});

Hooks.once("ready", async function () {
    RSKDice.addClickListener($("i.fa-dice-d20"), async (ev) => {
        const currentCharacter = game.users?.current?.character;
        if (currentCharacter) {
            await currentCharacter.sheet.handleSkillCheck();
        } else {
            RSKDice.handleBasicRoll();
        }
    });

    // todo: explore Dialog
    // could probably use it instead of creating our own 
    const d = new Dialog({
        title: "Early Access Disclaimer",
        content: `
        <h3>Welcome to RSK!</h3>
        <p>
        Thank you for exploring the RSK system. We're currently in the <strong>early stages of development</strong>, which is an exciting time filled with rapid changes and updates. As we work towards a stable release, you might encounter bugs and notice features that are still under construction.
        </p>
        <p>
        Due to the nature of our development process, updates may occasionally disrupt compatibility with earlier versions. While we strive to minimize these occurrences, some disruptions are inevitable. We appreciate your understanding and patience during this phase.
        </p>
        <p>
        Your input is invaluable to us. For feedback, bug reports, or feature suggestions, please contribute through our <a href="https://github.com/qmarsala/rsk-system/issues" target="_blank">GitHub issues page</a>. Your insights will help us improve and refine RSK.
        </p>
        <em>
        Please consider <a target="_blank" href="https://ko-fi.com/digitaldivinersguild">
        buying us an Energy Potion</a> to help support future development.
        </em>
        <p>
        Thanks,<br /> Digital Diviners Guild.
        </p>
    ` ,
        buttons: {
            ok: {
                icon: '<i class="fas fa-check"></i>',
                label: localizeText("RSK.Understood"),
                callback: () => console.log("Welcome dialog acknowledged.")
            }
        },
        default: "ok",
        render: html => console.log("Rendering welcome dialog"),
        close: html => console.log("Welcome dialog closed.")
    });
    d.render(true);
});