import { localizeList } from "../rsk-localize.js";

export default class RSKConfirmRollDialog extends Application {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            template: 'systems/rsk/templates/applications/roll-dialog.hbs',
            classes: ["rsk", "dialog"],
            width: 480,
            height: 250
        });
    }

    static create = (context, options) =>
        () => new Promise((resolve) => {
            const dialog = new RSKConfirmRollDialog(resolve, context, options);
            dialog.render(true);
        });

    constructor(
        resolve,
        context,
        options = {}
    ) {
        super();
        this.resolve = resolve;
        this.context = context;

        this.selectedAbility = options.hasOwnProperty("defaultAbility") ? options.defaultAbility : "strength";
        this.selectedSkill = options.hasOwnProperty("defaultSkill") ? options.defaultSkill : "attack";
        this.rollMode = CONFIG.Dice.rollModes.publicroll;
        this.advantageDisadvantageOptions = { normal: "RSK.Normal", advantage: "RSK.Advantage", disadvantage: "RSK.Disadvantage" };
        this.advantageDisadvantage = "normal";
        this.targetNumberModifier = 0;
    }

    getData() {
        return {
            rollModes: CONFIG.Dice.rollModes,
            rollMode: this.rollMode,
            context: this.context,
            skills: localizeList(this.context.skills, CONFIG.RSK.skills, (obj, index) => obj[index].level),
            abilities: localizeList(this.context.abilities, CONFIG.RSK.abilities),
            selectedAbility: this.selectedAbility,
            selectedSkill: this.selectedSkill,
            advantageDisadvantageOptions: this.advantageDisadvantageOptions,
            advantageDisadvantage: this.advantageDisadvantage,
            targetNumberModifier: this.targetNumberModifier
        }
    }

    async close(options) {
        if (!this.isResolved) this.resolve({ rolled: false });
        super.close(options);
    }

    activateListeners(html) {
        html.find("button.roll").click((ev) => {
            this.rollMode = $("#roll-mode-select").val();
            this.selectedSkill = $("#skill-select").val();
            this.selectedAbility = $("#ability-select").val();
            this.advantageDisadvantage = $("#adv-dadv-select").val();
            this.targetNumberModifier = Number($("#tn-modifier").val());
            this.resolve({
                rolled: true,
                rollMode: this.rollMode,
                rollType: this.advantageDisadvantage,
                skill: this.selectedSkill,
                ability: this.selectedAbility,
                targetNumberModifier: this.targetNumberModifier
            });
            this.isResolved = true;
            this.close();
        });
    }
}