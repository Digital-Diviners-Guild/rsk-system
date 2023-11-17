export default class RSKItemSheet extends ItemSheet {
    get template() {
        return `systems/rsk-system/templates/sheets/${this.item.type}-sheet.html`;
    }
}