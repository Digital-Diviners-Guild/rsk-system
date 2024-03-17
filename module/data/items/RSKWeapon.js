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

    //todo: refactor canuse/use to better handle melee/thrown/regular ranged
    canUse() {
        if (this.parent.isMeleeWeapon()) {
            //todo: use subCategory instead of weaponType?
            // this might allow us to remove the weaponType property.
            if (this.weaponType === "martial" && actor.system.skills["attack"].level < 5) {
                uiService.showNotification(localizeText("RSK.AttackLevelTooLow"));
                return false;// maybe we should return the message as an error?
            }
            return this.isEquipped;
        }

        if (this.weaponType === "martial" && actor.system.skills["ranged"].level < 5) {
            uiService.showNotification(localizeText("RSK.RangedLevelTooLow"));
            return false;// maybe we should return the message as an error?
        }
        const ammo = this._getAmmo();
        if (!ammo || ammo.quantity < 1) {
            uiService.showNotification(localizeText("RSK.NoAmmoAvailable"));
            return false;
        }
        return this.isEquipped;
    }

    async use() {
        if (!this.canUse()) return;

        const rollData = this._prepareRollData();
        const confirmRollResult = await uiService.showDialog("confirm-roll", rollData);
        if (!confirmRollResult.confirmed) return;

        const skillResult = await this.parent.actor.system.useSkill(confirmRollResult);
        const actionOutcome = this._prepareOutcomeData();
        const flavor = await renderTemplate("systems/rsk/templates/applications/action-message.hbs",
            {
                ...skillResult,
                ...actionOutcome
            });
        await skillResult.toMessage({
            flavor: flavor,
            flags: {
                rsk: {
                    ...skillResult,
                    ...actionOutcome
                }
            }
        });

        if (!this.parent.isMeleeWeapon()) {
            const ammo = this._getAmmo();
            this.parent.actor.system.removeItem(ammo);
        }
    }

    _prepareRollData() {
        return {
            ...this.parent.actor.system.getRollData(),
            targetNumberModifier: this.targetNumberModifier,
            skill: this.parent.isMeleeWeapon() ? "attack" : "ranged",
            //todo: use subCategory === martial?
            ability: this.weaponType === "martial" ? "agility" : "strength"
        };
    }

    //any of this applicable to weapons?
    // _handleUsage(skillResult) {
    //     const outcomes = [...this.usageOutcomes, ...this.usageCost.map(c => ({
    //         operation: 'spendResource',
    //         context: { type: c.type, amount: c.amount }
    //     }))]
    //     applyStateChanges2(this.parent.actor, outcomes);
    // }

    _getAmmo() {
        return this.parent.isThrownWeapon()
            ? this
            : this.parent.actor.system.getActiveItems().find(i => this.parent.usesItemAsAmmo(i));
    }

    _prepareOutcomeData() {
        if (this.parent.isMeleeWeapon()) {
            return {
                name: this.parent.name,
                description: this.effectDescription,
                actionType: "melee", //todo: base action type? what does actionType do? I think it helps with damage typing for resistence and prayer, might need a better way
                img: this.parent.img,
                outcomes: [...this.targetOutcomes],
                qualities: [...this.qualities]
            };
        } else {
            const ammo = this._getAmmo();
            return {
                name: this.parent.name,
                description: `${this.description}\n${ammo.description}`,
                img: weapon.img,
                effectDescription: `${this.effectDescription}\n${ammo.effectDescription}`,
                outcomes: [this.targetOutcomes, ammo.targetOutcomes],
                qualities: [...ammo.qualities]
            }
        }
    }
}