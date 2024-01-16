export const localizeList = (obj, lang, valueSelector = undefined) =>
    Object.keys(obj)
        .map((index) => {
            return {
                index: index,
                label: localizeText(lang[index]),
                value: valueSelector ? valueSelector(obj, index) : obj[index]
            }
        });


const localizeText = (text) => game.i18n.format(text);