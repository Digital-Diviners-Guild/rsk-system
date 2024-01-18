import RSKItemSheet from "./RSKItemSheet.js";
import { localizeText } from "../../rsk-localize.js";

export default class RSKEquipmentSheet extends RSKItemSheet {
    getData() {
        const context = super.getData();
        context.activeSlot = localizeText(CONFIG.RSK.activeSlotType[this.item.system.equipped.slot]);
        return context;
    }
}