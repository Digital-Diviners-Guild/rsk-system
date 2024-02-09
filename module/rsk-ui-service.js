import RSKApplyDamageDialog from "./applications/RSKApplyDamageDialog.js";
import RSKConfirmRollDialog from "./applications/RSKConfirmRollDialog.js";
import RSKItemSelectionDialog from "./applications/RSKItemSelectionDialog.js";
import { localizeText } from "./rsk-localize.js";

export const uiService = {
    showNotification: (message) => {
        ui.notifications.warn(localizeText(message));
    },
    showDialog: async (dialogType, options) => {
        let dialog;
        switch (dialogType) {
            case "confirm-roll":
                dialog = RSKConfirmRollDialog.create(options.context, options.options);
                break;
            case "select-item":
                dialog = RSKItemSelectionDialog.create(options.context, options.options);
                break;
            case "apply-damage":
                dialog = RSKApplyDamageDialog.create(options.context, options.options);
                break;
            default:
                return false;
        }
        return await dialog();
    }
};