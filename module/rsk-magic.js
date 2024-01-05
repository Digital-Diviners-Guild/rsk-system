// do we want to use statuses for magical/prayer buff/debuff/effects?
// if we do not use statuses for magic/prayer, how else will we track/show it? this may be a good fit.
//  - the other way would be to use activeeffets that are not statuses? is that better?
// also some of these things like cursed and vulnerable are the same effect to a stronger degree.
// does that change anything?

import RSKConfirmRollDialog from "./applications/RSKConfirmRollDialog.js";
import { rskStatusEffects, statusToEffect } from "./effects/statuses.js";
import { getTarget } from "./rsk-targetting.js";

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
    effects: [],
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
    damageEntries: {}
}, {
    id: "windstrike",
    type: "combat",
    label: "RSK.WindStrike",
    description: "RSK.WindStrike.Description",
    effectDescription: "RSK.WindStrike.EffectDescription",
    statuses: [],
    effects: [],
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
    damageEntries: {
        air: 2
    }
},
{
    id: "crumble_undead",
    type: "combat",
    label: "RSK.CrumbleUndead",
    description: "RSK.CrumbleUndead.Description",
    effectDescription: "RSK.CrumbleUndead.EffectDescription",
    statuses: [], // might actually need to model effects here on the spell data, maybe in addition or instead of statuses? 
    // statuses: {added: [], removed: []} ?
    effects: [],
    // effects: {added: [], removed: []} ?
    qualities: [{
        id: "puncture",
        tier: 4
    }],
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
    damageEntries: {
        earth: 10
    }
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
    effects: [],
    usageCost: [
        // {
        //     type: "air",
        //     amount: 1
        // },
        // {
        //     type: "mind",
        //     amount: 1
        // },
        // {
        //     type: "earth",
        //     amount: 1
        // },
        // {
        //     type: "body",
        //     amount: 1
        // },
        // {
        //     type: "cosmic",
        //     amount: 1
        // },
        // {
        //     type: "water",
        //     amount: 1
        // },
        // {
        //     type: "fire",
        //     amount: 1
        // },
        {
            type: "law",
            amount: 1
        }],
    damageEntries: {}
}];

export function getSpellData(spellId) {
    const spellData = standardSpellBook.find(p => p.id === spellId);
    if (!spellData) return {}; //todo: handle

    return spellData
}

//todo: for certain spells there may be an equipment requirement
function canCast(actor, costData) {
    if (costData.length < 1) return true;
    for (const cost of costData) {
        const runes = actor.items.find(i => i.type === "rune" && i.system.type === cost.type);
        if (!runes || runes.system.quantity < cost.amount) return false;
    }
    return true;
}

export async function cast(actor, spellId) {
    const spellData = standardSpellBook.find(s => s.id === spellId);
    if (!(spellData && canCast(actor, spellData?.usageCost))) return {};

    const result = await useSpell(actor, spellData.usageCost);
    //todo: outcome
    // how will this apply to non combat spells?
    // is type spell sufficient?
    //  maybe non combat, chatting is sufficient? for now it will be
    const flavor = await renderTemplate("systems/rsk/templates/applications/outcome-message.hbs",
        {
            ...spellData,
            ...result
        });
    await result.rollResult.toMessage({
        flavor: flavor,
        flags: {
            rsk: result.isSuccess ? {
                outcome: {
                    actorId: actor._id,
                    type: "spell",
                    addedEffects: [...getSpellEffectData(spellData)],
                    removedEffects: [], // todo: how will we configure this?
                    damageEntries: { ...spellData.damageEntries }, // todo: account for things like puncture
                    actorUpdates: {}
                }
            } : {}
        }
    });
    return result;
}

async function useSpell(actor, runeCost) {
    const rollData = actor.getRollData();
    const dialog = RSKConfirmRollDialog.create(rollData, { defaultSkill: "magic", defaultAbility: "intellect" });
    const rollOptions = await dialog();
    if (!rollOptions.rolled) return {}

    const result = await actor.useSkill(rollOptions.skill, rollOptions.ability);
    if (result.isSuccess) {
        for (const cost of runeCost) {
            actor.spendRunes(cost.type, cost.amount);
        }
    }
    return result;
}

export async function applySpell(outcome) {
    const actor = Actor.get(outcome.actorId);
    const target = getTarget(actor);
    await target.applyOutcome(outcome);
}

// will the durations need to vary per status ever?
export function getSpellEffectData(spellData, duration = {}) {
    const magicStatusIds = rskMagicStatusEffects.map(s => s.id);
    const rskStatusIds = rskStatusEffects.map(s => s.id);
    const spellStatusEffects = spellData.statuses.filter(s => magicStatusIds.includes(s))
        .map(s => statusToEffect(rskMagicStatusEffects.find(x => x.id === s), duration));
    const spellAddedStatusEffects = spellData.statuses.filter(s => rskStatusIds.includes(s))
        .map(s => statusToEffect(rskStatusEffects.find(x => x.id === s), duration));
    return [...spellData.effects, ...spellStatusEffects, ...spellAddedStatusEffects];
}