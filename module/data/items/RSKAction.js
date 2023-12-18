import { fields } from "./fields.js";

//todo: 
// this needs to detail data about what 
// happens to you and your targets as a result of the action being taken.
export default class RSKAction extends foundry.abstract.DataModel {
    static defineSchema() {
        return {
            type: new fields.StringField(), // weapon, spell, prayer
            label: new fields.StringField(), // what to display on the button?
            description: new fields.HTMLField(),
            range: new fields.StringField(),
            damageEntries: new fields.ArrayField(new fields.ObjectField()),
            effectDescription: new fields.HTMLField(),
            requiredEquipment: new fields.ArrayField(new fields.ObjectField()),
            usageCost: new fields.ArrayField(new fields.SchemaField({
                // prayer, summoning, magic, ranged, potentially even some melee attacks may have some cost
                // these will be different per type though.
                // prayer, and summoning are point costs
                // magic is rune costs and could require several different types of runes
                // ranged is ammo, and that sometimes is the weapon itself (ie thrown weapons)
                // melee likely doesn't have cost, but a special weapon may, not sure what it would be though.
                // that being said, it should be an option to enable homebrewing.
                type: new fields.StringField(),// rune / ammo / points
                amount: new fields.NumberField()
            })),
            // could be all friendlies, enemies, all, maybe even more specific like undead
            // could be self, single, multi
            target: new fields.SchemaField({
                type: new fields.StringField(),
                scope: new fields.StringField()
            }),
            // what happens to the target, 
            // statuses, damage, healing, etc...
            statuses: new fields.ArrayField(new fields.StringField()),
            effects: new fields.ArrayField(new fields.ObjectField()),
        };
    }

    canUse(actor) {
        return false;
    }

    use(actor) {
        // first check can use
        // how do we want to handle just chatting the action?
        // chat anyways when can't use but with no apply button?
        // or have a separate button for chatting
        if (!this.canUse(actor)) return;

        // then create outcomes.  this is an in memory list of things to apply

        // send message to chat with this object
        this.toMessage(actor)
    }

    confirm() {
        // when confirmed through dialog, use outcomes from 'use' to determine damage/effects
        // here is where we would call the 'receiveDamage' which we should rename to applyOutcomes
        // as it can be more than just damage.
    }

    async toMessage(actor, options = {}) {
        const actionData = {
            actor: actor.uuid,
            action: this.id,
            // would outcomes just live here and then
            // you can use the chat to commit them?
            outcomes: [],
        };
        const content = `${actor.name} is using ${this.label}: \n${this.effectDescription}`;
        const messageData = {
            type: CONST.CHAT_MESSAGE_TYPES["OTHER"], //CONST.CHAT_MESSAGE_TYPES[rolls.length > 0 ? "ROLL" : "OTHER"],
            content: content,
            speaker: ChatMessage.getSpeaker({ actor: actor }),
            //rolls: rolls,
            flags: {
                rsk: actionData
            }
        }
        ChatMessage.create(messageData, options);
    }
}
