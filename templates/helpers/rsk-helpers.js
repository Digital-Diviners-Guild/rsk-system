export const setBoxes = (set, selectorClass, allowableChoices) => {
    let html = "";
    for (let [key, label] of Object.entries(allowableChoices)) {
        label = game.i18n.localize(label);
        const isChecked = set.has(key);
        html += `<label class="checkbox"><input class="${selectorClass}" type="checkbox" value="${key}" ${isChecked ? "checked" : ""}> ${label}</label>`;
    }
    return new Handlebars.SafeString(html);
}