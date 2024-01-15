import RSKConfirmRollDialog from "../../applications/RSKConfirmRollDialog.js";
import RSKPrayer from "../../data/items/RSKPrayer.js";
import RSKSpell from "../../data/items/RSKSpell.js";
import RSKActorSheet from "./RSKActorSheet.js";
import { chatItem } from "../../applications/RSKChatLog.js";

export default class RSKCharacterSheet extends RSKActorSheet {
    prayers;
    spells;

    getData() {
        const context = super.getData();
        this._prepareInventory(context);
        this._prepareSkills(context);
        this._prepareAbilities(context);
        this._prepareSpells(context);
        this._preparePrayers(context);
        this._prepareEquipment(context);
        return context;
    }

    _prepareInventory(context) {
        context.inventoryItems = this.actor.items.filter(i => i.system.hasOwnProperty("slotId"));
        context.usedSlots = this.actor.flags?.rsk?.inventorySlotsUsed ?? 0;
    }

    _prepareSkills(context) {
        context.skills = Object.keys(context.system.skills)
            .map(function (index) {
                return {
                    index: index,
                    label: game.i18n.format(CONFIG.RSK.skills[index]),
                    ...context.system.skills[index]
                }
            });
    }

    //todo: this pattern is appearing a few times, probably something we can abstract
    _prepareAbilities(context) {
        context.abilities = Object.keys(context.system.abilities)
            .map(function (index) {
                return {
                    index: index,
                    label: game.i18n.format(CONFIG.RSK.abilities[index]),
                    level: context.system.abilities[index]
                }
            });
    }

    _prepareSpells(context) {
        this.spells = Object.values(CONFIG.RSK.standardSpellBook).reduce((ssb, s) => {
            const spell = RSKSpell.fromSource(s);
            spell["usageCostLabel"] = spell.getUsageCostLabel();
            ssb[spell.id] = spell;
            return ssb;
        }, {});
        context.spells = this.spells;
    }

    _preparePrayers(context) {
        this.prayers = Object.values(CONFIG.RSK.defaultPrayers).reduce((dp, p) => {
            const prayer = RSKPrayer.fromSource(p);
            prayer["usageCostLabel"] = prayer.getUsageCostLabel();
            dp[prayer.id] = prayer;
            return dp;
        }, {});
        context.prayers = this.prayers;
    }

    _prepareEquipment(context) {
        const equipped = context.items.filter(i => i.system?.equipped && i.system.equipped.isEquipped);
        context.worn = {};
        equipped.map((e) => context.worn[e.system.equipped.slot] = e.name);
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
            const actionId = s.data("actionId");
            await this._getAction(actionType, actionId).use(this.actor)
        });
    }

    //inventory rules poc
    async _onDropItem(event, data) {
        const item = await Item.fromDropData(data);
        // how do we want to identify something that can go in the inventory?
        if (item.system.hasOwnProperty("slotId")) {
            await this.actor.addItem(item)
        }
        else {
            await super._onDropItem(event, data);
        }
    }

    async handleSkillCheck(dialogOptions = {}) {
        const rollData = this.actor.getRollData();
        const dialog = RSKConfirmRollDialog.create(rollData, dialogOptions);
        const rollOptions = await dialog();
        if (!rollOptions.rolled) return false;

        const result = await this.actor.useSkill(rollOptions.skill, rollOptions.ability, rollOptions.rollType);
        //todo: could probably be in a template
        const flavor = `<strong>${rollOptions.skill} | ${rollOptions.ability}</strong>
                  <p>${result.isCritical ? "<em>critical</em>" : ""} ${result.isSuccess ? "success" : "fail"} (${result.margin})</p>`;
        result.rollResult.toMessage({ flavor }, { ...rollOptions });
        return result;
    }

    async handleChatItem(itemType, itemId) {
        const chattedItem = itemType === "prayer" || itemType === "spell"
            ? await chatItem(this._getAction(itemType, itemId))
            : await super.handleChatItem(itemType, itemId);
    }

    _getAction(type, id) {
        switch (type) {
            case "prayer":
                return this.prayers[id];
            case "spell":
                return this.spells[id];
        }
    }
}