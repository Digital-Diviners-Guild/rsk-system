export default class RSKItem extends Item {
    prepareData() {
        super.prepareData();
    }

    addQuality(qualityData) {
        if (qualityData.type !== "quality") return;

        this.executeQualitiesOperation(() => {
            if (this.hasQuality(qualityData.sourceUuid)) return;
            const qualities = [...this.system.values.qualities, qualityData];
            this.update({ system: { values: { qualities: qualities } } });
        });
    }

    removeQuality(qualitySourceUuid) {
        this.executeQualitiesOperation(() => {
            const qualities = this.system.values.qualities
                .filter(x => x.sourceUuId !== qualitySourceUuid)
            this.update({ system: { values: { qualities: qualities } } });
        });
    }

    hasQuality(uuid) {
        return this.executeQualitiesOperation(() =>
            this.system.values.qualities.filter(q => q.sourceUuId === uuid).length > 0, false)
    }

    executeQualitiesOperation(op, defaultValue = {}) {
        if (this.system.hasOwnProperty("values") && this.system.values.hasOwnProperty("qualities")) {
            return op();
        }
        return defaultValue;
    }

    getArmourValue() {
        return this.system.hasOwnProperty("values") && this.system.values.hasOwnProperty("soak")
            ? this.system.values.soak
            : 0;
    }
}
