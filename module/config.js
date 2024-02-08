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

RSK.actionTypes = {
    magic: "RSK.Magic",
    melee: "RSK.Melee",
    ranged: "RSK.Ranged"
};

RSK.codexTypes = {
    npcAction: "RSK.NpcAction",
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


RSK.rawMaterialType = {
    wood: "RSK.Wood",
    fish: "RSK.Fish",
    rawMeat: "RSK.RawMeat",
    skin: "RSK.Skin",
    feathers: "RSK.Feathers",
    mineral: "RSK.Mineral",
    seed: "RSK.Seed",
    produce: "RSK.Produce",
    herb: "RSK.Herb",
    water: "RSK.Water",
    blood: "RSK.Blood"
}

RSK.woodType = {
    wood: "RSK.Wood",
    oak: "RSK.Oak",
    willow: "RSK.Willow",
    maple: "RSK.Maple",
    yew: "RSK.Yew",
    redwood: "RSK.RedWood",
    magic: "RSK.Magic",
}

RSK.mineralType = {
    tin: "RSK.TinOre",
    copper: "RSK.CopperOre",
    iron: "RSK.IronOre",
    silver: "RSK.SilverOre",
    coal: "RSK.Coal",
    gold: "RSK.GoldOre",
    mithril: "RSK.MithrilOre",
    adamant: "RSK.AdamantOre",
    rune: "RSK.RuniteOre",
    clay: "RSK.Clay",
    sand: "RSK.Sand"
}

RSK.materialTier = {
    ...RSK.woodType,
    ...RSK.mineralType
}

RSK.resourceType = {
    metal: "RSK.Metal",
    glass: "RSK.Glass",
    mineral: "RSK.Mineral",
    food: "RSK.Food",
    potion: "RSK.Potion",
    cloth: "RSK.Cloth",
    leather: "RSK.Leather"
}

RSK.leatherType = {
    leather: "RSK.Leather",
    green_dragonhide: "RSK.Green_Dragonhide",
    blue_dragonhide: "RSK.Blue_Dragonhide",
    red_dragonhide: "RSK.Red_Dragonhide",
    black_dragonhide: "RSK.Black_Dragonhide"
}

RSK.metalType = {
    bronze: "RSK.Bronze",
    iron: "RSK.Iron",
    steel: "RSK.Steel",
    mithril: "RSK.Mithril",
    adamant: "RSK.Adamant",
    runite: "RSK.Runite",
}

RSK.resourceTier = {
    ...RSK.leatherType,
    ...RSK.metalType
}

// maybe other things like bone?
// dragon? what material is dargon?
// we need dragon material somewhere!!!
RSK.ammunitionMaterialType = {
    ...RSK.metalType
}

RSK.tierOption = {
    wood: { ...RSK.woodType },
    mineral: { ...RSK.mineralType },
    leather: { ...RSK.leatherType },
    metal: { ...RSK.metalType },
}

RSK.weaponTypes = {
    simple: "RSK.Simple",
    martial: "RSK.Martial",
    unique: "RSK.Unique"
}

RSK.materials = {
    ...RSK.woodType,
    ...RSK.metalType,
    ...RSK.leatherType
}

RSK.weaponMaterials = {
    ...RSK.woodType,
    ...RSK.metalType
}

RSK.armourMaterials = {
    cloth: "RSK.Cloth",
    ...RSK.leatherType,
    ...RSK.metalType
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