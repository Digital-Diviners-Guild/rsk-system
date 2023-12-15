const changeModes = {
    ADD: 2,
    OVERRIDE: 5
};

export function customizeStatusEffects() {
    CONFIG.statusEffects = [...rskStatusEffects, ...rskMagicStatusEffects, ...rskPrayerStatusEffects];
    console.log(CONFIG.statusEffects);
};

//todo: need image urls (most are just made up)
export const rskStatusEffects = [
    {
        id: "dead",
        label: "RSK.CustomStatus.dead",
        icon: "icons/svg/skull.svg",
        changes: [
            {
                key: "system.lifePoints.value",
                mode: changeModes.OVERRIDE,
                value: 0
            }
        ]
    },
    {
        id: "poisoned",
        label: "RSK.CustomStatus.poisoned",
        icon: "icons/svg/poisoned.svg",
        changes: []
    },
    {
        id: "bleeding",
        label: "RSK.CustomStatus.bleeding",
        icon: "icons/svg/bleeding.svg",
        changes: []
    },
    {
        id: "frozen",
        label: "RSK.CustomStatus.frozen",
        icon: "icons/svg/frozen.svg",
        changes: []
    },
    {
        id: "burning",
        label: "RSK.CustomStatus.burning",
        icon: "icons/svg/burning.svg",
        changes: []
    },
    {
        id: "prone",
        label: "RSK.CustomStatus.prone",
        icon: "icons/svg/prone.svg",
        changes: []
    },
    {
        id: "pinned",
        label: "RSK.CustomStatus.pinned",
        icon: "icons/svg/pinned.svg",
        changes: []
    },
    {
        id: "stunned",
        label: "RSK.CustomStatus.stunned",
        icon: "icons/svg/stunned.svg",
        changes: []
    },
];

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
        id: "claws_of_guthix",
        label: "RSK.CustomSTatus.claws_of_guthix",
        icon: "icons/svg/claws_of_guthix.svg",
        changes: []
    }
];

export const rskPrayerStatusEffects = [
    {
        id: "improved_reflexes",
        label: "RSK.CustomStatus.improved_reflexes",
        icon: "icons/svg/improved_reflexes.svg",
        changes: []
    },
    {
        id: "incredible_reflexes",
        label: "RSK.CustomStatus.incredible_reflexes",
        icon: "icons/svg/incredible_reflexes.svg",
        changes: []
    },
    {
        id: "mystic_lore",
        label: "RSK.CustomStatus.mystic_lore",
        icon: "icons/svg/mystic_lore.svg",
        changes: []
    },
    {
        id: "mystic_might",
        label: "RSK.CustomStatus.mystic_might",
        icon: "icons/svg/mystic_might.svg",
        changes: []
    },
    {
        id: "mystic_will",
        label: "RSK.CustomStatus.mystic_will",
        icon: "icons/svg/mystic_will.svg",
        changes: []
    },
    {
        id: "piety",
        label: "RSK.CustomStatus.piety",
        icon: "icons/svg/piety.svg",
        changes: []
    },
    {
        id: "augury",
        label: "RSK.CustomStatus.augury",
        icon: "icons/svg/augury.svg",
        changes: []
    },
    {
        id: "burst_of_strength",
        label: "RSK.CustomStatus.burst_of_strength",
        icon: "icons/svg/burst_of_strength.svg",
        changes: []
    },
    {
        id: "eagle_eye",
        label: "RSK.CustomStatus.eagle_eye",
        icon: "icons/svg/eagle_eye.svg",
        changes: []
    },
    {
        id: "hawk_eye",
        label: "RSK.CustomStatus.hawk_eye",
        icon: "icons/svg/hawk_eye.svg",
        changes: []
    },
    {
        id: "protect_from_melee",
        label: "RSK.CustomStatus.protect_from_melee",
        icon: "icons/svg/protect_from_melee.svg",
        changes: []
    },
    {
        id: "protect_from_range",
        label: "RSK.CustomStatus.protect_from_range",
        icon: "icons/svg/protect_from_range.svg",
        changes: []
    },
    {
        id: "protect_from_magic",
        label: "RSK.CustomStatus.protect_from_magic",
        icon: "icons/svg/protect_from_magic.svg",
        changes: []
    },
    {
        id: "protect_item",
        label: "RSK.CustomStatus.protect_item",
        icon: "icons/svg/protect_item.svg",
        changes: []
    },
    {
        id: "rapid_heal",
        label: "RSK.CustomStatus.rapid_heal",
        icon: "icons/svg/rapid_heal.svg",
        changes: []
    },
    {
        id: "redemption",
        label: "RSK.CustomStatus.redemption",
        icon: "icons/svg/redemption.svg",
        changes: []
    },
    {
        id: "retribution",
        label: "RSK.CustomStatus.retribution",
        icon: "icons/svg/retribution.svg",
        changes: []
    },
    {
        id: "rigour",
        label: "RSK.CustomStatus.rigour",
        icon: "icons/svg/rigour.svg",
        changes: []
    },
    {
        id: "rock_skin",
        label: "RSK.CustomStatus.rock_skin",
        icon: "icons/svg/rock_skin.svg",
        changes: []
    },
    {
        id: "sharp_eye",
        label: "RSK.CustomStatus.sharp_eye",
        icon: "icons/svg/sharp_eye.svg",
        changes: []
    },
    {
        id: "steel_skin",
        label: "RSK.CustomStatus.steel_skin",
        icon: "icons/svg/steel_skin.svg",
        changes: []
    },
    {
        id: "superhuman_strength",
        label: "RSK.CustomStatus.superhuman_strength",
        icon: "icons/svg/superhuman_strength.svg",
        changes: []
    },
    {
        id: "thick_skin",
        label: "RSK.CustomStatus.thick_skin",
        icon: "icons/svg/thick_skin.svg",
        changes: []
    },
    {
        id: "ultimate_strength",
        label: "RSK.CustomStatus.ultimate_strength",
        icon: "icons/svg/ultimate_strength.svg",
        changes: []
    }
];