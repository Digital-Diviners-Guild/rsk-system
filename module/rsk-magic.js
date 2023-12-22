// do we want to use statuses for magical/prayer buff/debuff/effects?
// if we do not use statuses for magic/prayer, how else will we track/show it? this may be a good fit.
//  - the other way would be to use activeeffets that are not statuses? is that better?
// also some of these things like cursed and vulnerable are the same effect to a stronger degree.

import { rskStatusEffects } from "./effects/statuses";

// does that change anything?
export const rskMagicStatusEffects = [
    {
        id: "confuse",
        label: "RSK.CustomStatus.confused",
        icon: "icons/svg/confused.svg",
        changes: []
    },
    {
        id: "curse",
        label: "RSK.CustomStatus.cursed",
        icon: "icons/svg/cursed.svg",
        changes: []
    },
    {
        id: "enfeeble",
        label: "RSK.CustomStatus.enfeebled",
        icon: "icons/svg/enfeebled.svg",
        changes: []
    },
    {
        id: "vulnerability",
        label: "RSK.CustomStatus.vulnerable",
        icon: "icons/svg/vulnerable.svg",
        changes: []
    },
    {
        id: "weaken",
        label: "RSK.CustomSTatus.weakened",
        icon: "icons/svg/weakened.svg",
        changes: []
    },
    {
        id: "charge",
        label: "RSK.CustomSTatus.charged",
        icon: "icons/svg/charged.svg",
        changes: []
    },
    {
        id: "claws_of_guthix",
        label: "RSK.CustomSTatus.claws_of_guthix",
        icon: "icons/svg/claws_of_guthix.svg",
        changes: []
    }
];

// going to implement magic in a similar fashion to prayer
//  however, this will add damage, multi-targeting, and different spell types.
// hoping that after we implement prayer and magic, we will understand 
// enough about 'actions' to create something that can work for other actions
// like summoning, melee, ranged, etc...

export const standardSpellBook = [{
    id: "confuse",
    type: "utility",
    label: "RSK.Confuse",
    description: "RSK.Confuse.Description",
    effectDescription: "RSK.Confuse.EffectDescription",
    statuses: ["confuse"], // or should we model the effect instead? 
    // effects: [{name:"", statuses:[], changes: [{"system.damage.modifier": -5}]}]
    range: "near",
    target: {
        scope: "enemies",
        number: 1
    },
    usageCost: [{
        type: "earth",
        amount: 2
    },
    {
        type: "water",
        amount: 3
    },
    {
        type: "body",
        amount: 1
    }],
    damageEntries: []
}, {
    id: "windstrike",
    type: "combat",
    label: "RSK.WindStrike",
    description: "RSK.WindStrike.Description",
    effectDescription: "RSK.WindStrike.EffectDescription",
    statuses: [],
    range: "far",
    target: {
        scope: "enemies",
        number: 1
    },
    usageCost: [{
        type: "air",
        amount: 1
    },
    {
        type: "mind",
        amount: 1
    }],
    damageEntries: [{
        type: "air",
        amount: 2
    }]
},
// this is an interesting spell
// it can only affect 'undead'
// it can attack two enemies at far range
// but only one enemy at distant range
// how do we want to change range/target to be able to handle this?
// one option would be to have a 2nd version of crumble undead that is for distant?
{
    id: "crumble_undead",
    type: "combat",
    label: "RSK.CrumbleUndead",
    description: "RSK.CrumbleUndead.Description",
    effectDescription: "RSK.CrumbleUndead.EffectDescription",
    statuses: [], // might actually need to model effects here on the spell data, maybe in addition or instead of statuses? 
    qualities: [{
        id: "puncture",
        tier: 4
    }],
    // this would be another option for how to handle the range variability
    target: [{
        range: "far",
        scope: "enemies",
        type: "undead",
        number: 2
    }, {
        range: "distant",
        scope: "enemies",
        type: "undead",
        number: 1
    }],
    usageCost: [{
        type: "air",
        amount: 2
    }, {
        type: "earth",
        amount: 2
    },
    {
        type: "chaos",
        amount: 1
    }],
    damageEntries: [{
        type: "earth",
        amount: 10
    }]
}, {
    id: "teleport",
    type: "teleport",
    label: "RSK.Teleport",
    description: "RSK.Teleport.Description",
    effectDescription: "RSK.Teleport.EffectDescription",
    range: "near",
    target: {
        scope: "all",
        number: 6
    },
    statuses: [],
    usageCost: [
        {
            type: "air",
            amount: 1
        },
        {
            type: "mind",
            amount: 1
        },
        {
            type: "earth",
            amount: 1
        },
        {
            type: "body",
            amount: 1
        },
        {
            type: "cosmic",
            amount: 1
        },
        {
            type: "water",
            amount: 1
        },
        {
            type: "fire",
            amount: 1
        },
        {
            type: "law",
            amount: 1
        }],
    damageEntries: []
}];

