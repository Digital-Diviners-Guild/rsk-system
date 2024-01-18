import RSKItemSheet from "./RSKItemSheet.js";
import { localizeText } from "../../rsk-localize.js";

export default class RSKRuneSheet extends RSKItemSheet {
    getData() {
        const context = super.getData();
        context.runeType = localizeText(CONFIG.RSK.runeType[this.item.system.type]);
        return context;
    }
}