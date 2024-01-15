//todo: this may be helpful to control _id fields.
// export function getEffectId(text) {
//     return text.replace(/_/g, "").slice(0, 16).padEnd(16, "0");
// }

export const rskDefaultSummoningFamiliars = [
    {
        id: "iron_minotaur",
        label: "RSK.IronMinotaur",
        usageCost: [{
            itemType: "point",
            type: "summoning",
            amount: 2
        }],
        range: "near",
        description: "RSK.IronMinotaur.Description",
        effectDescription: "RSK.IronMinotaur.EffectDescription"
    }
];