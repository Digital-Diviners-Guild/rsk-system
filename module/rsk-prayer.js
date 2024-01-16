//todo: this may be helpful to control _id fields.
// export function getEffectId(text) {
//     return text.replace(/_/g, "").slice(0, 16).padEnd(16, "0");
// }

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

export const rskDefaultPrayers = [
    {
        id: "improved_reflexes",
        label: "RSK.ImprovedReflexes",
        icon: "icons/svg/improved_reflexes.svg",
        statuses: ["improved_reflexes"],
        usageCost: [{
            itemType: "point",
            type: "prayer",
            amount: 2
        }],
        range: "near",
        effectDescription: "RSK.ImprovedReflexes.EffectDescription",
        changes: []
    },
    {
        id: "incredible_reflexes",
        label: "RSK.IncredibleReflexes",
        icon: "icons/svg/incredible_reflexes.svg",
        statuses: ["incredible_reflexes"],
        usageCost: [{
            itemType: "point",
            type: "prayer",
            amount: 2
        }],
        range: "near",
        effectDescription: "RSK.IncredibleReflexes.EffectDescription",
        changes: []
    },
    {
        id: "mystic_lore",
        label: "RSK.MysticLore",
        icon: "icons/svg/mystic_lore.svg",
        statuses: ["mystic_lore"],
        usageCost: [{
            itemType: "point",
            type: "prayer",
            amount: 2
        }],
        range: "near",
        effectDescription: "RSK.MysticLore.EffectDescription",
        changes: []
    },
    {
        id: "mystic_might",
        label: "RSK.MysticMight",
        icon: "icons/svg/mystic_might.svg",
        statuses: ["mystic_might"],
        usageCost: [{
            itemType: "point",
            type: "prayer",
            amount: 2
        }],
        range: "near",
        effectDescription: "RSK.MysticMight.EffectDescription",
        changes: []
    },
    {
        id: "mystic_will",
        label: "RSK.MysticWill",
        icon: "icons/svg/mystic_will.svg",
        statuses: ["mystic_will"],
        usageCost: [{
            itemType: "point",
            type: "prayer",
            amount: 2
        }],
        range: "near",
        effectDescription: "RSK.MysticWill.EffectDescription",
        changes: []
    },
    {
        id: "piety",
        label: "RSK.Piety",
        icon: "icons/svg/piety.svg",
        statuses: ["piety"],
        usageCost: [{
            itemType: "point",
            type: "prayer",
            amount: 2
        }],
        range: "near",
        effectDescription: "RSK.Piety.EffectDescription",
        changes: []
    },
    {
        id: "augury",
        label: "RSK.Augury",
        icon: "icons/svg/augury.svg",
        statuses: ["augury"],
        usageCost: [{
            itemType: "point",
            type: "prayer",
            amount: 2
        }],
        range: "near",
        effectDescription: "RSK.Augury.EffectDescription",
        changes: []
    },
    {
        id: "burst_of_strength",
        label: "RSK.burstOfStrength",
        icon: "systems/rsk/icons/svg/burst_of_strength.svg",
        statuses: ["burst_of_strength"],
        usageCost: [{
            itemType: "point",
            type: "prayer",
            amount: 2
        }],
        range: "near",
        effectDescription: "RSK.burstOfStrength.EffectDescription",
        changes: []
    },
    {
        id: "eagle_eye",
        label: "RSK.EagleEye",
        icon: "icons/svg/eagle_eye.svg",
        statuses: ["eagle_eye"],
        usageCost: [{
            itemType: "point",
            type: "prayer",
            amount: 2
        }],
        range: "near",
        effectDescription: "RSK.EagleEye.EffectDescription",
        changes: []
    },
    {
        id: "hawk_eye",
        label: "RSK.HawkEye",
        icon: "icons/svg/hawk_eye.svg",
        statuses: ["hawk_eye"],
        usageCost: [{
            itemType: "point",
            type: "prayer",
            amount: 2
        }],
        range: "near",
        effectDescription: "RSK.HawkEye.EffectDescription",
        changes: []
    },
    {
        id: "protect_from_melee",
        label: "RSK.ProtectFromMelee",
        icon: "icons/svg/protect_from_melee.svg",
        statuses: ["protect_from_melee"],
        usageCost: [{
            itemType: "point",
            type: "prayer",
            amount: 2
        }],
        range: "near",
        effectDescription: "RSK.ProtectFromMelee.EffectDescription",
        changes: []
    },
    {
        id: "protect_from_range",
        label: "RSK.ProtectFromRange",
        icon: "icons/svg/protect_from_range.svg",
        statuses: ["protect_from_range"],
        usageCost: [{
            itemType: "point",
            type: "prayer",
            amount: 2
        }],
        range: "near",
        effectDescription: "RSK.ProtectFromRange.EffectDescription",
        changes: []
    },
    {
        id: "protect_from_magic",
        label: "RSK.ProtectFromMagic",
        icon: "icons/svg/protect_from_magic.svg",
        statuses: ["protect_from_magic"],
        usageCost: [{
            itemType: "point",
            type: "prayer",
            amount: 2
        }],
        range: "near",
        effectDescription: "RSK.ProtectFromMagic.EffectDescription",
        changes: []
    },
    {
        id: "protect_item",
        label: "RSK.ProtectItem",
        icon: "icons/svg/protect_item.svg",
        statuses: ["protect_item"],
        usageCost: [{
            itemType: "point",
            type: "prayer",
            amount: 2
        }],
        range: "near",
        effectDescription: "RSK.ProtectItem.EffectDescription",
        changes: []
    },
    {
        id: "rapid_heal",
        label: "RSK.RapidHeal",
        icon: "icons/svg/rapid_heal.svg",
        statuses: ["rapid_heal"],
        usageCost: [{
            itemType: "point",
            type: "prayer",
            amount: 2
        }],
        range: "near",
        effectDescription: "RSK.RapidHeal.EffectDescription",
        changes: []
    },
    {
        id: "redemption",
        label: "RSK.Redemption",
        icon: "icons/svg/redemption.svg",
        statuses: ["redemption"],
        usageCost: [{
            itemType: "point",
            type: "prayer",
            amount: 2
        }],
        range: "near",
        effectDescription: "RSK.Redemption.EffectDescription",
        changes: []
    },
    {
        id: "retribution",
        label: "RSK.Retribution",
        icon: "icons/svg/retribution.svg",
        statuses: ["retribution"],
        usageCost: [{
            itemType: "point",
            type: "prayer",
            amount: 2
        }],
        range: "near",
        effectDescription: "RSK.Retribution.EffectDescription",
        changes: []
    },
    {
        id: "rigour",
        label: "RSK.Rigour",
        icon: "icons/svg/rigour.svg",
        statuses: ["rigour"],
        usageCost: [{
            itemType: "point",
            type: "prayer",
            amount: 2
        }],
        range: "near",
        effectDescription: "RSK.Rigour.EffectDescription",
        changes: []
    },
    {
        id: "rock_skin",
        label: "RSK.RockSkin",
        icon: "icons/svg/rock_skin.svg",
        statuses: ["rock_skin"],
        usageCost: [{
            itemType: "point",
            type: "prayer",
            amount: 2
        }],
        range: "near",
        effectDescription: "RSK.RockSkin.EffectDescription",
        changes: []
    },
    {
        id: "sharp_eye",
        label: "RSK.SharpEye",
        icon: "icons/svg/sharp_eye.svg",
        statuses: ["sharp_eye"],
        usageCost: [{
            itemType: "point",
            type: "prayer",
            amount: 2
        }],
        range: "near",
        effectDescription: "RSK.SharpEye.EffectDescription",
        changes: []
    },
    {
        id: "steel_skin",
        label: "RSK.SteelSkin",
        icon: "icons/svg/steel_skin.svg",
        statuses: ["steel_skin"],
        usageCost: [{
            itemType: "point",
            type: "prayer",
            amount: 2
        }],
        range: "near",
        effectDescription: "RSK.SteelSkin.EffectDescription",
        changes: []
    },
    {
        id: "superhuman_strength",
        label: "RSK.SuperhumanStrength",
        icon: "icons/svg/superhuman_strength.svg",
        statuses: ["superhuman_strength"],
        usageCost: [{
            itemType: "point",
            type: "prayer",
            amount: 2
        }],
        range: "near",
        effectDescription: "RSK.SuperhumanStrength.EffectDescription",
        changes: []
    },
    {
        id: "thick_skin",
        label: "RSK.ThickSkin",
        icon: "systems/rsk/icons/svg/thick_skin.svg",
        statuses: ["thick_skin"],
        usageCost: [{
            itemType: "point",
            type: "prayer",
            amount: 2
        }],
        range: "near",
        effectDescription: "RSK.ThickSkin.EffectDescription",
        changes: []
    },
    {
        id: "ultimate_strength",
        label: "RSK.UltimateStrength",
        icon: "icons/svg/ultimate_strength.svg",
        statuses: ["ultimate_strength"],
        usageCost: [{
            itemType: "point",
            type: "prayer",
            amount: 2
        }],
        range: "near",
        effectDescription: "RSK.UltimateStrength.EffectDescription",
        changes: []
    }
];