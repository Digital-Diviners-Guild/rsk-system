export const fields = foundry.data.fields;

export const costField = { required: true, nullable: false, integer: true, initial: 0, min: 0, max: 10000 };
export const positiveNumberField = { nullable: false, integer: true, initial: 0, min: 0 };


export class AttackMethodField extends foundry.data.fields.StringField {
    constructor(options = {}) {
        super(options);
        this.allowedValues = [...Object.keys(CONFIG.RSK.attackMethods)];
    }

    validate(value) {
        if (!this.allowedValues.includes(value)) {
            throw new Error(`Invalid value: ${value}. Must be one of ${this.allowedValues.join(", ")}.`);
        }
        return super.validate(value);
    }
}
