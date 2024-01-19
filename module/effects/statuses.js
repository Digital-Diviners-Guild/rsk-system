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
        icon: "systems/rsk/icons/png/poisoned.png",
        changes: []
    },
    {
        id: "bleeding",
        label: "RSK.CustomStatus.bleeding",
        icon: "systems/rsk/icons/png/bleeding.png",
        changes: []
    },
    {
        id: "frozen",
        label: "RSK.CustomStatus.frozen",
        icon: "systems/rsk/icons/png/frozen.png",
        changes: []
    },
    {
        id: "burning",
        label: "RSK.CustomStatus.burning",
        icon: "systems/rsk/icons/png/burning.png",
        changes: []
    },
    {
        id: "prone",
        label: "RSK.CustomStatus.prone",
        icon: "systems/rsk/icons/png/prone.png",
        changes: []
    },
    {
        id: "pinned",
        label: "RSK.CustomStatus.pinned",
        icon: "systems/rsk/icons/png/pinned.png",
        changes: []
    },
    {
        id: "stunned",
        label: "RSK.CustomStatus.stunned",
        icon: "systems/rsk/icons/png/stunned.png",
        changes: []
    },
];

export const rskPrayerStatusEffects = [
    {
        id: "improved_reflexes",
        label: "RSK.ImprovedReflexes",
        icon: "systems/rsk/icons/png/improved_reflexes.png",
        changes: []
    },
    {
        id: "incredible_reflexes",
        label: "RSK.IncredibleReflexes",
        icon: "systems/rsk/icons/png/incredible_reflexes.png",
        changes: []
    },
    {
        id: "mystic_lore",
        label: "RSK.MysticLore",
        icon: "systems/rsk/icons/png/mystic_lore.png",
        changes: []
    },
    {
        id: "mystic_might",
        label: "RSK.MysticMight",
        icon: "systems/rsk/icons/png/mystic_might.png",
        changes: []
    },
    {
        id: "mystic_will",
        label: "RSK.MysticWill",
        icon: "systems/rsk/icons/png/mystic_will.png",
        changes: []
    },
    {
        id: "piety",
        label: "RSK.Piety",
        icon: "systems/rsk/icons/png/piety.png",
        changes: []
    },
    {
        id: "augury",
        label: "RSK.Augury",
        icon: "systems/rsk/icons/png/augury.png",
        changes: []
    },
    {
        id: "burst_of_strength",
        label: "RSK.burstOfStrength",
        icon: "systems/rsk/icons/png/burst_of_strength.png",
        changes: []
    },
    {
        id: "eagle_eye",
        label: "RSK.EagleEye",
        icon: "systems/rsk/icons/png/eagle_eye.png",
        changes: []
    },
    {
        id: "hawk_eye",
        label: "RSK.HawkEye",
        icon: "systems/rsk/icons/png/hawk_eye.png",
        changes: []
    },
    {
        id: "protect_from_melee",
        label: "RSK.ProtectFromMelee",
        icon: "systems/rsk/icons/png/protect_from_melee.png",
        changes: []
    },
    {
        id: "protect_from_missiles",
        label: "RSK.ProtectFromMissiles",
        icon: "systems/rsk/icons/png/protect_from_missiles.png",
        changes: []
    },
    {
        id: "protect_from_magic",
        label: "RSK.ProtectFromMagic",
        icon: "systems/rsk/icons/png/protect_from_magic.png",
        changes: []
    },
    {
        id: "protect_item",
        label: "RSK.ProtectItem",
        icon: "systems/rsk/icons/png/protect_item.png",
        changes: []
    },
    {
        id: "rapid_heal",
        label: "RSK.RapidHeal",
        icon: "systems/rsk/icons/png/rapid_heal.png",
        changes: []
    },
    {
        id: "redemption",
        label: "RSK.Redemption",
        icon: "systems/rsk/icons/png/redemption.png",
        changes: []
    },
    {
        id: "retribution",
        label: "RSK.Retribution",
        icon: "systems/rsk/icons/png/retribution.png",
        changes: []
    },
    {
        id: "rigour",
        label: "RSK.Rigour",
        icon: "systems/rsk/icons/png/rigour.png",
        changes: []
    },
    {
        id: "rock_skin",
        label: "RSK.RockSkin",
        icon: "systems/rsk/icons/png/rock_skin.png",
        changes: []
    },
    {
        id: "sharp_eye",
        label: "RSK.SharpEye",
        icon: "systems/rsk/icons/png/sharp_eye.png",
        changes: []
    },
    {
        id: "steel_skin",
        label: "RSK.SteelSkin",
        icon: "systems/rsk/icons/png/steel_skin.png",
        changes: []
    },
    {
        id: "superhuman_strength",
        label: "RSK.SuperhumanStrength",
        icon: "systems/rsk/icons/png/superhuman_strength.png",
        changes: []
    },
    {
        id: "thick_skin",
        label: "RSK.ThickSkin",
        icon: "systems/rsk/icons/png/thick_skin.png",
        changes: []
    },
    {
        id: "ultimate_strength",
        label: "RSK.UltimateStrength",
        icon: "systems/rsk/icons/png/ultimate_strength.png",
        changes: []
    }
];

export const rskMagicStatusEffects = [
    {
        id: "confuse",
        label: "RSK.CustomStatus.confused",
        icon: "systems/rsk/icons/png/confused.png",
        changes: []
    },
    {
        id: "curse",
        label: "RSK.CustomStatus.cursed",
        icon: "systems/rsk/icons/png/cursed.png",
        changes: []
    },
    {
        id: "enfeeble",
        label: "RSK.CustomStatus.enfeebled",
        icon: "systems/rsk/icons/png/enfeebled.png",
        changes: []
    },
    {
        id: "vulnerability",
        label: "RSK.CustomStatus.vulnerable",
        icon: "systems/rsk/icons/png/vulnerable.png",
        changes: []
    },
    {
        id: "weaken",
        label: "RSK.CustomSTatus.weakened",
        icon: "systems/rsk/icons/png/weakened.png",
        changes: []
    },
    {
        id: "charge",
        label: "RSK.CustomSTatus.charged",
        icon: "systems/rsk/icons/png/charged.png",
        changes: []
    },
    {
        id: "claws_of_guthix",
        label: "RSK.CustomSTatus.claws_of_guthix",
        icon: "systems/rsk/icons/png/claws_of_guthix.png",
        changes: []
    }
];

