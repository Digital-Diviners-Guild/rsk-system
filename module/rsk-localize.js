export const localizeObject = (obj, lang, valueSelector = undefined, valueFilter = undefined) =>
    Object.keys(obj)
        .filter(i => valueFilter ? valueFilter(obj[i]) : true)
        .map((index) => {
            return {
                index: index,
                label: localizeText(lang[index]),
                value: valueSelector ? valueSelector(obj, index) : obj[index]
            }
        });


const localizeText = (text) => game.i18n.format(text);