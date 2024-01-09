import { changeModes } from "./effects/statuses.js";

// start modeling a few qualities in memory so we can test out the mechanics

//sample of weapon qualities
export const bleed = {};
export const puncture = {};
export const boost = {};
export const reach = {};
export const rejuvenation = {};
export const specialTarget = {};
export const swift = {}; // this might just be a chatted thing for now, it requires more precise combat/turn tracking.

//sample of armour qualities
export const block = {
    id: "block", // do we want to start calling these things slugs not id, and should we control _id's?
    condition: "equipped", // signal to check that the item with the quality is equipped.
    // do we want a blocking status?
    effects: [{
        changes: [
            {
                key: "flags.rsk.bonusArmourSoak", // how do we want to communicate this effect?
                mode: changeModes.ADD,
                value: 1 // this number comes from the tier of the effect (ie Block 1, Block 3, etc...)
            }
        ]
    }]
};

export const heavy = {
    id: "heavy", // do we want to start calling these things slugs not id, and should we control _id's?
    condition: "static", // quality is always applicable
    // I think effects may apply to actor? but heavy only applies to the item
    // wonder how we can handle that
};
export const retaliate = {
    id: "steadfast", // do we want to start calling these things slugs not id, and should we control _id's?
    // this is actually when the enemy misses an attack? but I'm not sure what that means, is that a critical success on defense?
    condition: "critical_success", // signal to check that the defense check was successful.
    effects: [{
        changes: [
            {
                key: "flags.rsk.damageReflection", // ??? though it is damage type specific
                mode: changeModes.ADD,
                value: 1 // also comes from tier of effect
            }
        ]
    }],
    // do we need an object like this, or use flags?
    damageReflection: {

    }
};
export const resilience = {
    id: "steadfast", // do we want to start calling these things slugs not id, and should we control _id's?
    condition: "success", // signal to check that the defense check was successful.
    effects: [{
        changes: [
            {
                key: "flags.rsk.damageResilience", // ???  though it is damage type specific
                mode: changeModes.ADD,
                value: 1 // also comes from tier of effect
            }
        ]
    }],
    // do we need an object like this, or use flags?
    damageResilience: {
        air: 2,
        magic: 1
    }
};
export const steadfast = {
    id: "steadfast", // do we want to start calling these things slugs not id, and should we control _id's?
    condition: "success", // signal to check that the defense check was successful.
    effects: [{
        changes: [
            {
                // not actually sure how this would work with arrays
                key: "flags.rsk.immuneToStatuses", // ??? though it is damage type specific
                mode: changeModes.OVERRIDE, // what if several things want to add to this array?
                value: ["knockdown"] // also comes from tier of effect
            }
        ]
    }],
    // or something like this?
    immuneToStatuses: ["knockdown"]
};
// does the character model need an object to hold on to 'active qualities, and the changes made by them?'
// maybe flags will work 