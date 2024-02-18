//todo: the 'stacks'/'slots' are just the result division.
// though we probably do need 'slots' to be a more real concept
// in order to properly track which item to decrease/increase in qty

export const calculateStackSize = (item) => item.system.quantity * item.totalBulk();

export const calculateUsedSlots = (items) =>
    items
        .filter(item => item.system.hasOwnProperty("maxStackSize"))
        .filter(item => !item.system.isEquipped)
        .reduce((acc, item) => {
            acc += Math.ceil(calculateStackSize(item) / item.system.maxStackSize);
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
            calculateStackSize(item) < item.system.maxStackSize
        );
    }

    if (existingItem) {
        const totalStackSize = calculateStackSize(existingItem) + calculateStackSize(newItem);
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