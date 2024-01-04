export default class RSKItem extends Item {
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
