import { fields, costField } from "../fields.js";

//i'm wondering if we just want these datamodels to be their own data types
//and have the use function in another service rather than in the datamodels
// basically, a more functional command pattern, rather than inheritance.
// plus it keeps these models just data and use case specific
export default class RSKConsumable extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        return {
            description: new fields.StringField(),
            effectDescription: new fields.StringField(),
            cost: new fields.NumberField({ ...costField }),
            lifePointsRestored: new fields.NumberField({ min: 0, initial: 0, max: 300 }),
            //todo: need something like a drop down to select from available statuses to pick
            // for these lists.  
            statusesAdded: new fields.ArrayField(new fields.StringField()),
            statusesRemoved: new fields.ArrayField(new fields.StringField()),
            maxStackSize: new fields.NumberField({ initial: 3 }),
            quantity: new fields.NumberField({ initial: 1 }),
            bulk: new fields.SchemaField({
                value: new fields.NumberField({ initial: 1 }),
                modifier: new fields.NumberField({ initial: 0 })
            })
        }
    }
}