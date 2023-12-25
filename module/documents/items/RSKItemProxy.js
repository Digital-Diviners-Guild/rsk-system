import RSKBackground from "./RSKBackground.js";
import RSKQuality from "./RSKQuality.js";
import RSKEquipment from "./RSKEquipment.js";
import RSKArmour from "./RSKArmour.js";
import RSKItem from "./RSKItem.js";
import RSKRune from "./RSKRune.js";

const handler = {
    construct(_, args) {
        switch (args[0]?.type) {
            case "background":
                return new RSKBackground(...args);
            case "quality":
                return new RSKQuality(...args);
            case "equipment":
                return new RSKEquipment(...args);
            case "armour":
                return new RSKArmour(...args);
            case "rune":
                return new RSKRune(...args);
            default:
                return new RSKItem(...args);
        }
    }
};

export const RSKItemProxy = new Proxy(Item, handler);