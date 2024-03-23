//idea: in chat message, have the select for defense roll in the message so you can 
// just click apply instead of needing another pop up?

//todo: need button for x2 damage, maybe one for defense roll?
//todo: handle special effect logic. maybe in 'apply outcome'?
// needs to see if margin > threshold and either modify the outcome
// or open a dialog to configure changes if needed.
// not all special effects need this. for example bleed wouldn't need a dialog
import { localizeText } from "../rsk-localize.js";
import { applyOutcome, applyOutcome2 } from "../rsk-outcome-application.js";

export default class RSKChatLog extends ChatLog {

}

export async function onRenderChatMessage(app, html, data) {
    const message = data.message;
    const isActionMessage = message?.flags?.rsk?.actionType;
    const currentCharacterUuid = game.user?.character?.uuid;
    const isGM = game.user?.isGM;
    if (!(isActionMessage && (currentCharacterUuid || isGM))) return;

    const possibleTargets = message.flags.rsk.targetUuids ?? [];
    const canClickButton = isGM || possibleTargets.includes(currentCharacterUuid)
    if (!canClickButton) return;
    //todo: need this here still?
    // const targets = () => isGM
    //     ? [...game.user.targets.map(t => t.actor)]
    //     : [game.user.character];
    const outcomeData = message.flags.rsk;

    addApplyOutcomeButton(html, () => applyOutcome2(outcomeData));
}

const addApplyOutcomeButton = (html, handler) => {
    html.find(".message-controls")
        .html(`<button class="apply-outcome">${localizeText("RSK.Apply")}</button>`)
    html.find(".apply-outcome")
        .click(async e => await handler());
}

export async function chatItem(item, options = {}) {
    const data = item.hasOwnProperty("system")
        ? {
            name: item.name, img: item.img, ...item.system
        } :
        item;
    const content = await renderTemplate("systems/rsk/templates/applications/item-message.hbs",
        {
            ...data,
            showRollResult: false,
            ...options
        });
    await ChatMessage.create({ content });
}

// I think we should start adding hooks for important events on actors.
// then we can have handlers set up to capture and log that information to chat.
// though would this cause one event to render multiple chats if all clients handle the hook?
// needs some experimentation.
//todo: Add Hooks.call("characterHealed") etc when things we want to 'log' happen.
//todo: add Hooks.on("characterHealed", onCharacterHealed) etc for handlers like this?

//ex:
export async function onActorReceivedDamage(data) {
    await ChatMessage.create({
        content: `
        Received Damage:
        ${JSON.stringify({
            name: data.targetActor.name,
            damageTaken: data.damageTaken
        })}`
    });
}

export async function onActorRestoredLifePoints(data) {
    await ChatMessage.create({
        content: `
        Restored LifePoints:
        ${JSON.stringify({
            name: data.targetActor.name,
            lifePointsRestored: data.lifePointsRestored
        })}`
    });
}

export async function onActorRest(data) {
    await ChatMessage.create({
        content: `
        Rest:
        ${JSON.stringify({
            name: data.targetActor.name,
            gainedLife: data.gainedLife,
            gainedPrayer: data.gainedPrayer,
            gainedSummoning: data.gainedSummoning
        })}`
    });
}

export async function onActorIncreasedSkillLevel(data) {
    await ChatMessage.create({
        content: `
        Increased Skill Level:
        ${JSON.stringify({
            name: data.targetActor.name,
            skill: data.skill,
            newLevel: data.newLevel
        })}`
    });
}

export async function onActorIncreasedAbilityLevel(data) {
    await ChatMessage.create({
        content: `
        Increased Ability Level:
        ${JSON.stringify({
            name: data.targetActor.name,
            ability: data.ability,
            newLevel: data.newLevel
        })}`
    });
}

export function registerActorEventHandlers() {
    Hooks.on("actorReceivedDamage", onActorReceivedDamage);
    Hooks.on("actorRestoredLifePoints", onActorRestoredLifePoints);
    Hooks.on("actorRest", onActorRest);
    Hooks.on("actorIncreasedSkillLevel", onActorIncreasedSkillLevel);
    Hooks.on("actorIncreasedAbilityLevel", onActorIncreasedAbilityLevel);
}