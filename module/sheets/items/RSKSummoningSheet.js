import RSKItemSheet from "./RSKItemSheet.js";

export default class RSKSummoningSheet extends RSKItemSheet {
    get template() {
        return `systems/rsk/templates/items/summoning-sheet.hbs`
    }

    getData() {
        const context = super.getData();
        context.config = CONFIG.RSK;
        context.usageCost = context.system.getUsageCostLabel();
        return context;
    }

    //todo this could be a module that takes type as a param
    activateListeners(html) {
        super.activateListeners(html);
        html.find(".add-usage-cost").click(async (ev) => {
            const amount = $("#amount");
            const amountVal = Number(amount.val());

            const usageCost = this.item.system.usageCost.filter(c => c.type !== "summoningPoints");
            usageCost.push({ type: "summoningPoints", amount: amountVal });
            await this.item.update({ "system.usageCost": usageCost });

            amount.value = 0;
        });

        html.find(".remove-usage-cost").click((ev) => {
            const updatedUsageCost = this.item.system.usageCost.filter(c => c.type !== "summoningPoints");
            this.item.update({ "system.usageCost": updatedUsageCost });
        });
    }
}