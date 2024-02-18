export default class RSKDialog extends Application {
    constructor() {
        super();
        this.keypressId = "dialog";
    }

    activateListeners(html) {
        super.activateListeners(html);
        html.find('button.confirm').click(this._onConfirm.bind(this));
        $(document).on(`keypress.${this.keypressId}`, function (e) {
            if (e.which == 13) {
                $('button.confirm').click();
            }
        });
    }

    async close(options) {
        $('button.confirm').off(`keypress.${this.keypressId}`);
        if (!this.isResolved) { this.resolve({ confirmed: false }) };
        super.close(options);
    }

    async _onConfirm(event) {
        this.isResolved = true;
        this.close();
    }
}