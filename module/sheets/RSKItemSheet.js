export default class RSKItemSheet extends ItemSheet {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["rsk", "sheet", "item"],
            width: 600,
            height: 600,
            tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }],
            dragDrop: [{ dropSelector: "[data-can-drop=true]" }],
        });
    }

    get template() {
        return `systems/rsk-system/templates/items/${this.item.type}-sheet.hbs`
    }

    getData() {
        const context = super.getData();
        const itemData = context.item;
        // context.rollData = {};
        // let actor = this.object?.parent ?? null;
        // if (actor) {
        //     context.rollData = actor.getRollData();
        // }
        context.system = itemData.system;
        context.flags = itemData.flags;
        context.config = CONFIG.RSK;
        context.dealsDamage = itemData.system.damageEntries
            && Object.values(itemData.system.damageEntries)
                .filter(x => x > 0).length > 0;

        if (itemData.type === "spell") {
            this._prepareSpellCost(context);
        }
        return context;
    }

    activateListeners(html) {
        super.activateListeners(html);
        if (!this.isEditable) return;

        html.find('.quality-delete').click(ev => {
            const li = $(ev.currentTarget).parents(".quality");
            this.item.removeQuality(li.data("qualityId"));
            li.slideUp(200, () => this.render(false));
        });
    }

    _prepareSpellCost(context) {
        context.spellCost = Object.keys(context.system.cost)
            .map(function (index) {
                return {
                    index: index,
                    cost: context.system.cost[index],
                    type: game.i18n.format(CONFIG.RSK.runeType[index]),
                }
            });
    }

    _onDrop(event) {
        const transferString = event.dataTransfer.getData("text/plain");
        const transferObj = JSON.parse(transferString);
        if (!(transferObj.uuid && transferObj.type)) return;
        switch (transferObj.type) {
            case "Item":
                return this._onDropItem(event, transferObj);
        }
    }

    _onDropItem(event, transferObj) {
        const itemId = transferObj.uuid.split(".")[1];
        if (!itemId) return;

        const droppedItem = Item.get(itemId);
        const qualityData = { sourceUuid: transferObj.uuid, name: droppedItem.name, type: droppedItem.type, description: droppedItem.system.description };
        this.item.addQuality(qualityData);
        this.render(true);
    }
}