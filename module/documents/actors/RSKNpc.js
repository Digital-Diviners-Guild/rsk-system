import RSKActor from "./RSKActor.js";

export default class RSKNpc extends RSKActor {
    _getArmourSoakValue() {
        return this.system.armourValue;
    }
}