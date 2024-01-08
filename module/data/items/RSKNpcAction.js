import { getTarget } from "../../rsk-targetting.js";
import { fields } from "./fields.js";

//todo: when an npc does something it is different than when a character does something.
export default class RSKNpcAction extends foundry.abstract.DataModel {
    static defineSchema() {
        return {
            id: new fields.StringField(),
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
        //todo: message content template
        await ChatMessage.implementation.create({
            content: `${this.description} ${this.effectDescription} <button class="test">apply</button>`,
            flags: {
                rsk: {
                    outcome: {
                        action: this.toObject(),
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

            if (result.isSuccess) {
                if (result.margin > 0) {
                    //todo: look through equipped armour
                    // for qualities with the success condition
                    // should be things such as retaliate and resilient
                    // some things like retaliate may affect the actor of this ability
                    // for example, if an npc does earth damage the the quality is
                    // retaliate earth 1, then they will take 1 earth damage if this is successful.

                    //todo: add margin to bonus damage mitigation
                }
            } else {
                //todo: apply negative affects from npc's attack
                //todo: add margin to attack damage
            }
        } else {
            //todo: apply actions outcome to npc.
            // this is just applied, no checks needed.
        }
        console.log(outcome);
    }
}
