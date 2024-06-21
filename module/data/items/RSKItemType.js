import { fields } from "../fields.js";
import { uiService } from "../../rsk-ui-service.js";
import { localizeText } from "../../rsk-localize.js";

export default class RSKItemType extends foundry.abstract.TypeDataModel {
    static defineSchema() {
        return {
            category: new fields.StringField(),
            subCategory: new fields.StringField(),
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
            usageCostLabel: new fields.StringField(),
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
            specialEffectLabel: new fields.StringField(),
            specialEffect: new fields.ArrayField(new fields.SchemaField({
                name: new fields.StringField(),
                x: new fields.StringField(),
                y: new fields.StringField(),
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
                choices: ["ammo", ...Object.keys(CONFIG.RSK.activeSlotType)]
            }),
            equippedInSlot: new fields.StringField(),
            isTwoHanded: new fields.BooleanField({ initial: false }),
            isEquipped: new fields.BooleanField({ initial: false }),
        };
    }

    prepareBaseData() {
        this.usageCostLabel = this.getUsageCostLabel();
        this.specialEffectLabel = this.getSpecialEffectLabel();
    }

    getUsageCostLabel() {
        return this.usageCost
            .map(c => `${c.amount} ${localizeText(CONFIG.RSK.usageCostTypes[c.type])}`)
            .join(", ");
    }

    getSpecialEffectLabel() {
        return this.specialEffect
            .map(se => {
                let qualities = "";
                if (se.x) {
                    qualities += ` ${se.x}`;
                }
                if (se.y) {
                    qualities += ` ${se.x}`;
                }
                return `${localizeText(CONFIG.RSK.specialEffects[se.name])}${qualities}`;
            })
            .join(", ");
    }

    dealsDamage(damageEntries) {
        return Object.keys(damageEntries).some((k) => damageEntries[k] > 0);
    }

    async use(actor) {
        if (!this.canUse(actor)) return;

        const rollData = this._prepareRollData(actor);
        const confirmRollResult = await uiService.showDialog("confirm-roll", rollData);
        if (!confirmRollResult.confirmed) return;

        const skillResult = await actor.system.useSkill(confirmRollResult);
        const actionOutcome = this._prepareOutcomeData(actor);
        const spfxMagin = this.dealsDamage(this.targetOutcome.damageEntries)
            ? 1
            : 0;
        const triggersSpecialEffect = skillResult.rollMargin >= spfxMagin;
        const flavor = await renderTemplate("systems/rsk/templates/applications/action-message.hbs",
            {
                rollResult: { ...skillResult },
                ...actionOutcome,
                specialEffectLabel: triggersSpecialEffect ? this.specialEffectLabel : ""
            });
        await skillResult.toMessage({
            flavor: flavor,
            flags: {
                rsk: {
                    ...skillResult,
                    ...actionOutcome,
                    rollMargin: skillResult.rollMargin,
                    triggersSpecialEffect
                }
            }
        });
        this._handleItemUsed(actor, skillResult);
    }

    isEquippable() {
        return !["", "none"].includes(this.activeSlot);
    }

    //todo: fix slot disables
    async equip(slot) {
        let slotToDisable;
        if (this.hasOwnProperty("disablesSlot") && this.disablesSlot) {
            slotToDisable = { id: this.disablesSlot };
        } else if (this.parent.totalBulk() > 1) {
            const otherSlots = Object.keys(CONFIG.RSK.activeSlotType)
                .filter(s => s != "none")
                //todo: this may not be totally accurate (darts) as activeSlot would likely say 'weapon' but it could be intended for the ammo slot here
                // in which case we would not want to show ammo to disable
                .filter(s => s != this.activeSlot)
                .map(s => {
                    return {
                        _id: s,
                        name: localizeText(CONFIG.RSK.activeSlotType[s])
                    };
                });
            slotToDisable = await uiService.showDialog("select-item", { items: otherSlots });
            if (!slotToDisable.confirmed) {
                return { error: localizeText("RSK.Error.DisableSlotToEquip") }
            };
        }
        this.parent.update({
            "system.isEquipped": true,
            "system.equippedInSlot": slot,
            "flags.rsk.disabledSlot": slotToDisable?.id ?? ""
        });
        return { disablesSlot: slotToDisable?.id };
    }

    unequip() {
        const freedSlot = this.parent.flags?.rsk?.disabledSlot;
        this.parent.update({
            "system.isEquipped": false,
            "system.equippedInSlot": "",
            "flags.rsk.disabledSlot": ""
        });
        return { freedSlot };
    }
}