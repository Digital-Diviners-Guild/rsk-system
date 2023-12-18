import { fields, positiveNumberField } from "./fields.js";

//i'm wondering if we just want these datamodels to be their own data types
//and have the use function in another service rather than in the datamodels
// basically, a more functional command pattern, rather than inheritance.
// plus it keeps these models just data and use case specific
export default class RSKPrayer extends foundry.abstract.DataModel {
    static defineSchema() {
        return {
            //label: new fields.StringField(),
            statuses: new fields.ArrayField(new fields.StringField()),
            effectDescription: new fields.HTMLField(),
            cost: new fields.NumberField({ required: true, ...positiveNumberField, max: 30 }),
            range: new fields.StringField()
        }
    }

    label;
    actor;

    //todo: move to another area that returns the result so 
    // we can later 'apply' its changes

    //todo: when we apply the result
    // how do we want to handle usage requiring a skill check?
    use(options = {}) {
        // first check can use
        // then create outcomes.  this is an in memory list of things to apply
        // send message to chat with this object
        const canPray = this.actor.system.prayerPoints.value >= this.cost;
        const actionData = {
            actor: this.actor.uuid,
            action: this.id,
            outcomes: [],
        };
        const usingMessage = `${this.actor.name} is using `;
        const cantUseMessage = 'Not enough prayer points for ';
        const content = `${canPray ? usingMessage : cantUseMessage}${this.label}: \n${this.effectDescription}`;
        const messageData = {
            type: CONST.CHAT_MESSAGE_TYPES["OTHER"], //CONST.CHAT_MESSAGE_TYPES[rolls.length > 0 ? "ROLL" : "OTHER"],
            content: content,
            speaker: ChatMessage.getSpeaker({ actor: this.actor }),
            //rolls: rolls,
            flags: {
                rsk: actionData
            }
        }
        ChatMessage.create(messageData, options);
    }


    static fromData(prayerData) {
        const prayer = new this({ ...prayerData });
        prayer._id = prayerData.id;
        prayer.label = prayerData.label;
        prayer.actor = prayerData.actor;
        return prayer;
    }
}