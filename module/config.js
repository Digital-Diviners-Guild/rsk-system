import { rskMagicStatusEffects, rskPrayerStatusEffects, rskStatusEffects } from "./effects/statuses.js";

const RSK = {};

RSK.statusEffects = {
    ...rskStatusEffects.reduce((es, e) => {
        es[e.id] = e.label
        return es;
    }, {}),
    ...rskMagicStatusEffects.reduce((es, e) => {
        es[e.id] = e.label
        return es;
    }, {}),
    ...rskPrayerStatusEffects.reduce((es, e) => {
        es[e.id] = e.label
        return es;
    }, {})
};

RSK.runeType = {
    none: "",
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
};

RSK.itemCategories = {
    item: "RSK.Item",
    rune: "RSK.Rune",
    resource: "RSK.Resource",
    equipment: "RSK.Equipment",
    material: "RSK.Material"
};

RSK.consumableCategories = {
    food: "RSK.Food",
    potion: "RSK.Potion"
};

RSK.rawMaterialType = {
    none: "",
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
};

RSK.resourceType = {
    none: "",
    metal: "RSK.Metal",
    glass: "RSK.Glass",
    mineral: "RSK.Mineral",
    cloth: "RSK.Cloth",
    leather: "RSK.Leather"
};

RSK.itemSubCategories = {
    none: "",
    ...RSK.runeType,
    ...RSK.rawMaterialType,
    ...RSK.resourceType,
};

RSK.spellTypes = {
    none: "",
    combat: "RSK.Combat",
    utility: "RSK.Utility",
    teleport: "RSK.Teleport"
};

RSK.castableCategories = {
    magic: "RSK.Magic",
    prayer: "RSK.Prayer",
    summoning: "RSK.Summoning"
};

RSK.ammunitionType = {
    none: "",
    arrow: "Arrow",
    bolt: "Bolt",
    dart: "Dart"
}

RSK.defaultWeapon = {
    isEquipped: true,
    category: "melee",
    subCategory: "simple",
    targetOutcome: { damageEntries: { crush: 1 } }
};

RSK.weaponSpecialEffects = {
    none: "",
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

RSK.specialEffects = {
    none: "",
    ...RSK.weaponSpecialEffects
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
    typeless: "RSK.Typeless",
    puncture: "RSK.Puncture",
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

RSK.usageCostResources = {
    none: "",
    ...RSK.pointCostType,
    ...RSK.ammunitionType,
    ...RSK.runeType
}

RSK.pointCostType = {
    prayerPoints: "RSK.PrayerPoints",
    summoningPoints: "RSK.SummoningPoints"
}

RSK.castableUsageCosts = {
    none: "",
    ...RSK.pointCostType,
    ...RSK.runeType
}

RSK.usageCostTypes = {
    ...RSK.ammunitionType,
    ...RSK.runeType,
    ...RSK.pointCostType
}

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
    magic: "RSK.Magic",
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
        ammo: "RSK.Ammo",
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
    none: "",
    simple: "RSK.Simple",
    martial: "RSK.Martial",
    unique: "RSK.Unique",
    ...RSK.ammunitionType
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
    none: "",
    ...RSK.woodType,
    ...RSK.mineralType
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
    none: "",
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

RSK.itemMaterial = {
    ...RSK.woodType,
    ...RSK.metalType,
    cloth: "RSK.Cloth",
    ...RSK.leatherType,
};

export default RSK;