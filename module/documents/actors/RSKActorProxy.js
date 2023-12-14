import RSKCharacter from "./RSKCharacter.js";
import RSKActor from "./RSKActor.js";

const handler = {
    construct(_, args) {
        switch (args[0]?.type) {
            case "character":
                return new RSKCharacter(...args);
            default:
                return new RSKActor(...args);
        }
    }
};

export const RSKActorProxy = new Proxy(Actor, handler);