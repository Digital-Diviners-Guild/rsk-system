import RSKAction from "./data/items/RSKAction.js";
import RSKArmourType from "./data/items/RSKArmourType.js";
import RSKBackgroundType from "./data/items/RSKBackgroundType.js";
import RSKEquipment from "./data/items/RSKEquipment.js";
import RSKMaterial from "./data/items/RSKMaterial.js";
import RSKAmmunitionType from "./data/items/RSKAmmunitionType.js";
import RSKPrayer from "./data/items/RSKPrayer.js";
import RSKQualityType from "./data/items/RSKQualityType.js";
import RSKResource from "./data/items/RSKResource.js";
import RSKSpecialFeature from "./data/items/RSKSpecialFeature.js";
import RSKSpell from "./data/items/RSKSpell.js";

import RSKCharacterType from "./data/actors/RSKCharacterType.js";
import RSKNpc from "./data/actors/RSKNpcType.js";
import RSKDeath from "./data/actors/RSKDeath.js";

import RSKActiveEffect from "./documents/items/RSKActiveEffect.js";
import { RSKItemProxy } from "./documents/items/RSKItemProxy.js";

import RSKActor from "./documents/actors/RSKActor.js";
import { RSKActorProxy } from "./documents/actors/RSKActorProxy.js";

import RSKItemSheet from "./sheets/items/RSKItemSheet.js";

import RSKActorSheet from "./sheets/actors/RSKActorSheet.js";

import RSKChatLog, { onRenderChatMessage } from "./applications/RSKChatLog.js";
import RSK from "./config.js";
import RSKRuneType from "./data/items/RSKRune.js";
import { customizeStatusEffects } from "./effects/statuses.js";
import RSKDice from "./rsk-dice.js";
import RSKMath from "./rsk-math.js";
import RSKCharacterSheet from "./sheets/actors/RSKCharacterSheet.js";
import RSKNpcSheet from "./sheets/actors/RSKNpcSheet.js";
import RSKCapeType from "./data/items/RSKCapeType.js";
import RSKActionSheet from "./sheets/items/RSKActionSheet.js";
import RSKActionCollection from "./data/items/RSKActionCollectionType.js";
import RSKActionCollectionSheet from "./sheets/items/RSKActionCollectionSheet.js";
import RSKItemCollectionSheet from "./sheets/items/RSKItemCollectionSheet.js";
import RSKRuneSheet from "./sheets/items/RSKRuneSheet.js";
import RSKEquipmentSheet from "./sheets/items/RSKEquipmentSheet.js";
import RSKItemCollection from "./data/items/RSKItemCollectionType.js";
import RSKDeathSheet from "./sheets/actors/RSKDeathSheet.js";
import RSKSummoning from "./data/items/RSKSummoning.js";

globalThis.rsk = {
    config: RSK,
};

async function preloadHandlebarsTemplates() {
    const templatePaths = [
        "/systems/rsk/templates/items/parts/edit-damage-entries.hbs",
        "/systems/rsk/templates/items/parts/view-damage-entries.hbs",
        "/systems/rsk/templates/items/parts/edit-range.hbs",
        "/systems/rsk/templates/items/parts/view-range.hbs",

        "/systems/rsk/templates/actors/parts/view-items.hbs",
        "/systems/rsk/templates/actors/parts/edit-items.hbs",

        "/systems/rsk/templates/parts/view-effects.hbs",
        "/systems/rsk/templates/parts/edit-effects.hbs"
    ];
    return loadTemplates(templatePaths);
}

Hooks.once("init", function () {
    console.log("initializing...");
    // todo: map all of our api
    game.rsk = {
        item: Item,
        actor: RSKActor,
        math: RSKMath,
        dice: RSKDice
    };

    CONFIG.RSK = RSK;

    CONFIG.Item.documentClass = RSKItemProxy;
    CONFIG.Item.dataModels = {
        quality: RSKQualityType,
        action: RSKAction,
        specialFeature: RSKSpecialFeature,
        cape: RSKCapeType,
        material: RSKMaterial,
        ammunition: RSKAmmunitionType,
        resource: RSKResource,
        armour: RSKArmourType,
        equipment: RSKEquipment,
        background: RSKBackgroundType,
        spell: RSKSpell,
        prayer: RSKPrayer,
        summoning: RSKSummoning,
        rune: RSKRuneType,
        actionCollection: RSKActionCollection,
        itemCollection: RSKItemCollection
    };
    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("rsk", RSKItemSheet, { makeDefault: true });
    Items.registerSheet("rsk", RSKActionSheet, { types: ["action", "spell", "prayer", "summoning"], makeDefault: true });
    Items.registerSheet("rsk", RSKActionCollectionSheet, { types: ["actionCollection"], makeDefault: true });
    Items.registerSheet("rsk", RSKItemCollectionSheet, { types: ["itemCollection"], makeDefault: true });
    Items.registerSheet("rsk", RSKRuneSheet, { types: ["rune"], makeDefault: true });
    Items.registerSheet("rsk", RSKEquipmentSheet, { types: ["equipment", "armour"], makeDefault: true });

    CONFIG.Actor.documentClass = RSKActorProxy;
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

    preloadHandlebarsTemplates()
    customizeStatusEffects();


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

    await ChatMessage.create({
        content: `
    <h3>Welcome to RSK!</h3>
    <p>
    This system is <em>very early</em> in development. This means there are likely bugs, and missing features.
    Additionally, we have not yet hit a stable version. This means that each update may break things, 
    or be incompatible with the previous version. We apologize for the inconvenience.
    </p>
    <p>
    Please submit feedback, bugs, and feature requests here: <a href=https://github.com/qmarsala/rsk-system/issues target="_blank">GitHub: RSK</a>
    </p>
    ` });
});