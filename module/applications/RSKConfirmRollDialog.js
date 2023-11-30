export default class RSKConfirmRollDialog extends Application {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            template: 'systems/rsk-system/templates/applications/roll-dialog.hbs',
            classes: ["rsk", "dialog"],
            width: 480,
            height: 250
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
        this.advantageDisadvantageOptions = { normal: "RSK.Normal", advantage: "RSK.Advantage", disadvantage: "RSK.Disadvantage" };
        this.advantageDisadvantage = "normal";
    }

    getData() {
        return {
            rollModes: CONFIG.Dice.rollModes,
            rollMode: this.rollMode,
            context: this.context,
            skills: this._localizeList(this.context.skills, CONFIG.RSK.skills),
            abilities: this._localizeList(this.context.abilities, CONFIG.RSK.abilities),
            testNumber: this.testNumber,
            advantageDisadvantageOptions: this.advantageDisadvantageOptions,
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
            this.advantageDisadvantage = $("#adv-dadv-select").val();
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

    _localizeList(obj, lang) {
        return Object.keys(obj)
            .map(function (index) {
                return {
                    index: index,
                    label: game.i18n.format(lang[index]),
                    value: obj[index]
                }
            });
    }
}