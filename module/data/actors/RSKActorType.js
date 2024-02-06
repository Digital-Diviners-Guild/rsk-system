import { rskStatusEffects, statusToEffect } from "../../effects/statuses.js";

export default class RSKActorType extends foundry.abstract.TypeDataModel {
    async receiveDamage(damage) {
        const { puncture, damageEntries, attackType, defenseRoll } = { ...damage };
        const damageTaken = this.calculateDamageTaken(damageEntries, attackType, puncture, defenseRoll);
        const remainingLifePoints = game.rsk.math.clamp_value(
            this.lifePoints.value - damageTaken,
            { min: 0 });
        if (remainingLifePoints < 1 && !this.parent.statuses.has("dead")) {
            const death = rskStatusEffects.find(x => x.id === "dead");
            await this.parent.createEmbeddedDocuments("ActiveEffect", [statusToEffect(death)]);
        }
        //todo: should method that update the actor still be on the actor?
        // and we can call system.calculate damage?
        this.parent.update({ "system.lifePoints.value": remainingLifePoints });
    }

    //todo: success margin?
    calculateDamageTaken(damageEntries, attackType = "melee", puncture = 0, defenseRoll = 0) {
        const armour = this.getArmourValue();
        const applicablePuncture = game.rsk.math.clamp_value(puncture, { min: 0, max: armour });
        const remainingArmourSoak = armour - applicablePuncture;
        const { totalDamage, damageResistance } = Object.keys(damageEntries).reduce((acc, type, i) => {
            acc.totalDamage += damageEntries[type];
            acc.damageResistance += this.getBonusArmourValue(type);
            return acc;
        }, { totalDamage: 0, damageResistance: 0 });
        const attackTypeResistance = this.getBonusArmourValue(attackType);
        const defenseValue = remainingArmourSoak + damageResistance + attackTypeResistance + defenseRoll;
        return game.rsk.math.clamp_value(totalDamage - defenseValue, { min: 0 });
    }

    getArmourValue() { return 0; }
    //todo: check for 'strengths' and 'weaknesses' to damageType/attackType
    getBonusArmourValue(type) { return 0; }
}