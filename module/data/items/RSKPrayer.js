import { fields, positiveNumberField } from "./fields.js";

//i'm wondering if we just want these datamodels to be their own data types
//and have the use function in another service rather than in the datamodels
// basically, a more functional command pattern, rather than inheritance.
// plus it keeps these models just data and use case specific
export default class RSKPrayer extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        return {
            description: new fields.HTMLField(),
            cost: new fields.NumberField({ required: true, ...positiveNumberField, max: 30 }),
            range: new fields.StringField()
        }
    }

    //todo: move to another area that returns the result so 
    // we can later 'apply' its changes
    use(actor, options = {}) {
        // first check can use
        // then create outcomes.  this is an in memory list of things to apply
        // send message to chat with this object
        const actionData = {
            actor: actor.uuid,
            action: this.id,
            outcomes: [],
        };
        console.log(this);
        const content = `${actor.name} is using ${this.parent.name}!`;
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