import RSKEquippable from "./RSKEquippable.js";

export default class RSKArmour extends RSKEquippable {
    getArmourValue = () =>
        typeof this.system.values?.soak !== "undefined"
            ? this.system.values.soak
            : 0;
}