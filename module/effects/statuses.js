export const changeModes = {
    ADD: 2,
    OVERRIDE: 5
};

export function customizeStatusEffects() {
    CONFIG.statusEffects = [...rskStatusEffects, ...rskMagicStatusEffects, ...rskPrayerStatusEffects];
};

export function statusToEffect(status, duration) {
    return {
        name: status.label,
        icon: status.icon,
        duration: duration,
        statuses: [status.id]
    }
}

//todo: need image urls (most are just made up)

//thought: many of these things like poison, burning, etc... come from qualities of varying strength.
// ie, Incendiary II does more than Incendiary I, do we need burning I and burning II? or just burning, and augment it some other way?
//thought: items like antipoison can apply "poisoned" with a "reverse" param that instead deletes if existing on actor
//thought: actor in an onRoundStart hook could look to apply damage from effects like poison and burning
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

export const rskPrayerStatusEffects = [
    {
        id: "improved_reflexes",
        label: "RSK.ImprovedReflexes",
        icon: "icons/svg/improved_reflexes.svg",
        changes: []
    },
    {
        id: "incredible_reflexes",
        label: "RSK.IncredibleReflexes",
        icon: "icons/svg/incredible_reflexes.svg",
        changes: []
    },
    {
        id: "mystic_lore",
        label: "RSK.MysticLore",
        icon: "icons/svg/mystic_lore.svg",
        changes: []
    },
    {
        id: "mystic_might",
        label: "RSK.MysticMight",
        icon: "icons/svg/mystic_might.svg",
        changes: []
    },
    {
        id: "mystic_will",
        label: "RSK.MysticWill",
        icon: "icons/svg/mystic_will.svg",
        changes: []
    },
    {
        id: "piety",
        label: "RSK.Piety",
        icon: "icons/svg/piety.svg",
        changes: []
    },
    {
        id: "augury",
        label: "RSK.Augury",
        icon: "icons/svg/augury.svg",
        changes: []
    },
    {
        id: "burst_of_strength",
        label: "RSK.burstOfStrength",
        icon: "systems/rsk/icons/svg/burst_of_strength.svg",
        changes: []
    },
    {
        id: "eagle_eye",
        label: "RSK.EagleEye",
        icon: "icons/svg/eagle_eye.svg",
        changes: []
    },
    {
        id: "hawk_eye",
        label: "RSK.HawkEye",
        icon: "icons/svg/hawk_eye.svg",
        changes: []
    },
    {
        id: "protect_from_melee",
        label: "RSK.ProtectFromMelee",
        icon: "icons/svg/protect_from_melee.svg",
        changes: []
    },
    {
        id: "protect_from_range",
        label: "RSK.ProtectFromRange",
        icon: "icons/svg/protect_from_range.svg",
        changes: []
    },
    {
        id: "protect_from_magic",
        label: "RSK.ProtectFromMagic",
        icon: "icons/svg/protect_from_magic.svg",
        changes: []
    },
    {
        id: "protect_item",
        label: "RSK.ProtectItem",
        icon: "icons/svg/protect_item.svg",
        changes: []
    },
    {
        id: "rapid_heal",
        label: "RSK.RapidHeal",
        icon: "icons/svg/rapid_heal.svg",
        changes: []
    },
    {
        id: "redemption",
        label: "RSK.Redemption",
        icon: "icons/svg/redemption.svg",
        changes: []
    },
    {
        id: "retribution",
        label: "RSK.Retribution",
        icon: "icons/svg/retribution.svg",
        changes: []
    },
    {
        id: "rigour",
        label: "RSK.Rigour",
        icon: "icons/svg/rigour.svg",
        changes: []
    },
    {
        id: "rock_skin",
        label: "RSK.RockSkin",
        icon: "icons/svg/rock_skin.svg",
        changes: []
    },
    {
        id: "sharp_eye",
        label: "RSK.SharpEye",
        icon: "icons/svg/sharp_eye.svg",
        changes: []
    },
    {
        id: "steel_skin",
        label: "RSK.SteelSkin",
        icon: "icons/svg/steel_skin.svg",
        changes: []
    },
    {
        id: "superhuman_strength",
        label: "RSK.SuperhumanStrength",
        icon: "icons/svg/superhuman_strength.svg",
        changes: []
    },
    {
        id: "thick_skin",
        label: "RSK.ThickSkin",
        icon: "systems/rsk/icons/svg/thick_skin.svg",
        changes: []
    },
    {
        id: "ultimate_strength",
        label: "RSK.UltimateStrength",
        icon: "icons/svg/ultimate_strength.svg",
        changes: []
    }
];

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

