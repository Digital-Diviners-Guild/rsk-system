import { rskMagicStatusEffects } from "../rsk-magic.js";

export const changeModes = {
    ADD: 2,
    OVERRIDE: 5
};

export function customizeStatusEffects() {
    const rskPrayerStatusEffects = CONFIG.RSK.defaultPrayers.map(p => p.id);
    CONFIG.statusEffects = [...rskStatusEffects, ...rskMagicStatusEffects, ...rskPrayerStatusEffects];
};

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

export function statusToEffect(status, duration) {
    return {
        name: status.label,
        icon: status.icon,
        duration: duration,
        statuses: [status.id]
    }
}