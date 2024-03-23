import { getSpecialEffectHandler } from "../../effects/specialEffect.js";
import { uiService } from "../../rsk-ui-service.js";
import { fields } from "../fields.js";
import RSKEquippableType from "./RSKEquippableType.js";
import RSKItemType from "./RSKItemType.js";

//todo: maybe we want to have meleeWeapon and rangedWeapon
// rangedWeapon is when ammo/throwables matter
// meleeWeapons don't need that, and apply their own special effect rather than the ammos
// this would remove the possibility of having a crossbow shoot a sword... which could have been fun lol
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

    usesItemAsAmmo(item) {
        return this !== item
            && this.attackMethods.has("ranged")
            && item.attackMethods.has("ammo")
            && this.ammoType === item.ammoType;
    }

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

        const rollData = this._prepareRollData(actor);
        const confirmRollResult = await uiService.showDialog("confirm-roll", rollData);
        if (!confirmRollResult.confirmed) return;

        const skillResult = await actor.system.useSkill(confirmRollResult);
        const actionOutcome = this._prepareOutcomeData(actor);
        if (skillResult.margin > 1) {
            const bonusDamage = skillResult.margin - 1;
            const damageKey = Object.keys(actionOutcome.outcome.damageEntries).find((k) => actionOutcome.outcome.damageEntries[k] > 0);
            if (damageKey) {
                actionOutcome.outcome.damageEntries[damageKey] += bonusDamage;
            }
        }

        // if (this.specialEffect.condition === "success" && skillResult.margin >= this.specialEffect.marginThreshold) {
        const handler = getSpecialEffectHandler("rejuvenate"); //this.specialEffect.name);
        actionOutcome.outcome = await handler(actor, actionOutcome.outcome);
        // }

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
            const ammo = this._getAmmo(actor);
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

    _getAmmo(actor) {
        return this.attackMethods.has("thrown")
            ? this
            : actor.system.getActiveItems().find(i => usesItemAsAmmo(i.system));
    }

    _prepareOutcomeData(actor) {
        if (this.attackMethods.has("melee")) {
            //todo: qualities apply when the attack is successful
            // should we add the qualities outcomes to outcome
            // here before it is sent?
            // in that case, quality really is just a names outcome
            // then on use, we could combine qualities outcomes with base outcome
            // then send.
            // we only apply a char outcome on success, and the margin depends on the thing being used
            /// ie spells can control when they add their outcome.
            // for npc actions, how would this work? is there value in keeping things more separate?
            // npc actions qualities apply to a char if they fail a defense check... 
            // what other types of actions could an npc do to a character? do we need a success outcome
            // and fail outcome?
            // as I understand it, npc's -> character, only damage applies (less def margin) when succeeding
            // maybe that system rule is enough.

            return {
                actor,
                name: this.parent?.name ?? "Unarmed",
                description: this.description,
                effectDescription: this.effectDescription,
                img: this.parent?.img ?? "",
                actionType: "melee", // should this maybe be 'attackType' in the damage model?
                outcome: { ...this.targetOutcome }
            };
        } else {
            const ammo = this._getAmmo(actor);
            const outcome = this === ammo
                ? this.targetOutcome
                : { ...this.combineOutcomes(this.targetOutcome, ammo.targetOutcome) };
            return {
                actor,
                name: this.parent?.name ?? "Unarmed",
                description: `${this.description}\n${ammo.description}`,
                effectDescription: `${this.effectDescription}\n${ammo.effectDescription}`,
                img: this.parent?.img ?? "",
                actionType: "ranged",
                outcome: { ...outcome }
            }
        }
    }

    combineOutcomes(outcome1, outcome2) {
        return {
            damage: this.combineDamage(outcome1.damageEntries, outcome2.damageEntries),
            restoresLifePoints: outcome1.restoresLifePoints + outcome2.restoresLifePoints,
            addsStatuses: [...outcome1.addsStatuses, ...outcome2.addsStatuses],
            removesStatuses: [...outcome1.removesStatuses, ...outcome2.removesStatuses],
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