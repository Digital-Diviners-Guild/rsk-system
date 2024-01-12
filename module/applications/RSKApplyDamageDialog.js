//TODO: is this where we could add some handling for qualities such as
// rejuvinate/retalliate? the dialog could allow you to reassign damage
// as block/healing?

export default class RSKApplyDamageDialog extends Application {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            template: 'systems/rsk/templates/applications/apply-damage-dialog.hbs',
            classes: ["rsk", "dialog"],
            width: 480,
            height: 250
        });
    }

    static create = (context, options) =>
        () => new Promise((resolve) => {
            const dialog = new RSKApplyDamageDialog(resolve, context, options);
            dialog.render(true);
        });

    constructor(
        resolve,
        context,
        options = {}
    ) {
        super();
        this.resolve = resolve;
        this.context = context;
        this.damage = 0;
        this.healing = 0;
        this.block = 0;
        this.damageReflection = 0;
    }

    getData() {
        return {
            context: this.context,
            damage: this.damage,
            canHeal: this.context.canHeal ?? false, // maybe this can be passed in when the quality applies?
            canBlock: this.context.canBlock ?? false, // maybe this can be passed in when the quality applies?
            canReflect: this.context.canReflect ?? false, // maybe this can be passed in when the quality applies?
            healing: this.healing,
            block: this.block,
            damageReflection: this.damageReflection
        }
    }

    async close(options) {
        if (!this.isResolved) this.resolve({ confirmed: false, damage: 0 });
        super.close(options);
    }

    activateListeners(html) {
        html.find("button.apply").click((ev) => {
            this.damage = Number($("#damage-value").val());
            this.healing = Number($("#healing-value").val());
            this.block = Number($("#block-value").val());
            this.damageReflection = Number($("#reflect-value").val());
            this.resolve({
                confirmed: true,
                damage: this.damage,
                healing: this.healing,
                block: this.block,
                damageReflection: this.damageReflection
            });
            this.isResolved = true;
            this.close();
        });
    }
}