export function getSpellData(spellId) {
    const spellData = standardSpellBook.find(p => p.id === spellId);
    if (!spellData) return {}; //todo: handle

    return spellData
}

function canCast(actor, costData) {
    if (costData.length < 1) return true;
    for (const cost of costData) {
        //todo: search items for runes
    }
    return true;
}

export async function useSpell(actor, spellId) {
    const spellData = getSpellData(spellId);
    if (spellData.id != spellId
        || !canCast(actor, spellData.usageCost)) return {};

    const targetNumber = actor.getRollData().calculateTargetNumber("magic", "intellect");
    const result = await game.rsk.dice.skillCheck(targetNumber);
    const actionData = {
        actorId: actor._id, // the actor that initiated, probably want to validate 'apply' is this person or GM.

        actionType: "magic", // how the usage and outcome should be applied

        // how should qualities fit into actionData? on the outcome/usage? top level?
        // these may augment how damage is applied, or other things
        // really we need to figure out how to handle qualities all together
        // sometimes they are a status/effect, but they also seem to be somewhat their own thing.
        // for example, sometimes a quality is something like puncture that applies to the attack and gives it a way to ignore armour
        // but sometimes a quality will apply bleed, which is a status to add
        // maybe we can describe the outcome of the quality in outcomes?
        // ie for puncture, that may fit into damage entries somehow?
        // qualities and effects only apply when margin is >= 1 if the spell does damage
        // some qualities give the player an option on success to alter the damage in order to gain healing.
        //  that doesn't seem to fit in this model yet.
        qualities: [...spellData.qualities],

        // maybe the usage should be done when we roll?
        // and we should have a different button to just chat anyways
        // that way the outcomes can be applied as much as needed without needing to 
        // do anything special to not over apply the 'usage'?
        usage: {
            addedEffects: [],
            removedEffects: [],
            actorUpdates: {
                "system.skills.magic.used": {
                    operator: "replace",
                    value: true
                },
                //todo: deduct runes from items
            }
        },
        outcome: {
            addedEffects: result.isSuccess ? [getSpellEffectData(spellData)] : [],
            removedEffects: [],
            damageEntries: result.isSuccess ? [...spellData.damageEntries] : {},
            // damageEntries.punctureDamage?
            // what other things do qualities do that are not really suited to 'effects/statuses' maybe we just 
            // detail them in the outcome?
            //  some qualities will have a choice for the actor to make on activation 
            actorUpdates: {},
        }
    };
    return actionData;
}

// will the durations need to vary per status ever?
export function getSpellEffectData(spellData, duration = {}) {
    const spellEffects = spellData.statuses.filter(s => rskMagicStatusEffects.includes(s)).map(
        s => toEffect(rskMagicStatusEffects.find(s), duration));
    const spellAddedEffects = spellData.statuses.filter(s => rskStatusEffects.includes(s)).map(
        s => toEffect(rskStatusEffects.find(s), duration));
    return [...spellEffects, ...spellAddedEffects];
}

function toEffect(status, duration) {
    return {
        name: status.label,
        icon: status.find(s).icon,
        duration: duration,
        statuses: [status.id]
    }
}