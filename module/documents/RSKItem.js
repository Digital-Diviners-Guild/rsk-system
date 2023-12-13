export default class RSKItem extends Item {
    get isEquipped() {
        return this.system.equipped && this.system.equipped.isEquipped;
    }

    get inSlot() {
        return this.system.equipped && this.system.equipped.slot;
    }

    prepareData() {
        super.prepareData();
    }

    addQuality(qualityData) {
        if (qualityData.type !== "quality") return;

        this.executeQualitiesOperation((qualities) => {
            if (this.hasQuality(qualityData.sourceUuid)) return;
            const updatedQualities = [...qualities, qualityData];
            this.update({ "system.values.qualities": updatedQualities });
        });
    }

    removeQuality(qualitySourceUuid) {
        this.executeQualitiesOperation((qualities) => {
            const updatedQualities = qualities.filter(x => x.sourceUuId !== qualitySourceUuid)
            this.update({ "system.values.qualities": updatedQualities });
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

    mapSkillImprovementOperation = (op, defaultValue = {}) => {
        if (this.type !== "background") return defaultValue;

        const improvements = this.system.skillImprovements;
        for (let skill in improvements) {
            const improvement = improvements[skill];
            op(skill, improvement);
        }
    }

    applyBackgroundSkillImprovements = (actor) => {
        if (this.type !== "background"
            || this.flags.rsk?.appliedBackground
            || this.getBackgroundSkillImprovementTotal() === 0) return;
        this.mapSkillImprovementOperation((skill, improvement) =>
            actor.increaseSkillLevel(skill, improvement));
        this.update({ "flags.rsk.appliedBackground": true });
    };

    removeBackgroundSkillImprovements = (actor) => {
        if (this.type !== "background") return;
        this.mapSkillImprovementOperation((skill, improvement) =>
            actor.decreaseSkillLevel(skill, improvement));
        this.update({ "flags.rsk.appliedBackground": false });
    };

    getBackgroundSkillImprovementTotal = () =>
        this.type === "background"
            ? Object
                .keys(this.system.skillImprovements)
                .map(si => this.system.skillImprovements[si])
                .reduce((acc, x) => acc += x, 0)
            : 0;

    delete() {
        if (this.type === "background" && this.actor) {
            this.removeBackgroundSkillImprovements(this.actor);
        }
        super.delete();
    }

    equip() {
        if (!this.system.equipped) return;
        //test with head slot
        //todo: use the correct slot
        this.system.equipped.slot = "head";
        this.system.equipped.isEquipped = !this.system.equipped.isEquipped;
        this.update({ "system.equipped": { ...this.system.equipped } });
    }
}
