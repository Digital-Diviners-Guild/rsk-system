import RSKEquippableType from "./RSKEquippableType.js";

export default class RSKArmourType extends RSKEquippableType {
    getArmourValue = () =>
        typeof this.soakValue !== "undefined"
            ? this.soakValue
            : 0;
}