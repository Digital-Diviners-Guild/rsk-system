import RSKConfirmRollDialog from "../../applications/RSKConfirmRollDialog.js";
import RSKPrayer from "../../data/items/RSKPrayer.js";
import RSKSpell from "../../data/items/RSKSpell.js";
import RSKSummonFamiliar from "../../data/items/RSKSummonFamiliar.js";
import RSKActorSheet from "./RSKActorSheet.js";
import { chatItem } from "../../applications/RSKChatLog.js";
import { localizeList } from "../../rsk-localize.js";

export default class RSKCharacterSheet extends RSKActorSheet {
    prayers;
    spells;
    familiars;

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
        context.skills = localizeList(context.system.skills, CONFIG.RSK.skills,
            (obj, index) => obj[index].level);
    }

    _prepareAbilities(context) {
        context.abilities = localizeList(context.system.abilities, CONFIG.RSK.abilities);
    }

    _prepareSpells(context) {
        //todo: this needs some work can probably be more simple
        this.spells = this.actor.items.filter(i => i.type === "spell").reduce((ssb, s) => {
            const spell = RSKSpell.fromSource(s.toObject());
            spell.id = s._id;
            spell.label = s.name;
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

    _prepareSummons(context) {
        this.familiars = Object.values(CONFIG.RSK.defaultSummoningFamiliars).reduce((fs, f) => {
            const familiar = RSKSummonFamiliar.fromSource(f);
            familiar["usageCostLabel"] = familiar.getUsageCostLabel();
            fs[familiar.id] = familiar;
            return fs;
        }, {});
        context.familiars = this.familiars;
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

    async handleSkillCheck(dialogOptions = {}) {
        const rollData = this.actor.getRollData();
        const dialog = RSKConfirmRollDialog.create(rollData, dialogOptions);
        const rollOptions = await dialog();
        if (!rollOptions.rolled) return false;
        const result = await this.actor.useSkill(
            rollOptions.skill,
            rollOptions.ability,
            rollOptions.targetNumberModifier,
            rollOptions.rollType
        );
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
            await chatItem(action);
        } else {
            await super.handleChatItem(itemType, itemId);
        }
    }

    _getAction(type, id) {
        switch (type) {
            case "prayer":
                return this.prayers[id];
            case "spell":
                return this.spells[id];
            case "summonFamiliar":
                return this.familiars[id];
            default:
                return false;
        }
    }
}