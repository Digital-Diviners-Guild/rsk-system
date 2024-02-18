import { localizeText } from "../rsk-localize.js";

export default class RSKManageGoldDialog extends Application {
    static isActive;

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            title: localizeText("RSK.ManageGold"),
            template: 'systems/rsk/templates/applications/manage-gold-dialog.hbs',
            classes: ["rsk", "dialog"],
            width: 300,
            height: 150
        });
    }

    static create = (context, options) =>
        () => new Promise((resolve) => {
            if (RSKManageGoldDialog.isActive) return;
            RSKManageGoldDialog.isActive = true;
            const dialog = new RSKManageGoldDialog(resolve, context, options);
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
    }

    getData() {
        return {
            context: this.context,
        }
    }

    async close(options) {
        if (!this.isResolved) this.resolve({ confirmed: false, damage: 0 });
        RSKManageGoldDialog.isActive = false;
        super.close(options);
    }

    activateListeners(html) {
        html.find("button.confirm").click((ev) => {
            const amount = Number($("#amount").val());
            this.resolve({
                confirmed: true,
                amount
            });
            this.isResolved = true;
            this.close();
        });
    }
}