import { localizeText } from '../rsk-localize.js';

export default class RSKImproveYourCharacter extends Application {
    static isActive;

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            title: localizeText('RSK.ImproveYourCharacter'),
            template: 'systems/rsk/templates/applications/improve-your-character-dialog.hbs',
            classes: ['rsk', 'dialog'],
            width: 480,
            height: 250
        });
    }

    static create = (context, options) =>
        () => new Promise((resolve) => {
            if (RSKImproveYourCharacter.isActive) return;
            RSKImproveYourCharacter.isActive = true;
            const dialog = new RSKImproveYourCharacter(resolve, context, options);
            dialog.render(true);
        });

    constructor(resolve, context, options = {}) {
        super();
        this.resolve = resolve;
        this.context = context;
        this.skills = context.skills;
        this.abilities = context.abilities;
    }

    async close(options) {
        if (!this.isResolved) this.resolve({ confirmed: false });
        RSKImproveYourCharacter.isActive = false;
        super.close(options);
    }

    async getData() {
        const data = super.getData();
        data.skills = this.skills;
        data.abilities = this.abilities;
        data.showSkillSelect = this.showSkillSelect;
        data.showAbilitySelect = this.showAbilitySelect;
        return data;
    }

    willGainAbility(selected) {
        return selected
            ? this.skills.find(s => s.index === selected).value === 4
            : false;
    }

    handleAbilityDropDownVisibility(selected, abilitySelect) {
        const show = this.willGainAbility(selected);
        if (show) {
            abilitySelect.show();
        } else {
            abilitySelect.hide();
        }
    }

    activateListeners(html) {
        super.activateListeners(html);
        html.find('.confirm-button').click(this._onConfirm.bind(this));
        const skillDropDown = html.find('.skill-dropdown');
        const abilityDropDown = html.find('.ability-dropdown');
        this.handleAbilityDropDownVisibility(skillDropDown.val(), abilityDropDown);
        skillDropDown.change((ev) => {
            this.handleAbilityDropDownVisibility(ev.target.value, abilityDropDown);
        });
    }

    async _onConfirm(event) {
        const selectedSkill = $('.skill-dropdown').val();
        const selectedAbility = this.willGainAbility(selectedSkill)
            ? $('.ability-dropdown').val()
            : false;
        this.resolve({
            confirmed: true,
            selectedSkill: selectedSkill,
            selectedAbility: selectedAbility
        });
        this.isResolved = true;
        this.close();
    }
}