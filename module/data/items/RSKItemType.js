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
            soakValue: new fields.NumberField(),
            usageCost: new fields.ArrayField(
                new fields.SchemaField({
                    type: new fields.StringField(),
                    amount: new fields.NumberField()
                })),
            usageOutcome: new fields.SchemaField({
                damageEntries: new fields.ObjectField(),
                restoresLifePoints: new fields.NumberField({ min: 0 }),
                statusesAdded: new fields.ArrayField(new fields.ObjectField()),
                effectsAdded: new fields.ArrayField(new fields.ObjectField()),
                statusesRemoved: new fields.ArrayField(new fields.StringField()),
            }),
            targetOutcome: new fields.SchemaField({
                damageEntries: new fields.ObjectField(),
                restoresLifePoints: new fields.NumberField({ min: 0 }),
                statusesAdded: new fields.ArrayField(new fields.ObjectField()),
                effectsAdded: new fields.ArrayField(new fields.ObjectField()),
                statusesRemoved: new fields.ArrayField(new fields.StringField()),
            }),
            // do we need something like this?
            // or should we just have them pre implemented and use a drop down?
            // this would allow for homebrew though
            specialEffect: new fields.ArrayField(new fields.SchemaField({
                name: new fields.StringField(),
                x: new fields.StringField(),
                y: new fields.StringField(),
                // condition: new fields.StringField(),
                //marginThreshold: new fields.NumberField({ initial: 1, min: 0 })
                // type: new fields.StringField(),
                // marginThreshold: new fields.NumberField({ initial: 1, min: 0 }),
                // statusesAdded: new fields.ArrayField(fields.SchemaField({
                //     name: new fields.StringField(),
                //     duration: new fields.NumberField(),
                // }), // for things like 'block' we co)uld have a 'blocking' status that uses a flag for the X value?
                // statusesRemoved: fields.ArrayField(new fields.StringField()),
                // if we wanted to model effects, this is the props we'd need
                // key
                // mode
                // value
            })),


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

    async use(actor) {
        if (!this.canUse(actor)) return;

        const rollData = this._prepareRollData(actor);
        const confirmRollResult = await uiService.showDialog("confirm-roll", rollData);
        if (!confirmRollResult.confirmed) return;
        const skillResult = await actor.system.useSkill(confirmRollResult);

        const actionOutcome = this._prepareOutcomeData(actor);
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
                    ...actionOutcome,
                    rollMargin: skillResult.margin
                }
            }
        });
        this._handleItemUsed(actor, skillResult);
    }
}