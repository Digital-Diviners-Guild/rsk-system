export default class RSKCharacterSheet extends ActorSheet {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            template: 'systems/rsk-system/templates/actors/character-sheet.hbs',
            classes: ['sheet', 'rsk', 'rsk-character']
        })
    }
}