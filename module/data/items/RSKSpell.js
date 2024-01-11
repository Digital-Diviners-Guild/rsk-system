import RSKAction from "./RSKAction.js";
import RSKConfirmRollDialog from "../../applications/RSKConfirmRollDialog.js";
import { rskStatusEffects, statusToEffect } from "../../effects/statuses.js";
import { rskMagicStatusEffects } from "../../rsk-magic.js";
import { fields } from "./fields.js";
import { getTarget } from "../../rsk-targetting.js";

export default class RSKSpell extends RSKAction {
    static defineSchema() {
        return {
            spellType: new fields.StringField(),
            ...RSKAction.defineSchema()
        }
    };

    async use(actor) {
        if (actor.type === "npc") return;
        if (!this.canCast(actor)) return;

        const result = await this.useSpell(actor);
        if (!result) return;

        const flavor = await renderTemplate("systems/rsk/templates/applications/outcome-message.hbs",
            {
                ...this,
                ...result
            });
        const outcome = {
            actorId: actor._id,
            type: "spell",
            action: this.toObject(),
            result: result
        };
        await result.rollResult.toMessage({
            flavor: flavor,
            flags: {
                rsk: { outcome }
            }
        });
    }

    //todo: for certain spells there may be an equipment requirement
    canCast(actor) {
        if (this.usageCost.length < 1) return true;
        for (const cost of this.usageCost) {
            const runes = actor.items.find(i => i.type === cost.itemType && i.system.type === cost.type);
            if (!runes || runes.system.quantity < cost.amount) return false;
        }
        return true;
    }

    async useSpell(actor) {
        const rollData = actor.getRollData();
        const dialog = RSKConfirmRollDialog.create(rollData, { defaultSkill: "magic", defaultAbility: "intellect" });
        const rollOptions = await dialog();
        if (!rollOptions.rolled) return false;

        const result = await actor.useSkill(rollOptions.skill, rollOptions.ability);
        if (result.isSuccess) {
            for (const cost of this.usageCost) {
                actor.spendRunes(cost.type, cost.amount);
            }
        }
        return result;
    }

    getSpellEffectData(duration = {}) {
        const magicStatusIds = rskMagicStatusEffects.map(s => s.id);
        const rskStatusIds = rskStatusEffects.map(s => s.id);
        const spellStatusEffects = this.statuses.filter(s => magicStatusIds.includes(s))
            .map(s => statusToEffect(rskMagicStatusEffects.find(x => x.id === s), duration));
        const spellAddedStatusEffects = this.statuses.filter(s => rskStatusIds.includes(s))
            .map(s => statusToEffect(rskStatusEffects.find(x => x.id === s), duration));
        return [...this.effects, ...spellStatusEffects, ...spellAddedStatusEffects];
    }

    async apply(outcome) {
        if (!outcome.result.isSuccess) return;

        const actor = Actor.get(outcome.actorId);
        const target = getTarget(actor);
        //todo: I think actions npc's take are different from player actions
        // but sometimes player actions can target both players and npc's.
        // when an npc is affecting a character there is a different workflow
        // than when a character is affecting an npc/character. 
        // we will need to check target.type to make sure the apply makes sense.

        if (this.spellType === "combat") {
            this.applyCombatSpell(outcome, target);
        } else {
            this.applySpell(outcome, target);
        }
    }

    async applyCombatSpell(outcome, target) {
        if (target.type !== "npc") return; // maybe one day we could do pvp? but I think for now you can only attack npc's
        if (outcome.result.margin > 0) {
            //todo: trigger QUALITIES
            this.applySpellEffects(target);
        }
        //todo: add margin for damage taken, I think it is added pre soak.
        const damageTaken = target.calculateDamageTaken(this.damageEntries, 0); // todo: puncture from qualities
        target.receiveDamage(damageTaken);
    }

    //todo: healing spells?
    // once we figure out healing in npc actions, we need to apply to character actions too
    async applySpell(outcome, target) {
        // for non combat, it just needs to succeed, margin doesn't add anything (i don't think)
        //todo: how to model removed effects
        this.applySpellEffects(target);
    }

    async applySpellEffects(target) {
        const outcomeToApply = {
            removedEffects: [],
            addedEffects: []
        };
        outcomeToApply.addedEffects = this.getSpellEffectData();
        await target.createEmbeddedDocuments("ActiveEffect", outcomeToApply.addedEffects);
        await target.deleteEmbeddedDocuments("ActiveEffect", outcomeToApply.removedEffects);
    }
}