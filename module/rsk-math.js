export default class RSKMath {
    static clamp_value(val, opts) {
        if (val > opts.max ?? val) return max;
        if (val < opts.min ?? val) return min;
        return val;
    }
}