export default class RSKMath {
    static clamp_value(val, opts) {
        const max = opts.max ?? val;
        const min = opts.min ?? val;
        if (val > max) return max;
        if (val < min) return min;
        return val;
    }
}