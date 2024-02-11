export const fields = foundry.data.fields;

export const costField = { required: true, nullable: false, integer: true, initial: 0, min: 0, max: 10000 };
export const positiveNumberField = { nullable: false, integer: true, initial: 0, min: 0 };
