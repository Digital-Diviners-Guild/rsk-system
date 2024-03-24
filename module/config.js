const RSK = {};

RSK.defaultWeapon = {
    isEquipped: true,
    weaponType: "simple",
    attackType: "melee",
    attackMethods: ["melee"],
    targetOutcome: { damage: { crush: 1 } }
};

RSK.weaponSpecialEffects = {
    rejuvenate: "RSK.Rejuvenate",
    bleed: "RSK.Bleed",
    freeze: "RSK.Freeze",
    incendiary: "RSK.Incendiary",
    knockdown: "RSK.Knockdown",
    parry: "RSK.Parry",
    pin: "RSK.Pin",
    poison: "RSK.Poison",
    puncture: "RSK.Puncture",
    stun: "RSK.Stun",
    swift: "RSK.Swift",
    specialTarget: "RSK.Specialtarget",
    spread: "RSK.Spread",
    boost: "RSK.Boost",
    reach: "RSK.Reach",
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
    hunting: "RSK.Hunting",
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

// todo: we need to add the attack/defense modifiers
// not actually clear on how they should be applied yet.
RSK.size = {
    tiny: {
        label: "RSK.Tiny",
        modifier: { attack: -1, defense: 2 }
    },
    small: {
        label: "RSK.Small",
        modifier: { attack: 0, defense: 0 }
    },
    medium: {
        label: "RSK.Medium",
        modifier: { attack: 0, defense: 0 }
    },
    large: {
        label: "RSK.Large",
        modifier: { attack: 1, defense: -1 }
    },
    giant: {
        label: "RSK.Giant",
        modifier: { attack: 2, defense: -1 }
    },
    colossal: {
        label: "RSK.Colossal",
        modifier: { attack: 4, defense: -3 }
    },
}

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

RSK.usageCostResources = {
    summoningPoints: "RSK.SummoningPoints",
    prayerPoints: "RSK.PrayerPoints",
    ...RSK.ammunitionType,
    ...RSK.runeType
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

//todo: we were thinking of having a 'thrown' action type for
// weapons, but when used, it still needs to actually be of type "Ranged". thrown is "Ranged"
RSK.attackType = {
    magic: "RSK.Magic",
    melee: "RSK.Melee",
    ranged: "RSK.Ranged"
};

RSK.attackMethods = {
    melee: "RSK.Melee",
    ranged: "RSK.Ranged",
    thrown: "RSK.Thrown",
    ammo: "RSK.Ammo"
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
    label: "RSK.WeaponActiveSlotTypes",
    values: {
        ...Object.keys(RSK.activeSlotType)
            .filter(k => k === "weapon" || k === "arm")
            .reduce((ks, k) => { ks[k] = RSK.activeSlotType[k]; return ks }, {})
    }
}

RSK.armourActiveSlotType = {
    label: "RSK.AmourActiveSlotTypes",
    values: {
        ...Object.keys(RSK.activeSlotType)
            .filter(k => k !== "weapon")
            .reduce((ks, k) => { ks[k] = RSK.activeSlotType[k]; return ks }, {})
    }
};

RSK.weaponTypes = {
    simple: "RSK.Simple",
    martial: "RSK.Martial",
    unique: "RSK.Unique"
}

//todo: keep exploring these - ie try and use it somewhere
// may need to create funcs to select out of it
// or sub objects thae ...{} out of it to create 
// more helpful objects for the codes.
RSK.material = {
    organic: {
        refined: {
            food: "RSK.Food",
            potion: "RSK.Potion",
        },
        unrefined: {
            wood: {
                ...RSK.woodType
            },
            produce: "RSK.Produce",
            fish: "RSK.Fish",
            rawMeat: "RSK.RawMeat",
            skin: "RSK.Skin",
            feathers: "RSK.Feathers",
            herb: "RSK.Herb",
            water: "RSK.Water",
            blood: "RSK.Blood",
            seed: "RSK.Seed",
        }
    },
    inorganic: {
        refined: {
            metal: {
                ...RSK.metalType
            },
            glass: "RSK.Glass",
            cloth: "RSK.Cloth",
            leather: {
                ...RSK.leatherType
            }
        },
        unrefined: {
            mineral: {
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
        }
    }
}


//todo: are these type of lists actually more convinient to work with than the master list?
// the below lines are the old lists
// we need to decide if this is the approach we want to go, or move these values
// into the above 'master' map, that we can create selector funcs for like with activeArmourSlots
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

RSK.resource = {
    metal: "RSK.Metal",
    glass: "RSK.Glass",
    mineral: "RSK.Mineral",
    //todo: there is a mix up with 'mats' 'resource', 'consumable'
    // we need to refactor our item models, ultimately we have 
    // things that can be used/consumed, things that are used to make/aquire things.
    // ie raw food  => food  => eat. / ore => bar => weapon. etc.
    // ie need a fishing pole to catch fish, but the pole doesn't really do anything.
    // i'm not sure if we need all the types we have, or if it would be better to 
    // categorize them differently. I think using our 'serialized actions' will help
    // categorize by purpose a little better, rather than a model for each thing.
    //food: "RSK.Food",
    //potion: "RSK.Potion",
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

RSK.weaponMaterials = {
    ...RSK.woodType,
    ...RSK.metalType
}

RSK.armourMaterials = {
    cloth: "RSK.Cloth",
    ...RSK.leatherType,
    ...RSK.metalType
}

export default RSK;