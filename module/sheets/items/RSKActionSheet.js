import RSKItemSheet from "./RSKItemSheet.js";

export default class RSKActionSheet extends RSKItemSheet {
    get template() {
        return `systems/rsk/templates/items/action-sheet.hbs`
    }

    getData() {
        const context = super.getData();
        context.usageCost = context.system.usageCost
            .map(c => `${c.amount} ${c.type} ${c.itemType}${c.amount > 1 ? 's' : ''}`)
            .join(", ");
        return context;
    }

    activateListeners(html) {
        super.activateListeners(html);
        html.find(".add-usage-cost").click((ev) => {
            const itemType = $("#itemType");
            const type = $("#type");
            const amount = $("#amount");
            const itemTypeVal = itemType.val();
            const typeVal = type.val();
            const amountVal = Number(amount.val());

            const usageCost = this.item.system.usageCost.filter(c =>
                !(c.itemType === itemTypeVal && c.type === typeVal));
            usageCost.push({ type: typeVal, itemType: itemTypeVal, amount: amountVal });
            this.item.update({ "system.usageCost": usageCost });

            itemType.value = "";
            type.value = "";
            amount.value = 0;
        });

        html.find(".remove-usage-cost").click((ev) => {
            const itemType = $(ev.currentTarget)
                .parents(".item")
                .data("itemType");
            const type = $(ev.currentTarget)
                .parents(".item")
                .data("type");

            const updatedUsageCost = this.item.system.usageCost.filter(c =>
                !(c.itemType === itemType && c.type === type));
            this.item.update({ "system.usageCost": updatedUsageCost });
        });
    }
}