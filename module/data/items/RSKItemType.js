import { fields } from "../fields.js";
import { uiService } from "../../rsk-ui-service.js";

export default class RSKItemType extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        return {
            // is material something more? like magic log, redwood log? skin > green_dragonhide?  like a type and tier values?
            category: new fields.StringField(), // rune | weapon | spell
            subCategory: new fields.StringField(), // air | sword | utility
            material: new fields.StringField(),
            cost: new fields.NumberField({ initial: 0, min: 0 }),
            uses: new fields.StringField(),
            location: new fields.StringField(),
            upgrades: new fields.StringField(), // perhaps an object with details about the upgrade?
            description: new fields.StringField(),
            effectDescription: new fields.StringField(),
            awardedFor: new fields.StringField(),
            requiredMaterials: new fields.StringField(), //eventually this will need to be more
            equipmentNeeded: new fields.StringField(),
            targetNumberModifier: new fields.NumberField(),
            qualities: new fields.StringField(), // todo: use new model
            // qualities: new fields.ArrayField(
            //     new fields.SchemaField({
            //         name: new fields.StringField(),
            //         type: new fields.StringField(),
            //         x: new fields.StringField(),
            //         y: new fields.StringField()
            //     })
            // ),
            soakValue: new fields.NumberField(),
            usageCost: new fields.ArrayField(
                new fields.SchemaField({
                    type: new fields.StringField(),
                    amount: new fields.NumberField()
                })),
            //todo: do we want 'damage entries' or should we render that out of the targetOutcomes with 'recieve dmage'
            targetOutcomes: new fields.ArrayField(new fields.ObjectField()),
            usageOutcomes: new fields.ArrayField(new fields.ObjectField()),
            //todo: new target model to help with targetting rules
            // target: new fields.SchemaField({
            //     range: new fields.StringField({
            //         initial: "near",
            //         choices: [...Object.keys(CONFIG.RSK.ranges)]
            //     }),
            //     type: new fields.StringField(),
            //     amount: new fields.NumberField()
            // }),

            range: new fields.StringField({
                required: true,
                initial: "near",
                choices: [...Object.keys(CONFIG.RSK.ranges)]
            }),

            // what types of stuff could we utilize flags for?
            // would quantity/bulk/equipped perhaps fit there?
            // or would we want them on the schema?
            maxStackSize: new fields.NumberField({ initial: 3, min: 1 }),
            quantity: new fields.NumberField({ initial: 1 }),
            bulk: new fields.SchemaField({
                value: new fields.NumberField({ initial: 1, min: 1 }),
                modifier: new fields.NumberField()
            }),

            //todo: do these really need to be on the base item
            activeSlot: new fields.StringField({
                required: false,
                choices: [...Object.keys(CONFIG.RSK.activeSlotType)]
            }),
            equippedInSlot: new fields.StringField(),
            isTwoHanded: new fields.BooleanField({ initial: false }),
            isEquipped: new fields.BooleanField({ initial: false }),
        };
    }

    //todo: if we have canUse based on if there are outcomes
    // then a use that sends the outcomes what do we need the other types for?
    // weapon - can use is only when equipped
    // armour - only applies when equipped
    // anything else?

    //todo: implement in subtype - weapons would check it is equipped
    canUse() {
        return false;
    }

    //usage 
    // get rollData and TargetNumberModifier
    // confirm roll
    // roll 
    // handle usage cost if any
    // send chat with outcomes

    async use() {
        const rollData = this._prepareRollData();
        const confirmRollResult = await uiService.showDialog("confirm-roll", rollData);
        if (!confirmRollResult.confirmed) return false;
        const skillResult = await this.parent.actor.system.useSkill(confirmRollResult);
        this._handleUsageCost(skillResult);
        const actionOutcome = this._prepareOutcomeData();
        const flavor = await renderTemplate("systems/rsk/templates/applications/action-message.hbs",
            {
                ...skillResult,
                ...actionOutcome
            });
        await skillResult.toMessage({
            flavor: flavor,
            flags: {
                rsk: {
                    ...skillResult,
                    ...actionOutcome
                }
            }
        });
    }

    _handleUsageCost(skillResult) {
        // spend resources
        // consume conumables
        // deduct ammo
        //etc (these are the 'usage' statechanges)
    }

    //todo: implement in subtype
    _prepareRollData() {
        return {
            ...this.parent.actor.system.getRollData(),
            targetNumberModifier: this.targetNumberModifier
        };
    }

    _prepareOutcomeData() {
        //todo: in subtypes this is where we may 'merge' outcomes
        // like with range weapon and ammo
        return {
            name: this.parent.name,
            description: this.effectDescription,
            img: this.parent.img,
        };
    }
}

//todo: put this stuff somewhere
// apply outcome
// gather targets
// apply target outcomes
export const applyOutcome2 = async (actionData) => {
    const isGM = game.user?.isGM;
    const targets = isGM
        ? [...game.user.targets.map(t => t.actor)]
        : [game.user.character];
    for (let target of targets) {
        await applyStateChanges2(target, actionData.outcomes);
    }
}

const restoreLifePoints = (actor, context) => {
    actor.system.restoreLifePoints(context.amount);
}

const receiveDamage = async (actor, context) => {
    await actor.system.receiveDamage({ damageEntries: context.damage });
};

const operations = {
    restoreLifePoints,
    receiveDamage,
};

export const applyStateChanges2 = async (actor, stateChanges) => {
    for (let stateChange of stateChanges) {
        const operationFunc = operations[stateChange.operation];
        if (operationFunc) {
            await operationFunc(actor, { ...stateChange.context });
        } else {
            console.error(`Unknown operation: ${stateChange.operation}`);
        }
    }
};