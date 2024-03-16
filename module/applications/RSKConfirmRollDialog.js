import { localizeObject, localizeText } from "../rsk-localize.js";
import RSKDialog from "./RSKDialog.js";

export default class RSKConfirmRollDialog extends RSKDialog {
    static isActive;

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            title: localizeText("RSK.ConfirmRoll"),
            template: 'systems/rsk/templates/applications/roll-dialog.hbs',
            classes: ["rsk", "dialog"],
            width: 480,
            height: 250
        });
    }

    static create = (context, options) =>
        () => new Promise((resolve) => {
            if (RSKConfirmRollDialog.isActive) return;
            RSKConfirmRollDialog.isActive = true;
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

        this.selectedAbility = context.hasOwnProperty("defaultAbility") ? context.defaultAbility : "strength";
        this.selectedSkill = context.hasOwnProperty("defaultSkill") ? context.defaultSkill : "attack";
        this.targetNumberModifier = context.hasOwnProperty("targetNumberModifier") ? context.targetNumberModifier : 0;
        this.rollMode = CONFIG.Dice.rollModes.publicroll;
        this.advantageDisadvantageOptions = { normal: "RSK.Normal", advantage: "RSK.Advantage", disadvantage: "RSK.Disadvantage" };
        this.advantageDisadvantage = "normal";
        this.keypressId = "confirmRoll";
    }

    getData() {
        return {
            rollModes: CONFIG.Dice.rollModes,
            rollMode: this.rollMode,
            context: this.context,
            skills: localizeObject(this.context.skills, CONFIG.RSK.skills, (obj, index) => obj[index].level),
            abilities: localizeObject(this.context.abilities, CONFIG.RSK.abilities, (obj, index) => obj[index].level),
            selectedAbility: this.selectedAbility,
            selectedSkill: this.selectedSkill,
            advantageDisadvantageOptions: this.advantageDisadvantageOptions,
            advantageDisadvantage: this.advantageDisadvantage,
            targetNumberModifier: this.targetNumberModifier
        }
    }

    async close(options) {
        RSKConfirmRollDialog.isActive = false;
        super.close(options);
    }

    async _onConfirm(event) {
        this.rollMode = $("#roll-mode-select").val();
        this.selectedSkill = $("#skill-select").val();
        this.selectedAbility = $("#ability-select").val();
        this.advantageDisadvantage = $("#adv-dadv-select").val();
        this.targetNumberModifier = Number($("#tn-modifier").val());
        this.resolve({
            confirmed: true,
            rollMode: this.rollMode,
            rollType: this.advantageDisadvantage,
            skill: this.selectedSkill,
            ability: this.selectedAbility,
            targetNumberModifier: this.targetNumberModifier
        });
        await super._onConfirm(event);
    }
}