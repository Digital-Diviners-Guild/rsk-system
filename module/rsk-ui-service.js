import { localizeObject, localizeText } from "./rsk-localize.js";

export const uiService = {
    showNotification: (message) => {
        ui.notifications.warn(localizeText(message));
    },
    showDialog: async (dialogType, context = {}, options = {}) => {
        switch (dialogType) {
            case "confirm-roll":
                return await confirmRollDialog(context, options);
            case "select-item":
                return await selectItemDialog(context, options);
            case "apply-damage":
                return await applyDamageDialog(context, options);
            case "manage-gold":
                return await manageGoldDialog(context, options);
            default:
                return false;
        }
    }
};

const selectItemDialog = async (context, options) => {
    const content = await renderTemplate('systems/rsk/templates/applications/item-selection-dialog.hbs', {
        items: [...context.items]
    });

    return await Dialog.prompt({
        title: localizeText("RSK.ItemSelection"),
        content: content,
        callback: dialog => {
            return {
                confirmed: true,
                id: dialog.find("select.item-dropdown")[0].value
            }
        }
    });
};

const manageGoldDialog = async (context, options) => {
    const content = await renderTemplate('systems/rsk/templates/applications/manage-gold-dialog.hbs', {
        context: context,
    });

    return await Dialog.prompt({
        title: localizeText("RSK.ManageGold"),
        content: content,
        callback: dialog => {
            return {
                confirmed: true,
                amount: Number(dialog.find("input.amount")[0].value)
            }
        }
    });
}

const confirmRollDialog = async (context, options) => {
    const selectedAbility = context.hasOwnProperty("defaultAbility") ? context.defaultAbility : "strength";
    const selectedSkill = context.hasOwnProperty("defaultSkill") ? context.defaultSkill : "attack";
    const targetNumberModifier = context.hasOwnProperty("targetNumberModifier") ? context.targetNumberModifier : 0;
    const rollMode = CONFIG.Dice.rollModes.publicroll;
    const advantageDisadvantageOptions = { normal: "RSK.Normal", advantage: "RSK.Advantage", disadvantage: "RSK.Disadvantage" };
    const advantageDisadvantage = "normal";

    const content = await renderTemplate('systems/rsk/templates/applications/roll-dialog.hbs', {
        rollModes: CONFIG.Dice.rollModes,
        rollMode: rollMode,
        context: context,
        skills: localizeObject(context.skills, CONFIG.RSK.skills, (obj, index) => obj[index].level),
        abilities: localizeObject(context.abilities, CONFIG.RSK.abilities, (obj, index) => obj[index].level),
        selectedAbility: selectedAbility,
        selectedSkill: selectedSkill,
        advantageDisadvantageOptions: advantageDisadvantageOptions,
        advantageDisadvantage: advantageDisadvantage,
        targetNumberModifier: targetNumberModifier
    });
    return await Dialog.prompt({
        title: localizeText("RSK.ConfirmRoll"),
        content: content,
        callback: dialog => {
            return {
                confirmed: true,
                rollMode: dialog.find("select.rollMode")[0].value,
                rollType: dialog.find("select.advantageDisadvantage")[0].value,
                skill: dialog.find("select.selectedSkill")[0].value,
                ability: dialog.find("select.selectedAbility")[0].value,
                targetNumberModifier: Number(dialog.find("input.targetNumberModifier")[0].value),
            }
        }
    });
};

const applyDamageDialog = async (context, options) => {
    const damageData = context?.actionData?.damageEntries
        ? foundry.utils.deepClone(context?.actionData?.damageEntries)
        : {};
    const damageEntries = Object.keys(damageData)
        .filter(key => damageData[key] > 0)
        .map((key) => {
            return {
                label: localizeText(CONFIG.RSK.damageTypes[key]),
                type: key,
                amount: damageData[key]
            };
        });
    const content = await renderTemplate('systems/rsk/templates/applications/apply-damage-dialog.hbs', {
        context: context,
        damageEntries: damageEntries,
        attackType: context?.attackType || "melee",
        defenseRollMargin: context?.defenseRollMargin || 0,
        config: CONFIG.RSK
    });
    return await Dialog.prompt({
        title: localizeText("RSK.ApplyDamage"),
        content: content,
        callback: dialog => {
            return {
                confirmed: true,
                attackType: dialog.find("input.attackType")[0].value,
                defenseRollMargin: Number(dialog.find("input.defenseRollMargin")[0].value),
                damageEntries: {
                    puncture: Number(dialog.find("input.puncture")[0].value),
                    stab: Number(dialog.find("input.stab")[0].value),
                    slash: Number(dialog.find("input.slash")[0].value),
                    crush: Number(dialog.find("input.crush")[0].value),
                    air: Number(dialog.find("input.air")[0].value),
                    water: Number(dialog.find("input.water")[0].value),
                    earth: Number(dialog.find("input.earth")[0].value),
                    fire: Number(dialog.find("input.fire")[0].value),
                }
            }
        }
    });
}