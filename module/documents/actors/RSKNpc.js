import RSKActor from "./RSKActor.js";

export default class RSKNpc extends RSKActor {
    getArmourValue() {
        return this.system.armourValue;
    }
}