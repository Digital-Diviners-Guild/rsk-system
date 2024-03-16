import { uiService } from "../../rsk-ui-service.js";
import { fields } from "../fields.js";
import RSKEquippableType from "./RSKEquippableType.js";
import RSKItemType from "./RSKItemType.js";

export default class RSKWeapon extends RSKEquippableType {
    static defineSchema() {
        return {
            ...RSKItemType.defineSchema(),
            //todo: can we kill these properties?
            attackMethods: new fields.SetField(new fields.StringField({
                choices: [...Object.keys(CONFIG.RSK.attackMethods)]
            }), {
                required: true,
                initial: ["melee"],
                choices: [...Object.keys(CONFIG.RSK.attackMethods)]
            }),
            weaponType: new fields.StringField({
                required: true,
                initial: "simple",
                choices: [...Object.keys(CONFIG.RSK.weaponTypes)]
            }),
            ammoType: new fields.StringField({
                choices: [...Object.keys(CONFIG.RSK.ammunitionType)]
            })
        }
    };

    canUse() {
        if (this.parent.isMeleeWeapon()) {
            return this.isEquipped;
        }
        const ammo = this._getAmmo();
        if (!ammo || ammo.quantity < 1) {
            uiService.showNotification(localizeText(result.error));
            return false;
        }
        return this.isEquipped;
    }

    _handleUsage(skillResult) {
        if (this.parent.isMeleeWeapon()) {
            return;
        }

        const ammo = this._getAmmo();
        this.parent.actor.system.removeItem(ammo);
    }

    _getAmmo() {
        return this.parent.isThrownWeapon()
            ? this
            : this.parent.actor.system.getActiveItems().find(i => this.parent.usesItemAsAmmo(i));
    }

    _prepareOutcomeData() {
        //todo: outcomes of ranged attacks that pull outcomes from ammo
        return {
            name: this.parent.name,
            description: this.effectDescription,
            actionType: "melee",
            img: this.parent.img,
            outcomes: this.targetOutcomes
        };
    }
}