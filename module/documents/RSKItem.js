export default class RSKItem extends Item {
    getArmourValue = () =>
        typeof this.system.values?.soak !== "undefined"
            ? this.system.values.soak
            : 0;

}
