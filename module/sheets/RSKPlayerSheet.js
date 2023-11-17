export default class RSKPlayerSheet extends ActorSheet {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            template: 'systems/rsk-system/templates/actors/player-sheet.hbs',
            classes: ['sheet', 'rsk', 'rsk-player']
        })
    }
}