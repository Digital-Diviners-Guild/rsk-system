import RSKApplyDamageDialog from "./applications/RSKApplyDamageDialog.js";
import RSKConfirmRollDialog from "./applications/RSKConfirmRollDialog.js";
import RSKItemSelectionDialog from "./applications/RSKItemSelectionDialog.js";
import RSKManageGoldDialog from "./applications/RSKManageGoldDialog.js";
import { localizeText } from "./rsk-localize.js";

export const uiService = {
    showNotification: (message) => {
        ui.notifications.warn(localizeText(message));
    },
    showDialog: async (dialogType, context = {}, options = {}) => {
        let dialog;
        switch (dialogType) {
            case "confirm-roll":
                dialog = RSKConfirmRollDialog.create(context, options);
                break;
            case "select-item":
                dialog = RSKItemSelectionDialog.create(context, options);
                break;
            case "apply-damage":
                dialog = RSKApplyDamageDialog.create(context, options);
                break;
            case "manage-gold":
                dialog = RSKManageGoldDialog.create(context, options);
                break;
            default:
                return false;
        }
        return await dialog();
    }
};