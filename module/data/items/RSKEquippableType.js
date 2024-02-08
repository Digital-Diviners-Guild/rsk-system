export default class RSKEquippableType extends foundry.abstract.TypeDataModel {
    equip() {
        if (!this.hasOwnProperty("isEquipped")) return;
        const newIsEquipped = !this.isEquipped;
        this.parent.update({ "system.isEquipped": newIsEquipped });
    }

    //todo: remove this when we move the concept to on use not on equip.
    meetsEquipRequirements(actor) { return true; }
}
