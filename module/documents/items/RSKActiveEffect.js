export default class RSKActiveEffect extends ActiveEffect {
    isSuppressed = false;

    prepareData() {
        super.prepareData();
    }

    determineSuppression() {
        this.isSuppressed = false;
        if (this.disabled || (this.parent.documentName !== "Actor")) return;
        const parts = this.origin?.split(".") ?? [];
        const [parentType, parentId, documentType, documentId, syntheticItem, syntheticItemId] = parts;
        let item;
        if ((parentId !== this.parent.id) || (documentType !== "Item")) return;
        item = this.parent.items.get(documentId);
        if (!item) return;
        this.isSuppressed = !item.isEquipped;
    }
}