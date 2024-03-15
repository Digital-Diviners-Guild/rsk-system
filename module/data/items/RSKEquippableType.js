import { localizeText } from "../../rsk-localize.js";
import { uiService } from "../../rsk-ui-service.js";
import RSKItemType from "./RSKItemType.js";

//todo: need to refactor equppables
// we use a few fields to track things, and even a flag
// need to decide on what is needed. 
// also need to decide how we want to do the disable slots.
// do things like 2 handed weapons have a designated slot to disable
// mean while 'heavy's give the option to pick a slot?

//todo: I wonder if we can kill the 'equppabletype'
export default class RSKEquippableType extends RSKItemType {
    async equip(slot) {
        let slotToDisable;
        if (this.hasOwnProperty("disablesSlot") && this.disablesSlot) {
            slotToDisable = { id: this.disablesSlot };
        } else if (this.parent.totalBulk() > 1) {
            const otherSlots = Object.keys(CONFIG.RSK.activeSlotType)
                //todo: this may not be totally accurate (darts) as activeSlot would likely say 'weapon' but it could be intended for the ammo slot here
                // in which case we would not want to show ammo to disable
                .filter(s => s != this.activeSlot)
                .map(s => {
                    return {
                        _id: s,
                        name: localizeText(CONFIG.RSK.activeSlotType[s])
                    };
                });
            slotToDisable = await uiService.showDialog("select-item", { items: otherSlots });
            if (!slotToDisable.confirmed) {
                return { error: localizeText("RSK.Error.DisableSlotToEquip") }
            };
        }
        this.parent.update({
            "system.isEquipped": true,
            "system.equippedInSlot": slot,
            "flags.rsk.disabledSlot": slotToDisable?.id ?? ""
        });
        return { disablesSlot: slotToDisable?.id };
    }

    unequip() {
        const freedSlot = this.parent.flags?.rsk?.disabledSlot;
        this.parent.update({
            "system.isEquipped": false,
            "system.equippedInSlot": "",
            "flags.rsk.disabledSlot": ""
        });
        return { freedSlot };
    }
}
