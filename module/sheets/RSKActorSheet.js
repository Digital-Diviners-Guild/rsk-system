export default class RSKActorSheet extends ActorSheet {
    get template() {
        return `systems/rsk-system/templates/actors/${this.item.type}-sheet.html`;
    }

    getData() {
        return super.getData()
    }
}