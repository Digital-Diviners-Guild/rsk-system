import { localizeText } from "../rsk-localize.js";

export default class RSKApplyDamageDialog extends Application {
    static isActive;

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            title: localizeText("RSK.ApplyDamage"),
            template: 'systems/rsk/templates/applications/apply-damage-dialog.hbs',
            classes: ["rsk", "dialog"],
            width: 600,
            height: 600
        });
    }

    static create = (context, options) =>
        () => new Promise((resolve) => {
            if (RSKApplyDamageDialog.isActive) return;
            RSKApplyDamageDialog.isActive = true;
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
        this.damageEntries = this.context?.actionData?.damageEntries ?? {
            stab: 0,
            slash: 0,
            crush: 0,
            air: 0,
            water: 0,
            earth: 0,
            fire: 0,
        };
        this.puncture = this.context?.puncture ?? 0;
        this.defenseRoll = this.context?.defenseRoll ?? 0; //todo: need to make this interactive
        this.attackType = this.context?.actionType ?? "melee";
    }

    getData() {
        return {
            context: this.context,
            damageEntries: this.damageEntries,
            puncture: this.puncture,
            attackType: this.attackType,
            defenseRoll: this.defenseRoll
        }
    }

    async close(options) {
        if (!this.isResolved) this.resolve({ confirmed: false, damage: 0 });
        RSKApplyDamageDialog.isActive = false;
        super.close(options);
    }

    activateListeners(html) {
        html.find("button.apply").click((ev) => {
            this.attackType = $("#attackType").val();
            this.puncture = Number($("#puncture").val());
            this.defenseRoll = game.rsk.math.clamp_value(Number($("#defenseRoll").val()), { min: 0 });
            this.damageEntries.stab = Number($("#stab").val());
            this.damageEntries.slash = Number($("#slash").val());
            this.damageEntries.crush = Number($("#crush").val());
            this.damageEntries.air = Number($("#air").val());
            this.damageEntries.water = Number($("#water").val());
            this.damageEntries.earth = Number($("#earth").val());
            this.damageEntries.fire = Number($("#fire").val());
            this.resolve({
                confirmed: true,
                attackType: this.attackType,
                puncture: this.puncture,
                defenseRoll: this.defenseRoll,
                damageEntries: this.damageEntries
            });
            this.isResolved = true;
            this.close();
        });
    }
}