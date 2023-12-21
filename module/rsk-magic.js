// do we want to use statuses for magical/prayer buff/debuff/effects?
// if we do not use statuses for magic/prayer, how else will we track/show it? this may be a good fit.
//  - the other way would be to use activeeffets that are not statuses? is that better?
// also some of these things like cursed and vulnerable are the same effect to a stronger degree.
// does that change anything?
export const rskMagicStatusEffects = [
    {
        id: "confused",
        label: "RSK.CustomStatus.confused",
        icon: "icons/svg/confused.svg",
        changes: []
    },
    {
        id: "cursed",
        label: "RSK.CustomStatus.cursed",
        icon: "icons/svg/cursed.svg",
        changes: []
    },
    {
        id: "enfeebled",
        label: "RSK.CustomStatus.enfeebled",
        icon: "icons/svg/enfeebled.svg",
        changes: []
    },
    {
        id: "vulnerable",
        label: "RSK.CustomStatus.vulnerable",
        icon: "icons/svg/vulnerable.svg",
        changes: []
    },
    {
        id: "weakened",
        label: "RSK.CustomSTatus.weakened",
        icon: "icons/svg/weakened.svg",
        changes: []
    },
    {
        id: "charged",
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
    statuses: ["confused"], // or should we model the effect instead?
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
    damage: []
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
    damage: [{
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
    statuses: [],
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
    damage: [{
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
    damage: []
}
]