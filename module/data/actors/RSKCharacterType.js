import RSKCreature from "./RSKCreature.js";
import { fields, costField } from "../fields.js";
import RSKActorType from "./RSKActorType.js";
import { canAddItem } from "../../rsk-inventory.js";

export default class RSKCharacterType extends RSKActorType {
    static defineSchema() {
        return {
            ...RSKCreature.defineSchema(),
            gold: new fields.NumberField({ ...costField }),
            catalyst: new fields.StringField(),
            motivation: new fields.StringField(),
            description: new fields.HTMLField(),
            backgrounds: new fields.ArrayField(new fields.ObjectField()),
            summoningPoints: new fields.SchemaField({
                min: new fields.NumberField({ min: 0, initial: 0 }),
                value: new fields.NumberField({ initial: 5 }),
                max: new fields.NumberField({ initial: 5 })
            }),
            prayerPoints: new fields.SchemaField({
                min: new fields.NumberField({ min: 0, initial: 0 }),
                value: new fields.NumberField({ initial: 3 }),
                max: new fields.NumberField({ initial: 3 })
            }),
            abilities: new fields.SchemaField(Object.keys(CONFIG.RSK.abilities).reduce((obj, ability) => {
                obj[ability] = new fields.SchemaField({
                    level: new fields.NumberField({ min: 1, initial: 1, max: 8 }),
                    modifier: new fields.NumberField({ min: -100, initial: 0, max: 100 })
                });
                return obj;
            }, {})),
            skills: new fields.SchemaField(Object.keys(CONFIG.RSK.skills).reduce((obj, skill) => {
                obj[skill] = new fields.SchemaField({
                    level: new fields.NumberField({ min: 1, initial: 1, max: 10 }),
                    used: new fields.BooleanField(),
                    modifier: new fields.NumberField({ min: -100, initial: 0, max: 100 }),
                });
                return obj;
            }, {}))
        };
    }

    minSkillLevel = 1;
    maxSkillLevel = 10;
    minAbilityLevel = 1;
    maxAbilityLevel = 8;
    abilityAwardedAtLevel = 5;
    maxInventorySlots = 28;

    prepareBaseData() {
        super.prepareBaseData();
        this.lifePoints.max =
            Object.keys(this.abilities).map(i => this.abilities[i]).reduce((acc, a, i) => acc += Number(a.level), 0)
            + Object.keys(this.skills).map(i => this.skills[i]).reduce((acc, s, i) => acc += Number(s.level), 0);

        this.prayerPoints.max = this.skills.prayer.level * 3;
        this.prayerPoints.value = game.rsk.math.clamp_value(this.prayerPoints.value, this.prayerPoints)
        this.summoningPoints.max = this.skills.summoning.level * 5;
        this.summoningPoints.value = game.rsk.math.clamp_value(this.summoningPoints.value, this.summoningPoints)
    }

    getRollData() {
        const systemData = this.toObject();
        return {
            skills: { ...systemData.skills },
            abilities: { ...systemData.abilities }
        };
    }

    calculateTargetNumber(selectedSkill, selectedAbility, targetNumberModifier) {
        const ability = this.abilities[selectedAbility];
        const skill = this.skills[selectedSkill];
        return skill.level + (skill.modifier ?? 0)
            + ability.level + (ability.modifier ?? 0)
            + targetNumberModifier;
    }

    increaseSkillLevel(skill, amount = 1) {
        const newLevel = this.skills[skill].level + amount;
        this.updateLevel("skills", skill, newLevel, { min: this.minSkillLevel, max: this.maxSkillLevel });
        return newLevel === this.abilityAwardedAtLevel;
    }

    decreaseSkillLevel(skill, amount = 1) {
        const newLevel = this.skills[skill].level - amount;
        this.updateLevel("skills", skill, newLevel, { min: this.minSkillLevel, max: this.maxSkillLevel });
    }

    increaseAbilityLevel(ability, amount = 1) {
        const newLevel = this.abilities[ability].level + amount;
        this.updateLevel("abilities", ability, newLevel, { min: this.minAbilityLevel, max: this.maxAbilityLevel });
    }

    decreaseAbilityLevel(ability, amount = 1) {
        const newLevel = this.abilities[ability].level - amount;
        this.updateLevel("abilities", ability, newLevel, { min: this.minAbilityLevel, max: this.maxAbilityLevel });
    }

    updateLevel(category, type, requestedLevel, constraint) {
        const newLevel = game.rsk.math.clamp_value(requestedLevel, constraint);
        this.parent.update({ [`system.${category}.${type}.level`]: newLevel });
    }

    async useSkill(options) {
        const { skill, ability, targetNumberModifier, rollType } = { ...options }
        this.parent.update({ [`system.skills.${skill}.used`]: true });
        const targetNumber = this.calculateTargetNumber(skill, ability, targetNumberModifier);
        const rollResult = await game.rsk.dice.skillCheck(targetNumber, rollType);
        return { ...rollResult, targetNumber };
    }

