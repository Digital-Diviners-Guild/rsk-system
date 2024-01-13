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

// this spell book could probably still be hardcoded defaults, but we need to 
// have the characters import them in prepareData via : RSKSpell.fromSource(spellData)
export const standardSpellBook = [{
    id: "confuse",
    spellType: "utility",
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
        itemType: "rune",
        amount: 2
    },
    {
        type: "water",
        itemType: "rune",
        amount: 3
    },
    {
        type: "body",
        itemType: "rune",
        amount: 1
    }],
    damageEntries: {}
}, {
    id: "windstrike",
    spellType: "combat",
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
        itemType: "rune",
        amount: 1
    },
    {
        type: "mind",
        itemType: "rune",
        amount: 1
    }],
    damageEntries: {
        air: 2
    }
},
{
    id: "crumble_undead",
    spellType: "combat",
    label: "RSK.CrumbleUndead",
    description: "RSK.CrumbleUndead.Description",
    effectDescription: "RSK.CrumbleUndead.EffectDescription",
    statuses: [], // might actually need to model effects here on the spell data, maybe in addition or instead of statuses? 
    // statuses: {added: [], removed: []} ?
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
        itemType: "rune",
        amount: 2
    }, {
        type: "earth",
        itemType: "rune",
        amount: 2
    },
    {
        type: "chaos",
        itemType: "rune",
        amount: 1
    }],
    damageEntries: {
        earth: 10
    }
}, {
    id: "teleport",
    spellType: "teleport",
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
        // {
        //     type:"air",    
        //     itemType: "rune",
        //     amount: 1
        // },
        // {
        //     type:"mind",    
        //     itemType: "rune",
        //     amount: 1
        // },
        // {
        //     type:"earth",    
        //     itemType: "rune",
        //     amount: 1
        // },
        // {
        //     type:"body",    
        //     itemType: "rune",
        //     amount: 1
        // },
        // {
        //     type:"cosmic",    
        //     itemType: "rune",
        //     amount: 1
        // },
        // {
        //     type:"water",    
        //     itemType: "rune",
        //     amount: 1
        // },
        // {
        //     type:"fire",    
        //     itemType: "rune",
        //     amount: 1
        // },
        {
            type: "law",
            itemType: "rune",
            amount: 1
        }],
    damageEntries: {}
}];