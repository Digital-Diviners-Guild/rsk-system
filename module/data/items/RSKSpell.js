import RSKAction from "./RSKAction.js";
import RSKConfirmRollDialog from "../../applications/RSKConfirmRollDialog.js";
import { fields } from "./fields.js";

export default class RSKSpell extends RSKAction {
    static defineSchema() {
        return {
            spellType: new fields.StringField(),
            ...RSKAction.defineSchema(),
            usageCost: new fields.ArrayField(new fields.SchemaField({
                itemType: new fields.StringField(),// rune / ammo / points
                type: new fields.StringField(), // air / arrow / prayer
                amount: new fields.NumberField()
            })),
            statuses: new fields.ArrayField(new fields.StringField()),
            qualities: new fields.StringField(),
            requiredEquipment: new fields.StringField(),
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
}