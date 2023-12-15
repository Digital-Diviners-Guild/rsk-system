import RSKApplyDamageDialog from "../../applications/RSKApplyDamageDialog.js";
import RSKConfirmRollDialog from "../../applications/RSKConfirmRollDialog.js";
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
    if (actorData.type === 'character') {
      this._prepareSkills(context);
      this._prepareAbilities(context);
      this._prepareEquipment(context);
    }
    this._prepareItems(context);

    return context;
  }

  activateListeners(html) {
    super.activateListeners(html);
    game.rsk.dice.addClickListener(html.find(".roll-check"),
      async (ev) => {
        const target = $(ev.currentTarget);
        const type = target.data("type");
        const value = target.data("value");
        const dialogOptions = type === "skill" ? { defaultSkill: value } : { defaultAbility: value };
        const rollData = this.actor.getRollData();
        const dialog = RSKConfirmRollDialog.create(rollData, dialogOptions)
        const rollOptions = await dialog();

        if (rollOptions.rolled) {
          await game.rsk.dice.handlePlayerRoll(rollOptions);
          this.actor.useSkill(rollOptions.skill);
        }
      });

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
        this.actor.receiveDamage(damage.damage);
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

  _prepareSkills(context) {
    context.skills = Object.keys(context.system.skills)
      .map(function (index) {
        return {
          index: index,
          label: game.i18n.format(CONFIG.RSK.skills[index]),
          ...context.system.skills[index]
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

  _prepareEquipment(context) {
    const equipped = context.items.filter(i => i.system.equipped && i.system.equipped.isEquipped);
    context.worn = {};
    equipped.map((e) => context.worn[e.system.equipped.slot] = e.name);
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