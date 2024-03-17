import RSKItemType from "./RSKItemType.js";

export default class RSKConsumable extends RSKItemType {
    async use() {
        const content = await renderTemplate("systems/rsk/templates/applications/action-message.hbs",
            {
                name: `${this.parent.actor.name} ${localizeText("RSK.Uses")} ${this.parent.name}`,
                hideRollResults: true
            });
        await ChatMessage.create({
            content: content,
            flags: {
                rsk: {
                    actionType: "consume",
                    outcomes: [...this.targetOutcomes],
                }
            }
        });
        this.parent.actor.system.removeItem(this);
    }
}