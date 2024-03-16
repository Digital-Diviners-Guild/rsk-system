
//todo: need to support inputting dice formula for outcome amounts like healing/damaging 1d4 etc
export class OutcomeInputComponentFactory {
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

class OutcomeInputComponent {
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

export class StatusesInputComponent extends OutcomeInputComponent {
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

export class RestoreLifePointsInputComponent extends OutcomeInputComponent {
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

export class ReceiveDamageInputComponent extends OutcomeInputComponent {
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