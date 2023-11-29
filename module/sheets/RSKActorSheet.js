import RSKDice from "../rsk-dice.js";

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
    return `systems/rsk-system/templates/actors/${this.actor.type}-sheet.hbs`;
  }

  getData() {
    const context = super.getData();
    const actorData = this.actor.toObject(false);
    context.system = actorData.system;
    context.flags = actorData.flags;
    context.config = CONFIG.RSK;
    context.publicRoll = CONST.DICE_ROLL_MODES.PUBLIC;
    context.privateRoll = CONST.DICE_ROLL_MODES.PRIVATE;

    if (actorData.type == 'npc') {
      this._prepareItems(context);
    }

    return context;
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);
    RSKDice.addButtonListener(html,
      this.actor.type === "npc"
        ? RSKDice.handleBasicRoll()
        //todo: calculate test number, probably need to open a dialog to get some input?
        : RSKDice.handlePlayerRoll());


    // Render the item sheet for viewing/editing prior to the editable check.
    html.find('.item-edit').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.items.get(li.data("itemId"));
      item.sheet.render(true);
    });

    if (!this.isEditable) return;

    // Delete Inventory Item
    html.find('.item-delete').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.items.get(li.data("itemId"));
      item.delete();
      li.slideUp(200, () => this.render(false));
    });

    html.find('.item-create').click(this._onItemCreate.bind(this));
  }

  _prepareItems(context) {
    const actions = [];
    const specialFeatures = [];

    for (let i of context.items) {
      i.img = i.img || DEFAULT_TOKEN;
      if (i.type === 'action') {
        actions.push(i)
      } else if (i.type === 'specialFeature') {
        specialFeatures.push(i)
      }
    }

    context.actions = actions;
    context.specialFeatures = specialFeatures;
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