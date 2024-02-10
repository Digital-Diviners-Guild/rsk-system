export const fields = foundry.data.fields;

export const costField = { required: true, nullable: false, integer: true, initial: 0, min: 0, max: 10000 };
export const positiveNumberField = { nullable: false, integer: true, initial: 0, min: 0 };

class AttackTypeField extends StringField {
    constructor(options = {}) {
        super(options);
        this.allowedValues = ["melee", "ranged", "thrown", "ammo"];
        this.name = `RSK.AttackTypes.${this.value}`;
    }

    validate(value) {
        if (!this.allowedValues.includes(value)) {
            throw new Error(`Invalid value: ${value}. Must be one of ${this.allowedValues.join(", ")}.`);
        }
        this.name = `RSK.AttackTypes.${value}`;
        return super.validate(value);
    }
}
