import RSKConfirmRollDialog from "../../applications/RSKConfirmRollDialog.js";
import { getTarget } from "../../rsk-targetting.js";
import { fields } from "./fields.js";

//todo: when an npc does something it is different than when a character does something.
export default class RSKNpcAction extends foundry.abstract.DataModel {
    static defineSchema() {
        return {
            id: new fields.StringField(),
            type: new fields.StringField(), // melee, magic, prayer
            label: new fields.StringField(), // what to display on the button?
            description: new fields.HTMLField(), // what it look like
            effectDescription: new fields.HTMLField(), // what it does
            damageEntries: new fields.ObjectField(),
            defenseCheck: new fields.StringField(), //todo: options of skills to validate against
            statuses: new fields.ArrayField(new fields.StringField()),
            effects: new fields.ArrayField(new fields.ObjectField()),
            //todo: I think we can reference the quality type here
            qualities: new fields.ArrayField(new fields.ObjectField()),
        };
    }

    async use(actor) {
        await ChatMessage.implementation.create({
            content: `${this.description} ${this.effectDescription} <button class="test">apply</button>`,
            flags: {
                rsk: {
                    outcome: {
                        action: this.toObject,
                        type: "npcAction"
                    }
                }
            }
        });
    }

    async apply(outcome) {
        const target = getTarget();
        if (target.type === "character") {
            const rollData = target.getRollData();
            const dialog = RSKConfirmRollDialog.create(rollData, { defaultSkill: this.defenseCheck });
            const rollOptions = await dialog();
            if (!rollOptions.rolled) return;

            const result = await target.useSkill(rollOptions.skill, rollOptions.ability, rollOptions.rollType);
            const flavor = `<strong>${rollOptions.skill} | ${rollOptions.ability}</strong>
              <p>${result.isCritical ? "<em>critical</em>" : ""} ${result.isSuccess ? "success" : "fail"} (${result.margin})</p>`;
            result.rollResult.toMessage({ flavor }, { ...rollOptions });

            //todo: apply 
        }
        console.log(outcome);
    }
}
