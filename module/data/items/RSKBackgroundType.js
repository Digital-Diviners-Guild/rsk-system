import { fields, positiveNumberField } from "../fields.js";

export default class RSKBackgroundType extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        return {
            description: new fields.StringField(),
            skillImprovements: new fields.SchemaField(Object.keys(CONFIG.RSK.skills).reduce((obj, skill) => {
                obj[skill] = new fields.NumberField({ ...positiveNumberField, max: 9 });
                return obj;
            }, {}))
        }
    };

    isApplied = () => {
        return this.parent.flags?.rsk?.appliedBackground ?? false;
    }

    applyBackgroundSkillImprovements = (actor) => {
        if (this.parent.flags.rsk?.appliedBackground || this.getBackgroundSkillImprovementTotal() === 0) return;
        this.mapSkillImprovementOperation((skill, improvement) =>
            actor.system.increaseSkillLevel(skill, improvement));
        this.parent.update({ "flags.rsk.appliedBackground": true });
    };

    removeBackgroundSkillImprovements = (actor) => {
        this.mapSkillImprovementOperation((skill, improvement) =>
            actor.system.decreaseSkillLevel(skill, improvement));
    };

    mapSkillImprovementOperation = (op) => {
        const improvements = this.skillImprovements;
        for (let skill in improvements) {
            const improvement = improvements[skill];
            op(skill, improvement);
        }
    };

    getBackgroundSkillImprovementTotal = () => Object
        .keys(this.skillImprovements)
        .map(si => this.skillImprovements[si])
        .reduce((acc, x) => acc += x, 0)
        ?? 0;
}