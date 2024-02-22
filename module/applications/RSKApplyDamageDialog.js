import { localizeText } from "../rsk-localize.js";
import RSKDialog from "./RSKDialog.js";

export default class RSKApplyDamageDialog extends RSKDialog {
    static isActive;

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            title: localizeText("RSK.ApplyDamage"),
            template: 'systems/rsk/templates/applications/apply-damage-dialog.hbs',
            classes: ["rsk", "dialog"],
            width: 600,
            height: 420
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
        const damageData = this.context?.actionData?.damageEntries
            ? foundry.utils.deepClone(this.context?.actionData?.damageEntries)
            : {};
        this.damageEntries = Object.keys(damageData)
            .filter(key => damageData[key] > 0)
            .map((key) => {
                return {
                    label: localizeText(CONFIG.RSK.damageTypes[key]),
                    type: key,
                    amount: damageData[key]
                };
            });
        this.puncture = this.context?.puncture ?? 0;
        this.defenseRoll = this.context?.defenseRoll || options?.defenseRoll || 0;
        this.attackType = this.context?.actionType ?? "melee";
        this.keypressId = "applyDamage";
    }

    getData() {
        return {
            context: this.context,
            damageEntries: this.damageEntries,
            puncture: this.puncture,
            attackType: this.attackType,
            defenseRoll: this.defenseRoll,
            config: CONFIG.RSK
        }
    }

    async close(options) {
        RSKApplyDamageDialog.isActive = false;
        super.close(options);
    }

    activateListeners(html) {
        super.activateListeners(html);
        html.find(".add-damage").click(async (ev) => {
            const type = $("#type");
            const amount = $("#amount");
            const typeVal = type.val();
            const amountVal = Number(amount.val());
            const existingDamage = this.damageEntries.find(d => d.type === typeVal);
            if (existingDamage) {
                existingDamage.amount += amountVal;
            } else {
                this.damageEntries.push({
                    label: localizeText(CONFIG.RSK.damageTypes[typeVal]),
                    type: typeVal,
                    amount: amountVal
                });
            }

            type.value = "";
            amount.value = 0;
            this.render();
        });

        html.find(".remove-damage").click((ev) => {
            const type = $(ev.currentTarget)
                .parents(".item")
                .data("type");
            this.damageEntries = this.damageEntries.filter(c => c.type !== type);
            this.render();
        });
    }

    async _onConfirm(event) {
        this.attackType = $("#attackType").val();
        this.puncture = Number($("#puncture").val());
        this.defenseRoll = game.rsk.math.clamp_value(Number($("#defenseRoll").val()), { min: 0 });
        this.resolve({
            confirmed: true,
            attackType: this.attackType,
            puncture: this.puncture,
            defenseRoll: this.defenseRoll,
            damageEntries: this.damageEntries
                .reduce((ds, d) => { ds[d.type] = d.amount; return ds; }, {})
        });
        await super._onConfirm(event);
    }
}