export function customizeStatusEffects() {
    CONFIG.statusEffects = [...rskEffects];
};

//todo: need image urls
//todo: need other status we want on the token hud
export const rskEffects = [{
    "dead": {
        label: "RSK.CustomStatus.dead",
        changes: [
            {
                key: "system.skills.attributes.hp.value",
                mode: 5,
                value: "0"
            }
        ]
    }
}];