import RSKConfirmRollDialog from "../../applications/RSKConfirmRollDialog.js";
import RSKActor from "./RSKActor.js";

export default class RSKCharacter extends RSKActor {
    //todo: do we need this type of validation here anymore if its in the datamodel?
    // I think so for resetting the form, but not to protect actorUpdates, the model validation won't allow bad data into the db.
    minSkillLevel = 1;
    maxSkillLevel = 10;
    maxInventorySlots = 28;

    prepareBaseData() {
        super.prepareBaseData();

        const systemData = this.system;
        systemData.lifePoints.max =
            Object.keys(systemData.abilities).map(i => systemData.abilities[i]).reduce((acc, a, i) => acc += Number(a), 0)
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
            calculateTargetNumber: (skill, ability) => this.calculateTargetNumber(skill, ability)
        };
    }

    calculateTargetNumber(skill, ability) {
        return this.system.skills[skill].level
            + (this.system.skills[skill].modifier ?? 0)
            + this.system.abilities[ability];
    }

    increaseSkillLevel(skill, amount) {
        //todo: if this is now >= 5 award ability level
        this.actorUpdateSkillLevel(skill, this.system.skills[skill].level + amount);
    }

    decreaseSkillLevel(skill, amount) {
        this.actorUpdateSkillLevel(skill, this.system.skills[skill].level - amount);
    }

    actorUpdateSkillLevel(skill, newLevel) {
        const newSkillLevel = game.rsk.math.clamp_value(newLevel, { min: this.minSkillLevel, max: this.maxSkillLevel });
        this.update({ [`system.skills.${skill}.level`]: newSkillLevel });
    }

    async useSkill(skill, attribute, rollType = "normal") {
        if (this.system.skills && this.system.skills.hasOwnProperty(skill)) {
            this.update({ [`system.skills.${skill}.used`]: true });
            const targetNumber = this.getRollData().calculateTargetNumber(skill, attribute);
            const rollResult = await game.rsk.dice.skillCheck(targetNumber, rollType);
            return { ...rollResult, targetNumber };
        }
    }

    // this pops up a dialog, do we want to do those types of things from the documents?
    // or should that not be done here? how else/where else would we do it?
    // I think we can access the sheet through actor.sheet when we are elsewhere like in an action
    // but that doesn't feel great either. idk, maybe it would be better to keep the ui stuff in the ui related code though.
    //todo: maybe move this back to the sheet.
    async skillCheck(options) {
        const rollData = this.getRollData();
        const dialog = RSKConfirmRollDialog.create(rollData, options);
        const rollOptions = await dialog();
        if (!rollOptions.rolled) return false;

        const result = await this.useSkill(rollOptions.skill, rollOptions.ability, rollOptions.rollType);
        //todo: could probably be in a template
        const flavor = `<strong>${rollOptions.skill} | ${rollOptions.ability}</strong>
              <p>${result.isCritical ? "<em>critical</em>" : ""} ${result.isSuccess ? "success" : "fail"} (${result.margin})</p>`;
        result.rollResult.toMessage({ flavor }, { ...rollOptions });
        return result;
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

    //todo: sort items
    // do we want to use slotId?
    // do we want to use container prop?
    addItem(itemToAdd) {
        const inventorySlotsUsed = this.flags.rsk?.inventorySlotsUsed || 0;
        const existingSlot = itemToAdd.system.isAmmo
            ? this.items.find(i => i.system.isAmmo && i.flags.core.sourceId === itemToAdd.flags.core.sourceId)
            : this.items.find(i =>
                i.flags.core.sourceId === itemToAdd.flags.core.sourceId
                && i.system.isStackable
                && i.system.quantity + itemToAdd.system.quantity <= 3);
        if (existingSlot) {
            const update = { _id: existingSlot.id };
            update["system.quantity"] = existingSlot.system.quantity + itemToAdd.system.quantity
            this.updateEmbeddedDocuments("Item", [update]);
        } else if (inventorySlotsUsed < this.maxInventorySlots) {
            this.createEmbeddedDocuments("Item", [{ ...itemToAdd.toObject() }]);
            this.update({ "flags.rsk.inventorySlotsUsed": inventorySlotsUsed + 1 });
        }
    }

    getActiveItems() {
        return this.items.filter(i => i.isEquipped);
    }

    equip(item) {
        const currentEquipped = this.items.filter(i => i.isEquipped
            && i.inSlot === item.inSlot);
        if (currentEquipped.length > 0 && currentEquipped[0] !== item) {
            currentEquipped[0].equip();
        }
        item.equip();
    }

    _clampActorValues() {
        super._clampActorValues();
        for (let skill in this.system.skills) {
            this.system.skills[skill].level = game.rsk.math.clamp_value(
                this.system.skills[skill].level,
                { min: this.minSkillLevel, max: this.maxSkillLevel });
        }
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

    _onDeleteDescendantDocuments(parent, collection, documents, ids, options, userId) {
        //todo: better way to identify items that can be in inventory
        const inventorySlotsReclaimed = documents.filter(d => d.system && d.system.hasOwnProperty("slotId")).length;
        this.update({ "flags.rsk.inventorySlotsUsed": this.flags.rsk.inventorySlotsUsed - inventorySlotsReclaimed });
        super._onDeleteDescendantDocuments(parent, collection, documents, ids, options, userId);
    }
}