import RSKItemSheet from "./RSKItemSheet.js";
import { localizeText } from "../../rsk-localize.js";
import { uiService } from "../../rsk-ui-service.js";

export default class RSKWeaponSheet extends RSKItemSheet {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["rsk", "sheet", "item"],
            width: 600,
            height: 600,
            tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }],
        });
    }

    get template() {
        return `systems/rsk/templates/items/${this.item.type}-sheet.hbs`
    }

    getData() {
        const context = super.getData();
        const itemData = context.item;
        context.system = itemData.system;
        context.flags = itemData.flags;
        context.config = CONFIG.RSK;
        context.effects = itemData.effects;
        return context;
    }

    activateListeners(html) {
        super.activateListeners(html);
        html.find('.attackMethod-checkbox').change(ev => this._onAttackTypeCheckbox(ev));
    }

    _onAttackTypeCheckbox(ev) {
        const target = $(ev.currentTarget);
        const isChecked = target.prop("checked");
        const attackMethod = target.val();
        this._updateAttackType(attackMethod, isChecked);
    }

    _updateAttackType(attackMethod, isChecked) {
        let updated;

        if (isChecked) {
            updated = new Set([...this.item.system.attackMethods, attackMethod])
        } else {
            updated = new Set(this.item.system.attackMethods.filter(x => x !== attackMethod));
        }

        if (updated.size > 0) {
            this.item.update({ [`system.attackMethods`]: [...updated] });
        } else {
            uiService.showNotification(localizeText("RSK.NoAttackMethodSelected"));
            this.item.render(false);
        }
    }

    //todo: toggle options in the sheets with the attack type bools
    // and weapon type
}