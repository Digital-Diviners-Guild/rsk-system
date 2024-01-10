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
            statuses: new fields.ArrayField(new fields.StringField()), //todo: list of statuses that can be chosen
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


    //todo: QUALITIES
    async apply(outcome) {
        const target = getTarget();
        if (target.type === "character") {
            const result = await target.defenseCheck({ defaultSkill: this.defenseCheck });
            if (!result) return;

            const totalDamage = Object.values(this.damageEntries).reduce((acc, d) => acc += d, 0);
            if (result.isSuccess) {
                // todo: qualities/armour types may interact with damageTypes
                // todo: qualities may reflect damage back to the attacker
                const damageMitigation = target.getArmourValue() + result.margin;
                const damageTaken = game.rsk.math.clamp_value(totalDamage - damageMitigation, { min: 0 });
                target.receiveDamage(damageTaken);
            } else {
                // todo: enemy qualities will apply and can augment the damage with things like puncture or apply bleed.
                target.receiveDamage(totalDamage);
            }
        } else {
            //todo: apply actions outcome to npc.
            // this is just applied, no checks needed.
        }
    }
}
