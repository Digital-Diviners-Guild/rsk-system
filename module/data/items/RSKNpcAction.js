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
            defenseCheck: new fields.StringField({ initial: "defense" }), //todo: options of skills to validate against
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
            const result = await target.defenseCheck({ defaultSkill: this.defenseCheck });
            if (!result) return;
            //todo: apply 
        }
        console.log(outcome);
    }
}
