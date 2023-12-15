export default class RSKActiveEffect extends ActiveEffect {
    get isSuppressed() {
        return this.determineSuppression()
    }

    determineSuppression() {
        if (this.parent.system.equipped) {
            return !this.parent.isEquipped;
        }
        return false;
    }
}