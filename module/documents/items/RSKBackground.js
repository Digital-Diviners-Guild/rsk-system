export default class RSKBackground extends Item {
    applyBackgroundSkillImprovements = (actor) => {
        if (this.flags.rsk?.appliedBackground || this.getBackgroundSkillImprovementTotal() === 0) return;
        this.mapSkillImprovementOperation((skill, improvement) =>
            actor.increaseSkillLevel(skill, improvement));
        this.update({ "flags.rsk.appliedBackground": true });
    };

    removeBackgroundSkillImprovements = (actor) => {
        this.mapSkillImprovementOperation((skill, improvement) =>
            actor.decreaseSkillLevel(skill, improvement));
        this.update({ "flags.rsk.appliedBackground": false });
    };

    mapSkillImprovementOperation = (op) => {
        const improvements = this.system.skillImprovements;
        for (let skill in improvements) {
            const improvement = improvements[skill];
            op(skill, improvement);
        }
    };

    getBackgroundSkillImprovementTotal = () => Object
        .keys(this.system.skillImprovements)
        .map(si => this.system.skillImprovements[si])
        .reduce((acc, x) => acc += x, 0)
        ?? 0;

    delete() {
        if (this.actor) {
            this.removeBackgroundSkillImprovements(this.actor);
        }
        super.delete();
    }
}

