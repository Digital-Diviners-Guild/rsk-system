export default class RSKEquippable extends Item {
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

    addQuality(newQuality) {
        if (newQuality.type !== "quality") return;
        if (this.hasQuality(newQuality.sourceUuid)) return;

        const updatedQualities = [...this.system.qualities ?? [], newQuality];
        this.update({ "system.qualities": updatedQualities });
    }

    removeQuality(qualitySourceUuid) {
        const updatedQualities = this.system.qualities?.filter(x => x.sourceUuid !== qualitySourceUuid);
        this.update({ "system.qualities": updatedQualities });
    }

    hasQuality(uuid) {
        return this.system.qualities?.filter(q => q.sourceUuid === uuid)?.length > 0 ?? false;
    }
}