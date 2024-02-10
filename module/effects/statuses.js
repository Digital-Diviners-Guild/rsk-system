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
        statuses: [status.id],
        changes: status.changes
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
        icon: "icons/png/poisoned.png",
        changes: []
    },
    {
        id: "bleeding",
        label: "RSK.CustomStatus.bleeding",
        icon: "icons/png/bleeding.png",
        changes: []
    },
    {
        id: "frozen",
        label: "RSK.CustomStatus.frozen",
        icon: "icons/png/frozen.png",
        changes: []
    },
    {
        id: "burning",
        label: "RSK.CustomStatus.burning",
        icon: "icons/png/burning.png",
        changes: []
    },
    {
        id: "prone",
        label: "RSK.CustomStatus.prone",
        icon: "icons/png/prone.png",
        changes: []
    },
    {
        id: "pinned",
        label: "RSK.CustomStatus.pinned",
        icon: "icons/png/pinned.png",
        changes: []
    },
    {
        id: "stunned",
        label: "RSK.CustomStatus.stunned",
        icon: "icons/png/stunned.png",
        changes: []
    },
];

export const rskPrayerStatusEffects = [
    {
        id: "thick_skin",
        label: "RSK.ThickSkin",
        icon: "icons/png/thick_skin.png",
        changes: [{
            key: "system.skills.defense.modifier",
            mode: changeModes.ADD,
            value: 2
        }]
    },
    {
        id: "rock_skin",
        label: "RSK.RockSkin",
        icon: "icons/png/rock_skin.png",
        changes: [{
            key: "system.skills.defense.modifier",
            mode: changeModes.ADD,
            value: 4
        }]
    },
    {
        id: "steel_skin",
        label: "RSK.SteelSkin",
        icon: "icons/png/steel_skin.png",
        changes: [{
            key: "system.skills.defense.modifier",
            mode: changeModes.ADD,
            value: 6
        }]
    },
    {
        id: "improved_reflexes",
        label: "RSK.ImprovedReflexes",
        icon: "icons/png/improved_reflexes.png",
        changes: [{
            key: "system.skills.attack.modifier",
            mode: changeModes.ADD,
            value: 4
        }]
    },
    {
        id: "incredible_reflexes",
        label: "RSK.IncredibleReflexes",
        icon: "icons/png/incredible_reflexes.png",
        changes: [{
            key: "system.skills.attack.modifier",
            mode: changeModes.ADD,
            value: 6
        }]
    },

    {
        id: "burst_of_strength",
        label: "RSK.burstOfStrength",
        icon: "icons/png/burst_of_strength.png",
        changes: [{
            key: "system.abilities.strength.modifier",
            mode: changeModes.ADD,
            value: 2
        }]
    },
    {
        id: "superhuman_strength",
        label: "RSK.SuperhumanStrength",
        icon: "icons/png/superhuman_strength.png",
        changes: [{
            key: "system.abilities.strength.modifier",
            mode: changeModes.ADD,
            value: 4
        }]
    },
    {
        id: "ultimate_strength",
        label: "RSK.UltimateStrength",
        icon: "icons/png/ultimate_strength.png",
        changes: [{
            key: "system.abilities.strength.modifier",
            mode: changeModes.ADD,
            value: 6
        }]
    },
    {
        id: "sharp_eye",
        label: "RSK.SharpEye",
        icon: "icons/png/sharp_eye.png",
        changes: [{
            key: "system.skills.ranged.modifier",
            mode: changeModes.ADD,
            value: 2
        }]
    },
    {
        id: "hawk_eye",
        label: "RSK.HawkEye",
        icon: "icons/png/hawk_eye.png",
        changes: [{
            key: "system.skills.ranged.modifier",
            mode: changeModes.ADD,
            value: 4
        }]
    },
    {
        id: "eagle_eye",
        label: "RSK.EagleEye",
        icon: "icons/png/eagle_eye.png",
        changes: [{
            key: "system.skills.ranged.modifier",
            mode: changeModes.ADD,
            value: 6
        }]
    },
    {
        id: "mystic_will",
        label: "RSK.MysticWill",
        icon: "icons/png/mystic_will.png",
        changes: [{
            key: "system.skills.magic.modifier",
            mode: changeModes.ADD,
            value: 2
        }, {
            key: "system.skills.defense.modifier",
            mode: changeModes.ADD,
            value: 2
        }]
    },
    {
        id: "mystic_lore",
        label: "RSK.MysticLore",
        icon: "icons/png/mystic_lore.png",
        changes: [{
            key: "system.skills.magic.modifier",
            mode: changeModes.ADD,
            value: 4
        }, {
            key: "system.skills.defense.modifier",
            mode: changeModes.ADD,
            value: 4
        }]
    },
    {
        id: "mystic_might",
        label: "RSK.MysticMight",
        icon: "icons/png/mystic_might.png",
        changes: [{
            key: "system.skills.magic.modifier",
            mode: changeModes.ADD,
            value: 6
        }, {
            key: "system.skills.defense.modifier",
            mode: changeModes.ADD,
            value: 6
        }]
    },
    {
        id: "augury",
        label: "RSK.Augury",
        icon: "icons/png/augury.png",
        changes: [{
            key: "system.skills.magic.modifier",
            mode: changeModes.ADD,
            value: 8
        }, {
            key: "system.skills.defense.modifier",
            mode: changeModes.ADD,
            value: 8
        }, {
            key: "system.abilities.intellect.modifier",
            mode: changeModes.ADD,
            value: 8
        }]
    },
    {
        id: "piety",
        label: "RSK.Piety",
        icon: "icons/png/piety.png",
        changes: [{
            key: "system.skills.attack.modifier",
            mode: changeModes.ADD,
            value: 8
        }, {
            key: "system.skills.defense.modifier",
            mode: changeModes.ADD,
            value: 8
        }, {
            key: "system.abilities.strength.modifier",
            mode: changeModes.ADD,
            value: 8
        }]
    },
    {
        id: "rigour",
        label: "RSK.Rigour",
        icon: "icons/png/rigour.png",
        changes: [{
            key: "system.skills.ranged.modifier",
            mode: changeModes.ADD,
            value: 8
        }, {
            key: "system.skills.defense.modifier",
            mode: changeModes.ADD,
            value: 8
        }, {
            key: "system.abilities.agility.modifier",
            mode: changeModes.ADD,
            value: 8
        }]
    },
    {
        id: "protect_from_melee",
        label: "RSK.ProtectFromMelee",
        icon: "icons/png/protect_from_melee.png",
        changes: [
            {
                key: "system.resistance.melee",
                mode: changeModes.ADD,
                value: 5
            }
        ]
    },
    {
        id: "protect_from_missiles",
        label: "RSK.ProtectFromMissiles",
        icon: "icons/png/protect_from_missiles.png",
        changes: [{
            key: "system.resistance.ranged",
            mode: changeModes.ADD,
            value: 5
        }]
    },
    {
        id: "protect_from_magic",
        label: "RSK.ProtectFromMagic",
        icon: "icons/png/protect_from_magic.png",
        changes: [{
            key: "system.resistance.magic",
            mode: changeModes.ADD,
            value: 5
        }]
    },
    //end todo
    //todo: not sure if this needs anything, maybe a flag? or death consequences can check active prayer
    {
        id: "protect_item",
        label: "RSK.ProtectItem",
        icon: "icons/png/protect_item.png",
        changes: []
    },
    //end todo
    //todo: not sure if this needs anything, it heals you on use, maybe there is something we can do though
    {
        id: "rapid_heal",
        label: "RSK.RapidHeal",
        icon: "icons/png/rapid_heal.png",
        changes: []
    },
    {
        id: "redemption",
        label: "RSK.Redemption",
        icon: "icons/png/redemption.png",
        changes: []
    },
    //end todo
    //todo: deals damage if you die while its active, no automation yet
    {
        id: "retribution",
        label: "RSK.Retribution",
        icon: "icons/png/retribution.png",
        changes: []
    },
    //end todo
];

//todo: 
export const rskMagicStatusEffects = [
    {
        id: "confuse",
        label: "RSK.CustomStatus.confused",
        icon: "icons/png/confused.png",
        changes: []
    },
    {
        id: "curse",
        label: "RSK.CustomStatus.cursed",
        icon: "icons/png/cursed.png",
        changes: []
    },
    {
        id: "enfeeble",
        label: "RSK.CustomStatus.enfeebled",
        icon: "icons/png/enfeebled.png",
        changes: []
    },
    {
        id: "vulnerability",
        label: "RSK.CustomStatus.vulnerable",
        icon: "icons/png/vulnerable.png",
        changes: []
    },
    {
        id: "weaken",
        label: "RSK.CustomSTatus.weakened",
        icon: "icons/png/weakened.png",
        changes: []
    },
    {
        id: "charge",
        label: "RSK.CustomSTatus.charged",
        icon: "icons/png/charged.png",
        changes: []
    },
    {
        id: "claws_of_guthix",
        label: "RSK.CustomSTatus.claws_of_guthix",
        icon: "icons/png/claws_of_guthix.png",
        changes: []
    }
];

