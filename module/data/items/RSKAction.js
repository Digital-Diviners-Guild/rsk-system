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
            range: new fields.SchemaField({
                min: new fields.NumberField(),
                max: new fields.NumberField(),
                // prayer/spell would define its range, while melee/range comes from weapon
                useWeapon: new fields.BooleanField(),
            }),
            requiredEquipment: new fields.ArrayField(new fields.ObjectField()),
            cost: new fields.SchemaField({
                // prayer, summoning, magic, ranged, potentially even some melee attacks may have some cost
                // these will be different per type though.
                // prayer, and summoning are point costs
                // magic is rune costs and could require several different types of runes
                // ranged is ammo, and that sometimes is the weapon itself (ie thrown weapons)
                // melee likely doesn't have cost, but a special weapon may, not sure what it would be though.
                // that being said, it should be an option to enable homebrewing.
                type: new fields.StringField(),// rune / ammo / points / specific items
                values: new fields.ArrayField(new fields.SchemaField({
                    name: new fields.StringField(), // air rune, steel arrow, prayer points
                    amount: new fields.NumberField()
                }))
            }),
            // could be all friendlies, enemies, all, maybe even more specific like undead
            // could be self, single, multi
            target: new fields.SchemaField({
                type: new fields.StringField(),
                scope: new fields.StringField()
            }),
            // what happens to the target, 
            // statuses, damage, healing, etc...
            effects: new fields.ArrayField(new fields.ObjectField()),
        };
    }

    use(actor) {
        // first check can use
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
            outcomes: [],
        };

        //const content = await renderTemplate("<todo: action template>", {
        // action: this,
        // actor: this.actor,
        // context: this.usage.context,
        // outcomes: this.outcomes,
        // showTargets: this.target.type !== "self",
        // targets
        //);

        const content = `${actor.name} is using ${this.parent.name}!`;

        // Create chat message
        const messageData = {
            type: CONST.CHAT_MESSAGE_TYPES["OTHER"], //CONST.CHAT_MESSAGE_TYPES[rolls.length > 0 ? "ROLL" : "OTHER"],
            content: content,
            speaker: ChatMessage.getSpeaker({ actor }),
            //rolls: rolls,
            flags: {
                rsk: actionData
            }
        }
        ChatMessage.create(messageData, options);
    }
}

//RSKActionEffect
