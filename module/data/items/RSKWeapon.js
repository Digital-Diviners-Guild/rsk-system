import { fields } from "../fields.js";
import RSKEquippableType from "./RSKEquippableType.js";
import RSKItemType from "./RSKItemType.js";

export default class RSKWeapon extends RSKEquippableType {
    static defineSchema() {
        return {
            ...RSKItemType.defineSchema(),
            //todo: can we kill these properties?
            attackMethods: new fields.SetField(new fields.StringField({
                choices: [...Object.keys(CONFIG.RSK.attackMethods)]
            }), {
                required: true,
                initial: ["melee"],
                choices: [...Object.keys(CONFIG.RSK.attackMethods)]
            }),
            weaponType: new fields.StringField({
                required: true,
                initial: "simple",
                choices: [...Object.keys(CONFIG.RSK.weaponTypes)]
            }),
            ammoType: new fields.StringField({
                choices: [...Object.keys(CONFIG.RSK.ammunitionType)]
            })
        }
    };

    //todo: default attack is unarmed, we need to not forget about that.
    _prepareOutcomeData() {
        return {
            name: this.parent.name,
            description: this.effectDescription,
            actionType: "melee",
            img: this.parent.img,
            outcomes: this.targetOutcomes
        };
    }
}