import RSKItemSheet from "./RSKItemSheet.js";

export default class RSKActionSheet extends RSKItemSheet {
    get template() {
        return `systems/rsk/templates/items/action-sheet.hbs`
    }

    getData() {
        const context = super.getData();
        context.config = CONFIG.RSK;
        context.usageCost = context.system.getUsageCostLabel();
        return context;
    }

    activateListeners(html) {
        super.activateListeners(html);
        html.find(".add-usage-cost").click((ev) => {
            const type = $("#type");
            const amount = $("#amount");
            const typeVal = type.val();
            const amountVal = Number(amount.val());

            const usageCost = this.item.system.usageCost.filter(c => c.type !== typeVal);
            usageCost.push({ type: typeVal, amount: amountVal });
            this.item.update({ "system.usageCost": usageCost });

            type.value = "";
            amount.value = 0;
        });

        html.find(".remove-usage-cost").click((ev) => {
            const type = $(ev.currentTarget)
                .parents(".item")
                .data("type");

            const updatedUsageCost = this.item.system.usageCost.filter(c => c.type !== type);
            this.item.update({ "system.usageCost": updatedUsageCost });
        });
    }
}