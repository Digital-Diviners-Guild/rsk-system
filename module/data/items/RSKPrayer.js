import RSKAction from "./RSKAction.js";

//i'm wondering if we just want these datamodels to be their own data types
//and have the use function in another service rather than in the datamodels
// basically, a more functional command pattern, rather than inheritance.
// plus it keeps these models just data and use case specific
export default class RSKPrayer extends RSKAction {
    //todo: when we apply the result
    // how do we want to handle usage requiring a skill check?

    canUse(actor) {
        return actor.system.prayerPoints.value >= (this.usageCost.values[0] || 0);
    }

    static fromData(prayerData) {
        const prayer = new this({ ...prayerData });
        prayer._id = prayerData.id;
        return prayer;
    }
}