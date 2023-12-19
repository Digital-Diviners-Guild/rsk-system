// export function getEffectId(text) {
//     return text.replace(/_/g, "").slice(0, 16).padEnd(16, "0");
// }

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

export function prayerEffect(prayerId, duration = {}) {
    const prayerStatus = rskPrayerStatusEffects.find(p => p.id === prayerId);
    if (!prayerId) return {};
    return {
        name: prayerStatus.label,
        icon: prayerStatus.icon,
        duration: duration,
        // origin: actor.uuid,
        statuses: [prayerId]
    }
}

export function activePrayers(actor) {
    const prayerStatuses = rskPrayerStatusEffects.map(se => se.id);
    const currentPrayers = actor.effects
        .filter(e => e.statuses.filter(s => prayerStatuses.includes(s)).size > 0)
        .map(e => e._id);
    return currentPrayers;
}