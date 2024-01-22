export default class RSKDeathSheet extends ActorSheet {
    rollTable;
    isCombat = false;
    canResurrect = false;
    consequencesTaken = 0;

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["rsk", "actor", "sheet"],
            width: 1000,
            height: 600,
        });
    }

    get template() {
        return `systems/rsk/templates/actors/${this.actor.type}-sheet.hbs`;
    }

    getData() {
        const context = super.getData();
        this.rollTable = RollTable.get(this.actor.system.rollTableId);
        context.isConfigured = !!this.rollTable
        context.currentCharacterName = game?.users?.current?.character?.name ?? "Adventurer";
        context.isCombat = this.isCombat;
        context.showConsequences = this.isCombat
            ? this.consequencesTaken < 2
            : this.consequencesTaken < 1;
        context.canResurrect = !this.isCombat && this.consequencesTaken > 0
            || this.isCombat && this.consequencesTaken > 1
        return context;
    }

    activateListeners(html) {
        super.activateListeners(html);
        html.find('.roll-death-consequence').click(async ev => {
            let tableRoll = await this.rollTable.roll();
            const draws = this.rollTable.getResultsForRoll(tableRoll.roll.total);
            if (draws.length) {
                await this.rollTable.draw(tableRoll);
            }
            this.consequencesTaken++;
            this.render();
        });
        html.find('.resurrect').click(async ev => {
            const char = game?.users?.current?.character;
            if (char) {
                await char.acceptResurrection();
            }
            this.consequencesTaken = 0;
            this.canResurrect = false;
            this.isCombat = false;
            this.close();
        });
        html.find('.is-combat').change(ev => this.isCombat = !this.isCombat);
    }

    async _onDrop(event) {
        const transferString = event.dataTransfer.getData("text/plain");
        const transferObj = JSON.parse(transferString);
        const tableId = transferObj.uuid.split(".")[1];
        if (!tableId) return;

        this.actor.update({ "system.rollTableId": tableId });
    }
}