import RSK from "../../config";

export default class RSKItem extends Item {
    async _preUpdate(changed, options, user) {
        const itemType = changed?.system?.type;
        const tier = changed?.system?.tier;
        if (itemType && !CONFIG.RSK.tierOption[itemType]) {
            changed["system.tier"] = "";
        } else if (itemType && CONFIG.RSK.tierOption[itemType] && !tier) {
            changed["system.tier"] = Object.keys(CONFIG.RSK.tierOption[itemType])[0];
        }
        return super._preUpdate(changed, options, user);
    }

    isWeapon() {
        return this.type === "weapon";
    }

    isRangedWeapon() {
        return true;
        // return this.isWeapon() && (this.system.attackType.has("ranged") || this.system.attackType.has("thrown"));
    }

    isThrownWeapon() {
        return true;
        // return this.isWeapon() && this.system.attackType.has("thrown");
    }

    isMeleeWeapon() {
        return true;
        // return this.isWeapon() && this.system.attackType.has("melee");
    }

    isOnlyAmmo() {
        return false;
        // return this.system.attackType.has("ammo") && !this.system.attackType.has("melee") && !this.system.attackType.has("ranged") && !this.system.attackType.has("thrown");
    }

    usesItemAsAmmo(item) {
        return true;
        // return this.system.attackType.has("ranged")
        //     && item.system.attackType.has("ammo")
        //     && this.system.ammoType === item.system.ammoType;
    }
}