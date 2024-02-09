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
        return this.isWeapon() && (this.system.isRanged || this.system.isThrown);
    }

    isMeleeWeapon() {
        return this.isWeapon() && this.system.isMelee;
    }
}