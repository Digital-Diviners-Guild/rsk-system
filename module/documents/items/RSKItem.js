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
        return this.isWeapon() && (this.system.attackMethods.has("ranged") || this.system.attackMethods.has("thrown"));
    }

    isThrownWeapon() {
        return this.isWeapon() && this.system.attackMethods.has("thrown");
    }

    isMeleeWeapon() {
        return this.isWeapon() && this.system.attackMethods.has("melee");
    }

    isOnlyAmmo() {
        return this.system.attackMethods.has("ammo") && !this.system.attackMethods.has("melee") && !this.system.attackMethods.has("ranged") && !this.system.attackMethods.has("thrown");
    }

    usesItemAsAmmo(item) {
        return this.system.attackMethods.has("ranged")
            && item.system.attackMethods.has("ammo")
            && this.system.ammoType === item.system.ammoType;
    }
}