    rest() {
        this.parent.update({
            "system.lifePoints.value": this.lifePoints.max,
            "system.prayerPoints.value": this.prayerPoints.max,
            "system.summoningPoints.value": this.summoningPoints.max
        });
    }

    async acceptResurrection() {
        const statusesToRemove = this.parent.effects.map(e => e._id) ?? [];
        await this.parent.deleteEmbeddedDocuments("ActiveEffect", statusesToRemove);
        this.rest();
    }

    clearUsedSkills() {
        const updates = Object.keys(this.skills)
            .reduce((acc, curr) => {
                acc[`system.skills.${curr}.used`] = false;
                return acc;
            }, {});
        this.parent.update(updates);
    }

    applyBackgrounds() {
        this.parent.items.filter(i => i.type === "background")
            .map(b => b.applyBackgroundSkillImprovements(this.parent));
    }

    spendRunes(type, amount) {
        const rune = this.parent.items.find(i => i.type === "rune" && i.system.type === type);
        const newAmount = rune.system.quantity - amount;
        if (newAmount < 1) {
            this.parent.deleteEmbeddedDocuments("Item", [rune.id]);
        } else {
            let update = { _id: rune.id, "system.quantity": newAmount };
            this.parent.updateEmbeddedDocuments("Item", [update]);
        }
    }

    spendPoints(type, amount) {
        const points = this[`${type}Points`];
        const newAmount = game.rsk.math.clamp_value(points.value - amount, points);
        this.parent.update({ [`system.${type}Points.value`]: newAmount });
    }

    addItem(itemToAdd, quantity = 1) {
        const canAddResult = canAddItem(this.parent.items, itemToAdd);
        if (canAddResult.canAdd && canAddResult.usesExistingSlot) {
            const existingItem = canAddResult.existingItem;
            let update = { _id: existingItem.id };
            update["system.quantity"] = existingItem.system.quantity + quantity
            this.parent.updateEmbeddedDocuments("Item", [update]);
        } else if (canAddResult.canAdd) {
            let newItem = foundry.utils.deepClone(itemToAdd.toObject());
            newItem.system.quantity = quantity;
            this.parent.createEmbeddedDocuments("Item", [newItem]);
        }
    }

    removeItem(itemToRemove, quantity = 1) {
        const existingItem = this.parent.items.find(i => i.name === itemToRemove.name && i.type === itemToRemove.type);
        if (existingItem) {
            const newQuantity = existingItem.system.quantity - quantity;
            if (newQuantity < 1) {
                this.parent.deleteEmbeddedDocuments("Item", [existingItem.id]);
            } else {
                let update = { _id: existingItem.id };
                update["system.quantity"] = newQuantity
                this.parent.updateEmbeddedDocuments("Item", [update]);
            }
        }
    }

    getActiveItems() {
        return this.parent.items.filter(i => i.system.isEquipped);
    }

    //todo: probably need to pass in the slot we are targetting with 
    // drag and drop?
    // the item has an activeSlot that determines the valid slot for the item
    // however, darts can go to the ammo slot even though they say 'weapon'
    // maybe we need to rethink activeSlot.
    // the intent was to not allow a helmet on your food and cape in your quiver etc.
    // most things can only go in one slot.
    // though this does cause a problem with dual wielding, you would need 'off-hand' variant weapons, which is fine.
    // when drag and drop occurs, we need to validate the targetted slot is allowed, if not, use general drop rules.
    equip(item) {
        if (item.system.isEquipped) {
            item.system.equip(item.system.equippedInSlot);
            return;
        }

        const currentEquipped = this.parent.items
            .find(i => i.system.isEquipped && i.system.equippedInSlot === item.system.activeSlot)
        if (item.isOnlyAmmo() || currentEquipped?.usesItemAsAmmo(item)) {
            const currentEquipped = this.parent.items.filter(i => i.system.isEquipped && i.system.attackType.has("ammo"));
            if (currentEquipped.length > 0 && currentEquipped[0] !== item) {
                currentEquipped[0].system.equip("ammo");
            }
            item.system.equip("ammo");
            return;
        }

        if (currentEquipped && currentEquipped !== item) {
            currentEquipped.system.equip(currentEquipped.system.equippedInSlot);
        }
        item.system.equip(item.system.activeSlot);
    }

    // todo: armour soak may be good to put in 
    // one of the prepare data methods and displayed somewhere on the char
    // sheet, to give feedback about the current soak values based on 
    // the current character/equipment.
    getArmourValue() {
        return this.parent.items
            .filter(i => i.isEquipped && i.type === "armour")
            .reduce((acc, w, i) => acc +=
                typeof w.getArmourValue === "function" ? w.getArmourValue() : 0, 0)
    }

    _clampActorValues() {
        super._clampActorValues();
        for (let skill in this.skills) {
            this.skills[skill].level = game.rsk.math.clamp_value(
                this.skills[skill].level,
                { min: this.minSkillLevel, max: this.maxSkillLevel });
        }
    }
}