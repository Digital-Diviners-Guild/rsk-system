import { canAddItem } from "../../rsk-inventory.js";
import RSKActor from "./RSKActor.js";

export default class RSKCharacter extends RSKActor {
    minSkillLevel = 1;
    maxSkillLevel = 10;
    minAbilityLevel = 1;
    maxAbilityLevel = 8;
    abilityAwardedAtLevel = 5;
    maxInventorySlots = 28;

    _onCreate(data, options, userId) {
        // Default to actorLink = true for characters
        this.update({ "prototypeToken.actorLink": true });
        super._onCreate(data, options, userId)
    }

    prepareBaseData() {
        super.prepareBaseData();

        const systemData = this.system;
        systemData.lifePoints.max =
            Object.keys(systemData.abilities).map(i => systemData.abilities[i]).reduce((acc, a, i) => acc += Number(a.level), 0)
            + Object.keys(systemData.skills).map(i => systemData.skills[i]).reduce((acc, s, i) => acc += Number(s.level), 0);

        systemData.prayerPoints.max = systemData.skills.prayer.level * 3;
        systemData.prayerPoints.value = game.rsk.math.clamp_value(systemData.prayerPoints.value, systemData.prayerPoints)
        systemData.summoningPoints.max = systemData.skills.summoning.level * 5;
        systemData.summoningPoints.value = game.rsk.math.clamp_value(systemData.summoningPoints.value, systemData.summoningPoints)
    }

    getRollData() {
        const systemData = this.system.toObject();
        return {
            skills: { ...systemData.skills },
            abilities: { ...systemData.abilities },
            calculateTargetNumber: (skill, ability, targetNumberModifier) => this.calculateTargetNumber(skill, ability, targetNumberModifier)
        };
    }

    calculateTargetNumber(selectedSkill, selectedAbility, targetNumberModifier) {
        const ability = this.system.abilities[selectedAbility];
        const skill = this.system.skills[selectedSkill];
        return skill.level + (skill.modifier ?? 0)
            + ability.level + (ability.modifier ?? 0)
            + targetNumberModifier;
    }

    increaseSkillLevel(skill, amount = 1) {
        const newLevel = this.system.skills[skill].level + amount;
        this.updateLevel("skills", skill, newLevel, { min: this.minSkillLevel, max: this.maxSkillLevel });
        return newLevel === this.abilityAwardedAtLevel;
    }

    decreaseSkillLevel(skill, amount = 1) {
        const newLevel = this.system.skills[skill].level - amount;
        this.updateLevel("skills", skill, newLevel, { min: this.minSkillLevel, max: this.maxSkillLevel });
    }

    increaseAbilityLevel(ability, amount = 1) {
        const newLevel = this.system.abilities[ability].level + amount;
        this.updateLevel("abilities", ability, newLevel, { min: this.minAbilityLevel, max: this.maxAbilityLevel });
    }

    decreaseAbilityLevel(ability, amount = 1) {
        const newLevel = this.system.abilities[ability].level - amount;
        this.updateLevel("abilities", ability, newLevel, { min: this.minAbilityLevel, max: this.maxAbilityLevel });
    }

    updateLevel(category, type, requestedLevel, constraint) {
        const newLevel = game.rsk.math.clamp_value(requestedLevel, constraint);
        this.update({ [`system.${category}.${type}.level`]: newLevel });
    }

    async useSkill(options) {
        const { skill, ability, targetNumberModifier, rollType } = { ...options }
        if (this.system.skills?.hasOwnProperty(skill)) {
            this.update({ [`system.skills.${skill}.used`]: true });
            const targetNumber = this.getRollData().calculateTargetNumber(skill, ability, targetNumberModifier);
            const rollResult = await game.rsk.dice.skillCheck(targetNumber, rollType);
            return { ...rollResult, targetNumber };
        }
    }

    rest() {
        this.update({
            "system.lifePoints.value": this.system.lifePoints.max,
            "system.prayerPoints.value": this.system.prayerPoints.max,
            "system.summoningPoints.value": this.system.summoningPoints.max
        });
    }

    async acceptResurrection() {
        const statusesToRemove = this.effects.map(e => e._id) ?? [];
        await this.deleteEmbeddedDocuments("ActiveEffect", statusesToRemove);
        this.rest();
    }

    clearUsedSkills() {
        const updates = Object.keys(this.system.skills)
            .reduce((acc, curr) => {
                acc[`system.skills.${curr}.used`] = false;
                return acc;
            }, {});
        this.update(updates);
    }

    applyBackgrounds() {
        this.items.filter(i => i.type === "background")
            .map(b => b.applyBackgroundSkillImprovements(this))
    }

    spendRunes(type, amount) {
        const rune = this.items.find(i => i.type === "rune" && i.system.type === type);
        const newAmount = rune.system.quantity - amount;
        if (newAmount < 1) {
            this.deleteEmbeddedDocuments("Item", [rune.id]);
        } else {
            let update = { _id: rune.id, "system.quantity": newAmount };
            this.updateEmbeddedDocuments("Item", [update]);
        }
    }

    spendPoints(type, amount) {
        const points = this.system[`${type}Points`];
        const newAmount = game.rsk.math.clamp_value(points.value - amount, points);
        this.update({ [`system.${type}Points.value`]: newAmount });
    }

    addItem(itemToAdd, quantity = 1) {
        const canAddResult = canAddItem(this.items, itemToAdd);
        if (canAddResult.canAdd && canAddResult.usesExistingSlot) {
            const existingItem = canAddResult.existingItem;
            let update = { _id: existingItem.id };
            update["system.quantity"] = existingItem.system.quantity + quantity
            this.updateEmbeddedDocuments("Item", [update]);
        } else if (canAddResult.canAdd) {
            let newItem = foundry.utils.deepClone(itemToAdd.toObject());
            newItem.system.quantity = quantity;
            this.createEmbeddedDocuments("Item", [newItem]);
        }
    }

    removeItem(itemToRemove, quantity = 1) {
        //todo: name may not be good?
        const existingItem = this.items.find(i => i.name === itemToRemove.name);
        if (existingItem) {
            const newQuantity = existingItem.system.quantity - quantity;
            if (newQuantity < 1) {
                this.deleteEmbeddedDocuments("Item", [existingItem.id]);
            } else {
                let update = { _id: existingItem.id };
                update["system.quantity"] = newQuantity
                this.updateEmbeddedDocuments("Item", [update]);
            }
        }
    }

    getActiveItems() {
        return this.items.filter(i => i.system.isEquipped);
    }

    equip(item) {
        const currentEquipped = this.items.filter(i => i.system.isEquipped
            && i.system.activeSlot === item.system.activeSlot);
        if (currentEquipped.length > 0 && currentEquipped[0] !== item) {
            currentEquipped[0].equip();
        }
        item.equip();
    }

    // todo: armour soak may be good to put in 
    // one of the prepare data methods and displayed somewhere on the char
    // sheet, to give feedback about the current soak values based on 
    // the current character/equipment.
    getArmourValue() {
        return this.items
            .filter(i => i.isEquipped)
            .reduce((acc, w, i) => acc +=
                typeof w.getArmourValue === "function" ? w.getArmourValue() : 0, 0)
    }

    _clampActorValues() {
        super._clampActorValues();
        for (let skill in this.system.skills) {
            this.system.skills[skill].level = game.rsk.math.clamp_value(
                this.system.skills[skill].level,
                { min: this.minSkillLevel, max: this.maxSkillLevel });
        }
    }
}