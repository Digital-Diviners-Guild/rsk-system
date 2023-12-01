export default class RSKApplyDamageDialog extends Application {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            template: 'systems/rsk-system/templates/applications/apply-damage-dialog.hbs',
            classes: ["rsk", "dialog"],
            width: 480,
            height: 250
        });
    }

    static create = (context, options) =>
        () => new Promise((resolve) => {
            const dialog = new RSKApplyDamageDialog(resolve, context, options);
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
        this.damage = 0;
    }

    getData() {
        return {
            context: this.context,
            damage: this.damage
        }
    }

    async close(options) {
        if (!this.isResolved) this.resolve({ confirmed: false, damage: 0 });
        super.close(options);
    }

    activateListeners(html) {
        html.find("button.apply").click((ev) => {
            this.damage = Number($("#damage-value").val());
            this.resolve({
                confirmed: true,
                damage: this.damage
            });
            this.isResolved = true;
            this.close();
        });
    }
}