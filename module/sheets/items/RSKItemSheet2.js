import { OutcomeInputComponentFactory } from "./OutcomeInputComponent.js";

export default class RSKItemSheet2 extends ItemSheet {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["rsk", "sheet", "item"],
            width: 600,
            height: 600,
            tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }],
            dragDrop: [{ dropSelector: "[data-can-drop=true]" }],
        });
    }

    get template() {
        return 'systems/rsk/templates/items/item-sheet.hbs';
    }

    getData() {
        const context = super.getData();
        const itemData = context.item;
        context.system = itemData.system;
        context.flags = itemData.flags;
        context.config = CONFIG.RSK;
        return context;
    }

    activateListeners(html) {
        super.activateListeners(html);
        html.find('.effect-edit').click(ev => {
            const effectId = $(ev.currentTarget)
                .parents(".item")
                .data("effectId");
            const effect = this.item.effects.get(effectId);
            effect.sheet.render(true);
        });
        if (!this.isEditable) return;
        this.addListeners(html, "usage");
        this.addListeners(html, "target");

        html.find(".add-usage-cost").click(async (ev) => {
            const type = $("#type");
            const amount = $("#amount");
            const typeVal = type.val();
            const amountVal = Number(amount.val());

            const usageCost = this.item.system.usageCost.filter(c => c.type !== typeVal);
            usageCost.push({ type: typeVal, amount: amountVal });
            await this.item.update({ "system.usageCost": usageCost });

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

        html.find('.effect-create').on('click', ev => {
            CONFIG.ActiveEffect.documentClass.create({
                label: "New Effect",
                icon: "icons/svg/aura.svg",
                transfer: true,
            }, { parent: this.item }).then(effect => effect?.sheet?.render(true));
        });

        html.find('.effect-delete').click(ev => {
            const effectId = $(ev.currentTarget)
                .parents(".item")
                .data("effectId");
            this.item.deleteEmbeddedDocuments("ActiveEffect",
                this.item.effects
                    .filter(x => x._id === effectId)
                    .map(x => x._id));
        });
    }

    addListeners(html, group) {
        html.find(`[data-group='${group}'] .new-outcome`).change(event => this._onOutcomeChange(event, html, group));
        html.find(`[data-group='${group}'] .add-outcome`).click((event) => this._onAddOutcome(event, html, group));
        html.find(`[data-group='${group}'] .delete-outcome`).click((event) => this._onDeleteOutcome(event, group));
    }

    _onOutcomeChange(event, html, group) {
        const operation = $(event.currentTarget).val();
        html.find(`[data-group='${group}'] .outcome-input`).hide();
        try {
            const handler = OutcomeInputComponentFactory.getComponent(operation, html, group);
            handler.showInputs();
        } catch (error) {
            console.error(error);
        }
    }

    async _onAddOutcome(event, html, group) {
        event.preventDefault();
        const operationSelect = html.find(`[data-group='${group}'] .new-outcome`);
        const operation = operationSelect.val();
        try {
            const handler = OutcomeInputComponentFactory.getComponent(operation, html, group);
            const data = handler.getUserInput();

            const newOutcome = { operation, context: data };
            const outcomes = foundry.utils.deepClone(this.item.system[`${group}Outcomes`] || []);
            outcomes.push(newOutcome);
            await this.item.update({ [`system.${group}Outcomes`]: outcomes });
        } catch (error) {
            console.error(error);
        }
    }

    async _onDeleteOutcome(event, group) {
        event.preventDefault();
        const index = parseInt(event.currentTarget.dataset.index, 10);
        const outcomes = foundry.utils.deepClone(this.item.system[`${group}Outcomes`] || []);
        if (index >= 0 && index < outcomes.length) {
            outcomes.splice(index, 1);
            await this.item.update({ [`system.${group}Outcomes`]: outcomes });
        }
    }

    _onDrop(event) {
        const transferString = event.dataTransfer.getData("text/plain");
        const transferObj = JSON.parse(transferString);
        if (!(transferObj.uuid && transferObj.type)) return;
        switch (transferObj.type) {
            case "Item":
                return this._onDropItem(event, transferObj);
        }
    }

    _onDropItem(event, transferObj) {
        const itemId = transferObj.uuid.split(".")[1];
        if (!itemId) return;

        const droppedItem = Item.get(itemId);
        if (!droppedItem) return;

        const droppedEffects = droppedItem.effects.map(e => {
            let eObj = e.toObject();
            delete eObj._id;
            return eObj;
        });
        this.item.createEmbeddedDocuments("ActiveEffect", [...droppedEffects]);
        this.render(true);
    }
}