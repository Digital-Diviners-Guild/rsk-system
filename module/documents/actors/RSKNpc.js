import RSKAction from "../../data/items/RSKAction.js";
import RSKActor from "./RSKActor.js";

export default class RSKNpc extends RSKActor {
    testActions = [];

    prepareData() {
        super.prepareData();
        this.testActions = [];
        this.testActions.push(RSKAction.fromSource({ id: "testAction", label: "test action", damageEntries: { stab: 3 } }));
        console.log(this.testActions);
    }

    calculateDamageTaken(damageEntries, puncture = 0) {
        const applicablePuncture = game.rsk.math.clamp_value(puncture, { min: 0, max: this.system.armourValue });
        const remainingArmourSoak = this.system.armourValue - applicablePuncture;
        const { totalDamage, bonusArmour } = Object.keys(damageEntries).reduce((acc, type, i) => {
            acc.totalDamage += damageEntries[type];
            acc.bonusArmour += this._getBonusArmourValue(type);
            return acc;
        }, { totalDamage: 0, bonusArmour: 0 });
        const totalArmourSoak = remainingArmourSoak + bonusArmour;
        return totalDamage - totalArmourSoak;
    }

    _getBonusArmourValue(damageType) {
        return 0; // check for 'strengths' and 'weaknesses' to damageType
    }
}