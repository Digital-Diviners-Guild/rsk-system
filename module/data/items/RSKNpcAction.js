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

    async apply(outcome) {
        const target = getTarget();
        if (target.type === "character") {
            const result = await target.defenseCheck({ defaultSkill: this.defenseCheck });
            if (!result) return;

            let outcomeToApply = {};
            if (result.isSuccess) {
                if (result.margin > 0) {
                    //todo: look through equipped armour
                    // for qualities with the success condition
                    // should be things such as retaliate, resilient, steadfast
                    // some things like retaliate may affect the actor of this ability
                    // for example, if an npc does earth damage the the quality is
                    // retaliate earth 1, then they will take 1 earth damage if this is successful.
                    const activeArmourQualities = target.getActiveItems()
                        .filter(i => i.type === "armour")
                        .filter(i => i.system.qualities?.length > 0)
                        .map(i => i.qualities)
                        .filter(q => q.condition === "success");
                    for (const quality of activeArmourQualities) {
                        //const qualityResult = quality.apply(outcome) ?

                        // how do we want to 'apply' qualities
                        // if this were resilient stabbing 2 we would want this somehow?
                        outcomeToApply.damageResilience = {
                            stab: 2
                        }

                        // if this were resilient stabbing 2 we would want this somehow?
                        outcomeToApply.retaliateDamageEntries = {
                            stab: 2
                        };

                        // with steadfast we'd want
                        outcomeToApply.removedStatuses = ["knockdown"];
                    }

                    //todo: add margin to bonus damage mitigation
                    outcomeToApply.damageEntries = { ...this.damageEntries };

                }
            } else {
                //todo: apply negative affects from npc's attack
                //todo: add margin to attack damage
                outcomeToApply.appliedEffects = [] // todo: map status, qualities, effects
                outcomeToApply.bonusDamage = Math.abs(result.margin); // or do we want to add to damageEntries?
            }
        } else {
            //todo: apply actions outcome to npc.
            // this is just applied, no checks needed.
        }
        //target.applyOutcome(outcomeToApply) ? is this what we'll do?
        console.log(outcomeToApply);
    }
}
