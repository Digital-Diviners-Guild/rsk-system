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

import RSKActiveEffect from "./documents/effects/RSKActiveEffect.js";

import RSKActor from "./documents/actors/RSKActor.js";
import RSKActorSheet from "./sheets/actors/RSKActorSheet.js";
import RSKItem from "./documents/items/RSKItem.js";
import RSKItemSheet from "./sheets/items/RSKItemSheet.js";
import RSKChatLog, { onRenderChatMessage } from "./applications/RSKChatLog.js";
import RSK from "./config.js";
import RSKRuneType from "./data/items/RSKRune.js";
import { customizeStatusEffects } from "./effects/statuses.js";
import RSKDice from "./rsk-dice.js";
import RSKMath from "./rsk-math.js";
import RSKCharacterSheet from "./sheets/actors/RSKCharacterSheet.js";
import RSKDeathSheet from "./sheets/actors/RSKDeathSheet.js";
import RSKCapeType from "./data/items/RSKCapeType.js";
import RSKNpcActionSheet from "./sheets/items/RSKNpcActionSheet.js";
import RSKSummoningSheet from "./sheets/items/RSKSummoningSheet.js";
import RSKPrayerSheet from "./sheets/items/RSKPrayerSheet.js";
import RSKSpellSheet from "./sheets/items/RSKSpellSheet.js";
import RSKCodexType from "./data/items/RSKCodexType.js";
import RSKCodexSheet from "./sheets/items/RSKCodexSheet.js";
import RSKItemCollectionSheet from "./sheets/items/RSKItemCollectionSheet.js";
import RSKRuneSheet from "./sheets/items/RSKRuneSheet.js";
import RSKItemCollection from "./data/items/RSKItemCollectionType.js";
import RSKSummoning from "./data/items/RSKSummoning.js";
import RSKRangedWeapon from "./data/items/RSKRangedWeapon.js";
import RSKThrownWeapon from "./data/items/RSKThrownWeapon.js";
import RSKMeleeWeapon from "./data/items/RSKMeleeWeapon.js";
import RSKNpcAction from "./data/items/RSKNpcAction.js";
import RSKNpcSheet from "./sheets/actors/RSKNpcSheet.js";

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
        item: RSKItem,
        actor: RSKActor,
        math: RSKMath,
        dice: RSKDice
    };

    CONFIG.RSK = RSK;
    CONFIG.Item.documentClass = RSKItem;
    CONFIG.Item.dataModels = {
        quality: RSKQualityType,
        npcAction: RSKNpcAction,
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
        codex: RSKCodexType,
        itemCollection: RSKItemCollection,
        rangedWeapon: RSKRangedWeapon,
        meleeWeapon: RSKMeleeWeapon,
        thrownWeapon: RSKThrownWeapon
    };
    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("rsk", RSKItemSheet, { makeDefault: true });
    Items.registerSheet("rsk", RSKNpcActionSheet, { types: ["npcAction"], makeDefault: true });
    Items.registerSheet("rsk", RSKSpellSheet, { types: ["spell"], makeDefault: true });
    Items.registerSheet("rsk", RSKSummoningSheet, { types: ["summoning"], makeDefault: true });
    Items.registerSheet("rsk", RSKPrayerSheet, { types: ["prayer"], makeDefault: true });
    Items.registerSheet("rsk", RSKCodexSheet, { types: ["codex"], makeDefault: true });
    Items.registerSheet("rsk", RSKItemCollectionSheet, { types: ["itemCollection"], makeDefault: true });
    Items.registerSheet("rsk", RSKRuneSheet, { types: ["rune"], makeDefault: true });

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
        Thank you for exploring the RSK system. We're currently in the <strong>early stages of development</strong>, which is an exciting time filled with rapid changes and updates. As we work towards a stable release, you might encounter bugs and notice features that are still under construction.
        </p>
        <p>
        Due to the nature of our development process, updates may occasionally disrupt compatibility with earlier versions. While we strive to minimize these occurrences, some disruptions are inevitable. We appreciate your understanding and patience during this phase.
        </p>
        <p>
        Your input is invaluable to us. For feedback, bug reports, or feature suggestions, please contribute through our <a href="https://github.com/qmarsala/rsk-system/issues" target="_blank">GitHub issues page</a>. Your insights will help us improve and refine RSK.
        </p>
    ` });
});