export default class RSKActiveEffect extends ActiveEffect {
    get isSuppressed() {
        return this.determineSuppression()
    }

    determineSuppression() {
        return !(this.parent.system.equipped && this.parent.isEquipped);
    }
}