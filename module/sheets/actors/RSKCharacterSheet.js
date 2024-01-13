import RSKActorSheet from "./RSKActorSheet.js";

export default class RSKCharacterSheet extends RSKActorSheet {
    prayers;
    spells;
    inventoryItems;

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
        this.inventoryItems = this.actor.items.filter(i => i.system.hasOwnProperty("slotId"));
        context.inventoryItems = this.inventoryItems;
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
        this.spells = CONFIG.RSK.standardSpellBook;
        context.spells = this.spells;
    }

    _preparePrayers(context) {
        this.prayers = CONFIG.RSK.defaultPrayers;
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

    _getAction(type, id) {
        switch (type) {
            case "prayer":
                return this.prayers[id];
            case "spell":
                return this.spells[id];
        }
    }

    //inventory rules poc
    async _onDropItem(event, data) {
        const item = await Item.fromDropData(data);
        // how do we want to identify something that can go in the inventory?
        // maybe a flag on precreate for the item type?
        //todo: handle heavy quality when we refactor this out
        if (item.system.hasOwnProperty("slotId")) {
            await this.actor.addItem(item)
        }
        else {
            await super._onDropItem(event, data);
        }
    }

    async handleSkillCheck(dialogOptions = {}) {
        this.actor.skillCheck(dialogOptions);
    }
}