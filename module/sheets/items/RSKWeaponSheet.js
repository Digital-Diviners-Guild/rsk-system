import RSKItemSheet from "./RSKItemSheet.js";

export default class RSKWeaponSheet extends RSKItemSheet {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["rsk", "sheet", "item"],
            width: 600,
            height: 420,
            tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }],
        });
    }

    get template() {
        return `systems/rsk/templates/items/weapon-sheet.hbs`
    }

    getData() {
        const context = super.getData();
        const itemData = context.item;
        context.system = itemData.system;
        context.flags = itemData.flags;
        context.config = CONFIG.RSK;
        context.effects = itemData.effects;
        context.range = !this.item.isOnlyAmmo();
        context.showAmmo = this.item.isOrUsesAmmo();
        context.showEffects = this.item.isAmmo() || this.item.isMeleeWeapon();
        context.showUsageCost = this.item.system.category === "ranged";
        return context;
    }

    activateListeners(html) {
        super.activateListeners(html);
    }

    //todo: toggle options in the sheets with the attack type bools
    // and weapon type
}