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
        html.find('.effect-edit').click(ev => {
            const effectId = $(ev.currentTarget)
                .parents(".item")
                .data("effectId");
            const effect = this.item.effects.get(effectId);
            effect.sheet.render(true);
        });
        if (!this.isEditable) return;

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

//todo: need to support inputting dice formula for outcome amounts like healing/damaging 1d4 etc
class OperationInputComponentFactory {
    static getComponent(operation, html, group) {
        const components = {
            addStatuses: () => new StatusesInputComponent(html, group, "Add Statuses"),
            removeStatuses: () => new StatusesInputComponent(html, group, "Remove Statuses"),
            receiveDamage: () => new ReceiveDamageInputComponent(html, group),
            restoreLifePoints: () => new RestoreLifePointsInputComponent(html, group),
        };

        const componentFactory = components[operation];
        if (!componentFactory) {
            throw new Error("Unsupported operation type: " + operation);
        }

        return componentFactory();
    }
}

class OperationInputComponent {
    constructor(html, group, options = {}) {
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

class StatusesInputComponent extends OperationInputComponent {
    constructor(html, group, statusType) {
        super(html, group);
        this.statusType = statusType;
    }

    showInputs() {
        this.html.find(`[data-group='${this.group}'] .status-input`).show();
    }

    getUserInput() {
        const value = this.html.find(`[data-group='${this.group}'] .outcome-status`).val();
        const operationStatus = value.split(",");
        return {
            description: `${this.statusType}: ${value}`,
            statusIds: [...operationStatus]
        };
    }
}

class RestoreLifePointsInputComponent extends OperationInputComponent {
    showInputs() {
        this.html.find(`[data-group='${this.group}'] .receive-life-input`).show();
    }

    getUserInput() {
        const operationAmount = parseInt(this.html.find(`[data-group='${this.group}'] .receive-life-amount`).val(), 10) || 1;
        return {
            description: `Restore Life Points: ${operationAmount}`,
            amount: operationAmount
        };
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
        const damage = { stab, slash, crush, air, earth, water, fire, typeless }
        return {
            description: `Receive Damage: ${Object.keys(damage)
                .filter((i) => damage[i] > 0)
                .map((i) => `${damage[i]} (${i})`)
                .join(', ')}`,
            damage
        };
    }
}
