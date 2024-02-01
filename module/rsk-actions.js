// spell, prayer data models, like a weapon
// actions could be separate and require the spell/prayer/weapon as an argument to create the action during data prep?
// this might work out better than modeling the prayer/spells as actions
// will this require a separate 'npc action' model then? maybe not, though npc actions are a little different.

/*
models:
spell  
prayer 
summon/familiar 
weapon 

actions:
pray (prayer)
cast (spell)
meleeAttack (weapon)
rangedAttack (weapon, ammo)
summonFamiliar (familiar)
*/

async function useAction(actor, action) {
    switch (action.type) {
        case "prayer":
            return await pray(actor, action);
        case "magic":
            return await cast(actor, action);
        case "ranged":
            return await rangedAttack(actor, action);
        case "melee":
            return await meleeAttack(actor, action);
        default:
            throw `Unknown action type: ${action.type}`;
    }
}

async function pray(actor, action) {
}

async function cast(actor, action) {
}

async function meleeAttack(actor, action) {
}

async function rangedAttack(actor, action) {
}