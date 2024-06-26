import { rskStatusEffects, statusToEffect } from "../../effects/statuses.js";

export default class RSKActorType extends foundry.abstract.TypeDataModel {
    restoreLifePoints(amount) {
        const newValue = game.rsk.math.clamp_value(this.lifePoints.value + amount, this.lifePoints);
        this.parent.update({ [`system.lifePoints.value`]: newValue });
        Hooks.call("actorRestoredLifePoints", { targetActor: this.parent, lifePointsRestored: amount, newLifePointsValue: newValue });
    }

    //todo: defense roll is only applicable when applying to a character
    // this could be refactored a bit
    async receiveDamage(damageEntries, attackType = "melee", defense = 0, puncture = 0) {
        const damageTaken = this.calculateDamageTaken(damageEntries, attackType, defense, puncture);
        const remainingLifePoints = game.rsk.math.clamp_value(
            this.lifePoints.value - damageTaken,
            { min: 0 });
        if (remainingLifePoints < 1 && !this.parent.statuses.has("dead")) {
            const death = rskStatusEffects.find(x => x.id === "dead");
            await this.parent.createEmbeddedDocuments("ActiveEffect", [{
                ...statusToEffect(death), flags: { core: { overlay: true } }
            }]);
        }
        this.parent.update({ "system.lifePoints.value": remainingLifePoints });
        if (damageTaken > 0) {
            Hooks.call("actorReceivedDamage", { targetActor: this.parent, damageTaken, remainingLifePoints });
        }
    }

    calculateDamageTaken(damageEntries, attackType = "melee", defense = 0, puncture = 0) {
        const armour = this.getArmourValue();
        const applicablePuncture = game.rsk.math.clamp_value(puncture || 0, { min: 0, max: armour });
        const remainingArmourSoak = armour - applicablePuncture;
        const { totalDamage, damageResistance } = Object.keys(damageEntries).reduce((acc, type, i) => {
            acc.totalDamage += damageEntries[type];
            if (damageEntries[type] > 0) {
                acc.damageResistance += this.getBonusArmourValue(type);
            }
            return acc;
        }, { totalDamage: 0, damageResistance: 0 });
        const attackTypeResistance = this.getBonusArmourValue(attackType);
        const defenseValue = remainingArmourSoak + damageResistance + attackTypeResistance + game.rsk.math.clamp_value(defense, { min: 0 });
        return game.rsk.math.clamp_value(totalDamage - defenseValue, { min: 0 });
    }

    getArmourValue() { return 0; }

    getBonusArmourValue(type) {
        return this.resistance[type] ?? 0;
    }
}