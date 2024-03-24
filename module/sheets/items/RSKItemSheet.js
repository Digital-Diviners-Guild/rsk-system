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
        return 'systems/rsk/templates/items/item-sheet.hbs';
    }

    getData() {
        const context = super.getData();
        const itemData = context.item;
        context.system = itemData.system;
        context.flags = itemData.flags;
        context.config = CONFIG.RSK;
        return context;
    }

    activateListeners(html) {
        super.activateListeners(html);
        html.find('.effect-edit').click(ev => {
            const effectId = $(ev.currentTarget)
                .parents(".item")
                .data("effectId");
            const effect = this.item.effects.get(effectId);
            effect.sheet.render(true);
        });
        if (!this.isEditable) return;

        html.find(".add-usage-cost").click(async (ev) => {
            const type = $("#type");
            const amount = $("#amount");
            const typeVal = type.val();
            const amountVal = Number(amount.val());

            const usageCost = this.item.system.usageCost.filter(c => c.type !== typeVal);
            usageCost.push({ type: typeVal, amount: amountVal });
            await this.item.update({ "system.usageCost": usageCost });

            type.value = "";
            amount.value = 0;
        });

        html.find(".remove-usage-cost").click((ev) => {
            const type = $(ev.currentTarget)
                .parents(".item")
                .data("type");

            const updatedUsageCost = this.item.system.usageCost.filter(c => c.type !== type);
            this.item.update({ "system.usageCost": updatedUsageCost });
        });

        html.find(".add-special-effect").click(async (ev) => {
            const name = $("#new-special-effect-name");
            const x = $("#new-special-effect-x");
            const y = $("#new-special-effect-y");
            const nameVal = name.val();
            const xVal = x.val();
            const yVal = y.val();

            const specialEffect = this.item.system.specialEffect.filter(sp => sp.name !== nameVal);
            specialEffect.push({ name: nameVal, x: xVal, y: yVal });
            await this.item.update({ "system.specialEffect": specialEffect });

            name.value = "";
            x.value = "";
            y.value = "";
        });

        html.find(".remove-special-effect").click((ev) => {
            const name = $(ev.currentTarget)
                .parents(".item")
                .data("name");

            const updatedSpecialEffect = this.item.system.specialEffect.filter(c => c.name !== name);
            this.item.update({ "system.specialEffect": updatedSpecialEffect });
        });

        html.find('.effect-create').on('click', ev => {
            CONFIG.ActiveEffect.documentClass.create({
                label: "New Effect",
                icon: "icons/svg/aura.svg",
                transfer: true,
            }, { parent: this.item }).then(effect => effect?.sheet?.render(true));
        });

        html.find('.effect-delete').click(ev => {
            const effectId = $(ev.currentTarget)
                .parents(".item")
                .data("effectId");
            this.item.deleteEmbeddedDocuments("ActiveEffect",
                this.item.effects
                    .filter(x => x._id === effectId)
                    .map(x => x._id));
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
        if (!droppedItem) return;

        const droppedEffects = droppedItem.effects.map(e => {
            let eObj = e.toObject();
            delete eObj._id;
            return eObj;
        });
        this.item.createEmbeddedDocuments("ActiveEffect", [...droppedEffects]);
        this.render(true);
    }
}