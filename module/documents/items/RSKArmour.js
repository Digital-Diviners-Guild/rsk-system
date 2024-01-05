import RSKEquippable from "./RSKEquippable.js";

export default class RSKArmour extends RSKEquippable {
    //todo: need to check if damageType gets extra soak
    getArmourValue = (damageType) =>
        typeof this.system.values?.soak !== "undefined"
            ? this.system.values.soak
            : 0;
}