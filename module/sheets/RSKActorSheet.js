export default class RSKActorSheet extends ActorSheet {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            template: `systems/rsk-system/templates/actors/${this.actor.type}-sheet.hbs`,
            classes: ["rsk", "sheet", `rsk-${this.actor.type}`]
        })
    }
}