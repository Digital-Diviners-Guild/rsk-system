import { localizeText } from "../rsk-localize.js";
import RSKDialog from "./RSKDialog.js";

export default class RSKManageGoldDialog extends RSKDialog {
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
        this.keypressId = "manageGold";
    }

    getData() {
        return {
            context: this.context,
        }
    }

    async close(options) {
        RSKManageGoldDialog.isActive = false;
        super.close(options);
    }

    async _onConfirm(event) {
        const amount = Number($("#amount").val());
        this.resolve({
            confirmed: true,
            amount
        });
        await super._onConfirm(event);
    }
}