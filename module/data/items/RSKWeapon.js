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
            // might be able to use subCategory for this.
            weaponType: new fields.StringField({
                required: true,
                initial: "simple",
                choices: [...Object.keys(CONFIG.RSK.weaponTypes)]
            }),
            // might be able to use category for this.
            ammoType: new fields.StringField({
                choices: [...Object.keys(CONFIG.RSK.ammunitionType)]
            })
        }
    };

    //todo: refactor canuse/use to better handle melee/thrown/regular ranged
    canUse(actor) {
        if (this.attackMethods.has("melee")) {
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

    async use(actor) {
        if (!this.canUse(actor)) return;

        const rollData = this._prepareRollData();
        const confirmRollResult = await uiService.showDialog("confirm-roll", rollData);
        if (!confirmRollResult.confirmed) return;

        const skillResult = await actor.system.useSkill(confirmRollResult);
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

        if (!this.attackMethods.has("melee")) {
            const ammo = this._getAmmo();
            actor.system.removeItem(ammo);
        }
    }

    _prepareRollData(actor) {
        return {
            ...actor.system.getRollData(),
            targetNumberModifier: this.targetNumberModifier,
            skill: this.attackMethods.has("melee") ? "attack" : "ranged",
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

    usesItemAsAmmo(item) {
        return this.attackMethods.has("ranged")
            && item.attackMethods.has("ammo")
            && this.ammoType === item.ammoType;
    }

    _getAmmo(actor) {
        return this.attackMethods.has("thrown")
            ? this
            : actor.system.getActiveItems().find(i => usesItemAsAmmo(i.system));
    }

    _prepareOutcomeData() {
        if (this.attackMethods.has("melee")) {
            return {
                name: this.parent?.name ?? "Unarmed",
                description: this.effectDescription,
                actionType: "melee", //todo: action type? what does actionType do? I think it helps with damage typing for resistance and prayer, might need a better way
                img: this.parent?.img ?? "",
                outcomes: [...this.targetOutcomes],
                qualities: [...this.qualities]
            };
        } else {
            const ammo = this._getAmmo(actor);
            return {
                name: this.parent?.name ?? "Unarmed",
                description: `${this.description}\n${ammo.description}`,
                actionType: "ranged", //todo: action type? what does actionType do? I think it helps with damage typing for resistance and prayer, might need a better way
                img: this.parent?.img ?? "",
                effectDescription: `${this.effectDescription}\n${ammo.effectDescription}`,
                outcomes: [this.targetOutcomes, ammo.targetOutcomes],
                qualities: [...ammo.qualities]
            }
        }
    }
}