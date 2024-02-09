export default class RSKEquippableType extends foundry.abstract.TypeDataModel {
    equip(slot) {
        const newIsEquipped = !this.isEquipped;
        const newEquippedInSlot = newIsEquipped ? slot : "";
        this.parent.update({
            "system.isEquipped": newIsEquipped,
            "system.equippedInSlot": newEquippedInSlot
        });
    }
}
