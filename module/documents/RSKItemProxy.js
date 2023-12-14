
import RSKItem from "./RSKItem.js";
import RSKQuality from "./RSKQuality.js";

const handler = {
    construct(_, args) {
        switch (args[0]?.type) {
            case "quality":
                return new RSKQuality(...args);
            default:
                return new RSKItem(...args);
        }
    }
};

export const RSKItemProxy = new Proxy(Item, handler);