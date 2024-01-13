import RSKApplyDamageDialog from "../../applications/RSKApplyDamageDialog.js";

export default class RSKActorSheet extends ActorSheet {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["rsk", "actor", "sheet"],
      width: 600,
      height: 600,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }]
    });
  }

  get template() {
    return `systems/rsk/templates/actors/${this.actor.type}-sheet.hbs`;
  }

  getData() {
    const context = super.getData();
    const actorData = this.actor.toObject(false);
    context.system = actorData.system;
    context.flags = actorData.flags;
    context.config = CONFIG.RSK;
    context.publicRoll = CONST.DICE_ROLL_MODES.PUBLIC;
    context.privateRoll = CONST.DICE_ROLL_MODES.PRIVATE;
    this._prepareItems(context);
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
    if (!this.isEditable) return;

    html.find('.item-equip').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.items.get(li.data("itemId"));
      this.actor.equip(item);
    });

    html.find('.apply-damage').click(async ev => {
      const dialog = RSKApplyDamageDialog.create({}, {});
      let damage = await dialog();
      if (damage.confirmed) {
        const outcome = {}; //todo: generate outcome, dialog may need damage type options
        await this.actor.applyOutcome(outcome);
      }
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
}