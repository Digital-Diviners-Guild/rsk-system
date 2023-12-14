export default class RSKQuality extends Item {
    addQuality(newQuality) {
        if (newQuality.type !== "quality") return;
        if (this.hasQuality(newQuality.sourceUuid)) return;

        const updatedQualities = [...qualities, newQuality];
        this.update({ "system.values.qualities": updatedQualities });
    }

    removeQuality(qualitySourceUuid) {
        const updatedQualities = this.system.values?.qualities?.filter(x => x.sourceUuid !== qualitySourceUuid);
        this.update({ "system.values.qualities": updatedQualities });
    }

    hasQuality(uuid) {
        return this.system.values?.qualities?.filter(q => q.sourceUuid === uuid)?.length > 0 ?? false;
    }
}
