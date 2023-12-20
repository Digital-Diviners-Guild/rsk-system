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
        icon: "icons/svg/burst_of_strength.svg",
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
        icon: "icons/svg/thick_skin.svg",
        changes: []
    },
    {
        id: "ultimate_strength",
        label: "RSK.UltimateStrength",
        icon: "icons/svg/ultimate_strength.svg",
        changes: []
    }
];

const prayerCost = {
    improved_reflexes: 2,
    incredible_reflexes: 2,
    mystic_lore: 2,
    mystic_might: 2,
    mystic_will: 2,
    piety: 2,
    augury: 2,
    burst_of_strength: 2,
    eagle_eye: 2,
    hawk_eye: 2,
    protect_from_melee: 2,
    protect_from_range: 2,
    protect_from_magic: 2,
    protect_item: 2,
    rapid_heal: 2,
    redemption: 2,
    retribution: 2,
    rigour: 2,
    rock_skin: 2,
    sharp_eye: 2,
    steel_skin: 2,
    superhuman_strength: 2,
    thick_skin: 2,
    ultimate_strength: 2,
}

export function getPrayerData(prayerId) {
    const prayerStatus = rskPrayerStatusEffects.find(p => p.id === prayerId);
    if (!prayerStatus) return {}; //todo: handle

    return {
        id: prayerStatus.id,
        label: prayerStatus.label,
        statuses: [prayerId],
        usageCost: [{
            type: "prayer",
            amount: prayerCost[prayerId]
        }],
        range: "near",
        target: {
            scope: "all",
            number: 1
        },
        effectDescription: `${prayerStatus.label}.EffectDescription`,
    }
}

export function getPrayerEffectData(prayerId, duration = {}) {
    const prayerStatus = rskPrayerStatusEffects.find(p => p.id === prayerId);
    if (!prayerId) return {}; //todo: handle

    return {
        name: prayerStatus.label,
        icon: prayerStatus.icon,
        duration: duration,
        // origin: actor.uuid,
        statuses: [prayerId]
    }
}

export function toMessageContent(prayerData, includeUseButton = true) {
    return `<p>${prayerData.label}</p>
    <p>${prayerData.effectDescription}</p>
    ${includeUseButton ? "<button class='test' type='button'>use</button>" : ""}`;
}

export function getActivePrayers(actorEffects) {
    const prayerStatuses = rskPrayerStatusEffects.map(se => se.id);
    const currentPrayers = [];
    for (const effect of actorEffects) {
        for (const status of effect.statuses) {
            if (prayerStatuses.includes(status)) {
                currentPrayers.push(effect._id);
            }
        }
    }
    return currentPrayers;
}

// temp: move experimental code here to keep character cleaner until we know what were doing with this.
// though I wonder if it should be some sorta public api into the 'prayer system' like this
// how would actually doing it this way affect permissions?
// its probably good to keep actor changes in the actor?
export async function applyPrayer(actor, prayerId) {
    const prayerData = getPrayerData(prayerId);
    if (prayerData.id != prayerId) return;

    let newPrayerPoints = actor.system.prayerPoints.value - prayerData.usageCost[0].amount;
    if (newPrayerPoints < 0) return;

    const result = await actor.useSkill("prayer", "intellect");
    actor.update({
        "system.prayerPoints.value":
            result.isSuccess
                ? newPrayerPoints
                : actor.system.prayerPoints.value - 1
    });

    //todo: put this in a template
    //todo: probably want to have the outcomes in the message with links to effects
    // that we can drag and drop to apply
    await result.rollResult.toMessage({
        flavor: `${toMessageContent(prayerData, false)}
        <p>target number: ${result.targetNumber}</p>
        <p>success: ${result.isSuccess} (${result.margin})</p>
        <p>critical: ${result.isCritical}</p>`
    });

    if (result.isSuccess) {
        //poc: targeting
        const target = getTarget(actor);
        const currentPrayers = getActivePrayers(target.effects);
        if (currentPrayers.length > 0) {
            await target.deleteEmbeddedDocuments("ActiveEffect", [...currentPrayers]);
        }
        await target.createEmbeddedDocuments("ActiveEffect", [getPrayerEffectData(prayerId)]);
    }
}

// could return outcomes to be applied later like this
export async function getPrayerOutcomes(actor, prayerId) {
    const prayerData = getPrayerData(prayerId);
    if (prayerData.id != prayerId) return [];

    let newPrayerPoints = actor.system.prayerPoints.value - prayerData.usageCost[0].amount;
    if (newPrayerPoints < 0) return [];

    const target = getTarget(actor);
    const targetNumber = actor.getRollData().calculateTargetNumber("prayer", "intellect");
    const rollResult = await game.rsk.dice.skillCheck(targetNumber);
    result = {
        roll: rollResult,
        targetNumber: targetNumber,
        outcomes: [
            {
                target,
                addedEffects: rollResult.isSuccess ? [getPrayerEffectData(prayerId)] : [],
                removedEffects: rollResult.isSuccess ? [...currentPrayers] : [],
                updates: []
            },
            {
                target: actor,
                addedEffects: [],
                removedEffects: [],
                updates: {
                    "system.skills.prayer.used": true,
                    "system.prayerPoints.value":
                        rollResult.isSuccess
                            ? newPrayerPoints
                            : actor.system.prayerPoints.value - 1
                },
            }
        ]
    }
    return result;
}
export async function applyPrayerResult(result) {
    // create a message 
    // and apply changes described in result.outcomes
}

function getTarget(actor) {
    const targets = game.users.current.targets;
    let target = actor;
    for (const t of targets) {
        target = t.actor; //todo: check for near range
    }
    return target;
}