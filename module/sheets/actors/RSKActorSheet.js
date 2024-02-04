import RSKApplyDamageDialog from "../../applications/RSKApplyDamageDialog.js";
import { chatItem } from "../../applications/RSKChatLog.js";

export default class RSKActorSheet extends ActorSheet {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["rsk", "actor", "sheet"],
            width: 1000,
            height: 600,
            tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }]
        });
    }

    get template() {
        return `systems/rsk/templates/actors/${this.actor.type}-sheet.hbs`;
    }

    codexs;

    getData() {
        const context = super.getData();
        const actorData = this.actor.toObject(false);
        context.system = actorData.system;
        context.flags = actorData.flags;
        context.config = CONFIG.RSK;
        context.publicRoll = CONST.DICE_ROLL_MODES.PUBLIC;
        context.privateRoll = CONST.DICE_ROLL_MODES.PRIVATE;
        this._prepareItems(context);
        this._prepareCodex(context);
        return context;
    }

    activateListeners(html) {
        super.activateListeners(html);
        html.find('.item-edit').click(ev => {
            const li = $(ev.currentTarget).parents(".item");
            const item = this.actor.items.get(li.data("itemId"));
            item.sheet.render(true);
        });
        html.find('.effect-edit').click(ev => {
            const effectId = $(ev.currentTarget)
                .parents(".item")
                .data("effectId");
            const effect = this.actor.effects.get(effectId);
            effect.sheet.render(true);
        });
        html.find('.chat-item').click(async ev => {
            const s = $(ev.currentTarget);
            const itemType = s.data("itemType");
            const itemId = s.data("itemId");
            this.handleChatItem(itemType, itemId);
        });
        if (!this.isEditable) return;

        html.find('.item-equip').click(ev => {
            const li = $(ev.currentTarget).parents(".item");
            const item = this.actor.items.get(li.data("itemId"));
            this.actor.equip(item);
        });

        html.find('.apply-backgrounds').click(ev => {
            this.actor.applyBackgrounds();
        });

        html.find('.item-delete').click(ev => {
            const li = $(ev.currentTarget).parents(".item");
            const item = this.actor.items.get(li.data("itemId"));
            item.delete();
            li.slideUp(200, () => this.render(false));
        });

        html.find('.item-create').click(this._onItemCreate.bind(this));

        html.find('.effect-create').on('click', ev => {
            CONFIG.ActiveEffect.documentClass.create({
                label: "New Effect",
                icon: "icons/svg/aura.svg",
                transfer: true,
            }, { parent: this.actor }).then(effect => effect?.sheet?.render(true));
        });

        html.find('.effect-delete').click(ev => {
            const effectId = $(ev.currentTarget)
                .parents(".item")
                .data("effectId");
            this.actor.deleteEmbeddedDocuments("ActiveEffect",
                this.actor.effects
                    .filter(x => x._id === effectId)
                    .map(x => x._id));
        });

        html.find('.actor-application').click(async ev => {
            const actorApp = $(ev.currentTarget);
            actorApp.addClass('clicked');
            setTimeout(function () {
                actorApp.removeClass('clicked');
            }, 1000);

            var glowColor = actorApp[0].getAttribute('glow-color');
            if (glowColor) {
                actorApp[0].style.setProperty('--glow-color', glowColor);
            }
            else {
                actorApp[0].style.setProperty('--glow-color', "white");
            }
            var applicationMethod = actorApp[0].getAttribute('application-method');
            if (applicationMethod) {
                await this.actor.sheet[applicationMethod]();
            }
        });

        html.find('.remove-codex').click(async ev => {
            const s = $(ev.currentTarget);
            const itemId = s.data("itemId");
            await this.handleRemoveCodex(itemId);
        });
    }

    _prepareItems(context) {
        const actions = [];
        const specialFeatures = [];
        const backgrounds = [];

        for (let i of context.items) {
            if (i.type === 'action') {
                actions.push(i);
            } else if (i.type === 'specialFeature') {
                specialFeatures.push(i);
            } else if (i.type === 'background') {
                backgrounds.push(i);
            }
        }

        context.actions = actions;
        context.specialFeatures = specialFeatures;
        context.backgrounds = backgrounds;
    }

    _prepareCodex(context) {
        //todo: can probably be refactored
        const codexIds = this.actor.flags?.rsk?.codexIds ?? [];
        this.codexs = codexIds
            .map(i => Item.get(i))
            .filter(i => i)
            .reduce((acc, curr) => {
                acc[curr._id] = curr;
                return acc;
            }, {});
        context.codexs = Object.keys(this.codexs)
            .map(id => {
                return { _id: id, name: this.codexs[id].name }
            });
    }

    async _onItemCreate(event) {
        event.preventDefault();
        const header = event.currentTarget;
        const type = header.dataset.type;
        const data = duplicate(header.dataset);
        const name = `New ${type.capitalize()}`;
        const itemData = {
            name: name,
            type: type,
            system: data
        };
        delete itemData.system["type"];
        return await Item.create(itemData, { parent: this.actor });
    }

    async characterRest() {
        this.actor.rest();
    };

    async characterDamage() {
        const dialog = RSKApplyDamageDialog.create();
        const result = await dialog();
        if (result && result.confirmed) {
            this.actor.receiveDamage({ ...result });
        }
    }

    async handleChatItem(itemType, itemId) {
        await chatItem(this.actor.items.find(i => i._id === itemId));
    }


    handleRemoveCodex(collectionId) {
        const collectionData = this.codexs[collectionId];
        if (!collectionData) return;

        collectionData.system.removeActions(this.actor);
    }

    async _onDropItem(event, data) {
        const item = await Item.fromDropData(data);
        if (item.type === "codex") {
            item.system.importActions(this.actor);
        } else if (item.type === "itemCollection") {
            item.system.import(this.actor);
        } else {
            await super._onDropItem(event, data);
        }
    }
}