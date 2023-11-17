export default class RSKItemSheet extends ItemSheet {
    get template() {
        return `systems/rsk-system/templates/items/${this.item.type}-sheet.html`;
    }
}