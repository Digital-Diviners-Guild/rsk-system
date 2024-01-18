export default class RSKImproveYourCharacter extends Application {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            template: 'systems/rsk/templates/applications/improve-your-character-dialog.hbs',
            classes: ["rsk", "dialog"],
            width: 480,
            height: 250
        });
    }

    static create = (context, options) =>
        () => new Promise((resolve) => {
            const dialog = new RSKImproveYourCharacter(resolve, context, options);
            dialog.render(true);
        });

    constructor(resolve, context, options = {}) {
        super();
        this.resolve = resolve;
        this.context = context;
        this.skills = context.skills;
        this.abilities = context.abilities;
        this.showSkillSelect = options.showSkillSelect ?? true;
        this.showAbilitySelect = options.showAbilitySelect ?? false;
    }

    async close(options) {
        if (!this.isResolved) this.resolve({ confirmed: false });
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

    activateListeners(html) {
        super.activateListeners(html);
        html.find('.confirm-button').click(this._onConfirm.bind(this));
    }

    async _onConfirm(event) {
        const selectedSkill = $('.skill-dropdown').val();
        const selectedAbility = $('.ability-dropdown').val();
        this.resolve({
            confirmed: true,
            selectedSkill: selectedSkill,
            selectedAbility: selectedAbility
        });
        this.isResolved = true;
        this.close();
    }
}