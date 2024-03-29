import { localizeText } from '../rsk-localize.js';
import RSKDialog from './RSKDialog.js';

// todo: maybe get rid of this for prompt too? but maybe the 'isActive' check
// is worth while for this situation.
export default class RSKImproveYourCharacter extends RSKDialog {
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
        this.keypressId = "improveCharacter";
    }

    getData() {
        const data = super.getData();
        data.skills = this.skills;
        data.abilities = this.abilities;
        data.showSkillSelect = this.showSkillSelect;
        data.showAbilitySelect = this.showAbilitySelect;
        return data;
    }

    activateListeners(html) {
        super.activateListeners(html);
        html.find('button.confirm').click(this._onConfirm.bind(this));
        $(document).on(`keypress.${this.keypressId}`, function (e) {
            if (e.which == 13) {
                $('button.confirm').click();
            }
        });
        const skillDropDown = html.find('.skill-dropdown');
        const abilityDropDown = html.find('.ability-dropdown');
        this.handleAbilityDropDownVisibility(skillDropDown.val(), abilityDropDown);
        skillDropDown.change((ev) => {
            this.handleAbilityDropDownVisibility(ev.target.value, abilityDropDown);
        });
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

    async close(options) {
        if (!this.isResolved) this.resolve({ confirmed: false });
        RSKImproveYourCharacter.isActive = false;
        $('button.confirm').off(`keypress.${this.keypressId}`);
        if (!this.isResolved) { this.resolve({ confirmed: false }) };
        super.close(options);
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
        await super._onConfirm(event);
    }
}