import RSKConfirmRollDialog from "../../applications/RSKConfirmRollDialog.js";
import { statusToEffect } from "../../effects/statuses.js";
import { getTarget } from "../../rsk-targetting.js";
import RSKAction from "./RSKAction.js";
import { fields } from "./fields.js";

//i'm wondering if we just want these datamodels to be their own data types
//and have the use function in another service rather than in the datamodels
// basically, a more functional command pattern, rather than inheritance.
// plus it keeps these models just data and use case specific
export default class RSKPrayer extends RSKAction {
    static defineSchema() {
        return {
            ...RSKAction.defineSchema(),
            usageCost: new fields.ArrayField(new fields.SchemaField({
                itemType: new fields.StringField(),// rune / ammo / points
                type: new fields.StringField(), // air / arrow / prayer
                amount: new fields.NumberField()
            })),
            statuses: new fields.ArrayField(new fields.StringField()),
        }
    }

    async use(actor) {
        if (actor.type === "npc") return; // todo: can npc's pray?

        const cost = this.usageCost[0]?.amount ?? 0;
        if (!this.canPray(actor, cost)) return;

        const result = await this.usePrayer(actor, cost);
        if (!result) return;

        const flavor = await renderTemplate("systems/rsk/templates/applications/outcome-message.hbs",
            {
                ...this,
                ...result
            });
        await result.rollResult.toMessage({
            flavor: flavor,
            flags: {
                rsk: {
                    outcome: {
                        actorId: actor._id,
                        type: "prayer",
                        action: this.toObject(),
                        result: result
                    }
                }
            }
        });
        return result;
    }

    canPray(actor, prayerPoints) {
        return actor.system.prayerPoints.value >= prayerPoints;
    }

    async usePrayer(actor, prayerPoints) {
        const rollData = actor.getRollData();
        const dialog = RSKConfirmRollDialog.create(rollData, { defaultSkill: "prayer", defaultAbility: "intellect" });
        const rollOptions = await dialog();
        if (!rollOptions.rolled) return false;

        const result = await actor.useSkill(rollOptions.skill, rollOptions.ability);
        const cost = result.isSuccess
            ? prayerPoints
            : 1;
        actor.update({ "system.prayerPoints.value": actor.system.prayerPoints.value - cost });
        return result;
    }

    async apply(outcome) {
        if (!outcome.result.isSuccess) return;

        const actor = Actor.get(outcome.actorId);
        const target = getTarget(actor);
        if (target.type === "npc") return;

        const outcomeToApply = {};
        outcomeToApply['removedEffects'] = this.getActivePrayers(target.effects);
        outcomeToApply['addedEffects'] = [statusToEffect(this, duration)];
        await target.createEmbeddedDocuments("ActiveEffect", outcomeToApply.addedEffects);
        await target.deleteEmbeddedDocuments("ActiveEffect", outcomeToApply.removedEffects);
    }

    getActivePrayers(actorEffects) {
        const prayerStatuses = rskPrayerStatusEffects.map(se => se.id);
        const currentPrayers = [];
        for (const effect of actorEffects) {
            for (const status of effect.statuses) {
                if (prayerStatuses.includes(status)) {
                    currentPrayers.push(effect._id);
                }
            }
        }
        return currentPrayers;
    }
}