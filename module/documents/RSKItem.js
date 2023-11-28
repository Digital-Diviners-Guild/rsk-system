export default class RSKItem extends Item {
    prepareData() {
        super.prepareData();
    }

    addQuality(qualityData) {
        if (this.system.hasOwnProperty("values") && this.system.values.hasOwnProperty("qualities")) {
            const qualities = [...this.system.values.qualities, qualityData];
            this.update({ system: { values: { qualities: qualities } } });
        }
    }

    removeQuality(qualitySourceUuid) {
        if (this.system.hasOwnProperty("values") && this.system.values.hasOwnProperty("qualities")) {
            const qualities = this.system.values.qualities
                .filter(x => x.sourceUuId !== qualitySourceUuid)
            this.update({ system: { values: { qualities: qualities } } });
        }
    }

    hasQuality(uuid) {
        return this.system.values?.qualities?.filter(q => q.sourceUuId === uuid)?.length ?? 0 > 0;
    }
}
