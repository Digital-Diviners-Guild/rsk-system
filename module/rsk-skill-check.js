export class SkillCheck {
    static useActor = (actorData) => (skill, ability) => new SkillCheck(actorData, skill, ability);

    constructor(actorData, skill, ability) {
        this.skill = skill;
        this.ability = ability;
        this.skillLevel = actorData.skills[skill].level + actorData.skills[skill].modifier;
        this.abilityLevel = actorData.abilities[ability].level + actorData.abilities[ability].modifier;
        this.targetNumber = this.skillLevel + this.abilityLevel;
    }

    async execute(advantageDisadvantage = "normal", targetNumberModifier = 0) {
        const roll = await game.rsk.dice.createRoll(advantageDisadvantage);
        const rollResult = await roll.evaluate();
        const rollTotal = rollResult.result;
        const targetNumber = this.targetNumber + targetNumberModifier;
        const rollMargin = targetNumber - rollTotal;
        const isSuccess = rollMargin >= 0;
        const results = rollResult.terms[0].results;
        const isCritical = results.every(v => v.result === results[0].result);
        return new SkillCheckResult(
            this.skill,
            this.ability,
            targetNumber,
            roll,
            rollTotal,
            rollMargin,
            isSuccess,
            isCritical);
    }
}

export class SkillCheckResult {
    constructor(skill, ability, targetNumber, roll, rollTotal, rollMargin, isSuccess, isCritical) {
        this.skill = skill;
        this.ability = ability;
        this.targetNumber = targetNumber;
        this.roll = roll;
        this.rollTotal = rollTotal;
        this.rollMargin = rollMargin;
        this.isSuccess = isSuccess;
        this.isCritical = isCritical;
    }

    async toMessage(cfg) {
        const flavor = `<strong>${this.skill} | ${this.ability}</strong> TN: ${this.targetNumber}
        <p>${this.isCritical ? "<em>critical</em>" : ""} ${this.isSuccess ? "success" : "fail"} (${this.rollMargin})</p>`;
        await this.roll.toMessage(cfg || { flavor });
    }
}