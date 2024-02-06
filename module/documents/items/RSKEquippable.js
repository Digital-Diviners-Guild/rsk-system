export default class RSKEquippable extends Item {
    equip() {
        if (!this.system.hasOwnProperty("isEquipped")) return;
        const newIsEquipped = !this.system.isEquipped;
        this.update({ "system.isEquipped": newIsEquipped });
    }
}