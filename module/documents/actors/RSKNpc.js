import RSKActor from "./RSKActor.js";

export default class RSKNpc extends RSKActor {
    _getArmourSoakValue(damageType) {
        if (damageType === "something were weak to") {
            return Math.max(0, (this.system.armourValue - 0)); // minus weakness value; // can a weakness give you negative armour??
        }
        if (damageType === "something were strong to") {
            return this.system.armourValue + 0; // plus stength value;
        }
        return this.system.armourValue;
    }
}