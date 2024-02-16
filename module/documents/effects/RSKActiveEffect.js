export default class RSKActiveEffect extends ActiveEffect {
    get isSuppressed() {
        return this.determineSuppression()
    }

    determineSuppression() {
        if (this.parent.system.hasOwnProperty("equippedInSlot")) {
            return !this.parent.system.isEquipped;
        }
        // these will get created directly on the actor when consumed
        // don't want them to 'transfer' on pickup.
        return this.parent.type === "consumable";
    }
}