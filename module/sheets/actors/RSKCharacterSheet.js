import RSKConfirmRollDialog from "../../applications/RSKConfirmRollDialog.js";
import RSKActorSheet from "./RSKActorSheet.js";
import RSKImproveYourCharacterDialog from "../../applications/RSKImproveYourCharacterDialog.js";
import { localizeObject, localizeText } from "../../rsk-localize.js";
import { attackAction, castAction } from "../../rsk-actions.js";
import { calculateUsedSlots } from "../../rsk-inventory.js";

export default class RSKCharacterSheet extends RSKActorSheet {
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
        context.inventoryItems = this.actor.items.filter(i => i.system.hasOwnProperty("maxStackSize"));
        context.usedSlots = calculateUsedSlots(this.actor.items);
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
        const equipped = context.items.filter(i => i.system.isEquipped);
        context.worn = {};
        equipped.map((e) => context.worn[e.system.equippedInSlot] = e.name);
        context.equippedIsRanged = equipped.filter(x => x.type === "weapon" && (x.system.isRanged || x.system.isThrown)).length > 0;
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
        const rollData = this.actor.system.getRollData();
        const dialog = RSKConfirmRollDialog.create(rollData, dialogOptions);
        const rollOptions = await dialog();
        if (!rollOptions.rolled) return false;
        const result = await this.actor.system.useSkill(rollOptions);
        //todo: could probably be in a template
        const flavor = `<strong>${rollOptions.skill} | ${rollOptions.ability}</strong> TN: ${result.targetNumber}
                  <p>${result.isCritical ? "<em>critical</em>" : ""} ${result.isSuccess ? "success" : "fail"} (${result.margin})</p>`;
        result.rollResult.toMessage({ flavor }, { ...rollOptions });
        return result;
    }

    async handleIncreaseItemQuantity(itemId) {
        const item = this.actor.items.find(i => i.id === itemId);
        this.actor.system.addItem(item)
    }

    async handleDecreaseItemQuantity(itemId) {
        const item = this.actor.items.find(i => i.id === itemId);
        this.actor.system.removeItem(item)
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
        this.actor.system.clearUsedSkills();
        const gainedAbility = this.actor.system.increaseSkillLevel(skillResult.selectedSkill);
        if (!gainedAbility) return;

        const abilityDialog = RSKImproveYourCharacterDialog.create({ abilities: eligibleAbilities }, { showSkillSelect: false, showAbilitySelect: true });
        const abilityResult = await abilityDialog();
        if (!(abilityResult.confirmed || abilityResult.selectedAbility)) return;
        this.actor.system.increaseAbilityLevel(abilityResult.selectedAbility);
    }

    async characterAttackAction() {
        //todo: dual wield support
        const weapon = this.actor.system
            .getActiveItems()
            .find(i => i.isWeapon() && i.system.equippedInSlot === "weapon")
            ?? {
            name: localizeText("RSK.Unarmed"),
            system: {
                weaponType: "simple",
                isMelee: true,
                damageEntries: { crush: 1 }
            }
        };
        attackAction(this.actor, weapon);
    }

    async characterCastSpell() {
        await castAction(this.actor, "magic");
    }

    async characterCastPrayer() {
        await castAction(this.actor, "prayer");
    }

    async characterCastSummons() {
        await castAction(this.actor, "summoning");
    }

    //inventory rules poc
    async _onDropItem(event, data) {
        const item = await Item.fromDropData(data);
        //todo: how do we want to identify something that can go in the inventory? 
        // its fine if this is the answer for now, but it feels a little meh.
        if (item.system.hasOwnProperty("maxStackSize")) {
            await this.actor.system.addItem(item, item.system.quantity);
        }
        else {
            await super._onDropItem(event, data);
        }
    }
}