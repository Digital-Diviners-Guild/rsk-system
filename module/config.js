const RSK = {};

RSK.sizes = {
    tiny: "RSK.Tiny",
    small: "RSK.Small",
    medium: "RSK.Medium",
    large: "RSK.Large",
    giant: "RSK.Giant",
    colossal: "RSK.Colossal"
};

RSK.sizeModifiers = {
    tiny: { attack: -1, defense: 2 },
    small: { attack: 0, defense: 0 },
    medium: { attack: 0, defense: 0 },
    large: { attack: 1, defense: -1 },
    giant: { attack: 2, defense: -1 },
    colossal: { attack: 4, defense: -3 }
};

RSK.ammunitionType = {
    arrow: "Arrow",
    bolt: "Bolt",
    dart: "Dart"
}

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

RSK.pointCostType = {
    prayerPoints: "RSK.PrayerPoints",
    summoningPoints: "RSK.SummoningPoints"
}

RSK.usageCostTypes = {
    ...RSK.ammunitionType,
    ...RSK.runeType,
    ...RSK.pointCostType
}

RSK.spellTypes = {
    combat: "RSK.Combat",
    utility: "RSK.Utility",
    teleport: "RSK.Teleport"
};

//todo: may need to instead be something like: magic, range, melee, other
// this info is usually important for protection prayers that need to know if the attack is magic or not
//todo: not sure if we need this anymore?
RSK.actionTypes = {
    action: "RSK.Action",
    spell: "RSK.Spell",
    prayer: "RSK.Prayer",
    summoning: "RSK.SummonFamiliar"
};

RSK.ranges = {
    near: "RSK.Near",
    far: "RSK.Far",
    distant: "RSK.Distant",
};

RSK.activeSlotType = {
    head: "RSK.Head",
    body: "RSK.Body",
    legs: "RSK.Legs",
    arm: "RSK.Arm",
    weapon: "RSK.Weapon",
    cape: "RSK.Cape",
};

RSK.weaponActiveSlotType = {
    ...Object.keys(RSK.activeSlotType)
        .filter(k => k === "weapon" || k === "arm")
        .reduce((ks, k) => { ks[k] = RSK.activeSlotType[k]; return ks }, {})
}

RSK.armourActiveSlotType = {
    ...Object.keys(RSK.activeSlotType)
        .filter(k => k !== "weapon")
        .reduce((ks, k) => { ks[k] = RSK.activeSlotType[k]; return ks }, {})
};

RSK.woodMaterials = {
    wood: "RSK.Wood",
    oak: "RSK.Oak",
    willow: "RSK.Willow",
    maple: "RSK.Maple",
    yew: "RSK.Yew",
    magic: "RSK.Magic"
}

RSK.metalMaterials = {
    bronze: "RSK.Bronze",
    iron: "RSK.Iron",
    steel: "RSK.Steel",
    mithril: "RSK.Mithril",
    adamant: "RSK.Adamant",
    rune: "RSK.Rune",
}

RSK.clothMaterials = {
    cloth: "RSK.Cloth",
    leather: "RSK.Leather",
    green_dragonhide: "RSK.Green_Dragonhide",
    blue_dragonhide: "RSK.Blue_Dragonhide",
    red_dragonhide: "RSK.Red_Dragonhide",
    black_dragonhide: "RSK.Black_Dragonhide"
}

RSK.materials = {
    ...woodMaterials,
    ...metalMaterials,
    ...clothMaterials
}

RSK.weaponMaterials = {
    ...woodMaterials,
    ...metalMaterials
}

RSK.armourMaterials = {
    ...clothMaterials,
    ...metalMaterials
}

RSK.skills = {
    archaeology: "RSK.Archaeology",
    attack: "RSK.Attack",
    cooking: "RSK.Cooking",
    crafting: "RSK.Crafting",
    defense: "RSK.Defense",
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

RSK.physicalDamageTypes = {
    stab: "RSK.Stab",
    slash: "RSK.Slash",
    crush: "RSK.Crush"
}

RSK.elementalDamageTypes = {
    air: "RSK.Air",
    water: "RSK.Water",
    earth: "RSK.Earth",
    fire: "RSK.Fire",
}

RSK.damageTypes = {
    ...RSK.physicalDamageTypes,
    ...RSK.elementalDamageTypes,
}

export default RSK;