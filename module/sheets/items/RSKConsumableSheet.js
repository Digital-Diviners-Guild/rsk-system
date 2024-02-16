import RSKItemSheet from "./RSKItemSheet.js";

export default class RSKConsumableSheet extends RSKItemSheet {
    get template() {
        return `systems/rsk/templates/items/consumable-sheet.hbs`
    }

    getData() {
        const context = super.getData();
        context.config = CONFIG.RSK;
        context.statusEffects = CONFIG.statusEffects.reduce((ss, s) => {
            ss[s.id] = s.label;
            return ss;
        }, {});
        context.statusesToAdd = this.item.system.statusesAdded;
        context.statusesToRemove = this.item.system.statusesRemoved;
        return context;
    }

    activateListeners(html) {
        super.activateListeners(html);
        //todo: adding and removing shouldn't contain the same status
        //todo: definitely some refactoring needed here.
        html.find(".add-status-to-add").click(async (ev) => {
            const statusToAddEl = $("#status-to-add");
            const statusToAddVal = statusToAddEl.val();

            const newStatusesToAdd = this.item.system.statusesAdded.filter(s => s !== statusToAddVal);
            newStatusesToAdd.push(statusToAddVal);
            await this.item.update({ "system.statusesAdded": newStatusesToAdd });
            statusToAddEl.value = "";
        });
        html.find(".add-status-to-remove").click(async (ev) => {
            const statusToRemoveEl = $("#status-to-remove");
            const statusToRemoveVal = statusToRemoveEl.val();

            const newStatusesToRemove = this.item.system.statusesRemoved.filter(s => s !== statusToRemoveVal);
            newStatusesToRemove.push(statusToRemoveVal);
            await this.item.update({ "system.statusesRemoved": newStatusesToRemove });
            statusToRemoveEl.value = "";
        });

        html.find(".remove-status-to-add").click((ev) => {
            const statusId = $(ev.currentTarget)
                .parents(".item")
                .data("status-id");
            const newStatusesToAdded = this.item.system.statusesAdded.filter(s => s !== statusId);
            this.item.update({ "system.statusesAdded": newStatusesToAdded });
        });

        html.find(".remove-status-to-remove").click((ev) => {
            const statusId = $(ev.currentTarget)
                .parents(".item")
                .data("status-id");
            const newStatusesToRemove = this.item.system.statusesRemoved.filter(s => s !== statusId);
            this.item.update({ "system.statusesRemoved": newStatusesToRemove });
        });
    }
}