import RSKApplyDamageDialog from "../applications/RSKApplyDamageDialog.js";
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

    if (actorData.type === 'character') {
      this._prepareSkills(context);
      this._prepareAbilities(context);
    }
    this._prepareItems(context);

    return context;
  }

  activateListeners(html) {
    super.activateListeners(html);
    RSKDice.addClickListener(html.find(".roll-dice"),
      this.actor.type === "npc"
        ? (ev) => RSKDice.handleBasicRoll()
        : (ev) => RSKDice.handlePlayerRoll(this.actor));

    RSKDice.addClickListener(html.find(".roll-check"),
      async (ev) => {
        const target = $(ev.currentTarget);
        const type = target.data("type");
        const value = target.data("value");
        const options = type === "skill" ? { defaultSkill: value } : { defaultAbility: value };
        await RSKDice.handlePlayerRoll(this.actor, options);
      });

    html.find('.apply-damage').click(
      async ev => {
        const dialog = RSKApplyDamageDialog.create({}, {});
        let damage = await dialog();
        if (damage.confirmed) {
          this.actor.receiveDamage(damage.damage);
        }
      });

    html.find('.item-edit').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.items.get(li.data("itemId"));
      item.sheet.render(true);
    });

    if (!this.isEditable) return;

    html.find('.item-delete').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.items.get(li.data("itemId"));
      item.delete();
      li.slideUp(200, () => this.render(false));
    });

    html.find('.item-create').click(this._onItemCreate.bind(this));
  }

  _prepareSkills(context) {
    context.skills = Object.keys(context.system.skills)
      .map(function (index) {
        return {
          index: index,
          label: game.i18n.format(CONFIG.RSK.skills[index]),
          level: context.system.skills[index].level,
          used: context.system.skills[index].used
        }
      });
  }

  //todo: this pattern is appearing a few times, probably something we can abstract
  _prepareAbilities(context) {
    context.abilities = Object.keys(context.system.abilities)
      .map(function (index) {
        return {
          index: index,
          label: game.i18n.format(CONFIG.RSK.abilities[index]),
          level: context.system.abilities[index]
        }
      });
  }

  _prepareItems(context) {
    const actions = [];
    const specialFeatures = [];
    const backgrounds = [];

    for (let i of context.items) {
      i.img = i.img || DEFAULT_TOKEN;
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