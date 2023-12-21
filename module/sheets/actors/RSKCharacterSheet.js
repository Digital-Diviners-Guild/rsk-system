import RSKSpell from "../../data/items/RSKSpell.js";
import { toMessageContent, usePrayer } from "../../rsk-prayer.js";
import RSKActorSheet from "./RSKActorSheet.js";


export default class RSKCharacterSheet extends RSKActorSheet {
    prayers;
    spells;

    getData() {
        const context = super.getData();
        this._prepareSkills(context);
        this._prepareAbilities(context);
        this._prepareSpells(context);
        this._preparePrayers(context);
        this._prepareEquipment(context);
        return context;
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
        html.find('.cast-spell').click(ev => {
            const s = $(ev.currentTarget);
            const spell = this.spells[s.data("spellId")];
            spell.use(this.actor);
        });
        html.find('.activate-prayer').click(ev => {
            const s = $(ev.currentTarget);
            const prayerId = s.data("prayerId");
            usePrayer(this.actor, prayerId);
        });
    }
}