export default class RSKConfirmRollDialog extends Application {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            template: 'systems/rsk-system/templates/items/roll-dialog.hbs',
            classes: ["rsk", "dialog"],
            width: 420,
            height: 200
        });
    }

    static create = (context, options) =>
        () => new Promise((resolve) => {
            const dialog = new RSKConfirmRollDialog(resolve, context);
            dialog.render(true);
        });

    constructor(
        resolve,
        context,
    ) {
        super();
        this.resolve = resolve;
        this.context = context;

        this.abilityLevel = 1;
        this.skillLevel = 1;
        this.rollMode = CONFIG.Dice.rollModes.publicroll;
        this.testNumber = this.abilityLevel + this.skillLevel;
    }

    getData() {
        return {
            rollModes: CONFIG.Dice.rollModes,
            rollMode: this.rollMode,
            context: this.context,
            testNumber: this.testNumber,
        }
    }

    async close(options) {
        if (!this.isResolved) this.resolve({ rolled: false });
        super.close(options);
    }

    activateListeners(html) {
        html.find("button.roll").click((ev) => {
            this.abilityLevel = Number($("#ability-select").val());
            this.skillLevel = Number($("#skill-select").val());
            this.rollMode = $("#roll-mode-select").val();
            this.testNumber = this.abilityLevel + this.skillLevel;
            this.resolve({ rolled: true, rollMode: this.rollMode, testNumber: this.testNumber });
            this.isResolved = true;
            this.close();
        });
    }
}