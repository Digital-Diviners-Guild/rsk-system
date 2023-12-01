export default class RSKItem extends Item {
    prepareData() {
        super.prepareData();
    }

    addQuality(qualityData) {
        if (qualityData.type !== "quality") return;

        this.executeQualitiesOperation((qualities) => {
            if (this.hasQuality(qualityData.sourceUuid)) return;
            const updatedQualities = [...qualities, qualityData];
            this.update({ system: { values: { qualities: updatedQualities } } });
        });
    }

    removeQuality(qualitySourceUuid) {
        this.executeQualitiesOperation((qualities) => {
            const updatedQualities = qualities.filter(x => x.sourceUuId !== qualitySourceUuid)
            this.update({ system: { values: { qualities: updatedQualities } } });
        });
    }

    hasQuality(uuid) {
        return this.executeQualitiesOperation((qualities) =>
            qualities.filter(q => q.sourceUuId === uuid).length > 0, false)
    }

    executeQualitiesOperation = (op, defaultValue = {}) =>
        typeof this.system.values?.qualities !== "undefined"
            ? op(this.system.values.qualities)
            : defaultValue;

    getArmourValue = () =>
        typeof this.system.values?.soak !== "undefined"
            ? this.system.values.soak
            : 0;
}
