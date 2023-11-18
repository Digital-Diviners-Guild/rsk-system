export default class RSKNpcSheet extends ActorSheet {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            template: "systems/rsk-system/templates/actors/npc-sheet.hbs",
            classes: ["rsk", "sheet", "rsk-npc"]
        })
    }
}