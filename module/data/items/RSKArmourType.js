import RSKEquippableType from "./RSKEquippableType.js";

export default class RSKArmourType extends RSKEquippableType {
    getArmourValue = () =>
        typeof this.values?.soak !== "undefined"
            ? this.values.soak
            : 0;
}