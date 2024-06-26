import RSKActorSheet from "./RSKActorSheet.js";
import RSKImproveYourCharacterDialog from "../../applications/RSKImproveYourCharacterDialog.js";
import { localizeObject, localizeText } from "../../rsk-localize.js";
import { calculateUsedSlots } from "../../rsk-inventory.js";
import { uiService } from "../../rsk-ui-service.js";
import RSKWeapon from "../../data/items/RSKWeapon.js";

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
        context.armourValue = this.actor.system.getArmourValue();
        context.needsApplyBackgrounds = this.actor.items.some(i => i.type === "background" && !i.system.isApplied());
        context.canImproveCharacter = Object.keys(this.actor.system.skills)
            .some(i => this.actor.system.skills[i].used
                && this.actor.system.skills[i].level < 10);
        return context;
    }

    _prepareInventory(context) {
        //todo: this sets the actual item as the item so we can call methods on it
        // perhaps it would be better to 'toObject' them and look up the actual item
        // when clicked? saying this because I changed this line to do some mapping and it broke buttons
        //todo: it is nice to have things separated out for both filtering and action buttons
        // though its a naive approach that reduces flexibility. need to improve this.
        context.inventoryItems = this.actor.items.filter(i => i.system.hasOwnProperty("maxStackSize") && i.type !== "castable"); // this need work
        context.equippables = context.inventoryItems.filter(i => i.system.isEquippable());
        context.consumables = context.inventoryItems.filter(i => i.type === "consumable");
        context.miscItems = context.inventoryItems.filter(i => !(i.type === "consumable" || i.system.isEquippable()));
        context.usedSlots = calculateUsedSlots(this.actor.items);
    }

    _prepareSkills(context) {
        context.skills = localizeObject(context.system.skills, CONFIG.RSK.skills);
    }

    _prepareAbilities(context) {
        context.abilities = localizeObject(context.system.abilities, CONFIG.RSK.abilities);
    }

    _prepareSpells(context) {
        context.spells = this.actor.items.filter(i => i.type === "castable" && i.system.category === "magic");
    }

    _preparePrayers(context) {
        context.prayers = this.actor.items.filter(i => i.type === "castable" && i.system.category === "prayer");
    }

    _prepareSummons(context) {
        context.familiars = this.actor.items.filter(i => i.type === "castable" && i.system.category === "summoning");
    }

    _prepareEquipment(context) {
        const equipped = context.items.filter(i => i.system.isEquipped);
        context.activeSlots = Object.keys(CONFIG.RSK.activeSlotType)
            .filter(k => k != "none")
            .map((slot) => {
                const inSlot = equipped.find(e => e.system.equippedInSlot === slot);
                return {
                    label: localizeText(slot),
                    itemId: inSlot?._id ?? "",
                    itemName: inSlot?.name ?? "",
                    itemImg: inSlot?.img ?? "",
                    style: (this.actor.flags?.rsk?.disabledSlots?.includes(slot) ?? false)
                        ? "item-active-md disabled"
                        : "item-active-md"
                }
            });
        context.ammo = equipped.find(i => i.system.equippedInSlot === "ammo");
        const weapons = this.actor.system.getActiveItems().filter(i => i.isWeapon() && i.system.equippedInSlot !== "ammo");
        context.equippedIsRanged = weapons.length > 0 ? weapons.every(i => i.isRangedWeapon()) : false;
        context.equippedIsHybrid = weapons.some(i => i.isRangedWeapon()) && weapons.some(i => i.isMeleeWeapon());
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
        html.find("[data-action='toggle-summary']").click(ev => {
            const toggleTarget = $(ev.currentTarget).data('toggle');
            $(`[data-toggle-target='${toggleTarget}']`).toggle();
        });
        html.find(".item-name").dblclick(ev => {
            const itemId = $(ev.currentTarget)?.parents(".item")?.data('item-id');
            this.actor.items.find(i => i.id === itemId)?.sheet.render(true);
        });
        html.find("[data-item-id] img").click(ev => {
            const itemId = $(ev.currentTarget)?.parents(".item")?.data('item-id');
            this.actor.items.find(i => i.id === itemId)?.sheet.render(true);
        });
        if (!this.isEditable) return;

        html.find('.item-equip').click(async ev => {
            const li = $(ev.currentTarget).parents(".item");
            const item = this.actor.items.get(li.data("itemId"));
            await this.actor.system.equip(item);
        });

        html.find('.item-unequip').click(async ev => {
            //todo: this isn't in a list so it is different than 'equip'
            // might be a problem?
            const itemId = $(ev.currentTarget).data("itemId");
            if (!itemId) return;
            const item = this.actor.items.get(itemId);
            if (!item) return;
            this.actor.system.unequip(item);
        });

        html.find('.item-consume').click(async ev => {
            const li = $(ev.currentTarget).parents(".item");
            const item = this.actor.items.get(li.data("itemId"));
            if (!item) return;

            await item.system.use(this.actor);
        });

        html.find('.apply-backgrounds').click(ev => {
            this.actor.system.applyBackgrounds();
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
        const rollOptions = await uiService.showDialog("confirm-roll", { ...rollData, ...dialogOptions });
        if (!rollOptions.confirmed) return false;
        const result = await this.actor.system.useSkill(rollOptions);
        result.toMessage();
        return result;
    }

    async addGold() {
        const amountResult = await uiService.showDialog("manage-gold");
        if (amountResult.confirmed) {
            this.actor.system.addGold(amountResult.amount)
        }
    }

    async removeGold() {
        const amountResult = await uiService.showDialog("manage-gold");
        if (amountResult.confirmed) {
            this.actor.system.removeGold(amountResult.amount)
        }
    }

    async handleIncreaseItemQuantity(itemId) {
        const item = this.actor.items.find(i => i.id === itemId);
        this.actor.system.addItem(item)
    }

    async handleDecreaseItemQuantity(itemId) {
        const item = this.actor.items.find(i => i.id === itemId);
        this.actor.system.removeItem(item)
    }

    async handleImproveYourCharacter() {
        const eligibleSkills = localizeObject(this.actor.system.skills, CONFIG.RSK.skills,
            (obj, i) => obj[i].level,
            (val) => val.used && val.level < 10);
        if (eligibleSkills.length < 1) return;
        const eligibleAbilities = localizeObject(this.actor.system.abilities, CONFIG.RSK.abilities,
            (obj, i) => obj[i].level,
            (val) => val.level < 8);

        const skillDialog = RSKImproveYourCharacterDialog.create({ skills: eligibleSkills, abilities: eligibleAbilities });
        const skillResult = await skillDialog();
        const hasSelection = skillResult && skillResult.confirmed && skillResult.selectedSkill;
        if (!hasSelection) return;
        // thought: stuff like this should probably be handled reactively
        // the more we do stuff reactively, the easier it will to extend through modules later
        this.actor.system.increaseSkillLevel(skillResult.selectedSkill);
        this.actor.system.clearUsedSkills();

        if (!skillResult.selectedAbility) return;
        this.actor.system.increaseAbilityLevel(skillResult.selectedAbility);
    }

    async characterAttackAction() {
        const weapons = this.actor.system.getActiveItems().filter(i => i.isWeapon() && i.system.equippedInSlot !== "ammo");
        if (weapons?.length > 1) {
            //todo: better flow, maybe a dual wield dialog
            // that allows you to select the weapon and if it is a 'map' or not for disadvantage
            // this dialog could maybe call the attack for you so you don't need to go through 
            // two dialogs?
            const result = await uiService.showDialog("select-item", { items: weapons });
            if (!result.confirmed) return;

            const weapon = weapons.find(i => i._id === result.id);
            await weapon.system.use(this.actor);
        } else if (weapons?.length > 0) {
            await weapons[0].system.use(this.actor)
        } else {
            const weaponSrc = CONFIG.RSK.defaultWeapon;
            const weapon = RSKWeapon.fromSource({ ...weaponSrc });
            await weapon.use(this.actor);
        }
    }


    async characterCastSpell() {
        const castables = this.actor.items
            .filter(s => s.type === "castable" && s.system.category === "magic")
            .filter(s => s.system.canUse(this.actor));
        if (castables.length < 1) {
            uiService.showNotification("RSK.NoCastablesAvailable");
            return false;
        }

        const selectCastableResult = await uiService.showDialog('select-item', { items: castables });
        if (!selectCastableResult || !selectCastableResult.confirmed) return false;

        const castable = this.actor.items.find(x => x._id === selectCastableResult.id);
        if (!castable) return false;

        await castable.system.use(this.actor);
    }

    async characterCastPrayer() {
        const castables = this.actor.items.filter(i => i.system.category === "prayer" && i.system.canUse(this.actor));;
        if (castables.length < 1) {
            uiService.showNotification("RSK.NoCastablesAvailable");
            return false;
        }

        const selectCastableResult = await uiService.showDialog('select-item', { items: castables });
        if (!selectCastableResult || !selectCastableResult.confirmed) return false;

        const castable = this.actor.items.find(x => x._id === selectCastableResult.id);
        if (!castable) return false;

        await castable.system.use(this.actor);
    }

    async characterCastSummons() {
        const castables = this.actor.items.filter(i => i.system.category === "summoning" && i.system.canUse(this.actor));;
        if (castables.length < 1) {
            uiService.showNotification("RSK.NoCastablesAvailable");
            return false;
        }

        const selectCastableResult = await uiService.showDialog('select-item', { items: castables });
        if (!selectCastableResult || !selectCastableResult.confirmed) return false;

        const castable = this.actor.items.find(x => x._id === selectCastableResult.id);
        if (!castable) return false;

        await castable.system.use(this.actor);
    }

    async characterTravel() {
        await this.handleSkillCheck({
            defaultSkill: "hunting",
            defaultAbility: "intellect"
        });
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
