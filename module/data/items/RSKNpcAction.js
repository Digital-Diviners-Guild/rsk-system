import RSKApplyDamageDialog from "../../applications/RSKApplyDamageDialog.js";
import { statusToEffect } from "../../effects/statuses.js";
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
            healing: new fields.ObjectField(),
            defenseCheck: new fields.StringField({ initial: "defense" }), //todo: options of skills to validate against
            statuses: new fields.ArrayField(new fields.StringField()), //todo: list of statuses that can be chosen
            effects: new fields.ArrayField(new fields.ObjectField()),
            //todo: I think we can reference the quality type here
            qualities: new fields.ArrayField(new fields.ObjectField()),
        };
    }

    // depending on the npc's action, they may actually need to roll a test (not sure how this works yet)
    // example on page 167, "Healing Aura" references a successful magic test. 
    // this is a familiar so it may use the characters skills for this 
    // perhaps this would be a 'familiar action'?
    async use(actor) {
        //todo: message content template
        await ChatMessage.implementation.create({
            content: `${this.description} ${this.effectDescription} <button class="test">apply</button>`,
            flags: {
                rsk: {
                    outcome: {
                        actorId: actor._id,
                        action: this.toObject(),
                        type: "npcAction"
                    }
                }
            }
        });
        // if this is a self target only action, we can probably apply and chat at the same time without
        // needing apply to be clicked.
    }

    // ?? would it be worth splitting npc action types into combat and non combat?
    // I think there may be times npc's do things that don't require a defense check
    // but maybe not.
    //todo: QUALITIES
    async apply(outcome) {
        // todo: enforce target type, sometimes it can only be 'self' targeting.
        const actor = Actor.get(outcome.actorId);
        const target = getTarget(actor);
        return await (target.type === "character"
            ? this.applyCharacterOutcome(outcome, target, actor)
            : this.applyNpcOutcome(outcome, target, actor));
    }

    async applyCharacterOutcome(outcome, character, actor) {
        const result = await character.skillCheck({ defaultSkill: this.defenseCheck });
        if (!result) return;

        const totalDamage = Object.values(this.damageEntries).reduce((acc, d) => acc += d, 0);
        if (result.isSuccess) {
            // todo: qualities/armour types may interact with damageTypes
            // todo: qualities may reflect damage back to the attacker
            if (result.margin > 0) {
                //pretending we identified the reflection quality applies
                // todo: this would be in the quality type though
                const dialog = RSKApplyDamageDialog.create({ canReflect: true });
                const qualityResult = await dialog()
                if (qualityResult.confirmed && qualityResult.damageReflection > 0) {
                    actor.receiveDamage(qualityResult.damageReflection); // not sure if this ignores soak or not.
                }
            }
            const damageMitigation = character.getArmourValue() + result.margin;
            const damageTaken = game.rsk.math.clamp_value(totalDamage - damageMitigation, { min: 0 });
            character.receiveDamage(damageTaken);
        } else {
            // todo: enemy qualities will apply and can augment the damage with things like puncture or apply bleed.
            character.receiveDamage(totalDamage);
        }
    }

    //todo: apply actions outcome to npc.
    // this is just applied, no checks needed.
    // this will mostly likely be healing/statuses granted to friendly npc's
    // though it could be damage too
    async applyNpcOutcome(outcome, npc, actor) {
        const addedEffects = []
        //todo: create effects documents with statuses
        const statusEffects = this.statuses.map(s => statusToEffect(s, {}));
        addedEffects.push(...statusEffects);
        addedEffects.push(...this.effects);
        await npc.createEmbeddedDocuments("ActiveEffect", addedEffects);

        // todo: how do we want to model healing that can be applied
        // and how will we handle when these numbers are actually dice formula and not a static number?
        const healingDone = this.healing?.type === "roll"
            ? (await game.rsk.dice.roll("1d4")).total  //todo: roll with provided formula
            : this.healing?.value ?? 0;
        npc.receiveDamage(-healingDone) //todo: healing method for clarity
        if (Object.keys(this.damageEntries).length > 0) {
            const damage = npc.calculateDamageTaken(this.damageEntries, 0);
            npc.receiveDamage(damage);
        }
    }
}
