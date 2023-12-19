import { activePrayers, prayerEffect, rskPrayerStatusEffects } from "../../rsk-prayer.js";
import RSKActor from "./RSKActor.js";

export default class RSKCharacter extends RSKActor {
    //todo: do we need this type of validation here anymore if its in the datamodel?
    // I think so for resetting the form, but not to protect actorUpdates, the model validation won't allow bad data into the db.
    minSkillLevel = 1;
    maxSkillLevel = 10;

    _clampActorValues() {
        super._clampActorValues();
        for (let skill in this.system.skills) {
            this.system.skills[skill].level = game.rsk.math.clamp_value(
                this.system.skills[skill].level,
                { min: this.minSkillLevel, max: this.maxSkillLevel });
        }
    }

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
        this.actorUpdateskillLevel(skill, this.system.skills[skill].level + amount);
    }

    decreaseSkillLevel(skill, amount) {
        this.actorUpdateskillLevel(skill, this.system.skills[skill].level - amount);
    }

    actorUpdateskillLevel(skill, newLevel) {
        const newSkillLevel = game.rsk.math.clamp_value(newLevel, { min: this.minSkillLevel, max: this.maxSkillLevel });
        this.update({ [`system.skills.${skill}.level`]: newSkillLevel });
    }

    async useSkill(skill, attribute) {
        if (this.system.skills && this.system.skills.hasOwnProperty(skill)) {
            this.update({ [`system.skills.${skill}.used`]: true });
            const targetNumber = this.getRollData().calculateTargetNumber(skill, attribute);
            const rollResult = await game.rsk.dice.skillCheck(targetNumber);
            return { ...rollResult, targetNumber };
        }
    }

    //temp: will change when tanner is done with inventory
    equip(item) {
        const currentEquipped = this.items.filter(i => i.isEquipped
            && i.inSlot === item.inSlot);
        if (currentEquipped.length > 0 && currentEquipped[0] !== item) {
            currentEquipped[0].equip();
        }
        item.equip();
    }

    // todo: armour soak may be good to put in 
    // one of the prepare data methods and displayed somewhere on the char
    // sheet, to give feedback about the current soak values based on 
    // the current character/equipment.
    _getArmourSoakValue() {
        return this.items
            .filter(i => i.isEquipped)
            .reduce((acc, w, i) => acc +=
                typeof w.getArmourValue === "function" ? w.getArmourValue() : 0, 0)
    }

    applyBackgrounds() {
        this.items.filter(i => i.type === "background")
            .map(b => b.applyBackgroundSkillImprovements(this))
    }

    // alternatively, we may code the main 'actions' here
    // i'm not sure if we benefit much from making the spells and prayers 
    // both actions.  We still need to account for melee,range,and summoning.
    // which may not fit well into the other direction for rskaction
    // qualities can grant actions, as well as items.
    // perhaps rskaction as a datatype makes sense
    //  but it may be something we create on the fly during data prep?
    //  I think most of the 'action' configuration comes from the thing performing the action
    //  not the action itself? ie damage is defined by the weapon/spell, not the act of doing it.
    castSpell(spell) {
        //TN: always magic/intellect
    }

    //temp: 
    //getting something working here, simple, and without confirming before applying
    //just to start working the model and figure out how exactly we want to do this.
    async pray(prayer) {
        const message = `${this.toMessage(prayer, {}, false).content}
        <button class='test' type='button'>click me</button>`;
        const messageData = {
            type: CONST.CHAT_MESSAGE_TYPES["OTHER"], //CONST.CHAT_MESSAGE_TYPES[rolls.length > 0 ? "ROLL" : "OTHER"],
            content: message,
            speaker: ChatMessage.getSpeaker({ actor: this }),
            flags: { rsk: { actor: this._id, prayer } }
        };
        ChatMessage.create(messageData, {});
    }

    //temp: 
    //getting something working here, simple, and without confirming before applying
    //just to start working the model and figure out how exactly we want to do this.
    //todo: proper targeting? 
    async apply(prayer) {
        const prayerId = prayer.id;
        const prayerStatus = rskPrayerStatusEffects.find(p => p.id === prayerId);
        if (!prayerStatus) return;

        let newPrayerPoints = this.system.prayerPoints.value - prayer.usageCost[0].amount;
        if (newPrayerPoints < 0) return;

        const result = await this.useSkill("prayer", "intellect");
        if (result.isSuccess) {
            // todo: make 'this' the 'target' actor
            // this function should probably not live on the character
            // to make this more generic to who the target actor is
            const currentPrayers = activePrayers(this);
            if (currentPrayers.length > 0) {
                await this.deleteEmbeddedDocuments("ActiveEffect", [...currentPrayers]);
            }
            await this.createEmbeddedDocuments("ActiveEffect", [prayerEffect(prayerId)]);
        } else {
            newPrayerPoints = this.system.prayerPoints.value - 1;
        }
        this.update({ "system.prayerPoints.value": newPrayerPoints });

        //todo: put this in a template
        //todo: probably want to have the outcomes in the message with links to effects
        await result.rollResult.toMessage({
            flavor: `${this.toMessage(prayer, {}, false).content}
        <p>target number: ${result.targetNumber}</p>
        <p>success: ${result.isSuccess} (${result.margin})</p>
        <p>critical: ${result.isCritical}</p>`
        });
    }

    //ranged/melee
    attack() {
        //get equipped weapon
        // how do we detail that a ranged weapon's attack has a cost?
        // perhaps the rskaction may be a good way to go?
        // when creating an rskaction, the 'useWeapon' should be for more than just range
        // it should also configure pulling the base damage stats from thew weapon?

        //melee
        // TN: usually attack/strength
        // but martials use /agility
        //ranged
        // TN: usually ranged/strength
        // but martials use /agility

        //duelweilding - allows 2 attacks in 1 turn with the 2nd attack at disadvantage
    }

    //temp here while testing out ideas
    toMessage(action, options = {}, send = true) {
        const actionData = {
            actor: this.uuid,
            action: action.id,
            // would outcomes just live here and then
            // you can use the chat to commit them?
            outcomes: [],
        };
        const content = `${this.name} is using ${action.label}`;
        const messageData = {
            type: CONST.CHAT_MESSAGE_TYPES["OTHER"], //CONST.CHAT_MESSAGE_TYPES[rolls.length > 0 ? "ROLL" : "OTHER"],
            content: content,
            speaker: ChatMessage.getSpeaker({ actor: this }),
            //rolls: rolls,
            flags: {
                rsk: actionData
            }
        };
        if (send) {
            ChatMessage.create(messageData, options);
        }
        return messageData;
    }
}