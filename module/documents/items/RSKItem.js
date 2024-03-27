export default class RSKItem extends Item {
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
            && ["ammo", "thrown"].includes(item.system.category)
            && this.system.usageCost.every(i => i.type === item.system.subCategory)
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