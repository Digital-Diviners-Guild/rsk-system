export default class RSKItem extends Item {
    get isEquipped() {
        return this.system.equipped && this.system.equipped.isEquipped;
    }

    get inSlot() {
        return this.system.equipped && this.system.equipped.slot;
    }

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
        this.system.equipped.isEquipped = !this.system.equipped.isEquipped;
        this.update({ "system.equipped": { ...this.system.equipped } });
    }
}
