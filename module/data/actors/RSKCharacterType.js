import RSKCreature from "./RSKCreature.js";
import { fields, costField } from "../fields.js";
import RSKActorType from "./RSKActorType.js";
import { canAddItem } from "../../rsk-inventory.js";
import { uiService } from "../../rsk-ui-service.js";
import { localizeText } from "../../rsk-localize.js";

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
            abilities: { ...systemData.abilities },
            armourValue: this.getArmourValue()
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
        Hooks.call("actorIncreasedSkillLevel", { targetActor: this.parent, skill: skill, newLevel: newLevel });
        return newLevel === this.abilityAwardedAtLevel;
    }

    decreaseSkillLevel(skill, amount = 1) {
        const newLevel = this.skills[skill].level - amount;
        this.updateLevel("skills", skill, newLevel, { min: this.minSkillLevel, max: this.maxSkillLevel });
    }

    increaseAbilityLevel(ability, amount = 1) {
        const newLevel = this.abilities[ability].level + amount;
        this.updateLevel("abilities", ability, newLevel, { min: this.minAbilityLevel, max: this.maxAbilityLevel });
        Hooks.call("actorIncreasedAbilityLevel", { targetActor: this.parent, ability: ability, newLevel: newLevel });
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
        const gainedLife = this.lifePoints.max - this.lifePoints.value;
        const gainedPrayer = this.prayerPoints.max - this.prayerPoints.value;
        const gainedSummoning = this.summoningPoints.max - this.summoningPoints.value;
        this.parent.update({
            "system.lifePoints.value": this.lifePoints.max,
            "system.prayerPoints.value": this.prayerPoints.max,
            "system.summoningPoints.value": this.summoningPoints.max
        });
        Hooks.call("actorRest", { targetActor: this.parent, gainedLife, gainedPrayer, gainedSummoning });
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
            .map(b => b.system.applyBackgroundSkillImprovements(this.parent));
    }

    addGold(amount) {
        const newAmount = this.gold + amount
        this.parent.update({ "system.gold": newAmount });
    }

    removeGold(amount) {
        const newAmount = game.rsk.math.clamp_value(this.gold - amount, { min: 0 });
        this.parent.update({
            "system.gold": newAmount
        });
    }

    spendRunes(type, amount) {
        const rune = this.parent.items.find(i => i.system.category === "rune" && i.system.subCategory === type);
        const newAmount = rune.system.quantity - amount;
        if (newAmount < 1) {
            this.parent.deleteEmbeddedDocuments("Item", [rune.id]);
        } else {
            let update = { _id: rune.id, "system.quantity": newAmount };
            this.parent.updateEmbeddedDocuments("Item", [update]);
        }
    }

    spendPoints(type, amount) {
        const points = this[type];
        const newAmount = game.rsk.math.clamp_value(points.value - amount, points);
        this.parent.update({ [`system.${type}.value`]: newAmount });
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
        const existingItem = this.parent.items.find(i => i.id === itemToRemove.id);
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

    async equip(itemToEquip) {
        const { currentWeaponSlot, currentArmSlot } = this.getCurrentSlots();

        const targetSlot = this.determineTargetSlot(itemToEquip);
        if (this.isSlotDisabled(targetSlot)) {
            uiService.showNotification(localizeText("RSK.ErrorActiveSlotIsDisabled"));
            return;
        }

        let updates = {};
        const currentEquipped = this.getActiveItems().find(i => i.system.equippedInSlot === targetSlot);
        if (currentEquipped) {
            updates = this.mergeUpdates(updates, this.unequip(currentEquipped, false));
        }

        if (currentEquipped !== itemToEquip) {
            const result = await itemToEquip.system.equip(targetSlot);
            if (result.error) {
                uiService.showNotification(result.error);
                return;
            }

            updates = this.processEquipResult(result, targetSlot, itemToEquip, { currentWeaponSlot, currentArmSlot }, updates);
        }

        this.parent.update(updates);
    }

    getCurrentSlots() {
        const currentEquipped = this.getActiveItems().filter(i => ["weapon", "arm"].includes(i.system.equippedInSlot));
        return {
            currentWeaponSlot: currentEquipped.find(i => i.system.equippedInSlot === "weapon"),
            currentArmSlot: currentEquipped.find(i => i.system.equippedInSlot === "arm")
        };
    }

    determineTargetSlot(itemToEquip) {
        const isAmmo = itemToEquip.isOnlyAmmo() || this.getActiveItems().some(w => w.usesItemAsAmmo(itemToEquip));
        if (isAmmo) return "ammo";

        if (["weapon", "arm"].includes(itemToEquip.system.activeSlot)) {
            const canWieldWithWeapon = this.getActiveItems().find(w => w.system.equippedInSlot === "weapon")?.canWieldWith(itemToEquip);
            return canWieldWithWeapon ? "arm" : itemToEquip.system.activeSlot;
        }
        return itemToEquip.system.activeSlot;
    }

    isSlotDisabled(targetSlot) {
        return this.parent.flags?.rsk?.disabledSlots?.includes(targetSlot);
    }

    mergeUpdates(existingUpdates, newUpdates) {
        return foundry.utils.mergeObject(existingUpdates, newUpdates);
    }

    processEquipResult(result, targetSlot, itemToEquip, slots, updates) {
        if (result.disablesSlot) {
            const currentEquippedInDisabledSlot = this.getActiveItems().find(i => i.system.equippedInSlot === result.disablesSlot);
            if (currentEquippedInDisabledSlot) {
                updates = this.mergeUpdates(updates, this.unequip(currentEquippedInDisabledSlot, false));
            }
            updates["flags.rsk.disabledSlots"] = [...(this.parent.flags?.rsk?.disabledSlots ?? []), result.disablesSlot];
        } else {
            updates = this.handleSlotCompatibility(targetSlot, itemToEquip, slots, updates);
        }
        return updates;
    }

    handleSlotCompatibility(targetSlot, itemToEquip, { currentWeaponSlot, currentArmSlot }, updates) {
        if (targetSlot === "weapon" && currentArmSlot && !itemToEquip.canWieldWith(currentArmSlot)) {
            updates = this.mergeUpdates(updates, this.unequip(currentArmSlot, false));
        } else if (targetSlot === "arm" && currentWeaponSlot && !itemToEquip.canWieldWith(currentWeaponSlot)) {
            updates = this.mergeUpdates(updates, this.unequip(currentWeaponSlot, false));
        }
        return updates;
    }

    unequip(item, update = true) {
        const unequipResult = item.system.unequip();
        let updates = {};
        if (unequipResult?.freedSlot) {
            //todo: think we may have lost the disables slots functionality
            // need to explore
            updates["flags.rsk.disabledSlots"] = this.parent.flags.rsk.disabledSlots.filter(s => s !== unequipResult.freedSlot) ?? [];
        }
        if (update) {
            this.parent.update(updates);
        }
        return updates;
    }

    getArmourValue() {
        return this.parent.items
            .filter(i => i.system.isEquipped && i.type === "armour")
            .reduce((acc, w, i) => acc += w.system.getArmourValue(), 0);
    }

    _clampActorValues() {
        super._clampActorValues();
        for (let skill in this.skills) {
            this.skills[skill].level = game.rsk.math.clamp_value(
                this.skills[skill].level,
                { min: this.minSkillLevel, max: this.maxSkillLevel });
        }
    }

    //should this be here?
    // async applyActionOutcome(actionData) {
    //     if (actionData.outcome.damage) {
    //         await receiveDamage(target, { damage: actionData.outcome.damage });
    //     }
    //     if (actionData.outcome.restoresLifePoints) {
    //         await restoreLifePoints(target, actionData.outcome.restoresLifePoints);
    //     }
    //     if (actionData.outcome.effectsAdded?.length > 0) {
    //         await addEffects(target, actionData.outcome.effectsAdded);
    //     }
    //     if (actionData.outcome.statusesAdded?.length > 0) {
    //         await addStatuses(target, actionData.outcome.statusesAdded);
    //     }
    //     if (actionData.outcome.statusesRemoved?.length > 0) {
    //         await removeStatuses(target, actionData.outcome.statusesRemoved);
    //     }
    // }
}