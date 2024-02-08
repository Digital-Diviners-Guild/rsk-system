export default class RSKEquippableType extends foundry.abstract.TypeDataModel {
    equip() {
        if (!this.hasOwnProperty("isEquipped")) return;
        const newIsEquipped = !this.isEquipped;
        this.parent.update({ "system.isEquipped": newIsEquipped });
    }

    meetsEquipRequirements(actor) { return true; }
}
