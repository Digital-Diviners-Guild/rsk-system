const RSK = {};

RSK.sizes = {
    small: "RSK.Small",
    medium: "RSK.Medium",
    large: "RSK.Large",
};

RSK.runeType = {
    air: "RSK.AirRune",
    water: "RSK.WaterRune",
    earth: "RSK.EarthRune",
    fire: "RSK.FireRune",
    chaos: "RSK.ChaosRune",
    mind: "RSK.MindRune",
    body: "RSK.BodyRune",
    soul: "RSK.SoulRune",
    death: "RSK.DeathRune",
    blood: "RSK.BloodRune",
    cosmic: "RSK.CosmicRune",
    nature: "RSK.NatureRune",
    law: "RSK.LawRune",
    wrath: "RSK.WrathRune",
}

RSK.spellTypes = {
    combat: "RSK.Combat",
    utility: "RSK.Utility",
    teleport: "RSK.Teleport"
};

RSK.ranges = {
    near: "RSK.Near",
    far: "RSK.Far",
    distant: "RSK.Distant",
};

RSK.armourTypes = {
    head: "RSK.Head",
    body: "RSK.Body",
    legs: "RSK.Legs",
    arm: "RSK.Arm"
};

RSK.materials = {
    cloth: "RSK.Cloth",
    leather: "RSK.Leather",
    bronze: "RSK.Bronze",
    iron: "RSK.Iron",
    steel: "RSK.Steel",
    mithril: "RSK.Mithril",
    adamant: "RSK.Adamant",
    rune: "RSK.Rune",
    green_dragonhide: "RSK.Green_Dragonhide",
    blue_dragonhide: "RSK.Blue_Dragonhide",
    red_dragonhide: "RSK.Red_Dragonhide",
    black_dragonhide: "RSK.Black_Dragonhide"
}

RSK.skills = {
    archaelogy: "RSK.Archaelogy",
    attack: "RSK.Attack",
    cooking: "RSK.Cooking",
    crafting: "RSK.Crafting",
    defence: "RSK.Defence",
    dungeoneering: "RSK.Dungeoneering",
    farming: "RSK.Farming",
    fishing: "RSK.Fishing",
    fletching: "RSK.Fletching",
    herblore: "RSK.Herblore",
    hunter: "RSK.Hunter",
    magic: "RSK.Magic",
    mining: "RSK.Mining",
    prayer: "RSK.Prayer",
    ranged: "RSK.Ranged",
    runecrafting: "RSK.Runecrafting",
    slayer: "RSK.Slayer",
    smithing: "RSK.Smithing",
    summoning: "RSK.Summoning",
    thieving: "RSK.Thieving",
    woodcutting: "RSK.Woodcutting"
};

RSK.abilities = {
    strength: "RSK.Strength",
    agility: "RSK.Agility",
    intellect: "RSK.Intellect"
}

RSK.damageTypes = {
    stab: "RSK.Stab",
    slash: "RSK.Slash",
    crush: "RSK.Crush",
    air: "RSK.Air",
    water: "RSK.Water",
    earth: "RSK.Earth",
    fire: "RSK.Fire",
}

//all characters have all the prayers and spells
// shouldn't need to be added to the character one at a time.
// perhaps these should just be predefined objects?
// is this how we want to detail default spell/prayer books?
RSK.defaultSpells = {
    confuse: {
        type: "utility",
        label: "RSK.Confuse",
        statuses: ["confused"]
    },
    air_bolt: {
        type: "combat",
        label: "RSK.AirBolt",
        statuses: [],
        cost: [{
            type: "air",
            value: 1
        }],
        damage: [{
            type: "air",
            value: 5
        }]
    },
    teleport: {
        type: "teleport",
        label: "RSK.Teleport",
        statuses: []
    }
}

RSK.defaultPrayers = {
    augury: {
        label: "RSK.Augury",
        statuses: ["augury"]
    },
    burst_of_strength: {
        label: "RSK.BurstOfStrength",
        statuses: ["burst_of_strength"]
    },
    eagle_eye: {
        label: "RSK.EagleEye",
        statuses: ["eagle_eye"]
    },
}

export default RSK;