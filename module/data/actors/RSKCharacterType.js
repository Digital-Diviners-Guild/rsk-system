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
            .map(b => b.system.applyBackgroundSkillImprovements(this.parent));
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
        const currentEquippedWeapons = this.getActiveItems().filter(i =>
            i.isWeapon() && ["weapon", "arm"].includes(i.system.equippedInSlot));
        return {
            currentWeaponSlot: currentEquippedWeapons.find(i => i.system.equippedInSlot === "weapon"),
            currentArmSlot: currentEquippedWeapons.find(i => i.system.equippedInSlot === "arm")
        };
    }

    determineTargetSlot(itemToEquip) {
        const isAmmo = itemToEquip.isOnlyAmmo() || this.getActiveItems().some(w => w.usesItemAsAmmo(itemToEquip));
        if (isAmmo) return "ammo";

        if (["weapon", "arm"].includes(itemToEquip.system.activeSlot)){
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
}