export function toMessageContent(actionData, includeUseButton = true) {
    return `<p>${actionData.label}</p>
    <p>${actionData.description}</p>
    <p>${actionData.effectDescription}</p>
    ${includeUseButton ? "<button class='test' type='button'>use</button>" : ""}`;
}