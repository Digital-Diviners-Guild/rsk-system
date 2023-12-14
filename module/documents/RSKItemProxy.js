
import RSKBackground from "./RSKBackground.js";
import RSKQuality from "./RSKQuality.js";
import RSKItem from "./RSKItem.js";

const handler = {
    construct(_, args) {
        switch (args[0]?.type) {
            case "background":
                return new RSKBackground(...args);
            case "quality":
                return new RSKQuality(...args);
            default:
                return new RSKItem(...args);
        }
    }
};

export const RSKItemProxy = new Proxy(Item, handler);