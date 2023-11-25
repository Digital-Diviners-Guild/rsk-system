export default class RSKItem extends Item {
    prepareData() {
        super.prepareData();
    }

    static migrateData(source) {
        if (source.type === "special") {
            let specialFeature = { ...source }
            specialFeature.type = "specialFeature";
            return specialFeature;
        };
    }
}
