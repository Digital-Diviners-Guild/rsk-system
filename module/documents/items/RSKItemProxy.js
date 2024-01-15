import RSKBackground from "./RSKBackground.js";
import RSKArmour from "./RSKArmour.js";
import RSKEquippable from "./RSKEquippable.js";

const handler = {
    construct(_, args) {
        switch (args[0]?.type) {
            case "background":
                return new RSKBackground(...args);
            case "equipment":
            case "cape":
                return new RSKEquippable(...args);
            case "armour":
                return new RSKArmour(...args);
            default:
                return new Item(...args);
        }
    }
};

export const RSKItemProxy = new Proxy(Item, handler);