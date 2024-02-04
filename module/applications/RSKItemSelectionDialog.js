export default class RSKItemSelectionDialog extends Application {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            template: 'systems/rsk/templates/applications/item-selection-dialog.hbs',
            classes: ["rsk", "dialog"],
            width: 480,
            height: 250
        });
    }

    static create = (context, options) =>
        () => new Promise((resolve) => {
            const dialog = new RSKItemSelectionDialog(resolve, context, options);
            dialog.render(true);
        });

    constructor(resolve, context, options = {}) {
        super();
        this.resolve = resolve;
        this.context = context;
    }

    async close(options) {
        if (!this.isResolved) this.resolve({ confirmed: false });
        super.close(options);
    }

    async getData() {
        const data = super.getData();
        data.items = this.context.items;
        return data;
    }

    activateListeners(html) {
        super.activateListeners(html);
        html.find('.confirm-button').click(this._onConfirm.bind(this));
    }

    async _onConfirm(event) {
        const id = $('.item-dropdown').val();
        this.resolve({
            confirmed: true,
            id
        });
        this.isResolved = true;
        this.close();
    }
}