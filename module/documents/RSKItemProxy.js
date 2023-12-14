
import RSKItem from "./RSKItem.js";

const handler = {
    construct(_, args) {
        switch (args[0]?.type) {
            default:
                return new RSKItem(...args);
        }
    }
};

export const RSKItemProxy = new Proxy(RSKItem, handler);