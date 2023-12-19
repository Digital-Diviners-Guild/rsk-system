import { rskPrayerStatusEffects } from "../rsk-prayer.js";

const changeModes = {
    ADD: 2,
    OVERRIDE: 5
};

export function customizeStatusEffects() {
    CONFIG.statusEffects = [...rskStatusEffects, ...rskMagicStatusEffects, ...rskPrayerStatusEffects];
    console.log(CONFIG.statusEffects);
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