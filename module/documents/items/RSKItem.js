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

    totalBulk() {
        return this.system.bulk.value + this.system.bulk.modifier;
    }

    isWeapon() {
        return this.type === "weapon";
    }

    isRangedWeapon() {
        return this.isWeapon() && ["thrown", "ranged"].includes(this.system.category);
    }

    isThrownWeapon() {
        return this.isWeapon() && this.system.category === "thrown";
    }

    isMeleeWeapon() {
        return this.isWeapon() && this.system.category === "melee";
    }

    isOnlyAmmo() {
        return this.isWeapon() && this.system.category === "ammo";
    }

    isAmmo() {
        return ["ammo", "thrown"].includes(this.system.category);
    }

    isOrUsesAmmo() {
        return this.isRangedWeapon() || this.isAmmo();
    }

    usesItemAsAmmo(item) {
        return this !== item
            && ["ammo", "thrown"].includes(item.category)
            && this.system.usageCost.every(i => i.type === item.subCategory)
    }

    canWieldWith(item) {
        return !(this.isWeapon() && item.isWeapon())
            || (this.isWeapon()
                && item.isWeapon()
                && this != item
                && !(this.system.isTwoHanded || item.system.isTwoHanded));
    }

    delete() {
        if (this.type === "background" && this.actor) {
            this.system.removeBackgroundSkillImprovements(this.actor);
        }
        super.delete();
    }
}