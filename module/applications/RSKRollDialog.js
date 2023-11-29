export default class RSKRollDialog extends Application {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            template: 'systems/rsk-system/templates/items/roll-dialog.hbs',
            classes: ["rsk", "dialog"],
            width: 420,
            height: 200
        });
    }

    static defineSchema() {
        const fields = foundry.data.fields;
        return {
            testNumber: new fields.NumberField()
        }
    }

    constructor(
        resolve,
        context,
    ) {
        super();
        this.resolve = resolve;
        this.context = context;
        this.testNumber = 3;
    }

    getData() {
        return {
            rollModes: CONFIG.Dice.rollModes,
            testNumber: this.testNumber
        }
    }

    activateListeners(html) {
        html.find("input.test-number").on("change", (ev) => {
            this.testNumber = ev.target.value;
        });

        html.find("button.roll").click((ev) => {
            this.resolve({ rolled: true, testNumber: this.testNumber });
            this.isResolved = true;
            this.close();
        });
    }
}