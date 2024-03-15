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
        this.addListeners(html, "usage");
        this.addListeners(html, "target");
    }

    addListeners(html, group) {
        html.find(`[data-group='${group}'] .new-outcome`).change(event => this._onOutcomeChange(event, html, group));
        html.find(`[data-group='${group}'] .add-outcome`).click((event) => this._onAddOutcome(event, html, group));
        html.find(`[data-group='${group}'] .delete-outcome`).click((event) => this._onDeleteOutcome(event, group));
    }

    _onOutcomeChange(event, html, group) {
        const operation = $(event.currentTarget).val();
        html.find(`[data-group='${group}'] .outcome-input`).hide();
        debugger;
        try {
            const handler = OperationInputComponentFactory.getComponent(operation, html, group);
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
            const handler = OperationInputComponentFactory.getComponent(operation, html, group);
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
}


class OperationInputComponentFactory {
    static getComponent(operation, html, group) {
        const components = {
            addStatuses: AddStatusesInputComponent,
            //removeStatuses: AddStatusesInputComponent,
            receiveDamage: ReceiveDamageInputComponent,
            restoreLifePoints: RestoreLifePointsInputComponent,
        };

        const componentClass = components[operation];
        if (!componentClass) {
            throw new Error("Unsupported operation type: " + operation);
        }

        return new componentClass(html, group);
    }
}

class OperationInputComponent {
    constructor(html, group) {
        this.html = html;
        this.group = group;
    }

    showInputs() {
        // Implementation specific to the operation
    }

    getUserInput() {
        // Implementation specific to the operation
    }
}

class AddStatusesInputComponent extends OperationInputComponent {
    showInputs() {
        this.html.find(`[data-group='${this.group}'] .status-input`).show();
    }

    getUserInput() {
        const operationStatus = this.html.find(``).val().split(",");
        return { statusIds: [...operationStatus] };
    }
}

class RestoreLifePointsInputComponent extends OperationInputComponent {
    showInputs() {
        this.html.find(`[data-group='${this.group}'] .amount-input`).show();
    }

    getUserInput() {
        const operationAmount = parseInt(this.html.find(``).val(), 10) || 1;
        return { amount: operationAmount };
    }
}

class ReceiveDamageInputComponent extends OperationInputComponent {
    showInputs() {
        this.html.find(`[data-group='${this.group}'] .damage-input`).show();
    }

    getUserInput() {
        const stab = parseInt(this.html.find(`[data-group='${this.group}'] .damage-input-stab`).val(), 10) || 0;
        const slash = parseInt(this.html.find(`[data-group='${this.group}'] .damage-input-slash`).val(), 10) || 0;
        const crush = parseInt(this.html.find(`[data-group='${this.group}'] .damage-input-crush`).val(), 10) || 0;
        const air = parseInt(this.html.find(`[data-group='${this.group}'] .damage-input-air`).val(), 10) || 0;
        const earth = parseInt(this.html.find(`[data-group='${this.group}'] .damage-input-earth`).val(), 10) || 0;
        const water = parseInt(this.html.find(`[data-group='${this.group}'] .damage-input-water`).val(), 10) || 0;
        const fire = parseInt(this.html.find(`[data-group='${this.group}'] .damage-input-fire`).val(), 10) || 0;
        const typeless = parseInt(this.html.find(`[data-group='${this.group}'] .damage-input-typeless`).val(), 10) || 0;
        return { stab, slash, crush, air, earth, water, fire, typeless };
    }
}
