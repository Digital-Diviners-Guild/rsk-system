export default class RSKConfirmRollDialog extends Application {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            template: 'systems/rsk-system/templates/items/roll-dialog.hbs',
            classes: ["rsk", "dialog"],
            width: 480,
            height: 300
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
        this.isAdvantage = false;
        this.isDisadvantage = false;
        this.isNormal = true;
        this.advantageDisadvantage = "";
    }

    getData() {
        return {
            rollModes: CONFIG.Dice.rollModes,
            rollMode: this.rollMode,
            context: this.context,
            testNumber: this.testNumber,
            isAdvantage: this.isAdvantage,
            isDisadvantage: this.isDisadvantage,
            isNormal: this.isNormal,
            advantageDisadvantage: this.advantageDisadvantage
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
            this.advantageDisadvantage = $('input[name="advDadv"]:checked').val();
            this.testNumber = this.abilityLevel + this.skillLevel;
            this.resolve({
                rolled: true,
                rollMode: this.rollMode,
                testNumber: this.testNumber,
                isAdvantage: this.advantageDisadvantage === "advantage",
                isDisadvantage: this.advantageDisadvantage === "disadvantage",
            });
            this.isResolved = true;
            this.close();
        });
    }
}