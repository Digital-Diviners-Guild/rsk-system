// export function getEffectId(text) {
//     return text.replace(/_/g, "").slice(0, 16).padEnd(16, "0");
// }

import RSKConfirmRollDialog from "./applications/RSKConfirmRollDialog.js";

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

export const standardPrayerCosts = {
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

// the biggest problem so far, is this doesn't support custom prayers
// that is probably ok for now until we get things working how we want with standard prayers
// but, if there is no status effect with the prayer id, should we look at the actors 'prayers'
// to see if there is custom prayer data?
export function getPrayerData(prayerId) {
    const prayerStatus = rskPrayerStatusEffects.find(p => p.id === prayerId);
    if (!prayerStatus) return {}; //todo: handle

    return {
        id: prayerStatus.id,
        label: prayerStatus.label,
        statuses: [prayerId],
        usageCost: [{
            type: "prayer",
            amount: standardPrayerCosts[prayerId]
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

export async function pray(actor, prayerId) {
    const prayerData = getPrayerData(prayerId);
    const cost = prayerData.usageCost[0]?.amount ?? 0;
    if (prayerData.id != prayerId
        || !canPray(actor, cost)) return {};

    const result = await usePrayer(actor, cost);
    //return result or chat it?
    // the chat needs to be in a template or reusable function
    // we will need this flavor for all actions
    await result.rollResult.toMessage({
        flavor: `${toMessageContent(prayerData)}
        <p>TN: ${result.targetNumber} | ${result.isCritical ? "<em>critical</em>" : ""} ${result.isSuccess ? "success" : "fail"} (${result.margin})</p>
        <button class='test'>apply</button>`,
        flags: {
            rsk: {
                outcome: {
                    actorId: actor._id,
                    type: "prayer",
                    addedEffects: result.isSuccess ? [getPrayerEffectData(prayerId)] : [],
                    removedEffects: [],
                    damageEntries: {},
                    actorUpdates: {}
                }
            }
        }
    });
    return result;
}

function canPray(actor, prayerPoints) {
    return actor.system.prayerPoints.value >= prayerPoints;
}

async function usePrayer(actor, prayerPoints) {
    const rollData = actor.getRollData();
    const dialog = RSKConfirmRollDialog.create(rollData, { defaultSkill: "prayer", defaultAbility: "intellect" });
    const rollOptions = await dialog();
    if (!rollOptions.rolled) return {}

    const result = await actor.useSkill(rollOptions.skill, rollOptions.ability);
    const cost = result.isSuccess
        ? prayerPoints
        : 1
    actor.update({ "system.prayerPoints.value": actor.system.prayerPoints.value - cost });
    return result;
}

// could probably utilize some methods on the character actor
// like activate prayer which can encapsulate the toggle
export async function applyPrayer(outcome) {
    const actor = Actor.get(outcome.actorId);
    const target = getTarget(actor);
    if (outcome.addedEffects.length > 0) {
        await target.deleteEmbeddedDocuments("ActiveEffect", getActivePrayers(target.effects))
        await target.createEmbeddedDocuments("ActiveEffect", outcome.addedEffects);
    }
    if (outcome.removedEffects.length > 0) {
        await target.deleteEmbeddedDocuments("ActiveEffect", outcome.removedEffects);
    }
    if (Object.keys(outcome.actorUpdates).length > 0) {
        target.update(outcome.actorUpdates);
    }
}

function getTarget(actor) {
    const targets = game.users.current.targets;
    let target = actor;

    for (const t of targets) {
        //--- should we default to self target, or throw since we cannot do what they wanted?
        //if we go with the updated outcome that doesn't yet have targets assigned, then this logic
        //would need to be where ever we are handling the outcome.
        //though, how does this work for usage? we don't want to take the resources if no targets where in range
        //maybe we can just have an outcome undo and the player should be aware of if they have a target in range or not?
        //if (isInRange(actor.sheet.token, t, range)) {
        target = t.actor;
        //}
    }
    return target;
}

function toMessageContent(actionData) {
    return `<p>${actionData.label}</p>
    <p>${actionData.effectDescription}</p>`;
}