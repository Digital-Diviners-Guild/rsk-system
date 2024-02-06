export const calculateUsedSlots = (items) =>
    items
        .filter(item => item.system.hasOwnProperty("maxStackSize"))
        .filter(item => !item.system.isEquipped)
        .reduce((acc, item) => {
            acc += Math.ceil(item.system.quantity / item.system.maxStackSize);
            return acc;
        }, 0) || 0;

export const canAddItem = (items, newItem) => {
    const maxSlots = 28;
    let neededSlots = 0;
    let existingItem = null;
    if (newItem.system.quantity && newItem.system.maxStackSize) {
        existingItem = items.find(item =>
            item.name === newItem.name &&
            item.type === newItem.type &&
            item.system.quantity < item.system.maxStackSize
        );
    }

    if (existingItem) {
        const totalStackSize = existingItem.system.quantity + newItem.system.quantity;
        const additionalSlotsNeeded =
            Math.ceil(totalStackSize / existingItem.system.maxStackSize)
            - Math.ceil(existingItem.system.quantity / existingItem.system.maxStackSize);
        neededSlots += additionalSlotsNeeded;
    } else if (!newItem.system.isEquipped) {
        neededSlots = Math.ceil(newItem.system.quantity / newItem.system.maxStackSize);
    }
    return {
        canAdd: calculateUsedSlots(items) + neededSlots <= maxSlots,
        usesExistingSlot: !!existingItem,
        existingItem
    }
};