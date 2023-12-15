const changeModes = {
    ADD: 2,
    OVERRIDE: 5
}

export function customizeStatusEffects() {
    CONFIG.statusEffects = [...rskEffects];
};

//todo: need image urls
//todo: need other status we want on the token hud
export const rskEffects = [
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
    }
];