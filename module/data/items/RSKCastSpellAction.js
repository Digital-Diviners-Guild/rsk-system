import RSKConfirmRollDialog from "../../applications/RSKConfirmRollDialog.js";
import { fields } from "../fields.js";

// we could utilize datamodels so we can benefit from foundry life cycles
//  but not include in our systems types that users can create an manage by excluding it from the manifest.
export default class RSKCastSpellAction extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        return {
            label: new fields.StringField(),
            actionType: new fields.StringField({ initial: "magic" }),
            actionData: new fields.ObjectField()
        };
    }

    async use(actor) {
        if (actor.type === "npc") return;
        if (!this.canCast(actor)) return;

        const result = await this.useSpell(actor);
        if (!result) return;

        // do we want an action template where the action can add to the label and description
        const flavor = await renderTemplate("systems/rsk/templates/applications/item-message.hbs",
            {
                ...this.actionData,
                showRollResult: true,
                ...result
            });
        await result.rollResult.toMessage({
            flavor: flavor,
            flags: {
                // damage, statuses, etc?
                rsk: {
                    actionType: this.actionType,
                    damageEntries: { ...this.actionData.damageEntries }
                }
            }
        });
    }

    canCast(actor) {
        if (this.actionData.usageCost.length < 1) return true;
        for (const cost of this.actionData.usageCost) {
            const runes = actor.items.find(i => i.type === "rune" && i.system.type === cost.type);
            if (!runes || runes.system.quantity < cost.amount) return false;
        }
        return true;
    }

    async useSpell(actor) {
        const rollData = actor.getRollData();
        const dialog = RSKConfirmRollDialog.create(rollData, { defaultSkill: "magic", defaultAbility: "intellect" });
        const rollOptions = await dialog();
        if (!rollOptions.rolled) return false;

        const result = await actor.useSkill(rollOptions);
        if (result.isSuccess) {
            for (const cost of this.actionData.usageCost) {
                actor.spendRunes(cost.type, cost.amount);
            }
        }
        return result;
    }
}
