//todo: implement special effects in the system
// then from there we can figure out how to abstract them for custom special effects
const specialEffects = {
    //on use
    rejuvenate: (outcome) => {
        // show damage slider
        // get healing/damage amount
        // return new outcome
        const newOutcome = { ...outcome };
        return newOutcome;
    },
    bleed: () => {
        // this bleed status needs more than just 'bleed'
        // we need to set a flag for the 'quality' of it.
        // we don't yet know the target, so we need a way to 
        // communicate this 'quality'
        const newOutcome = { ...outcome };
        newOutcome.addsStatuses.push("bleed");
        return newOutcome;
    },
    freeze: () => {

    },
    incendiary: () => {

    },
    knockdown: () => {

    },
    parry: () => {

    },
    pin: () => {

    },
    poison: () => {

    },
    puncture: () => {

    },
    specialTarget: () => {

    },
    spread: () => {

    },
    stun: () => {

    },
    swift: () => {

    },
    //on equip
    //
    boost: () => {
        //this could be handled through active effect
        // but needs the 'x' in order to set the boost amount
        // and activates on equip
        // so does this handler create an active effect with the x value on equip
        // then delete it on unequip?

        // another option, on create, special effect with non usage can be made into active effects on the item during creation?
    },
    reach: () => {
        //same? but might actually be ok to implement through usage
        // it only matters when you succeed, though it does mean it is possible to succeed and not have reach
        // if it is handled through 'usage' so that is important to figure out.
    },
}

export const getSpecialEffectHandler = (name) => {
    return specialEffects[name] || (() => { })
}