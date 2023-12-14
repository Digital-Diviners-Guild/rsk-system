export default class RSKItem extends Item {
    get isEquipped() {
        return this.system.equipped && this.system.equipped.isEquipped;
    }

    get inSlot() {
        return this.system.equipped && this.system.equipped.slot;
    }

    getArmourValue = () =>
        typeof this.system.values?.soak !== "undefined"
            ? this.system.values.soak
            : 0;

    equip() {
        if (!this.system.equipped) return;
        this.system.equipped.isEquipped = !this.system.equipped.isEquipped;
        this.update({ "system.equipped": { ...this.system.equipped } });
    }
}
