import { fields } from "../fields.js";
import { uiService } from "../../rsk-ui-service.js";
import { localizeText } from "../../rsk-localize.js";
import RSKEquippableType from "./RSKEquippableType.js";
import RSKItemType from "./RSKItemType.js";

//todo: maybe we want to have meleeWeapon and rangedWeapon
// rangedWeapon is when ammo/throwables matter
// meleeWeapons don't need that, and apply their own special effect rather than the ammos
// this would remove the possibility of having a crossbow shoot a sword... which could have been fun lol
export default class RSKWeapon extends RSKEquippableType {
    static defineSchema() {
        return {
            ...RSKItemType.defineSchema()
        }
    };

    //todo: refactor canuse/use to better handle melee/thrown/regular ranged
    canUse(actor) {
        if (this.category === "melee") {
            if (this.subCategory === "martial" && actor.system.skills["attack"].level < 5) {
                uiService.showNotification(localizeText("RSK.AttackLevelTooLow"));
                return false;// maybe we should return the message as an error?
            }
            return this.isEquipped;
        }

        if (this.subCategory === "martial" && actor.system.skills["ranged"].level < 5) {
            uiService.showNotification(localizeText("RSK.RangedLevelTooLow"));
            return false;// maybe we should return the message as an error?
        }
        const ammo = this._getAmmo(actor);
        if (!ammo || ammo.quantity < 1) {
            uiService.showNotification(localizeText("RSK.NoAmmoAvailable"));
            return false;
        }
        return this.isEquipped;
    }

    _prepareRollData(actor) {
        return {
            ...actor.system.getRollData(),
            targetNumberModifier: this.targetNumberModifier,
            defaultSkill: this.category === "melee" ? "attack" : "ranged",
            defaultAbility: this.subCategory === "martial" ? "agility" : "strength"
        };
    }

    _getAmmo(actor) {
        return this.category === "thrown"
            ? this
            : actor.system.getActiveItems().find(i => this.parent?.usesItemAsAmmo(i.system));
    }

    _prepareOutcomeData(actor) {
        if (this.category === "melee") {
            return {
                name: this.parent?.name ?? "Unarmed",
                description: this.description,
                effectDescription: this.effectDescription,
                img: this.parent?.img ?? "",
                actionType: "melee", // should this maybe be 'attackType' in the damage model?
                actorUuid: actor.uuid,
                //targetUuids: [];
                targetOutcome: { ...this.targetOutcome },
                actorOutcome: { ...this.usageOutcome },
                specialEffect: [...this.specialEffect]
            };
        } else {
            const ammo = this._getAmmo(actor);
            const targetOutcome = this === ammo
                ? this.targetOutcome
                : { ...this.combineOutcomes(this.targetOutcome, ammo.system.targetOutcome) };
            const usageOutcome = this === ammo
                ? this.usageOutcome
                : { ...this.combineOutcomes(this.usageOutcome, ammo.system.usageOutcome) };
            return {
                name: this.parent?.name,
                description: `${this.description}\n${ammo.system.description}`,
                effectDescription: `${this.effectDescription}\n${ammo.system.effectDescription}`,
                img: this.parent?.img ?? "",
                actionType: "ranged", // should this maybe be 'attackType' in the damage model?
                actorUuid: actor.uuid,
                //targetUuids: [];
                targetOutcome: { ...targetOutcome },
                actorOutcome: { ...usageOutcome },
                specialEffect: [...ammo.system.specialEffect]
            };
        }
    }

    _handleItemUsed(actor, skillResult) {
        if (!this.category === "melee") {
            const ammo = this._getAmmo(actor);
            actor.system.removeItem(ammo);
        }
    }

    combineOutcomes(outcome1, outcome2) {
        return {
            damageEntries: this.combineDamage(outcome1.damageEntries, outcome2.damageEntries),
            restoresLifePoints: outcome1.restoresLifePoints + outcome2.restoresLifePoints,
            statusesAdded: [...outcome1.statusesAdded, ...outcome2.statusesAdded],
            statusesRemoved: [...outcome1.statusesRemoved, ...outcome2.statusesRemoved],
        }
    }

    combineDamage(damageEntries1, damageEntries2) {
        const result = { ...damageEntries1 };
        Object.keys(damageEntries2).forEach(key => {
            if (result[key]) {
                result[key] += damageEntries2[key];
            } else {
                result[key] = damageEntries2[key];
            }
            if (result[key] === 0) {
                delete result[key];
            }
        });
        return result;
    }
}