import RSKConfirmRollDialog from "../../applications/RSKConfirmRollDialog.js";
import RSKActorSheet from "./RSKActorSheet.js";
import { chatItem } from "../../applications/RSKChatLog.js";
import RSKImproveYourCharacterDialog from "../../applications/RSKImproveYourCharacterDialog.js";
import { localizeObject } from "../../rsk-localize.js";
import { RSKMeleeAction, RSKRangedAction, castAction } from "../../rsk-actions.js";

export default class RSKCharacterSheet extends RSKActorSheet {
    meleeAttacks;
    rangedAttacks;

    getData() {
        const context = super.getData();
        this._prepareInventory(context);
        this._prepareSkills(context);
        this._prepareAbilities(context);
        this._prepareSpells(context);
        this._preparePrayers(context);
        this._prepareSummons(context);
        this._prepareEquipment(context);
        return context;
    }

    _prepareInventory(context) {
        context.inventoryItems = this.actor.items.filter(i => i.system.hasOwnProperty("slotId"));
        context.usedSlots = this.actor.flags?.rsk?.inventorySlotsUsed ?? 0;
    }

    _prepareSkills(context) {
        context.skills = localizeObject(context.system.skills, CONFIG.RSK.skills);
    }

    _prepareAbilities(context) {
        context.abilities = localizeObject(context.system.abilities, CONFIG.RSK.abilities);
    }

    _prepareSpells(context) {
        context.spells = this.actor.items.filter(i => i.type === "spell");
    }

    _preparePrayers(context) {
        context.prayers = this.actor.items.filter(i => i.type === "prayer");
    }

    _prepareSummons(context) {
        context.familiars = this.actor.items.filter(i => i.type === "summoning");
    }

    _prepareEquipment(context) {
        const equipped = context.items.filter(i => i.system?.equipped && i.system.equipped.isEquipped);
        context.worn = {};
        equipped.map((e) => context.worn[e.system.equipped.slot] = e.name);

        // do we want to also look for shields with block quality to add
        // a block action here?
        const isWeapon = (e) => e.system.equipped.slot === "weapon"
            || e.system.equipped.slot === "arm";
        const meleeWeapons = equipped.filter(e =>
            isWeapon(e) && e.system.usageType === "melee");
        const rangedWeapons = equipped.filter(e =>
            isWeapon(e) && e.system.type === "dart" || e.system.usageType === "ranged");

        this.meleeAttacks = meleeWeapons.reduce((ws, w) => this._mapToActionDictionary(RSKMeleeAction, ws, w), {});
        context.meleeAttacks = this.meleeAttacks;

        this.rangedAttacks = rangedWeapons.reduce((ws, w) => this._mapToActionDictionary(RSKRangedAction, ws, w), {});
        context.rangedAttacks = this.rangedAttacks;
    }

    activateListeners(html) {
        super.activateListeners(html);
        game.rsk.dice.addClickListener(html.find(".roll-check"),
            async (ev) => {
                const target = $(ev.currentTarget);
                const type = target.data("type");
                const value = target.data("value");
                const dialogOptions = type === "skill" ? { defaultSkill: value } : { defaultAbility: value };
                await this.handleSkillCheck(dialogOptions);
            });
        html.find('.use-action').click(async ev => {
            const s = $(ev.currentTarget);
            const actionType = s.data("actionType");
            if (["magic", "prayer", "summoning"].includes(actionType)) {
                await castAction(this.actor, actionType);
            } else {
                const actionId = s.data("actionId");
                await this._getAction(actionType, actionId).use(this.actor)
            }
        });

        html.find('.increase-item-quantity').click(async ev => {
            const s = $(ev.currentTarget);
            const itemId = s.data("itemId");
            await this.handleIncreaseItemQuantity(itemId);
        });
        html.find('.decrease-item-quantity').click(async ev => {
            const s = $(ev.currentTarget);
            const itemId = s.data("itemId");
            await this.handleDecreaseItemQuantity(itemId);
        });

        html.find('.improve-your-character').click(async ev => {
            await this.handleImproveYourCharacter();
        });
    }

    async handleSkillCheck(dialogOptions = {}) {
        const rollData = this.actor.getRollData();
        const dialog = RSKConfirmRollDialog.create(rollData, dialogOptions);
        const rollOptions = await dialog();
        if (!rollOptions.rolled) return false;
        const result = await this.actor.useSkill(rollOptions);
        //todo: could probably be in a template
        const flavor = `<strong>${rollOptions.skill} | ${rollOptions.ability}</strong> TN: ${result.targetNumber}
                  <p>${result.isCritical ? "<em>critical</em>" : ""} ${result.isSuccess ? "success" : "fail"} (${result.margin})</p>`;
        result.rollResult.toMessage({ flavor }, { ...rollOptions });
        return result;
    }

    async handleIncreaseItemQuantity(itemId) {
        const item = this.actor.items.find(i => i.id === itemId);
        this.actor.addItem(item)
    }

    async handleDecreaseItemQuantity(itemId) {
        const item = this.actor.items.find(i => i.id === itemId);
        this.actor.removeItem(item)
    }

    async handleChatItem(itemType, itemId) {
        const action = this._getAction(itemType, itemId);
        if (action) {
            await chatItem({ name: action.label, system: action.actionData });
        } else {
            await super.handleChatItem(itemType, itemId);
        }
    }

    //todo: 
    // - ensure we can't gain an ability point for a skill that started at level 5
    // - see if we can do it in one dialog instead of two? or maybe this is fine
    async handleImproveYourCharacter() {
        const eligibleSkills = localizeObject(this.actor.system.skills, CONFIG.RSK.skills,
            (obj, i) => obj[i].level,
            (val) => val.used && val.level < 10);
        if (eligibleSkills.length < 1) return;
        const eligibleAbilities = localizeObject(this.actor.system.abilities, CONFIG.RSK.abilities,
            (obj, i) => obj[i].level,
            (val) => val.level < 8);

        const skillDialog = RSKImproveYourCharacterDialog.create({ skills: eligibleSkills });
        const skillResult = await skillDialog();
        if (!(skillResult.confirmed || skillResult.selectedSkill)) return;
        // thought: stuff like this should probably be handled reactively
        // the more we do stuff reactively, the easier it will to extend through modules later
        this.actor.clearUsedSkills();
        const gainedAbility = this.actor.increaseSkillLevel(skillResult.selectedSkill);
        if (!gainedAbility) return;

        const abilityDialog = RSKImproveYourCharacterDialog.create({ abilities: eligibleAbilities }, { showSkillSelect: false, showAbilitySelect: true });
        const abilityResult = await abilityDialog();
        if (!(abilityResult.confirmed || abilityResult.selectedAbility)) return;
        this.actor.increaseAbilityLevel(abilityResult.selectedAbility);
    }

    //inventory rules poc
    async _onDropItem(event, data) {
        const item = await Item.fromDropData(data);
        // how do we want to identify something that can go in the inventory?
        if (item.system.hasOwnProperty("slotId")) {
            await this.actor.addItem(item, item.system.quantity);
        }
        else {
            await super._onDropItem(event, data);
        }
    }

    //todo: finish killing this
    _mapToActionDictionary(factory, datas, data) {
        const action = factory.create(data._id, data.name, data.system);
        datas[action.id] = action;
        return datas;
    }

    //todo: finish killing this
    _getAction(type, id) {
        switch (type) {
            case "melee":
                return this.meleeAttacks[id];
            case "ranged":
                return this.rangedAttacks[id];
            default:
                return false;
        }
    }
}