//todo: 'itemCollections' for starting gear packages
// piggy back off of inventory logic, but only have meta data about their objects.
// decide how we want to deal with that. or is falling back to 'quantity' good enough.
export const calculateStackSize = (item) =>
    typeof item.totalBulk === "function"
        ? item.system.quantity * item.totalBulk()
        : item.system.quantity;

export const calculateUsedSlots = (items) =>
    items
        .filter(item => item.system.hasOwnProperty("maxStackSize") && item.type !== "castable")
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
            item.name === newItem.name
            && item.img === newItem.img
            && item.type === newItem.type
            && calculateStackSize(item) < item.system.maxStackSize
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