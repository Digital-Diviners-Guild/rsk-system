export default class RSKImproveYourCharacter extends Application {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            template: 'systems/rsk/templates/applications/improve-your-character.hbs',
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

    constructor(actor) {
        super();
        this.actor = actor;
    }

    async getData() {
        const data = super.getData();
        data.skills = this.actor.system.skills;
        return data;
    }

    activateListeners(html) {
        super.activateListeners(html);
        html.find('#confirmButton').click(this._onConfirm.bind(this));
    }

    async _onConfirm(event) {
        const selectedSkill = html.find('#skillDropdown').val();
        // Perform actions with the selected skill
    }
}