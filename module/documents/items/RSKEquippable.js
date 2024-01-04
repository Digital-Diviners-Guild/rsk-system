import RSKItem from "./RSKItem.js";

export default class RSKEquippable extends RSKItem {
    get isEquipped() {
        return this.system.equipped && this.system.equipped.isEquipped;
    }

    get inSlot() {
        return this.system.equipped && this.system.equipped.slot;
    }

    equip() {
        if (!this.system.equipped) return;
        this.system.equipped.isEquipped = !this.system.equipped.isEquipped;
        this.update({ "system.equipped": { ...this.system.equipped } });
    }
}