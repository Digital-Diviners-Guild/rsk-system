import RSKItemType from "./RSKItemType.js";

export default class RSKArmourType extends RSKItemType {
    getArmourValue = () =>
        typeof this.soakValue !== "undefined"
            ? this.soakValue
            : 0;
}